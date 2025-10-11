"use client"

import { APP_NAME, BL_INFO } from "./_constants/app";
import TemplateTop from "./_components/templates/Top";
import { useEffect, useState } from "react";
import { store } from "./_state/store";
import { openErrorModal, setLoading } from "./_state/slice/modal";
import { getFetch } from "./_constants/fetch";
import { getTimelineCache, addTimelineCacheToEnd } from "./_constants/localCache/timeline";
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

    const cachedData: WorkGroup[] = getTimelineCache();

    //TODO:0件以上だと少ないので50件以上など条件を後々変更
    if (cachedData.length > 0) {
      logger.debug("キャッシュから取得", { dataCount: cachedData.length });
      store.dispatch(setLoading(false));
      setGroups(cachedData)
      return;
    }

    const period = new Date().getTime();

    getFetch<WorkGroup[]>(BL_INFO.API_ENDPOINT.WORK_GROUP + `?period=${period}`)
      .then((res: ApiResponse<WorkGroup[]>) => {
        if(res.status !== 200) {
          throw new Error("Failed to fetch timeline data");
        }
        if((res as SuccessResponse<WorkGroup[]>).data === null) {
          throw new Error("No data found");
        }
        const data = (res as SuccessResponse<WorkGroup[]>).data;
        if (Array.isArray(data)) {
          addTimelineCacheToEnd(data);  //TODO:後々上へスクロール、下にスクロールでキャッシュへの追加方法を分ける
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
