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
  const [groups, setGroups] = useState<WorkGroup[]>([]);
  useEffect(() => {
    getFetch<WorkGroup[]>(BL_INFO.API_ENDPOINT.GET_TIMELINE)
    .then((res: ApiResponse<WorkGroup[]>) => {
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
    .finally(() => {store.dispatch(setLoading(false));});
  }, []);

  const initialTab = TOP_NAV_MENU[0].code;
  console.log(groups)

  return (
    <div className="flex flex-col bg-white h-screen">
      <OrganismsTabMenu tabMenu={TOP_NAV_MENU} activeTab={initialTab} onChange={()=>{}}/>
      <div className="timeline flex-1 overflow-y-scroll custom-scrollbar px-3">
        {groups.map((group) => (
          <OrganismsGroupCard key={group.id} className="mt-3" group={group} />
        ))}
      </div>
    </div>
  );
}
