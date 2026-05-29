import React, { useState } from 'react';
import { User, X, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { LoginButton } from './LoginButton';

export function LoginModal({ onClose, onSubmit }) {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Soporte para RUT y contraseña tradicional como bypass de respaldo
  const [rut, setRut] = useState('');
  const [pass, setPass] = useState('');

  const handleClaveUnicaLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await login();
      if (onSubmit) onSubmit();
      onClose();
    } catch (err) {
      setError("Error de conexión con ClaveÚnica. Reintente.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTraditionalSubmit = (e) => {
    e.preventDefault();
    if (!rut.trim()) {
      setError("Ingrese un RUT válido.");
      return;
    }
    // Login rápido simulado de respaldo
    if (onSubmit) onSubmit();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal Container */}
      <div className="relative bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.18)] w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-slate-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <h3 className="font-extrabold text-slate-800 flex items-center gap-2 text-[0.875rem]">
            <User size={16} className="text-blue-600" />
            Acceso Ciudadano
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {error && (
            <div className="flex items-center gap-2 p-3.5 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-xs font-semibold animate-in shake duration-200">
              <AlertCircle size={14} className="flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {/* Botón Oficial ClaveÚnica (Disparador de Google Auth) */}
          <div className="space-y-2">
            <p className="text-[0.72rem] font-bold text-slate-400 uppercase tracking-widest pl-1">Autenticación Estatal</p>
            <LoginButton onClick={handleClaveUnicaLogin} isLoading={isLoading} />
          </div>

          {/* Separador */}
          <div className="relative flex items-center justify-center my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
            <span className="relative px-3 bg-white text-[0.68rem] text-slate-400 font-bold uppercase tracking-widest">o usa credenciales temporales</span>
          </div>

          {/* Formulario tradicional de respaldo */}
          <form onSubmit={handleTraditionalSubmit} className="space-y-4">
            <div>
              <label className="block text-[0.78rem] font-bold text-slate-700 mb-1.5 pl-0.5">RUT Ciudadano</label>
              <input
                type="text"
                placeholder="12.345.678"
                value={rut}
                onChange={(e) => setRut(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-slate-700 text-sm placeholder-slate-400"
              />
            </div>
            <div>
              <label className="block text-[0.78rem] font-bold text-slate-700 mb-1.5 pl-0.5">Contraseña de acceso</label>
              <input
                type="password"
                placeholder="••••••••"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-slate-700 text-sm placeholder-slate-400"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 text-sm font-bold text-white bg-slate-800 hover:bg-slate-900 shadow-sm hover:shadow rounded-2xl transition-all cursor-pointer active:scale-[0.98]"
              >
                Ingreso Temporal
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
