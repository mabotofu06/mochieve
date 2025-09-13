import { deleteUserInfoByToken } from "@/app/_constants/redis/client";
import { getAuthServerClient } from "@/app/_constants/supabase/server/client";
import { resInternalServerError, resSuccess, resUnauthorized } from "@/app/_constants/utils/apiUtils";
import { ApiResponse } from "@/app/_type/api";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest): Promise<NextResponse<ApiResponse<any>>> {
  const cookie = await cookies()
  try {
    const accessToken = cookie.get("accessToken")?.value;

    if(!accessToken) {
      return resUnauthorized(cookie);
    }

    await deleteUserInfoByToken(accessToken)

    const supabase = getAuthServerClient(accessToken);
    await supabase.auth.signOut();

    cookie.delete("accessToken");
    cookie.delete("refreshToken");

    return resSuccess(cookie, { status: "success" });
  } catch (err: any) {
    console.log(err);
    return resInternalServerError(cookie, err.message || "Internal Server Error");
  }
}