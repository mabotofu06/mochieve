import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAuthedUserFromCookie, resSuccess, resUnauthorized } from "@/app/_constants/utils/apiUtils";
import { ApiResponse } from "@/app/_type/api";
import { AuthUserInfo } from "@/app/_type/data";

/**
 * 認証情報取得API（認証済みユーザーのみ）
 * Cookieからアクセストークンを取得し、認証状態を確認
 * @param req 
 * @returns 
 */
export async function GET(req: NextRequest): Promise<NextResponse<ApiResponse<{ isAuthenticated: boolean; userId?: string }>>> {
  const cookie = await cookies();
  
  // 認証確認
  const userInfo = await getAuthedUserFromCookie(cookie);
  
  if (!userInfo) {
    // 未認証の場合も情報を返す（エラーではない）
    return resSuccess(cookie, { 
      isAuthenticated: false 
    }, "未認証状態です");
  }

  // 認証済みの場合
  return resSuccess(cookie, {
    isAuthenticated: true,
    userId: userInfo.id
  }, "認証済み状態です");
}