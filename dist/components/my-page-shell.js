import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { getTier } from '../core/tiers';
import { effectiveTier } from '../core/tier-gate';
import { TierBadge } from './tier-badge';
/**
 * Member dashboard layout — tier card + ID + expiry + sign-out.
 * Tenant supplies `member` from their Supabase query.
 */
export function MyPageShell({ config, member, signoutAction, manageBillingHref, }) {
    const eff = effectiveTier(member);
    const tier = getTier(config, eff);
    const expired = member.tierId !== 'free' && eff === 'free';
    return (_jsxs("section", { className: "max-w-2xl mx-auto space-y-8", children: [_jsxs("header", { className: "space-y-2", children: [_jsx("p", { className: "text-[11px] uppercase tracking-[0.25em] text-[hsl(var(--primary))]/80 font-bold", children: "My Page" }), _jsxs("h1", { className: "display text-3xl lg:text-4xl", children: [config.brand.name, " Fan Club"] })] }), _jsxs("div", { className: "rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("p", { className: "font-mono text-sm text-[hsl(var(--accent))]/90", children: member.memberNo }), _jsx(TierBadge, { config: config, tierId: eff })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4 text-sm", children: [_jsx(Field, { label: "\u8868\u793A\u540D", value: member.email }), _jsx(Field, { label: "\u52A0\u5165\u65E5", value: new Date(member.joinedAt).toLocaleDateString('ja-JP') }), _jsx(Field, { label: "\u73FE\u5728\u306E\u968E\u5C64", value: tier?.label ?? '—' }), _jsx(Field, { label: "\u6709\u52B9\u671F\u9650", value: member.tierExpiresAt
                                    ? new Date(member.tierExpiresAt).toLocaleDateString('ja-JP')
                                    : '無期限' })] }), expired && (_jsx("p", { className: "text-xs text-[hsl(var(--destructive,_0_78%_58%))]", children: "\u26A0 \u6709\u6599\u968E\u5C64\u304C\u671F\u9650\u5207\u308C\u306E\u305F\u3081\u3001\u73FE\u5728 Free \u3068\u3057\u3066\u8868\u793A\u3055\u308C\u3066\u3044\u307E\u3059\u3002\u518D\u8AB2\u91D1\u3067\u5FA9\u5E30\u3057\u307E\u3059\u3002" })), _jsxs("div", { className: "flex flex-wrap gap-3 pt-2", children: [manageBillingHref && (_jsx("a", { href: manageBillingHref, className: "cta", children: "\u25B8 \u8AB2\u91D1\u60C5\u5831\u3092\u7BA1\u7406" })), _jsx("form", { action: signoutAction, children: _jsx("button", { type: "submit", className: "text-xs uppercase tracking-[0.2em] font-bold text-[hsl(var(--foreground))]/55 hover:text-[hsl(var(--primary))]", children: "\u21B3 \u30ED\u30B0\u30A2\u30A6\u30C8" }) })] })] })] }));
}
function Field({ label, value }) {
    return (_jsxs("div", { children: [_jsx("p", { className: "text-[10px] uppercase tracking-[0.18em] text-[hsl(var(--foreground))]/50 font-bold", children: label }), _jsx("p", { className: "text-sm", children: value })] }));
}
//# sourceMappingURL=my-page-shell.js.map