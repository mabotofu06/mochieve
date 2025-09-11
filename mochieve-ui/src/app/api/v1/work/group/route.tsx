import { CACHE_INFO, TOP_NAV_MENU } from "@/app/_constants/app";
import { supabase } from "@/app/_constants/supabase/client";
import { getAuthServerClient } from "@/app/_constants/supabase/server/client";
import { getAuthedUserFromCookie, resInternalServerError, resSuccess, resUnauthorized, resValidationError } from "@/app/_constants/utils/apiUtils";
import { ApiResponse } from "@/app/_type/api";
import { WorkGroup } from "@/app/_type/data";
import { GetWorkGroupsData } from "@/app/_type/supabase";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

/**
 * 作業グループ取得API
 * @param req 
 * @returns 
 */
export async function GET(req: NextRequest): Promise<NextResponse<ApiResponse<WorkGroup[]>>> {
  // Handle GET request
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const baseQuery
    = supabase
        .from("work_group")
        .select("*")
        .eq("delete_flag", false)
        .order("update_datetime", { ascending: false })
        .limit(CACHE_INFO.TIMELINE_DATA.MAX_SIZE);

  let supabaseResult = await baseQuery;

  //TODO:キャッシュでの保持に合わせてフィルタリングの処理は再考
  // switch(type){
  //   case TOP_NAV_MENU.WORKING.code.toString():
  //     console.log("Fetching working posts");
  //     supabaseResult = await baseQuery.eq("close_flag", false);
  //     break;
  //   case TOP_NAV_MENU.DONE.code.toString():
  //     console.log("Fetching done posts");
  //     supabaseResult = await baseQuery.eq("close_flag", true);
  //     break;
  //   default:
  //     console.log("Fetching today's posts");
  //     const today = new Date();
  //     today.setHours(0, 0, 0, 0);
  //     const isoToday = today.toISOString();
  //     supabaseResult = await baseQuery.gte("update_datetime", isoToday);
  //     break;
  // }

  console.log("Supabase Result:", supabaseResult);

  if(supabaseResult.error || !supabaseResult.data) {
    return resInternalServerError();
  }

  const timelineData :GetWorkGroupsData[] = supabaseResult.data as GetWorkGroupsData[];

  // 一括でユーザ情報を取得(TODO: キャッシュに保持している場合はそちらを優先)
  const userIds: Set<string> = new Set(timelineData.map(data => data.user_id));
  const { data: userInfoList, error }
    = await supabase
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


  const workGroups: WorkGroup[]
  = timelineData
    .map((item) => ({
      id: item.group_id,
      userInfo: {
        id: item.user_id,
        name: userInfoMap.get(item.user_id)?.name ?? "不明なユーザ",
        iconImg: userInfoMap.get(item.user_id)?.iconImg ?? "",
      },
      title: item.title ?? "無題の作業グループ",
      note: item.content ?? "",
      images: item.images ?? [],
      isClose: item.close_flag,
      updatedAt: item.update_datetime,
    }));

  return resSuccess(workGroups);
}

/**
 * 作業グループ更新API
 * @param req 
 * @returns 
 */
export async function PUT(req: NextRequest): Promise<NextResponse<any>> {
  // Handle PUT request

  const reqBody = await req.json();
  const { groupId, title, description, isClose } = reqBody;
  const cookie = await cookies();

  const userInfo = getAuthedUserFromCookie(cookie);
  if (!userInfo) {
    return resUnauthorized();
  }

  if (!groupId || isClose === undefined) {
    return resValidationError("Invalid request");
  }

  const updateData: { [key: string]: any } = {
    title: title,
    content: description,
    close_flag: isClose,
    update_datetime: isClose ? new Date().toISOString() : undefined,// 作業完了の場合は更新日時も今日のものに
  };

  console.log("Updating work group:", groupId, updateData);

  const authedClient = getAuthServerClient(cookie.get("accessToken")?.value || "");

  const { error } = await authedClient
    .from("work_group")
    .update(updateData)
    .eq("group_id", groupId);

  if (error) {
    return resInternalServerError("Failed to update work group");
  }

  return resSuccess("success");
}


