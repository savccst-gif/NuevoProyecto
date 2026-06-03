import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isMockSupabase } from '../config/supabase';
import {
  loginWithClaveUnica,
  loginConEmail,
  registrarUsuario,
  logoutClaveUnica,
  normalizarUsuario,
  obtenerPerfil
} from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [perfil, setPerfil] = useState(null); // { rut, numero_serie, nombre_completo }
  const [loading, setLoading] = useState(true);

  // Carga el perfil extendido (RUT, serie) para un usuario autenticado
  const cargarPerfil = async (userId) => {
    const datos = await obtenerPerfil(userId);
    setPerfil(datos);
  };

  useEffect(() => {
    if (!isMockSupabase && supabase) {
      // Obtener la sesión activa al cargar la app
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          const normalizado = normalizarUsuario(session.user);
          setUser(normalizado);
          cargarPerfil(session.user.id);
        }
        setLoading(false);
      });

      // Escuchar cambios de sesión en tiempo real (login, logout, token refresh)
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          const normalizado = normalizarUsuario(session.user);
          setUser(normalizado);
          cargarPerfil(session.user.id);
        } else {
          setUser(null);
          setPerfil(null);
        }
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    } else {
      // Modo Simulado: restauramos la sesión del LocalStorage
      const savedUser = localStorage.getItem('rc_citizen_session');
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          setUser(parsed);
          // En modo simulado, el perfil vive embebido en el user
          setPerfil({
            rut: parsed.rut,
            numero_serie: parsed.numeroSerie,
            nombre_completo: parsed.displayName
          });
        } catch (e) {
          console.error("Error al restaurar sesión simulada:", e);
        }
      }
      setLoading(false);
    }
  }, []);

  // Login con ClaveÚnica (Google OAuth)
  const login = async () => {
    setLoading(true);
    try {
      const loggedUser = await loginWithClaveUnica();
      if (isMockSupabase) {
        setUser(loggedUser);
        setPerfil({
          rut: loggedUser.rut,
          numero_serie: loggedUser.numeroSerie,
          nombre_completo: loggedUser.displayName
        });
        localStorage.setItem('rc_citizen_session', JSON.stringify(loggedUser));
      }
      return loggedUser;
    } catch (error) {
      setUser(null);
      setPerfil(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Login con email y contraseña
  const loginEmail = async (email, password) => {
    setLoading(true);
    try {
      const loggedUser = await loginConEmail(email, password);
      if (isMockSupabase) {
        setUser(loggedUser);
        setPerfil({
          rut: loggedUser.rut,
          numero_serie: loggedUser.numeroSerie,
          nombre_completo: loggedUser.displayName
        });
        localStorage.setItem('rc_citizen_session', JSON.stringify(loggedUser));
      }
      return loggedUser;
    } catch (error) {
      setUser(null);
      setPerfil(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Registro de nuevo usuario con RUT y serie
  const registrar = async (email, password, nombreCompleto, rut, numeroSerie) => {
    setLoading(true);
    try {
      const newUser = await registrarUsuario(email, password, nombreCompleto, rut, numeroSerie);
      if (isMockSupabase) {
        setUser(newUser);
        setPerfil({ rut, numero_serie: numeroSerie, nombre_completo: nombreCompleto });
        localStorage.setItem('rc_citizen_session', JSON.stringify(newUser));
      }
      return newUser;
    } catch (error) {
      setUser(null);
      setPerfil(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await logoutClaveUnica();
      setUser(null);
      setPerfil(null);
      localStorage.removeItem('rc_citizen_session');
    } catch (error) {
      console.error("[AuthContext] Error al cerrar sesión:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      perfil,
      loading,
      login,
      loginEmail,
      registrar,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
}
