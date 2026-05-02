import React, { useState } from 'react';
import { Search, ChevronRight } from 'lucide-react';

export function TramitesPage({ onOpenModal }) {
  const [search, setSearch] = useState('');

  const categorias = [
    { title: "Identidad y Viaje", items: ["Cédula de Identidad", "Pasaporte", "Certificado de Nacimiento"] },
    { title: "Vehículos y Transporte", items: ["Padrón Vehicular", "Certificado de Anotaciones Vigentes", "Hoja de Vida del Conductor"] },
    { title: "Familia y Pareja", items: ["Certificado de Matrimonio", "Acuerdo de Unión Civil", "Inscripción de Defunción"] },
    { title: "Profesionales", items: ["Certificado de Profesionales", "Antecedentes para fines especiales"] }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in duration-300">
      <div className="max-w-3xl mb-10">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Catálogo de Trámites</h1>
        <p className="text-slate-500 mb-8">Encuentra todos los certificados y servicios disponibles.</p>
        <div className="relative">
          <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Buscar trámite..." 
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {categorias.map(cat => (
          <div key={cat.title} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-4">{cat.title}</h2>
            <div className="space-y-1">
              {cat.items.filter(item => item.toLowerCase().includes(search.toLowerCase())).map(item => (
                <button key={item} onClick={() => onOpenModal(item)} className="w-full text-left p-3 rounded-xl hover:bg-blue-50 border border-transparent hover:border-blue-100 text-sm font-medium text-slate-700 transition-colors flex items-center justify-between group">
                  {item} <ChevronRight size={14} className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
