import { CACHE_INFO, TOP_NAV_MENU } from "@/app/_constants/app";
import { supabase } from "@/app/_constants/supabase/client";
import { getAuthServerClient } from "@/app/_constants/supabase/server/client";
import { getAuthedUserFromCookie, resInternalServerError, resSuccess, resUnauthorized, resValidationError } from "@/app/_constants/utils/apiUtils";
import { createLogger } from "@/app/_constants/utils/logger";
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
  const logger = createLogger('API:Work:Group');
  // Handle GET request
  const cookie = await cookies();
  const { searchParams } = new URL(req.url);
  // タイムライン取得期間(単位: ミリ秒)
  const period: number = Number(searchParams.get("period") ?? 0);
  const datetime = period !== 0
      ? new Date(period)
      : new Date();

  logger.debug("Timeline Request Period:", { period, datetime: datetime.toISOString() });

  const supabaseResult
    = await supabase
      .from("work_group")
      .select("*")
      .eq("delete_flag", false)
      .lt("update_datetime", datetime.toISOString())
      .order("update_datetime", { ascending: false })
      .limit(CACHE_INFO.TIMELINE_DATA.MAX_SIZE);

  logger.debug("Supabase Result:", { resultCount: supabaseResult.data?.length });

  if(supabaseResult.error || !supabaseResult.data) {
    logger.error("Failed to fetch work groups from Supabase", supabaseResult.error);
    return resInternalServerError(cookie);
  }

  const timelineData :GetWorkGroupsData[] = supabaseResult.data as GetWorkGroupsData[];

  // 一括でユーザ情報をSupabaseから取得（N+1問題を回避）
  const userIds: Set<string> = new Set(timelineData.map(data => data.user_id));
  logger.debug(`Fetching user info for ${userIds.size} users from Supabase`);
  
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


  const workGroups: WorkGroup[]
  = timelineData
    .map((item) => ({
      id: item.group_id,
      userInfo: {
        id: item.user_id,
        name: userInfoMap.get(item.user_id)?.name ?? "不明なユーザ",
        iconImg: userInfoMap.get(item.user_id)?.iconImg ?? "",
      },
      title: item.title ?? "",
      note: item.content ?? "",
      images: item.images ?? [],
      isClose: item.close_flag,
      updatedAt: item.update_datetime,
    }));

  return resSuccess(cookie, workGroups);
}

/**
 * 作業グループ更新API
 * @param req 
 * @returns 
 */
export async function PUT(req: NextRequest): Promise<NextResponse<any>> {
  const logger = createLogger('API:Work:Group:PUT');
  // Handle PUT request

  const reqBody = await req.json();
  const { groupId, title, description, isClose } = reqBody;
  const cookie = await cookies();

  const userInfo = getAuthedUserFromCookie(cookie);
  if (!userInfo) {
    return resUnauthorized(cookie);
  }

  if (!groupId || isClose === undefined) {
    return resValidationError(cookie, "Invalid request");
  }

  const updateData: { [key: string]: any } = {
    title: title,
    content: description,
    close_flag: isClose,
    update_datetime: isClose ? new Date().toISOString() : undefined,// 作業完了の場合は更新日時も今日のものに
  };

  logger.info("Updating work group:", { groupId, updateData });

  const authedClient = getAuthServerClient(cookie.get("accessToken")?.value || "");

  const { error } = await authedClient
    .from("work_group")
    .update(updateData)
    .eq("group_id", groupId);

  if (error) {
    return resInternalServerError(cookie,"Failed to update work group");
  }

  return resSuccess(cookie, "success");
}


