import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, isMockFirebase } from '../config/firebase';
import { loginWithClaveUnica, logoutClaveUnica } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Si estamos en modo de producción o con llaves reales de Firebase Auth
    if (!isMockFirebase && auth) {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          // Generar un RUT estético para el portal a partir de la firma única del UID
          const hash = firebaseUser.uid.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
          const digits = 12000000 + (hash % 8000000);
          const rut = `${digits.toLocaleString('es-CL')}-K`;
          
          setUser({
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName || "Ciudadano Registrado",
            email: firebaseUser.email,
            photoURL: firebaseUser.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
            rut: rut,
            isVerified: true
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      // Modo Simulado: Restauramos la sesión persistida del LocalStorage
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
      setUser(loggedUser);
      if (isMockFirebase) {
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
