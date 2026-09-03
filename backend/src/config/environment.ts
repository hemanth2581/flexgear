// backend/src/config/environment.ts
import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  FRONTEND_URL: process.env.CUSTOMER_WEB_URL || process.env.FRONTEND_URL || 'http://localhost:3000',
  CUSTOMER_WEB_URL: process.env.CUSTOMER_WEB_URL || 'http://localhost:3000',
  ADMIN_WEB_URL: process.env.ADMIN_WEB_URL || 'http://localhost:3001',
  
  DATABASE_URL: process.env.DATABASE_URL || '',
  SUPABASE: {
    URL: process.env.SUPABASE_URL || '',
    SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  },
  
  FIREBASE: {
    PROJECT_ID: process.env.FIREBASE_PROJECT_ID || '',
    CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL || '',
    PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : '',
  },
  
  STRIPE: {
    SECRET_KEY: process.env.STRIPE_SECRET_KEY || '',
    WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || '',
  },
  
  JWT: {
    SECRET: process.env.JWT_SECRET || 'flexgear_super_secret_production_jwt_signing_key_12345',
    EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  },
};
