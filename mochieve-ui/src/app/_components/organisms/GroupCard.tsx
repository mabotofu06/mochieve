"use client";

import React, { useState } from "react";
import { createElement } from "react";
import { OrganismsReactionButton } from "./ActionButton";
import { OrganismsStampButton } from "./StampButton";
import { WorkGroup } from "@/app/_type/data";
import { addWorkGroupDetail } from "@/app/_state/storage";
import { openImageModal } from "@/app/_state/slice/modal";
import { store } from "@/app/_state/store";
import { DateTime } from "luxon";
import { encodeDatetime } from "@/app/_constants/utils/utils";
import { AtomsDisplayTextArea } from "../atoms/DisplayTextArea";

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
  const updatedAt = encodeDatetime(props.group.updatedAt);

  const displayTitle = props.group.title || "無題の作業";
  const displayNote = props.group.note || "説明文はまだありません";

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
      {createElement(
        "div",
        { className: `header absolute top-0 flex items-center justify-between w-full p-2 z-50 border-b border-green-600 ${props.group.isClose?" bg-green-100": "bg-white"}` }, [
        <div key="header-user" className="flex items-center">
          <img className={"user-icon bg-green-800 rounded-full " + iconSize} src={props.group.userInfo.iconImg} />
          <div className="user-info ml-3 flex flex-col justify-center text-md">
            <h2 className="user-name font-semibold">{props.group.userInfo.name}</h2>
            <p className="user-id text-xs">{props.group.userInfo.id}</p>
          </div>
        </div>,
        <div key="header-update" className="post-update text-gray-500">
          更新：{updatedAt}
        </div>
      ]
      )
    }
      <div className="image-container flex justify-center h-[600px] overflow-hidden bg-gray-100">
      <img
        className="hover:opacity-80"
        src={props.group.images[imgIdx]}
        alt={`Post Image ${imgIdx+1}`}
        loading="lazy"
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
      {createElement(
        'div',
        {className: `footer absolute bottom-0 p-4 w-full border-t border-green-600 ${props.group.isClose?" bg-green-100": "bg-white"}`}, [
        <div className="image-indicator flex justify-center mb-5">
          <div className="flex gap-2 z-50">
            {props.group.images.map((_, i) => (
              <span
                key={i}
                className={`inline-block w-3 h-3 rounded-full ${imgIdx === i ? 'bg-green-600' : 'bg-gray-300'} transition-all`}
              />
            ))}
          </div>
        </div>,

        <div className="post-details flex flex-col w-full items-center">
          <div className="flex h-20 justify-between w-full items-top mb-3">
            <div className="w-2/3 overflow-hidden">
              <div className="relative">
                <h2 className="post-title text-xl font-semibold mb-1 h-8 overflow-hidden">
                  {displayTitle}
                </h2>
                <div
                  className={`absolute right-0 top-0 h-full w-12 pointer-events-none bg-gradient-to-r ${props.group.isClose ? "from-transparent to-green-100" : "from-transparent to-white"}`}
                />
              </div>
              <div className="relative">
                <AtomsDisplayTextArea
                  className="post-content w-full px-3 overflow-y-hidden text-gray-500"
                  value={displayNote}
                  rows={2}
                />
                <div className={`absolute w-full bottom-0 h-10 bg-gradient-to-b ${props.group.isClose ? "from-transparent to-green-100" : "from-transparent to-white"}`}></div>
              </div>
            </div>
            <div className="ms-8 flex flex-col justify-between">
              <div className="post-stats text-lg">
                投稿数:
                <span className="post-num text-green-600 font-semibold ms-3">
                  {props.group.images.length}
                </span>
              </div>
              <button className="text-green-600 bg-white font-bold hover:opacity-60 cursor-pointer border border-lime-500 py-1 px-3 rounded-3xl" onClick={() => NavigateToWorkGroupPage(props.group.id)}>
                もっとみる＞
              </button>
            </div>

          </div>
        </div>
      ])}
    </div>
  ));
}
