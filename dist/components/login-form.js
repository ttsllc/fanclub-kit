'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
export function LoginForm({ action, }) {
    const [status, setStatus] = useState('idle');
    const [error, setError] = useState(null);
    async function onSubmit(e) {
        e.preventDefault();
        setStatus('sending');
        setError(null);
        const fd = new FormData(e.currentTarget);
        const res = await action(fd);
        if (!res.ok) {
            setError(res.error ?? 'unknown_error');
            setStatus('err');
        }
    }
    return (_jsxs("form", { onSubmit: onSubmit, className: "grid gap-4 max-w-md", children: [_jsxs("label", { className: "grid gap-1.5", children: [_jsx("span", { className: "text-[10px] uppercase tracking-[0.2em] font-bold text-[hsl(var(--primary))]/80", children: "\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9" }), _jsx("input", { name: "email", type: "email", required: true, maxLength: 200, className: "ec-input", autoComplete: "email" })] }), _jsxs("label", { className: "grid gap-1.5", children: [_jsx("span", { className: "text-[10px] uppercase tracking-[0.2em] font-bold text-[hsl(var(--primary))]/80", children: "\u30D1\u30B9\u30EF\u30FC\u30C9" }), _jsx("input", { name: "password", type: "password", required: true, maxLength: 128, className: "ec-input", autoComplete: "current-password" })] }), _jsx("button", { type: "submit", disabled: status === 'sending', className: "cta disabled:opacity-50", children: status === 'sending' ? '認証中…' : '▸ ログイン' }), status === 'err' && (_jsxs("p", { className: "text-sm text-[hsl(var(--destructive,_0_78%_58%))]", children: ["\u26A0 \u30ED\u30B0\u30A4\u30F3\u5931\u6557 (", error, ")"] })), _jsx("style", { children: `
        .ec-input {
          background: hsl(var(--card-elevated));
          border: 1px solid hsl(var(--border));
          border-radius: 0.625rem;
          padding: 0.625rem 0.875rem;
          color: hsl(var(--foreground));
          font-size: 0.875rem;
          width: 100%;
          transition: border-color 120ms ease, box-shadow 120ms ease;
        }
        .ec-input:focus {
          outline: none;
          border-color: hsl(var(--primary));
          box-shadow: 0 0 0 3px hsl(var(--primary) / 0.18);
        }
      ` })] }));
}
//# sourceMappingURL=login-form.js.map