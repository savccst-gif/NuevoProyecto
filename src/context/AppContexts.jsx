import React, { useState, useEffect, createContext, useContext } from 'react';

export const AccessibilityContext = createContext(null);
export const RouterContext = createContext(null);

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
