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
    //TODO: user_idを元にユーザ情報を付加して返す
    const timelineData = await fetchWorkGroups();
    const userInfoMap = new Map<string, { id: string; name: string; iconImg: string }>();

    if (!timelineData) {
      return resInternalServerError("Failed to fetch timeline data");
    }

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