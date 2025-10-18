import { APP_HOST, API_INFO } from "@/app/_constants/app";
import { getFetch } from "@/app/_constants/fetch";
import { supabase } from "@/app/_constants/supabase/client";
import { fetchPostsByGroupId } from "@/app/_constants/supabase/postClient";
import { getAuthServerClient } from "@/app/_constants/supabase/server/client";
import { getAuthedUserFromCookie, resInternalServerError, resSuccess, resUnauthorized, resValidationError } from "@/app/_constants/utils/apiUtils";
import { decodeBase64ToBuffer, validBase64MimeType } from "@/app/_constants/utils/fileUtil";
import { ApiResponse, ErrorResponse, PostRequestBody } from "@/app/_type/api";
import { UserInfo, WorkPost } from "@/app/_type/data";
import { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { createLogger } from "@/app/_constants/utils/logger";
import { NextRequest, NextResponse } from "next/server";


const uploadImage = async (authedClient: SupabaseClient, userInfo: UserInfo, file: string): Promise<string | null> => {
  const fileName = `images/${userInfo.id.replace(/^@/g, "")}/${Date.now()}.webp`; // ユーザーIDとタイムスタンプで一意のファイル名を生成

  //ファイルをアップロードして公開リンクを取得
  const { data, error }
    = await authedClient.storage
      .from("post-content")
      .upload(fileName,
      decodeBase64ToBuffer(file),{
        contentType: "image/webp"
      });  
  if (error) {
    const logger = createLogger('API:WorkPost:uploadImageToStorage');
    logger.error("Storage upload error", error);
    return null;
  }
  const { data: publicUrlData }
    = await authedClient.storage
      .from("post-content")
      .getPublicUrl(data.path);
  if (!publicUrlData) {
    const logger = createLogger('API:WorkPost:uploadImageToStorage');
    logger.error("Failed to get public URL");
    return null;
  }

  return publicUrlData.publicUrl;
};

export async function GET(req: NextRequest): Promise<NextResponse<ApiResponse<WorkPost[]>>> {
  const logger = createLogger('API:WorkPost:GET');
  logger.info("GET /api/v1/work/post");
  const cookie = await cookies();

  const { searchParams } = new URL(req.url);
  const groupId = searchParams.get("groupId");
  if (!groupId) {
    return resValidationError(cookie, "Invalid parameter", "groupId is required");
  }

  try {
    const rawData = await fetchPostsByGroupId(groupId);
    
    // データが配列であることを確認
    if (Array.isArray(rawData)) {
      // WorkPost形式に変換
      const workPosts: WorkPost[] = rawData.map(post => ({
        id: post.post_id,
        userId: post.user_id,
        note: post.content ?? "",
        image: post.image ?? "",
        createdAt: post.create_datetime,
      }));
      
      return resSuccess(cookie, workPosts);
    } else {
      logger.error("Invalid data format received from fetchPostsByGroupId");
      return resInternalServerError(cookie, "Failed to retrieve work posts");
    }
  } catch (error) {
    logger.error("Failed to retrieve work posts:", error);
    return resInternalServerError(cookie, "Failed to retrieve work posts");
  }
}

/**
 * 作業ポスト新規投稿API
 * @param req 
 * @returns 
 */
export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse<any>>> {
  const logger = createLogger('API:WorkPost:POST');
  logger.info("POST /api/v1/work/post");
  const cookie = await cookies();
  const accessToken = cookie.get("accessToken")?.value;
  if (!accessToken) return resUnauthorized(cookie);

  const userInfo: UserInfo | null = await getAuthedUserFromCookie(cookie); 
  if(!userInfo) return resUnauthorized(cookie);

  // リクエストボディを取得
  const {note, imageFile}: PostRequestBody = await req.json();
  logger.info("Request data:", {note, imageFile: imageFile.slice(0,30) + "..."}); // 先頭30文字だけ表示

  if(!note || !imageFile) return resValidationError(cookie);
  if(note.length > 150) return resValidationError(cookie, "Note is too long", "Note must be 150 characters or less");

  // imageFile拡張子チェック（webpのみ許可、クライアント側でwebpに変換してエンコードしてもらう）
  if (!validBase64MimeType(imageFile, "image/webp")) {
    return resValidationError(cookie, "Invalid image format", "Only webp images are allowed");
  }

  // 投稿グループを追加できるかチェック
  const checkRes
    = await getFetch<any>(
        APP_HOST + API_INFO.ENDPOINT.WORK_GROUP_CHECK,
        {headers: {cookie: `accessToken=${accessToken}`}}
      )
  if(checkRes.status !== 200) {
    const checkResError = checkRes as ErrorResponse
    return resValidationError(cookie, checkResError.message, checkResError.details);
  }

  const authedClient = getAuthServerClient(accessToken);

  //ファイルをアップロードして公開リンクを取得
  const imageUrl = await uploadImage(authedClient, userInfo, imageFile);
  if (!imageUrl) {
    logger.error("Failed to upload image");
    return resInternalServerError(cookie, "Failed to upload image");
  }

  const { data: rpcData, error: rpcError } = await authedClient
  .rpc("create_group_and_post", {
    p_user_id: userInfo.id,
    p_note: note,
    p_image_url: imageUrl,
  });

  if (rpcError) {
    // 失敗したらアップロードした画像を削除
    const deleteFilePath = imageUrl.replace(/^.*\/post-content\//, "");
    logger.info("Deleting uploaded file:", deleteFilePath);

    const { data, error } = await authedClient
      .storage
      .from("post-content")
      .remove([deleteFilePath]);

    logger.info("File deletion result:", { data, error });
    logger.error("RPC error:", rpcError);
    return resInternalServerError(cookie, "Failed to create work group and post");
  }
  logger.info("RPC success:", rpcData);

  const postBody = {
    groupId: rpcData.groupId,
    note,
    imageUrl,
    userId: userInfo.id,
    // 作業ポストの詳細情報を返す
  };

  return resSuccess(cookie, postBody);
}


/**
 * 作業ポスト追加API
 * @param req 
 * @returns 
 */
export async function PUT(req: NextRequest): Promise<NextResponse<ApiResponse<any>>> {
  const logger = createLogger('API:WorkPost:PUT');
  logger.info("PUT /api/v1/work/post");

  const cookie = await cookies();
  const accessToken = cookie.get("accessToken")?.value;
  if (!accessToken) return resUnauthorized(cookie);

  const userInfo: UserInfo | null = await getAuthedUserFromCookie(cookie);
  if(!userInfo) return resUnauthorized(cookie);

  // リクエストボディを取得
  const {groupId, note, imageFile}: PostRequestBody = await req.json();
  if(!groupId || !imageFile || !note) return resValidationError(cookie);

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
    logger.error("Failed to retrieve work group:", error);
    return resInternalServerError(cookie, "Failed to retrieve work group");
  }

  const authedClient = getAuthServerClient(accessToken);
  //ファイルをアップロードして公開リンクを取得
  const imageUrl = await uploadImage(authedClient, userInfo, imageFile);
  if (!imageUrl) {
    logger.error("Failed to upload image");
    return resInternalServerError(cookie, "Failed to upload image");
  }

  const { error: rpcError } = await authedClient.rpc(
    "update_group_and_post", {
    p_group_id: workGroup.group_id,
    p_user_id: userInfo.id,
    p_note: note,
    p_image_url: imageUrl,
  });

  if(rpcError){
    // 失敗したらアップロードした画像を削除
    const deleteFilePath = imageUrl.replace(/^.*\/post-content\//, "");
    logger.info("Deleting uploaded file:", deleteFilePath);

    const { data, error } = await authedClient
      .storage
      .from("post-content")
      .remove([deleteFilePath]);

    logger.info("File deletion result:", { data, error });
    logger.error("RPC error:", rpcError);
    return resInternalServerError(cookie, "Failed to update work group and post");
  }

  return resSuccess(cookie, { groupId, note, imageUrl });
}