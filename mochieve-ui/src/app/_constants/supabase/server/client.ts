import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const serverSupabaseClient = createClient(
  supabaseUrl,
  supabaseKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  }
);

export const getAuthServerClient = (accessToken: string): SupabaseClient => {
  return createClient(supabaseUrl, supabaseKey, {
    global:{
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  });
};