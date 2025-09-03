import { fetchWorkGroups } from "@/app/_constants/supabase/server/workGroupClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest): Promise<NextResponse<any>> {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    console.log("Timeline Request Type:", type);
    //TODO: typeを元に「最新」「作業中」「完了」でフィルタリングする
    //TODO: user_idを元にユーザ情報を付加して返す
    const timelineData = await fetchWorkGroups();
    return NextResponse.json({ status: "success", data: timelineData });

  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? String(err) }, { status: 500 });
  }
}