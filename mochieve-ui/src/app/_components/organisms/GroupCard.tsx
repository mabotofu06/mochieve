"use client";

import React, { useState } from "react";
import { createElement } from "react";
import { OrganismsReactionButton } from "./ActionButton";
import { OrganismsStampButton } from "./StampButton";
import { WorkGroup } from "@/app/_type/data";
import { addWorkGroupDetail } from "@/app/_state/storage";
import { openImageModal } from "@/app/_state/slice/modal";
import { store } from "@/app/_state/store";

export const ActionMenu = ()=>{
  return(
    <div className="actions flex items-center gap-6 mt-2"> 
      <OrganismsReactionButton
        isLike={false}
        isBookmark={false}
        likeNum={0}
        bookmarkNum={0}
      />
      <OrganismsStampButton />
    </div>
  )
}

type Props = {
  className?: string;
  group: WorkGroup;
}

export function OrganismsGroupCard(props: Props) {
  const iconSize = "w-10 h-10";
  const [imgIdx, setImgIdx] = useState(0);
  const total = props.group.images.length;
  const handlePrev = () => setImgIdx(idx => (idx - 1 + total) % total);
  const handleNext = () => setImgIdx(idx => (idx + 1) % total);

  const NavigateToWorkGroupPage = (groupId: string) => {
    //セッションに本ワークグループを登録
    addWorkGroupDetail(groupId, props.group, []);
    location.href = `/Work/Group/${groupId}`;
  }

  const openImage =(src: string) => {
    store.dispatch(openImageModal(src));
  }

  return createElement("div", { className: `post-card relative border rounded-lg overflow-hidden ${props.className}` }, (
    <div>
      {/* Header */}
      {createElement("div", { className: `header absolute top-0 flex items-center justify-between w-full p-2 z-50 ${props.group.isClose?" bg-green-100": "bg-white"}` }, [
        <div key="header-user" className="flex items-center">
          <div className={"user-icon bg-green-800 rounded-full " + iconSize}></div>
          <div className="user-info ml-3 flex flex-col justify-center text-md">
            <h2 className="user-name font-semibold">{props.group.userInfo.name}</h2>
            <p className="user-id text-xs">{props.group.userInfo.id}</p>
          </div>
        </div>,
        <div key="header-update" className="post-update text-gray-500">
          更新：{new Date(props.group.updatedAt).toLocaleDateString()}
        </div>
      ]
      )
    }
      <div className="image-container flex items-center h-[600px] overflow-hidden bg-gray-100">
      <img
        src={props.group.images[imgIdx]}
        alt={`Post Image ${imgIdx+1}`}
        onClick={()=>{openImage(props.group.images[imgIdx])}}
      />
      </div>
      {/* 画像スライダー */}
      { total > 1 && (
        <div>
        <button
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 shadow hover:bg-green-100"
          onClick={handlePrev}
          aria-label="前の画像"
        >
          <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"/></svg>
        </button>
        <button
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 shadow hover:bg-green-100"
          onClick={handleNext}
          aria-label="次の画像"
        >
          <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>
        </button>
        </div>
      )}

      {/* Footer */}
      {createElement('div', {className: `footer absolute bottom-0 p-4 w-full ${props.group.isClose?" bg-green-100": "bg-white"}`}, [
        <div key="footer-dots" className="flex justify-center">
          <div className="flex gap-2 z-50">
            {props.group.images.map((_, i) => (
              <span
                key={i}
                className={`inline-block w-3 h-3 rounded-full ${imgIdx === i ? 'bg-green-600' : 'bg-gray-300'} transition-all`}
              />
            ))}
          </div>
        </div>,
        <div key="footer-details" className="post-details flex flex-col w-full items-center">
          <div className="flex max-h-16 justify-between w-full items-center">
            <div className="w-4/5 overflow-hidden">
              <h2 className="post-title text-xl font-semibold">{props.group.title}</h2>
              <p className="post-content">{props.group.note}</p>
            </div>
            <div className="ms-8">
              投稿数:
              <span className="post-num text-green-600 font-semibold ms-3">
                {props.group.images.length}
              </span>
            </div>

          </div>
          <button className="mt-2 hover:underline cursor-pointer" onClick={() => NavigateToWorkGroupPage(props.group.id)}>
            →これまでの作業内容をみる
          </button>
        </div>
        // TODO:v0.1以降実装 <ActionMenu />
      ])}
    </div>
  ));
}
