import { createClient } from '@supabase/supabase-js';

export async function onRequest(context) {
  const { request, env } = context;

  const headers = new Headers({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  });

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers, status: 204 });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { headers, status: 405 });
  }

  const body = await request.json();
  const { clinicId, name, mobile, pin } = body;

  if (!clinicId || !name || !mobile) {
    return new Response(JSON.stringify({ error: 'Missing Required Fields' }), { headers, status: 400 });
  }

  try {
    const supabaseUrl = env.VITE_SUPABASE_URL || env.SUPABASE_URL;
    const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error('Missing Server Config (Service Role Key)');
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const email = `${mobile}@retain.dental`;
    const password = pin || '123456';

    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: name, role: 'PATIENT' },
    });

    if (authError) throw authError;

    const newUserId = authUser.user.id;

    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: newUserId,
        clinic_id: clinicId,
        full_name: name,
        mobile,
        role: 'PATIENT',
        current_tier: 'MEMBER',
        lifetime_spend: 0,
        status: 'ACTIVE',
      })
      .select()
      .single();

    if (profileError) throw profileError;

    const { error: walletError } = await supabaseAdmin.from('wallets').insert({
      user_id: newUserId,
      balance: 0,
    });

    if (walletError) throw walletError;

    return new Response(JSON.stringify({ success: true, userId: newUserId }), { headers, status: 200 });
  } catch (error) {
    console.error('Create Patient Error:', error);
    return new Response(JSON.stringify({ success: false, message: error.message }), { headers, status: 500 });
  }
}
