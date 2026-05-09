import type { FanclubConfig, MemberRecord } from '../core/types';
/**
 * Member dashboard layout — tier card + ID + expiry + sign-out.
 * Tenant supplies `member` from their Supabase query.
 */
export declare function MyPageShell({ config, member, signoutAction, manageBillingHref, }: {
    config: FanclubConfig;
    member: MemberRecord;
    signoutAction: () => Promise<void> | void;
    manageBillingHref?: string;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=my-page-shell.d.ts.map