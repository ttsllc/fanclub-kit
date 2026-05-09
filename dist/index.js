/**
 * @triceratops/fanclub-kit — top-level public surface.
 *
 * Most consumers will pull from sub-paths:
 *   - `@triceratops/fanclub-kit/core`        types, tier DSL, schemas
 *   - `@triceratops/fanclub-kit/components`  React UI components
 *   - `@triceratops/fanclub-kit/server`      server actions, Stripe / Supabase glue
 *   - `@triceratops/fanclub-kit/middleware`  tier-gated route helpers
 *
 * The default export here is the tier-config builder — the thing every
 * tenant calls once at app boot.
 */
export { defineFanclub } from './core/tiers';
//# sourceMappingURL=index.js.map