import { supabaseAdmin } from '../lib/supabase/server';

async function runSeed() {
  console.log('Flex Gear Database Seeder initialized...');
  console.log('Target Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL || 'Local / Mock Fallback');

  try {
    const { count, error } = await supabaseAdmin
      .from('equipment')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.warn('Note: Direct Supabase query returned error or placeholder credentials active:', error.message);
      console.log('To run migrations directly in Supabase: Copy files from supabase/migrations/ into the Supabase SQL Editor.');
    } else {
      console.log(`Database connected successfully! Total equipment records found: ${count}`);
    }
  } catch (err) {
    console.error('Seeder connection test exception:', err);
  }
}

runSeed();
