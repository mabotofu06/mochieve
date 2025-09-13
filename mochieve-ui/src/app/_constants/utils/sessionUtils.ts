import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { supabaseUrl } from "../supabase/client";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { getUserInfoByToken, setUserInfoByToken } from "../redis/client";
import { UserInfo } from "@/app/_type/data";

export const decodeSupabaseJWT = (token: string) => {
  // SupabaseのJWTは公開鍵不要でデコード可能（署名検証は不要ならsecret不要）
  return jwt.decode(token) as any;
}

export const getJwtFromCookie = (cookie: ReadonlyRequestCookies): any | null => {
  const accessToken = cookie.get("accessToken")?.value;

  if(!accessToken) return null;

  return jwt.decode(accessToken) as any;
}

export const isTokenExpiredFromCookie = (cookie: ReadonlyRequestCookies): boolean => {
  const jwt = getJwtFromCookie(cookie);
  if (!jwt || !jwt.exp) return false;
  const now = Math.floor(Date.now() / 1000);
  return jwt.exp < now;
}

export const refreshAccessToken = async (cookie: ReadonlyRequestCookies)
: Promise<{accessToken: string, refreshToken: string}> => {
  const refreshToken = cookie.get("refreshToken")?.value;
  if (!refreshToken) throw new Error("No refresh token found");

  const response = await fetch(
    `${supabaseUrl}/auth/v1/token?grant_type=refresh_token`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: process.env.SUPABASE_ANON_KEY!,
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    }
  );

  if (!response.ok) throw new Error("Failed to refresh access token");

  const data = await response.json();
  if(!data.access_token || !data.refresh_token) {
    throw new Error("Invalid token response");
  }

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
  };
}

/**
 * Cookieのバリデーションチェック（存在チェック、有効期限チェック）
 * @param cookie 
 * @returns 
 */
export const checkCookieValidation = (cookie: ReadonlyRequestCookies): boolean => {
  const accessToken = cookie.get("accessToken")?.value;
  const refreshToken = cookie.get("refreshToken")?.value;

  // トークン存在チェック
  if (!accessToken || !refreshToken) return false;

  const jwtObj = jwt.decode(accessToken) as any;
  if (!jwtObj || !jwtObj.exp) return false;

  //有効期限チェック
  const now = Math.floor(Date.now() / 1000);
  return jwtObj.exp > now;
};

/**
 * Cookieから有効なアクセストークンとリフレッシュトークンを取得する\
 * アクセストークンが期限切れの場合、nullを返す
 * @param cookie 
 * @returns 
 */
export const getValidTokenFromCookie
= async (cookie: ReadonlyRequestCookies): Promise<{ accessToken: string; refreshToken: string; userInfo: UserInfo } | null> => {
  const accessToken = cookie.get("accessToken")?.value;
  const refreshToken = cookie.get("refreshToken")?.value;

  // トークン存在チェック
  if (!accessToken || !refreshToken) return null;
  const jwtObj = jwt.decode(accessToken) as any;
  if (!jwtObj || !jwtObj.exp) return null;

  //ユーザ情報取得（Redisキャッシュから）
  const userInfo = await getUserInfoByToken(accessToken);
  if (!userInfo) return null;

  //supabase認証有効期限チェック
  const now = Math.floor(Date.now() / 1000);
  if (jwtObj.exp > now){
    return { accessToken, refreshToken, userInfo }
  }

  //アクセストークン期限切れの場合、リフレッシュトークンで更新
  try {
    const newTokens = await refreshAccessToken(cookie);
    // Redisキャッシュを新しい情報で更新
    await setUserInfoByToken(newTokens.accessToken, userInfo);

    return { ...newTokens, userInfo };
  } catch (error) {
    console.error("Error refreshing access token:", error);
  }
  return null;
};

/**
 * NextResponseにセッションクッキーをセットする
 * @param response NextResponseオブジェクト
 * @param accessToken アクセストークン
 * @param refreshToken リフレッシュトークン
 * @returns 
 */
export const setSessionCookie = <T>(response: NextResponse<T>, accessToken: string, refreshToken: string): NextResponse<T> => {
  response.cookies.set("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60, // 1 hour
  });
  response.cookies.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 14, // 14 days(2 weeks)
  });
  return response;
};
