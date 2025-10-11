"use client";
import { WorkGroup, WorkPost, UserInfo } from "@/app/_type/data";
import { OrganismsPostCard } from "../organisms/PostCard";
import { OrganismsPostListHeaderCard } from "../organisms/PostListHeaderCard";
import { store } from "@/app/_state/store";
import { openErrorModal, openPostFormModal, setLoading } from "@/app/_state/slice/modal";
import { DateTime } from "luxon";
import { useState, useEffect } from "react";
import { BL_INFO } from "@/app/_constants/app";
import { getFetch } from "@/app/_constants/fetch";
import { SuccessResponse } from "@/app/_type/api";
import { createLogger } from "@/app/_constants/utils/logger";

type Props = {
  isAuthor: boolean;
  workGroup: WorkGroup;
  workPosts: WorkPost[];
}

export const TemplatesWorkGroup = (props: Props) => {
  const [isAuthor, setIsAuthor] = useState<boolean>(props.isAuthor);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const logger = createLogger('TemplatesWorkGroup');
  
  store.dispatch(setLoading(false));

  // クライアントサイドで認証状態を確認
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Cookieからアクセストークンを取得してユーザー情報を取得
        const response = await getFetch<UserInfo>(BL_INFO.API_ENDPOINT.CACHE_USER_INFO);
        
        if (response.status === 200) {
          const userInfo = (response as SuccessResponse<UserInfo>).data;
          // ログインユーザーのIDと作業グループの作成者IDを比較
          const authResult = userInfo.id === props.workGroup.userInfo.id;
          setIsAuthor(authResult);
          logger.debug(`クライアントサイド認証チェック結果: ${authResult ? '作成者' : '非作成者'}`, { userId: userInfo.id, workGroupOwnerId: props.workGroup.userInfo.id });
        } else {
          // 認証失敗の場合は非作成者として扱う
          setIsAuthor(false);
          logger.debug("認証なし、または認証失敗のため非作成者として表示");
        }
      } catch (error) {
        logger.error("クライアントサイド認証チェックに失敗", error);
        setIsAuthor(false);
      } finally {
        setIsAuthLoading(false);
      }
    };

    checkAuthStatus();
  }, [props.workGroup.userInfo.id]);

  const addPostForm = () => {
    if(props.workPosts.length < 1){
      throw new Error("Work posts data is required");
    }
    const latestPost = props.workPosts[props.workPosts.length - 1];
    const today = DateTime.now().setZone('Asia/Tokyo').toString().split('T')[0];
    const latestPostDate = DateTime.fromISO(latestPost.createdAt).setZone('Asia/Tokyo').toString().split('T')[0];

    if (latestPostDate === today) {
      store.dispatch(
        openErrorModal({title: "今日の進捗は投稿済です", message: "明日の日付になるまでお待ちください"})
      );
      return;
    }
    store.dispatch(openPostFormModal({ groupId: props.workGroup.id }));
  }

  // 認証チェック中はローディング表示
  if (isAuthLoading) {
    return (
      <div className="flex flex-col relative w-full h-screen items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <p className="text-gray-600">認証情報を確認中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col relative w-full h-screen items-center">
      <OrganismsPostListHeaderCard
        id={props.workGroup.id}
        userInfo={props.workGroup.userInfo}
        isAuthor={isAuthor}
        title={props.workGroup.title}
        note={props.workGroup.note}
        likeNum={0}
        isLike={false}
        bookmarkNum={0}
        isBookmark={false}
        stamps={[]}
        postNum={props.workGroup.images.length}
        updated={props.workGroup.updatedAt}
      />
      <div className="flex justify-center items-center bg-white gap-5 my-3">
      </div>
      <div className="work-posts flex-1 overflow-y-scroll custom-scrollbar px-3 pt-3">
        {props.workPosts.map(post => (
          <OrganismsPostCard className="my-8" key={post.id} post={post} />
        ))}
      </div>

      {isAuthor &&
          <button
            className="bg-green-600 text-white py-4 px-6 rounded-4xl text-xl opacity-100 w-fit my-5"
            onClick={addPostForm}
          >
            今日の進捗を投稿
          </button>
      }
    </div>
  );
}