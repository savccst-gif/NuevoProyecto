import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Configuración de Firebase a partir de variables de entorno de Vite o valores simulados
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "mock-api-key-registration-civil",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "nuevoproyecto-rc.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "nuevoproyecto-rc",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "nuevoproyecto-rc.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1234:web:abcd"
};

// Comprobamos si la API Key es la por defecto, en cuyo caso entraremos en modo simulado para desarrollo local fluido
export const isMockFirebase = firebaseConfig.apiKey === "mock-api-key-registration-civil" || !import.meta.env.VITE_FIREBASE_API_KEY;

let app = null;
let auth = null;
let googleProvider = null;

if (!isMockFirebase) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
  } catch (error) {
    console.warn("Error inicializando Firebase. Activando modo simulado seguro para prototipado:", error);
    app = null;
    auth = null;
    googleProvider = null;
  }
}

export { auth, googleProvider };
