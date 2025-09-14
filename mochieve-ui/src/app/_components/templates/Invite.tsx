'use client'

import { APP_HOST, DEFAULT_USER_ICON } from "@/app/_constants/app"
import { setLoading } from "@/app/_state/slice/modal"
import { store } from "@/app/_state/store"
import { useEffect, useState } from "react"
import { MoleculesModal } from "../molecules/Modal"
import { AtomsGoogleIcon } from "../atoms/icon/Google"
import { AtomsDiscordIcon } from "../atoms/icon/Discord"
import { AtomsTwitterIcon } from "../atoms/icon/Twitter"
import { supabase } from "@/app/_constants/supabase/client"

type Props = {
  inviteCode: string
}

export const TemplatesInvite = (props: Props)=>{
  console.log("有効な招待コード：" + props.inviteCode)
  const [open, setOpen] = useState(false);
  
  useEffect(()=>{
    store.dispatch(setLoading(false));
  },[])

  const openModal = ()=>{
    setOpen(true);
  }

  const reqOAuth = async (service: "google" | "twitter" | "discord")=>{
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: service,
      options: { redirectTo: APP_HOST + "/Redirect/Invite?invite_code=" + props.inviteCode }
      
    })

    if(error){
      console.error("OAuthサインインエラー:", error);
      return;
    }
  }

  return (
    <div className="flex flex-col items-center bg-white h-screen text-2xl overflow-y-auto">
      <div className="flex flex-col items-center my-10 gap-1">
        <h1>おめでとうございます！</h1>
        <p>あなたは Mochieve(もちべ) α版ユーザーとして招待されました🎉</p>

        <p className="mt-5 text-lg">Mochieveに登録して進捗状況を投稿・共有してみませんか？</p>
        <div className="flex items-center gap-2 text-lg mt-3">
        <p className="text-green-500 underline cursor-pointer hover:text-green-300">Mochieve(もちべ)</p>とは？
        </div>
      </div>

      <div className="flex flex-col items-center text-lg mt-10">
        <button className="w-70 border rounded-3xl p-3" onClick={openModal}>
          外部サービスで登録する
        </button>
      </div>

      {open && (
        <MoleculesModal onClickCloseBtn={()=>setOpen(false)}>
            <div className="flex flex-col items-center">
              <h2 className="text-xl mb-2">外部サービスのアカウントで登録します</h2>
              <h2 className="text-xl mb-10">以下のサービスを利用してユーザー登録が使用できます</h2>
              
              <div className="flex flex-col items-center text-lg w-70">
                <button
                  className="flex items-center border rounded-3xl p-3 mb-5 w-full justify-center"
                  onClick={() => reqOAuth("google")}
                >
                  <AtomsGoogleIcon className="inline-block mr-2" size={30}/>
                  <p className="flex-1">Googleで登録</p>
                </button>

                <button
                  className="flex items-center text-gray-700  border bg-white rounded-3xl p-3 mb-5 w-full justify-center"
                  onClick={() => reqOAuth("twitter")}
                >
                  <AtomsTwitterIcon className="inline-block mr-2" size={30}/>
                  <p className="flex-1">X(Twitter)で登録</p>
                </button>

                <button
                  className="flex items-center text-indigo-500 border bg-white rounded-3xl p-3 mb-5 w-full justify-center"
                  onClick={() => reqOAuth("discord")}
                >
                  <AtomsDiscordIcon className="inline-block mr-2" size={30}/>
                  <p className="flex-1">Discordで登録</p>
                </button>
              </div>
            </div>
        </MoleculesModal>
      )}
    </div>
  )
}