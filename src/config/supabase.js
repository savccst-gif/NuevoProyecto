import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Modo simulado si no hay credenciales configuradas
export const isMockSupabase = !supabaseUrl || !supabaseAnonKey;

let supabase = null;

if (!isMockSupabase) {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  });
} else {
  console.warn('[Supabase] Variables de entorno no configuradas. Activando modo simulado para prototipado.');
}

export { supabase };
