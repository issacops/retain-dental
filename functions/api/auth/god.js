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

  try {
    const body = await request.json();
    const { email, password } = body;

    const godEmail = env.GOD_EMAIL;
    const godPassword = env.GOD_PASSWORD;

    if (!godEmail || !godPassword) {
      return new Response(JSON.stringify({ authenticated: false, error: 'Server not configured' }), { headers, status: 500 });
    }

    const authenticated = email === godEmail && password === godPassword;

    return new Response(JSON.stringify({ authenticated }), { headers, status: authenticated ? 200 : 401 });
  } catch (error) {
    return new Response(JSON.stringify({ authenticated: false, error: error.message }), { headers, status: 500 });
  }
}
