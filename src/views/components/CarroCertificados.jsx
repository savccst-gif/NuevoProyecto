import React, { useState, useContext, useEffect } from 'react';
import { ShoppingCart, FileText, X, CreditCard, Download, Calendar, CheckCircle } from 'lucide-react';
import { CartContext } from '../../context/AppContexts';

export function CarroCertificados() {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cartItems, 
    updateQty, 
    totalItems,
    confirmedItems,
    confirmCart
  } = useContext(CartContext);

  const [activeTab, setActiveTab] = useState('pendientes');

  // Si se agrega un nuevo trámite al carro, cambiamos automáticamente a la pestaña de pendientes
  useEffect(() => {
    if (cartItems.length > 0) {
      setActiveTab('pendientes');
    }
  }, [cartItems.length]);

  // Si no está abierto el carro, no renderizamos nada (evitando duplicar botones)
  if (!isCartOpen) return null;

  const handleDownloadFile = (fileName) => {
    // Simulación de descarga de archivo oficial PDF
    const link = document.createElement('a');
    link.href = '#';
    link.setAttribute('download', `${fileName.replace(/\s+/g, '_')}_oficial.pdf`);
    
    // Crear un blob de prueba simulando el PDF oficial firmado digitalmente
    const blob = new Blob(["%PDF-1.4 ... Contenido oficial firmado digitalmente por el Servicio de Registro Civil e Identificación de Chile ..."], { type: 'application/pdf' });
    const objectUrl = URL.createObjectURL(blob);
    link.href = objectUrl;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(objectUrl);
  };

  const handleDownloadAll = () => {
    const certs = confirmedItems.filter(item => item.type !== 'Visita Agendada');
    if (certs.length === 0) {
      alert("No hay certificados disponibles para descargar en esta sesión.");
      return;
    }
    
    // Descarga uno por uno todos los certificados
    certs.forEach((c, index) => {
      setTimeout(() => {
        handleDownloadFile(c.name);
      }, index * 300);
    });
    
    alert(`Descargando ${certs.length} certificado(s) solicitado(s) en formato PDF oficial.`);
  };

  return (
    <div className="fixed top-20 right-4 md:right-8 z-50 w-85 max-w-[calc(100vw-2rem)] bg-white/95 backdrop-blur-xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-250 flex flex-col max-h-[500px]">
      
      {/* Header del Panel */}
      <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
            <ShoppingCart size={15} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-[0.875rem] leading-none">Mi Carro de Trámites</h3>
            <p className="text-[0.68rem] text-slate-500 font-semibold mt-1">Gestión de sesión civil</p>
          </div>
        </div>
        <button 
          onClick={() => setIsCartOpen(false)} 
          className="p-1.5 hover:bg-slate-200 active:scale-95 rounded-lg text-slate-400 hover:text-slate-700 transition-all cursor-pointer"
        >
          <X size={15} />
        </button>
      </div>

      {/* Tabs de Control */}
      <div className="flex border-b border-slate-100 bg-slate-50/50 p-1 gap-1">
        <button
          onClick={() => setActiveTab('pendientes')}
          className={`
            flex-1 py-2 text-[0.78rem] font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5
            ${activeTab === 'pendientes' 
              ? 'bg-white text-blue-600 shadow-sm border border-slate-200/50' 
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/40'}
          `}
        >
          <span>Pendientes</span>
          {cartItems.length > 0 && (
            <span className="bg-blue-600 text-white text-[0.68rem] font-extrabold px-1.5 py-0.5 rounded-full">
              {cartItems.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('descargas')}
          className={`
            flex-1 py-2 text-[0.78rem] font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5
            ${activeTab === 'descargas' 
              ? 'bg-white text-emerald-600 shadow-sm border border-slate-200/50' 
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/40'}
          `}
        >
          <span>Descargas / Citas</span>
          {confirmedItems.length > 0 && (
            <span className="bg-emerald-600 text-white text-[0.68rem] font-extrabold px-1.5 py-0.5 rounded-full">
              {confirmedItems.length}
            </span>
          )}
        </button>
      </div>

      {/* Contenido de la pestaña */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
        {activeTab === 'pendientes' ? (
          cartItems.length === 0 ? (
            <div className="py-12 text-center flex flex-col items-center justify-center text-slate-400">
              <ShoppingCart size={32} className="opacity-20 mb-2" />
              <p className="text-[0.82rem] font-medium">No tienes solicitudes pendientes</p>
              <p className="text-[0.68rem] text-slate-500 max-w-[200px] mt-1 mx-auto leading-relaxed">Solicita un certificado o trámite en la pestaña 'Trámites' para agregarlo aquí.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-100/80 border border-slate-100 rounded-2xl transition-all animate-in fade-in slide-in-from-bottom-1 duration-150">
                  <div className={`w-9 h-9 rounded-xl ${item.iconBg} ${item.iconColor} flex items-center justify-center flex-shrink-0 font-bold`}>
                    {item.icon || <FileText size={16} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-700 truncate text-[0.78rem] font-bold">{item.name}</p>
                    <p className="text-slate-400 text-[0.68rem] font-semibold mt-0.5">{item.type || 'Gratuito'} · Gratis</p>
                  </div>
                  <button 
                    onClick={() => updateQty(item.id, -item.qty)} 
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                    title="Eliminar solicitud"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )
        ) : (
          confirmedItems.length === 0 ? (
            <div className="py-12 text-center flex flex-col items-center justify-center text-slate-400">
              <CheckCircle size={32} className="opacity-20 mb-2" />
              <p className="text-[0.82rem] font-medium">Aún no hay descargas listas</p>
              <p className="text-[0.68rem] text-slate-500 max-w-[200px] mt-1 mx-auto leading-relaxed">Confirma tus solicitudes pendientes en la otra pestaña para habilitar su descarga aquí.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {/* Botón premium de Descargar Todo si hay certificados */}
              {confirmedItems.filter(item => item.type !== 'Visita Agendada').length > 0 && (
                <button 
                  onClick={handleDownloadAll}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-[0.78rem] font-extrabold transition-all border border-emerald-200/50 cursor-pointer"
                >
                  <Download size={14} /> Descargar Todos los Certificados
                </button>
              )}
              
              <div className="space-y-2">
                {confirmedItems.map((item) => {
                  const isAppointment = item.type === 'Visita Agendada';
                  return (
                    <div key={item.id} className="flex items-center gap-3 p-3 bg-slate-50/60 border border-slate-100 rounded-2xl animate-in fade-in slide-in-from-bottom-1 duration-150">
                      <div className={`w-9 h-9 rounded-xl ${item.iconBg} ${item.iconColor} flex items-center justify-center flex-shrink-0`}>
                        {isAppointment ? <Calendar size={16} /> : <CheckCircle size={16} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-slate-700 truncate text-[0.78rem] font-bold">{item.name}</p>
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[0.6rem] font-extrabold mt-1 ${isAppointment ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                          {item.type}
                        </span>
                      </div>
                      
                      {isAppointment ? (
                        <button 
                          onClick={() => alert(`Comprobante de Cita oficial:\n${item.name}\nCódigo de atención: AG-${item.id.toUpperCase()}`)}
                          className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-[0.68rem] font-extrabold transition-all cursor-pointer flex items-center gap-1"
                        >
                          Comprobante
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleDownloadFile(item.name)}
                          className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all cursor-pointer"
                          title="Descargar PDF oficial"
                        >
                          <Download size={13} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )
        )}
      </div>

      {/* Footer del Panel (Solo para solicitudes pendientes) */}
      {activeTab === 'pendientes' && cartItems.length > 0 && (
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <button 
            onClick={confirmCart} 
            className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all text-white rounded-2xl text-sm font-bold shadow-md hover:shadow-lg cursor-pointer"
          >
            <CreditCard size={15} /> Confirmar Solicitudes
          </button>
        </div>
      )}

    </div>
  );
}
