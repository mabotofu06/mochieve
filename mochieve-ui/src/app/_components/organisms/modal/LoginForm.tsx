"use client"

import { useState } from "react";
import { supabase } from "@/app/_constants/supabase/client";
import { MoleculesModal } from "../../molecules/Modal";
import { store } from "@/app/_state/store";
import { useSelector } from "react-redux";
import { closeLoginModal } from "@/app/_state/slice/modal";
import { setUserInfo } from "@/app/_composables/userInfo";
import { APP_HOST, APP_NAME, BL_INFO } from "@/app/_constants/app";
import { postFetch } from "@/app/_constants/fetch";

const INFO_MESSAGE = (
  <span className="text-center">
    現在 {APP_NAME} は招待されたユーザのみのログインが可能です<br />
    ログインなしでも投稿は自由に閲覧可能なので、ぜひ素敵な進捗を共有しましょう！
  </span>
);

const googleIcon = () =>{
  return(
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 48 48"
    >
      <g>
        <path fill="#4285F4" d="M24 9.5c3.54 0 6.72 1.22 9.22 3.22l6.88-6.88C36.38 2.36 30.57 0 24 0 14.64 0 6.4 5.64 2.44 14.02l8.46 6.58C12.94 14.06 17.06 9.5 24 9.5z"/>
        <path fill="#34A853" d="M46.1 24.5c0-1.64-.14-3.22-.4-4.75H24v9h12.5c-.54 2.92-2.18 5.4-4.66 7.08l7.22 5.62C43.98 37.36 46.1 31.46 46.1 24.5z"/>
        <path fill="#FBBC05" d="M10.9 28.6c-1.04-3.12-1.04-6.48 0-9.6l-8.46-6.58C.86 16.64 0 20.22 0 24c0 3.78.86 7.36 2.44 10.58l8.46-6.58z"/>
        <path fill="#EA4335" d="M24 48c6.57 0 12.38-2.16 16.88-5.9l-7.22-5.62c-2.02 1.36-4.62 2.16-7.66 2.16-6.94 0-11.06-4.56-12.1-10.08l-8.46 6.58C6.4 42.36 14.64 48 24 48z"/>
        <path fill="none" d="M0 0h48v48H0z"/>
      </g>
    </svg>

  )
}

export default function OrganismsLoginForm() {
  const modalOpen = useSelector((state: any) => state.modal.openLoginModal);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const closeModal = () => {
    setEmail("");
    setPassword("");
    store.dispatch(closeLoginModal());
  };

  //TODO: 実際にsupabaseの認証を通せるようにする
  const handleLogin = async () => {
    // setLoading(true);
    setError("");
    await postFetch(BL_INFO.API_ENDPOINT.LOGIN, { email, password });
    setUserInfo({
      id: email,
      name: email.split('@')[0],
      iconImg:"",
    })
    closeModal();
    location.href = "/Top";
    //TODO: supabaseだとメアドでの認証のためuserTdから取得できない
    // const { error } = await supabase.auth.signInWithPassword({ email, password });
    // if (error) setError(error.message);
    setLoading(false);
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: APP_HOST + "/Redirect/Login" }
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    closeModal();
  };

  if (!modalOpen) return null;
  return (
    <MoleculesModal onClickCloseBtn={closeModal}>
      <div className="flex justify-center bg-green-100 p-4 rounded-md flex items-center gap-2 my-3">
        {INFO_MESSAGE}
      </div>
      <div className="flex justify-center w-full">
      <div className="flex flex-col gap-4 mt-5 items-center">
        <input
          type="email"
          placeholder="User ID"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded-2xl w-80"
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded-2xl w-80"
          disabled={loading}
        />
        {error && <div className="text-red-500">{error}</div>}
        <div className="flex gap-2">
          <button
            onClick={handleLogin}
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded-3xl w-40"
          >
            ログイン
          </button>
        </div>
        <button
          onClick={handleGoogleAuth}
          disabled={loading}
          className="bg-white px-4 py-2 rounded-3xl flex items-center gap-2 border w-fit my-10"
        >
          {googleIcon()}Googleでサインイン
        </button>
      </div>
      </div>
    </MoleculesModal>
  );
}