export async function signInWithGoogle() {
  await supabase.auth.signInWithOAuth({ provider: 'google' });
}
import { GetWorkGroupsData, SupabaseResponse } from '@/app/_type/supabase';
import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
export const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// サーバーサイド用のSupabaseクライアント（キャッシング対応 + DDoS対策）
export const supabase = createClient(
  supabaseUrl,
  supabaseKey,
  {
    auth: { persistSession: false },
    global: {
      fetch: (url, options = {}) => {
        // DDoS対策: タイムアウトとアボートコントローラー
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒タイムアウト
        
        return fetch(url, {
          ...options,
          cache: 'force-cache', // Next.js fetchキャッシュを強制
          next: { revalidate: 1800 }, // 30分間キャッシュ
          signal: controller.signal
        }).finally(() => {
          clearTimeout(timeoutId);
        });
      }
    }
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