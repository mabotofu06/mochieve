"use client";
import { useEffect, useState } from "react";
import { MoleculesModal } from "../../molecules/Modal";
import { useSelector } from "react-redux";
import { store } from "@/app/_state/store";
import { closeGroupFormModal } from "@/app/_state/slice/modal";
  
export const OrganismsGroupFormModal = () => {
  const groupFormInit = useSelector((state: any) => state.modal.groupFormInit);
  const modalOpen = useSelector((state: any) => state.modal.openGroupFormModal);

  const [title, setTitle] = useState(groupFormInit?.title || "");
  const [description, setDescription] = useState(groupFormInit?.note || "");

  useEffect(() => {
    setTitle(groupFormInit?.title || "");
    setDescription(groupFormInit?.note || "");
  }, [groupFormInit]);

  console.log("groupFormInit:", groupFormInit);

  const handleReject = () => {
    window.location.href = "/Project/User";
  };

  if (!modalOpen) return null;
  return (
    <MoleculesModal onClickCloseBtn={()=>{store.dispatch(closeGroupFormModal())}}>
      <div className="project-form m-8 w-[750px]">
        <input
          type="text"
          className="w-full border rounded-3xl p-3"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="タイトルを入力"
        />
        <textarea
          className="w-full border rounded-3xl p-5 resize-none mt-4"
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={20}
          placeholder="プロジェクトの説明を入力"
        />
        <div className="flex gap-4 mt-10">
          <button
            onClick={handleReject}
            className="w-full py-3 rounded-2xl font-bold border text-lg"
          >
            下書きとして保存
          </button>
          <button
            onClick={()=>{}}
            className="w-full py-3 bg-green-600 text-white rounded-2xl font-bold text-lg"
          >
            更新する
          </button>
        </div>
        <button
          onClick={handleReject}
          className="w-full mt-5 py-3 bg-green-800 text-white rounded-2xl font-bold text-lg"
        >
          この作業を完了にする
        </button>
  
      </div>
    </MoleculesModal>
  );
};
