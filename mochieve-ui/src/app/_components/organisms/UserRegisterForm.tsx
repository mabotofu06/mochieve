"use client"

import { supabase } from "@/app/_constants/supabase/client";
import { setLoading } from "@/app/_state/slice/modal";
import { store } from "@/app/_state/store";
import { Session } from "@supabase/auth-js";
import { useEffect, useState } from "react";

const Input = (props: {
  className?: string;
  type?:"text" | "email" | "password";
  placeholder: string;
  initialValue?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void})=>{
  return(
    <input
      className={`border rounded-3xl p-3 ${props.className}`}
      type={props.type??"text"}
      placeholder={props.placeholder}
      defaultValue={props.initialValue ?? ""}
      onChange={props.onChange}
    />
  )
}

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
  
  const session: Session | null = data.session;
  if(!session) throw new Error("User not found");
  const user = session.user;
  const uid  = user.id;
  const avatarUrl = user.user_metadata?.avatar_url || "";
  const userName  = user.user_metadata?.full_name || user.user_metadata?.name || "";

  return { uid, avatarUrl, userName };
};


export const OrganismsUserRegisterForm = () => {
  const [inviteCode , setInviteCode] = useState<string | null>(null);
  const [uid        , setUid] = useState<string>("");
  const [userId     , setUserId] = useState<string>("");
  const [userName   , setUserName] = useState<string>("");
  const [userIconUrl, setUserIconUrl] = useState<string>("");
  const [IconImg, setIconImg] = useState<File|null>(null);
  const [pageNum, setPageNum] = useState(0); // 1: ユーザー情報入力、2: 登録完了

  useEffect(()=>{
    const params = new URLSearchParams(window.location.search);
    const code = params.get("invite_code");
    if(!code){
      throw new Error("Invite code not found");
    }
    setInviteCode(code);
    console.log("招待コード：" + code);

    fetchSession()
      .then((authInfo) => {
        console.log("Session sent successfully", authInfo);
        setUid(authInfo.uid);
        setUserName(authInfo.userName);
        setUserIconUrl(authInfo.avatarUrl);
      })
      .catch(err => {
        console.error("Error fetching session:", err);
      })
      .finally(()=>{store.dispatch(setLoading(false))})
  },[])

  return (
      <div className="flex flex-col items-center text-lg pt-10">
        <h2 className="text-xl mb-2">登録完了まであと少しです！</h2>
        <h2 className="text-xl mb-10">以下の情報を入力してください</h2>
        <h2 className="text-xl mb-2">※リロードや前のページには戻らないでください</h2>
        <div className="h-50 mb-10 flex items-center w-98">
          {pageNum === 0
            ? <Input
                key="userId"
                className="mb-5 w-full"
                placeholder="ユーザIDを入力（半角英数_重複不可）"
                initialValue={userId}
                onChange={(e) => { setUserId(e.target.value) }}
              />
            : pageNum === 1
            ? <Input
                key="userName"
                className="mb-5 w-full"
                placeholder="ユーザ名を入力"
                initialValue={userName}
                onChange={(e) => { setUserName(e.target.value) }}
              />
            : pageNum === 2
            ? <div key="icon" className="flex flex-col items-center mb-5 text-lg w-full">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300 flex items-center justify-center bg-gray-100 mb-5">
                  <img
                    className="object-cover w-full h-full"
                    src={IconImg ? URL.createObjectURL(IconImg) : userIconUrl}
                    alt="User Icon"
                  />
                </div>
                <label className="inline-block bg-green-500 text-white px-4 py-2 cursor-pointer rounded-4xl">
                  アイコンを変更
                  <input
                    className="hidden"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setIconImg(file);
                    }}
                  />
                </label>
              </div>
            : null
          }
        </div>
        <div>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded-4xl disabled:opacity-50"
          onClick={() => {setPageNum((prev) => (prev - 1))}}
          disabled={pageNum === 0}
        >
          戻る
        </button>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded-4xl  disabled:opacity-50"
          onClick={() => {setPageNum((prev) => (prev + 1))}}
          disabled={pageNum === 3}
        >
          次へ
        </button>
        </div>
      </div>
  )
}