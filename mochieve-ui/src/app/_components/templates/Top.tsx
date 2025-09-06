'use client'

import { OrganismsTabMenu } from "../organisms/TabMenu";
import { useEffect, useState } from "react";
import { OrganismsGroupCard } from "../organisms/GroupCard";
import { WorkGroup } from "@/app/_type/data";
import { BL_INFO, TOP_NAV_MENU } from "@/app/_constants/app";
import { getFetch } from "@/app/_constants/fetch";
import { ApiResponse, SuccessResponse } from "@/app/_type/api";

export default function TemplateTop() {
  const [groups, setGroups] = useState<WorkGroup[]>([]);
  const [loading, setLoading] = useState(true);
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
    .finally(() => setLoading(false));

  }, []);

  const initialTab = TOP_NAV_MENU[0].code;
  console.log(groups)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="text-gray-500 text-xl">Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white">
      <OrganismsTabMenu tabMenu={TOP_NAV_MENU} activeTab={initialTab} onChange={()=>{}}>
        <div className="timeline overflow-y-scroll custom-scrollbar px-3 h-screen">
          {groups.map((group) => (
            <OrganismsGroupCard key={group.id} className="mt-3" group={group} />
          ))}
        </div>
      </OrganismsTabMenu>
    </div>
  );
}
