import { WorkGroup, WorkPost } from "@/app/_type/data";
import { OrganismsPostCard } from "../organisms/PostCard";
import { OrganismsPostListHeaderCard } from "../organisms/PostListHeaderCard";

type Props = {
  workGroup: WorkGroup;
  workPosts: WorkPost[];
}

export const TemplatesWorkGroup = (props: Props) => {
  return (
    <div>
      <OrganismsPostListHeaderCard
        userInfo={props.workGroup.userInfo}
        editable={false}
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
      <div className="work-posts h-screen overflow-y-scroll custom-scrollbar px-3">
        {props.workPosts.map(post => (
          <OrganismsPostCard className="mt-5" key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}