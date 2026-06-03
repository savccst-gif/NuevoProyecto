import React, { useState, useEffect, createContext, useContext } from 'react';
import { crearSolicitud, confirmarSolicitudes, getSolicitudesUsuario } from '../services/solicitudesService';
import { useAuth } from './AuthContext';
import { isMockSupabase } from '../config/supabase';

export const AccessibilityContext = createContext(null);
export const RouterContext = createContext(null);
export const CartContext = createContext(null);

const FONT_SIZES = [13, 16, 19, 22];

export function AccessibilityProvider({ children }) {
  const [fontIndex, setFontIndex] = useState(1);
  const [highContrast, setHighContrast] = useState(false);
  const [readingMode, setReadingMode] = useState(false);

  const fontSize = FONT_SIZES[fontIndex];

  useEffect(() => {
    document.documentElement.style.setProperty("--font-size", `${fontSize}px`);
  }, [fontSize]);

  useEffect(() => {
    const root = document.documentElement;
    if (highContrast) root.setAttribute("data-hc", "1");
    else root.removeAttribute("data-hc");
  }, [highContrast]);

  useEffect(() => {
    const root = document.documentElement;
    if (readingMode) root.setAttribute("data-reading", "1");
    else root.removeAttribute("data-reading");
  }, [readingMode]);

  const increaseFontSize = () => setFontIndex((prev) => Math.min(prev + 1, FONT_SIZES.length - 1));
  const decreaseFontSize = () => setFontIndex((prev) => Math.max(prev - 1, 0));
  const toggleHighContrast = () => setHighContrast((prev) => !prev);
  const toggleReadingMode = () => setReadingMode((prev) => !prev);

  return (
    <AccessibilityContext.Provider value={{
      fontSize, highContrast, readingMode, increaseFontSize,
      decreaseFontSize, toggleHighContrast, toggleReadingMode,
    }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  return useContext(AccessibilityContext);
}

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [confirmedItems, setConfirmedItems] = useState([]);

  // Helper to map DB row to frontend item
  const mapDBRowToItem = (row) => {
    const parts = row.tramite_tipo.split(' | ');
    const type = parts[0];
    
    if (type === 'Visita Agendada') {
      return {
        id: row.id,
        name: row.tramite_nombre,
        type: type,
        price: row.precio,
        iconBg: "bg-amber-50",
        iconColor: "text-amber-600",
        date: parts[1] ? `Fecha: ${parts[1]} a las ${parts[2]} hrs` : null,
        selectedDate: parts[1] || null,
        selectedTime: parts[2] || null,
        comuna: parts[3] || null,
        rut: parts[4] || null,
        email: parts[5] || null
      };
    } else {
      return {
        id: row.id,
        name: row.tramite_nombre,
        type: type,
        price: row.precio,
        iconBg: type === "Reimpresión" ? "bg-blue-50" : "bg-emerald-50",
        iconColor: type === "Reimpresión" ? "text-blue-600" : "text-emerald-600"
      };
    }
  };

  // Sync with Supabase on user session change
  useEffect(() => {
    const cargarSolicitudesDb = async () => {
      if (!isMockSupabase && user?.id) {
        try {
          const solicitudes = await getSolicitudesUsuario(user.id);
          const cart = [];
          const confirmed = [];
          
          solicitudes.forEach(row => {
            const item = mapDBRowToItem(row);
            if (row.estado === 'confirmado') {
              confirmed.push(item);
            } else {
              cart.push(item);
            }
          });
          
          setCartItems(cart);
          setConfirmedItems(confirmed);
        } catch (err) {
          console.error("Error al cargar solicitudes de la base de datos:", err);
        }
      } else if (!user) {
        // Limpiar el carro cuando se cierra sesión
        setCartItems([]);
        setConfirmedItems([]);
      }
    };
    
    cargarSolicitudesDb();
  }, [user]);

  const toggleCart = () => setIsCartOpen(!isCartOpen);
  
  const updateQty = (id, delta) => setCartItems((prev) =>
    prev.map((item) => (item.id === id ? { ...item, qty: item.qty + delta } : item))
        .filter((item) => item.qty > 0)
  );

  const addToCart = async (itemData) => {
    const activeUserId = user?.id || null;
    const uniqueId = itemData.id === 'spark-birth-cert' ? `spark-birth-cert-${Date.now()}` : itemData.id;
    const newItem = { ...itemData, id: uniqueId, qty: 1 };

    setCartItems(prev => [...prev, newItem]);
    setIsCartOpen(true);

    // Persistir en Supabase si el usuario está autenticado
    if (!isMockSupabase && activeUserId) {
      await crearSolicitud(activeUserId, newItem, 'pendiente');
    }
  };

  const addConfirmedItem = async (itemData) => {
    const activeUserId = user?.id || null;
    const uniqueId = Math.random().toString(36).substr(2, 9);
    const newItem = { ...itemData, id: uniqueId, qty: 1 };
    
    setConfirmedItems(prev => [...prev, newItem]);
    
    // Si hay sesión iniciada, guardamos en la base de datos como "confirmado" inmediatamente
    if (!isMockSupabase && activeUserId) {
      await crearSolicitud(activeUserId, newItem, 'confirmado');
    }
  };

  const confirmCart = async () => {
    setConfirmedItems(prev => [...prev, ...cartItems]);
    setCartItems([]);
    setIsCartOpen(false);

    // Actualizar estado en Supabase si el usuario está autenticado
    if (!isMockSupabase && user?.id) {
      await confirmarSolicitudes(user.id);
    }
  };

  const clearCart = () => {
    setCartItems([]);
    setConfirmedItems([]);
  };

  const totalItems = cartItems.length;

  return (
    <CartContext.Provider value={{
      isCartOpen, setIsCartOpen, toggleCart,
      cartItems, updateQty, addToCart, clearCart, totalItems,
      confirmedItems, addConfirmedItem, confirmCart,
      setCurrentUserId: () => {}
    }}>
      {children}
    </CartContext.Provider>
  );
}
