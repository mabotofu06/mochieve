import { ApiResponse, ErrorResponse, SuccessResponse } from "@/app/_type/api";
import { UserInfo } from "@/app/_type/data";
import { NextResponse } from "next/server";
import { APP_HOST, BL_INFO } from "../app";
import { getFetch } from "../fetch";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";


export const resSuccess = <T>(data: T, message = "Success", code = "SUCCESS"): NextResponse<SuccessResponse<T>> => {
  return NextResponse.json({
    status: 200,
    code,
    message,
    data
  }, { status: 200 });
}

export const ERROR_INFO = {
  UNAUTHORIZED: {CODE: "UNAUTHORIZED", STATUS: 401, MESSAGE: "Unauthorized", DETAIL: "Authentication is required and has failed or has not yet been provided"},
  FORBIDDEN   : {CODE: "FORBIDDEN", STATUS: 403, MESSAGE: "Forbidden", DETAIL: "You do not have permission to access this resource"},
  NOT_FOUND   : {CODE: "NOT_FOUND", STATUS: 404, MESSAGE: "Not Found", DETAIL: "The requested resource was not found"},
  VALIDATION_ERROR: {CODE: "VALIDATION_ERROR", STATUS: 400, MESSAGE: "Validation Error", DETAIL: "One or more validation errors occurred"},
  INTERNAL_SERVER_ERROR: {CODE: "INTERNAL_SERVER_ERROR", STATUS: 500, MESSAGE: "Internal Server Error", DETAIL: "An unexpected error occurred on the server"},
}

export const resError = (error: ErrorResponse): NextResponse<ErrorResponse> => {
  return NextResponse.json<ErrorResponse>(error, { status: error.status });
}

export const resNotFound = (message = ERROR_INFO.NOT_FOUND.MESSAGE, details = ERROR_INFO.NOT_FOUND.DETAIL): NextResponse<ErrorResponse> => {
  return resError({
    status: 404,
    code: ERROR_INFO.NOT_FOUND.CODE,
    message,
    details
  })
}

export const resForbidden = (message = ERROR_INFO.FORBIDDEN.MESSAGE, details = ERROR_INFO.FORBIDDEN.DETAIL): NextResponse<ErrorResponse> => {
  return resError({
    status: 403,
    code: ERROR_INFO.FORBIDDEN.CODE,
    message,
    details
  })
}

export const resUnauthorized = (message = ERROR_INFO.UNAUTHORIZED.MESSAGE, details = ERROR_INFO.UNAUTHORIZED.DETAIL): NextResponse<ErrorResponse> => {
  return resError({
    status: 401,
    code: ERROR_INFO.UNAUTHORIZED.CODE,
    message,
    details
  })
}
export const resValidationError = (message = ERROR_INFO.VALIDATION_ERROR.MESSAGE, details = ERROR_INFO.VALIDATION_ERROR.DETAIL): NextResponse<ErrorResponse> => {
  return resError({
    status: 400,
    code: ERROR_INFO.VALIDATION_ERROR.CODE,
    message,
    details
  })
}

export const resInternalServerError = (message = ERROR_INFO.INTERNAL_SERVER_ERROR.MESSAGE, details = ERROR_INFO.INTERNAL_SERVER_ERROR.DETAIL): NextResponse<ErrorResponse> => {
  return resError({
    status: 500,
    code: ERROR_INFO.INTERNAL_SERVER_ERROR.CODE,
    message,
    details
  })
}

/**
 * Cookie情報から認証済みユーザ情報を取得する
 * @param cookie 
 * @returns 
 */
export const getAuthedUserFromCookie = async (cookie: ReadonlyRequestCookies): Promise<UserInfo | null> => {
  const accessToken = cookie.get("accessToken")?.value;
  if (!accessToken) return null;

  const res: ApiResponse<UserInfo>
  = await getFetch<UserInfo>(
        APP_HOST + BL_INFO.API_ENDPOINT.CACHE_USER_AUTH, {
        headers: { Cookie: `accessToken=${accessToken}` }
      });
  
  if (res.status !== 200) return null;
  const userInfo = (res as SuccessResponse<UserInfo>).data;
  if(!userInfo) return null;

  return userInfo;
}