import { supabase } from "@/app/_constants/supabase/client";
import { resInternalServerError, resSuccess, resValidationError } from "@/app/_constants/utils/apiUtils";
import { ApiResponse } from "@/app/_type/api";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { createLogger } from "@/app/_constants/utils/logger";

export async function GET(req: NextRequest): Promise<NextResponse<ApiResponse<any>>> {
  const logger = createLogger('API:UserCheck');
  logger.info("GET /api/v1/user/check");
  const cookie = await cookies();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("user_id");

  if(!userId) {
    return resValidationError(cookie, "ユーザIDが指定されていません");
  }
  logger.info("Checking user_id", { userId });

  // ユーザIDが登録されていないかチェック
  const { count: userIdCount, error: userIdError } = await supabase
    .from("user_info")
    .select('*', { count: 'exact', head: true })
    .eq("user_id", userId);

  if (userIdError) {
    logger.error("Failed to retrieve user ID", userIdError);
    return resInternalServerError(cookie, "ユーザIDチェック中にエラーが発生しました");
  }
  // 登録されていないuserIdの場合Count === nullの場合0を返す
  if(userIdCount && userIdCount > 0) {
    return resValidationError(cookie, `ユーザID ${userId} はすでに存在します`);
  }

  return resSuccess(cookie, "success");
}