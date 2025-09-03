import { UserInfo } from "@/app/_type/data";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

//サーバー側にユーザー情報をキャッシュする（簡易実装版、後々Redisなどへ移行）
const userCache = new Map<string, UserInfo>();

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  const { token, id, name, iconImg } = await req.json();
  userCache.set(accessToken, { id, name, iconImg });

  console.log("User cached:", { accessToken, id, name, iconImg });

  return NextResponse.json({ success: true });
}

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  console.log("Access Token:", accessToken);

  if (!accessToken) {
    return NextResponse.json(
      { data: null },
      { status: 200 }
    );
  }

  const userInfo = userCache.get(accessToken);
  if (!userInfo) return NextResponse.json({ data: null }, { status: 200 });

  return NextResponse.json(userInfo);
}

export async function DELETE(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');
  if (!token) return NextResponse.json({ error: 'Token required' }, { status: 400 });

  userCache.delete(token);
  return NextResponse.json({ success: true });
}