// backend/src/config/database.ts
import { Pool, QueryResult, QueryResultRow } from 'pg';
import { ENV } from './environment';
import { logger } from '../utils/logger';

let pool: Pool | null = null;

if (ENV.DATABASE_URL) {
  try {
    pool = new Pool({
      connectionString: ENV.DATABASE_URL,
      ssl: ENV.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

    pool.on('error', (err) => {
      logger.error('Unexpected error on idle PostgreSQL client', err);
    });

    logger.info('PostgreSQL Pool initialized with DATABASE_URL.');
  } catch (err) {
    logger.warn('Failed to initialize PostgreSQL pool, using mock in-memory fallback.', err);
    pool = null;
  }
} else {
  logger.info('DATABASE_URL not set. FlexGear is running in in-memory Mock Data Store mode.');
}

export const query = async <T extends QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> => {
  if (!pool) {
    throw new Error('Database pool not initialized. Use mock storage services.');
  }
  const start = Date.now();
  const res = await pool.query<T>(text, params);
  const duration = Date.now() - start;
  logger.debug('Executed query', { text, duration, rows: res.rowCount });
  return res;
};

export const getPool = () => pool;
export const isDatabaseConnected = () => pool !== null;
