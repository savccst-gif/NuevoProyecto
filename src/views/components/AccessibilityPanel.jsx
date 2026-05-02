import React, { useState } from 'react';
import { Accessibility, X, Type, Minus, Plus, Eye, BookOpen } from 'lucide-react';
import { useAccessibility } from '../../context/AppContexts';

const FONT_SIZES = [13, 16, 19, 22];

export function AccessibilityPanel() {
  const [open, setOpen] = useState(false);
  const { fontSize, highContrast, readingMode, increaseFontSize, decreaseFontSize, toggleHighContrast, toggleReadingMode } = useAccessibility();
  const fontIndex = FONT_SIZES.indexOf(fontSize);

  return (
    <div className="fixed left-4 bottom-6 z-50">
      {open && (
        <div className="mb-3 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between px-5 py-3.5 bg-blue-700">
            <div className="flex items-center gap-2.5 text-white">
              <Accessibility size={16} />
              <span style={{ fontSize: "0.875rem", fontWeight: 700 }}>Accesibilidad</span>
            </div>
            <button onClick={() => setOpen(false)} className="p-1.5 hover:bg-blue-600 rounded-lg text-white/80 hover:text-white transition-colors">
              <X size={14} />
            </button>
          </div>
          <div className="p-4 space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Type size={14} className="text-blue-500 flex-shrink-0" />
                <div><p style={{ fontSize: "0.82rem", fontWeight: 700 }} className="text-slate-700">Tamaño del texto</p></div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={decreaseFontSize} disabled={fontIndex <= 0} className="w-10 h-10 flex items-center justify-center bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-600 rounded-xl transition-colors border border-slate-200"><Minus size={15} /></button>
                <div className="flex-1 flex items-center justify-center gap-2">
                  {FONT_SIZES.map((_, i) => (
                    <div key={i} className={`rounded-full transition-all duration-200 ${i === fontIndex ? "w-4 h-4 bg-blue-600" : "w-2.5 h-2.5 bg-slate-200 hover:bg-slate-300"}`} />
                  ))}
                </div>
                <button onClick={increaseFontSize} disabled={fontIndex >= FONT_SIZES.length - 1} className="w-10 h-10 flex items-center justify-center bg-blue-600 hover:bg-blue-700 disabled:opacity-30 text-white rounded-xl transition-colors"><Plus size={15} /></button>
              </div>
            </div>
            <div className="h-px bg-slate-100" />
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <Eye size={14} className="text-violet-500 flex-shrink-0" />
                <div><p style={{ fontSize: "0.82rem", fontWeight: 700 }} className="text-slate-700">Modo alto contraste</p></div>
              </div>
              <button onClick={toggleHighContrast} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all duration-200 ${highContrast ? "bg-violet-600 border-violet-600 text-white" : "bg-white border-slate-200 text-slate-700"}`}>
                <span style={{ fontSize: "0.8rem", fontWeight: 600 }}>{highContrast ? "Activado" : "Activar contraste"}</span>
                <div className={`w-9 h-5 rounded-full transition-colors relative ${highContrast ? "bg-violet-400" : "bg-slate-200"}`}>
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${highContrast ? "translate-x-4" : "translate-x-0.5"}`} />
                </div>
              </button>
            </div>
            <div className="h-px bg-slate-100" />
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <BookOpen size={14} className="text-amber-500 flex-shrink-0" />
                <div><p style={{ fontSize: "0.82rem", fontWeight: 700 }} className="text-slate-700">Asistente de lectura</p></div>
              </div>
              <button onClick={toggleReadingMode} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all duration-200 ${readingMode ? "bg-amber-500 border-amber-500 text-white" : "bg-white border-slate-200 text-slate-700"}`}>
                <span style={{ fontSize: "0.8rem", fontWeight: 600 }}>{readingMode ? "Activo" : "Activar asistente"}</span>
                <div className={`w-9 h-5 rounded-full transition-colors relative ${readingMode ? "bg-amber-400" : "bg-slate-200"}`}>
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${readingMode ? "translate-x-4" : "translate-x-0.5"}`} />
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
      <button onClick={() => setOpen(!open)} className={`relative flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl transition-all duration-200 hover:shadow-2xl active:scale-95 ${open || highContrast || readingMode || fontSize !== 16 ? "bg-blue-700 text-white" : "bg-white text-blue-700 border border-blue-100"}`}>
        <Accessibility size={18} />
        <span style={{ fontSize: "0.8rem", fontWeight: 600 }} className="hidden sm:block">Accesibilidad</span>
      </button>
    </div>
  );
}
