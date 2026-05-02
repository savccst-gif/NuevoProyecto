import React, { useState, useContext } from 'react';
import { X } from 'lucide-react';
import { CartContext } from '../../context/AppContexts';

export function ModalFormulario({ type, onClose }) {
  const { addToCart } = useContext(CartContext);
  const isFolio = type === 'folio';
  const isCedula = type === 'Cédula de Identidad' || type === 'Renovar cédula' || type === 'Cédula';
  const title = isFolio ? "Agregar Trámite al Seguimiento" : isCedula ? "Cédula de Identidad" : `Solicitar ${type}`;
  const [cedulaOption, setCedulaOption] = useState('agendar');

  const handleSubmit = () => {
    if (!isFolio && !(isCedula && cedulaOption === 'agendar')) {
      addToCart({
        id: Math.random().toString(36).substr(2, 9),
        name: type,
        type: isCedula ? "Reimpresión" : "Certificado",
        price: 0,
        iconBg: "bg-blue-50",
        iconColor: "text-blue-600"
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h3 className="font-bold text-slate-800">{title}</h3>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-4">
          {isFolio ? (
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Folio o Número de Solicitud</label>
              <input type="text" placeholder="Ej: CI-2026-..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all font-medium text-slate-700" />
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">Puedes encontrar este número en el comprobante impreso que te entregaron en sucursal o en el correo de confirmación.</p>
            </div>
          ) : isCedula ? (
            <div className="space-y-4">
              <p className="text-sm text-slate-600 mb-2">Selecciona qué trámite deseas realizar con tu cédula:</p>
              
              <button onClick={() => setCedulaOption('agendar')} className={`w-full flex items-start gap-3 p-4 rounded-xl border-2 transition-all text-left ${cedulaOption === 'agendar' ? 'border-blue-600 bg-blue-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${cedulaOption === 'agendar' ? 'border-blue-600' : 'border-slate-300'}`}>
                  {cedulaOption === 'agendar' && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">Renovar o Agendar Hora</p>
                  <p className="text-xs text-slate-500 mt-1">Trámite presencial en sucursal. Agenda aquí tu visita.</p>
                </div>
              </button>

              <button onClick={() => setCedulaOption('reimpresion')} className={`w-full flex items-start gap-3 p-4 rounded-xl border-2 transition-all text-left ${cedulaOption === 'reimpresion' ? 'border-blue-600 bg-blue-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${cedulaOption === 'reimpresion' ? 'border-blue-600' : 'border-slate-300'}`}>
                  {cedulaOption === 'reimpresion' && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">Reimpresión (100% Online)</p>
                  <p className="text-xs text-slate-500 mt-1">Si perdiste tu carnet vigente, pide una copia en línea.</p>
                </div>
              </button>
              
              {cedulaOption === 'agendar' && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                   <label className="block text-sm font-bold text-slate-700 mb-1.5">Región y Comuna</label>
                   <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all font-medium text-slate-700 text-sm">
                     <option>Arica y Parinacota - Arica</option>
                     <option>Arica y Parinacota - Putre</option>
                     <option>Región Metropolitana - Santiago Centro</option>
                     <option>Región Metropolitana - Providencia</option>
                     <option>Región Metropolitana - Maipú</option>
                   </select>
                </div>
              )}
              {cedulaOption === 'reimpresion' && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">RUT</label>
                  <input type="text" placeholder="12.345.678-9" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all font-medium text-slate-700" />
                </div>
              )}
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">RUT</label>
                <input type="text" placeholder="12.345.678-9" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all font-medium text-slate-700" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Número de Documento (Serie)</label>
                <input type="text" placeholder="A123456789" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all font-medium text-slate-700" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Correo Electrónico</label>
                <input type="email" placeholder="correo@ejemplo.com" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all font-medium text-slate-700" />
              </div>
            </>
          )}
        </div>
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">Cancelar</button>
          <button onClick={handleSubmit} className="px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg rounded-xl transition-all">{isFolio ? 'Agregar Folio' : isCedula && cedulaOption === 'agendar' ? 'Buscar Disponibilidad' : 'Confirmar'}</button>
        </div>
      </div>
    </div>
  );
}
