import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gxfeevstjlepdnyfjzkh.supabase.co';
const rawServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceRoleKey = rawServiceKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy';

export const isSupabaseConfigured = Boolean(
  rawServiceKey &&
  rawServiceKey !== 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy' &&
  !rawServiceKey.includes('placeholder') &&
  !rawServiceKey.includes('your-supabase')
);

/**
 * Server-only Supabase client with service-role permissions.
 * NEVER import this file into Client Components.
 */
export const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

