import { APP_HOST, BL_INFO } from "@/app/_constants/app";
import { getFetch } from "@/app/_constants/fetch";
import { supabase } from "@/app/_constants/supabase/client";
import { getAuthServerClient } from "@/app/_constants/supabase/server/client";
import { resInternalServerError, resSuccess, resUnauthorized, resValidationError } from "@/app/_constants/utils/apiUtils";
import { decodeBase64ToBuffer, validBase64MimeType } from "@/app/_constants/utils/fileUtil";
import { ApiResponse, PostRequestBody, SuccessResponse } from "@/app/_type/api";
import { UserInfo } from "@/app/_type/data";
import { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";


const uploadImage = async (authedClient: SupabaseClient, file: string): Promise<string | null> => {
  //ファイルをアップロードして公開リンクを取得
  const { data, error }
    = await authedClient.storage
      .from("post-content")
      .upload(`images/${Date.now()}.webp`,
      decodeBase64ToBuffer(file),{
        contentType: "image/webp"
      });  
  if (error) {
    console.error("Storage upload error:", error);
    return null;
  }
  const { data: publicUrlData }
    = await authedClient.storage
      .from("post-content")
      .getPublicUrl(data.path);
  if (!publicUrlData) {
    console.error("Failed to get public URL");
    return null;
  }

  return publicUrlData.publicUrl;
};

/**
 * 作業ポスト新規投稿API
 * @param req 
 * @returns 
 */
export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse<any>>> {
  console.log("===== POST /api/v1/work/post =====");
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

  // クローズしていない投稿数が3個を超えていないかチェック
  const { count: openGroupNum, error: openGroupError } = await supabase
    .from("work_group")
    .select('count', { count: 'exact' })
    .eq("user_id", userInfo.id)
    .eq("delete_flag", false)
    .eq("close_flag", false);

  if (openGroupError || !openGroupNum) {
    console.error("Failed to retrieve open groups:", openGroupError);
    return resInternalServerError("Failed to retrieve open groups");
  }
  if (openGroupNum >= 3) {
    return resValidationError("Too many open groups", "You can only have 3 open groups at a time");
  }

  const authedClient = getAuthServerClient(accessToken);

  //ファイルをアップロードして公開リンクを取得
  const imageUrl = await uploadImage(authedClient, imageFile);
  if (!imageUrl) {
    console.error("Failed to upload image");
    return resInternalServerError("Failed to upload image");
  }

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
  console.log("===== PUT /api/v1/work/post =====");

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
  if(!groupId || !imageFile || !note) return resValidationError();

  //作業グループを取得
  const {data: workGroup, error} = await supabase
    .from("work_group")
    .select("group_id, images")
    .eq("group_id", groupId)
    .eq("user_id", userInfo.id)
    .eq("delete_flag", false)
    .eq("close_flag", false)
    .single();
  if(error || !workGroup) {
    console.error("Failed to retrieve work group:", error);
    return resInternalServerError("Failed to retrieve work group");
  }

  const authedClient = getAuthServerClient(accessToken);
  //ファイルをアップロードして公開リンクを取得
  const imageUrl = await uploadImage(authedClient, imageFile);
  if (!imageUrl) {
    console.error("Failed to upload image");
    return resInternalServerError("Failed to upload image");
  }

  //TODO:work_groupの更新日が反映されていないため更新されるように
  const { data: rpcData, error: rpcError } = await authedClient.rpc(
    "update_group_and_post",
    {
      p_group_id: workGroup.group_id,
      p_user_id: userInfo.id,
      p_note: note,
      p_image_url: imageUrl,
    }
  );

  if(rpcError){
    //TODO:この時アップした画像を削除する
    console.error("RPC error:", rpcError);
    return resInternalServerError("Failed to update work group and post");
  }

  return NextResponse.json({ message: "Success" });
}


