import { serverSupabaseClient } from "@/app/_constants/supabase/server/client";
import { fetchWorkGroups } from "@/app/_constants/supabase/server/workGroupClient";
import { resInternalServerError, resSuccess } from "@/app/_constants/utils/apiUtils";
import { ApiResponse } from "@/app/_type/api";
import { WorkGroup } from "@/app/_type/data";
import { GetWorkGroupsData } from "@/app/_type/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest): Promise<NextResponse<ApiResponse<WorkGroup[]>>> {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    console.log("Timeline Request Type:", type);
    //TODO: typeを元に「最新」「作業中」「完了」でフィルタリングする
    const timelineData :GetWorkGroupsData[] = await fetchWorkGroups() as GetWorkGroupsData[];
    if (!timelineData) {
      return resInternalServerError("Failed to fetch timeline data");
    }
    // 一括でユーザ情報を取得(TODO: キャッシュに保持している場合はそちらを優先)
    const userIds: Set<string> = new Set(timelineData.map(data => data.user_id));
    const { data: userInfoList, error }
      = await serverSupabaseClient
        .from("user_info")
        .select("user_id, name, icon_image")
        .in("user_id", Array.from(userIds));

    if (error || !userInfoList) {
      return resInternalServerError("Failed to fetch user information");
    }
    //user_idをキーにしたマップを作成
    const userInfoMap = new Map<string, { id: string; name: string; iconImg: string }>();
    userInfoList.forEach(({ user_id, name, icon_image }) => {
      userInfoMap.set(user_id, { id: user_id, name, iconImg: icon_image ?? "" });
    });

    return resSuccess((timelineData as GetWorkGroupsData[]).map(group => ({
      id: group.group_id,
      userInfo: userInfoMap.get(group.user_id) ?? {
        id: group.user_id,
        name: "無名のユーザー",
        iconImg: "",
      },
      title: group.title ?? "無題の作業グループ",
      note: group.content ?? "",
      images: group.images ?? [],
      isClose: group.close_flag,
      updatedAt: group.update_datetime
    })));

  } catch (err: any) {
    return resInternalServerError(err.message ?? String(err));
  }
}