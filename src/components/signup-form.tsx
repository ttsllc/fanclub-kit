'use client';

import { useState } from 'react';
import type { FanclubConfig } from '../core/types';

/**
 * Signup form shell. The tenant wires the `action` prop to a server
 * action that performs the actual Supabase Auth call. v0.1 ships the
 * UI; v0.2 ships the server action default in `@triceratops/fanclub-kit/server`.
 */
export function SignupForm({
  config,
  defaultTierId = 'free',
  action,
}: {
  config: FanclubConfig;
  defaultTierId?: string;
  action: (formData: FormData) => Promise<{ ok?: boolean; error?: string }>;
}) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'err'>('idle');
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    setError(null);
    const fd = new FormData(e.currentTarget);
    const res = await action(fd);
    if (res.ok) setStatus('ok');
    else {
      setError(res.error ?? 'unknown_error');
      setStatus('err');
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 max-w-md">
      <input type="hidden" name="tenantId" value={config.tenantId} />
      <input type="hidden" name="tierId" defaultValue={defaultTierId} />
      <Field label="メールアドレス">
        <input name="email" type="email" required maxLength={200} className="ec-input" autoComplete="email" />
      </Field>
      <Field label="パスワード (8文字以上)">
        <input name="password" type="password" required minLength={8} maxLength={128} className="ec-input" autoComplete="new-password" />
      </Field>
      <Field label="表示名 (任意)">
        <input name="displayName" type="text" maxLength={80} className="ec-input" />
      </Field>
      <label className="flex items-center gap-2 text-xs">
        <input type="checkbox" name="agreeTos" required className="accent-[hsl(var(--primary))]" />
        利用規約に同意します
      </label>
      <label className="flex items-center gap-2 text-xs">
        <input type="checkbox" name="agreePrivacy" required className="accent-[hsl(var(--primary))]" />
        プライバシーポリシーに同意します
      </label>
      <button type="submit" disabled={status === 'sending'} className="cta disabled:opacity-50">
        {status === 'sending' ? '登録中…' : '▸ 登録する'}
      </button>
      {status === 'ok' && (
        <p className="text-sm text-[hsl(var(--accent))]">
          ✓ 仮登録メールを送信しました。受信箱を確認してください。
        </p>
      )}
      {status === 'err' && (
        <p className="text-sm text-[hsl(var(--destructive,_0_78%_58%))]">⚠ 登録失敗 ({error})</p>
      )}
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[hsl(var(--primary))]/80">
        {label}
      </span>
      {children}
    </label>
  );
}
