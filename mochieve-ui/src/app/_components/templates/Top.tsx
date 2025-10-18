import { OrganismsTabMenu } from "../organisms/TabMenu";
import { useState } from "react";
import { OrganismsGroupCard } from "../organisms/GroupCard";
import { WorkGroup } from "@/app/_type/data";
import { API_INFO, TOP_NAV_MENU } from "@/app/_constants/app";
import { MoleculesTimeline } from "../molecules/Timeline";
import { getFetch } from "@/app/_constants/fetch";
import { SuccessResponse } from "@/app/_type/api";
import { store } from "@/app/_state/store";
import { setLoading, openErrorModal } from "@/app/_state/slice/modal";
import { createLogger } from "@/app/_constants/utils/logger";

type Props = {
  groupList: WorkGroup[];
}

export default function TemplateTop(props: Props) {
  const logger = createLogger('TemplateTop');
  const NAV_ARRAY = Object.values(TOP_NAV_MENU);
  const [activeTab, setActiveTab] = useState<number>(NAV_ARRAY[0].code);
  const [groupList, setGroupList] = useState<WorkGroup[]>(props.groupList);
  const [isMax, setIsMax] = useState<boolean>(false);
  const getFilteredWorkGroup = () => {
    switch (activeTab) {
      case TOP_NAV_MENU.TODAY.code:
        const today = new Date().setHours(0, 0, 0, 0);
        return groupList.filter(group => new Date(group.updatedAt).getTime() >= today);
      case TOP_NAV_MENU.WORKING.code:
        return groupList.filter(group => group.isClose === false);
      default:
        return groupList.filter(group => group.isClose === true);
    }
  }

  // const displayData = getFilteredWorkGroup();

  const fetchData = async () => {
    if (isMax) {
      store.dispatch(openErrorModal({
        title: "お知らせ",
        message: "データはこれ以上ありません"
      }));
      return;
    }

    // ローディング開始
    // store.dispatch(setLoading(true));

    try {
      const oldgroup: WorkGroup = groupList[groupList.length - 1];
      const res = await getFetch<WorkGroup[]>(API_INFO.ENDPOINT.WORK_GROUP + `?period=${new Date(oldgroup.updatedAt).getTime()}`);
      
      if (res.status !== 200) {
        store.dispatch(openErrorModal({
          title: "エラー",
          message: "データの取得に失敗しました。しばらく時間をおいてから再度お試しください。"
        }));
        return;
      }

      const newDataList: WorkGroup[] = (res as SuccessResponse<WorkGroup[]>).data || [];

      if (newDataList.length === 0) {
        setIsMax(true);
        store.dispatch(openErrorModal({
          title: "お知らせ",
          message: "データはこれ以上ありません"
        }));
        return;
      }

      setGroupList([...groupList, ...newDataList]);
    } catch (error) {
      logger.error("Timeline data fetch failed", error);
      store.dispatch(openErrorModal({
        title: "エラー",
        message: "予期しないエラーが発生しました。再度お試しください。"
      }));
    } finally {
      // ローディング終了
      // store.dispatch(setLoading(false));
    }
  }

  return (
    <div className="flex flex-col bg-white h-screen">
      <OrganismsTabMenu
        tabMenu={NAV_ARRAY}
        activeTab={activeTab}
        onChange={(number)=>{setActiveTab(number)}}
      />
      <div className="timeline flex-1 overflow-y-scroll custom-scrollbar px-3">
        {groupList.length === 0
          ? (<div className="w-full text-center mt-10">投稿はまだありません</div>)
          : <MoleculesTimeline onclick={fetchData}>
              {groupList.map((group) => (
                <OrganismsGroupCard key={group.id} className="mt-3 w-full" group={group} />
              ))}
            </MoleculesTimeline>
        }
      </div>
    </div>
  );
}
