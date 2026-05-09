'use client';

import { useState } from 'react';

export function LoginForm({
  action,
}: {
  action: (formData: FormData) => Promise<{ ok?: boolean; error?: string }>;
}) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'err'>('idle');
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
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

  return (
    <form onSubmit={onSubmit} className="grid gap-4 max-w-md">
      <label className="grid gap-1.5">
        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[hsl(var(--primary))]/80">
          メールアドレス
        </span>
        <input name="email" type="email" required maxLength={200} className="ec-input" autoComplete="email" />
      </label>
      <label className="grid gap-1.5">
        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[hsl(var(--primary))]/80">
          パスワード
        </span>
        <input name="password" type="password" required maxLength={128} className="ec-input" autoComplete="current-password" />
      </label>
      <button type="submit" disabled={status === 'sending'} className="cta disabled:opacity-50">
        {status === 'sending' ? '認証中…' : '▸ ログイン'}
      </button>
      {status === 'err' && (
        <p className="text-sm text-[hsl(var(--destructive,_0_78%_58%))]">⚠ ログイン失敗 ({error})</p>
      )}
    </form>
  );
}
