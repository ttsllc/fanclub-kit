import { z } from 'zod';
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
export const SignupInputSchema = z.object({
    email: z.string().email().max(200),
    password: z.string().min(8).max(128),
    displayName: z.string().min(1).max(80).optional(),
    /** Optional consent flags. */
    agreeTos: z.boolean(),
    agreePrivacy: z.boolean(),
});
export const LoginInputSchema = z.object({
    email: z.string().email().max(200),
    password: z.string().min(1).max(128),
});
//# sourceMappingURL=types.js.map