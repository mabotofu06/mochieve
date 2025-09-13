import { resSuccess, resUnauthorized, resValidationError } from "@/app/_constants/utils/apiUtils";
import { ApiResponse, SuccessResponse } from "@/app/_type/api";
import { UserInfo } from "@/app/_type/data";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

//サーバー側にユーザー情報をキャッシュする（簡易実装版、後々Redisなどへ移行）
//run dev だとサーバーに保存されるため疑似的に永続化されるが、vercelなどにデプロイした場合は各通信でインスタンスが異なり消えるのでredisへの移行を検討すること
const userCache = new Map<string, UserInfo>();

export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse<{ success: boolean }>>> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return resUnauthorized(cookieStore);
  }
  
  const { token, id, name, iconImg } = await req.json();
  userCache.set(accessToken, { id, name, iconImg });

  console.log("User cached:", { accessToken, id, name, iconImg });

  return resSuccess(cookieStore, { success: true });
}

export async function GET(req: NextRequest): Promise<NextResponse<SuccessResponse<UserInfo|null>>> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  console.log("Access Token:", accessToken?(accessToken.slice(0,10) + "..."):accessToken);

  if (!accessToken) {
    return resSuccess(cookieStore, null);
  }

  const userInfo = userCache.get(accessToken);
  if (!userInfo) return resSuccess(cookieStore, null);

  return resSuccess(cookieStore, userInfo);
}

export async function DELETE(req: NextRequest): Promise<NextResponse<ApiResponse<{ success: boolean }>>> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  console.log("Access Token:", accessToken?(accessToken.slice(0,10) + "..."):accessToken);

  if (!accessToken) return resValidationError(cookieStore, "Bad Request", "No access token provided");

  userCache.delete(accessToken);
  return resSuccess(cookieStore, { success: true });
}