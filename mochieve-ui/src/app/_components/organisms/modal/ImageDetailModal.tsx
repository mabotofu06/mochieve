import { useSelector } from "react-redux";
import { MoleculesModal } from "../../molecules/Modal"
import { store } from "@/app/_state/store";
import { closeImageModal } from "@/app/_state/slice/modal";


export const OrganismsImageDetailModal = () => {
  const modalOpen = useSelector((state: {modal: {openImageModal: boolean}}) => state.modal.openImageModal);
  const imageSrc = useSelector((state: {modal: {imageModalSrc: string}}) => state.modal.imageModalSrc);

  if(!modalOpen) return null;
  return (
        <div
          className="overlay"
          onClick={() => store.dispatch(closeImageModal())}
        >
          <img
            src={imageSrc}
            alt="拡大画像"
            style={{maxWidth: "90vw", maxHeight: "90vh", borderRadius: "16px", boxShadow: "0 0 32px #0008"}}
            onClick={e => e.stopPropagation()}
          />
        </div>
  )
}
