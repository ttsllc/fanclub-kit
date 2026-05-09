import { createSupabaseServerClient } from './supabase';
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
export async function signupAction(config, formData) {
    const email = String(formData.get('email') ?? '').trim();
    const password = String(formData.get('password') ?? '');
    const displayName = String(formData.get('displayName') ?? '').trim() || null;
    const agreeTos = formData.get('agreeTos') === 'on';
    const agreePrivacy = formData.get('agreePrivacy') === 'on';
    if (!email || !password)
        return { error: 'email_password_required' };
    if (password.length < 8)
        return { error: 'password_too_short' };
    if (!agreeTos || !agreePrivacy)
        return { error: 'consent_required' };
    const supabase = await createSupabaseServerClient();
    const { data: signUp, error: authErr } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { display_name: displayName } },
    });
    if (authErr) {
        console.warn('[fanclub-kit] auth.signUp failed', authErr.message);
        return { error: authErr.message };
    }
    const userId = signUp.user?.id;
    if (!userId)
        return { error: 'auth_no_user_id' };
    const { error: rpcErr } = await supabase.rpc('fanclub_insert_member', {
        p_user_id: userId,
        p_tenant_id: config.tenantId,
        p_prefix: config.brand.memberNoPrefix,
        p_display_name: displayName,
    });
    if (rpcErr) {
        console.warn('[fanclub-kit] member insert failed', rpcErr.message);
        return { error: 'member_insert_failed: ' + rpcErr.message };
    }
    return { ok: true, userId };
}
export async function loginAction(formData) {
    const email = String(formData.get('email') ?? '').trim();
    const password = String(formData.get('password') ?? '');
    if (!email || !password)
        return { error: 'email_password_required' };
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error)
        return { error: error.message };
    return { ok: true };
}
export async function signoutAction() {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
    return { ok: true };
}
/**
 * Returns the current member's row joined with auth user, or null if
 * not signed in. Callers must enforce redirect-to-login themselves
 * (server components or middleware).
 */
export async function getCurrentMember(config) {
    const supabase = await createSupabaseServerClient();
    const { data: { user }, } = await supabase.auth.getUser();
    if (!user)
        return null;
    const { data, error } = await supabase
        .from('fanclub_members')
        .select('*')
        .eq('id', user.id)
        .eq('tenant_id', config.tenantId)
        .maybeSingle();
    if (error) {
        console.warn('[fanclub-kit] member fetch failed', error.message);
        return null;
    }
    if (!data)
        return null;
    return {
        id: data.id,
        memberNo: data.member_no,
        email: user.email ?? '',
        tenantId: data.tenant_id,
        tierId: data.tier_id,
        tierExpiresAt: data.tier_expires_at ?? null,
        joinedAt: data.joined_at,
        updatedAt: data.updated_at,
    };
}
//# sourceMappingURL=actions.js.map