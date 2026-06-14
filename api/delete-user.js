import { createClient } from '@supabase/supabase-js';

// Vercel Serverless Function to HARD DELETE Auth User + CRM Profile
// This is a "God Mode" function for Super Admins to clean up data.
export default async function handler(req, res) {
    // 1. Setup CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ error: 'Missing User ID' });
    }

    try {
        // 2. Setup Admin Client
        const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !serviceRoleKey) {
            throw new Error("Missing Server Config (Service Role Key)");
        }

        const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        });

        // 3. Delete from Auth (This is the critical part that client-side can't do)
        const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);
        
        if (authError) {
            console.error("Auth Delete Error", authError);
            throw authError; 
        }

        // 4. Delete from Public Tables (Profiles, etc.)
        // Note: If ON DELETE CASCADE is set up in SQL, deleting Auth user might handle this automatically.
        // But to be 100% sure in this "Nuclear" option, we explicitly try to delete the profile too.
        // We use the admin client to bypass any potential RLS that might block deletion.
        const { error: dbError } = await supabaseAdmin
            .from('profiles')
            .delete()
            .eq('id', userId);

        if (dbError) {
            console.warn("Profile Delete Error (might have cascaded already)", dbError);
            // We don't throw here strictly, because if Auth is gone, the main goal is achieved.
        }

        // 5. Cleanup Wallets (Again, explicit cleanup for thoroughness)
        await supabaseAdmin.from('wallets').delete().eq('user_id', userId);

        return res.status(200).json({ success: true, message: 'User Identity Obliterated' });

    } catch (error) {
        console.error("Delete User Error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
}
