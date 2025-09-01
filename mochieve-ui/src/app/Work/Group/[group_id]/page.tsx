import { fetchWorkGroupByGroupId } from "@/app/_constants/supabase/workGroupClient";
import { GetPostsData } from "@/app/_type/supabase";
import { WorkGroup, WorkPost } from "@/app/_type/data";
import { fetchPostsByGroupId } from "@/app/_constants/supabase/postClient";
import { TemplatesWorkGroup } from "@/app/_components/templates/WorkGroup";

// const fetchWorkGroupDetail = async (groupId: string)=>{
//   const workGroupRes = await fetchWorkGroupByGroupId(groupId);
//   const workPostsRes = await fetchPostsByGroupId(groupId);

//   if (!workGroupRes || !workPostsRes) {
//     throw new Error("Failed to fetch work group detail");
//   }

//   const newWorkGroup: WorkGroup = {
//     id: workGroupRes.group_id,
//     userInfo: {
//       id: workGroupRes.user_id,
//       name: "不明なユーザー",
//       iconImg: "",
//     },
//     note: workGroupRes.content ?? "",
//     updatedAt: workGroupRes.update_datetime,
//     title: workGroupRes.title ?? "",
//     images: workGroupRes.images,
//     isClose: workGroupRes.close_flag,
//   }

//   const newWorkPosts: Array<WorkPost>
//   = (workPostsRes as GetPostsData[])
//     .map(item => ({
//       id: item.post_id,
//       userInfo: {
//         id: item.user_id,
//         name: "不明なユーザー",
//         iconImg: "",
//       },
//       note: item.content ?? "",
//       image: item.image ?? "",
//       createdAt: item.create_datetime,
//     }));

//   return {
//     group: newWorkGroup,
//     posts: newWorkPosts
//   };
// }

// export default function TemplatesWippro() {
//   const [activeTab, setActiveTab] = useState<number>(0);

//   const groupId = useParams()?.group_id as string;
//   const [group, setGroup] = useState<WorkGroup | null>(null);
//   const [posts, setPosts] = useState<Array<WorkPost>>([]);
//   const [loading, setLoading] = useState(true);

//   if(!groupId) {
//     //TODO:エラー画面に遷移
//     console.log("Group ID:", groupId);
//   }

//   setEditWorkGroupId(groupId);

//   useEffect(()=>{
//     const groupDetail = getWorkGroupDetail(groupId);
//     if(groupDetail?.posts.length){
//       //キャッシュに保持されているため再取得しない
//       console.log("キャッシュから取得したため再取得しない");
//       setPosts(groupDetail.posts);
//       setGroup(groupDetail.group);
//       return;
//     }

//     fetchWorkGroupDetail(groupId)
//       .then(
//         (data)=>{
//           if(!data) return;
          
//           setPosts(data.posts);
//           setGroup(data.group);
//           addWorkGroupDetail(groupId, data.group, data.posts);
//         }
//       )
//       .catch(console.error)
//       .finally(() => setLoading(false));
//   }, []);

//   return (
//     <div className="flex flex-col bg-white h-screen">
//       <OrganismsPostListHeaderCard
//         userInfo={group ? group.userInfo : {id: "", name: "不明なユーザー", iconImg: ""}}
//         editable={group ? group.userInfo.id === getUserInfo()?.id : false}
//         updated={group ? new Date(group.updatedAt).toLocaleDateString() : ""}
//         title={group ? group.title : ""}
//         note={group ? group.note : ""}
//         likeNum={0}
//         isLike={false}
//         bookmarkNum={0}
//         isBookmark={false}
//         stamps={[]}
//         postNum={group ? group.images.length : 0}
//       />

//       {/* 表示切替タブ（アイコンボタン） */}
//       <div className="flex items-center justify-between my-4">
//         <div className="flex items-center">
//         <span className="mr-2">表示サイズ：</span>
//         <button
//           className={`p-2 rounded-full border flex items-center justify-center w-10 h-10 ${activeTab===0 ? 'bg-green-600 text-white' : 'bg-white text-green-600'}`}
//           onClick={()=>setActiveTab(0)}
//           aria-label="カード表示"
//         >
//             {/* カードアイコン（リスト→■3つ） */}
//             <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
//               <rect x="4" y="4" width="16" height="16" rx="4" />
//             </svg>
//         </button>
//         <button
//           className={`p-2 rounded-full border flex items-center justify-center w-10 h-10 ${activeTab===1 ? 'bg-green-600 text-white' : 'bg-white text-green-600'}`}
//           onClick={()=>setActiveTab(1)}
//           aria-label="タイル表示"
//         >
//           {/* タイルアイコン（グリッド） */}
//           <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
//             <rect x="4" y="4" width="7" height="7" rx="2" />
//             <rect x="13" y="4" width="7" height="7" rx="2" />
//             <rect x="4" y="13" width="7" height="7" rx="2" />
//             <rect x="13" y="13" width="7" height="7" rx="2" />
//           </svg>
//         </button>
//         </div>

//         {group && (group.userInfo.id === userInfo.id) && (
//           <button
//             className="new-post-button bg-green-500 text-white py-2 px-4 rounded-3xl"
//             onClick={() => store.dispatch(openPostFormModal())}
//           >
//             新しいポスト
//           </button>
//         )}
//       </div>

//       <div className="flex flex-col" style={{minHeight: "calc(100vh - 350px)"}}>
//         <div className="flex-1 overflow-y-auto custom-scrollbar">
//           {activeTab === 0 ? (
//             posts.map((post, index) => (
//               <OrganismsPostCard className="mt-3" key={index} post={post} />
//             ))
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-2">
//               {posts.map((post, index) => (
//                 <OrganismsPostCard key={index} post={post} />
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

type Props = {
  params:{
    group_id: string;
  }
}

export default async function WorkGroupDetail(props: Props) {
  const params = await props.params;
  const groupId = decodeURIComponent(params.group_id);

  if(!groupId) {
    throw new Error("Group ID is required");
  }

  const workGroupRes = await fetchWorkGroupByGroupId(groupId);
  const workPostsRes = await fetchPostsByGroupId(groupId);

  if (!workGroupRes || !workPostsRes) {
    throw new Error("Failed to fetch work group detail");
  }

  const newWorkGroup: WorkGroup = {
    id: workGroupRes.group_id,
    userInfo: {
      id: workGroupRes.user_id,
      name: "不明なユーザー",
      iconImg: "",
    },
    note: workGroupRes.content ?? "",
    updatedAt: workGroupRes.update_datetime,
    title: workGroupRes.title ?? "",
    images: workGroupRes.images,
    isClose: workGroupRes.close_flag,
  }

  const newWorkPosts: Array<WorkPost>
    = (workPostsRes as GetPostsData[])
      .map(item => ({
        id: item.post_id,
        userInfo: {
          id: item.user_id,
          name: "不明なユーザー",
          iconImg: "",
        },
        note: item.content ?? "",
        image: item.image ?? "",
        createdAt: item.create_datetime,
      }));

  //TODO:リクエストしたユーザがこのグループの編集可能か判定し、反映する
  return <TemplatesWorkGroup workGroup={newWorkGroup} workPosts={newWorkPosts} />;
}