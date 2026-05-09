import type { FanclubConfig, Tier, TierId } from './types';
/**
 * Validate + normalize a tenant's fanclub config. Run once at app boot
 * (e.g. in `lib/fanclub.config.ts`). Throws on invalid input so that
 * misconfiguration fails loud at deploy time, not at first user signup.
 */
export declare function defineFanclub(input: FanclubConfig): FanclubConfig;
/** Get a tier by id; returns undefined if not found. */
export declare function getTier(config: FanclubConfig, id: TierId): Tier | undefined;
/** Returns true if the holder of `memberTier` can access `requiredTier` content. */
export declare function tierGrants(config: FanclubConfig, memberTier: TierId, requiredTier: TierId): boolean;
//# sourceMappingURL=tiers.d.ts.map