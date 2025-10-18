import { NextRequest, NextResponse } from 'next/server';
import { UserInfo } from '@/app/_type/data';
import { fetchUserInfoByUid } from '@/app/_constants/supabase/server/userInfoClient';
import { resInternalServerError, resSuccess, resUnauthorized } from '@/app/_constants/utils/apiUtils';
import { ApiResponse } from '@/app/_type/api';
import { decodeSupabaseJWT, setSessionCookie } from '@/app/_constants/utils/sessionUtils';
import { createLogger } from '@/app/_constants/utils/logger';
import { setUserInfoByToken } from '@/app/_constants/redis/client';
import { supabase } from '@/app/_constants/supabase/client';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse<UserInfo|null>>> {
  const cookie = await cookies();
  const logger = createLogger('API:CallbackAuth');
  try {
    const { refreshToken, accessToken } = await req.json();
    if (!refreshToken || !accessToken) {
      return resUnauthorized(cookie);
    }

    const jwt = decodeSupabaseJWT(accessToken);
    const uid = jwt.sub;
    logger.info("Auth UID", { uid });
    if (!uid) return resUnauthorized(cookie);

    const userInfoData = await fetchUserInfoByUid(supabase, uid??'');
    if (!userInfoData) {
      // ユーザ情報が取得できなかった場合、認証情報が不整合を起こしている可能性があるため認証された情報を削除
      // この処理で用いるsupabaseクライアント権限は高いため逐一環境変数から生成
      const roleSupabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || "",
        process.env.SUPABASE_SERVICE_ROLE_KEY || ""
      );
      // Supabaseから認証ユーザを削除
      const { data, error } = await roleSupabase.auth.admin.deleteUser(uid);
      if (error) {
        logger.error("ログイン時、登録されていないユーザーの認証情報削除に失敗しました", error);
      }
      logger.info("登録されていないユーザーの認証情報を削除しました", { uid });
      return resUnauthorized(cookie, "ユーザー情報が見つかりませんでした。ログインできるアカウントが登録されていない可能性があります。");
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
    logger.error("Error in auth callback", err);
    return resInternalServerError(cookie);
  }
}