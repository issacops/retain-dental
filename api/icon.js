
// Vercel Serverless Function: Icon Proxy
// Purpose: Fetch external images (Supabase/DiceBear) and serve them with 
// correct CORS and Content-Type headers to ensure Chrome PWA Installer accepts them.

export default async function handler(req, res) {
    // 1. Setup CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Cache-Control', 'public, max-age=86400, mutable'); // Cache for 1 day

    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'Missing url param' });
    }

    try {
        // 2. Fetch the external image
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.statusText}`);
        }

        // 3. Get Content-Type (and fix SVG mime type if needed)
        let contentType = response.headers.get('content-type');

        // Sanitize Content-Type for SVGs to ensure browser renders it
        if (url.includes('.svg') || url.includes('dicebear')) {
            // Sometimes servers send text/plain for SVGs
            contentType = 'image/svg+xml';
        }

        // 4. Set Headers and Stream
        res.setHeader('Content-Type', contentType || 'image/png');

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        return res.status(200).send(buffer);

    } catch (error) {
        console.error("Icon Proxy Error:", error);
        return res.status(500).json({ error: 'Failed to proxy icon' });
    }
}
