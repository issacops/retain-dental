import { createClient } from '@supabase/supabase-js';

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  const headers = new Headers({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET',
    'Cache-Control': 'public, max-age=86400, mutable',
  });

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers, status: 204 });
  }

  let iconUrl = url.searchParams.get('url');
  const slug = url.searchParams.get('slug');

  try {
    if (slug && !iconUrl) {
      const supabaseUrl = env.VITE_SUPABASE_URL || env.SUPABASE_URL;
      const supabaseKey = env.VITE_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) {
        return Response.redirect('/icon-192.png', 302);
      }

      const supabase = createClient(supabaseUrl, supabaseKey);
      const cleanSlug = slug.includes('.') ? slug.split('.')[0] : slug;

      const { data: clinic } = await supabase
        .from('clinics')
        .select('logo_url')
        .eq('slug', cleanSlug)
        .single();

      if (!clinic?.logo_url) {
        return Response.redirect('/icon-192.png', 302);
      }
      iconUrl = clinic.logo_url;
    }

    if (!iconUrl) {
      return new Response(JSON.stringify({ error: 'Missing url or slug param' }), {
        headers: { ...headers, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    if (iconUrl.startsWith('data:')) {
      const matches = iconUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return Response.redirect('/icon-192.png', 302);
      }
      const contentType = matches[1];
      const base64Data = matches[2];
      const buffer = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));
      return new Response(buffer, {
        headers: { ...headers, 'Content-Type': contentType },
        status: 200,
      });
    }

    const response = await fetch(iconUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36' },
    });

    if (!response.ok) throw new Error(`Fetch failed: ${response.statusText}`);

    let contentType = response.headers.get('content-type');
    if (iconUrl.includes('.svg') || iconUrl.includes('dicebear')) contentType = 'image/svg+xml';

    const imageBuffer = await response.arrayBuffer();
    return new Response(imageBuffer, {
      headers: { ...headers, 'Content-Type': contentType || 'image/png' },
      status: 200,
    });
  } catch (error) {
    console.error('Icon Handler Error:', error);
    return Response.redirect('/icon-192.png', 302);
  }
}
