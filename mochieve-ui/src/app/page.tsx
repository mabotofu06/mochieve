"use client"

import { APP_NAME, API_INFO } from "./_constants/app";
import TemplateTop from "./_components/templates/Top";
import { useEffect, useState } from "react";
import { store } from "./_state/store";
import { openErrorModal, setLoading } from "./_state/slice/modal";
import { getFetch } from "./_constants/fetch";
import { ApiResponse, SuccessResponse } from "./_type/api";
import { WorkGroup } from "./_type/data";
import { createLogger } from "./_constants/utils/logger";

export default function Page() {
  const [groups, setGroups] = useState<WorkGroup[] | null>(null);
  const logger = createLogger('TopPage');
  let isFetching = false;

  useEffect(()=>{
    const searchParams = new URLSearchParams(window.location.search);
    const error = searchParams.get("error");

    if(error) {
      store.dispatch(openErrorModal({title: 'エラー', message: decodeURIComponent(error)}));
    }

    if (isFetching) return;
    document.title = `トップ | ${APP_NAME}`
    //複数回Fetchされるのを防止
    isFetching = true;

    //TODO:後々キャッシュも考慮
    const period = new Date().getTime();
    getFetch<WorkGroup[]>(API_INFO.ENDPOINT.WORK_GROUP + `?period=${period}`,{}, false)
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
          logger.error("Invalid data format", res);
        }
    })
    .catch((error)=>{
      logger.error("Timeline data fetch error", error);
    })
    .finally(() => {
      store.dispatch(setLoading(false));
    });
  },[])

  if(!groups) return null;
  return <TemplateTop groupList={groups}/>;
}
