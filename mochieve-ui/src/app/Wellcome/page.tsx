"use client";
import React, { useEffect } from "react";
import { store } from "../_state/store";
import { setLoading } from "../_state/slice/modal";
import { APP_SERVICE } from "../_constants/app";

export default function Wellcome() {
  const rules = [
    "投稿は必ず画像とテキストを書いてね",
    "進捗中の作業は同時に3つまで",
    "1つの進捗は1日に1回の進捗投稿が可能",
    "誰でも閲覧可能なサービスなので公序良俗に反する内容やR18コンテンツは禁止です。",
    "",
  ]


  useEffect(() => {
    store.dispatch(setLoading(false));
  }, []);

  return (
    <main className="flex flex-col items-center h-screen bg-white py-8">
      <h1 className="text-4xl font-bold mb-4">
        Mochieve（もちべ）へようこそ！
      </h1>
      <div className="text-lg mb-6 text-gray-700">
        Mochieve（もちべ）は「気軽に進捗を投稿してモチベーションを維持する」をコンセプトにしたコミュニティ型進捗管理サービスです。
        <br />
        進捗を投稿し、仲間と応援し合いながら目標達成を目指しましょう。
      </div>
      <h1 className="text-2xl font-bold mb-4">ルール（α版時点）</h1>
      <ul className="list-disc text-left mb-8 text-gray-600">
        {rules.map((rule, index) => (
          <li className="mb-2 text-lg" key={index}>{rule}</li>
        ))}
      </ul>
      <a href={APP_SERVICE.TOP.link} className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition">はじめる</a>
    </main>
  );
}
