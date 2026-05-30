import React, { useState, useContext } from 'react';
import { RouterContext } from '../../context/AppContexts';
import { Search, MapPin, Building2, User, FileText, ChevronRight, FileDigit, CalendarClock, Globe, Car, Heart, Clock, Wifi, ArrowRight, Check, Download } from 'lucide-react';

export function HomePage({ onOpenModal }) {
  const { setPage, setGlobalSearch } = useContext(RouterContext);
  const [query, setQuery] = useState('');

  const [trackingFolio, setTrackingFolio] = useState('');
  const [isTrackingLoading, setIsTrackingLoading] = useState(false);
  const [trackingError, setTrackingError] = useState(null);
  
  // Datos iniciales cargados en pantalla
  const [activeTracking, setActiveTracking] = useState({
    title: 'Cédula de Identidad',
    folio: 'CI-2026-8891',
    status: 'En fabricación',
    statusBg: 'bg-amber-100 text-amber-700 border-amber-200/50',
    icon: <FileText size={18} />,
    currentStage: 2,
    stages: [
      { label: "Solicitud ingresada", desc: "Captura de datos biográficos y biométricos.", date: "09 May", active: true },
      { label: "Revisión de antecedentes", desc: "Validación de identidad aprobada.", date: "10 May", active: true },
      { label: "En fabricación", desc: "Tu documento se encuentra en proceso de impresión.", date: "En curso", active: true },
      { label: "Listo para retiro", desc: "Estará disponible en la sucursal seleccionada.", date: "-", active: false }
    ]
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setGlobalSearch(query);
      setPage('tramites');
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  const handleTrackingSearch = (e) => {
    e.preventDefault();
    if (!trackingFolio.trim()) {
      setTrackingError("Ingresa un número de folio.");
      return;
    }
    
    setTrackingError(null);
    setIsTrackingLoading(true);

    setTimeout(() => {
      const cleanFolio = trackingFolio.trim().toUpperCase();
      
      if (cleanFolio.includes('8891') || cleanFolio === 'CI-2026-8891') {
        setActiveTracking({
          title: 'Cédula de Identidad',
          folio: 'CI-2026-8891',
          status: 'En fabricación',
          statusBg: 'bg-amber-100 text-amber-700 border-amber-200/50',
          icon: <FileText size={18} />,
          currentStage: 2,
          stages: [
            { label: "Solicitud ingresada", desc: "Captura de datos biográficos y biométricos.", date: "09 May", active: true },
            { label: "Revisión de antecedentes", desc: "Validación de identidad aprobada.", date: "10 May", active: true },
            { label: "En fabricación", desc: "Tu documento se encuentra en proceso de impresión.", date: "En curso", active: true },
            { label: "Listo para retiro", desc: "Estará disponible en la sucursal seleccionada.", date: "-", active: false }
          ]
        });
      } else if (cleanFolio.includes('7722') || cleanFolio === 'PA-2026-7722') {
        setActiveTracking({
          title: 'Pasaporte Oficial',
          folio: 'PA-2026-7722',
          status: 'Listo para retiro',
          statusBg: 'bg-emerald-100 text-emerald-700 border-emerald-200/50',
          icon: <Globe size={18} />,
          currentStage: 3,
          stages: [
            { label: "Solicitud ingresada", desc: "Captura de huellas y fotografía digital.", date: "02 May", active: true },
            { label: "Revisión de antecedentes", desc: "Verificación de antecedentes de viaje aprobada.", date: "04 May", active: true },
            { label: "En fabricación", desc: "Pasaporte emitido con firma digital.", date: "08 May", active: true },
            { label: "Listo para retiro", desc: "Disponible en Oficina Principal Providencia.", date: "12 May", active: true, highlighted: true }
          ]
        });
      } else if (cleanFolio.includes('4400') || cleanFolio === 'VE-2026-4400') {
        setActiveTracking({
          title: 'Inscripción de Vehículo (Padrón)',
          folio: 'VE-2026-4400',
          status: 'Completado (Online)',
          statusBg: 'bg-blue-100 text-blue-700 border-blue-200/50',
          icon: <Car size={18} />,
          currentStage: 3,
          stages: [
            { label: "Ingreso de transferencia", desc: "Contrato firmado electrónicamente por las partes.", date: "15 May", active: true },
            { label: "Validación de firmas", desc: "Revisión del notario oficial aprobada.", date: "16 May", active: true },
            { label: "Inscripción en Registro", desc: "Anotación de dominio en el Registro de Vehículos.", date: "18 May", active: true },
            { label: "Listo para descarga", desc: "Documento oficial listo. Puedes descargarlo en línea.", date: "Disponible", active: true, highlighted: true, isDownloadable: true }
          ]
        });
      } else {
        const codeNum = cleanFolio.replace(/[^0-9]/g, '').slice(0, 4) || '5501';
        setActiveTracking({
          title: `Trámite General (${cleanFolio.split('-')[0] || 'Doc'})`,
          folio: cleanFolio.startsWith('FOL-') ? cleanFolio : `FOL-2026-${codeNum}`,
          status: 'En revisión técnica',
          statusBg: 'bg-blue-100 text-blue-700 border-blue-200/50',
          icon: <FileDigit size={18} />,
          currentStage: 1,
          stages: [
            { label: "Solicitud ingresada", desc: "Carga de antecedentes digitalizados al portal civil.", date: "Hace 3 días", active: true },
            { label: "Revisión técnica", desc: "Verificación de firmas, timbres y documentación adjunta.", date: "En curso", active: true },
            { label: "Firma electrónica", desc: "Documento en validación del Oficial Civil Adjunto.", date: "Pendiente", active: false },
            { label: "Listo para entrega", desc: "Se notificará vía correo para envío o descarga.", date: "-", active: false }
          ]
        });
      }
      setIsTrackingLoading(false);
    }, 1200);
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
            onClick={() => {
              setPage('tramites');
              window.scrollTo({ top: 0, behavior: 'instant' });
            }}
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
            <form onSubmit={handleTrackingSearch} className="space-y-2">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Folio (Ej: CI-2026-8891, PA-2026-7722, VE-2026-4400)" 
                  value={trackingFolio}
                  onChange={(e) => setTrackingFolio(e.target.value)}
                  className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm font-medium" 
                />
                <button type="submit" className="bg-slate-800 hover:bg-slate-900 text-white px-5 py-3 rounded-xl font-bold transition-all text-sm cursor-pointer whitespace-nowrap active:scale-[0.97]">
                  Consultar
                </button>
              </div>
              {trackingError && (
                <p className="text-[0.68rem] text-rose-600 font-bold pl-1 animate-pulse">{trackingError}</p>
              )}
            </form>

            <div className="mt-6 pt-5 border-t border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Trámite consultado</p>
                {activeTracking && !isTrackingLoading && (
                  <span className="text-[0.62rem] text-blue-500 font-bold bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
                    Resultados listos
                  </span>
                )}
              </div>
              
              {isTrackingLoading ? (
                <div className="py-12 flex flex-col items-center justify-center text-slate-500 animate-pulse bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                  <div className="w-9 h-9 rounded-full border-3 border-blue-100 border-t-blue-600 animate-spin mb-4" />
                  <p className="text-xs font-black text-slate-700 tracking-wide">Consultando Base de Datos Civil...</p>
                  <p className="text-[0.62rem] text-slate-400 font-semibold mt-1">Verificando registros biométricos de la República</p>
                </div>
              ) : activeTracking ? (
                <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] transition-all hover:shadow-[0_4px_16px_-4px_rgba(0,0,0,0.06)] animate-in fade-in zoom-in-98 duration-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                        {activeTracking.icon}
                      </div>
                      <div className="min-w-0">
                        <p className="font-extrabold text-slate-800 text-xs md:text-sm truncate">{activeTracking.title}</p>
                        <p className="text-[0.62rem] text-slate-400 font-bold mt-0.5">Folio: {activeTracking.folio}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[0.6rem] font-black border uppercase tracking-wider ${activeTracking.statusBg}`}>
                        {activeTracking.status}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100 pl-2">
                    <div className="space-y-4">
                      {activeTracking.stages.map((stage, idx) => {
                        const isCompleted = idx < activeTracking.currentStage;
                        const isActive = idx === activeTracking.currentStage;
                        const isPending = idx > activeTracking.currentStage;
                        return (
                          <div key={idx} className="flex gap-3.5 relative">
                            {idx < activeTracking.stages.length - 1 && (
                              <div className={`absolute top-6 left-2 w-[2px] h-[calc(100%+8px)] -ml-[1px] transition-colors duration-300 ${isCompleted ? 'bg-blue-600' : 'bg-slate-100'}`} />
                            )}
                            <div className={`
                              w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center relative z-10 ring-4 ring-white transition-all duration-300
                              ${isCompleted ? 'bg-blue-600 text-white' : isActive ? 'bg-amber-500 text-white animate-pulse' : 'bg-slate-200'}
                            `}>
                              {isCompleted ? (
                                <Check size={9} strokeWidth={4} />
                              ) : isActive ? (
                                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                              ) : null}
                            </div>
                            <div className="flex-1 -mt-1.5 text-left">
                              <p className={`text-[0.78rem] font-bold transition-colors duration-200 ${isActive ? 'text-amber-600' : isPending ? 'text-slate-400' : 'text-slate-800'}`}>
                                {stage.label}
                              </p>
                              <p className="text-[0.66rem] text-slate-500 mt-0.5 leading-relaxed font-medium">
                                {stage.desc}
                              </p>
                              {stage.isDownloadable && isActive && (
                                <button 
                                  onClick={() => {
                                    alert(`Descargando Padrón oficial de Inscripción de Vehículo.\nFolio: ${activeTracking.folio}`);
                                    const link = document.createElement('a');
                                    link.href = '#';
                                    link.setAttribute('download', `Padron_${activeTracking.folio}.pdf`);
                                    const blob = new Blob(["%PDF-1.4 ... Padrón de Vehículo Motorizado firmado digitalmente por el Registro Civil de Chile ..."], { type: 'application/pdf' });
                                    link.href = URL.createObjectURL(blob);
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                  }}
                                  className="mt-2.5 flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[0.62rem] font-extrabold shadow-sm active:scale-95 transition-all cursor-pointer w-fit"
                                >
                                  <Download size={11} /> Descargar Padrón (.pdf)
                                </button>
                              )}
                            </div>
                            <div className="text-right">
                              <p className={`text-[0.62rem] font-bold ${isActive ? 'text-amber-500 animate-pulse' : isPending ? 'text-slate-300 font-medium' : 'text-slate-400 font-semibold'}`}>
                                {stage.date}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : null}
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
