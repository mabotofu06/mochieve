import { supabase } from "@/app/_constants/supabase/client";
import { resSuccess, resValidationError } from "@/app/_constants/utils/apiUtils";
import { ApiResponse } from "@/app/_type/api";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest): Promise<NextResponse<ApiResponse<any>>> {
  // Handle GET request
  const cookie = await cookies();
  const { searchParams } = new URL(req.url);
  const inviteCode = searchParams.get("invite_code");

  if(!inviteCode) {
    return resValidationError(cookie);
  }

  const { data, error }
    = await supabase
      .from('invite_info')
      .select()
      .eq('code', inviteCode)
      .eq('used_flag', false)
      .eq('delete_flag', false)
      .single();
  if (error) {
    console.error("招待コードの取得エラー:", error);
    return resValidationError(cookie);
  }
  if (!data) {
    return resValidationError(cookie, "無効な招待コードです");
  }

  return resSuccess(cookie, { inviteCode: data?.code });
}
