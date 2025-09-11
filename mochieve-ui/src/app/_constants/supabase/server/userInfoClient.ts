import { GetUserData } from "@/app/_type/supabase";
import { SupabaseClient } from "@supabase/supabase-js";

const TBL_NAME = 'user_info'

export const fetchUserInfoByUid = async(supabase: SupabaseClient, uid: string): Promise<GetUserData|undefined> => {
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