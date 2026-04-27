"use client";

import { createBrowserClient } from "@supabase/ssr";

import { assertSupabaseConfig } from "@/lib/supabase/config";

export function createSupabaseBrowserClient() {
  const { supabaseUrl, supabaseAnonKey } = assertSupabaseConfig();

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
