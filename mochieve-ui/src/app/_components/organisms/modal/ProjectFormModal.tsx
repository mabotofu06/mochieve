"use client";
import { useState } from "react";
import { MoleculesModal } from "../../molecules/Modal";
  
export const OrganismsProjectFormModal = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  // const [images, setImages] = useState<File[]>([]);
  // const [showContinueModal, setShowContinueModal] = useState(false);
  // const [showPostModal, setShowPostModal] = useState(false);

  // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files) {
  //     setImages(Array.from(e.target.files));
  //   }
  // };

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   // ここでAPI送信などの処理を実装
  //   setShowContinueModal(true);
  // };

  // const handleContinue = () => {
  //   setShowContinueModal(false);
  //   setShowPostModal(true);
  // };

  const handleReject = () => {
    window.location.href = "/Project/User";
  };

  return (
    // <MoleculesModal title="新しいプロジェクトを作成">
    //   <div className="project-form m-8 w-[800px]">
    //       <div className="mb-4">
    //         <input
    //           type="text"
    //           className="w-full border rounded-3xl p-3"
    //           value={title}
    //           onChange={e => setTitle(e.target.value)}
    //           placeholder="タイトルを入力"
    //           required
    //       />
    //     </div>
    //     <div className="mb-4">
    //       <textarea
    //         className="w-full border rounded-3xl p-5 resize-none"
    //         value={description}
    //         onChange={e => setDescription(e.target.value)}
    //         rows={30}
    //         placeholder="プロジェクトの説明を入力"
    //         required
    //       />
    //     </div>
    //     <button
    //       type="submit"
    //       className="w-full py-3 rounded-2xl font-bold border text-lg mt-4"
    //     >
    //       下書きとして投稿
    //     </button>
    //     <button
    //       type="submit"
    //       className="w-full py-3 bg-green-600 text-white rounded-2xl font-bold text-lg mt-4"
    //     >
    //       投稿する
    //     </button>
    // </div>
    // </MoleculesModal>
    <div></div>
  );
};
