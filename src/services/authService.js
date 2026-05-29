import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider, isMockFirebase } from '../config/firebase';

// Datos de ciudadano simulados de alta calidad para pruebas locales y presentaciones offline
const MOCK_CITIZEN = {
  uid: "ciudadano-felipe",
  displayName: "Felipe Vásquez Cruz",
  email: "felipe.vasquez@gmail.com",
  photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  rut: "17.115.693-9",
  isVerified: true
};

/**
 * Inicia sesión usando Firebase Auth y el proveedor de Google (disfrazado de ClaveÚnica)
 * Si las credenciales de Firebase no están configuradas, ejecuta un simulador de popup premium con datos de prueba estéticos.
 */
export const loginWithClaveUnica = async () => {
  if (isMockFirebase || !auth || !googleProvider) {
    // Simulamos un retraso realista para emular la ventana emergente de inicio de sesión de Google
    return new Promise((resolve) => {
      console.log("[AuthService] Ejecutando inicio de sesión simulado de ClaveÚnica...");
      setTimeout(() => {
        resolve(MOCK_CITIZEN);
      }, 1000);
    });
  }

  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Generar un RUT estético pero ficticio a partir del UID de Google para que sea visible en todo el portal
    const hash = user.uid.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const digits = 12000000 + (hash % 8000000);
    const rut = `${digits.toLocaleString('es-CL')}-K`;

    return {
      uid: user.uid,
      displayName: user.displayName || "Ciudadano Registrado",
      email: user.email,
      photoURL: user.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
      rut: rut,
      isVerified: true
    };
  } catch (error) {
    console.error("[AuthService] Error en inicio de sesión con ClaveÚnica (Google):", error);
    throw error;
  }
};

/**
 * Cierra la sesión activa en el portal
 */
export const logoutClaveUnica = async () => {
  if (isMockFirebase || !auth) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 300);
    });
  }
  return signOut(auth);
};
