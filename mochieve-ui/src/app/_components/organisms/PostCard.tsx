"use client";

import { createElement, useState } from "react";
import { OrganismsStampButton } from "./StampButton";
import { WorkPost } from "@/app/_type/data";
import { store } from "@/app/_state/store";
import { openImageModal } from "@/app/_state/slice/modal";
import { encodeDatetime } from "@/app/_constants/utils/utils";
import { createLogger } from "@/app/_constants/utils/logger";

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
  const logger = createLogger('OrganismsPostCard');
  logger.debug("Rendering PostCard", { postId: props.post.id });
  const iconSize = props.size === 'small' ? "w-7 h-7" : "w-10 h-10";
  const [footerOpen, setFooterOpen] = useState(false);
  const [footerAnim, setFooterAnim] = useState<'expand'|'collapse'|''>('');
  const [showFooter, setShowFooter] = useState(false);
  const updatedAt = encodeDatetime(props.post.createdAt);

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
      <div className="header absolute top-0 p-2 w-full bg-white border-b border-green-500 z-50">
        <span>投稿日: {updatedAt}</span>
      </div>

      {/* 画像 */}
      <div className="flex justify-center items-center bg-gray-100">
        <img
          className="post-image hover:opacity-80"
          src={props.post.image}
          alt="Post Image"
          loading="lazy"
          onClick={() => store.dispatch(openImageModal(props.post.image))}
        />
      </div>

      {/* フッター */}
      <div
        className="footer absolute bottom-0 bg-white p-1 w-full border-green-500 border-t"
         onClick={handleFooterToggle}
      >
        {showFooter && (
          <div
            className={`w-full ${footerAnim === 'expand' ? 'animate-footer-expand' : ''} ${footerAnim === 'collapse' ? 'animate-footer-collapse' : ''}`}
            style={{bottom: '60px', maxHeight: footerAnim === '' ? '0' : undefined, overflow: 'hidden'}}
          >
            <p
              //XSSの脆弱性あり
              className="post-content m-3"
              dangerouslySetInnerHTML={{
              __html: props.post.note.replace(/\n/g, "<br />"),
              }}
            />
          </div>
        )}
        <div className="flex justify-end items-center">
          <div className="actions flex items-center gap-6 mt-2">
            {/* <OrganismsStampButton /> */}
          </div>
          
          <button
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
