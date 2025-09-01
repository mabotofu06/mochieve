import { GetUserData, SupabaseResponse } from "@/app/_type/supabase";
import { supabase } from "./client"

const TBL_NAME = 'user_info'

export const fetchUserInfoByUid = async(uid: string): Promise<GetUserData|undefined> => {
  const { data, error }
    = await supabase
      .from(TBL_NAME)
      .select('user_id, name, icon_image, info, create_datetime, update_datetime, delete_flag, delete_datetime')
      .eq('auth_id', uid)
      .eq('delete_flag', false)
      .single();
  if (error) {
    throw error;
  }

  return data as GetUserData;
}