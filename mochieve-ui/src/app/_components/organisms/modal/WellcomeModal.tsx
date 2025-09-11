"use client";
import { useState } from "react";
import { MoleculesModal } from "../../molecules/Modal";

const setVisited = () => {
  window.localStorage.setItem("visited", "true");
};

const wellcomePages = [
  (<div>
    <h2 className="text-3xl font-bold mb-10">Mochieve(もちべ) へようこそ！</h2>
    <p className="mb-10">Mochieve(もちべ) とは？ </p>
    <p className="mb-4">あなたの日々の進捗を気軽に投稿・シェアしてモチベーション維持をサポートします</p>
    <p className="mb-4">1．作業を投稿しよう！</p>
  </div>),
  (<div>
    <h2 className="text-3xl font-bold mb-10">ルール</h2>
    <p className="mb-4">R18な内容は投稿しない</p>
    <p className="mb-4">その他不適切な内容は投稿しない</p>
    <p className="mb-4">1つの作業グループは1日に1回の投稿まで</p>
    <p className="mb-4">同時に3つの作業まで投稿可能（作業完了したものを除く）</p>
    <p className="mb-4">作業投稿には必ず画像とノートを記載しよう</p>
  </div>),
  (<div>
    <p className="mb-4">3．作業を完了させよう！</p>
  </div>),
  (<div>
    <p className="mb-4">4．作業をシェアしよう！</p>
  </div>),
]

export const OrganismsWellcomeModal = () => {
  const [pageIndex, setPageIndex] = useState<number>(0);
  const allPages = wellcomePages.length;

  // const isFirst = window.localStorage.getItem("visited");
  // if (!isFirst) return null;
  return (
      <div className="overlay">
        <div className="project-form m-3 w-[800px] text-xl flex flex-col text-center bg-white p-10 rounded-3xl">
          <div className="h-[400px]">
            {wellcomePages[pageIndex]}
          </div>
            <div className="flex justify-between items-center w-full mt-4">
            <button
              onClick={() => setPageIndex((prev) => Math.max(prev - 1, 0))}
              disabled={pageIndex === 0}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              前へ
            </button>
            <span className="mx-4 text-lg">
              {pageIndex + 1} / {allPages}
            </span>
            {pageIndex < allPages - 1
            ? (<button
              onClick={() => setPageIndex((prev) => Math.min(prev + 1, allPages - 1))}
              disabled={pageIndex === allPages - 1}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
              >
              次へ
              </button>)
              : (<button
              onClick={() => setPageIndex((prev) => Math.min(prev + 1, allPages - 1))}
              disabled={pageIndex !== allPages - 1}
              className="px-4 py-2 bg-green-500 rounded text-white"
              >
              はじめる
              </button>)
            }
            </div>
        </div>
    </div>
  );
};
