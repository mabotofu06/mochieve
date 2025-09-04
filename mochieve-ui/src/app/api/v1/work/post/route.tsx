import { APP_HOST, BL_INFO } from "@/app/_constants/app";
import { getFetch } from "@/app/_constants/fetch";
import { ApiResponse, ErrorResponse, SuccessResponse } from "@/app/_type/api";
import { UserInfo } from "@/app/_type/data";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";


/**
 * 作業ポスト新規投稿API
 * @param req 
 * @returns 
 */
export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse<any>>> {
  const cookie = await cookies();
  const accessToken = cookie.get("accessToken")?.value;
  if (!accessToken) {
    return NextResponse.json<ErrorResponse>({
      status: 401,
      code: "UNAUTHORIZED",
      message: "Unauthorized",
      details: "No access token provided"
    },{
      status: 401
    });
  }
  
  const userInfo = await getFetch<UserInfo>(APP_HOST + BL_INFO.API_ENDPOINT.CACHE_USER_INFO, {
    headers: { Cookie: `accessToken=${accessToken}` }
  });

  const { content, imageFile } = await req.json();
  // Handle POST request

  //以下の処理を1つの処理として実装（途中エラーの場合は取消）
  // 作業グループを新規作成
  // 画像をアップロード
  // 画像の公開リンクを取得
  // 作業ポストを新規作成

  return NextResponse.json<SuccessResponse<any>>({
    status: 200,
    code: "SUCCESS",
    data: {},
    message: "Success"
  }, {
    status: 200
  });
}


/**
 * 作業ポスト更新API
 * @param req 
 * @returns 
 */
export async function PUT(req: NextRequest): Promise<NextResponse<any>> {
  // Handle PUT request

  return NextResponse.json({ message: "Success" });
}


