import { createClient } from '@supabase/supabase-js';

// Load env from vite's perspective or use known defaults if .env is missing
import fs from 'fs';
let envUrl = '';
let envKey = '';
try {
  const envContent = fs.readFileSync('.env', 'utf8');
  const envLines = envContent.split('\n');
  for (const line of envLines) {
    if (line.startsWith('VITE_SUPABASE_URL=')) envUrl = line.split('=')[1].trim();
    if (line.startsWith('VITE_SUPABASE_ANON_KEY=')) envKey = line.split('=')[1].trim();
  }
} catch (e) {
  // If no .env, it might be in .env.local
  try {
    const envLocal = fs.readFileSync('.env.local', 'utf8');
    const lines = envLocal.split('\n');
    for (const line of lines) {
      if (line.startsWith('VITE_SUPABASE_URL=')) envUrl = line.split('=')[1].trim();
      if (line.startsWith('VITE_SUPABASE_ANON_KEY=')) envKey = line.split('=')[1].trim();
    }
  } catch (err) {
    console.log("No .env or .env.local found.");
  }
}

if (!envUrl) {
    console.error("Could not find Supabase URL.");
    process.exit(1);
}

const supabase = createClient(envUrl, envKey);

async function seedDoctor() {
  const email = 'e2e-tester-doctor@retaindental.com';
  const password = 'Password123!';

  console.log(`1. Signing up auth user: ${email}...`);
  const { data: authData, error: authErr } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authErr && !authErr.message.includes("User already registered")) {
    console.error("Auth Error:", authErr);
    process.exit(1);
  }

  // Get first available clinic
  console.log("2. Fetching available clinics...");
  const { data: clinics, error: clinicErr } = await supabase.from('clinics').select('id, name').limit(1);
  
  if (clinicErr || !clinics || clinics.length === 0) {
    console.error("Could not fetch a clinic to bind the doctor to.", clinicErr);
    process.exit(1);
  }
  
  const clinicId = clinics[0].id;
  console.log(`-> Binding to Clinic: ${clinics[0].name} (${clinicId})`);

  // Update profile
  console.log("3. Elevating profile to ADMIN role...");
  // Sleep 2s to allow trigger to run
  await new Promise(r => setTimeout(r, 2000));
  
  const { data: updateData, error: updateErr } = await supabase.from('profiles').update({
    role: 'ADMIN',
    clinic_id: clinicId,
    full_name: 'Dr. Automated Tester'
  }).eq('email', email);

  if (updateErr) {
     console.error("Error updating profile:", updateErr);
     process.exit(1);
  }
  
  console.log("✅ Successfully created E2E Doctor context.");
  console.log("Email:", email);
  console.log("Password:", password);
}

seedDoctor();
