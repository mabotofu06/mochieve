"use client";
import { useState } from "react";
import { MoleculesModal } from "../../molecules/Modal";
import { uploadPostImage } from "@/app/_constants/supabase/storageClient";
import { insertWorkGroup, updateWorkGroup } from "@/app/_constants/supabase/workGroupClient";
import { insertNewPost } from "@/app/_constants/supabase/postClient";
import { useDispatch, useSelector } from "react-redux";
import { closePostFormModal } from "@/app/_state/slice/modal";
import { getEditWorkGroupId, getWorkGroupDetail } from "@/app/_state/storage";
import { store } from "@/app/_state/store";

export const OrganismsPostFormModal = () => {
  const dispatch = useDispatch();
  const modalOpen = useSelector((state: any) => state.modal.openPostFormModal);

  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const deleteImage = () => {
    setImage(null);
  }

  const submitForm = async () => {
    //バリデーションチェック
    if(!image) {
      console.error("No image selected");
      return
    }
    if(!note && note.length <= 150){
      console.error("Note is required and must be less than 150 characters");
      return;
    }
    console.log("submitForm", { note, image });

    //画像をアップロードし、公開URLを取得する
    const publicUrl = await uploadPostImage(image);
    if (!publicUrl) return;

    let groupId: string | null = getEditWorkGroupId();
    if (!groupId) {
      console.warn("No group ID found");
      groupId = await insertWorkGroup(publicUrl);
    }else {
      await updateWorkGroup(groupId, publicUrl);
    }

    if (!groupId) return;
    const postId = await insertNewPost(publicUrl, note, groupId);
    if (!postId) return;

    console.log("Image uploaded successfully:", publicUrl);
    setImage(null);
    setNote("");
    store.dispatch(closePostFormModal());
  }

  if (!modalOpen) return null;
  return (
    <div>
      <MoleculesModal onClickCloseBtn={() => dispatch(closePostFormModal())}>
        <div className="project-form m-8 w-[800px]">
          <div className="mb-4">
            {image ? (
              <div className="relative mt-2 w-full h-[300px] overflow-hidden">
                <img
                  src={URL.createObjectURL(image)}
                  alt="Preview"
                  className="rounded-lg"
                  onClick={() => {
                    if (image) {
                      window.open(URL.createObjectURL(image), "_blank");
                    }
                  }}
                />
                <button className="absolute top-0 right-3 text-red-500 rounded-full text-5xl" onClick={deleteImage}>
                ×
                </button>
              </div>) : (
              <div
                className="h-[300px] border-2 border-dashed flex flex-col justify-center items-center w-full rounded-lg"
                onDragOver={e => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDrop={e => {
                  e.preventDefault();
                  e.stopPropagation();
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  setImage(e.dataTransfer.files[0]);
                  setNote(note => note); // ダミーのsetStateで再レンダリングを強制
                }
                }}
              >
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer inline-block bg-green-600 text-white rounded-2xl font-bold text-lg py-3 px-6 mb-2"
                >
                  画像を投稿
                </label>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => {
                    if (e.target.files && e.target.files[0]) {
                      console.log("imageUp")
                      setImage(e.target.files[0]);
                      
                    }
                  }}
                  // ref={input => {
                  //   if (input && !image) {
                  //   input.value = "";
                  //   }
                  // }}
                />
                <span className="ml-4 text-gray-500">または画像をドラッグ＆ドロップ</span>
              </div>)
            }
          </div>

          <div className="mb-4">
            <textarea
              className="w-full border rounded-3xl p-5 resize-none"
              value={note}
              onChange={e => setNote(e.target.value)}
              rows={6}
              placeholder="ポストに説明を追加しよう！"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-green-600 text-white rounded-2xl font-bold text-lg mt-4"
            onClick={submitForm}
          >
            投稿する
          </button>
      </div>
      </MoleculesModal>
    </div>
  );
};
