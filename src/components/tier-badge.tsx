import type { FanclubConfig, TierId } from '../core/types';
import { getTier } from '../core/tiers';

/** Compact pill showing the member's current tier. */
export function TierBadge({ config, tierId }: { config: FanclubConfig; tierId: TierId }) {
  const tier = getTier(config, tierId);
  if (!tier) return null;
  const accent = tier.priceJpy > 0;
  return (
    <span
      className={
        'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold ' +
        (accent
          ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
          : 'border border-[hsl(var(--border-strong))] text-[hsl(var(--foreground))]/70')
      }
    >
      {tier.label}
    </span>
  );
}
