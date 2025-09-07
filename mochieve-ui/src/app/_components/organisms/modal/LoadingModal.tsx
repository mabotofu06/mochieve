import { useSelector } from "react-redux";
import { MoleculesModal } from "../../molecules/Modal"
import { store } from "@/app/_state/store";
import { closeErrorModal } from "@/app/_state/slice/modal";


export const OrganismsLoadingModal = () => {
  const loading = useSelector((state: {modal: {loadingModal: boolean}}) => state.modal.loadingModal);

    if(!loading) return null;
    return (
    <div className="overlay">
      <div className="text-center bg-white p-10 rounded-2xl">
        <div className="flex flex-col items-center">
            <svg
            className="animate-spin h-8 w-8 text-green-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M12 2a10 10 0 0 1 10 10h-4a6 6 0 0 0-6-6V2z"
            />
            </svg>
        </div>
      </div>
    </div>
  )
}
