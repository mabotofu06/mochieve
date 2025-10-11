"use client";
import React, { useEffect } from "react";
import { store } from "../_state/store";
import { setLoading } from "../_state/slice/modal";
import { APP_SERVICE } from "../_constants/app";

export default function Wellcome() {
  const rules = [
    "「画像」と「説明文」を書いて作業を投稿",
    "作業を開始したら、12を投稿",
    "「作業中」の投稿グループは3つまで（新しく投稿グループを作りたい場合は投稿グループを完了に）",
    "1つの作業中ポストは1日に1回の投稿",
    "誰でも閲覧可能なサービスなので公序良俗に反する内容やR18な内容は禁止",
    "α版でバグや不具合があるため、見つけたら運営までご連絡ください",
  ]

  useEffect(() => {
    store.dispatch(setLoading(false));
  }, []);

  return (
    <main className="flex flex-col items-center h-screen bg-white py-8 px-5">
      <h1 className="text-4xl font-bold mb-4">
        Mochieve（もちべ）へようこそ！
      </h1>
      <div className="text-lg mb-6 text-gray-700 text-center">
        Mochieve（もちべ）は「気軽に進捗を投稿してモチベーションを維持する」をコンセプトにした
        <br />
        コミュニティ型進捗管理サービスです。
        <br />
        進捗を投稿する人もしない人も、応援し合いながら目標達成を目指しましょう！！
      </div>
      <h1 className="text-2xl font-bold mb-4 mt-10">ルール（α版時点）</h1>
      <ul className="list-disc text-left mb-8 text-gray-600">
        {rules.map((rule, index) => (
          <li className="mb-2 text-lg" key={index}>{rule}</li>
        ))}
      </ul>
      <a href={APP_SERVICE.TOP.link} className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition">
        はじめる
      </a>
    </main>
  );
}
