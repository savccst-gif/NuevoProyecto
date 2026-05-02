import React from 'react';
import { Search, MapPin, Building2, X, Clock, Loader2 } from 'lucide-react';
import { useSucursales } from '../../controllers/useSucursales';

export function SucursalesPage() {
  const {
    selectedSucursal, setSelectedSucursal, searchQuery, setSearchQuery,
    results, loading, hasSearched, handleSearch, clearSearch
  } = useSucursales();

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in duration-300">
      <h1 className="text-3xl font-bold text-slate-800 mb-2">Encuentra tu Sucursal</h1>
      <p className="text-slate-500 mb-8">Búsqueda en tiempo real de sucursales en todo Chile (conectado a API GPS).</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4">
          <div className={`bg-white rounded-2xl p-2 shadow-sm border flex items-center transition-all ${searchQuery ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-200'}`}>
            <Search size={18} className="text-slate-400 mx-3 flex-shrink-0" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ej: Arica, Santiago, Temuco..." 
              className="w-full bg-transparent outline-none py-2 text-sm text-slate-700 font-medium" 
            />
            {searchQuery && (
              <button onClick={clearSearch} className="p-2 text-slate-400 hover:text-slate-600"><X size={15} /></button>
            )}
            <button onClick={handleSearch} className="ml-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors shadow-sm">Buscar</button>
          </div>
          
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {!hasSearched ? (
              <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                <Building2 size={32} className="mx-auto text-slate-300 mb-3" />
                <p className="text-sm font-medium text-slate-500">Usa el buscador de arriba</p>
                <p className="text-xs text-slate-400 mt-1">Buscaremos oficinas reales en todo Chile.</p>
              </div>
            ) : loading ? (
              <div className="text-center py-10 bg-blue-50 rounded-2xl border border-blue-100 border-dashed flex flex-col items-center">
                <Loader2 size={24} className="text-blue-500 animate-spin mb-3" />
                <p className="text-sm font-medium text-blue-700">Buscando sucursales reales...</p>
              </div>
            ) : results.length > 0 ? (
              results.map((suc, idx) => (
                <div key={idx} onClick={() => setSelectedSucursal(suc)} className={`bg-white p-5 rounded-2xl border shadow-sm cursor-pointer transition-colors ${selectedSucursal?.lat === suc.lat && selectedSucursal?.lon === suc.lon ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/30' : 'border-slate-100 hover:border-blue-300'}`}>
                  <h3 className="font-bold text-slate-800 text-sm mb-1">{suc.nombre}</h3>
                  <p className="text-xs text-slate-500 flex items-start gap-1.5 mb-2 line-clamp-2" title={suc.direccion}><MapPin size={12} className="flex-shrink-0 mt-0.5"/> {suc.direccion}</p>
                  <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1.5"><Clock size={12} className="flex-shrink-0"/> {suc.horario}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-8 bg-rose-50 rounded-2xl border border-rose-100 border-dashed">
                <p className="text-sm font-medium text-rose-600">No se encontraron resultados</p>
                <p className="text-xs text-rose-500 mt-1">Asegúrate de escribir bien el nombre de la ciudad.</p>
              </div>
            )}
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className="bg-slate-200 w-full h-[500px] rounded-3xl overflow-hidden relative flex items-center justify-center">
            {selectedSucursal ? (
              <iframe 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                loading="lazy" 
                allowFullScreen 
                src={`https://maps.google.com/maps?q=${selectedSucursal.lat},${selectedSucursal.lon}&t=&z=16&ie=UTF8&iwloc=&output=embed`}>
              </iframe>
            ) : (
              <>
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#0066FF 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                <div className="bg-white px-6 py-4 rounded-xl shadow-xl z-10 flex flex-col items-center">
                  <MapPin size={32} className="text-blue-600 mb-2" />
                  <p className="font-bold text-slate-800">Mapa de Sucursales</p>
                  <p className="text-xs text-slate-500">Busca y selecciona una sucursal para verla aquí.</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
