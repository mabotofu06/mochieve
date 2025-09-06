const WEBP_COMPRESSION_QUALITY = 0.5;

// 画像をwebpに変換・圧縮
export const fileToWebp = async (file: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("Canvas context error");
      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        blob => {
          if (blob) resolve(blob);
          else reject("WebP conversion failed");
        },
        "image/webp",
        WEBP_COMPRESSION_QUALITY
      );
    };
    
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

/**
 * BlobをBase64にエンコード
 * @param imageData 
 * @returns 
 */
export const encodeBlob2Base64 = (imageData: Blob):Promise<string> =>{
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {resolve(reader.result as string);};
    reader.onerror = error => reject(error);
    reader.readAsDataURL(imageData);
  });
}

export const validBase64MimeType = (base64String: string, allowedType: string): boolean => {
  const mimeType = base64String.split(";")[0].split(":")[1]; // "data:image/webp;base64,..." から "image/webp" を抽出
  return allowedType === mimeType;
}

export const decodeBase64ToBuffer = (base64String: string): Buffer => {
  const base64Data = base64String.split(",")[1]; // "data:image/webp;base64,..." からBase64部分を抽出
  return Buffer.from(base64Data, "base64");
}