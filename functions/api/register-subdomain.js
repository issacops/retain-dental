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
  const { slug, clinicName } = body;

  if (!slug) {
    return new Response(JSON.stringify({ error: 'Missing slug' }), { headers, status: 400 });
  }

  const cfKey = env.CF_API_KEY;
  const cfEmail = env.CF_API_EMAIL;
  const zoneId = env.CF_ZONE_ID || '4d69d9139227318b62ae1a12218d7aa1';
  const accountId = env.CF_ACCOUNT_ID || 'fe5ada0021bdf255f183c95184b5eb96';

  if (!cfKey || !cfEmail) {
    return new Response(JSON.stringify({ error: 'Cloudflare not configured' }), { headers, status: 500 });
  }

  const domain = `${slug}.app.retaindental.com`;

  try {
    // 1. Create DNS CNAME record
    const dnsRes = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records`, {
      method: 'POST',
      headers: {
        'X-Auth-Key': cfKey,
        'X-Auth-Email': cfEmail,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'CNAME',
        name: `${slug}.app`,
        content: 'retaindental-app.pages.dev',
        proxied: true,
        ttl: 1,
      }),
    });

    const dnsData = await dnsRes.json();

    // 2. Register domain on Pages project
    const pagesRes = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/retaindental-app/domains`, {
      method: 'POST',
      headers: {
        'X-Auth-Key': cfKey,
        'X-Auth-Email': cfEmail,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: domain }),
    });

    const pagesData = await pagesRes.json();

    return new Response(JSON.stringify({
      success: dnsData.success && pagesData.success,
      domain,
      dns: dnsData,
      pages: pagesData,
    }), { headers, status: 200 });
  } catch (error) {
    console.error('Register Subdomain Error:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), { headers, status: 500 });
  }
}
