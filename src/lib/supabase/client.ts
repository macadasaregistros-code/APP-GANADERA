"use client";

import { createBrowserClient } from "@supabase/ssr";

import { assertSupabaseConfig } from "@/lib/supabase/config";
import type { Database } from "@/lib/supabase/database.types";

export function createSupabaseBrowserClient() {
  const { supabaseUrl, supabaseAnonKey } = assertSupabaseConfig();

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}
