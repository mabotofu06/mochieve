import { NextRequest, NextResponse } from 'next/server';
import { UserInfo } from '@/app/_type/data';
import { fetchUserInfoByUid } from '@/app/_constants/supabase/server/userInfoClient';
import { resInternalServerError, resSuccess, resUnauthorized } from '@/app/_constants/utils/apiUtils';
import { ApiResponse } from '@/app/_type/api';
import { decodeSupabaseJWT, setSessionCookie } from '@/app/_constants/utils/sessionUtils';
import { setUserInfoByToken } from '@/app/_constants/redis/client';
import { supabase } from '@/app/_constants/supabase/client';

export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse<UserInfo|null>>> {
  try {
    const { refreshToken, accessToken } = await req.json();
    if (!refreshToken || !accessToken) {
      return resUnauthorized();
    }

    const jwt = decodeSupabaseJWT(accessToken);
    const uid = jwt.sub;
    console.log("Auth UID:", uid);
    if (!uid) return resUnauthorized();

    const userInfoData = await fetchUserInfoByUid(supabase, uid??'');
    if (!userInfoData) {
      return resUnauthorized();
    }
    const userInfo: UserInfo = {
      id       : userInfoData.user_id,
      name     : userInfoData.name,
      iconImg  : userInfoData.icon_image,
    }

    // Redisキャッシュを更新
    await setUserInfoByToken(accessToken, userInfo);

    const response = resSuccess(userInfo);
    return setSessionCookie(response, accessToken, refreshToken);
  } catch (err: any) {
    console.error("Error in auth callback:", err);
    return resInternalServerError();
  }
}