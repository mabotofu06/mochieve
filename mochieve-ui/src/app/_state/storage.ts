import { WorkGroup, WorkPost } from "../_type/data";
import { GetPostsData } from "../_type/supabase";
import { createLogger } from "../_constants/utils/logger";

const CACHE_EXPIRE_TIME = 1000 * 60 * 5; // 5 minutes

export const setEditWorkGroupId = (id: string) => {
  if(!id) return;
  if(typeof window === "undefined") return;

  window.sessionStorage.setItem("edit_work_group_id", id);
};

export const getEditWorkGroupId = () => {
  if(typeof window === "undefined") return null;

  return window.sessionStorage.getItem("edit_work_group_id");
};

export const clearEditWorkGroupId = () => {
  if(typeof window === "undefined") return;

  window.sessionStorage.removeItem("edit_work_group_id");
};


const MAX_STACK_NUM = 5;

const getRefreshedWorkGroupDetail = (): Array<{group: WorkGroup; posts: Array<WorkPost>; expire: number }> => {
  const existingDetails = window.sessionStorage.getItem("work_group_details");
  const detailsArray = existingDetails ? JSON.parse(existingDetails) : [];
  // 有効期限が切れたものは削除
  return detailsArray.filter((item: { expire: number }) => item.expire > Date.now());
}

export const addWorkGroupDetail = (groupId: string, group: WorkGroup, posts: Array<WorkPost>) => {
  if (typeof window === "undefined") return;

  const detailsArray = getRefreshedWorkGroupDetail();

  if(detailsArray.find((item: { group: WorkGroup }) => item.group.id === groupId)) {
    // 既にキャッシュに存在する場合は何もしない
    return;
  }

  //そうでなければ新規追加
  // スタックが最大数に達している場合は古いキャッシュを削除
  if (detailsArray.length >= MAX_STACK_NUM) {
    const removed = detailsArray.shift();
    const logger = createLogger('Storage:setWorkGroupDetailCache');
    logger.debug("古いキャッシュを削除しました", { removedGroupId: removed?.group?.id });
  }

  detailsArray.push({group, posts, expire: Date.now() + CACHE_EXPIRE_TIME });
  window.sessionStorage.setItem("work_group_details", JSON.stringify(detailsArray));
};

export const getWorkGroupDetail = (groupId: string) => {
  if (typeof window === "undefined") return null;

  const detailsArray = getRefreshedWorkGroupDetail();

  return detailsArray.find((item: { group: WorkGroup }) => item.group.id === groupId) || null;
};

export const deleteWorkGroupDetailByGroupId = (groupId: string) => {
  if (typeof window === "undefined") return;

  const detailsArray = getRefreshedWorkGroupDetail();

  const newDetailsArray = detailsArray.filter((item: { group: WorkGroup }) => item.group.id !== groupId);
  window.sessionStorage.setItem("work_group_details", JSON.stringify(newDetailsArray));
};

export const clearAllWorkGroupDetails = () => {
  if (typeof window === "undefined") return;

  window.sessionStorage.removeItem("work_group_details");
}
