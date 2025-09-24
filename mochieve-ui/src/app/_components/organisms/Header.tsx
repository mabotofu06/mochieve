"use client"

import { APP_HOST, APP_NAME, APP_SERVICE, BL_INFO, MAX_POST_NUM, MAX_WORKING_POST_NUM } from "@/app/_constants/app";
import { openErrorModal, openPostFormModal } from "@/app/_state/slice/modal";
import { store } from "@/app/_state/store";
import { OrganismsUserMenu } from "./UserMenu";
import { getUserInfo } from "@/app/_composables/userInfo";
import { useEffect, useState } from "react";

import {Pacifico} from 'next/font/google'
import { Hachi_Maru_Pop } from "next/font/google";
import { getFetch } from "@/app/_constants/fetch";
import { ErrorResponse, SuccessResponse } from "@/app/_type/api";
import { getMyWorksCache } from "@/app/_constants/localCache/myWork";
import { UserInfo } from "@/app/_type/data";
import { getCanNewPost, setCanNewPost } from "@/app/_constants/localCache/canNewPost";

const pacifico = Pacifico({
  variable: "--font-pacifico",
  subsets: ["latin"],
  weight: "400",
});

const hachiMaruPop = Hachi_Maru_Pop({
  variable: "--font-hachi-maru-pop",
  subsets: ["latin"],
  weight: "400",
});

export default function OrganismsHeader() {
  const [userInfo, setUserInfo] = useState<UserInfo | undefined>(undefined);

  useEffect(() => {
    setUserInfo(getUserInfo());
    // Perform side effects here
  }, []);

  const createNewWorks = async () => {
    const canNewPost = getCanNewPost();
    if(canNewPost === false) {
      store.dispatch(
        openErrorModal({
          title: "新しいプロジェクトの作成上限に達しています",
          message: `1ユーザーあたりのプロジェクト作成上限は${MAX_WORKING_POST_NUM}件です。既存のプロジェクトを削除してから再度お試しください。`
        }));
      return;
    }

    const checkRes = await getFetch<boolean>(BL_INFO.API_ENDPOINT.WORK_GROUP_CHECK);
    if(checkRes.status !== 200) {
      const checkResError = checkRes as ErrorResponse;
      store.dispatch(openErrorModal({
        title: checkResError.message,
        message: checkResError.details || "不明なエラーが発生しました。時間をおいて再度お試しください。"
      }));
      return;
    }
    const data = (checkRes as SuccessResponse<boolean>).data;
    setCanNewPost(data);
    if(!data){
      store.dispatch(
        openErrorModal({
          title: "新しいプロジェクトの作成上限に達しています",
          message: `1ユーザーあたりのプロジェクト作成上限は${MAX_WORKING_POST_NUM}件です。既存のプロジェクトを削除してから再度お試しください。`
        }));
      return;
    }
    console.log("新しいプロジェクトを作成");
    store.dispatch(openPostFormModal({ groupId: null }));
  };

  if(!userInfo) null;
  return (
    <header className="bg-white flex flex-col justify-between w-80 border-r border-gray-300 h-fit">
      <div>
        <div className="flex flex-col p-3 text-green-800 items-center mb-10" onClick={()=>{location.href=APP_SERVICE.TOP.link}}>
          <h1 className={"text-5xl font-semibold "+pacifico.className}>{APP_NAME}</h1>
          <span className={"mt-2 mb-1 " + hachiMaruPop.className}>もちべ</span>
          <span className={"text-sm " + hachiMaruPop.className}>-日々の進捗を気軽に共有しよう！-</span>
        </div>

        <OrganismsUserMenu userInfo={userInfo} />

        <div className="flex justify-center items-center mt-3">
          {userInfo ? (
            <button
              className="new-project-button p-4 bg-green-500 text-white rounded-3xl text-xl"
              onClick={createNewWorks}
            >
              新しい投稿を開始
            </button>
          ) : null}
        </div>
      </div>

      <div>
        <hr className="my-5 border-t border-gray-300" />

        <div className="flex flex-col justify-center mb-2 ms-5 gap-2 text-sm text-gray-600">
          <a href={APP_SERVICE.PRIVACY_POLICY.link} className="mr-2">プライバシーポリシー</a>
          <a
            href="https://github.com/mabotofu06/mochieve"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline flex items-center gap-1"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="inline-block">
              <path d="M12 2C6.477 2 2 6.484 2 12.012c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.091-.647.35-1.088.636-1.339-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.254-.446-1.274.098-2.656 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.382.202 2.402.1 2.656.64.7 1.028 1.595 1.028 2.688 0 3.847-2.337 4.695-4.566 4.944.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.579.688.481C19.138 20.188 22 16.437 22 12.012 22 6.484 17.523 2 12 2z"/>
            </svg>
            GitHub
          </a>
        </div>
        <a href={APP_HOST+"/Wellcome"}>Wellcomeページ</a>
        <br />
        <a href={APP_HOST+"/Invite?invite_code=testInviteCode"}>招待ページ（テスト用）</a>
        <p className="text-center text-gray-500 text-xs p-3">© 2024 {APP_NAME}. All rights reserved.</p>
      </div>
    </header>
  );
}
