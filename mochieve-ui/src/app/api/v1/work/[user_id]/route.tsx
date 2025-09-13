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
  if(!userId) {
    return resValidationError("userIdが指定されていません");
  }
  const cookie = await cookies();

  const token = await getValidTokenFromCookie(cookie);
  if(!token || token.userInfo.id !== userId) {
    return resUnauthorized("ユーザが認証されていませんでした。再ログインしてください。");
  }

  const result
    = await supabase
      .from("work_group")
      .select("*")
      .eq("user_id", userId)
      .eq("delete_flag", false)
      .order("update_datetime", { ascending: true })
      .limit(CACHE_INFO.MY_WORKS_DATA.MAX_SIZE);

  if(result.error || !result.data) {
    return resInternalServerError();
  }

  const myGroupData: GetWorkGroupsData[] = result.data as GetWorkGroupsData[];
  const groups: WorkGroup[]
    = myGroupData.map(item => ({
        id        : item.group_id,
        title     : item.title || "",
        note      : item.content || "",
        images    : item.images,
        userInfo  : token.userInfo,
        isClose   : item.close_flag,
        updatedAt : item.update_datetime,
      }));

  return resSuccess<WorkGroup[]>(groups);
}