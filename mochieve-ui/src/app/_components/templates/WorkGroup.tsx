'use client'
import { WorkGroup, WorkPost } from "@/app/_type/data";
import { OrganismsPostCard } from "../organisms/PostCard";
import { OrganismsPostListHeaderCard } from "../organisms/PostListHeaderCard";
import { store } from "@/app/_state/store";
import { openErrorModal, openPostFormModal, setLoading } from "@/app/_state/slice/modal";
import { useState } from "react";
import { DateTime } from "luxon";

type Props = {
  isAuthor: boolean;
  workGroup: WorkGroup;
  workPosts: WorkPost[];
}

export const TemplatesWorkGroup = (props: Props) => {
  const [cardSize, setCardSize] = useState<number>(0); // 0:大, 1:小
  store.dispatch(setLoading(false));

  const addPostForm = () => {
    if(props.workPosts.length < 1){
      throw new Error("Work posts data is required");
    }
    const latestPost = props.workPosts[props.workPosts.length - 1];
    const today = DateTime.now().setZone('Asia/Tokyo');
    const latestPostDate = DateTime.fromISO(latestPost.createdAt).setZone('Asia/Tokyo').plus({ hours: 9 });

    console.log("today:", today.toString());
    console.log("latest:", latestPostDate.toString());
    // if (latestPostDate.toISO().split('T')[0] === today.toISO().split('T')[0]) {
    //   store.dispatch(
    //     openErrorModal({title: "今日の投稿は既に完了しています", message: "明日の日付になるまでお待ちください"})
    //   );
    //   return;
    // }
    // store.dispatch(openPostFormModal({ groupId: props.workGroup.id }));
  }

  return (
    <div className="flex flex-col relative w-full h-screen items-center">
      <OrganismsPostListHeaderCard
        id={props.workGroup.id}
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
      </div>
      <div className="work-posts flex-1 overflow-y-scroll custom-scrollbar px-3 pt-3">
        {props.workPosts.map(post => (
          <OrganismsPostCard className="my-8" key={post.id} post={post} />
        ))}
      </div>

      {props.isAuthor &&
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