import { fetchWorkGroupsByUserId } from "@/app/_constants/supabase/workGroupClient";
import { getAuthedUserFromCookie, resSuccess, resUnauthorized, resValidationError } from "@/app/_constants/utils/apiUtils";
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

  const myGroupData: GetWorkGroupsData[] = await fetchWorkGroupsByUserId(userId);
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
