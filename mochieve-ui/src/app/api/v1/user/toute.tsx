import { supabase } from "@/app/_constants/supabase/client";
import { resSuccess, resValidationError } from "@/app/_constants/utils/apiUtils";
import { ApiResponse } from "@/app/_type/api";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

interface PostUserBody {
  uid: string;
  userId: string;
  userName: string;
  iconImgUrl: string;
}

/**
 * ユーザ新規登録API
 * @param req 
 * @returns 
 */
export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse<any>>> {
  // Handle POST request
  const cookie = await cookies();
  const reqBody: PostUserBody = await req.json();

  if(!reqBody.uid || !reqBody.userId || !reqBody.userName || !reqBody.iconImgUrl) {
    return resValidationError(cookie);
  }

  const userInfo = {
    uid: reqBody.uid,
    user_id: reqBody.userId,
    user_name: reqBody.userName,
    icon_img_url: reqBody.iconImgUrl,
  }

  const { data, error }
    = await supabase//TODO: 認証されたクライアントに変更
      .from('user_info')
      .insert(userInfo);

  if (error) {
    console.error("User insert error:", error);
    return resValidationError(cookie, "ユーザ登録に失敗しました", error.message);
  }

  // ユーザ登録成功時の処理
  return resSuccess(cookie, { result: "OK", user: data });
}
