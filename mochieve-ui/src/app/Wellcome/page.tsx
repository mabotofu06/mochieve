"use client";
import React, { useEffect, useState } from "react";
import { store } from "../_state/store";
import { setLoading } from "../_state/slice/modal";
import { APP_SERVICE } from "../_constants/app";

interface RuleItem {
  text: string;
  image?: string;
  imageAlt?: string;
}

export default function Wellcome() {
  // ページネーション状態管理
  const [currentPage, setCurrentPage] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const rules: RuleItem[] = [
    {
      text: "「画像」と「説明文」を書いて作業を投稿を開始",
      image: "screenshots/rules/post1.png",
      imageAlt: "作業投稿開始の画面"
    },
    {
      text: "作業投稿を開始したら、作業の「タイトル」と「説明」も書いてみよう！<br />タイムラインからどんな作業がしてるか伝わりやすくなるよ",
      image: "screenshots/rules/group2.png",
      imageAlt: "作業のタイトルと説明を入力している画面"
    },
    {
      text: "1つの作業中ポストは1日に1回の投稿が可能<br />翌日の0時（日本時間）を過ぎると再度投稿可能",
      image: "/screenshots/rules/daily-post-limit.png",
      imageAlt: "1日1回の投稿制限の説明画面"
    },
    {
      text: "1つの作業には12個まで進捗投稿が可能<br />12個目の投稿時点で作業完了となります",
      image: "/screenshots/rules/post-limit.png",
      imageAlt: "12個までの進捗投稿制限の説明画面"
    },
    {
      text: "12個まで投稿しなくても「編集」ボタン=>「作業を完了にする」ボタンからも途中で作業完了にできます<br />完了した作業は再度「作業中」に戻すことはできないので注意してね",
      image: "screenshots/rules/group2.png",
      imageAlt: "作業完了ボタンの画面"
    },
    {
      text: "同時に「作業中」にできる作業投稿は3つまで<br />新しく作業投稿を作成する場合は「作業中」投稿を「完了」にしてね",
      image: "/screenshots/rules/work-limit.png",
      imageAlt: "作業中の投稿数制限の説明画面"
    },
    {
      text: "α版ではフィルターやモザイク機能などはありません<br />誰でも閲覧可能なサービスなので公序良俗に反する内容やR18な内容は禁止です",
      image: "/screenshots/rules/content-guidelines.png",
      imageAlt: "コンテンツガイドラインの説明画面"
    },
    {
      text: "α版のため機能の不具合や突然の変更が起こりうることご了承ください<br />不具合や要望、改善点がありましたら開発者へご連絡いただけると幸いです。",
      image: "/screenshots/rules/bug-report.png",
      imageAlt: "バグ報告の説明画面"
    },
    {
      text: "プライバシーポリシーについての詳細は<a href='/Info/Policy' class='text-green-600 underline hover:text-green-800'>こちら</a>をご覧ください",
      image: "/screenshots/rules/bug-report.png",
      imageAlt: "バグ報告の説明画面"
    },
  ]

  // ページネーション制御
  const totalPages = rules.length;
  const isLastPage = currentPage === totalPages - 1;
  const isFirstPage = currentPage === 0;

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      // 最後のページに到達したら完了フラグを立てる
      if (nextPage === totalPages - 1) {
        setIsCompleted(true);
      }
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    store.dispatch(setLoading(false));
  }, []);

  return (
    <main className="flex flex-col items-center min-h-screen bg-white py-8 px-5">
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
      
      {/* 進捗インジケーター */}
      <div className="w-full max-w-4xl mb-6">
        <div className="flex items-center justify-center gap-2 mb-4">
          {rules.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                index <= currentPage ? 'bg-green-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
        <p className="text-center text-sm text-gray-600">
          {currentPage + 1} / {totalPages}
        </p>
      </div>

      {/* 現在のルール表示 */}
      <div className="w-full max-w-4xl mb-8">
        <div className="p-6 bg-gray-50 rounded-lg shadow-sm min-h-[400px]">
          <div className="flex flex-col gap-6">
            {/* ルール番号とテキスト */}
            <div className="w-full">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {currentPage + 1}
                </span>
                <div className="text-lg text-gray-700">
                  <span dangerouslySetInnerHTML={{ __html: rules[currentPage].text }} />
                </div>
              </div>
            </div>
            
            {/* スクリーンショット画像 */}
            {rules[currentPage].image && (
              <div className="w-full flex justify-center">
                <div className="bg-white rounded-lg p-3 shadow-md max-w-md">
                  <img
                    src={rules[currentPage].image}
                    alt={rules[currentPage].imageAlt}
                    className="w-full h-auto rounded-md"
                    onError={(e) => {
                      // 画像が見つからない場合のプレースホルダー
                      const target = e.target as HTMLImageElement;
                      target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='200' viewBox='0 0 320 200' fill='%23f3f4f6'%3E%3Crect width='320' height='200' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='0.3em' fill='%23999' font-family='Arial, sans-serif' font-size='14'%3E%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88%E4%BE%8B%3C/text%3E%3C/svg%3E";
                      target.alt = "スクリーンショット例（準備中）";
                    }}
                  />
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    {rules[currentPage].imageAlt}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ページネーションコントロール */}
      <div className="flex items-center justify-between w-full max-w-4xl mb-8">
        <button
          onClick={handlePrevPage}
          disabled={isFirstPage}
          className={`px-6 py-2 rounded transition-colors ${
            isFirstPage 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
              : 'bg-green-500 text-white hover:bg-green-600'
          }`}
        >
          ← 前へ
        </button>
        
        <span className="text-gray-600 font-medium">
          ルール {currentPage + 1} / {totalPages}
        </span>
        
        <button
          onClick={handleNextPage}
          disabled={isLastPage}
          className={`px-6 py-2 rounded transition-colors ${
            isLastPage 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
              : 'bg-green-500 text-white hover:bg-green-600'
          }`}
        >
          次へ →
        </button>
      </div>

      {/* はじめるボタン */}
      <div className="text-center">
        {isCompleted ? (
          <a 
            href={APP_SERVICE.TOP.link} 
            className="px-8 py-3 bg-green-500 text-white text-lg rounded hover:bg-green-600 transition-colors shadow-lg"
          >
            はじめる
          </a>
        ) : (
          <div>
            <button 
              disabled 
              className="px-8 py-3 bg-gray-300 text-gray-500 text-lg rounded cursor-not-allowed shadow-lg"
            >
              はじめる
            </button>
            <p className="text-sm text-gray-600 mt-2">
              すべてのルールを確認してからご利用ください
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
