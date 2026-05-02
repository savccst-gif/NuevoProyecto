import React from 'react';
import { User, X } from 'lucide-react';

export function LoginModal({ onClose, onSubmit }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h3 className="font-bold text-slate-800 flex items-center gap-2"><User size={18} className="text-blue-600"/> Ingresa con ClaveÚnica</h3>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">RUT</label>
            <input type="text" placeholder="12.345.678-9" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all font-medium text-slate-700" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">ClaveÚnica</label>
            <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all font-medium text-slate-700" />
          </div>
          <a href="#" className="block text-xs text-blue-600 hover:underline font-medium">¿Olvidaste tu ClaveÚnica?</a>
        </div>
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex flex-col gap-2">
          <button onClick={() => { onSubmit(); onClose(); }} className="w-full py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg rounded-xl transition-all">Continuar</button>
        </div>
      </div>
    </div>
  );
}
