# @triceratops/fanclub-kit

White-label fanclub system for Next.js artist sites. Drop-in tier-based
membership (Free / Paid tiers), Supabase Auth, Stripe Subscriptions,
member dashboard with digital membership card.

> Status: **v0.1 — scaffold**. UI shells + tier DSL ready. Supabase /
> Stripe wiring is the next milestone (Phase 2 implementation).

## なぜ作るか

K-pop / J-pop の有名ファンクラブ (Weverse, Storm Lab, ノギザカ) は
ほぼ同じ構造を持つ：

- 会員 ID 採番 / メアド+パスワード認証
- 階層 (Free / Paid)
- Stripe-style 月額 or 年額課金
- 階層別コンテンツ (会報、ライブ先行抽選、限定動画)
- マイページ + デジタル会員証

各タレント / 事務所が個別にこれを実装し直すのはムダ。
`@triceratops/fanclub-kit` で **tier 定義だけ書けば動く** 状態を目指す。

## 設計

### 1. Tier config DSL

```ts
// fanclub.config.ts (per-tenant)
import { defineFanclub } from '@triceratops/fanclub-kit/core';

export const fanclub = defineFanclub({
  brand: {
    name: 'Explosion Candy',
    primaryColor: 'hsl(330 82% 60%)',
    logoUrl: '/brand/explosion_candy-logo.png',
  },
  tiers: [
    { id: 'free', label: 'Free', priceJpy: 0, perks: [...] },
    { id: 'pink', label: 'Pink', priceJpy: 780, stripePriceId: 'price_xxx', perks: [...] },
    { id: 'onyx', label: 'Onyx', priceJpy: 1980, stripePriceId: 'price_yyy', perks: [...] },
  ],
  inheritance: { onyx: ['pink', 'free'], pink: ['free'] },
});
```

### 2. Supabase Schema

```
fanclub_members
  id (uuid, PK)
  member_no (auto-incrementing display ID, e.g. "EC-100123")
  email, password_hash (via Supabase Auth)
  tenant_id (multi-tenant support — fanclub-kit can host multiple FCs)
  tier_id (free|pink|onyx)
  tier_expires_at (null for free, datetime for paid)
  joined_at, updated_at

fanclub_subscriptions
  id, member_id (FK), tier_id, stripe_subscription_id, stripe_customer_id,
  status (active|past_due|canceled|expired), period_end, created_at

fanclub_events  (optional v0.2: ticket lottery)
fanclub_posts   (optional v0.2: tier-gated feed)
```

### 3. Module surface

| Path | 用途 |
|---|---|
| `@triceratops/fanclub-kit` | top-level: `defineFanclub()` |
| `@triceratops/fanclub-kit/core` | types, schemas, tier DSL, business logic |
| `@triceratops/fanclub-kit/components` | React: `<SignupForm />`, `<LoginForm />`, `<MyPage />`, `<TierBadge />` |
| `@triceratops/fanclub-kit/server` | server actions: `signupAction`, `createCheckoutSession`, `handleStripeWebhook` |
| `@triceratops/fanclub-kit/middleware` | `requireTier('pink')` for App Router middleware |

### 4. Integration

```bash
pnpm add @triceratops/fanclub-kit @supabase/ssr @supabase/supabase-js stripe
```

```tsx
// app/fanclub/me/page.tsx
import { MyPage } from '@triceratops/fanclub-kit/components';
import { fanclub } from '@/lib/fanclub.config';

export default function Me() {
  return <MyPage config={fanclub} />;
}
```

```ts
// middleware.ts (Next.js App Router)
import { requireTier } from '@triceratops/fanclub-kit/middleware';
export const middleware = requireTier({
  '/fanclub/onyx': 'onyx',
  '/fanclub/pink': 'pink',
});
```

## ロードマップ

- [x] v0.1: scaffold + tier DSL + UI shells (このコミット)
- [ ] v0.2: Supabase Auth wiring + マイページ実働
- [ ] v0.3: Stripe Subscriptions + Webhook + 階層 sync
- [ ] v0.4: メンバー証 QR + メール通知 (Resend)
- [ ] v0.5: 階層別フィード (CMS 連動)
- [ ] v1.0: ライブチケット先行抽選

## ホスト先

- 白ラベル: `~/projects/shared/fanclub-kit/`、ttsllc/fanclub-kit
- インスタンス#1: `~/projects/clients/DF/explosion-candy-fanclub/`、ttsllc/explosion-candy-fanclub
