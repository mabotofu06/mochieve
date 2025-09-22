import { CACHE_INFO } from "@/app/_constants/app";
import { supabase } from "@/app/_constants/supabase/client";
import { resInternalServerError, resSuccess, resUnauthorized, resValidationError } from "@/app/_constants/utils/apiUtils";
import { ApiResponse } from "@/app/_type/api";
import { WorkGroup } from "@/app/_type/data";
import { GetWorkGroupsData } from "@/app/_type/supabase";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getValidTokenFromCookie } from "@/app/_constants/utils/sessionUtils";

type Params = {
  params: Promise<{ user_id: string }>;
}

export async function GET(req: NextRequest,   { params }: Params ): Promise<NextResponse<ApiResponse<WorkGroup[]>>> {
  console.log("===== GET /api/v1/work/[user_id] =====");
  const userId = (await params).user_id;
  const cookie = await cookies();
  if(!userId) {
    return resValidationError(cookie, "userIdが指定されていません");
  }

  const { searchParams } = new URL(req.url);
  // タイムライン取得期間(単位: ミリ秒)
  const period: number = Number(searchParams.get("period") ?? 0);
  const datetime = period !== 0
      ? new Date(period)
      : new Date();

  const result
    = await supabase
      .from("work_group")
      .select("*")
      .eq("user_id", userId)
      .eq("delete_flag", false)
      .lt("update_datetime", datetime.toISOString())
      .order("update_datetime", { ascending: false })
      .limit(CACHE_INFO.MY_WORKS_DATA.MAX_SIZE);

  if(result.error || !result.data) {
    return resInternalServerError(cookie);
  }

    // 一括でユーザ情報を取得(TODO: キャッシュに保持している場合はそちらを優先)
  const userIds: Set<string> = new Set(result.data.map(data => data.user_id));
  const { data: userInfoList, error }
    = await supabase
      .from("user_info")
      .select("user_id, name, icon_image")
      .in("user_id", Array.from(userIds));

    if (error || !userInfoList) {
      return resInternalServerError(cookie, "Failed to fetch user information");
    }
    //user_idをキーにしたマップを作成
    const userInfoMap = new Map<string, { id: string; name: string; iconImg: string }>();
    userInfoList.forEach(({ user_id, name, icon_image }) => {
      userInfoMap.set(user_id, { id: user_id, name, iconImg: icon_image ?? "" });
    });

  const myGroupData: GetWorkGroupsData[] = result.data as GetWorkGroupsData[];
  const groups: WorkGroup[]
    = myGroupData.map(item => ({
        id        : item.group_id,
        title     : item.title || "",
        note      : item.content || "",
        images    : item.images,
        userInfo  : userInfoMap.get(item.user_id) || {
          id: "",
          name: "",
          iconImg: ""
        },
        isClose   : item.close_flag,
        updatedAt : item.update_datetime,
      }));

  return resSuccess<WorkGroup[]>(cookie, groups);
}