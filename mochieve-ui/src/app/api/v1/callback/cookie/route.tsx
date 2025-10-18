import { NextRequest, NextResponse } from 'next/server';
import { resInternalServerError, resSuccess, resUnauthorized } from '@/app/_constants/utils/apiUtils';
import { ApiResponse } from '@/app/_type/api';
import { cookies } from 'next/headers';
import { getUserInfoByToken } from '@/app/_constants/redis/client';
import { createLogger } from '@/app/_constants/utils/logger';

export async function GET(req: NextRequest): Promise<NextResponse<ApiResponse<any>>> {
  const cookie = await cookies();
  const logger = createLogger('API:CallbackCookie');

  const accessToken = cookie.get("accessToken")?.value;
  const refreshToken = cookie.get("refreshToken")?.value;

  logger.info("Token check", { hasAccessToken: !!accessToken, hasRefreshToken: !!refreshToken });

  const userInfo = await getUserInfoByToken(accessToken || "")
  if (!userInfo) {
    return resUnauthorized(cookie);
  }
  logger.info("User info retrieved via cookie callback", { userId: userInfo.id });
  return resSuccess(cookie, userInfo);
}