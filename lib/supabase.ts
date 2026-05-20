import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// ==========================================
// Supabase Client Configuration
// ==========================================

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-url.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

/**
 * Browser-side Supabase client.
 * Uses the public anon key — safe to use in client components.
 * Row Level Security (RLS) policies apply to all queries.
 */
export const supabaseClient: SupabaseClient = createClient(
  supabaseUrl,
  supabaseAnonKey
);

/**
 * Server-side Supabase client with admin privileges.
 * Uses the service role key which bypasses RLS.
 * ⚠️  ONLY use in API routes / server-side code — never expose to the client.
 */
export const supabaseAdmin: SupabaseClient = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
