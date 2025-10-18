import { setLoadingModal } from "../_state/slice/modal";
import { store } from "../_state/store";
import { ApiResponse, ErrorResponse, SuccessResponse } from "../_type/api";

const API_URL = "" //`${API_INFO.HOST}:${API_INFO.PORT}`;TODO: 後々BFF追加の場合は修正

export const getFetch = async <T>(url: string, options = {}, showLoading = true): Promise<ApiResponse<T>> => {
  if (showLoading) store.dispatch(setLoadingModal(true));
  const response = await fetch(API_URL + url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options as any).headers,
    },
    credentials: "include",
    ...options,
  });
  if (showLoading) store.dispatch(setLoadingModal(false));

  if (!response.ok) {
    return await response.json() as ErrorResponse; // エラーレスポンスを返す
  }
  const resBody: ApiResponse<T> = await response.json();
  if(resBody.status !== 200) return resBody as ErrorResponse; // ステータスコードが200でない場合はエラーレスポンスを返す
  return resBody as SuccessResponse<T>; // 成功レスポンスを返す
}

export const postFetch = async <T, U>(url: string, body: T, options = {}, showLoading = true): Promise<ApiResponse<U>> => {
  if (showLoading) store.dispatch(setLoadingModal(true));
  const response = await fetch(API_URL + url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(options as any).headers,
    },
    body: JSON.stringify(body),
    credentials: "include",
    ...options,
  });
  if (showLoading) store.dispatch(setLoadingModal(false));

  if (!response.ok) {
    return await response.json() as ErrorResponse; // エラーレスポンスを返す
  }
  const resBody: ApiResponse<U> = await response.json();
  if(resBody.status !== 200) return resBody as ErrorResponse; // ステータスコードが200でない場合はエラーレスポンスを返す
  return resBody as SuccessResponse<U>; // 成功レスポンスを返す
}

export const putFetch = async <T, U>(url: string, body: T, options = {}, showLoading = true): Promise<ApiResponse<U>> => {
  if (showLoading) store.dispatch(setLoadingModal(true));
  const response = await fetch(API_URL + url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(options as any).headers,
    },
    body: JSON.stringify(body),
    credentials: "include",
    ...options,
  });
  if (showLoading) store.dispatch(setLoadingModal(false));

  if (!response.ok) {
    return await response.json() as ErrorResponse; // エラーレスポンスを返す
  }
  const resBody: ApiResponse<U> = await response.json();
  if(resBody.status !== 200) return resBody as ErrorResponse; // ステータスコードが200でない場合はエラーレスポンスを返す
  return resBody as SuccessResponse<U>; // 成功レスポンスを返す
}

export const deleteFetch = async (url: string, options = {}, showLoading = true): Promise<void> => {
  if (showLoading) store.dispatch(setLoadingModal(true));
  const response = await fetch(API_URL + url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...(options as any).headers,
    },
    credentials: "include",
    ...options,
  });
  if (showLoading) store.dispatch(setLoadingModal(false));

  if (!response.ok) {
    throw new Error(`delete処理に失敗しました: ${response.statusText}`);
  }
};
