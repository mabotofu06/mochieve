"use client";
import { MoleculesModal } from "../../molecules/Modal";

const setVisited = () => {
  window.localStorage.setItem("visited", "true");
};

export const OrganismsWellcomeModal = () => {
  const isFirst = window.localStorage.getItem("visited");
  if (!isFirst) return null;
  return (
    <div>
      <MoleculesModal onClickCloseBtn={setVisited}>
        <div className="project-form m-8 w-[800px] text-xl flex flex-col items-center">
          <h2 className="text-3xl font-bold mb-10">MoChieve(モチベ) へようこそ！</h2>
          <p className="mb-4">MoChieve(モチベ)  では、あなたの目標達成をサポートします。</p>
          <p className="mb-4">1．作業を投稿しよう！</p>
          <p className="mb-4">2．作業グループを確認しよう！</p>
          <p className="mb-4">3．作業を完了させよう！</p>
          <p className="mb-4">4．作業をシェアしよう！</p>

        </div>
      </MoleculesModal>
    </div>
  );
};
