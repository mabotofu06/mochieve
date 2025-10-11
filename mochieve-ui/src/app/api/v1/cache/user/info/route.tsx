import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAuthedUserFromCookie, resSuccess, resUnauthorized } from "@/app/_constants/utils/apiUtils";
import { ApiResponse } from "@/app/_type/api";
import { UserInfo } from "@/app/_type/data";

/**
 * ユーザー情報取得API（認証済みユーザーのみ）
 * Cookieからアクセストークンを取得し、Redisからユーザー情報を返す
 * @param req 
 * @returns 
 */
export async function GET(req: NextRequest): Promise<NextResponse<ApiResponse<UserInfo>>> {
  const cookie = await cookies();
  
  // 認証確認（必須）
  const userInfo = await getAuthedUserFromCookie(cookie);
  if (!userInfo) {
    return resUnauthorized(cookie, "認証が必要です", "アクセストークンが無効またはログインが必要です");
  }

  // 認証済みユーザー情報を返却
  return resSuccess(cookie, userInfo, "ユーザー情報を取得しました");
}