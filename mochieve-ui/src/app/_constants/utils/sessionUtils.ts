import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { supabaseKey, supabaseUrl } from "../supabase/client";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { getUserInfoByToken, setUserInfoByToken } from "../redis/client";
import { UserInfo } from "@/app/_type/data";
import { fetchUserInfoByUid } from "../supabase/userClient";

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

  return getNewToken(refreshToken);
}

export const getNewToken = async (refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> => {
  if (!refreshToken) throw new Error("No refresh token found");

  const response = await fetch(
    `${supabaseUrl}/auth/v1/token?grant_type=refresh_token`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: supabaseKey,
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
  
export const getNewTokenAndSetRedis = async (refreshToken: string): Promise<{ accessToken: string; refreshToken: string; userInfo: UserInfo } | null> => {
  const newToken = await getNewToken(refreshToken);
  const uid = decodeSupabaseJWT(newToken.accessToken)?.sub;
  if (!uid) return null;
  const userInfoData = await fetchUserInfoByUid(uid);
  if(!userInfoData) return null;
  const userInfo: UserInfo = {
    id: userInfoData.user_id,
    name: userInfoData.name,
    iconImg: userInfoData.icon_image,
  };
  await setUserInfoByToken(newToken.accessToken, userInfo);
  return { ...newToken, userInfo };
}

/**
 * Cookieから有効なアクセストークンとリフレッシュトークンを取得する\
 * アクセストークンが期限切れまたは存在しない場合、リフレッシュトークンで新規取得する\
 * 取得したアクセストークンでRedisからユーザ情報を取得し、存在しない場合はSupabaseから取得してRedisにセットする
 * @param cookie 
 * @returns 
 */
export const getValidTokenFromCookie
= async (cookie: ReadonlyRequestCookies): Promise<{ accessToken: string; refreshToken: string; userInfo: UserInfo } | null> => {
  const accessToken = cookie.get("accessToken")?.value;
  const refreshToken = cookie.get("refreshToken")?.value;
  // リフレッシュトークン存在チェック
  if (!refreshToken) return null;

  // アクセストークンが存在しない場合、新規取得してユーザ情報もセット
  if(!accessToken){
    console.warn("アクセストークンが存在しませんでしたが、リフレッシュトークンが存在したため新規取得します");
    return await getNewTokenAndSetRedis(refreshToken);
  }

  //アクセストークンが存在した場合、まず有効期限チェック
  const jwtObj = jwt.decode(accessToken) as any;
  if (!jwtObj || !jwtObj.exp) return null;

  const now = Math.floor(Date.now() / 1000);
  if (jwtObj.exp <= now){
    console.warn("アクセストークンの有効期限が切れています。リフレッシュトークンで更新します");
    return await getNewTokenAndSetRedis(refreshToken);
  }

  //ユーザ情報取得（Redisキャッシュから）
  let userInfo: UserInfo | null = await getUserInfoByToken(accessToken);
  if (!userInfo){
    console.warn("Redisにユーザ情報が存在しませんでしたが、アクセストークンが有効だったため更新します");
    // Redisキャッシュにユーザ情報がない場合、Supabaseから取得してキャッシュにセット
    const decoded = decodeSupabaseJWT(accessToken);
    if (!decoded || !decoded.sub) return null;
    const userInfoData = await fetchUserInfoByUid(decoded.sub);
    if(!userInfoData) return null;
    //ユーザ情報を取得
    userInfo = {
      id: userInfoData.user_id,
      name: userInfoData.name,
      iconImg: userInfoData.icon_image,
    };
  }

  //リフレッシュトークンでアクセストークンを更新
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


//TODO:リクエストの度にセッションの有効期限を延長するようにする
/**
 * NextResponseにセッションクッキーをセットする
 * @param response NextResponseオブジェクト
 * @param accessToken アクセストークン
 * @param refreshToken リフレッシュトークン
 * @returns 
 */
export const setSessionCookie = <T>(response: NextResponse<T>, accessToken: string, refreshToken: string): NextResponse<T> => {
  if (accessToken) {
    response.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60, // 1 hour
    });
  }
  if (refreshToken) {
    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 14, // 14 days(2 weeks)
    });
  }
  return response;
};
