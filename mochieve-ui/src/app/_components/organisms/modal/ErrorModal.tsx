import { useSelector } from "react-redux";
import { MoleculesModal } from "../../molecules/Modal"
import { store } from "@/app/_state/store";
import { closeErrorModal } from "@/app/_state/slice/modal";


export const OrganismsErrorModal = () => {
  const errorInfo = useSelector((state: {modal: {errorModalInfo: { title: string, message: string }}}) => state.modal.errorModalInfo);

  if(!errorInfo) return null;
  return (
    <MoleculesModal onClickCloseBtn={()=>{store.dispatch(closeErrorModal())}}>
      <div className="text-center">
        <h2 className="text-2xl font-bold">
          {errorInfo.title}
        </h2>
        <p className="my-10 text-lg">{errorInfo.message}</p>
      </div>
    </MoleculesModal>
  )
}
