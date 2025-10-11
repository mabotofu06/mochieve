import { GetWorkGroupsData, SupabaseResponse } from "@/app/_type/supabase";
import { supabase } from "./client"
import { getUserInfo } from "@/app/_composables/userInfo";
import { MAX_POST_NUM } from "../app";
import { deleteWorkGroupDetailByGroupId, getWorkGroupDetail } from "@/app/_state/storage";

const TBL_NAME = 'work_group'

export const fetchWorkGroupByGroupId = async (groupId: string) => {
  console.log(`[${new Date().toISOString()}] fetchWorkGroupByGroupId called for: ${groupId}`)
  
  const { data, error } = await supabase
    .from(TBL_NAME)
    .select('*')
    .eq('group_id', groupId)
    .single();

  if (error) {
    throw error;
  }

  console.log(`[${new Date().toISOString()}] fetchWorkGroupByGroupId completed for: ${groupId}`)
  return data as GetWorkGroupsData;
};

export const fetchWorkGroupsByUserId = async (userId: string) => {
  const { data, error } = await supabase
    .from(TBL_NAME)
    .select('*')
    .eq('user_id', userId)
    .order('update_datetime', { ascending: true });

  if (error) {
    throw error;
  }

  return data as Array<GetWorkGroupsData>;
};

export const fetchWorkGroups = async (limit: number = 20):Promise<SupabaseResponse<GetWorkGroupsData[]>> =>{
  const cacheKey = "work_groups_cache";
  if (typeof window !== 'undefined') {
    const cache = localStorage.getItem(cacheKey);
    if (cache) {
      const { data, timestamp } = JSON.parse(cache);
      if (Date.now() - timestamp < 5 * 60 * 1000) {
        console.log("キャッシュに保存されたデータを返却します")
        return data;
      }
    }
  }

  const { data, error } = await supabase
    .from('work_group')
    .select('*')
    .order('update_datetime', { ascending: false });
  if (error) {
    throw error;
  }
  if (typeof window !== 'undefined') {
    //一度読み込んでから5分間はキャッシュを利用する
    localStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: Date.now() }));
  }
  return data as Array<GetWorkGroupsData>;
};

/**
 * ワークグループを新規作成し、そのIDを返す.
 * @param imageUrl 投稿した画像のURL.
 * @returns 作成したワークグループのID.
 */
export const insertWorkGroup = async (imageUrl: string): Promise<string> => {
  const userId = getUserInfo()?.id;
  if(!userId) throw new Error("User not logged in");

  const { data, error } = await supabase
    .from(TBL_NAME)
    .insert({
      user_id: userId,
      images: [imageUrl]
    })
    .select('group_id')
    .single();

  if (error) {
    throw error;
  }

  return data?.group_id as string;
};

export const updateWorkGroup = async (groupId: string, image: string, closeFlag: boolean = false, title: string = "", content: string = ""): Promise<void> => {
  const workGroup = await fetchWorkGroupByGroupId(groupId);
  if(!workGroup){
    throw new Error("Work group not found");
  }
  if(workGroup.close_flag){
    return;
  }

  const images = [...workGroup.images, image];
  const { error } = await supabase
    .from(TBL_NAME)
    .update({
      title,
      content,
      images,
      close_flag: MAX_POST_NUM <= images.length ? true : closeFlag  //10件の投稿数を超えたら自動的にクローズする
    })
    .eq('group_id', groupId);

  if (error) {
    throw error;
  }

  deleteWorkGroupDetailByGroupId(groupId);
};
