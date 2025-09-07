import { MY_WORK_NAV_MENU } from "@/app/_constants/app";
import { supabase } from "@/app/_constants/supabase/client";
import { getAuthedUserFromCookie, resInternalServerError, resSuccess, resUnauthorized, resValidationError } from "@/app/_constants/utils/apiUtils";
import { ApiResponse } from "@/app/_type/api";
import { WorkGroup } from "@/app/_type/data";
import { GetWorkGroupsData } from "@/app/_type/supabase";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest,   { params }: { params: { user_id: string } }): Promise<NextResponse<ApiResponse<WorkGroup[]>>> {
  console.log("===== GET /api/v1/work/[user_id] =====");
  const userId = (await params).user_id;
  if(!userId) {
    return resValidationError("userIdが指定されていません");
  }
  const cookie = await cookies();
  const userInfo = await getAuthedUserFromCookie(cookie);
  if (!userInfo || userInfo.id !== userId){
    return resUnauthorized("ユーザが認証されていませんでした。再ログインしてください。");
  }

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const baseQuery
    = supabase
      .from("work_group")
      .select("*")
      .eq("user_id", userId)
      .eq("delete_flag", false)
      .order("update_datetime", { ascending: false });

  let supabaseResult;

  switch(type){
    case MY_WORK_NAV_MENU.DONE.code.toString(): // 完了
      console.log("Fetching done posts for user:", userId);
      supabaseResult = await baseQuery.eq("close_flag", true);
      break;
    case MY_WORK_NAV_MENU.WORKING.code.toString(): // 作業中
      console.log("Fetching working posts for user:", userId);
      supabaseResult = await baseQuery.eq("close_flag", false);
      break;
    default: // すべて
      console.log("Fetching all posts for user:", userId);
      supabaseResult = await baseQuery;
      break;
  }

  if(supabaseResult.error || !supabaseResult.data) {
    return resInternalServerError();
  }

  const myGroupData: GetWorkGroupsData[] = supabaseResult.data as GetWorkGroupsData[];
  const groups: WorkGroup[]
    = myGroupData.map(item => ({
        id        : item.group_id,
        title     : item.title || "",
        note      : item.content || "",
        images    : item.images,
        userInfo  : userInfo,
        isClose   : item.close_flag,
        updatedAt : item.update_datetime,
      }));

  return resSuccess<WorkGroup[]>(groups);
}
