import React, { useState, useContext } from 'react';
import { RouterContext } from '../../context/AppContexts';
import { Search, MapPin, Building2, User, FileText, ChevronRight, FileDigit, CalendarClock, Globe, Car, Heart, Clock, Wifi, ArrowRight, Check } from 'lucide-react';

export function HomePage({ onOpenModal }) {
  const { setPage, setGlobalSearch } = useContext(RouterContext);
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setGlobalSearch(query);
      setPage('tramites');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in duration-300">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6 tracking-tight">
          Trámites rápidos, <br /><span className="text-blue-600">sin filas.</span>
        </h1>
        <p className="text-lg text-slate-500 mb-8 max-w-2xl mx-auto">
          Obtén tus certificados, renueva tu cédula o revisa el estado de tus solicitudes desde la comodidad de tu hogar.
        </p>
        <form onSubmit={handleSearch} className="relative max-w-xl mx-auto group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm transition-all text-base"
            placeholder="¿Qué trámite necesitas realizar hoy?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="absolute inset-y-2 right-2 bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-xl font-medium transition-colors">
            Buscar
          </button>
        </form>
      </div>

      <div className="mb-14">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-blue-600 font-bold text-xs tracking-widest uppercase mb-2">Lo más usado</p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Trámites frecuentes</h2>
          </div>
          <button
            onClick={() => setPage('tramites')}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 transition-colors"
          >
            Ver todos <ChevronRight size={16} />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            {
              title: 'Certificado de Nacimiento',
              desc: 'Obtén tu certificado en minutos para trámites escolares, legales y más.',
              icon: <FileText size={24} strokeWidth={1.5} />,
              iconBg: "bg-blue-50", iconColor: "text-blue-600",
              tag: "Más solicitado", tagBg: "bg-amber-100/60", tagColor: "text-amber-700",
              time: "~5 min",
              modality: "100% online", modalityIcon: <Wifi size={14} />, modalityBg: "bg-emerald-50", modalityColor: "text-emerald-600"
            },
            {
              title: 'Cédula de Identidad',
              desc: 'Solicita o renueva tu cédula. La retiras en la sucursal de tu elección.',
              icon: <Globe size={24} strokeWidth={1.5} />,
              iconBg: "bg-violet-50", iconColor: "text-violet-600",
              time: "5-7 días hábiles",
              modality: "Online + Sucursal", modalityBg: "bg-purple-50", modalityColor: "text-purple-600"
            },
            {
              title: 'Trámites de Vehículos',
              desc: 'Transferencias, inscripciones y certificados del Registro de Vehículos Motorizados.',
              icon: <Car size={24} strokeWidth={1.5} />,
              iconBg: "bg-emerald-50", iconColor: "text-emerald-600",
              time: "~10 min",
              modality: "100% online", modalityIcon: <Wifi size={14} />, modalityBg: "bg-emerald-50", modalityColor: "text-emerald-600"
            },
            {
              title: 'Certificado de Matrimonio',
              desc: 'Descarga tu certificado al instante con validez legal.',
              icon: <Heart size={24} strokeWidth={1.5} />,
              iconBg: "bg-rose-50", iconColor: "text-rose-600",
              tag: "Nuevo", tagBg: "bg-amber-100/60", tagColor: "text-amber-700",
              time: "~3 min",
              modality: "100% online", modalityIcon: <Wifi size={14} />, modalityBg: "bg-emerald-50", modalityColor: "text-emerald-600"
            },
          ].map((s) => (
            <button key={s.title} onClick={() => onOpenModal(s.title)} className="bg-white p-7 rounded-[24px] border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_20px_-6px_rgba(0,0,0,0.08)] hover:border-blue-100 transition-all text-left group flex flex-col relative h-full">
              {s.tag && (
                <span className={`absolute top-6 right-6 px-3 py-1 rounded-full text-[0.6875rem] font-bold ${s.tagBg} ${s.tagColor}`}>
                  {s.tag}
                </span>
              )}
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${s.iconBg} ${s.iconColor} group-hover:scale-105 transition-transform mb-6`}>
                {s.icon}
              </div>
              <h3 className="font-semibold text-slate-800 text-lg mb-2 group-hover:text-blue-600 transition-colors">{s.title}</h3>
              <p className="text-[0.9375rem] text-slate-500 mb-8 leading-relaxed flex-1">{s.desc}</p>

              <div className="flex items-center justify-between w-full mt-auto">
                <div className="flex items-center gap-2 text-[0.8125rem] text-slate-400 font-medium">
                  <Clock size={16} />
                  <span>{s.time}</span>
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${s.modalityBg} ${s.modalityColor} transition-colors relative overflow-hidden`}>
                  {s.modalityIcon}
                  <span>{s.modality}</span>
                  {s.modality === '100% online' && (
                    <ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 group-hover:text-blue-600 transition-all duration-300 absolute -right-6 group-hover:relative group-hover:right-0" />
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5"><FileDigit size={120} /></div>
          <div className="relative z-10">
            <h2 className="text-xl font-bold text-slate-800 mb-2">Seguimiento de Trámites</h2>
            <p className="text-slate-500 text-sm mb-6 max-w-sm">Revisa en qué etapa se encuentra tu solicitud de Cédula o Pasaporte usando tu número de folio.</p>
            <div className="flex gap-2">
              <input type="text" placeholder="Número de folio (Ej: 123456789)" className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm" />
              <button onClick={() => onOpenModal('folio')} className="bg-slate-800 hover:bg-slate-900 text-white px-5 py-3 rounded-xl font-medium transition-colors text-sm whitespace-nowrap">Consultar</button>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Trámites en curso</p>
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600"><FileDigit size={18} /></div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">Cédula de Identidad</p>
                        <p className="text-xs text-slate-500 font-medium">Folio: CI-2026-8891</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[0.625rem] font-bold bg-amber-100 text-amber-700 border border-amber-200/50">En fabricación</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100 pl-2">
                    <div className="space-y-4">
                      <div className="flex gap-3 relative">
                        <div className="absolute top-6 left-2 w-[2px] h-[calc(100%+8px)] -ml-[1px] bg-blue-600"></div>
                        <div className="w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center bg-blue-600 text-white relative z-10 ring-4 ring-white">
                          <Check size={10} strokeWidth={3} />
                        </div>
                        <div className="flex-1 -mt-1">
                          <p className="text-[0.8125rem] font-bold text-slate-800">Solicitud ingresada</p>
                          <p className="text-[0.6875rem] text-slate-500 mt-0.5">Captura de datos biográficos y biométricos.</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[0.6875rem] font-semibold text-slate-500">09 May</p>
                        </div>
                      </div>

                      <div className="flex gap-3 relative">
                        <div className="absolute top-6 left-2 w-[2px] h-[calc(100%+8px)] -ml-[1px] bg-slate-100"></div>
                        <div className="w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center bg-blue-600 text-white relative z-10 ring-4 ring-white">
                          <Check size={10} strokeWidth={3} />
                        </div>
                        <div className="flex-1 -mt-1">
                          <p className="text-[0.8125rem] font-bold text-slate-800">Revisión de antecedentes</p>
                          <p className="text-[0.6875rem] text-slate-500 mt-0.5">Validación de identidad aprobada.</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[0.6875rem] font-semibold text-slate-500">10 May</p>
                        </div>
                      </div>

                      <div className="flex gap-3 relative">
                        <div className="absolute top-6 left-2 w-[2px] h-[calc(100%+8px)] -ml-[1px] bg-slate-100"></div>
                        <div className="w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center bg-amber-500 relative z-10 ring-4 ring-white">
                          <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                        </div>
                        <div className="flex-1 -mt-1">
                          <p className="text-[0.8125rem] font-bold text-amber-600">En fabricación</p>
                          <p className="text-[0.6875rem] text-slate-500 mt-0.5">Tu documento se encuentra en proceso de impresión.</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[0.6875rem] font-semibold text-amber-500">En curso</p>
                        </div>
                      </div>

                      <div className="flex gap-3 relative">
                        <div className="w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center bg-slate-200 relative z-10 ring-4 ring-white">
                        </div>
                        <div className="flex-1 -mt-1">
                          <p className="text-[0.8125rem] font-bold text-slate-400">Listo para retiro</p>
                          <p className="text-[0.6875rem] text-slate-400 mt-0.5">Estará disponible en la sucursal seleccionada.</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[0.6875rem] font-semibold text-slate-300">-</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-600 p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden flex flex-col justify-center text-white">
          <div className="absolute top-0 right-0 p-8 opacity-10"><CalendarClock size={160} /></div>
          <div className="relative z-10 max-w-sm">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-500/50 border border-blue-400/30 mb-4">Nuevo</span>
            <h2 className="text-2xl font-bold mb-3">Agenda tu hora 100% online</h2>
            <p className="text-blue-100 text-sm mb-8 leading-relaxed">Ya no necesitas hacer fila desde temprano. Revisa las sucursales con disponibilidad y elige el horario que mejor te acomode.</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => onOpenModal('Cédula')} className="px-6 py-3 bg-white text-blue-600 hover:bg-blue-50 rounded-xl font-bold transition-colors text-sm text-center">Agendar visita</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
