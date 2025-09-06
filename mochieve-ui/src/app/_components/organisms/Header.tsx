"use client"

import { APP_NAME } from "@/app/_constants/app";
import { openErrorModal, openPostFormModal } from "@/app/_state/slice/modal";
import { store } from "@/app/_state/store";
import { OrganismsUserMenu } from "./UserMenu";
import { getUserInfo } from "@/app/_composables/userInfo";
import { useEffect, useState } from "react";

import {Caveat_Brush} from 'next/font/google'
import {Pacifico} from 'next/font/google'
import { Hachi_Maru_Pop } from "next/font/google";

const caveatBrush = Caveat_Brush({
  variable: "--font-caveat-brush",
  subsets: ["latin"],
  weight: "400",
});

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
  const [userInfo, setUserInfo] = useState(getUserInfo());

  useEffect(() => {
    setUserInfo(getUserInfo());
    // Perform side effects here
  }, []);

  const createNewWorks = () => {
    store.dispatch(openErrorModal({ title: "新機能準備中", message: "新しい投稿機能は現在準備中です。しばらくお待ちください。" }));
    return;

    //TODO:認証したユーザの投稿状況を確認し、新しい投稿を作成できるか確認する（MAX3件）
    console.log("新しいプロジェクトを作成");
    store.dispatch(openPostFormModal({ groupId: null }));
  };

  return (
    <header className="bg-white-300 shadow flex flex-col justify-between w-80">
      <div>
        <div className="flex flex-col p-3 text-green-800 items-center mb-10" onClick={()=>{location.href="/Top"}}>
          <h1 className={"text-5xl font-semibold "+pacifico.className}>{APP_NAME}</h1>
          <span className={"mt-2 mb-1 "+hachiMaruPop.className}>もちべ</span>
          <span className={"text-sm "+caveatBrush.className}>-日々の進捗を共有しよう！-</span>
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
    </header>
  );
}
