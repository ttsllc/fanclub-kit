import type { FanclubConfig, MemberRecord } from '../core/types';
import { getTier } from '../core/tiers';
import { effectiveTier } from '../core/tier-gate';
import { TierBadge } from './tier-badge';

/**
 * Member dashboard layout — tier card + ID + expiry + sign-out.
 * Tenant supplies `member` from their Supabase query.
 */
export function MyPageShell({
  config,
  member,
  signoutAction,
  manageBillingHref,
}: {
  config: FanclubConfig;
  member: MemberRecord;
  signoutAction: () => Promise<void> | void;
  manageBillingHref?: string;
}) {
  const eff = effectiveTier(member);
  const tier = getTier(config, eff);
  const expired = member.tierId !== 'free' && eff === 'free';
  return (
    <section className="max-w-2xl mx-auto space-y-8">
      <header className="space-y-2">
        <p className="text-[11px] uppercase tracking-[0.25em] text-[hsl(var(--primary))]/80 font-bold">
          My Page
        </p>
        <h1 className="display text-3xl lg:text-4xl">{config.brand.name} Fan Club</h1>
      </header>

      <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 space-y-4">
        <div className="flex items-center justify-between">
          <p className="font-mono text-sm text-[hsl(var(--accent))]/90">{member.memberNo}</p>
          <TierBadge config={config} tierId={eff} />
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <Field label="表示名" value={member.email} />
          <Field label="加入日" value={new Date(member.joinedAt).toLocaleDateString('ja-JP')} />
          <Field
            label="現在の階層"
            value={tier?.label ?? '—'}
          />
          <Field
            label="有効期限"
            value={
              member.tierExpiresAt
                ? new Date(member.tierExpiresAt).toLocaleDateString('ja-JP')
                : '無期限'
            }
          />
        </div>
        {expired && (
          <p className="text-xs text-[hsl(var(--destructive,_0_78%_58%))]">
            ⚠ 有料階層が期限切れのため、現在 Free として表示されています。再課金で復帰します。
          </p>
        )}
        <div className="flex flex-wrap gap-3 pt-2">
          {manageBillingHref && (
            <a href={manageBillingHref} className="cta">
              ▸ 課金情報を管理
            </a>
          )}
          <form action={signoutAction}>
            <button
              type="submit"
              className="text-xs uppercase tracking-[0.2em] font-bold text-[hsl(var(--foreground))]/55 hover:text-[hsl(var(--primary))]"
            >
              ↳ ログアウト
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.18em] text-[hsl(var(--foreground))]/50 font-bold">
        {label}
      </p>
      <p className="text-sm">{value}</p>
    </div>
  );
}
