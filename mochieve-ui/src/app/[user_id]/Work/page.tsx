import { TemplatesMyWorks } from "@/app/_components/templates/MyWorks";
import { supabaseUrl, supabaseKey } from "@/app/_constants/supabase/client";
import { serverSupabaseClient } from "@/app/_constants/supabase/server/client";
import { createClient } from "@supabase/supabase-js";
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
  const cookieStore = await cookies();

  console.log("Cookies:", cookieStore.getAll());

  const accessTokenCookie = cookieStore.get("accessToken");
  const accessToken = accessTokenCookie ? accessTokenCookie.value : undefined;
  const { data: user, error } = await serverSupabaseClient.auth.getUser(accessToken);

  console.log("User:", user);
  console.log("Error:", error);

  if (error) {
    // Handle error
    throw new Error("Authentication error");
  }
  if(!user) {
    throw new Error("Unauthorized");
  }

  const authedClient = createClient(
    supabaseUrl,
    supabaseKey,
    {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    }
  );
  // 認証情報付きでSQLリクエスト
  const { data: userInfo, error: userInforror } = await authedClient
    .from("user_info")
    .select("*")
    .eq("auth_id", user.user?.id)
    .single();


  console.log("User Info:", userInfo);
  console.log("User Info Error:", userInforror);

  if (userInforror) {
    // Handle error
    throw new Error("User info retrieval error");
  }
  if(!userInfo || userInfo.user_id !== userId) {
    throw new Error("User info not found");
  }

  // TODO:存在しないユーザーIDの場合は404
  // TODO:認証したユーザとID不一致の場合は403エラー
  // ここでは fetchWorkGroupsByUserId の結果が空なら404とします
  if(!userId)  throw new Error("User ID is required");

  return <TemplatesMyWorks userId={userId} />
}
