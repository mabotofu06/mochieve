import { CACHE_INFO } from "../app";
import { UserInfo } from "@/app/_type/data";

export interface CacheUserInfo {
  name   : string;
  iconImg: string;
}

const userInfoCache 
  = new StorageCache<Map<string, CacheUserInfo>>(
    CACHE_INFO.USER_INFO.key,
    CACHE_INFO.USER_INFO.MAX_SIZE,
    CACHE_INFO.USER_INFO.expires
  );

/**
 * ユーザ情報をローカルストレージに保存\
 * すでに保存されている場合は削除する優先順位を下げて上書きする
 * 
 * @param userInfoList 
 */
export const setUserInfo = (userInfoList: UserInfo[]) => {
  const userInfoMap = userInfoCache.get() || new Map<string, CacheUserInfo>();

  userInfoList.forEach(userInfo => {
    const userId = userInfo.id;
    const userInfoCache: CacheUserInfo = {
      name   : userInfo.name,
      iconImg: userInfo.iconImg
    };
    // Mapの同一キー上書きは一旦削除してからセットすることで末尾になるようにする
    if(userInfoMap.has(userId)) userInfoMap.delete(userId);
    userInfoMap.set(userId, userInfoCache);
  });
  userInfoCache.set(userInfoMap);
}

export const getAllUserInfo = (): UserInfo[] => {
  const userInfoMap = userInfoCache.get() || new Map<string, CacheUserInfo>();
  return Array.from(userInfoMap.entries())
    .map(([id, { name, iconImg }]) => ({ id, name, iconImg }));
};

export const getUserInfoById = (userId: string): UserInfo | undefined => {
  const userInfoMap = userInfoCache.get() || new Map<string, CacheUserInfo>();
  const userInfo = userInfoMap.get(userId);
  return userInfo ? { id: userId, ...userInfo } : undefined;
};