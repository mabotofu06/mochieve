"use client"

import { getFetch, postFetch } from "@/app/_constants/fetch";
import { openErrorModal } from "@/app/_state/slice/modal";
import { store } from "@/app/_state/store";
import { AuthUserInfo, UserCreateData } from "@/app/_type/data";
import { useEffect, useState } from "react";
import { createLogger } from "@/app/_constants/utils/logger";

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

const UserIcon = (props: { url: string }) => {
  return (
    <div key="icon" className="flex flex-col items-center mb-5 text-lg w-full">
      <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-green-500 flex items-center justify-center bg-gray-100 mb-5">
        <img
          className="object-cover w-full h-full"
          src={props.url}
          alt="User Icon"
        />
      </div>
    </div>
  )
}

const UserIdForm = (props: { userId: string, setUserId: (id: string)=>void }) => {
  return (
    <div key="userId" className="flex flex-col items-center mb-5 text-lg w-98">
      <p className="mb-2">MochieveアカウントのユーザIDを設定してください</p>
      <p className="text-sm mb-8">※5~20文字の半角英数とアンダースコア(_)のみ使用可能です</p>
      <Input
        className="mb-5 w-full"
        placeholder="ユーザIDを入力"
        initialValue={props.userId}
        onChange={(e) => { props.setUserId(e.target.value) }}
      />
    </div>
  )
}

type Props = {
  code: string,
  authInfo: AuthUserInfo
}

/**
 * ユーザー登録の制約
 * * userId: 半角英数_重複不可 5~25文字
 * * userName: 3~50文字
 * * userIcon: 連携したサービスのアイコン（変更不可）
 * 
 * ユーザ更新は初期版では不可、後々実装予定
 * 
 * @param props 
 * @returns 
 */


export const OrganismsUserRegisterForm = (props: Props) => {
  const logger = createLogger('OrganismsUserRegisterForm');
  const inviteCode = props.code;
  const token      = props.authInfo.token;
  const uid        = props.authInfo.uid;
  const iconUrl    = props.authInfo.avatarUrl;
  const [userId  , setUserId]   = useState<string>("");
  const [userName, setUserName] = useState<string>(props.authInfo.userName);
  const [pageNum , setPageNum]  = useState(0); // 1: ユーザー情報入力、2: 登録完了

  const submitUser = async () => {
    if(!userId || userId.length < 5 || userId.length > 20 || !/^[a-zA-Z0-9_]+$/.test(userId)){
      store.dispatch(openErrorModal({title: "ユーザIDが不正です", message: "ユーザIDは5~20文字の半角英数とアンダースコア(_)のみ使用可能です"}));
      return;
    }
    if(!userName || userName.length < 3 || userName.length > 50){
      store.dispatch(openErrorModal({title: "ユーザ名が不正です", message: "ユーザ名は3~50文字で入力してください"}));
      return;
    }
    if(!inviteCode){
      store.dispatch(openErrorModal({title: "招待コードが不正です", message: "招待コードが不正です。もう一度やり直してください"}));
      return;
    }
    if(!uid || !token){
      logger.error("ユーザ情報が不正です", { uid, token });
      store.dispatch(openErrorModal({title: "ユーザ情報が不正です", message: "ユーザ情報が不正です。もう一度やり直してください"}));
      return;
    }
    //ユーザ登録APIを叩く
    const res = await postFetch<UserCreateData, any>("/api/v1/user", {
      token,
      inviteCode,
      uid,
      userId: "@" + userId,
      userName,
      iconImgUrl: iconUrl
    });

    if(res.status !== 200){
      store.dispatch(openErrorModal({title: "ユーザ登録に失敗しました", message: res.message}));
      return;
    }

    //TODO:できれば登録完了できましたモーダル的な表示にしたい
    window.location.href = "/";
    return;
  }

  const toUserNameForm = async ()=>{
    logger.debug("ユーザID確認:", { userId });
    if(!userId || userId.length < 5 || userId.length > 20 || !/^[a-zA-Z0-9_]+$/.test(userId)){
      store.dispatch(openErrorModal({title: "ユーザIDが不正です", message: "ユーザIDは5~20文字の半角英数とアンダースコア(_)のみ使用可能です"}));
      return;
    }
    const res = await getFetch("/api/v1/user/check?user_id=@" + userId);
    if(res.status !== 200){
      const data = res;
      store.dispatch(openErrorModal({title: "ユーザID確認エラー", message: data.message}));
      return;
    }
    setPageNum(1);
  }

  return (
      <div className="flex flex-col items-center text-lg pt-15">
        <h2 className="text-2xl font-bold mb-2">登録完了まであと少しです！</h2>
        <p>※画面のリロードなどは行わないでください</p>
        <div className="h-50 my-20 flex items-center">
          <div className="w-full">
                {pageNum === 0
                  ? <UserIdForm userId={userId} setUserId={setUserId} />
                  : pageNum === 1
                  ? (<div className="flex flex-col items-center mt-15 mb-5 text-lg w-98">
                    <p className="mb-3">ユーザー名とアイコンを確認してください</p>
                    <p>連携したサービスのものが設定されています</p>
                    <p>※ユーザー名のみ変更可能です</p>
                    <Input
                      key="userName"
                      className="mb-5 w-full"
                      placeholder="ユーザ名を入力"
                      initialValue={userName}
                      onChange={(e) => { setUserName(e.target.value) }}
                    />
              <UserIcon url={iconUrl} />
              </div>)
              : null
            }
          </div>
        </div>
        <div className="flex justify-between w-70">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-4xl disabled:opacity-50"
            onClick={() => {setPageNum((prev) => (prev - 1))}}
            disabled={pageNum === 0}
          >
            戻る
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-4xl  disabled:opacity-50"
            onClick={async () => {
              switch(pageNum){
                case 0:
                  await toUserNameForm();
                  return;
                case 1:
                  await submitUser();
                  return;
                default:
                  return;
              }
            }}
            disabled={pageNum === 3}
          >
            次へ
          </button>
        </div>
      </div>
  )
}