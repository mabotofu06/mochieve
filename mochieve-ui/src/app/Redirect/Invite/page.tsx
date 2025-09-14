"use client"

import { supabase } from "@/app/_constants/supabase/client";
import { Session } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";

interface AuthUserInfo {
  uid: string;
  avatarUrl: string;
  userName: string;
}

const fetchSession = async (): Promise<AuthUserInfo> => {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error("Error fetching session:", error);
    throw new Error("User not found");
  }
  
  const session = data.session;
  if(!session) throw new Error("User not found");
  const user = session.user;
  const uid = user.id;
  const avatarUrl = user.user_metadata?.avatar_url || "";
  const userName  = user.user_metadata?.full_name || user.user_metadata?.name || "";

  return { uid, avatarUrl, userName };
};

export default function RedirectInvitePage() {
  const [inviteCode , setInviteCode] = useState<string | null>(null);
  const [userId     , setUserId]           = useState<string>("");
  const [userName   , setUserName]       = useState<string>("");
  const [userIconUrl, setUserIconUrl] = useState<string>("");
  const [userIcon   , setUserIcon]       = useState<File | null>(null);

  useEffect(() => {
    fetchSession()
    .then((authInfo) => {
      console.log("Session sent successfully", authInfo);
      setUserId(authInfo.uid);
      setUserName(authInfo.userName);
      setUserIconUrl(authInfo.avatarUrl);
    })
    .catch(err => {
      console.error("Error fetching session:", err);
    })
    // .finally(() => {
    //   window.location.href = "/Top";
    // });
  }, []);

  return (
    <div>
      <h1>Redirecting to Invite...</h1>
    </div>
  );
}