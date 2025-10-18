import { VALIDATION_LENGTH } from "@/app/_constants/app";
import { supabase } from "@/app/_constants/supabase/client";
import { getAuthedUserFromCookie, resUnauthorized, resSuccess, resInternalServerError } from "@/app/_constants/utils/apiUtils";
import { createLogger } from "@/app/_constants/utils/logger";
import { ApiResponse } from "@/app/_type/api";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest): Promise<NextResponse<ApiResponse<boolean>>> {
  const logger = createLogger('API:Work:Group:Check');
  logger.info("GET /api/v1/work/group/check");

  const cookie = await cookies();
  const userInfo = await getAuthedUserFromCookie(cookie);
  if (!userInfo){
    return resUnauthorized(cookie, "認証エラー", "ユーザが認証されていませんでした。再ログインしてください。");
  }

  // クローズしていない投稿数が3個を超えていないかチェック
  const { count: openGroupNum, error: openGroupError } = await supabase
    .from("work_group")
    .select('count', { count: 'exact' })
    .eq("user_id", userInfo.id)
    .eq("delete_flag", false)
    .eq("close_flag", false);

  if (openGroupError && !openGroupNum) {
    logger.error("Failed to retrieve open groups:", openGroupError);
    return resInternalServerError(cookie, "Failed to retrieve open groups");
  }
  if (openGroupNum && openGroupNum >= VALIDATION_LENGTH.WORK_GROUP.ON_WORKING.MAX) {
    return resSuccess(cookie, false);
  }

  return resSuccess(cookie, true);
}
