import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
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

export const getAuthClientFromCookie = (cookie: ReadonlyRequestCookies): SupabaseClient => {
  const accessToken = cookie.get("accessToken")?.value;
  const refreshToken = cookie.get("refreshToken")?.value;

  if (!accessToken) throw new Error("No access token found");
  if (!refreshToken) throw new Error("No refresh token found");

  return createClient(supabaseUrl, supabaseKey, {
    global:{
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  });
}