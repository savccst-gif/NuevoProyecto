import React, { useState } from 'react';
import { HelpCircle, ChevronRight, Phone, Mail } from 'lucide-react';

export function AyudaPage() {
  const faqs = [
    { q: "¿Cómo recupero mi ClaveÚnica?", a: "Puedes recuperarla en línea con tu correo electrónico o presencialmente en cualquier sucursal." },
    { q: "¿Cuánto demora en estar lista la cédula?", a: "El plazo legal es de 8 días hábiles, pero usualmente está lista en 5." },
    { q: "¿Qué hago si pierdo mi carnet en el extranjero?", a: "Debes acercarte al consulado chileno más cercano para solicitar un salvoconducto." }
  ];
  
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in duration-300">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <HelpCircle size={32} />
        </div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Centro de Ayuda</h1>
        <p className="text-slate-500">Estamos aquí para resolver tus dudas y guiarte en tus trámites.</p>
      </div>

      <div className="max-w-3xl mx-auto mb-12">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Preguntas Frecuentes</h2>
        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all">
              <button onClick={() => setOpenFaq(openFaq === idx ? null : idx)} className="w-full text-left p-5 font-bold text-slate-700 flex justify-between items-center hover:bg-slate-50">
                {faq.q}
                <ChevronRight size={18} className={`text-slate-400 transition-transform ${openFaq === idx ? 'rotate-90' : ''}`} />
              </button>
              {openFaq === idx && (
                <div className="p-5 pt-0 text-slate-600 text-sm leading-relaxed border-t border-slate-100 bg-slate-50">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><Phone size={24} /></div>
          <div>
            <h3 className="font-bold text-slate-800">Llámanos</h3>
            <p className="text-sm text-slate-500 mb-2">Lunes a Viernes 08:30 a 18:00</p>
            <p className="font-bold text-blue-600">600 370 2000</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-violet-50 text-violet-600 rounded-xl"><Mail size={24} /></div>
          <div>
            <h3 className="font-bold text-slate-800">Escríbenos</h3>
            <p className="text-sm text-slate-500 mb-2">Respondemos en 24 hrs hábiles</p>
            <p className="font-bold text-blue-600">contacto@registrocivil.cl</p>
          </div>
        </div>
      </div>
    </div>
  );
}
