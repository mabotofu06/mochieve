export type SupabaseResponse<T> =  T | SupabaseError | null;

export interface SupabaseError {
  message: string;
  code: string;
  details?: string;
}

export interface GetWorkGroupsData {
  group_id: string;
  user_id: string;
  title: string | null;
  content: string | null;
  images: string[];
  close_flag: boolean;
  create_datetime: string;
  update_datetime: string;
  delete_flag: boolean;
  delete_datetime?: string;
}

export interface GetPostsData {
  post_id : string;
  group_id: string;
  image   : string;
  content?: string;
  create_datetime: string;
  update_datetime: string;
  delete_datetime?: string;
  delete_flag: boolean;
  user_id: string;
}

export interface GetUserData {
  user_id : string;
  name   : string;
  icon_image: string;
  info?: string;
  create_datetime: string;
  update_datetime: string;
  delete_flag: boolean;
  delete_datetime?: string;
}