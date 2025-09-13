import { fetchWorkGroupByGroupId } from "@/app/_constants/supabase/workGroupClient";
import { GetPostsData } from "@/app/_type/supabase";
import { UserInfo, WorkGroup, WorkPost } from "@/app/_type/data";
import { fetchPostsByGroupId } from "@/app/_constants/supabase/postClient";
import { TemplatesWorkGroup } from "@/app/_components/templates/WorkGroup";
import { cookies } from "next/headers";
import { getFetch } from "@/app/_constants/fetch";
import { APP_HOST, BL_INFO } from "@/app/_constants/app";
import { ApiResponse, SuccessResponse } from "@/app/_type/api";

type Props = {
  params: Promise<{
    group_id: string;
  }>
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

  // ここ（ポスト一覧）はクライアント側から取得したほうがよさそう
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


  //以下、認証しているユーザ情報を元に投稿者かどうかを判定
  const cookie = await cookies();
  const accessToken = cookie.get("accessToken")?.value;
  const refreshToken = cookie.get("refreshToken")?.value;

  const res: ApiResponse<UserInfo> = await getFetch<UserInfo>(APP_HOST + BL_INFO.API_ENDPOINT.CACHE_USER_AUTH,{
    headers:{
      Cookie: `accessToken=${accessToken}; refreshToken=${refreshToken}`
    }
  });

  let userInfo: UserInfo|undefined;
  if(res.status === 200){
    userInfo = (res as SuccessResponse<UserInfo>).data;
    console.log("認証されたユーザの情報:", userInfo);
  }
  else{
    console.log("認証されたユーザの投稿でないため閲覧専用として表示");
  }

  return (
    <TemplatesWorkGroup
      isAuthor={userInfo?.id === newWorkGroup.userInfo.id}
      workGroup={newWorkGroup}
      workPosts={newWorkPosts}
    />
  )
}