// Server-side Supabase client for Next.js 15 App Router (RSC + Route Handlers).
// Reads/writes cookies via next/headers so RLS sees the authed user.

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./types";

export async function getSupabaseServer() {
  const cookieStore = await cookies();
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(toSet) {
          try {
            for (const { name, value, options } of toSet) {
              cookieStore.set(name, value, options as CookieOptions);
            }
          } catch {
            // RSC contexts forbid mutation; safe to ignore — middleware (T5) refreshes session.
          }
        },
      },
    }
  );
}
