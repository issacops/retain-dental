
import { createClient } from '@supabase/supabase-js';

// Vercel Serverless Function: Unified Icon Endpoint
// Purpose: Serves the correct PWA icon for a clinic by generic slug.
// Handles:
// 1. Database Lookup via Supabase
// 2. Base64/Data-URI Decoding (Permanent Fix for "Heavy" DB strings)
// 3. Remote URL Proxying (Fixes CORS)

export default async function handler(req, res) {
    // 1. Setup CORS & Caching
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Cache-Control', 'public, max-age=86400, mutable');

    let { url, slug } = req.query;

    try {
        // 2. Resolve URL from Slug if provided
        if (slug && !url) {
            const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
            const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

            if (!supabaseUrl || !supabaseKey) {
                console.error("Missing Supabase Env Vars");
                // Fallback to default icon if Env missing (prevent crash)
                return res.redirect('/icon-192.png');
            }

            const supabase = createClient(supabaseUrl, supabaseKey);

            // Normalize slug
            if (slug.includes('.')) slug = slug.split('.')[0];

            const { data: clinic, error } = await supabase
                .from('clinics')
                .select('logo_url')
                .eq('slug', slug)
                .single();

            if (error || !clinic?.logo_url) {
                // Clinic not found or no logo -> Redirect to default
                return res.redirect('/icon-192.png');
            }
            url = clinic.logo_url;
        }

        if (!url) {
            return res.status(400).json({ error: 'Missing url or slug param' });
        }

        // 3. Handle Data URIs (The "Permanent Solution")
        if (url.startsWith('data:')) {
            // Format: data:image/png;base64,iVBORw0KGgo...
            const matches = url.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

            if (!matches || matches.length !== 3) {
                return res.status(500).json({ error: 'Invalid Data URI' });
            }

            const contentType = matches[1];
            const base64Data = matches[2];
            const buffer = Buffer.from(base64Data, 'base64');

            res.setHeader('Content-Type', contentType);
            return res.status(200).send(buffer);
        }

        // 4. Handle Remote URLs (Proxy)
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        if (!response.ok) throw new Error(`Fetch failed: ${response.statusText}`);

        let contentType = response.headers.get('content-type');
        if (url.includes('.svg') || url.includes('dicebear')) contentType = 'image/svg+xml';

        res.setHeader('Content-Type', contentType || 'image/png');

        const arrayBuffer = await response.arrayBuffer();
        return res.status(200).send(Buffer.from(arrayBuffer));

    } catch (error) {
        console.error("Icon Handler Error:", error);
        // Fail gracefuly to default icon so PWA install doesn't break entirely
        return res.redirect('/icon-192.png');
    }
}
