const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load .env.local manually
const envPath = path.join(__dirname, '..', '.env.local');
const envVars = {};
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const idx = trimmed.indexOf('=');
      if (idx > -1) {
        const key = trimmed.substring(0, idx).trim();
        const val = trimmed.substring(idx + 1).trim();
        envVars[key] = val;
      }
    }
  });
}

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envVars.SUPABASE_SERVICE_ROLE_KEY || envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('--- FlexGear Supabase Connection Tester ---');
console.log('Project URL:', supabaseUrl);
console.log('API Key detected:', supabaseKey ? (supabaseKey.substring(0, 15) + '...') : 'NONE');

if (!supabaseUrl || !supabaseKey || supabaseKey.includes('mock') || supabaseKey.includes('placeholder')) {
  console.log('\n[STATUS]: Awaiting valid Supabase API Key.');
  console.log('Please add your NEXT_PUBLIC_SUPABASE_ANON_KEY or SUPABASE_SERVICE_ROLE_KEY to .env.local.');
} else {
  const client = createClient(supabaseUrl, supabaseKey);
  client.from('equipment').select('count', { count: 'exact', head: true })
    .then(({ count, error }) => {
      if (error) {
        console.error('\n[ERROR]: Query failed:', error.message);
        console.log('Tip: If tables are not yet created, execute supabase/COMPLETE_SUPABASE_SETUP.sql in Supabase SQL Editor.');
      } else {
        console.log('\n[SUCCESS]: Successfully connected to Supabase PostgreSQL!');
        console.log(`Equipment count in database: ${count}`);
      }
    })
    .catch(err => {
      console.error('\n[EXCEPTION]: Connection failed:', err.message);
    });
}
