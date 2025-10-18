"use client"

import { TemplatesInvite } from "@/app/_components/templates/Invite";
import { APP_HOST } from "@/app/_constants/app";
import { getFetch } from "@/app/_constants/fetch";
import { setLoading } from "@/app/_state/slice/modal";
import { store } from "@/app/_state/store";
import { useEffect, useState } from "react";
import { createLogger } from "@/app/_constants/utils/logger";

export default function InvitePage() {
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [showError, setShowError] = useState<boolean>(false);
  const logger = createLogger('InvitePage');

  useEffect(()=>{ 
    const url = new URL(window.location.href);
    const code = url.searchParams.get("invite_code");
    setInviteCode(code);

    if(!code){
      setShowError(true);
      store.dispatch(setLoading(false));
      return;
    }else if(code === "testInviteCode"){
      //テスト用の招待コード
      logger.info("テスト用の招待コードを検出");
      store.dispatch(setLoading(false));
      return;
    }
    //APIを通して取得した招待コードが有効かチェック
    getFetch<any>(APP_HOST+"/api/v1/invite?invite_code=" + code)
      .then(res=>{
        if(res.status !== 200){
          setShowError(true);
          return;
        }
      })
      .catch(err=>{
        setShowError(true);
        logger.error("招待コードの検証エラー", err);
      })
      .finally(()=>{
        store.dispatch(setLoading(false));
      });
  },[])

  // 招待コードが無効な場合は何も表示しない
  if (!inviteCode) return null;

  return (showError
    ? (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <h1 className="text-4xl font-bold mb-4">招待コードが無効です</h1>
      <p className="text-lg mb-6 text-gray-700">
        招待リンクが無効か、既に使用されている可能性があります。<br/>
        リンクを再度ご確認の上、もう一度お試しください。<br/>
        それでも問題が解決しない場合は、下記サポートまでお問い合わせください。
      </p>
    </div>)
    : <TemplatesInvite inviteCode={inviteCode}/>
  )
}