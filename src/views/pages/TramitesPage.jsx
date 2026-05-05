import React, { useState, useContext, useEffect } from 'react';
import { Search, ChevronRight, Globe, FileText, Car, Heart, Users, FileDigit, User, BookOpen, Clock, Wifi, ArrowRight, Plane } from 'lucide-react';
import { RouterContext } from '../../context/AppContexts';

export function TramitesPage({ onOpenModal }) {
  const { globalSearch, setGlobalSearch } = useContext(RouterContext);
  const [search, setSearch] = useState(globalSearch || '');

  // Keep local search sync'd with globalSearch if it changes from outside
  useEffect(() => {
    if (globalSearch) {
      setSearch(globalSearch);
      // Clear global search so if user comes back it's empty, or they can search again on this page.
      setGlobalSearch(''); 
    }
  }, [globalSearch, setGlobalSearch]);

  const categorias = [
    {
      title: "Identidad y Viaje",
      items: [
        { 
          title: 'Cédula de Identidad', 
          desc: 'Solicita o renueva tu cédula. La retiras en la sucursal de tu elección.', 
          icon: <Globe size={24} strokeWidth={1.5} />, 
          iconBg: "bg-violet-50", iconColor: "text-violet-600",
          time: "5-7 días hábiles", 
          modality: "Online + Sucursal", modalityIcon: null, modalityBg: "bg-purple-50", modalityColor: "text-purple-600"
        },
        { 
          title: 'Pasaporte', 
          desc: 'Obtén o renueva tu pasaporte para viajar al extranjero.', 
          icon: <Plane size={24} strokeWidth={1.5} />, 
          iconBg: "bg-indigo-50", iconColor: "text-indigo-600",
          time: "5-7 días hábiles", 
          modality: "Online + Sucursal", modalityIcon: null, modalityBg: "bg-purple-50", modalityColor: "text-purple-600"
        },
        { 
          title: 'Certificado de Nacimiento', 
          desc: 'Obtén tu certificado en minutos para trámites escolares, legales y más.', 
          icon: <FileText size={24} strokeWidth={1.5} />, 
          iconBg: "bg-blue-50", iconColor: "text-blue-600",
          tag: "Más solicitado", tagBg: "bg-amber-100/60", tagColor: "text-amber-700",
          time: "~5 min", 
          modality: "100% online", modalityIcon: <Wifi size={14} />, modalityBg: "bg-emerald-50", modalityColor: "text-emerald-600"
        }
      ]
    },
    {
      title: "Vehículos y Transporte",
      items: [
        { 
          title: 'Padrón Vehicular', 
          desc: 'Documento que identifica tu vehículo y acredita tu propiedad.', 
          icon: <Car size={24} strokeWidth={1.5} />, 
          iconBg: "bg-emerald-50", iconColor: "text-emerald-600",
          time: "~5 min", 
          modality: "100% online", modalityIcon: <Wifi size={14} />, modalityBg: "bg-emerald-50", modalityColor: "text-emerald-600"
        },
        { 
          title: 'Certificado de Anotaciones Vigentes', 
          desc: 'Revisa el historial de dueños y multas de un vehículo.', 
          icon: <FileDigit size={24} strokeWidth={1.5} />, 
          iconBg: "bg-teal-50", iconColor: "text-teal-600",
          time: "~5 min", 
          modality: "100% online", modalityIcon: <Wifi size={14} />, modalityBg: "bg-emerald-50", modalityColor: "text-emerald-600"
        },
        { 
          title: 'Hoja de Vida del Conductor', 
          desc: 'Revisa tu historial de infracciones y licencias de conducir.', 
          icon: <User size={24} strokeWidth={1.5} />, 
          iconBg: "bg-cyan-50", iconColor: "text-cyan-600",
          time: "~5 min", 
          modality: "100% online", modalityIcon: <Wifi size={14} />, modalityBg: "bg-emerald-50", modalityColor: "text-emerald-600"
        }
      ]
    },
    {
      title: "Familia y Pareja",
      items: [
        { 
          title: 'Certificado de Matrimonio', 
          desc: 'Descarga tu certificado al instante con validez legal.', 
          icon: <Heart size={24} strokeWidth={1.5} />, 
          iconBg: "bg-rose-50", iconColor: "text-rose-600",
          tag: "Nuevo", tagBg: "bg-amber-100/60", tagColor: "text-amber-700",
          time: "~3 min", 
          modality: "100% online", modalityIcon: <Wifi size={14} />, modalityBg: "bg-emerald-50", modalityColor: "text-emerald-600"
        },
        { 
          title: 'Acuerdo de Unión Civil', 
          desc: 'Certificado que acredita la celebración del AUC.', 
          icon: <Users size={24} strokeWidth={1.5} />, 
          iconBg: "bg-pink-50", iconColor: "text-pink-600",
          time: "~3 min", 
          modality: "100% online", modalityIcon: <Wifi size={14} />, modalityBg: "bg-emerald-50", modalityColor: "text-emerald-600"
        },
        { 
          title: 'Inscripción de Defunción', 
          desc: 'Registra y obtén el certificado de defunción.', 
          icon: <FileText size={24} strokeWidth={1.5} />, 
          iconBg: "bg-slate-100", iconColor: "text-slate-600",
          time: "~15 min", 
          modality: "100% online", modalityIcon: <Wifi size={14} />, modalityBg: "bg-emerald-50", modalityColor: "text-emerald-600"
        }
      ]
    },
    {
      title: "Profesionales",
      items: [
        { 
          title: 'Certificado de Profesionales', 
          desc: 'Acredita tu título profesional inscrito en el registro.', 
          icon: <BookOpen size={24} strokeWidth={1.5} />, 
          iconBg: "bg-amber-50", iconColor: "text-amber-600",
          time: "~5 min", 
          modality: "100% online", modalityIcon: <Wifi size={14} />, modalityBg: "bg-emerald-50", modalityColor: "text-emerald-600"
        },
        { 
          title: 'Antecedentes para fines especiales', 
          desc: 'Certificado requerido para empleos y otros trámites.', 
          icon: <FileText size={24} strokeWidth={1.5} />, 
          iconBg: "bg-violet-50", iconColor: "text-violet-600",
          tag: "Requiere ClaveÚnica", tagBg: "bg-blue-100/60", tagColor: "text-blue-700",
          time: "~5 min", 
          modality: "100% online", modalityIcon: <Wifi size={14} />, modalityBg: "bg-emerald-50", modalityColor: "text-emerald-600"
        }
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in duration-300">
      <div className="max-w-3xl mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4 tracking-tight">Catálogo de Trámites</h1>
        <p className="text-lg text-slate-500 mb-8">Encuentra todos los certificados y servicios disponibles.</p>
        <div className="relative group">
          <Search className="absolute left-4 top-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={22} />
          <input 
            type="text" 
            placeholder="Buscar por nombre, categoría o palabra clave..." 
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 shadow-sm transition-all text-base text-slate-700 placeholder-slate-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      
      <div className="space-y-12">
        {categorias.map(cat => {
          const filteredItems = cat.items.filter(item => item.title.toLowerCase().includes(search.toLowerCase()) || item.desc.toLowerCase().includes(search.toLowerCase()));
          
          if (filteredItems.length === 0) return null;

          return (
            <div key={cat.title}>
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                {cat.title}
                <span className="bg-slate-100 text-slate-500 text-sm py-0.5 px-2.5 rounded-full font-medium">{filteredItems.length}</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredItems.map((s) => (
                  <button key={s.title} onClick={() => onOpenModal(s.title)} className="bg-white p-7 rounded-[24px] border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_20px_-6px_rgba(0,0,0,0.08)] hover:border-blue-100 transition-all text-left group flex flex-col relative h-full">
                    {s.tag && (
                      <span className={`absolute top-6 right-6 px-3 py-1 rounded-full text-[0.6875rem] font-bold ${s.tagBg} ${s.tagColor}`}>
                        {s.tag}
                      </span>
                    )}
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${s.iconBg} ${s.iconColor} group-hover:scale-105 transition-transform mb-6`}>
                      {s.icon}
                    </div>
                    <h3 className="font-semibold text-slate-800 text-lg mb-2 group-hover:text-blue-600 transition-colors pr-16">{s.title}</h3>
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
          );
        })}
      </div>
    </div>
  );
}
