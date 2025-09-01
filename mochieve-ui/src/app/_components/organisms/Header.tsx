"use client"

import { APP_NAME } from "@/app/_constants/app";
import { openPostFormModal } from "@/app/_state/slice/modal";
import { store } from "@/app/_state/store";
import { OrganismsUserMenu } from "./UserMenu";
import { getUserInfo } from "@/app/_composables/userInfo";
import { useEffect, useState } from "react";

export default function OrganismsHeader() {
  const [userInfo, setUserInfo] = useState(getUserInfo());

  useEffect(() => {
    setUserInfo(getUserInfo());
    // Perform side effects here
  }, []);

  const createNewWorks = () => {
    //TODO:認証したユーザの投稿状況を確認し、新しい投稿を作成できるか確認する（MAX3件）
    console.log("新しいプロジェクトを作成");
    store.dispatch(openPostFormModal());
  };

  return (
    <header className="bg-white-300 shadow flex flex-col justify-between w-80">
      <div>
        <div className="p-3">
          <h1 className="text-4xl font-semibold text-green-800">{APP_NAME}</h1>
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
