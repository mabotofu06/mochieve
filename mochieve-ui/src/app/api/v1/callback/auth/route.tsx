import { NextRequest, NextResponse } from 'next/server';
import { UserInfo } from '@/app/_type/data';
import { fetchUserInfoByUid } from '@/app/_constants/supabase/server/userInfoClient';
import { resInternalServerError, resSuccess, resUnauthorized } from '@/app/_constants/utils/apiUtils';
import { ApiResponse } from '@/app/_type/api';
import { decodeSupabaseJWT, setSessionCookie } from '@/app/_constants/utils/sessionUtils';
import { setUserInfoByToken } from '@/app/_constants/redis/client';
import { supabase } from '@/app/_constants/supabase/client';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse<UserInfo|null>>> {
  const cookie = await cookies();
  try {
    const { refreshToken, accessToken } = await req.json();
    if (!refreshToken || !accessToken) {
      return resUnauthorized(cookie);
    }

    const jwt = decodeSupabaseJWT(accessToken);
    const uid = jwt.sub;
    console.log("Auth UID:", uid);
    if (!uid) return resUnauthorized(cookie);

    const userInfoData = await fetchUserInfoByUid(supabase, uid??'');
    if (!userInfoData) {
      const roleSupabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || "",
        process.env.SUPABASE_SERVICE_ROLE_KEY || ""
      );
      // ユーザ情報が取得できなかった場合、認証情報が不整合を起こしている可能性があるため
      // Supabaseから認証ユーザを削除
      const { error } = await roleSupabase.auth.admin.deleteUser(uid);
      if (error) {
        console.error("Error deleting user from Supabase:", error);
      }
      return resUnauthorized(cookie);
    }
    const userInfo: UserInfo = {
      id       : userInfoData.user_id,
      name     : userInfoData.name,
      iconImg  : userInfoData.icon_image,
    }

    // Redisキャッシュを更新
    await setUserInfoByToken(accessToken, userInfo);

    const response = resSuccess(cookie, userInfo);
    return setSessionCookie(response, accessToken, refreshToken);
  } catch (err: any) {
    console.error("Error in auth callback:", err);
    return resInternalServerError(cookie);
  }
}