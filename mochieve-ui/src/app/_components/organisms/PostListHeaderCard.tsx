import { openGroupFormModal } from "@/app/_state/slice/modal";
import { store } from "@/app/_state/store";
import { UserInfo } from "@/app/_type/data";

type Props = {
  id: string;
  isAuthor: boolean;
  userInfo: UserInfo;
  updated: string;

  title: string;
  note: string;

  likeNum: number;
  isLike: boolean;
  bookmarkNum: number;
  isBookmark: boolean;
  stamps: any[];
  postNum: number;
};

export const OrganismsPostListHeaderCard = (props: Props) => {
  const iconSize = "w-15 h-15";

  const openGroupForm = () => {
    store.dispatch(openGroupFormModal({id: props.id, title: props.title, note: props.note}));
  }

  return (
    <div className="shadow rounded-4xl w-full">
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center">
            <div className={"user-icon bg-green-800 rounded-full " + iconSize}></div>
            <div className="user-info ml-3 flex flex-col justify-center text-md">
              <h2 className="user-name font-semibold">{props.userInfo.name}</h2>
              <p className="user-id text-xs">{props.userInfo.id}</p>
            </div>
          </div>
          <div className="flex items-center">
            {props.isAuthor && (
              <button
                className="edit-button bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 rounded"
                onClick={openGroupForm}
              >
                編集
              </button>
            )}
            <div className="post-update text-gray-500 ml-4">
              更新：{new Date(props.updated).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div>
          <div className="post-details flex w-full">
            <div className="w-full ms-5">
              <h2 className="post-title text-xl font-semibold mb-3">{props.title}</h2>
              <p className="post-content ms-3 max-h-42 overflow-y-scroll mb-8 custom-scrollbar" dangerouslySetInnerHTML={{ __html: props.note }} />
            </div>
          </div>
          <div className="flex justify-between items-center p-5 border-t border-t-green-600">
            <div className="flex">
            </div>
            <div>
              投稿数: <span className="post-num text-green-600 font-semibold">{props.postNum}</span>
            </div>
          </div>
        </div>
      </div>
  );
};
