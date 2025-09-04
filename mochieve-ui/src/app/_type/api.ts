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