import { NextResponse, type NextRequest } from 'next/server';
import type { FanclubConfig, TierId } from '../core/types';
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
export declare function createMiddleware(opts: {
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
}): (req: NextRequest) => Promise<NextResponse<unknown>>;
//# sourceMappingURL=index.d.ts.map