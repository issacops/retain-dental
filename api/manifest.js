import { createClient } from '@supabase/supabase-js';

// Vercel Serverless Function to generate Dynamic Manifests
export default async function handler(req, res) {
    // 1. Setup CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/manifest+json');

    // 2. Determine Subdomain
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    let subdomain = 'platform';

    if (host && !host.includes('localhost')) {
        const parts = host.split('.');
        if (parts.length > 2) {
            subdomain = parts[0];
        }
    }

    // Allow manual override for testing
    if (req.query.slug) {
        subdomain = req.query.slug;
    }

    // REFLECTION MODE: Client passes data, Server signs it as JSON (For Vercel/SPA)
    // This avoids DB hits and ensures what the Client sees is what the Manifest gets
    if (req.query.mode === 'reflect') {
        const { name, short_name, theme_color, bg_color, icon, start_url } = req.query;
        return res.status(200).json({
            name: name || "Retain App",
            short_name: short_name || "Retain",
            start_url: start_url || "/",
            display: "standalone",
            background_color: bg_color || "#0f172a",
            theme_color: theme_color || "#6366f1",
            icons: [
                { src: icon || "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any maskable" },
                { src: icon || "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" }
            ]
        });
    }

    // 3. Default Manifest (Retain OS)
    const defaultManifest = {
        name: "Retain.OS",
        short_name: "Retain",
        description: "Dental Operating System",
        start_url: "/",
        display: "standalone",
        background_color: "#0f172a",
        theme_color: "#6366f1",
        icons: [
            {
                src: "/icon-192.png",
                sizes: "192x192",
                type: "image/png"
            },
            {
                src: "/icon-512.png",
                sizes: "512x512",
                type: "image/png"
            }
        ]
    };

    try {
        // 4. Connect to DB to find Clinic
        // NOTE: Using VITE_ prefixed vars because that's what we have locally/vercel usually.
        // If server-side vars are different, we fallback.
        const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
        const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
            throw new Error("Missing Supabase Config");
        }

        const supabase = createClient(supabaseUrl, supabaseKey);

        // If generic subdomain, return default
        if (['www', 'app', 'platform', 'api'].includes(subdomain)) {
            return res.status(200).json(defaultManifest);
        }

        // Fetch Clinic
        const { data: clinic } = await supabase
            .from('clinics')
            .select('name, primary_color, logo_url')
            .eq('slug', subdomain)
            .single();

        if (!clinic) {
            return res.status(200).json(defaultManifest);
        }

        // 5. Construct Custom Manifest
        const customManifest = {
            ...defaultManifest,
            name: clinic.name,
            short_name: clinic.name,
            theme_color: clinic.primary_color || '#6366f1',
            icons: clinic.logo_url ? [
                {
                    src: clinic.logo_url,
                    sizes: "192x192",
                    type: "image/png"
                },
                {
                    src: clinic.logo_url,
                    sizes: "512x512",
                    type: "image/png"
                }
            ] : defaultManifest.icons
        };

        return res.status(200).json(customManifest);

    } catch (error) {
        console.error("Manifest Error:", error);
        // Fallback to default
        return res.status(200).json(defaultManifest);
    }
}
