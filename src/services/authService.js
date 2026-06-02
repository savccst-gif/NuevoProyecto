import { supabase, isMockSupabase } from '../config/supabase';

// Datos de ciudadano simulados para pruebas locales y presentaciones offline
const MOCK_CITIZEN = {
  id: "ciudadano-felipe",
  displayName: "Felipe Vásquez Cruz",
  email: "felipe.vasquez@gmail.com",
  photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  rut: "17.115.693-9",
  isVerified: true
};

/**
 * Genera un RUT ficticio pero estético a partir del ID del usuario
 */
const generarRut = (userId) => {
  const hash = userId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const digits = 12000000 + (hash % 8000000);
  return `${digits.toLocaleString('es-CL')}-K`;
};

/**
 * Normaliza un usuario de Supabase al formato interno del portal
 */
const normalizarUsuario = (supabaseUser) => ({
  id: supabaseUser.id,
  displayName: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || "Ciudadano Registrado",
  email: supabaseUser.email,
  photoURL: supabaseUser.user_metadata?.avatar_url || supabaseUser.user_metadata?.picture || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
  rut: generarRut(supabaseUser.id),
  isVerified: true
});

/**
 * Inicia sesión usando Supabase Auth con Google OAuth (simulado como ClaveÚnica).
 * Si no hay credenciales configuradas, ejecuta un simulador con datos de prueba.
 */
export const loginWithClaveUnica = async () => {
  if (isMockSupabase || !supabase) {
    return new Promise((resolve) => {
      console.log("[AuthService] Ejecutando inicio de sesión simulado de ClaveÚnica...");
      setTimeout(() => resolve(MOCK_CITIZEN), 1000);
    });
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent'
      }
    }
  });

  if (error) {
    console.error("[AuthService] Error en inicio de sesión con Google:", error);
    throw error;
  }

  return data;
};

/**
 * Cierra la sesión activa en el portal
 */
export const logoutClaveUnica = async () => {
  if (isMockSupabase || !supabase) {
    return new Promise((resolve) => setTimeout(() => resolve(), 300));
  }

  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("[AuthService] Error al cerrar sesión:", error);
    throw error;
  }
};

export { normalizarUsuario };
