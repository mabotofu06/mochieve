import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;

    console.log("Search Params:", searchParams);

    const {data: user} = await supabase.auth.getUser();
    console.log("OAuth Data:", JSON.stringify(user));
    
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    return NextResponse.redirect("http://localhost:3000/Top");

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