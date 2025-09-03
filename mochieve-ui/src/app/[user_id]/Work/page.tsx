import { TemplatesMyWorks } from "@/app/_components/templates/MyWorks";
import { APP_HOST, BL_INFO } from "@/app/_constants/app";
import { getFetch } from "@/app/_constants/fetch";
import { UserInfo } from "@/app/_type/data";
import { cookies } from "next/headers";

type Props = {
  params: Promise<{ user_id: string }>;
  searchParams: Promise<{
    type: "all" | "doing" | "completed" | undefined;
  }>
}

export default async function MyWorkGroup(props: Props) {
  const params = await props.params;
  const userId = decodeURIComponent(params.user_id);
  const cookie = await cookies();
  const accessToken = cookie.get("accessToken")?.value;
  const refreshToken = cookie.get("refreshToken")?.value;

  const userInfo = await getFetch<UserInfo>(APP_HOST+BL_INFO.API_ENDPOINT.CACHE_USER_INFO,
    {
      headers: {
        Cookie: `accessToken=${accessToken}; refreshToken=${refreshToken}`
      }
    }
  )

  // 認証情報付きでSQLリクエスト
  console.log("User Info:", userInfo);

  if(!userInfo || userInfo.id !== userId) {
    throw new Error("User info not found");
  }

  // TODO:存在しないユーザーIDの場合は404
  // TODO:認証したユーザとID不一致の場合は403エラー
  // ここでは fetchWorkGroupsByUserId の結果が空なら404とします
  if(!userId)  throw new Error("User ID is required");

  return <TemplatesMyWorks userId={userId} />
}
