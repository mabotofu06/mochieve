import { fileToWebp } from "../utils/fileUtil";
import { supabase } from "./client";


/**
 * Supabaseストレージに画像をwebp形式で投稿する.
 * @param file アップロードする画像ファイル.
 * @returns アップロードされた画像の公開URL、またはアップロードに失敗した場合はnull.
 */
export const uploadPostImage = async (file: File): Promise<string | null> => {
  const webpBlob = await fileToWebp(file);
  const fileName = `images/${Date.now()}.webp`;

  const { error } = await supabase.storage
    .from("post-content")
    .upload(fileName, webpBlob, {
      contentType: "image/webp",
      cacheControl: 'public, max-age=31536000, immutable', // キャッシュ設定（1年）
      upsert: true // 同名ファイルがあれば上書き
    });

  if (error) {
    console.error("Upload error:", error);
    return null;
  }

  const publicUrl = supabase.storage.from("post-content").getPublicUrl(fileName).data.publicUrl;
  return publicUrl;
};
