'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
/**
 * Signup form shell. The tenant wires the `action` prop to a server
 * action that performs the actual Supabase Auth call. v0.1 ships the
 * UI; v0.2 ships the server action default in `@triceratops/fanclub-kit/server`.
 */
export function SignupForm({ config, defaultTierId = 'free', action, }) {
    const [status, setStatus] = useState('idle');
    const [error, setError] = useState(null);
    async function onSubmit(e) {
        e.preventDefault();
        setStatus('sending');
        setError(null);
        const fd = new FormData(e.currentTarget);
        const res = await action(fd);
        if (res.ok)
            setStatus('ok');
        else {
            setError(res.error ?? 'unknown_error');
            setStatus('err');
        }
    }
    return (_jsxs("form", { onSubmit: onSubmit, className: "grid gap-4 max-w-md", children: [_jsx("input", { type: "hidden", name: "tenantId", value: config.tenantId }), _jsx("input", { type: "hidden", name: "tierId", defaultValue: defaultTierId }), _jsx(Field, { label: "\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9", children: _jsx("input", { name: "email", type: "email", required: true, maxLength: 200, className: "ec-input", autoComplete: "email" }) }), _jsx(Field, { label: "\u30D1\u30B9\u30EF\u30FC\u30C9 (8\u6587\u5B57\u4EE5\u4E0A)", children: _jsx("input", { name: "password", type: "password", required: true, minLength: 8, maxLength: 128, className: "ec-input", autoComplete: "new-password" }) }), _jsx(Field, { label: "\u8868\u793A\u540D (\u4EFB\u610F)", children: _jsx("input", { name: "displayName", type: "text", maxLength: 80, className: "ec-input" }) }), _jsxs("label", { className: "flex items-center gap-2 text-xs", children: [_jsx("input", { type: "checkbox", name: "agreeTos", required: true, className: "accent-[hsl(var(--primary))]" }), "\u5229\u7528\u898F\u7D04\u306B\u540C\u610F\u3057\u307E\u3059"] }), _jsxs("label", { className: "flex items-center gap-2 text-xs", children: [_jsx("input", { type: "checkbox", name: "agreePrivacy", required: true, className: "accent-[hsl(var(--primary))]" }), "\u30D7\u30E9\u30A4\u30D0\u30B7\u30FC\u30DD\u30EA\u30B7\u30FC\u306B\u540C\u610F\u3057\u307E\u3059"] }), _jsx("button", { type: "submit", disabled: status === 'sending', className: "cta disabled:opacity-50", children: status === 'sending' ? '登録中…' : '▸ 登録する' }), status === 'ok' && (_jsx("p", { className: "text-sm text-[hsl(var(--accent))]", children: "\u2713 \u4EEE\u767B\u9332\u30E1\u30FC\u30EB\u3092\u9001\u4FE1\u3057\u307E\u3057\u305F\u3002\u53D7\u4FE1\u7BB1\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002" })), status === 'err' && (_jsxs("p", { className: "text-sm text-[hsl(var(--destructive,_0_78%_58%))]", children: ["\u26A0 \u767B\u9332\u5931\u6557 (", error, ")"] }))] }));
}
function Field({ label, children }) {
    return (_jsxs("label", { className: "grid gap-1.5", children: [_jsx("span", { className: "text-[10px] uppercase tracking-[0.2em] font-bold text-[hsl(var(--primary))]/80", children: label }), children] }));
}
//# sourceMappingURL=signup-form.js.map