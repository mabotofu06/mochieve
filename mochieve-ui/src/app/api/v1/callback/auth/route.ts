import { NextRequest, NextResponse } from 'next/server';
import { UserInfo } from '@/app/_type/data';
import { getAuthServerClient } from '@/app/_constants/supabase/server/client';
import { fetchUserInfoByUid } from '@/app/_constants/supabase/server/userInfoClient';
import { postFetch } from '@/app/_constants/fetch';
import { APP_HOST, BL_INFO } from '@/app/_constants/app';

export async function POST(req: NextRequest): Promise<NextResponse<{data:UserInfo|null}>> {
  try {
    const { refreshToken, accessToken } = await req.json();
    if (!refreshToken || !accessToken) {
      return NextResponse.json({data:null}, { status: 401 });
    }

    const supabase = getAuthServerClient(accessToken);
    const { data: userData, error } = await supabase.auth.getUser(accessToken);    
    if (error) {
      return NextResponse.json({data:null}, { status: 401 });
    }
    const uid = userData?.user?.id;
    const userInfo = await fetchUserInfoByUid(supabase, uid??'');

    console.log("User Data:", userData);
    // ユーザ情報取得後、アクセストークンをリフレッシュ
    const { data: refreshedSession, error: refreshError } = await supabase.auth.refreshSession({ refresh_token: refreshToken });
    if (refreshError || !refreshedSession?.session?.access_token) {
      return NextResponse.json({ data: null }, { status: 401 });
    }
    const newAccessToken = refreshedSession.session.access_token;
    const newRefreshToken = refreshedSession.session.refresh_token;

    //サーバサイドにアクセストークンでユーザ情報をキャッシュ
    await postFetch<{accessToken:string, id: string, name: string, iconImg: string}, {data: UserInfo}>(
      APP_HOST + BL_INFO.API_ENDPOINT.CACHE_USER_INFO,
      {
      accessToken: newAccessToken,
      name: userInfo?.name || "",
      id: userInfo?.user_id || "",
      iconImg: userInfo?.icon_image || "",
      },
      {
      headers: {
        Cookie: `accessToken=${newAccessToken}; refreshToken=${newRefreshToken}`
      }
      }
    );

    const response = NextResponse.json({
      data: {
        name: userInfo?.name || "",
        id: userInfo?.user_id || "",
        iconImg: userInfo?.icon_image || "",
      }});
    response.cookies.set('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 3 // 3 days
    });
    response.cookies.set('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30 // 30 days
    });

    return response;

  } catch (err: any) {
    console.error("Error in auth callback:", err);
    return NextResponse.json({ data: null }, { status: 500 });
  }
}

export const runtime = 'edge';