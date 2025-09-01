import { TemplatesMyWorks } from "@/app/_components/templates/MyWorks";

type Props = {
  params: {
    user_id: string;
  };
  searchParams:{
    type: "all" | "doing" | "completed" | undefined;
  }
}

export default async function MyWorkGroup(props: Props) {
  const params = await props.params;
  const userId = decodeURIComponent(params.user_id);

  // TODO:存在しないユーザーIDの場合は404
  // TODO:認証したユーザとID不一致の場合は403エラー
  // ここでは fetchWorkGroupsByUserId の結果が空なら404とします
  if(!userId)  throw new Error("User ID is required");

  return <TemplatesMyWorks userId={userId} />
}
