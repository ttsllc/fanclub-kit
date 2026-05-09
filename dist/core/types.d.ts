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
export declare const MemberRecordSchema: z.ZodObject<{
    id: z.ZodString;
    memberNo: z.ZodString;
    email: z.ZodString;
    tenantId: z.ZodString;
    tierId: z.ZodString;
    tierExpiresAt: z.ZodNullable<z.ZodString>;
    joinedAt: z.ZodString;
    updatedAt: z.ZodString;
}, z.core.$strip>;
export type MemberRecord = z.infer<typeof MemberRecordSchema>;
export declare const SignupInputSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    displayName: z.ZodOptional<z.ZodString>;
    agreeTos: z.ZodBoolean;
    agreePrivacy: z.ZodBoolean;
}, z.core.$strip>;
export type SignupInput = z.infer<typeof SignupInputSchema>;
export declare const LoginInputSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export type LoginInput = z.infer<typeof LoginInputSchema>;
//# sourceMappingURL=types.d.ts.map