import { createClient } from '@supabase/supabase-js';

// Vercel Serverless Function to Create Auth User + CRM Profile
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

    const { clinicId, name, mobile, pin } = req.body;

    if (!clinicId || !name || !mobile) {
        return res.status(400).json({ error: 'Missing Required Fields' });
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

        // 3. Create Auth User
        // Email format: mobile@retain.dental (Unique per system)
        const email = `${mobile}@retain.dental`;
        const password = pin || '123456';

        // Check if user exists first? Supabase createUser throws if exists usually.
        // But we might want to link existing? For now, assume fresh.
        const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email: email,
            password: password,
            email_confirm: true,
            user_metadata: {
                full_name: name,
                role: 'PATIENT'
            }
        });

        if (authError) {
            // If user already exists, we might still want to add them to this clinic?
            // Complicated. For MVP, just fail or return existing ID.
            // Let's throw for now.
            throw authError;
        }

        const newUserId = authUser.user.id;

        // 4. Create CRM Profile (Using Admin Client to bypass RLS/Constraint issues if any)
        // We can use the same RPC or direct insert.
        // Direct insert is safer with Admin client.

        const { data: profile, error: profileError } = await supabaseAdmin.from('profiles').insert({
            id: newUserId,
            clinic_id: clinicId,
            full_name: name,
            mobile: mobile,
            role: 'PATIENT',
            current_tier: 'MEMBER',
            lifetime_spend: 0,
            status: 'ACTIVE'
        }).select().single();

        if (profileError) throw profileError;

        // 5. Create Wallet
        const { error: walletError } = await supabaseAdmin.from('wallets').insert({
            user_id: newUserId,
            balance: 0
        });

        if (walletError) throw walletError;

        return res.status(200).json({ success: true, userId: newUserId });

    } catch (error) {
        console.error("Create Patient Error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
}
