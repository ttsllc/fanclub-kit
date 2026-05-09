import { cookies } from 'next/headers';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Server-side Supabase client bound to the request's cookie jar.
 * Mounts cookies for session persistence across server actions and
 * middleware. Pulls config from env:
 *
 *   NEXT_PUBLIC_SUPABASE_URL
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY
 */
export async function createSupabaseServerClient(): Promise<SupabaseClient> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error(
      'fanclub-kit: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required',
    );
  }
  const jar = await cookies();
  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return jar.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            jar.set(name, value, options as CookieOptions);
          }
        } catch {
          // Read-only context (e.g. server component during render).
          // Server actions / route handlers will retry the write.
        }
      },
    },
  });
}
