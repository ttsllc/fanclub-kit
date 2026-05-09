import type { SupabaseClient } from '@supabase/supabase-js';
/**
 * Server-side Supabase client bound to the request's cookie jar.
 * Mounts cookies for session persistence across server actions and
 * middleware. Pulls config from env:
 *
 *   NEXT_PUBLIC_SUPABASE_URL
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY
 */
export declare function createSupabaseServerClient(): Promise<SupabaseClient>;
//# sourceMappingURL=supabase.d.ts.map