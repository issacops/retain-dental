import { createClient } from '@supabase/supabase-js';

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  let slug = url.searchParams.get('slug');

  const headers = new Headers({
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/manifest+json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
  });

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers, status: 204 });
  }

  if (request.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { headers, status: 405 });
  }

  if (!slug) {
    const host = request.headers.get('host') || '';
    const parts = host.split('.');
    if (parts.length > 3) slug = parts[0];
  }

  const defaultManifest = {
    name: 'Retain.OS',
    short_name: 'Retain',
    description: 'Dental Operating System',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#fefcfb',
    theme_color: '#0d9488',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
    ],
  };

  if (!slug || ['www', 'app', 'platform', 'api'].includes(slug)) {
    return new Response(JSON.stringify(defaultManifest), { headers, status: 200 });
  }

  try {
    const supabaseUrl = env.VITE_SUPABASE_URL || env.SUPABASE_URL;
    const supabaseKey = env.VITE_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return new Response(JSON.stringify(defaultManifest), { headers, status: 200 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: clinic } = await supabase.from('clinics').select('name, primary_color, logo_url').eq('slug', slug).single();

    if (!clinic) {
      return new Response(JSON.stringify(defaultManifest), { headers, status: 200 });
    }

    const iconUrl = `/api/icon?slug=${slug}`;

    const customManifest = {
      ...defaultManifest,
      id: `/?subdomain=${slug}`,
      start_url: `/?subdomain=${slug}`,
      name: clinic.name,
      short_name: clinic.name,
      theme_color: clinic.primary_color || '#0d9488',
      icons: [{ src: iconUrl, sizes: 'any', type: 'image/png', purpose: 'any maskable' }],
    };

    return new Response(JSON.stringify(customManifest), { headers, status: 200 });
  } catch (error) {
    console.error('Manifest Error:', error);
    return new Response(JSON.stringify(defaultManifest), { headers, status: 200 });
  }
}
