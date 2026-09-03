// backend/src/config/supabase.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ENV } from './environment';
import { logger } from '../utils/logger';

let supabaseClient: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient | null => {
  if (supabaseClient) return supabaseClient;

  if (ENV.SUPABASE.URL && ENV.SUPABASE.SERVICE_ROLE_KEY) {
    try {
      supabaseClient = createClient(ENV.SUPABASE.URL, ENV.SUPABASE.SERVICE_ROLE_KEY, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      });
      logger.info('Connected to Supabase PostgreSQL with service role access.');
      return supabaseClient;
    } catch (err: any) {
      logger.error('Failed to initialize Supabase client:', err.message);
    }
  } else {
    logger.info('Supabase URL or Key not set. Running with database adapter.');
  }

  return null;
};
