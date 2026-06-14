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
  const { userId } = body;

  if (!userId) {
    return new Response(JSON.stringify({ error: 'Missing User ID' }), { headers, status: 400 });
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

    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (authError) throw authError;

    const { error: dbError } = await supabaseAdmin.from('profiles').delete().eq('id', userId);
    if (dbError) console.warn('Profile delete warning:', dbError);

    await supabaseAdmin.from('wallets').delete().eq('user_id', userId);

    return new Response(JSON.stringify({ success: true, message: 'User Identity Obliterated' }), {
      headers,
      status: 200,
    });
  } catch (error) {
    console.error('Delete User Error:', error);
    return new Response(JSON.stringify({ success: false, message: error.message }), { headers, status: 500 });
  }
}
