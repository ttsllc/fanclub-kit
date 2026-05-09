import type { FanclubConfig } from '../core/types';

/**
 * Landing-page tier comparison cards. Server component (zero JS).
 * Tenants can wrap or restyle — this is the canonical layout.
 */
export function TierCards({
  config,
  signupHref = '/signup',
  className,
}: {
  config: FanclubConfig;
  signupHref?: string;
  className?: string;
}) {
  return (
    <div className={'grid gap-5 md:grid-cols-3 ' + (className ?? '')}>
      {config.tiers.map((t) => {
        const isPaid = t.priceJpy > 0;
        const accent = !!t.accent;
        return (
          <div
            key={t.id}
            className={
              'rounded-2xl p-6 flex flex-col gap-4 transition-colors ' +
              (accent
                ? 'border-2 border-[hsl(var(--primary))] bg-gradient-to-b from-[hsl(330_70%_22%)]/40 to-[hsl(280_30%_8%)]/80 shadow-[0_30px_60px_-30px_hsl(330_85%_45%/0.55)]'
                : 'border border-[hsl(var(--border))] bg-[hsl(var(--card))] hover:border-[hsl(var(--primary))]/40')
            }
          >
            <div className="flex items-center justify-between">
              <h3 className="display text-3xl">{t.label}</h3>
              {t.badge && (
                <span
                  className={
                    'text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold ' +
                    (accent
                      ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
                      : 'border border-[hsl(var(--border-strong))] text-[hsl(var(--foreground))]/70')
                  }
                >
                  {t.badge}
                </span>
              )}
            </div>
            <p className="display text-2xl text-[hsl(var(--primary))]/90">
              {t.priceJpy === 0 ? '¥0' : `¥${t.priceJpy.toLocaleString()} / 月`}
            </p>
            <ul className="space-y-2 text-sm text-[hsl(var(--foreground))]/80">
              {t.perks.map((p) => (
                <li key={p} className="flex items-start gap-2">
                  <span className="text-[hsl(var(--primary))] mt-0.5">▸</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
            <a
              href={`${signupHref}?tier=${encodeURIComponent(t.id)}`}
              className={
                'mt-auto inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-colors ' +
                (accent
                  ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:brightness-110'
                  : 'border border-[hsl(var(--border-strong))] hover:border-[hsl(var(--primary))]/70 hover:text-[hsl(var(--primary))]')
              }
            >
              {isPaid ? `${t.label} で登録 →` : '無料で始める'}
            </a>
          </div>
        );
      })}
    </div>
  );
}
