export async function signInWithGoogle() {
  await supabase.auth.signInWithOAuth({ provider: 'google' });
}
import { GetWorkGroupsData, SupabaseResponse } from '@/app/_type/supabase';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(
  supabaseUrl,
  supabaseKey,
  {
    auth: { persistSession: false }
  });

export async function fetchMyWorkingGroups(): Promise<SupabaseResponse<GetWorkGroupsData[]>> {
  const cacheKey = "my_working_groups_cache";
  if (typeof window !== 'undefined') {
    const cache = localStorage.getItem(cacheKey);
    if (cache) {
      const { data, timestamp } = JSON.parse(cache);
      // 自身の投稿のためキャッシュに永続的に保持、新規投稿があったタイミングで削除し、リフレッシュする
      console.log("キャッシュに保存されたデータを返却します")
      return data;
    }
  }

  const { data, error } = await supabase
    .from('work_group')
    .select('*')
    .eq('user_id', JSON.parse(localStorage.getItem('user_info')??"{}").id)
    .eq('close_flag', false);
  if (error) {
    throw error;
  }
  if (typeof window !== 'undefined') {
    //一度読み込んでから5分間はキャッシュを利用する
    localStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: Date.now() }));
  }
  return data as Array<GetWorkGroupsData>;
}

// サインアップ
export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  return { data, error };
}

// サインイン
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
}

// サインアウト
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}