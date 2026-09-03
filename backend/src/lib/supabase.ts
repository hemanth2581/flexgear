import { createClient } from '@supabase/supabase-js'
import { ENV } from '../config/environment'

const supabaseUrl = ENV.SUPABASE.URL || process.env.SUPABASE_URL || 'https://mock.supabase.co'
const supabaseKey = ENV.SUPABASE.SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || 'mock-key'

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
})
