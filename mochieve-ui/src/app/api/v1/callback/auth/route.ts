import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { serverSupabaseClient } from '@/app/_constants/supabase/server/client';
import { UserInfo } from '@/app/_type/data';
import { fetchUserInfoByUid } from '@/app/_constants/supabase/userClient';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });

export async function POST(req: NextRequest): Promise<NextResponse<{data:UserInfo|null}>> {
  try {
    const { refreshToken, accessToken } = await req.json();

    console.log("Refresh Token:", refreshToken);
    console.log("Access Token:", accessToken);

    //TODO:このまま使い続けるのはリスキーな可能性あるためアクセストークンを再発行する
    const { data: userData, error } = await supabase.auth.getUser(accessToken);
    const uid = userData?.user?.id;
    const userInfo = await fetchUserInfoByUid(uid??'');

    if (error) {
      return NextResponse.json({data:null}, { status: 401 });
    }

    console.log("User Data:", userData);

    const response = NextResponse.json({
      data: {
        name: userInfo?.name,
        id: userInfo?.user_id || "",
        iconImg: userInfo?.icon_image || "",
      }});
    response.cookies.set('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 3 // 3 days
    });
    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30 // 30 days
    });

    return response;

  } catch (err: any) {
    return NextResponse.json({ data: null }, { status: 500 });
  }
}

export const runtime = 'edge';