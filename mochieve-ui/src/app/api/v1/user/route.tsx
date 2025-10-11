import { supabase } from "@/app/_constants/supabase/client";
import { getAuthServerClient } from "@/app/_constants/supabase/server/client";
import { resSuccess, resValidationError } from "@/app/_constants/utils/apiUtils";
import { ApiResponse } from "@/app/_type/api";
import { UserCreateData } from "@/app/_type/data";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { createLogger } from "@/app/_constants/utils/logger";

/**
 * ユーザ新規登録API\
 * user_infoテーブルにユーザ情報を登録し、invite_infoテーブルを更新する
 * @param req 
 * @returns 
 */
export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse<any>>> {
  // Handle POST request
  const cookie = await cookies();
  const logger = createLogger('API:User');
  const reqBody: UserCreateData = await req.json();

  if(!reqBody.token || !reqBody.uid || !reqBody.userId || !reqBody.userName || !reqBody.iconImgUrl || !reqBody.inviteCode) {
    return resValidationError(cookie, "必要な情報が不足しています");
  }

  const userInfo = {
    uid: reqBody.uid,
    userId: reqBody.userId,
    userName: reqBody.userName,
    iconImgUrl: reqBody.iconImgUrl,
    createDatetime: new Date().toISOString(),
    updateDatetime: new Date().toISOString(),
    deleteFlag: false,
    deleteDatetime: null
  }

  //TODO:uidの重複チェック
  const existingUser = await supabase
    .from("user_info")
    .select("auth_id")
    .eq("uid", userInfo.uid)
    .single();

  if (existingUser.data) {
    return resValidationError(cookie, "このユーザはすでに登録されています");
  }

  const authedClient = getAuthServerClient(reqBody.token);

  // トランザクション処理でユーザ登録と招待コードの更新を行う
  // 認証が必須
  const { error: rpcError } = await authedClient.rpc(
    "create_user_and_update_invite", {
    p_invite_code: reqBody.inviteCode,
    p_uid: userInfo.uid,
    p_user_id: userInfo.userId,
    p_user_name: userInfo.userName,
    p_icon_img: userInfo.iconImgUrl,
  });

  if (rpcError) {
    logger.error("User insert error", rpcError);
    return resValidationError(cookie, "ユーザ登録に失敗しました", rpcError.message);
  }

  // ユーザ登録成功時の処理
  return resSuccess(cookie, { result: "OK", user: userInfo });
}
