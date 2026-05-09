import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import type { FanclubConfig, TierId } from '../core/types';
import { tierGrants } from '../core/tiers';

/**
 * Build a Next.js middleware that:
 *   1. Refreshes the Supabase session cookie on every request
 *   2. Optionally gates routes by required tier
 *
 * Usage in tenant `middleware.ts`:
 *
 *   import { fanclub } from '@/lib/fanclub.config';
 *   import { createMiddleware } from '@triceratops/fanclub-kit/middleware';
 *
 *   export const middleware = createMiddleware({
 *     config: fanclub,
 *     gates: {
 *       '/onyx': 'onyx',
 *       '/pink': 'pink',
 *       '/me':   '*authenticated',  // sentinel: must be signed in
 *     },
 *   });
 *
 *   export const config = { matcher: ['/((?!_next|favicon|api/).*)'] };
 */
export function createMiddleware(opts: {
  config: FanclubConfig;
  /**
   * Map URL prefix → required tier id, or `'*authenticated'` to require
   * any signed-in member regardless of tier.
   */
  gates?: Record<string, TierId | '*authenticated'>;
  /** Where to send unauthenticated users. Default: '/login'. */
  loginPath?: string;
  /** Where to send under-tier users. Default: '/' (the tier card page). */
  upgradePath?: string;
}) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const loginPath = opts.loginPath ?? '/login';
  const upgradePath = opts.upgradePath ?? '/';

  return async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const matchedGate = opts.gates
      ? Object.entries(opts.gates).find(([prefix]) => pathname.startsWith(prefix))
      : undefined;

    let response = NextResponse.next({ request: req });
    if (!url || !anonKey) {
      // Misconfiguration — let the request through; pages will surface env error.
      return response;
    }

    const supabase = createServerClient(url, anonKey, {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value, options } of cookiesToSet) {
            req.cookies.set(name, value);
            response = NextResponse.next({ request: req });
            response.cookies.set(name, value, options as CookieOptions);
          }
        },
      },
    });
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (matchedGate) {
      const [, requirement] = matchedGate;
      if (!user) return NextResponse.redirect(new URL(loginPath, req.url));
      if (requirement !== '*authenticated') {
        const { data: member } = await supabase
          .from('fanclub_members')
          .select('tier_id')
          .eq('id', user.id)
          .eq('tenant_id', opts.config.tenantId)
          .maybeSingle();
        const memberTier = (member?.tier_id as TierId | undefined) ?? 'free';
        if (!tierGrants(opts.config, memberTier, requirement)) {
          return NextResponse.redirect(new URL(upgradePath, req.url));
        }
      }
    }

    return response;
  };
}
