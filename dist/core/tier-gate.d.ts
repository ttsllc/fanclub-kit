import type { FanclubConfig, MemberRecord, TierId } from './types';
/**
 * Check whether a member can access content gated to `requiredTier`.
 * Also verifies that paid-tier expiry hasn't lapsed.
 */
export declare function memberCanAccess(config: FanclubConfig, member: Pick<MemberRecord, 'tierId' | 'tierExpiresAt'>, requiredTier: TierId): boolean;
/**
 * Returns the member's effective tier — falls back to 'free' if a paid
 * tier has expired. (Webhooks should also flip tier_id on expiry, but
 * this is a runtime safety net.)
 */
export declare function effectiveTier(member: Pick<MemberRecord, 'tierId' | 'tierExpiresAt'>): TierId;
//# sourceMappingURL=tier-gate.d.ts.map