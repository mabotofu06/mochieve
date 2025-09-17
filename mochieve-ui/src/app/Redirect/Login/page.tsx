"use client"

import { setUserInfo } from "@/app/_composables/userInfo";
import { APP_SERVICE, BL_INFO } from "@/app/_constants/app";
import { postFetch } from "@/app/_constants/fetch";
import { supabase } from "@/app/_constants/supabase/client";
import { ApiResponse, SuccessResponse } from "@/app/_type/api";
import { UserInfo } from "@/app/_type/data";
import { useEffect } from "react";

const fetchUserInfo = async (): Promise<UserInfo> => {
  // supabaseを通したOAuth認証だと既に認証処理が終わっているためcodeからのアクセストークン取得がサーバーサイドでできない
  // そのため認証終了後のリダイレクト先をここにしてクライアント側からsupabase上のセッション情報を取得し、サーバーに送信
  // サーバー側にcookieでセッション管理をすると同時にユーザ情報を取得する
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error("Error fetching session:", error);
    throw new Error("User not found");
  }
  
  const session = data.session;
  if(!session) throw new Error("User not found");

  const res: ApiResponse<UserInfo> = await postFetch<any, UserInfo>(
    BL_INFO.API_ENDPOINT.AUTH_CALLBACK,
    {
      accessToken: session.access_token,
      refreshToken: session.refresh_token,
    }
  );

  if(res.status !== 200) {
    throw new Error(res.message || "Failed to fetch user info");
  }

  return (res as SuccessResponse<UserInfo>).data;
};

export default function RedirectLoginPage() {
  useEffect(() => {
    fetchUserInfo()
      .then((userInfo) => {
        console.log("Session sent successfully");
        setUserInfo(userInfo);
        window.location.href = APP_SERVICE.TOP.link;
      })
      .catch(err => {
        console.error("Error fetching user info:", err);
        window.location.href = APP_SERVICE.TOP.link+`?error=${err.message}`;
        return;
      })
  }, []);

  return (
    <div>
      <h1>リダイレクト中…</h1>
    </div>
  );
}