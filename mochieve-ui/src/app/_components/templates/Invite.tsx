'use client'

import { setLoading } from "@/app/_state/slice/modal"
import { store } from "@/app/_state/store"
import { useEffect } from "react"

type Props = {
  inviteCode: string
}

const Btn = (props: {label: string})=>{
  return(
  <button className="text-white bg-green-500 p-3 rounded-3xl">
    {props.label}
  </button>)
}

export const TemplatesInvite = (props: Props)=>{
  console.log("有効な招待コード：" + props.inviteCode)
  
  useEffect(()=>{
    store.dispatch(setLoading(false));
  },[])


  return (
    <div className="flex flex-col items-center bg-white h-screen text-2xl">
      <h1>ようこそ！</h1>
      招待されましたね
      <input className="border" type="text" placeholder="ユーザIDを入力（重複不可）"/>
      <input className="border" type="text" placeholder="ユーザ名を入力"/>
      <p>アイコン画像を設定</p>
      <input className="border" type="file" accept="image/*" />
      <input className="border" type="email" placeholder="メールアドレスを入力"/>
      <button>登録</button>

      <button>外部のアカウントで登録</button>
      <Btn label="Googleで登録"/>
      <Btn label="X（旧Twitter）で登録"/>
      <Btn label="Discordで登録"/>
    </div>
  )
}