"use client"

import { WorkGroup } from "@/app/_type/data";
import { OrganismsGroupCard } from "../organisms/GroupCard";
import { useEffect, useState } from "react";
import { fetchWorkGroupsByUserId } from "@/app/_constants/supabase/workGroupClient";
import { OrganismsTabMenu } from "../organisms/TabMenu";
import { MY_WORK_NAV_MENU } from "@/app/_constants/app";
import { store } from "@/app/_state/store";
import { setLoading } from "@/app/_state/slice/modal";

type Props = {
  userId: string;
}

export const TemplatesMyWorks = (props: Props) => {
  const initialTab = MY_WORK_NAV_MENU[0].code;
  const [groups, setGroups] = useState<WorkGroup[]>([]);
  const [activeTab, setActiveTab] = useState<number>(initialTab);

  useEffect(()=>{
    fetchWorkGroupsByUserId(props.userId)
      .then((myWorkGroups) => {
        const groups: WorkGroup[] = myWorkGroups.map(item => ({
          id: item.group_id,
          title: item.title || "",
          note: item.content || "",
          images: item.images,
          userInfo: {
            id: item.user_id,
            name: "不明なユーザー",
            iconImg: ""
          },
          isClose: item.close_flag,
          updatedAt: item.update_datetime,
        }));

      setGroups(groups);
    })
    .catch(console.error)
    .finally(() => {store.dispatch(setLoading(false));});
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
