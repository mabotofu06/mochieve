import { deleteUserInfoByToken } from "@/app/_constants/redis/client";
import { getAuthServerClient } from "@/app/_constants/supabase/server/client";
import { resInternalServerError, resSuccess, resUnauthorized } from "@/app/_constants/utils/apiUtils";
import { ApiResponse } from "@/app/_type/api";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest): Promise<NextResponse<ApiResponse<any>>> {
  try {
    const cookie = await cookies()
    const accessToken = cookie.get("accessToken")?.value;

    if(!accessToken) {
      return resUnauthorized();
    }

    await deleteUserInfoByToken(accessToken)

    const supabase = getAuthServerClient(accessToken);
    await supabase.auth.signOut();

    cookie.delete("accessToken");
    cookie.delete("refreshToken");

    return resSuccess({status: "success"});
  } catch (err: any) {
    console.log(err);
    return resInternalServerError(err.message || "Internal Server Error");
  }
}