'use client'
import { WorkGroup, WorkPost } from "@/app/_type/data";
import { OrganismsPostCard } from "../organisms/PostCard";
import { OrganismsPostListHeaderCard } from "../organisms/PostListHeaderCard";
import { store } from "@/app/_state/store";
import { openPostFormModal, setLoading } from "@/app/_state/slice/modal";
import { useState } from "react";

type Props = {
  isAuthor: boolean;
  workGroup: WorkGroup;
  workPosts: WorkPost[];
}

export const TemplatesWorkGroup = (props: Props) => {
  const [cardSize, setCardSize] = useState<number>(0); // 0:大, 1:小
  store.dispatch(setLoading(false));

  return (
    <div className="flex flex-col relative w-full h-screen items-center">
      <OrganismsPostListHeaderCard
        userInfo={props.workGroup.userInfo}
        isAuthor={props.isAuthor}
        title={props.workGroup.title}
        note={props.workGroup.note}
        likeNum={0}
        isLike={false}
        bookmarkNum={0}
        isBookmark={false}
        stamps={[]}
        postNum={props.workGroup.images.length}
        updated={new Date(props.workGroup.updatedAt).toLocaleDateString()}
      />
      <div className="flex justify-center items-center bg-white gap-5 my-3">
        {/* TODO:後々ポストカードサイズを変更できるようにする */}
        {/*
        <div className="flex gap-3">
          <button
            className={`w-10 h-10 rounded-full border ${cardSize === 0 ? 'bg-green-600 text-white' : 'bg-white text-gray-700'} transition`}
            onClick={() => setCardSize(0)}
            aria-label="大きく表示"
          >
            大
          </button>
          <button
            className={`w-10 h-10 rounded-full border ${cardSize === 1 ? 'bg-green-600 text-white' : 'bg-white text-gray-700'} transition`}
            onClick={() => setCardSize(1)}
            aria-label="小さく表示"
          >
            小
          </button>
        </div> */}
      </div>
      <div className="work-posts flex-1 overflow-y-scroll custom-scrollbar px-3 pt-3">
        {props.workPosts.map(post => (
          <OrganismsPostCard className="my-8" key={post.id} post={post} />
        ))}
      </div>

      {props.isAuthor &&
          <button
            className="bg-green-600 text-white py-4 px-6 rounded-4xl text-xl opacity-100 w-fit my-5"
            onClick={()=>store.dispatch(openPostFormModal({ groupId: props.workGroup.id }))}
          >
            今日の進捗を投稿
          </button>
      }
    </div>
  );
}