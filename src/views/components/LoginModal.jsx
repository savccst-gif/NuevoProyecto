import React, { useState } from 'react';
import { User, X, AlertCircle, CheckCircle, Eye, EyeOff, IdCard, Hash, Mail, Lock, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { LoginButton } from './LoginButton';

export function LoginModal({ onClose, onSubmit }) {
  const { login, loginEmail: loginEmailFn, registrar } = useAuth();
  const [tab, setTab] = useState('ingresar'); // 'ingresar' | 'registrar'
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showPass, setShowPass] = useState(false);
  const [showPassConfirm, setShowPassConfirm] = useState(false);

  // Campos de login
  const [emailInput, setEmailInput] = useState('');
  const [loginPass, setLoginPass] = useState('');

  // Campos de registro
  const [regNombre, setRegNombre] = useState('');
  const [regRut, setRegRut] = useState('');
  const [regSerie, setRegSerie] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regPassConfirm, setRegPassConfirm] = useState('');

  const resetErrors = () => { setError(null); setSuccess(null); };

  // ── INGRESAR CON CLAVEÚNICA ──────────────────────────────────────────────
  const handleClaveUnicaLogin = async () => {
    setIsLoading(true);
    resetErrors();
    try {
      await login();
      if (onSubmit) onSubmit();
      onClose();
    } catch (err) {
      setError("Error de conexión con ClaveÚnica. Reintente.");
    } finally {
      setIsLoading(false);
    }
  };

  // ── INGRESAR CON EMAIL ───────────────────────────────────────────────────
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    resetErrors();
    if (!emailInput.trim() || !loginPass.trim()) {
      setError("Completa todos los campos.");
      return;
    }
    setIsLoading(true);
    try {
      await loginEmailFn(emailInput, loginPass);
      if (onSubmit) onSubmit();
      onClose();
    } catch (err) {
      const msg = err?.message || '';
      if (msg.includes('Invalid login')) setError("Correo o contraseña incorrectos.");
      else setError("Error al iniciar sesión. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  // ── REGISTRARSE ──────────────────────────────────────────────────────────
  const handleRegistro = async (e) => {
    e.preventDefault();
    resetErrors();

    if (!regNombre.trim() || !regRut.trim() || !regSerie.trim() || !regEmail.trim() || !regPass || !regPassConfirm) {
      setError("Completa todos los campos obligatorios.");
      return;
    }
    if (regPass !== regPassConfirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (regPass.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setIsLoading(true);
    try {
      await registrar(regEmail, regPass, regNombre, regRut, regSerie);
      setSuccess("¡Cuenta creada con éxito! Revisa tu correo para confirmarla si es necesario.");
      setTimeout(() => {
        if (onSubmit) onSubmit();
        onClose();
      }, 2000);
    } catch (err) {
      const msg = err?.message || '';
      if (msg.includes('already registered') || msg.includes('already been registered')) {
        setError("Este correo ya está registrado. Intenta ingresar.");
      } else {
        setError("Error al crear la cuenta. Intenta nuevamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-slate-700 text-sm placeholder-slate-400";
  const labelClass = "block text-[0.78rem] font-bold text-slate-700 mb-1.5 pl-0.5";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

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

        {/* Tabs */}
        <div className="flex border-b border-slate-100">
          <button
            onClick={() => { setTab('ingresar'); resetErrors(); }}
            className={`flex-1 py-3 text-sm font-bold transition-all ${tab === 'ingresar' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/40' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Ingresar
          </button>
          <button
            onClick={() => { setTab('registrar'); resetErrors(); }}
            className={`flex-1 py-3 text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${tab === 'registrar' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/40' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <UserPlus size={13} />
            Registrarse
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Alertas globales */}
          {error && (
            <div className="flex items-center gap-2 p-3.5 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-xs font-semibold animate-in fade-in duration-200">
              <AlertCircle size={14} className="flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 p-3.5 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-600 text-xs font-semibold animate-in fade-in duration-200">
              <CheckCircle size={14} className="flex-shrink-0" />
              <p>{success}</p>
            </div>
          )}

          {/* ── TAB INGRESAR ── */}
          {tab === 'ingresar' && (
            <div className="space-y-5">
              {/* ClaveÚnica */}
              <div className="space-y-2">
                <p className="text-[0.72rem] font-bold text-slate-400 uppercase tracking-widest pl-1">Autenticación Estatal</p>
                <LoginButton onClick={handleClaveUnicaLogin} isLoading={isLoading} />
              </div>

              {/* Separador */}
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100" /></div>
                <span className="relative px-3 bg-white text-[0.68rem] text-slate-400 font-bold uppercase tracking-widest">o con correo</span>
              </div>

              {/* Formulario email/contraseña */}
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div>
                  <label className={labelClass}>Correo Electrónico</label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      placeholder="correo@ejemplo.com"
                      value={emailInput}
                      onChange={e => setEmailInput(e.target.value)}
                      className={`${inputClass} pl-9`}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Contraseña</label>
                  <div className="relative">
                    <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPass ? "text" : "password"}
                      placeholder="••••••••"
                      value={loginPass}
                      onChange={e => setLoginPass(e.target.value)}
                      className={`${inputClass} pl-9 pr-10`}
                    />
                    <button type="button" onClick={() => setShowPass(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                      {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow rounded-2xl transition-all cursor-pointer active:scale-[0.98] disabled:opacity-60"
                >
                  {isLoading ? "Ingresando..." : "Ingresar"}
                </button>
              </form>
            </div>
          )}

          {/* ── TAB REGISTRARSE ── */}
          {tab === 'registrar' && (
            <form onSubmit={handleRegistro} className="space-y-4">
              <p className="text-xs text-slate-500 leading-relaxed bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5">
                Crea tu cuenta con los datos de tu cédula de identidad. Así podrás solicitar documentos sin tener que ingresarlos cada vez.
              </p>

              {/* Nombre */}
              <div>
                <label className={labelClass}>Nombre Completo <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Ej: María González López"
                    value={regNombre}
                    onChange={e => setRegNombre(e.target.value)}
                    className={`${inputClass} pl-9`}
                  />
                </div>
              </div>

              {/* RUT */}
              <div>
                <label className={labelClass}>RUT <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <IdCard size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="12.345.678-9"
                    value={regRut}
                    onChange={e => setRegRut(e.target.value)}
                    className={`${inputClass} pl-9`}
                  />
                </div>
                <p className="text-[0.7rem] text-slate-400 mt-1 pl-0.5">Ingresa tu RUT con puntos y guión.</p>
              </div>

              {/* Número de Serie */}
              <div>
                <label className={labelClass}>Número de Serie (Cédula) <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <Hash size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Ej: A123456789"
                    value={regSerie}
                    onChange={e => setRegSerie(e.target.value)}
                    className={`${inputClass} pl-9`}
                  />
                </div>
                <p className="text-[0.7rem] text-slate-400 mt-1 pl-0.5">Lo encuentras al reverso de tu cédula vigente.</p>
              </div>

              {/* Email */}
              <div>
                <label className={labelClass}>Correo Electrónico <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={regEmail}
                    onChange={e => setRegEmail(e.target.value)}
                    className={`${inputClass} pl-9`}
                  />
                </div>
              </div>

              {/* Contraseña */}
              <div>
                <label className={labelClass}>Contraseña <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="Mínimo 6 caracteres"
                    value={regPass}
                    onChange={e => setRegPass(e.target.value)}
                    className={`${inputClass} pl-9 pr-10`}
                  />
                  <button type="button" onClick={() => setShowPass(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                    {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              {/* Confirmar Contraseña */}
              <div>
                <label className={labelClass}>Confirmar Contraseña <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassConfirm ? "text" : "password"}
                    placeholder="Repite tu contraseña"
                    value={regPassConfirm}
                    onChange={e => setRegPassConfirm(e.target.value)}
                    className={`${inputClass} pl-9 pr-10 ${regPassConfirm && regPass !== regPassConfirm ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-400/20' : regPassConfirm && regPass === regPassConfirm ? 'border-emerald-300 focus:border-emerald-400 focus:ring-emerald-400/20' : ''}`}
                  />
                  <button type="button" onClick={() => setShowPassConfirm(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                    {showPassConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow rounded-2xl transition-all cursor-pointer active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
              >
                <UserPlus size={15} />
                {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
              </button>

              <p className="text-center text-[0.72rem] text-slate-400">
                ¿Ya tienes cuenta?{' '}
                <button type="button" onClick={() => { setTab('ingresar'); resetErrors(); }} className="text-blue-600 font-bold hover:underline">
                  Ingresa aquí
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
