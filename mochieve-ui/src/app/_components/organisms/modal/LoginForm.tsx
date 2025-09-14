"use client"

import { useState } from "react";
import { supabase } from "@/app/_constants/supabase/client";
import { MoleculesModal } from "../../molecules/Modal";
import { store } from "@/app/_state/store";
import { useSelector } from "react-redux";
import { closeLoginModal } from "@/app/_state/slice/modal";
import { APP_HOST, APP_NAME } from "@/app/_constants/app";
import { AtomsGoogleIcon } from "../../atoms/icon/Google";
import { AtomsDiscordIcon } from "../../atoms/icon/Discord";
import { AtomsTwitterIcon } from "../../atoms/icon/Twitter";

const INFO_MESSAGE = (
  <span className="text-center">
    現在 {APP_NAME} は招待されたユーザのみログインが可能です<br />
    ログインなしでも投稿は自由に閲覧可能なので、ぜひ素敵な進捗を共有しましょう！
  </span>
);

export default function OrganismsLoginForm() {
  const modalOpen = useSelector((state: any) => state.modal.openLoginModal);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const closeModal = () => {
    store.dispatch(closeLoginModal());
  };

  const handleOAuth = async (provider: "google"|"twitter"|"discord") => {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
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
      <div className="flex justify-center bg-green-100 p-4 rounded-md items-center gap-2 my-3">
        {INFO_MESSAGE}
      </div>
      <div className="flex justify-center w-full my-3">
        <div className="flex flex-col items-center w-50">
          <button
            onClick={()=>handleOAuth("google")}
            disabled={loading}
            className="flex items-center bg-white w-full p-2 rounded-3xl flex items-center border w-fit my-2"
          >
            <AtomsGoogleIcon className="" size={25}/>
            <p className="flex-1">Googleでログイン</p>
          </button>

          <button
            onClick={()=>handleOAuth("twitter")}
            disabled={loading}
            className="flex items-center bg-white w-full p-2 rounded-3xl flex items-center border w-fit my-2 text-black"
          >
            <AtomsTwitterIcon size={25}/>
            <p className="flex-1">X(Twitter)でログイン</p>
          </button>

          <button
            onClick={()=>handleOAuth("discord")}
            disabled={loading}
            className="flex items-center bg-white w-full p-2 rounded-3xl flex items-center border w-fit my-2 text-indigo-600"
          >
            <AtomsDiscordIcon size={25}/>
            <p className="flex-1">Discordでログイン</p>
          </button>
        </div>
      </div>
    </MoleculesModal>
  );
}