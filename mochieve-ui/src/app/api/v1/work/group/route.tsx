import { NextRequest, NextResponse } from "next/server";


/**
 * 作業グループ新規投稿API
 * @param req 
 * @returns 
 */
export async function POST(req: NextRequest): Promise<NextResponse<any>> {
  // Handle POST request

  return NextResponse.json({ message: "Success" });
}


/**
 * 作業グループ更新API
 * @param req 
 * @returns 
 */
export async function PUT(req: NextRequest): Promise<NextResponse<any>> {
  // Handle PUT request

  return NextResponse.json({ message: "Success" });
}


