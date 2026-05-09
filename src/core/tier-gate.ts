import type { FanclubConfig, MemberRecord, TierId } from './types';
import { tierGrants } from './tiers';

/**
 * Check whether a member can access content gated to `requiredTier`.
 * Also verifies that paid-tier expiry hasn't lapsed.
 */
export function memberCanAccess(
  config: FanclubConfig,
  member: Pick<MemberRecord, 'tierId' | 'tierExpiresAt'>,
  requiredTier: TierId,
): boolean {
  const effective = effectiveTier(member);
  return tierGrants(config, effective, requiredTier);
}

/**
 * Returns the member's effective tier — falls back to 'free' if a paid
 * tier has expired. (Webhooks should also flip tier_id on expiry, but
 * this is a runtime safety net.)
 */
export function effectiveTier(member: Pick<MemberRecord, 'tierId' | 'tierExpiresAt'>): TierId {
  if (member.tierId === 'free') return 'free';
  if (!member.tierExpiresAt) return member.tierId;
  if (new Date(member.tierExpiresAt).getTime() < Date.now()) return 'free';
  return member.tierId;
}
