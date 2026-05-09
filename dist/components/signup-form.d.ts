import type { FanclubConfig } from '../core/types';
/**
 * Signup form shell. The tenant wires the `action` prop to a server
 * action that performs the actual Supabase Auth call. v0.1 ships the
 * UI; v0.2 ships the server action default in `@triceratops/fanclub-kit/server`.
 */
export declare function SignupForm({ config, defaultTierId, action, }: {
    config: FanclubConfig;
    defaultTierId?: string;
    action: (formData: FormData) => Promise<{
        ok?: boolean;
        error?: string;
    }>;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=signup-form.d.ts.map