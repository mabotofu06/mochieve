import { NextRequest, NextResponse } from "next/server";
import { getNewTokenAndSetRedis, setSessionCookie } from "./app/_constants/utils/sessionUtils";
import { checkRateLimit, getClientIP, getRateLimitInfo } from "./app/_constants/utils/middlewareUtil";
import { resTooManyRequests } from "./app/_constants/utils/apiUtils";
import { cookies } from "next/headers";

export async function middleware(request: NextRequest) {
  // DDoS対策: レート制限チェック
  const clientIP = getClientIP(request);
  const rateLimitResult = checkRateLimit(clientIP);
  
  if (!rateLimitResult.allowed) {
    const cookie = await cookies();
    const rateLimitInfo = getRateLimitInfo(clientIP);
    return resTooManyRequests(cookie, rateLimitInfo.clientIP, rateLimitInfo.maxRequests);
  }

  if(request.nextUrl.pathname === "/api/v1/logout") {
    console.log("スキップ対象のリクエストのためミドルウェアをスキップします")
    return NextResponse.next();
  }
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  //アクセストークンがなく、リフレッシュトークンがあった場合は再取得
  if(!accessToken && refreshToken){
    console.log("アクセストークンが存在しないためリフレッシュトークンから再取得を試みます")
    const newToken = await getNewTokenAndSetRedis(refreshToken);
    console.log("新しいアクセストークンを取得しました:", newToken);

    if(newToken){
      const response = NextResponse.next();
      setSessionCookie(response, newToken.accessToken, newToken.refreshToken);
      return response;
    }
  }

  return NextResponse.next();
}

// 適用するパスを指定
export const config = {
  matcher: ["/api/v1/:path*"],
};