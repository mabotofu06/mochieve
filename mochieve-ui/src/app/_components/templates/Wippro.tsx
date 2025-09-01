'use client'

import { useState } from "react";
import { ActionMenu } from "../organisms/GroupCard";
import { OrganismsPostCard } from "../organisms/PostCard";
import { store } from "@/app/_state/store";
import { openPostFormModal } from "@/app/_state/slice/modal";
import { OrganismsPostFormModal } from "../organisms/modal/PostFormModal";
import { OrganismsPostListHeaderCard } from "../organisms/PostListHeaderCard";

const userInfo = {
  name     : "まーぼーどーふ",
  id       : "@mabotofu06",
  iconImage: "",
  info     : "説明文説明文説明文説明文説明文説明文説明文説明文説明文説明文説明文説明文説明文説明文説明文説明文説明文説明文説明文説明文説明文",
  links    : [
    { title: "リンク1", url: "https://example.com/1" },
    { title: "リンク2", url: "https://example.com/2" },
    { title: "リンク3", url: "https://example.com/3" },
  ]
};

const postData = {
  title: "",
  content: "",
  image: "https://pbs.twimg.com/media/GMQKeJIaoAAhx9v?format=jpg",
  update: Date.now() - 1000 * 60 * 60 * 24 * 2, // 2 days ago
  postNum: 13
};


export default function TemplatesWippro() {
  const [activeTab, setActiveTab] = useState<number>(0);
  const iconSize = "w-15 h-15";

  return (
    <div className="flex flex-col bg-white h-screen">
      <OrganismsPostListHeaderCard
        userInfo={userInfo}
        editable={true}
        updated={new Date(postData.update).toLocaleDateString()}
        title={postData.title}
        note={postData.content}
        likeNum={0}
        isLike={false}
        bookmarkNum={0}
        isBookmark={false}
        stamps={[]}
        postNum={postData.postNum}
      />

      {/* 表示切替タブ（アイコンボタン） */}
      <div className="flex items-center justify-between my-4">
        <div className="flex items-center">
        <span className="mr-2">表示サイズ：</span>
        <button
          className={`p-2 rounded-full border flex items-center justify-center w-10 h-10 ${activeTab===0 ? 'bg-green-600 text-white' : 'bg-white text-green-600'}`}
          onClick={()=>setActiveTab(0)}
          aria-label="カード表示"
        >
            {/* カードアイコン（リスト→■3つ） */}
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <rect x="4" y="4" width="16" height="16" rx="4" />
            </svg>
        </button>
        <button
          className={`p-2 rounded-full border flex items-center justify-center w-10 h-10 ${activeTab===1 ? 'bg-green-600 text-white' : 'bg-white text-green-600'}`}
          onClick={()=>setActiveTab(1)}
          aria-label="タイル表示"
        >
          {/* タイルアイコン（グリッド） */}
          <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <rect x="4" y="4" width="7" height="7" rx="2" />
            <rect x="13" y="4" width="7" height="7" rx="2" />
            <rect x="4" y="13" width="7" height="7" rx="2" />
            <rect x="13" y="13" width="7" height="7" rx="2" />
          </svg>
        </button>
        </div>

        <button
          className="new-post-button bg-green-500 text-white py-2 px-4 rounded-3xl"
          onClick={() => store.dispatch(openPostFormModal())}
        >
          新しいポスト
        </button>

      </div>

      <div className="flex flex-col" style={{minHeight: "calc(100vh - 350px)"}}>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {activeTab === 0 ? (
            Array.from({ length: 13 }, (_, index) => (
              <OrganismsPostCard className="mt-3" key={index} />
            ))
          ) : activeTab === 1 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-2">
              {Array.from({ length: 13 }, (_, index) => (
                <OrganismsPostCard key={index} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-5 gap-4 p-2">
              {Array.from({ length: 13 }, (_, index) => (
                <OrganismsPostCard key={index} />
              ))}
            </div>
          )}
        </div>
      </div>

      <OrganismsPostFormModal/>
    </div>
  );
}