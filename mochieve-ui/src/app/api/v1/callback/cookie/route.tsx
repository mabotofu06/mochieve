import { NextRequest, NextResponse } from 'next/server';
import { resInternalServerError, resSuccess, resUnauthorized } from '@/app/_constants/utils/apiUtils';
import { ApiResponse } from '@/app/_type/api';
import { cookies } from 'next/headers';
import { getUserInfoByToken } from '@/app/_constants/redis/client';

export async function GET(req: NextRequest): Promise<NextResponse<ApiResponse<any>>> {
  const cookie = await cookies();

  const accessToken = cookie.get("accessToken")?.value;
  const refreshToken = cookie.get("refreshToken")?.value;

  console.log("Access Token:", accessToken);
  console.log("Refresh Token:", refreshToken);

  const userInfo = await getUserInfoByToken(accessToken || "")
  if (!userInfo) {
    return resUnauthorized(cookie);
  }
  console.log("User info retrieved via cookie callback:", userInfo);
  return resSuccess(cookie, userInfo);
}