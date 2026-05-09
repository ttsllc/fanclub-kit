import { z } from 'zod';

/**
 * Tier identifier — opaque string. We don't lock to a fixed enum because
 * different artists may want different naming (Pink/Onyx for Explosion
 * Candy, Bronze/Silver/Gold for another). The free tier should always
 * use the literal string `'free'` (special-cased in middleware).
 */
export type TierId = string;

export type Perk = string;

export type Tier = {
  id: TierId;
  label: string;
  /** Display blurb under the price. */
  badge?: string;
  /** ¥0 for free tier; positive integer JPY for paid. */
  priceJpy: number;
  /** Required iff priceJpy > 0. Set in Stripe dashboard, copy here. */
  stripePriceId?: string;
  /** Bullet-list perks shown on tier card. */
  perks: Perk[];
  /** Marks this tier as the "recommended" / accent card on landing. */
  accent?: boolean;
};

export type FanclubBrand = {
  name: string;
  /** HSL string, e.g. 'hsl(330 82% 60%)'. */
  primaryColor: string;
  logoUrl: string;
  /** Reply-to / from-name for transactional email (Resend). */
  email: {
    fromName: string;
    fromAddress: string;
  };
  /** Member-no prefix (e.g. 'EC' → 'EC-100123'). */
  memberNoPrefix: string;
};

export type FanclubConfig = {
  /** Stable tenant identifier for multi-tenant DBs. */
  tenantId: string;
  brand: FanclubBrand;
  tiers: Tier[];
  /**
   * Inheritance map: which tiers grant access to which other tiers'
   * content. `{ onyx: ['pink', 'free'], pink: ['free'] }` means an
   * Onyx member sees Pink + Free content too.
   */
  inheritance?: Partial<Record<TierId, TierId[]>>;
};

/** Persisted member row (matches `fanclub_members` table). */
export const MemberRecordSchema = z.object({
  id: z.string().uuid(),
  memberNo: z.string(),
  email: z.string().email(),
  tenantId: z.string(),
  tierId: z.string(),
  tierExpiresAt: z.string().datetime().nullable(),
  joinedAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type MemberRecord = z.infer<typeof MemberRecordSchema>;

export const SignupInputSchema = z.object({
  email: z.string().email().max(200),
  password: z.string().min(8).max(128),
  displayName: z.string().min(1).max(80).optional(),
  /** Optional consent flags. */
  agreeTos: z.boolean(),
  agreePrivacy: z.boolean(),
});
export type SignupInput = z.infer<typeof SignupInputSchema>;

export const LoginInputSchema = z.object({
  email: z.string().email().max(200),
  password: z.string().min(1).max(128),
});
export type LoginInput = z.infer<typeof LoginInputSchema>;
