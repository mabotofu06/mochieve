import { ApiResponse } from "../_type/api";
import { BL_INFO } from "./app";

const API_URL = "" //`${BL_INFO.HOST}:${BL_INFO.PORT}`;TODO: 後々BFF追加の場合は修正

export const getFetch = async <T>(url: string, options = {}): Promise<ApiResponse<T>> => {
  const response = await fetch(API_URL + url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options as any).headers,
    },
    credentials: "include",
    ...options,
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const resBody: ApiResponse<T> = await response.json();
  return resBody;
}

export const postFetch = async <T, U>(url: string, body: T, options = {}): Promise<ApiResponse<U>> => {
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
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const resBody: ApiResponse<U> = await response.json();
  return resBody;
}

export const putFetch = async <T, U>(url: string, body: T, options = {}): Promise<ApiResponse<U>> => {
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
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const resBody: ApiResponse<U> = await response.json();
  return resBody;
}

export const deleteFetch = async (url: string, options = {}): Promise<void> => {
  const response = await fetch(API_URL + url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...(options as any).headers,
    },
    credentials: "include",
    ...options,
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
}
