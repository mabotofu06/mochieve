export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

export interface SuccessResponse<T> {
  status: number;
  code: string;
  message: string;
  data: T;
}

export interface ErrorResponse {
  status: number;
  code: string;
  message: string;
  details: string;
}

export interface PostRequestBody {
  groupId?  : string; // 新規作成の場合は不要
  note      : string;
  imageFile : string; // Base64エンコードされた画像データ
  isClose?  : boolean; // 投稿後に完了にするかどうか
}