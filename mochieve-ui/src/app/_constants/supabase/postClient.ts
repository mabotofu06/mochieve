import { GetPostsData, GetWorkGroupsData, SupabaseResponse } from "@/app/_type/supabase";
import { supabase } from "./client"
import { getUserInfo } from "@/app/_composables/userInfo";

const TBL_NAME = 'work_post'

export const fetchPostsByGroupId = async(groupId: string): Promise<SupabaseResponse<GetPostsData[]>> => {
  console.log(`[${new Date().toISOString()}] fetchPostsByGroupId called for: ${groupId}`)
  
  const { data, error } = await supabase
    .from(TBL_NAME)
    .select('*')
    .eq('group_id', groupId)
    .eq('delete_flag', false)
    .order('update_datetime', { ascending: true })  //古い順に表示
  
  if (error) {
    throw error;
  }
  
  console.log(`[${new Date().toISOString()}] fetchPostsByGroupId completed for: ${groupId}`)
  return data as Array<GetPostsData>;
}

export const insertNewPost = async (image:string, note: string, groupId: string): Promise<string> => {
  const userId = getUserInfo()?.id;
  if(!userId) throw new Error("User not logged in");

  const { data, error } = await supabase
    .from(TBL_NAME)
    .insert({
      content: note,
      image: image,
      group_id: groupId,
      user_id: userId
    })
    .select('post_id')
    .single();

  if (error) {
    throw error;
  }

  return data?.post_id as string;
};
