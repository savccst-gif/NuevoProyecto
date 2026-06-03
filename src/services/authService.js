import { supabase, isMockSupabase } from '../config/supabase';

// Datos de ciudadano simulados para pruebas locales y presentaciones offline
const MOCK_CITIZEN = {
  id: "ciudadano-felipe",
  displayName: "Felipe Vásquez Cruz",
  email: "felipe.vasquez@gmail.com",
  photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  rut: "17.115.693-9",
  numeroSerie: "A123456789",
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
  rut: supabaseUser.user_metadata?.rut || generarRut(supabaseUser.id),
  numeroSerie: supabaseUser.user_metadata?.numero_serie || null,
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
 * Inicia sesión con email y contraseña
 */
export const loginConEmail = async (email, password) => {
  if (isMockSupabase || !supabase) {
    return new Promise((resolve) => {
      console.log("[AuthService] Login simulado con email...");
      setTimeout(() => resolve(MOCK_CITIZEN), 800);
    });
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.error("[AuthService] Error en login con email:", error);
    throw error;
  }

  return normalizarUsuario(data.user);
};

/**
 * Registra un nuevo usuario con email/contraseña y guarda su perfil (RUT, serie) en la DB.
 * Los datos de RUT y serie se pasan en los metadatos del usuario — un trigger de DB los
 * lee automáticamente e inserta en la tabla `perfiles` con SECURITY DEFINER (sin problema de RLS).
 * @param {string} email
 * @param {string} password
 * @param {string} nombreCompleto
 * @param {string} rut
 * @param {string} numeroSerie
 */
export const registrarUsuario = async (email, password, nombreCompleto, rut, numeroSerie) => {
  if (isMockSupabase || !supabase) {
    return new Promise((resolve) => {
      console.log("[AuthService] Registro simulado...");
      const mockUser = { ...MOCK_CITIZEN, displayName: nombreCompleto, email, rut, numeroSerie };
      setTimeout(() => resolve(mockUser), 1000);
    });
  }

  // Pasamos RUT y serie en los metadatos — el trigger de Supabase los leerá
  // y creará el registro en `perfiles` automáticamente (SECURITY DEFINER, sin RLS)
  const { data, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: nombreCompleto,
        rut: rut,
        numero_serie: numeroSerie
      }
    }
  });

  if (signUpError) {
    console.error("[AuthService] Error al registrar usuario:", signUpError);
    throw signUpError;
  }

  if (!data.user) throw new Error("No se obtuvo usuario tras el registro.");

  console.log("[AuthService] Usuario registrado:", data.user.id);
  // El trigger `on_auth_user_created_perfil` en Supabase creará el perfil automáticamente.

  return {
    id: data.user.id,
    displayName: nombreCompleto,
    email,
    rut,
    numeroSerie,
    isVerified: false
  };
};

/**
 * Obtiene el perfil completo de un usuario desde la tabla perfiles
 * @param {string} userId
 */
export const obtenerPerfil = async (userId) => {
  if (isMockSupabase || !supabase || !userId) return null;

  const { data, error } = await supabase
    .from('perfiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.warn("[AuthService] No se encontró perfil para el usuario:", userId);
    return null;
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
