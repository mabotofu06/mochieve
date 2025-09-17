"use client";
import React, { useEffect } from "react";
import { store } from "../_state/store";
import { setLoading } from "../_state/slice/modal";
import { APP_SERVICE } from "../_constants/app";

export default function Wellcome() {
  useEffect(() => {
    store.dispatch(setLoading(false));
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-white">
      <h1 className="text-4xl font-bold mb-4">Mochieveへようこそ！</h1>
      <p className="text-lg mb-6 text-gray-700">
        Mochieveは「みんなで目標を達成する」ためのコミュニティ型進捗管理サービスです。
        <br />
        進捗を投稿し、仲間と応援し合いながら目標達成を目指しましょう。
      </p>
      <ul className="list-disc text-left mb-8 text-gray-600">
        <li>進捗の投稿・共有</li>
        <li>グループでの目標管理</li>
        <li>応援・コメント機能</li>
        <li>画像アップロードによる成果の可視化</li>
      </ul>
      <a href={APP_SERVICE.TOP.link} className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition">はじめる</a>
    </main>
  );
}
