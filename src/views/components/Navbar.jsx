import React, { useState, useContext } from 'react';
import { Phone, Globe, User, Bell, Package, ShoppingCart, Menu, X } from 'lucide-react';
import { RouterContext } from '../../context/AppContexts';

export function Navbar({ cartCount, onCartClick, onLoginClick }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const { setPage, currentPage } = useContext(RouterContext);

  const links = [
    { label: "Inicio", id: "home" }, 
    { label: "Trámites", id: "tramites" }, 
    { label: "Sucursales", id: "sucursales" }, 
    { label: "Ayuda", id: "ayuda" }
  ];

  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="bg-blue-800 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5"><Phone size={11} /> Mesa de ayuda: 600 370 2000</span>
            <span className="flex items-center gap-1.5"><Globe size={11} /> registrocivil.cl</span>
          </div>
          <span className="hidden sm:block">Servicio de Registro Civil e Identificación · Chile</span>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button onClick={() => setPage('home')} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-9 h-9 rounded-lg bg-blue-700 flex items-center justify-center"><span className="text-white text-xs font-bold leading-none">RC</span></div>
            <div className="hidden sm:block"><p className="text-slate-800 text-sm font-semibold leading-tight">Registro Civil</p></div>
          </button>
          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <button key={l.id} onClick={() => setPage(l.id)} className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${currentPage === l.id ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-blue-700 hover:bg-slate-50'}`}>
                {l.label}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={onLoginClick} className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-600 hover:text-blue-700 font-medium"><User size={15} /><span className="hidden lg:block">Iniciar sesión</span></button>
            
            <div className="relative">
              <button onClick={() => setNotifOpen(!notifOpen)} className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-600 hover:text-blue-700 relative">
                <Bell size={15} />
                <span className="absolute top-1.5 right-2 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>
              </button>
              {notifOpen && (
                <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden">
                  <div className="p-3 border-b border-slate-100 font-bold text-sm text-slate-800">Notificaciones</div>
                  <div className="p-3 text-sm flex items-start gap-3 bg-blue-50 border-l-4 border-blue-500">
                    <Package size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-slate-800">Tu Cédula está lista</p>
                      <p className="text-xs text-slate-600 mt-0.5">Ya puedes retirarla en Sucursal Providencia.</p>
                      <p className="text-[10px] text-blue-500 mt-1">Hace 2 horas</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button onClick={onCartClick} className="relative flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
              <ShoppingCart size={15} /> <span className="hidden sm:block">Mi carro</span>
              {cartCount > 0 && <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">{cartCount}</span>}
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-slate-600">{menuOpen ? <X size={20} /> : <Menu size={20} />}</button>
          </div>
        </div>
        {/* Menú móvil */}
        {menuOpen && (
          <div className="md:hidden py-3 border-t border-slate-100 flex flex-col gap-2">
            {links.map((l) => (
              <button key={l.id} onClick={() => { setPage(l.id); setMenuOpen(false); }} className={`px-4 py-2 text-left text-sm font-medium rounded-lg ${currentPage === l.id ? 'bg-blue-50 text-blue-700' : 'text-slate-600'}`}>{l.label}</button>
            ))}
            <button onClick={() => { onLoginClick(); setMenuOpen(false); }} className="px-4 py-2 text-left text-sm font-medium text-slate-600">Iniciar sesión</button>
          </div>
        )}
      </div>
    </header>
  );
}
