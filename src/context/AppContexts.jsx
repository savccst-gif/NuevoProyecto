import React, { useState, useEffect, createContext, useContext } from 'react';
import { crearSolicitud, confirmarSolicitudes } from '../services/solicitudesService';

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
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([
    { id: "1", name: "Certificado de Nacimiento (Solicitado)", type: "Para todo trámite", price: 0, qty: 1, iconBg: "bg-blue-50", iconColor: "text-blue-600" }
  ]);
  const [confirmedItems, setConfirmedItems] = useState([
    { id: "c1", name: "Certificado de Matrimonio (Descarga Lista)", type: "Con vigencia", price: 0, qty: 1, iconBg: "bg-rose-50", iconColor: "text-rose-600" }
  ]);

  // userId del ciudadano logueado — si está seteado, persistimos en Supabase
  const [currentUserId, setCurrentUserId] = useState(null);

  const toggleCart = () => setIsCartOpen(!isCartOpen);
  const updateQty = (id, delta) => setCartItems((prev) =>
    prev.map((item) => (item.id === id ? { ...item, qty: item.qty + delta } : item))
        .filter((item) => item.qty > 0)
  );

  const addToCart = async (itemData, userId = null) => {
    const activeUserId = userId || currentUserId;
    const uniqueId = itemData.id === 'spark-birth-cert' ? `spark-birth-cert-${Date.now()}` : itemData.id;
    const newItem = { ...itemData, id: uniqueId, qty: 1 };

    setCartItems(prev => [...prev, newItem]);
    setIsCartOpen(true);

    // Persistir en Supabase si el usuario está autenticado
    if (activeUserId) {
      await crearSolicitud(activeUserId, newItem);
    }
  };

  const addConfirmedItem = (itemData) => {
    setConfirmedItems(prev => {
      const uniqueId = Math.random().toString(36).substr(2, 9);
      return [...prev, { ...itemData, id: uniqueId, qty: 1 }];
    });
  };

  const confirmCart = async () => {
    setConfirmedItems(prev => [...prev, ...cartItems]);
    setCartItems([]);
    setIsCartOpen(false);

    // Actualizar estado en Supabase si el usuario está autenticado
    if (currentUserId) {
      await confirmarSolicitudes(currentUserId);
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
      setCurrentUserId
    }}>
      {children}
    </CartContext.Provider>
  );
}
