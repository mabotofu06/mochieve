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
    return resUnauthorized();
  }
  
  const { token, id, name, iconImg } = await req.json();
  userCache.set(accessToken, { id, name, iconImg });

  console.log("User cached:", { accessToken, id, name, iconImg });

  return resSuccess({ success: true });
}

export async function GET(req: NextRequest): Promise<NextResponse<SuccessResponse<UserInfo|null>>> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  console.log("Access Token:", accessToken);

  if (!accessToken) {
    return resSuccess(null);
  }

  const userInfo = userCache.get(accessToken);
  if (!userInfo) return resSuccess(null);

  return resSuccess(userInfo);
}

export async function DELETE(req: NextRequest): Promise<NextResponse<ApiResponse<{ success: boolean }>>> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  console.log("Access Token for deletion:", accessToken);

  if (!accessToken) return resValidationError("Bad Request", "No access token provided");

  userCache.delete(accessToken);
  return resSuccess({ success: true });
}