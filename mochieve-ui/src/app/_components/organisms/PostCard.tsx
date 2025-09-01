"use client";

import { createElement, useState } from "react";
import { OrganismsReactionButton } from "./ActionButton";
import { OrganismsStampButton } from "./StampButton";
import { WorkPost } from "@/app/_type/data";

export const ActionMenu = ()=>{
  return(
    <div className="actions flex items-center gap-6 mt-2">
      <OrganismsStampButton />
    </div>
  )
}

type Props = {
  className?: string;
  size?: 'normal'|'small';
  post: WorkPost;
}

export function OrganismsPostCard(props: Props) {
  console.log("Rendering PostCard:", props.post);
  const iconSize = props.size === 'small' ? "w-7 h-7" : "w-10 h-10";
  const [footerOpen, setFooterOpen] = useState(false);
  const [footerAnim, setFooterAnim] = useState<'expand'|'collapse'|''>('');
  const [showFooter, setShowFooter] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  const handleFooterToggle = () => {
    if (footerOpen) {
      setFooterAnim('collapse');
      setTimeout(() => {
        setFooterOpen(false);
        setFooterAnim('');
        setShowFooter(false);
      }, 600); // collapse animation duration
    } else {
      setShowFooter(true);
      setFooterOpen(true);
      setFooterAnim('expand');
    }
  };

  return createElement("div",
    { className: `post-card relative border border-lime-500 rounded-2xl overflow-hidden bg-white${props.className ? ' '+props.className : ''}` }, (
    <div>
      <div className="header absolute top-0 p-2 w-full bg-white border-b border-green-500">
        <span>投稿日: {new Date(props.post.createdAt).toLocaleDateString()}</span>
      </div>
      {/* 画像 全体表示（高さは画像に合わせる） */}
      <div className="flex justify-center items-center bg-gray-100">
        <img
          src={props.post.image}
          alt="Post Image"
          onClick={() => setShowOverlay(true)}
        />
      </div>

      {/* オーバーレイ画像表示 */}
      {showOverlay && (
        <div
          className="overlay"
          onClick={() => setShowOverlay(false)}
        >
          <img
            src={props.post.image}
            alt="拡大画像"
            style={{maxWidth: "90vw", maxHeight: "90vh", borderRadius: "16px", boxShadow: "0 0 32px #0008"}}
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}

      {/* フッター */}
      <div className="footer absolute bottom-0 bg-white p-2 w-full border-green-500 border-t">
        {showFooter && (
          <div
            className={`w-full ${footerAnim === 'expand' ? 'animate-footer-expand' : ''} ${footerAnim === 'collapse' ? 'animate-footer-collapse' : ''}`}
            style={{bottom: '60px', maxHeight: footerAnim === '' ? '0' : undefined, overflow: 'hidden'}}
          >
            <p className="post-content m-3">{props.post.note}</p>
          </div>
        )}
        <div className="flex justify-between items-center">
          <div className="actions flex items-center gap-6 mt-2">
            {/* <OrganismsStampButton /> */}
          </div>
          
          <button
            onClick={handleFooterToggle}
            className="bg-none border-none cursor-pointer p-0 mr-2"
          >
            {footerOpen ? (
              <svg width="40" height="40" fill="currentColor" viewBox="0 0 24 24"><path d="M7 14l5-5 5 5"/></svg>
            ) : (
              <svg width="40" height="40" fill="currentColor" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5"/></svg>
            )}
          </button>
        </div>
      </div>
    </div>
  ));
}
