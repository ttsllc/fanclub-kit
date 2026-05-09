import type { FanclubConfig, Tier, TierId } from './types';

/**
 * Validate + normalize a tenant's fanclub config. Run once at app boot
 * (e.g. in `lib/fanclub.config.ts`). Throws on invalid input so that
 * misconfiguration fails loud at deploy time, not at first user signup.
 */
export function defineFanclub(input: FanclubConfig): FanclubConfig {
  if (!input.tenantId) throw new Error('fanclub-kit: tenantId is required');
  if (input.tiers.length === 0) throw new Error('fanclub-kit: at least one tier is required');

  const seen = new Set<TierId>();
  for (const t of input.tiers) {
    if (seen.has(t.id)) throw new Error(`fanclub-kit: duplicate tier id "${t.id}"`);
    seen.add(t.id);
    if (t.priceJpy < 0) throw new Error(`fanclub-kit: tier "${t.id}" has negative price`);
    if (t.priceJpy > 0 && !t.stripePriceId) {
      throw new Error(
        `fanclub-kit: tier "${t.id}" is paid (¥${t.priceJpy}) but has no stripePriceId. ` +
          'Create a price in Stripe and copy the price_xxx ID into the config.',
      );
    }
  }
  if (!seen.has('free')) {
    throw new Error('fanclub-kit: a tier with id "free" is required (used as default)');
  }

  // Validate inheritance — referenced tiers must exist
  if (input.inheritance) {
    for (const [from, includes] of Object.entries(input.inheritance)) {
      if (!seen.has(from)) {
        throw new Error(`fanclub-kit: inheritance source "${from}" is not a defined tier`);
      }
      for (const target of includes ?? []) {
        if (!seen.has(target)) {
          throw new Error(
            `fanclub-kit: inheritance target "${target}" (from "${from}") is not a defined tier`,
          );
        }
      }
    }
  }

  return input;
}

/** Get a tier by id; returns undefined if not found. */
export function getTier(config: FanclubConfig, id: TierId): Tier | undefined {
  return config.tiers.find((t) => t.id === id);
}

/** Returns true if the holder of `memberTier` can access `requiredTier` content. */
export function tierGrants(
  config: FanclubConfig,
  memberTier: TierId,
  requiredTier: TierId,
): boolean {
  if (memberTier === requiredTier) return true;
  const inherits = config.inheritance?.[memberTier] ?? [];
  return inherits.includes(requiredTier);
}
