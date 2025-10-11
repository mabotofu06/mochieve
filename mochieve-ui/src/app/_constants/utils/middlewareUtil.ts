import { NextRequest, NextResponse } from "next/server";
import { createLogger } from "./logger";

// DDoS対策: レート制限設定
export const RATE_LIMIT_CONFIG = {
  windowMs: 60 * 1000, // 1分間
  maxRequests: 60,     // 最大60リクエスト/分
  blockDuration: 5 * 60 * 1000 // 5分間ブロック
} as const;

// レート制限レコードの型定義
interface RateLimitRecord {
  count: number;
  resetTime: number;
  blocked?: number;
}

// レート制限チェック結果の型定義
export interface RateLimitResult {
  allowed: boolean;
  remainingRequests?: number;
}

// メモリベースのレート制限ストレージ（本番ではRedisを推奨）
const rateLimitStore = new Map<string, RateLimitRecord>();

/**
 * DDoS対策: IPベースのレート制限チェック
 * @param clientIP クライアントのIPアドレス
 * @returns レート制限チェック結果
 */
export function checkRateLimit(clientIP: string): RateLimitResult {
  const now = Date.now();
  const key = clientIP;
  const record = rateLimitStore.get(key);

  // ブロック中かチェック
  if (record?.blocked && now < record.blocked) {
    return { allowed: false };
  }

  // 初回アクセスまたはウィンドウリセット
  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + RATE_LIMIT_CONFIG.windowMs
    });
    return { allowed: true, remainingRequests: RATE_LIMIT_CONFIG.maxRequests - 1 };
  }

  // 制限超過チェック
  if (record.count >= RATE_LIMIT_CONFIG.maxRequests) {
    // ブロック設定
    rateLimitStore.set(key, {
      ...record,
      blocked: now + RATE_LIMIT_CONFIG.blockDuration
    });
    const logger = createLogger('MiddlewareUtil:checkRateLimit');
    logger.warn(`Rate limit exceeded for IP: ${clientIP}. Blocked for 5 minutes.`);
    return { allowed: false };
  }

  // カウンタ増加
  record.count += 1;
  rateLimitStore.set(key, record);
  return { allowed: true, remainingRequests: RATE_LIMIT_CONFIG.maxRequests - record.count };
}

/**
 * リクエストからクライアントIPアドレスを取得
 * @param request NextRequest オブジェクト
 * @returns クライアントIPアドレス
 */
export function getClientIP(request: NextRequest): string {
  return request.headers.get('x-forwarded-for') || 
         request.headers.get('x-real-ip') || 
         'unknown';
}

/**
 * レート制限エラーレスポンスを生成
 * @param clientIP ブロックされたクライアントIP
 * @returns レート制限情報（apiUtils.resTooManyRequestsで使用）
 */
export function getRateLimitInfo(clientIP: string) {
  return {
    clientIP,
    maxRequests: RATE_LIMIT_CONFIG.maxRequests
  };
}

/**
 * レート制限の統計情報を取得（デバッグ・監視用）
 * @returns レート制限の統計情報
 */
export function getRateLimitStats() {
  const now = Date.now();
  const activeRecords = Array.from(rateLimitStore.entries())
    .filter(([_, record]) => now < record.resetTime || (record.blocked && now < record.blocked))
    .length;
  
  return {
    totalIPs: rateLimitStore.size,
    activeIPs: activeRecords,
    config: RATE_LIMIT_CONFIG
  };
}