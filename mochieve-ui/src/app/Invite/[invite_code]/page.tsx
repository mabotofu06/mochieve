import { TemplatesInvite } from "@/app/_components/templates/Invite";

type Props = {
  params: Promise<{ invite_code: string }>
}

export default async function InvitePage(props: Props) {
  const params = await props.params;
  const inviteCode = params.invite_code
  //TODO:バック側に有効な招待コードか検証
  // 有効=>メール送信のためのフォームと外部アカウントでの登録処理を表示
  // 無効=>エラー表示
  return (<TemplatesInvite inviteCode={inviteCode}/>)
}

/*
ユーザ登録の流れ（完全招待制）
・指定の数の招待コードを発行（10~50件）
・招待コードから登録ページに遷移（無効な招待コードであればエラー）
・登録ページにて「メアドでの登録」か「外部アカウント」での認証登録を実施
・「メアドでの登録」の場合、supabaseでの認証情報（名前、メアド、パスワード）を登録」し、uidを取得
・「外部アカウント」で登録の場合、認証後のuidを取得

・認証情報が登録後に取得したuidをもとにユーザ情報を登録（ユーザーID、名前、アイコン画像）
 */