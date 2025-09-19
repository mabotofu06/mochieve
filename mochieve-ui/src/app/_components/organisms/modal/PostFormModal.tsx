"use client";
import { useState } from "react";
import { MoleculesModal } from "../../molecules/Modal";
import { useSelector } from "react-redux";
import { closePostFormModal, openErrorModal } from "@/app/_state/slice/modal";
import { store } from "@/app/_state/store";
import { postFetch, putFetch } from "@/app/_constants/fetch";
import { BL_INFO } from "@/app/_constants/app";
import { ApiResponse, PostRequestBody } from "@/app/_type/api";
import { encodeBlob2Base64, fileToWebp } from "@/app/_constants/utils/fileUtil";
import { clearCanNewPost } from "@/app/_constants/localCache/canNewPost";
import { clearMyWorks } from "@/app/_constants/localCache/myWork";

export const OrganismsPostFormModal = () => {
  const modalOpen = useSelector((state: {modal: {openPostFormModal: boolean}}) => state.modal.openPostFormModal);
  const targetGroupId = useSelector((state: {modal: {postTargetGroupId: string | null}}) => state.modal.postTargetGroupId);

  const [note, setNote] = useState("");
  const [image, setImage] = useState<File | null>(null);

  /**
   * モーダルを閉じると同時に、フォームの内容をクリアする
   */
  const closeModal = (): void => {
    setImage(null);
    setNote("");
    store.dispatch(closePostFormModal());
  }

  /**
   * バリデーションチェック
   * フォームの入力内容が正しいかどうかを検証する
   * ・画像が選択されていること
   * ・説明文が入力されていて150文字以内であること
   * @returns 
   */
  const validationCheck = (): boolean => {
    if(!image) {
      console.error("No image selected");
      store.dispatch(openErrorModal({ title: "入力エラー", message: "画像が選択されていません" }));
      return false;
    }
    if(!note || note.length > 150){
      console.error("Note is required and must be less than 150 characters");
      store.dispatch(openErrorModal({ title: "入力エラー", message: "説明文は必須であり、150文字以内である必要があります" }));
      return false;
    }
    return true;
  }

  /**
   * フォームの内容をサーバに送信する
   * @returns 
   */
  const submitWorkPost = async (isClose: boolean = false) => {
    //バリデーションチェック
    if(!validationCheck()) return;

    // ファイルをwebpに変換し、base64にエンコード
    const webpImage = await fileToWebp(image as File);
    const imageFile = await encodeBlob2Base64(webpImage);

    const reqBody: PostRequestBody
      = {
        groupId: targetGroupId ?? undefined,
        note,
        imageFile
      };

    const response = 
      targetGroupId
        ? await putFetch<PostRequestBody, ApiResponse<boolean>>(BL_INFO.API_ENDPOINT.WORK_POST, reqBody)
        : await postFetch<PostRequestBody, ApiResponse<boolean>>(BL_INFO.API_ENDPOINT.WORK_POST, reqBody);

    if(response.status !== 200) {
      store.dispatch(openErrorModal({ title: "投稿エラー", message: "投稿に失敗しました" }));
      return;
    }
    closeModal();
    clearCanNewPost();
    clearMyWorks();

    window.location.reload();
  }

  if (!modalOpen) return null;
  return (
    <div>
      <MoleculesModal onClickCloseBtn={closeModal}>
        <div className="project-form m-8 w-[650px]">
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
                <button className="absolute top-0 right-3 text-red-500 rounded-full text-5xl" onClick={closeModal}>
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
            onClick={() => submitWorkPost()}
          >
            投稿する
          </button>
          {targetGroupId && <button
            type="submit"
            className="w-full py-3 bg-green-600 text-white rounded-2xl font-bold text-lg mt-4"
            onClick={() => submitWorkPost(true)}
          >
            この投稿で完了にする
          </button> }
      </div>
      </MoleculesModal>
    </div>
  );
};
