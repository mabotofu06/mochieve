"use client"

import { WorkGroup } from "@/app/_type/data";
import { OrganismsGroupCard } from "../organisms/GroupCard";
import { useEffect, useState } from "react";
import { OrganismsTabMenu } from "../organisms/TabMenu";
import { MY_WORK_NAV_MENU } from "@/app/_constants/app";
import { store } from "@/app/_state/store";
import { openErrorModal, setLoading } from "@/app/_state/slice/modal";
import { getFetch } from "@/app/_constants/fetch";
import { ApiResponse, SuccessResponse } from "@/app/_type/api";
import { getMyWorksCache, pushMyWorksCache } from "@/app/_constants/localCache/myWork";
import { MoleculesTimeline } from "../molecules/Timeline";

type Props = {
  userId: string;
}

export const TemplatesMyWorks = (props: Props) => {
  const NAV_LIST = Object.values(MY_WORK_NAV_MENU);
  const initialTab = NAV_LIST[0].code;
  const [groups, setGroups] = useState<WorkGroup[]>([]);
  const [activeTab, setActiveTab] = useState<number>(initialTab);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  let isFetching = false;
  
  store.dispatch(setLoading(false));

  const setFilteredData = (data: WorkGroup[]) => {
    switch (activeTab) {
      case MY_WORK_NAV_MENU.DONE.code:
        setGroups(data.filter(group => group.isClose === true));
        break;
      case MY_WORK_NAV_MENU.WORKING.code:
        setGroups(data.filter(group => group.isClose === false));
        break;
      default:
        setGroups(data);
        break;
    }
    setIsLoading(false);
  }

  useEffect(()=>{
    //複数回Fetchされるのを防止
    if (isFetching) return;
    isFetching = true;
    setIsLoading(true);

    const cachedData: WorkGroup[] = getMyWorksCache();
    //TODO:0件以上だと少ないので20件以上など条件を後々変更
    if (cachedData.length > 0) {
      console.log("キャッシュから取得");
      setFilteredData(cachedData);
      return;
    }

    //TODO: 指定日時以前の更新分のみ取得するよう修正
    getFetch<WorkGroup[]>(`/api/v1/work/${props.userId}`)
      .then((res: ApiResponse<WorkGroup[]>)=>{
        if(res.status !== 200){
          console.error("Error fetching work groups:", res);
          setGroups([]);
          store.dispatch(setLoading(false));
          store.dispatch(openErrorModal({title: "Error", message: res.message || "Unknown error"}));
          return;
        }

        const data = ((res as SuccessResponse<WorkGroup[]>).data);
        console.log("APIから取得", data);
        pushMyWorksCache(data);
        setFilteredData(data);
      })
      .catch((error)=>{
        console.error("Error fetching work groups:", error);
        store.dispatch(setLoading(false));
        store.dispatch(
          openErrorModal({
            title: "Error",
            message: error.message || "Unknown error"
          })
        );
        setGroups([]);
      })
      .finally(()=>{
        // store.dispatch(setLoading(false));
        setIsLoading(false);
      });
  }, [activeTab]);

  return (
    <div className="flex flex-col bg-white h-screen">
      <OrganismsTabMenu tabMenu={NAV_LIST} activeTab={initialTab} onChange={(code) => setActiveTab(code)} />
      {isLoading
      ? <div className="flex-1 w-full bg-white content-center text-center h-full">
          loading...
        </div>
      : <div className="timeline flex-1 overflow-y-scroll custom-scrollbar px-3">
        {groups.length === 0
          ? (<div className="w-full bg-white content-center text-center mt-10">
              投稿がまだありません。
            </div>)
          : <MoleculesTimeline>
              {groups.map((group, index) => (
                <OrganismsGroupCard className="mt-3" key={index} group={group} />
              ))}
            </MoleculesTimeline>
        }
      </div>}
    </div>

  );
};
