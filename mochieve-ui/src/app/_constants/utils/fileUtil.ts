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
