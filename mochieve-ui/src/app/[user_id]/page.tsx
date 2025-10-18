"use client";
import { TemplatesMyWorks } from "@/app/_components/templates/MyWorks";
import { useEffect, useState } from "react";
import { WorkGroup } from "../_type/data";
import { getFetch } from "../_constants/fetch";
import { SuccessResponse } from "../_type/api";
import { store } from "../_state/store";
import { setLoading } from "../_state/slice/modal";
import { APP_NAME } from "../_constants/app";
import { createLogger } from "../_constants/utils/logger";

type Props = {
  params: Promise<{ user_id: string }>;
}

export default function MyWorkGroup(props: Props) {
  const [userId, setUserId] = useState<string | null>(null);
  const [myWorks, setMyWorks] = useState<WorkGroup[] | null>(null);
  const logger = createLogger('MyWorkGroupPage');
  let isFetch = false;

  useEffect(() => {
    if (isFetch) return;
    isFetch = true;

    fetchMyWorks(props)
      .then((data) => {
        logger.info("Fetched work groups", data.myWorks);
        setMyWorks(data.myWorks);
        setUserId(data.userId);
      })
      .catch((error) => {
        logger.error("Error fetching work groups", error);
        setMyWorks([]);
      })
      .finally(() => {
        store.dispatch(setLoading(false));
        // setIsLoading(false);
      });

  }, []);

  if (!myWorks || !userId) return null;
  document.title = `${userId ?? ""}の投稿一覧 | ${APP_NAME}`;

  return <TemplatesMyWorks myWorks={myWorks} userId={userId} />;
}

async function fetchMyWorks(props: Props): Promise<{ myWorks: WorkGroup[], userId: string }> {
  const params = await props.params;
  const userId = decodeURIComponent(params.user_id);
  if (!userId) throw new Error("User ID is required");
  //TODO:後々キャッシュ導入も検討
  const res = await getFetch<WorkGroup[]>(`/api/v1/work/${userId}`);
  if(res.status !== 200) {
    const logger = createLogger('MyWorkGroupPage:fetchMyWorks');
    logger.error("Error fetching work groups", res);
    throw new Error(res.message || "Unknown error");
  }
  const data = ((res as SuccessResponse<WorkGroup[]>).data);
  const logger = createLogger('MyWorkGroupPage:fetchMyWorks');
  logger.info("APIから取得", { dataCount: data.length });
  return { myWorks: data, userId };
}