import type { FanclubConfig } from '../core/types';
export type ActionResult = {
    ok?: boolean;
    error?: string;
};
/**
 * Sign up a new fanclub member.
 *  1) Supabase Auth user created (email + password)
 *  2) `fanclub_insert_member` RPC creates the members row with auto
 *     member_no like "EC-100123"
 *
 * Paid tier checkout flows are layered on top by the tenant's signup
 * action — this function only handles the free-tier base case. Tenants
 * who want immediate Stripe checkout call `createCheckoutSession()`
 * after this returns ok.
 */
export declare function signupAction(config: FanclubConfig, formData: FormData): Promise<ActionResult & {
    userId?: string;
}>;
export declare function loginAction(formData: FormData): Promise<ActionResult>;
export declare function signoutAction(): Promise<ActionResult>;
/**
 * Returns the current member's row joined with auth user, or null if
 * not signed in. Callers must enforce redirect-to-login themselves
 * (server components or middleware).
 */
export declare function getCurrentMember(config: FanclubConfig): Promise<{
    id: string;
    memberNo: string;
    email: string;
    tenantId: string;
    tierId: string;
    tierExpiresAt: string | null;
    joinedAt: string;
    updatedAt: string;
} | null>;
//# sourceMappingURL=actions.d.ts.map