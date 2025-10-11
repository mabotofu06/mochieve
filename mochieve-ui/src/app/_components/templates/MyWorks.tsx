"use client"

import { WorkGroup } from "@/app/_type/data";
import { OrganismsGroupCard } from "../organisms/GroupCard";
import { useEffect, useState } from "react";
import { OrganismsTabMenu } from "../organisms/TabMenu";
import { BL_INFO, MY_WORK_NAV_MENU } from "@/app/_constants/app";
import { MoleculesTimeline } from "../molecules/Timeline";
import { getFetch } from "@/app/_constants/fetch";
import { SuccessResponse } from "@/app/_type/api";
import { pushMyWorksCache } from "@/app/_constants/localCache/myWork";
import { store } from "@/app/_state/store";
import { setLoading, openErrorModal } from "@/app/_state/slice/modal";
import { createLogger } from "@/app/_constants/utils/logger";

type Props = {
  userId: string;
  myWorks: WorkGroup[];
}

export const TemplatesMyWorks = (props: Props) => {
  const logger = createLogger('TemplatesMyWorks');
  const NAV_LIST = Object.values(MY_WORK_NAV_MENU);
  const [activeTab, setActiveTab] = useState<number>(NAV_LIST[0].code);
  const [groups, setGroups] = useState<WorkGroup[]>(props.myWorks);
  const [isMax, setIsMax] = useState<boolean>(false);

  const getFilteredWorkGroup = () => {
    switch (activeTab) {
      case MY_WORK_NAV_MENU.DONE.code:    // 完了
        return groups.filter(group => group.isClose === true);
      case MY_WORK_NAV_MENU.WORKING.code: // 進行中
        return groups.filter(group => group.isClose === false);
      default:                            // ALL
        return groups;
    }
  }

  const displayData = getFilteredWorkGroup();

  const fetchData = async () => {
    if (isMax) {
      store.dispatch(openErrorModal({
        title: "お知らせ",
        message: "データはこれ以上ありません"
      }));
      return;
    }

    // ローディング開始
    store.dispatch(setLoading(true));

    try {
      const oldgroup: WorkGroup = groups[groups.length - 1];
      const res = await getFetch<WorkGroup[]>(`/api/v1/work/${props.userId}` + `?period=${new Date(oldgroup.updatedAt).getTime()}`);
      
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

      setGroups([...groups, ...newDataList]);
      pushMyWorksCache(newDataList);
    } catch (error) {
      logger.error("My works data fetch failed", error);
      store.dispatch(openErrorModal({
        title: "エラー",
        message: "予期しないエラーが発生しました。再度お試しください。"
      }));
    } finally {
      // ローディング終了
      store.dispatch(setLoading(false));
    }
  }
  

  return (
    <div className="flex flex-col bg-white h-screen">
      <OrganismsTabMenu
        tabMenu={NAV_LIST}
        activeTab={activeTab}
        onChange={(code) => setActiveTab(code)}
      />
      <div className="timeline flex-1 overflow-y-scroll custom-scrollbar px-3">
        {displayData.length === 0
          ? (<div className="w-full bg-white content-center text-center mt-10">
              投稿がまだありません。
            </div>)
          : <MoleculesTimeline onclick={fetchData}>
              {displayData.map((group, index) => (
                <OrganismsGroupCard className="mt-3 w-full" key={index} group={group} />
              ))}
            </MoleculesTimeline>
        }
      </div>
    </div>
  );
};
