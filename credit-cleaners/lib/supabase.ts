import { createClient } from "@supabase/supabase-js";
import { env } from "./env";

export const supabaseAdmin = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  { 
    auth: { persistSession: false },
    db: {
      schema: 'public'
    }
  }
);

// Validate Supabase connection
export async function validateSupabaseConnection(): Promise<boolean> {
  try {
    const { data, error } = await supabaseAdmin.from('leads').select('count').limit(1);
    if (error) {
      console.error('Supabase connection test failed:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Supabase connection test error:', error);
    return false;
  }
}
