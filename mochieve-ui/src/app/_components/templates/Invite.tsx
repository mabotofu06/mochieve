'use client'

import { DEFAULT_USER_ICON } from "@/app/_constants/app"
import { setLoading } from "@/app/_state/slice/modal"
import { store } from "@/app/_state/store"
import { useEffect, useState } from "react"
import { MoleculesModal } from "../molecules/Modal"
import { AtomsGoogleIcon } from "../atoms/icon/Google"
import { AtomsDiscordIcon } from "../atoms/icon/Discord"
import { AtomsTwitterIcon } from "../atoms/icon/Twitter"

type Props = {
  inviteCode: string
}

const Btn = (props: {className?: string; label: string; onClick?: () => void})=>{
  return(
  <button className={`text-white bg-green-500 p-3 rounded-3xl ${props.className}`} onClick={props.onClick ?? (()=>{})}>
    {props.label}
  </button>)
}

const Input = (props: {className?: string; type?:"text" | "email" | "password"; placeholder: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void})=>{
  return(
    <input className={`border rounded-3xl p-3 ${props.className}`} type={props.type??"text"} placeholder={props.placeholder} onChange={props.onChange}/>
  )
}

const UserRegisterFormModal = (props: {onClickCloseBtn: () => void})=>{
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [IconImg, setIconImg] = useState<File|null>(null);
  const [pageNum, setPageNum] = useState(0); // 1: ユーザー情報入力、2: 登録完了

  return (
    <MoleculesModal onClickCloseBtn={props.onClickCloseBtn}>
      <div className="flex flex-col items-center text-lg">
        <h2 className="text-xl mb-2">ユーザー情報を登録します</h2>
        <h2 className="text-xl mb-10">以下の情報を入力してください</h2>
        <div className="h-50 mb-10 flex items-center w-98">
          {pageNum === 0
            ? <Input className="mb-5 w-full" placeholder="ユーザIDを入力（半角英数_重複不可）" onChange={(e) => {setUserId(e.target.value)}} />
            : pageNum === 1
            ? <Input className="mb-5 w-full" placeholder="ユーザ名を入力" onChange={(e) => {setUserName(e.target.value)}} />
            : pageNum === 2
            ? <div className="flex flex-col items-center mb-5 text-lg">
                <p>アイコン画像を設定</p>
                <p>（未設定の場合はデフォルトアイコンが表示されます）</p>
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300 flex items-center justify-center bg-gray-100 mb-5">
                  <img
                    className="object-cover w-full h-full"
                    src={IconImg ? URL.createObjectURL(IconImg) : DEFAULT_USER_ICON}
                    alt="User Icon"
                  />
                </div>
                <label className="inline-block bg-green-500 text-white px-4 py-2 cursor-pointer rounded-4xl">
                  {IconImg ? "アイコンを変更" : "ファイルを選択"}
                  <input
                    className="hidden"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setIconImg(file);
                    }}
                  />
                </label>
              </div>
            : null
          }
        </div>
        <div>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded-4xl disabled:opacity-50"
          onClick={() => {setPageNum((prev) => (prev - 1))}}
          disabled={pageNum === 0}
        >
          戻る
        </button>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded-4xl  disabled:opacity-50"
          onClick={() => {setPageNum((prev) => (prev + 1))}}
          disabled={pageNum === 3}
        >
          次へ
        </button>
        </div>
      </div>
    </MoleculesModal>
  )
}

const EmailFormModal = (props: {onClickCloseBtn: () => void})=>{
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pageNum, setPageNum] = useState(0); // 1: ユーザー情報入力、2: 登録完了

  return (
    <MoleculesModal onClickCloseBtn={props.onClickCloseBtn}>
      <div className="flex flex-col items-center text-lg">
        <h2 className="text-xl mb-2">ユーザー情報を登録します</h2>
        <h2 className="text-xl mb-10">以下の情報を入力してください</h2>
        <div className="h-20 mb-10 flex items-center w-98">
          {pageNum === 0
            ? <Input className="mb-5 w-full" type="email" placeholder="登録するメールアドレス" onChange={(e) => {}} />
            : pageNum === 1
            ? <Input className="mb-5 w-full" type="password" placeholder="パスワード(半角英数記号8文字以上)" onChange={(e) => {}} />
            : pageNum === 2
            ? <Input className="mb-5 w-full" type="password" placeholder="パスワード(確認用)" onChange={(e) => {}} />
            : null
          }
        </div>
        <div>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-4xl disabled:opacity-50"
            onClick={() => {setPageNum((prev) => (prev - 1))}}
            disabled={pageNum === 0}
          >
            戻る
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-4xl  disabled:opacity-50"
            onClick={() => {setPageNum((prev) => (prev + 1))}}
            disabled={pageNum === 3}
          >
            次へ
          </button>
          {pageNum === 3 && <Btn className="w-40 mt-5" label="登録" onClick={()=>{}} />}
        </div>
      </div>
    </MoleculesModal>
  )
}

export const TemplatesInvite = (props: Props)=>{
  console.log("有効な招待コード：" + props.inviteCode)
  const [open, setOpen] = useState(false);
  const [openFormModal, setOpenFormModal] = useState(false);
  const [type, setType] = useState<"email" | "other">("email");
  
  useEffect(()=>{
    store.dispatch(setLoading(false));
  },[])

  const openModal = (type: "email" | "other")=>{
    setType(type);
    setOpen(true);
  }

  const openUserRegisterFormModal = ()=>{
    setOpenFormModal(true);
    setOpen(false);
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
        <Btn className="w-70 font-bold" label="メールアドレスで登録する" onClick={() => openModal("email")} />
        <p className="my-3 text-lg">または</p>
        <button className="w-70 border rounded-3xl p-3" onClick={() => openModal("other")}>
          外部サービスで登録する
        </button>
      </div>

      {open && (
        <MoleculesModal onClickCloseBtn={()=>setOpen(false)}>
          {type === "email" ? (
            <EmailFormModal onClickCloseBtn={() => setOpen(false)} />
            ) : (
            <div className="flex flex-col items-center">
              <h2 className="text-xl mb-2">外部サービスのアカウントで登録します</h2>
              <h2 className="text-xl mb-10">以下のサービスを利用してユーザー登録が使用できます</h2>
              
              <div className="flex flex-col items-center text-lg w-70">
                <button className="flex items-center border rounded-3xl p-3 mb-5 w-full justify-center" onClick={openUserRegisterFormModal}>
                  <AtomsGoogleIcon className="inline-block mr-2" size={30}/>
                  <p className="flex-1">Googleで登録</p>
                </button>

                <button className="flex items-center text-gray-700  border bg-white rounded-3xl p-3 mb-5 w-full justify-center" onClick={openUserRegisterFormModal}>
                  <AtomsTwitterIcon className="inline-block mr-2" size={30}/>
                  <p className="flex-1">X（旧Twitter）で登録</p>
                </button>

                <button className="flex items-center text-indigo-500 border bg-white rounded-3xl p-3 mb-5 w-full justify-center" onClick={openUserRegisterFormModal}>
                  <AtomsDiscordIcon className="inline-block mr-2" size={30}/>
                  <p className="flex-1">Discordで登録</p>
                </button>
              </div>
            </div>
          )}
        </MoleculesModal>
      )}

      {openFormModal && <UserRegisterFormModal onClickCloseBtn={() => setOpenFormModal(false)} />}
    </div>
  )
}