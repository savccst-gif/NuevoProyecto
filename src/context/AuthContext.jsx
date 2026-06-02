import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isMockSupabase } from '../config/supabase';
import { loginWithClaveUnica, logoutClaveUnica, normalizarUsuario } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isMockSupabase && supabase) {
      // Obtener la sesión activa al cargar la app
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser(normalizarUsuario(session.user));
        }
        setLoading(false);
      });

      // Escuchar cambios de sesión en tiempo real (login, logout, token refresh)
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser(normalizarUsuario(session.user));
        } else {
          setUser(null);
        }
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    } else {
      // Modo Simulado: restauramos la sesión del LocalStorage
      const savedUser = localStorage.getItem('rc_citizen_session');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          console.error("Error al restaurar sesión simulada:", e);
        }
      }
      setLoading(false);
    }
  }, []);

  const login = async () => {
    setLoading(true);
    try {
      const loggedUser = await loginWithClaveUnica();
      // En modo real, el usuario se establece via onAuthStateChange al volver del redirect
      // En modo mock, lo establecemos directamente
      if (isMockSupabase) {
        setUser(loggedUser);
        localStorage.setItem('rc_citizen_session', JSON.stringify(loggedUser));
      }
      return loggedUser;
    } catch (error) {
      setUser(null);
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
      localStorage.removeItem('rc_citizen_session');
    } catch (error) {
      console.error("[AuthContext] Error al cerrar sesión:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
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
