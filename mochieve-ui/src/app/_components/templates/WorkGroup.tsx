'use client'
import { WorkGroup, WorkPost } from "@/app/_type/data";
import { OrganismsPostCard } from "../organisms/PostCard";
import { OrganismsPostListHeaderCard } from "../organisms/PostListHeaderCard";
import { store } from "@/app/_state/store";
import { openPostFormModal } from "@/app/_state/slice/modal";

type Props = {
  isAuthor: boolean;
  workGroup: WorkGroup;
  workPosts: WorkPost[];
}

export const TemplatesWorkGroup = (props: Props) => {
  return (
    <div className="relative w-full h-screen">
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
      <div className="work-posts h-screen overflow-y-scroll custom-scrollbar px-3 pt-3">
        {props.workPosts.map(post => (
          <OrganismsPostCard className="mt-5" key={post.id} post={post} />
        ))}
      </div>

      {props.isAuthor &&
        <div className="flex w-full justify-center absolute bottom-0 py-5">
          <button
            className="bg-green-600 text-white px-4 py-2 rounded-3xl text-xl opacity-50 hover:opacity-100"
            onClick={()=>store.dispatch(openPostFormModal())}
          >
            進捗を投稿
          </button>
        </div>
      }
    </div>
  );
}