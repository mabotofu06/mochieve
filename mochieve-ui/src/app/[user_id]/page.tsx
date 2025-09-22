"use client";
import { TemplatesMyWorks } from "@/app/_components/templates/MyWorks";
import { useEffect, useState } from "react";
import { WorkGroup } from "../_type/data";
import { getFetch } from "../_constants/fetch";
import { SuccessResponse } from "../_type/api";
import { getMyWorksCache, pushMyWorksCache } from "../_constants/localCache/myWork";
import { store } from "../_state/store";
import { setLoading } from "../_state/slice/modal";
import { APP_NAME } from "../_constants/app";

type Props = {
  params: Promise<{ user_id: string }>;
}

export default function MyWorkGroup(props: Props) {
  const [userId, setUserId] = useState<string | null>(null);
  const [myWorks, setMyWorks] = useState<WorkGroup[] | null>(null);
  let isFetch = false;

  useEffect(() => {
    if (isFetch) return;
    isFetch = true;

    fetchMyWorks(props)
      .then((data) => {
        setMyWorks(data.myWorks);
        setUserId(data.userId);
      })
      .catch((error) => {
        console.error("Error fetching work groups:", error);
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
  //キャッシュ確認
  const cache = getMyWorksCache();
  if (cache.length > 0) {
    console.log("キャッシュから取得");
    return { myWorks: cache, userId };
  }

  const res = await getFetch<WorkGroup[]>(`/api/v1/work/${userId}`);
  if(res.status !== 200) {
    console.error("Error fetching work groups:", res);
    throw new Error(res.message || "Unknown error");
  }
  const data = ((res as SuccessResponse<WorkGroup[]>).data);
  console.log("APIから取得", data);
  pushMyWorksCache(data);
  return { myWorks: data, userId };
}