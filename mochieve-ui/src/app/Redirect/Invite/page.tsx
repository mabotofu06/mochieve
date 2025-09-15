"use client"

import { OrganismsUserRegisterForm } from "@/app/_components/organisms/UserRegisterForm";
import { supabase } from "@/app/_constants/supabase/client";
import { setLoading } from "@/app/_state/slice/modal";
import { store } from "@/app/_state/store";
import { AuthUserInfo } from "@/app/_type/data";
import { Session } from "@supabase/auth-js";
import { useEffect, useState } from "react";

const fetchSession = async (): Promise<AuthUserInfo> => {
  //ローカルにはキャッシュされないためリロードされると消える
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error("Error fetching session:", error);
    throw new Error("User not found");
  }
  
  const session: Session | null = data.session;
  if(!session) throw new Error("User not found");
  const accessToken = session.access_token;
  const user = session.user;
  if(!user || !accessToken) throw new Error("User not found");
  const userInfo = user.user_metadata;
  if(!userInfo) throw new Error("User not authenticated");
  const uid  = user.id;
  const avatarUrl = userInfo.avatar_url || "";
  const userName  = userInfo.full_name || userInfo?.name || "";

  if(!userName || !avatarUrl) throw new Error("User Info not authenticated");

  return { token: accessToken, uid, avatarUrl, userName };
};

export default function RedirectInvitePage() {
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [userAuthInfo, setUserAuthInfo] = useState<AuthUserInfo | null>(null);
  const [fetching, setFetching] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("invite_code");
    setInviteCode(code);
    console.log("招待コード：" + code);

    fetchSession()
      .then((authInfo) => {
        console.log("Session sent successfully", authInfo);
        setUserAuthInfo(authInfo);
      })
      .catch(err => {
        console.error("Error fetching session:", err);
        setError("ユーザー情報の取得に失敗しました");
      })
      .finally(()=>{
        store.dispatch(setLoading(false));
        setFetching(false);
      });
  }, []);

  if (fetching) {
    return <div></div>;
  }

  if (error || !inviteCode || !userAuthInfo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <h1 className="text-4xl font-bold mb-4">ユーザー情報の取得に失敗しました</h1>
        <p className="text-lg mb-6 text-gray-700">
          ユーザー情報の取得に失敗しました。<br/>
          <a href={`/Invite?invite_code=${inviteCode}`} className="text-green-500 underline">こちら</a>から
          もう一度やり直すか、下記サポートまでお問い合わせください。
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white h-screen">
      <OrganismsUserRegisterForm code={inviteCode} authInfo={userAuthInfo} />
    </div>
  );
}