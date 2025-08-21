/**
 * Environment variable validation
 */

function requireEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  // Supabase
  SUPABASE_URL: requireEnvVar('SUPABASE_URL'),
  SUPABASE_SERVICE_ROLE_KEY: requireEnvVar('SUPABASE_SERVICE_ROLE_KEY'),
  
  // Email Octopus (optional for now)
  EMAILOCTOPUS_API_KEY: process.env.EMAILOCTOPUS_API_KEY || '',
  EMAILOCTOPUS_LIST_ID: process.env.EMAILOCTOPUS_LIST_ID || '',
  
  // App
  NODE_ENV: process.env.NODE_ENV || 'development',
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
} as const;

export function validateEnvironment(): void {
  try {
    // This will throw if required vars are missing
    requireEnvVar('SUPABASE_URL');
    requireEnvVar('SUPABASE_SERVICE_ROLE_KEY');
  } catch (error) {
    console.error('Environment validation failed:', error);
    process.exit(1);
  }
}
