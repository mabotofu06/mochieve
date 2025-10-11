import { TemplatesWorkGroup } from "@/app/_components/templates/WorkGroup";
import { Metadata } from "next";
import { WorkGroup, WorkPost } from "@/app/_type/data";
import { BL_INFO, APP_HOST } from "@/app/_constants/app";
import { getFetch } from "@/app/_constants/fetch";
import { SuccessResponse } from "@/app/_type/api";

// 30分間のキャッシュを設定（本番用）
export const revalidate = 1800; // 30分 = 30 * 60秒

// 動的ルートの事前生成を無効化し、オンデマンド生成を使用
export const dynamicParams = true;

// 強制的に静的生成を行う（DBアクセスをキャッシュ）
export const dynamic = 'force-static';

// メタデータ生成（キャッシュされる）
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const groupId = decodeURIComponent(resolvedParams.group_id);
  
  try {
    // 特定のWorkGroup取得APIを使用してグループ情報を取得（メタデータ生成用）
    const workGroupResponse = await getFetch<WorkGroup>(`${APP_HOST}${BL_INFO.API_ENDPOINT.WORK_GROUP_FIND}?groupId=${encodeURIComponent(groupId)}`);
    
    if (workGroupResponse.status === 200) {
      const workGroup = (workGroupResponse as SuccessResponse<WorkGroup>).data;
      
      return {
        title: `${workGroup.title || '作業グループ'} | Mochieve`,
        description: workGroup.note || '作業進捗を共有するページです',
      };
    }
  } catch {
    // エラー時はデフォルトメタデータを返す
  }
  
  return {
    title: '作業グループ | Mochieve',
    description: '作業進捗を共有するページです',
  };
}

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

  // キャッシング動作確認用ログ
  console.log(`[${new Date().toISOString()}] WorkGroupDetail rendered for groupId: ${groupId}`);

  // 2つのAPIエンドポイントを並行して呼び出し
  const [workGroupResponse, workPostsResponse] = await Promise.all([
    getFetch<WorkGroup>(`${APP_HOST}${BL_INFO.API_ENDPOINT.WORK_GROUP_FIND}?groupId=${encodeURIComponent(groupId)}`),
    getFetch<WorkPost[]>(`${APP_HOST}${BL_INFO.API_ENDPOINT.WORK_POST}?groupId=${encodeURIComponent(groupId)}`)
  ]);

  if (workGroupResponse.status !== 200 || workPostsResponse.status !== 200) {
    throw new Error("Failed to fetch work group detail");
  }

  const newWorkGroup = (workGroupResponse as SuccessResponse<WorkGroup>).data;
  const newWorkPosts = (workPostsResponse as SuccessResponse<WorkPost[]>).data;


  // 認証チェックはクライアントサイドで実行（WorkGroupコンポーネント内）
  return (
    <TemplatesWorkGroup
      isAuthor={false} // 初期値、クライアントサイドで動的に判定
      workGroup={newWorkGroup}
      workPosts={newWorkPosts}
    />
  )
}