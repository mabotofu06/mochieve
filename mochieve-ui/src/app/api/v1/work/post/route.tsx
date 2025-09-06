import { APP_HOST, BL_INFO } from "@/app/_constants/app";
import { getFetch } from "@/app/_constants/fetch";
import { getAuthServerClient } from "@/app/_constants/supabase/server/client";
import { resInternalServerError, resSuccess, resUnauthorized, resValidationError } from "@/app/_constants/utils/apiUtils";
import { decodeBase64ToBuffer, validBase64MimeType } from "@/app/_constants/utils/fileUtil";
import { ApiResponse, ErrorResponse, PostRequestBody, SuccessResponse } from "@/app/_type/api";
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
  if (!accessToken) return resUnauthorized();

  const res: ApiResponse<UserInfo>
  = await getFetch<UserInfo>(
      APP_HOST + BL_INFO.API_ENDPOINT.CACHE_USER_INFO, {
      headers: { Cookie: `accessToken=${accessToken}` }
    });

  if (res.status !== 200) return resUnauthorized();
  const userInfo = (res as SuccessResponse<UserInfo>).data;
  if(!userInfo) return resUnauthorized();

  // リクエストボディを取得
  const {note, imageFile}: PostRequestBody = await req.json();
  console.table({note, imageFile: imageFile.slice(0,30) + "..."}); // 先頭30文字だけ表示

  if(!note || !imageFile) return resValidationError();
  if(note.length > 150) return resValidationError("Note is too long", "Note must be 150 characters or less");

  // imageFile拡張子チェック（webpのみ許可、クライアント側でwebpに変換してエンコードしてもらう）
  if (!validBase64MimeType(imageFile, "image/webp")) {
    return resValidationError("Invalid image format", "Only webp images are allowed");
  }

  const authedClient = getAuthServerClient(accessToken);

  //TODO: 投稿数が3個を超えていないかチェック


  //ファイルをアップロードして公開リンクを取得
  const { data, error }
    = await authedClient.storage
      .from("post-content")
      .upload(`images/${Date.now()}.webp`,
      decodeBase64ToBuffer(imageFile),{
        contentType: "image/webp"
      });  
  if (error) {
    console.error("Storage upload error:", error);
    return resInternalServerError("Failed to upload image");
  }
  const { data: publicUrlData }
    = await authedClient.storage
      .from("post-content")
      .getPublicUrl(data.path);
  if (!publicUrlData) {
    console.error("Failed to get public URL");
    return resInternalServerError("Failed to get public URL");
  }

  const imageUrl = publicUrlData.publicUrl;

  const { data: rpcData, error: rpcError } = await authedClient
  .rpc("create_group_and_post", {
    p_user_id: userInfo.id,
    p_note: note,
    p_image_url: imageUrl,
  });

  if (rpcError) {
    //TODO: ここでアップロードした画像を削除する
    console.error("RPC error:", rpcError);
    return resInternalServerError("Failed to create work group and post");
  }
  console.log("RPC success:", rpcData);

  const postBody = {
    groupId: rpcData.groupId,
    note,
    imageUrl,
    userId: userInfo.id,
    // 作業ポストの詳細情報を返す
  };

  return resSuccess(postBody);
}


/**
 * 作業ポスト追加API
 * @param req 
 * @returns 
 */
export async function PUT(req: NextRequest): Promise<NextResponse<any>> {
  const cookie = await cookies();
  const accessToken = cookie.get("accessToken")?.value;
  if (!accessToken) return resUnauthorized();

  const res: ApiResponse<UserInfo>
  = await getFetch<UserInfo>(
      APP_HOST + BL_INFO.API_ENDPOINT.CACHE_USER_INFO, {
      headers: { Cookie: `accessToken=${accessToken}` }
    });

  if (res.status !== 200) return resUnauthorized();
  const userInfo = (res as SuccessResponse<UserInfo>).data;
  if(!userInfo) return resUnauthorized();

  // リクエストボディを取得
  const {groupId, note, imageFile}: PostRequestBody = await req.json();
  if(!groupId || !imageFile) return resValidationError();

  //TODO: 作業グループの存在チェック
  const workGroup = {};
  // その後、クローズされていないかチェック
  const isClosed = false; //TODO: 実際にはバックエンドでチェック

  //ファイルをアップロードして公開リンクを取得
  const imageUrl = "https://example.com/path/to/uploaded/image.jpg"; //TODO: 実際にはバックエンドでアップロードしてそのURLを取得

  //問題なければグループ投稿を更新
  const putBody = {
    groupId,
    note,
    imageUrl,
    userId: userInfo.id,
    // 作業ポストを更新
  }

  return NextResponse.json({ message: "Success" });
}


