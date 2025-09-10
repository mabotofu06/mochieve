import { CACHE_INFO } from "../app";
import { UserInfo, WorkGroup } from "@/app/_type/data";

export interface CacheTimeLineItem {
  name   : string;
  iconImg: string;
}

const timelineCache 
  = new StorageCache<Map<string, CacheTimeLineItem[]>>(
    CACHE_INFO.TIMELINE_DATA.key,
    CACHE_INFO.TIMELINE_DATA.MAX_SIZE,
    CACHE_INFO.TIMELINE_DATA.expires
  );

/**
 * ユーザ情報をローカルストレージに保存\
 * すでに保存されている場合は削除する優先順位を下げて上書きする
 * 
 * @param userInfoList 
 */
export const setTimeline = (timelineList: WorkGroup[]) => {
  const timelineMap = timelineCache.get() || new Map<string, CacheTimeLineItem[]>();

}