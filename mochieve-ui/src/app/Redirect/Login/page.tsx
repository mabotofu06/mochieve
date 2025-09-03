"use client"

import { setUserInfo } from "@/app/_composables/userInfo";
import { BL_INFO } from "@/app/_constants/app";
import { postFetch } from "@/app/_constants/fetch";
import { supabase } from "@/app/_constants/supabase/client";
import { fetchUserInfoByUid } from "@/app/_constants/supabase/userClient";
import { UserInfo } from "@/app/_type/data";
import { access } from "fs";
import { useEffect } from "react";

const sendSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error("Error fetching session:", error);
    return null;
  }
  
  const session = data.session;
  if(!session) return;

  await postFetch(BL_INFO.API_ENDPOINT.AUTH_CALLBACK, {
    accessToken: session.access_token,
    refreshToken: session.refresh_token,
  });
}

const fetchLoginUserInfo = async (): Promise<UserInfo> => {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    throw new Error("User not found");
  }
  const userData = await fetchUserInfoByUid(data.user.id);

  if (!userData) {
    throw new Error("User data not found");
  }

  return {
    id     : userData.user_id,
    name   : userData.name,
    iconImg: userData.icon_image,
  };
};

const GUEST_USER_INFO: UserInfo = {
  id: "guest",
  name: "ゲストユーザ",
  iconImg: "",
};

export default function RedirectLoginPage() {
  useEffect(() => {
    sendSession().then(() => {
      console.log("Session sent successfully");
    })
    .catch(err => {
      console.error("Error fetching user info:", err);
      setUserInfo(GUEST_USER_INFO);
    })
    .finally(() => {
      window.location.href = "/Top";
    });
  }, []);

  return (
    <div>
      <h1>Redirecting to Login...</h1>
    </div>
  );
}