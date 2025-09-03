import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { serverSupabaseClient } from '@/app/_constants/supabase/server/client';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });

export async function POST(req: NextRequest) {
  try {
    const { refreshToken, accessToken } = await req.json();

    console.log("Refresh Token:", refreshToken);
    console.log("Access Token:", accessToken);

    //TODO:このまま使い続けるのはリスキーな可能性あるためアクセストークンを再発行する
    const { data: userData, error } = await supabase.auth.getUser(accessToken);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    console.log("User Data:", userData);

    const response = NextResponse.redirect("http://localhost:3000/Top");
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

    // if (!code) {
    //   return NextResponse.json({ error: 'Missing code parameter' }, { status: 400 });
    // }

    // const redirectTo = process.env.NEXT_PUBLIC_AUTH_REDIRECT || '/';
    // const redirectUrl = new URL(redirectTo, req.url).toString();

    // return NextResponse.redirect(redirectUrl);
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? String(err) }, { status: 500 });
  }
}

export const runtime = 'edge';