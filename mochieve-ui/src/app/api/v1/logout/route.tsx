import { APP_HOST, BL_INFO } from "@/app/_constants/app";
import { deleteFetch } from "@/app/_constants/fetch";
import { getAuthServerClient } from "@/app/_constants/supabase/server/client";
import { resInternalServerError, resSuccess, resUnauthorized } from "@/app/_constants/utils/apiUtils";
import { ApiResponse } from "@/app/_type/api";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest): Promise<NextResponse<ApiResponse<any>>> {
  try {
    const cookie = await cookies()
    const accessToken = cookie.get("accessToken")?.value;
    const refreshToken = cookie.get("refreshToken")?.value;

    if(!accessToken) {
      return resUnauthorized();
    }

    // console.log("Logging out user:", { accessToken, refreshToken });

      await deleteFetch(APP_HOST+BL_INFO.API_ENDPOINT.CACHE_USER_AUTH, {
      headers: {
        Cookie: `accessToken=${accessToken}; refreshToken=${refreshToken}`
      }
      });

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