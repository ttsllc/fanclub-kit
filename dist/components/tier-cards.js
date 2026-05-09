import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Landing-page tier comparison cards. Server component (zero JS).
 * Tenants can wrap or restyle — this is the canonical layout.
 */
export function TierCards({ config, signupHref = '/signup', className, }) {
    return (_jsx("div", { className: 'grid gap-5 md:grid-cols-3 ' + (className ?? ''), children: config.tiers.map((t) => {
            const isPaid = t.priceJpy > 0;
            const accent = !!t.accent;
            return (_jsxs("div", { className: 'rounded-2xl p-6 flex flex-col gap-4 transition-colors ' +
                    (accent
                        ? 'border-2 border-[hsl(var(--primary))] bg-gradient-to-b from-[hsl(330_70%_22%)]/40 to-[hsl(280_30%_8%)]/80 shadow-[0_30px_60px_-30px_hsl(330_85%_45%/0.55)]'
                        : 'border border-[hsl(var(--border))] bg-[hsl(var(--card))] hover:border-[hsl(var(--primary))]/40'), children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h3", { className: "display text-3xl", children: t.label }), t.badge && (_jsx("span", { className: 'text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold ' +
                                    (accent
                                        ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
                                        : 'border border-[hsl(var(--border-strong))] text-[hsl(var(--foreground))]/70'), children: t.badge }))] }), _jsx("p", { className: "display text-2xl text-[hsl(var(--primary))]/90", children: t.priceJpy === 0 ? '¥0' : `¥${t.priceJpy.toLocaleString()} / 月` }), _jsx("ul", { className: "space-y-2 text-sm text-[hsl(var(--foreground))]/80", children: t.perks.map((p) => (_jsxs("li", { className: "flex items-start gap-2", children: [_jsx("span", { className: "text-[hsl(var(--primary))] mt-0.5", children: "\u25B8" }), _jsx("span", { children: p })] }, p))) }), _jsx("a", { href: `${signupHref}?tier=${encodeURIComponent(t.id)}`, className: 'mt-auto inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-colors ' +
                            (accent
                                ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:brightness-110'
                                : 'border border-[hsl(var(--border-strong))] hover:border-[hsl(var(--primary))]/70 hover:text-[hsl(var(--primary))]'), children: isPaid ? `${t.label} で登録 →` : '無料で始める' })] }, t.id));
        }) }));
}
//# sourceMappingURL=tier-cards.js.map