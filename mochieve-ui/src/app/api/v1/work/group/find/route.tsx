import { supabase } from "@/app/_constants/supabase/client";
import { fetchUserInfoByUserId } from "@/app/_constants/supabase/userClient";
import { resInternalServerError, resNotFound, resSuccess, resValidationError } from "@/app/_constants/utils/apiUtils";
import { ApiResponse } from "@/app/_type/api";
import { WorkGroup } from "@/app/_type/data";
import { GetWorkGroupsData } from "@/app/_type/supabase";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

/**
 * 特定のGroupIDでWorkGroupを取得するAPI
 * @param req 
 * @returns 
 */
export async function GET(req: NextRequest): Promise<NextResponse<ApiResponse<WorkGroup>>> {
  console.log("===== GET /api/v1/work/group/find =====");
  const cookie = await cookies();

  const { searchParams } = new URL(req.url);
  const groupId = searchParams.get("groupId");
  if (!groupId) {
    return resValidationError(cookie, "Invalid parameter", "groupId is required");
  }

  // 特定のワークグループを取得
  const { data: workGroupData, error: workGroupError } = await supabase
    .from("work_group")
    .select("*")
    .eq("group_id", groupId)
    .eq("delete_flag", false)
    .single();

  if (workGroupError || !workGroupData) {
    console.error("Failed to retrieve work group:", workGroupError);
    return resNotFound(cookie, "Work group not found");
  }

  const workGroupItem = workGroupData as GetWorkGroupsData;

  console.log("Retrieved Work Group:", workGroupItem);

  // ユーザー情報を取得（userClient.tsの関数を使用）
  console.log(`Fetching user info for user: ${workGroupItem.user_id} from Supabase`);

  try {
    const userInfo = await fetchUserInfoByUserId(workGroupItem.user_id);
    if (!userInfo) {
      console.error("User information not found for user_id:", workGroupItem.user_id);
      return resInternalServerError(cookie, "Failed to fetch user information");
    }

    // WorkGroup形式に変換
    const workGroup: WorkGroup = {
      id: workGroupItem.group_id,
      userInfo: {
        id: workGroupItem.user_id,
        name: userInfo.name || "不明なユーザー",
        iconImg: userInfo.icon_image ?? "",
      },
      title: workGroupItem.title ?? "",
      note: workGroupItem.content ?? "",
      images: workGroupItem.images ?? [],
      isClose: workGroupItem.close_flag,
      updatedAt: workGroupItem.update_datetime,
    };

    return resSuccess(cookie, workGroup);
  } catch (error) {
    console.error("Failed to fetch user information:", error);
    return resInternalServerError(cookie, "Failed to fetch user information");
  }
}