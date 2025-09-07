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

type Props = {
  userId: string;
}

export const TemplatesMyWorks = (props: Props) => {
  const initialTab = MY_WORK_NAV_MENU[0].code;
  const [groups, setGroups] = useState<WorkGroup[]>([]);
  const [activeTab, setActiveTab] = useState<number>(initialTab);

  useEffect(()=>{
    getFetch<WorkGroup[]>(`/api/v1/work/${props.userId}`)
      .then((res: ApiResponse<WorkGroup[]>)=>{
        if(res.status !== 200){
          console.error("Error fetching work groups:", res);
          setGroups([]);
          store.dispatch(setLoading(false));
          store.dispatch(openErrorModal({title: "Error", message: res.message || "Unknown error"}));
          return;
        }
        setGroups((res as SuccessResponse<WorkGroup[]>).data);
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
      .finally(()=>{store.dispatch(setLoading(false));});
  }, []);

  return (
    <div className="flex flex-col bg-white h-screen">
      <OrganismsTabMenu tabMenu={MY_WORK_NAV_MENU} activeTab={initialTab} onChange={()=>{}} />
      <div className="timeline flex-1 overflow-y-scroll custom-scrollbar px-3">
        {groups.map((group, index) => (
          <OrganismsGroupCard className="mt-3" key={index} group={group} />
        ))}
      </div>
    </div>

  );
};
