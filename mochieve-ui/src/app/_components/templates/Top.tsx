'use client'

import { OrganismsTabMenu } from "../organisms/TabMenu";
import { useEffect, useState } from "react";
import { OrganismsGroupCard } from "../organisms/GroupCard";
import { WorkGroup } from "@/app/_type/data";
import { BL_INFO, TOP_NAV_MENU } from "@/app/_constants/app";
import { getFetch } from "@/app/_constants/fetch";
import { ApiResponse, SuccessResponse } from "@/app/_type/api";
import { store } from "@/app/_state/store";
import { setLoading } from "@/app/_state/slice/modal";

export default function TemplateTop() {
  const [activeTab, setActiveTab] = useState<number>(TOP_NAV_MENU.TODAY.code);
  const [groups, setGroups] = useState<WorkGroup[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const NAV_ARRAY = Object.values(TOP_NAV_MENU);

  useEffect(() => {
    setIsLoading(true);
    getFetch<WorkGroup[]>(
      BL_INFO.API_ENDPOINT.WORK_GROUP +
      `?type=${NAV_ARRAY.find(tab => tab.code === activeTab)?.code ?? ""}`
    ).then((res: ApiResponse<WorkGroup[]>) => {
      if(res.status !== 200) {
        throw new Error("Failed to fetch timeline data");
      }
      if((res as SuccessResponse<WorkGroup[]>).data === null) {
        throw new Error("No data found");
      }
      const data = (res as SuccessResponse<WorkGroup[]>).data;
      if (Array.isArray(data)) {
        setGroups(data);
      } else {
        console.error("Invalid data format:", res);
      }
    })
    .catch(console.error)
    .finally(() => {
      setIsLoading(false);
      store.dispatch(setLoading(false));
    });
  }, [activeTab]);

  console.log(groups)

  return (
    <div className="flex flex-col bg-white h-screen">
      <OrganismsTabMenu tabMenu={NAV_ARRAY} activeTab={activeTab} onChange={(number)=>{setActiveTab(number)}}/>
      {isLoading
        ? <div className="flex-1 w-full bg-white content-center text-center h-full">
            loading...
          </div>
        : groups.length === 0
            ?(<div className="w-full text-center mt-10">投稿はまだありません</div>)
            :<div className="timeline flex-1 overflow-y-scroll custom-scrollbar px-3">
            {groups.map((group) => (
              <OrganismsGroupCard key={group.id} className="mt-3" group={group} />
            ))}
          </div>
      }
    </div>
  );
}
