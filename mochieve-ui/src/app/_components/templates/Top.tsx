'use client'

import { OrganismsTabMenu } from "../organisms/TabMenu";
import { useEffect, useState } from "react";
import { OrganismsGroupCard } from "../organisms/GroupCard";
import { WorkGroup } from "@/app/_type/data";
import { SupabaseResponse, GetWorkGroupsData } from "@/app/_type/supabase";
import { fetchWorkGroups } from "@/app/_constants/supabase/workGroupClient";
import { TOP_NAV_MENU } from "@/app/_constants/app";

export default function TemplateTop() {
  const [groups, setGroups] = useState<WorkGroup[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchWorkGroups()
      .then((data: SupabaseResponse<GetWorkGroupsData[]>) => {
        if (Array.isArray(data)) {

          setGroups(data.map(item => ({
            id: item.group_id,
            userInfo: {
              id: item.user_id,
              name: "不明なユーザー",
              iconImg: "",
            },
            title: item.title ?? "",
            images: item.images,
            note: item.content ?? "",
            isClose: item.close_flag,
            updatedAt: item.update_datetime ?? item.create_datetime,
          })));
        } else {
          console.error("Invalid data format:", data);
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
