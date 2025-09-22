import { CACHE_INFO } from "../app";
import { WorkGroup } from "@/app/_type/data";
import { StorageCache } from "./session";

const myWorksCache
  = new StorageCache<WorkGroup[]>(
    CACHE_INFO.MY_WORKS_DATA.key,
    CACHE_INFO.MY_WORKS_DATA.MAX_SIZE,
    CACHE_INFO.MY_WORKS_DATA.expires
  );

/**
 * 新しいマイワークリストをキャッシュの末尾に追加して保存する
 * @param myWorksList 追加するマイワークリスト
 */
export const pushMyWorksCache = (myWorksList: WorkGroup[]) => {
  const currentMyWorks = myWorksCache.get() || [];
  const updatedMyWorks = [...currentMyWorks, ...myWorksList];
  // 格納数をオーバーした場合、末尾のオーバーした分のデータを削除する
  myWorksCache.set(updatedMyWorks.slice(0, CACHE_INFO.MY_WORKS_DATA.MAX_SIZE));
};

export const getMyWorksCache = (): WorkGroup[] => {
  return myWorksCache.get() || [];
};

export const clearMyWorks = () => {
  myWorksCache.clear();
}