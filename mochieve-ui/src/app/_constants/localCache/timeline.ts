import { CACHE_INFO } from "../app";
import { WorkGroup } from "@/app/_type/data";
import { StorageCache } from "./session";

const timelineCache 
  = new StorageCache<WorkGroup[]>(
    CACHE_INFO.TIMELINE_DATA.key,
    CACHE_INFO.TIMELINE_DATA.MAX_SIZE,
    CACHE_INFO.TIMELINE_DATA.expires
  );

/**
 * 新しいタイムラインリストをキャッシュの先頭に追加して保存する
 * @param timelineList 追加するタイムラインリスト
 */
export const addTimelineCacheToTop = (timelineList: WorkGroup[]) => {
  const currentTimeline = timelineCache.get() || [];
  const updatedTimeline = [...timelineList, ...currentTimeline];
  // 格納数をオーバーした場合、末尾からオーバーした分のデータを削除する
  if (updatedTimeline.length > CACHE_INFO.TIMELINE_DATA.MAX_SIZE) {
    updatedTimeline.splice(CACHE_INFO.TIMELINE_DATA.MAX_SIZE);
  }
  timelineCache.set(updatedTimeline);
};

/**
 * 新しいタイムラインリストをキャッシュの末尾に追加して保存する
 * @param timelineList 追加するタイムラインリスト
 */
export const addTimelineCacheToEnd = (timelineList: WorkGroup[]) => {
  const currentTimeline = timelineCache.get() || [];
  const updatedTimeline = [...currentTimeline, ...timelineList];
  // 格納数をオーバーした場合、先頭からオーバーした分のデータを削除する
  if (updatedTimeline.length > CACHE_INFO.TIMELINE_DATA.MAX_SIZE) {
    updatedTimeline.splice(0, updatedTimeline.length - CACHE_INFO.TIMELINE_DATA.MAX_SIZE);
  }
  timelineCache.set(updatedTimeline);
};

export const getTimelineCache = (): WorkGroup[] => {
  return timelineCache.get() || [];
};