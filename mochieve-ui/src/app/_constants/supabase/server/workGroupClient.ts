import { GetWorkGroupsData, SupabaseResponse } from "@/app/_type/supabase";
import { getUserInfo } from "@/app/_composables/userInfo";
import { deleteWorkGroupDetailByGroupId } from "@/app/_state/storage";
import { serverSupabaseClient } from "./client";
import { VALIDATION_LENGTH } from "../../app";

const TBL_NAME = 'work_group'

export const fetchWorkGroupByGroupId = async (groupId: string) => {
  const { data, error } = await serverSupabaseClient
    .from(TBL_NAME)
    .select('*')
    .eq('group_id', groupId)
    .single();

  if (error) {
    throw error;
  }

  return data as GetWorkGroupsData;
};

export const fetchWorkGroupsByUserId = async (userId: string) => {
  const { data, error } = await serverSupabaseClient
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
  const { data, error } = await serverSupabaseClient
    .from('work_group')
    .select('*')
    .limit(limit)
    .order('update_datetime', { ascending: false });
  if (error) {
    throw error;
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

  const { data, error } = await serverSupabaseClient
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
  const { error } = await serverSupabaseClient
    .from(TBL_NAME)
    .update({
      title,
      content,
      images,
      close_flag: VALIDATION_LENGTH.WORK_GROUP.POST_NUM.MAX <= images.length ? true : closeFlag  //12件の投稿数を超えたら自動的にクローズする
    })
    .eq('group_id', groupId);

  if (error) {
    throw error;
  }

  deleteWorkGroupDetailByGroupId(groupId);
};
