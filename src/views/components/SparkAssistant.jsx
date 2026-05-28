import React, { useState, useContext, useEffect, useRef } from 'react';
import { useAccessibility, CartContext, RouterContext } from '../../context/AppContexts';
import { MessageSquare, Accessibility, ShoppingBag, X, Send, Volume2, VolumeX, Sparkles, Calendar, Search } from 'lucide-react';

const PREDEFINED_QS = [
  { q: "¿Cómo obtengo mi certificado de nacimiento?", a: "¡Es muy fácil! Puedes descargarlo de inmediato de forma 100% online y gratuita desde la pestaña 'Trámites'. Simplemente agrégalo a tu carro haciendo clic en su tarjeta." },
  { q: "¿Qué es la ClaveÚnica?", a: "La ClaveÚnica es tu llave digital de seguridad para realizar más de mil trámites del Estado. Puedes solicitarla online mediante videollamada o presencialmente en nuestras oficinas." },
  { q: "¿Dónde retiro mi cédula de identidad?", a: "Debes retirarla en la misma oficina donde realizaste el trámite. Puedes ver la dirección y horarios de nuestras sucursales en la pestaña de 'Sucursales' arriba." },
  { q: "¿Cómo funciona el carro de certificados?", a: "Agrega todos los certificados gratuitos que necesites. Luego presiona el botón 'Mi carro' arriba a la derecha para descargarlos de inmediato en formato PDF oficial." }
];

export default function SparkAssistant({ onOpenModal, onOpenLogin }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    { sender: 'spark', text: '¡Hola! Soy Spark, tu facilitador digital. ✨ ¿En qué puedo ayudarte a navegar hoy?' }
  ]);
  const [customInput, setCustomInput] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(false);
  
  const { readingMode, toggleReadingMode, highContrast, toggleHighContrast } = useAccessibility();
  const { totalItems, addToCart } = useContext(CartContext);
  const { setPage } = useContext(RouterContext);
  
  const chatEndRef = useRef(null);

  // Auto-scroll chat history
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, isProcessing]);

  // Speech helper
  const speakText = (text) => {
    if (!soundEnabled) return;
    const synth = window.speechSynthesis;
    if (synth.speaking) synth.cancel();
    
    // Remove emojis for cleaner speech
    const cleanText = text.replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, "");
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'es-CL';
    utterance.rate = 1.05;
    synth.speak(utterance);
  };

  const handleSparkInteraction = () => {
    if (!isOpen) {
      setIsOpen(true);
      speakText("¡Hola! Soy Spark, tu facilitador digital. ¿En qué te ayudo hoy?");
    } else {
      setIsOpen(false);
    }
  };

  const handleQuickQuestion = (q, a) => {
    setIsProcessing(true);
    setChatHistory(prev => [...prev, { sender: 'user', text: q }]);
    
    setTimeout(() => {
      setIsProcessing(false);
      setChatHistory(prev => [...prev, { sender: 'spark', text: a }]);
      speakText(a);
    }, 1000);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!customInput.trim()) return;

    const userText = customInput.trim();
    setChatHistory(prev => [...prev, { sender: 'user', text: userText }]);
    setCustomInput('');
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      
      // Basic keyword search
      const lower = userText.toLowerCase();
      let response = "¡Qué excelente pregunta! Te recomiendo revisar nuestra pestaña de 'Ayuda' en el menú de navegación para más detalles, o si deseas, te guiaré con gusto.";
      
      if (lower.includes('nacimiento') || lower.includes('certificado') || lower.includes('matrimonio')) {
        response = "Puedes agregar certificados de nacimiento, matrimonio y más de manera directa y 100% gratuita en la sección de Trámites. ¡Agrégalos a tu carro!";
      } else if (lower.includes('clave') || lower.includes('única') || lower.includes('unica')) {
        response = "La ClaveÚnica valida tu identidad digital en el Estado. Puedes recuperarla en línea o solicitar una nueva presencialmente en nuestras oficinas.";
      } else if (lower.includes('sucursal') || lower.includes('oficina') || lower.includes('hora') || lower.includes('agendar')) {
        response = "Para agendar tu hora de atención y evitar filas, presiona el botón 'Agendar hora' en mi menú de accesos rápidos, o navega a 'Sucursales' arriba.";
      } else if (lower.includes('carro') || lower.includes('descargar')) {
        response = "Para descargar tus certificados listos, presiona 'Mi carro' arriba a la derecha en la barra de navegación.";
      }
      
      setChatHistory(prev => [...prev, { sender: 'spark', text: response }]);
      speakText(response);
    }, 1100);
  };

  // Pre-configured Spark Quick Actions
  const runAction = (type) => {
    if (type === 'reading') {
      toggleReadingMode();
      const txt = !readingMode 
        ? "¡Asistente de lectura guiada activado! Pasa el cursor o presiona cualquier texto para escucharlo."
        : "Asistente de lectura desactivado.";
      setChatHistory(prev => [...prev, { sender: 'spark', text: txt }]);
      speakText(txt);
    } else if (type === 'contrast') {
      toggleHighContrast();
      const txt = !highContrast 
        ? "Modo de alto contraste activado. ¿Se lee de manera más cómoda ahora?"
        : "Modo de alto contraste desactivado.";
      setChatHistory(prev => [...prev, { sender: 'spark', text: txt }]);
      speakText(txt);
    } else if (type === 'birth') {
      addToCart({
        id: "spark-birth-cert",
        name: "Certificado de Nacimiento",
        type: "Para todo trámite",
        price: 0,
        iconBg: "bg-blue-50",
        iconColor: "text-blue-600"
      });
      const txt = "¡Hecho! Agregué un 'Certificado de Nacimiento' a tu carro de compras de inmediato.";
      setChatHistory(prev => [...prev, { sender: 'spark', text: txt }]);
      speakText(txt);
    } else if (type === 'schedule') {
      if (onOpenModal) {
        onOpenModal('Cédula');
        setIsOpen(false);
      }
    } else if (type === 'folio') {
      if (onOpenModal) {
        onOpenModal('folio');
        setIsOpen(false);
      }
    } else if (type === 'help') {
      setPage('ayuda');
      setIsOpen(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* Spark Assistant Panel */}
      <div 
        className={`
          mb-4 w-96 max-w-[calc(100vw-2rem)] rounded-3xl shadow-2xl transition-all duration-300 transform origin-bottom-right
          bg-slate-900/90 backdrop-blur-xl border border-white/10 text-white overflow-hidden flex flex-col h-[520px]
          ${isOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-90 pointer-events-none'}
        `}
      >
        {/* Panel Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-spark-cyan/20 to-spark-violet/20 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-spark-cyan to-spark-violet flex items-center justify-center shadow-lg relative animate-pulse">
              <Sparkles size={16} className="text-white animate-spin" style={{ animationDuration: '4s' }} />
            </div>
            <div>
              <p className="font-bold text-sm tracking-wide bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">Spark</p>
              <p className="text-[10px] text-cyan-300 font-semibold tracking-wider uppercase">Facilitador Digital</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5">
            <button 
              onClick={() => {
                const newState = !soundEnabled;
                setSoundEnabled(newState);
                if (newState) speakText("Voz de asistencia habilitada.");
              }}
              className={`p-2 rounded-xl border border-white/5 transition-all ${soundEnabled ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
              title={soundEnabled ? "Desactivar voz de Spark" : "Activar voz de Spark"}
            >
              {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
            </button>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl border border-white/5 transition-all"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Chat History & Options */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
          <div className="space-y-4">
            {chatHistory.map((msg, index) => (
              <div 
                key={index} 
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-200`}
              >
                <div 
                  className={`
                    max-w-[85%] px-4 py-3 rounded-2xl text-xs leading-relaxed font-medium shadow-md
                    ${msg.sender === 'user' 
                      ? 'bg-blue-600/90 text-white rounded-tr-none' 
                      : 'bg-white/10 backdrop-blur-md border border-white/5 text-slate-100 rounded-tl-none'}
                  `}
                >
                  <p>{msg.text}</p>
                </div>
              </div>
            ))}
            
            {/* Spark Writing Indicator */}
            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-white/10 backdrop-blur-md border border-white/5 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-1.5 shadow-md">
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span className="text-[10px] text-slate-400 font-semibold ml-1">Escribiendo...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Predefined Questions */}
          <div className="pt-4 border-t border-white/5 space-y-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1 mb-2">Preguntas frecuentes</p>
            <div className="flex flex-col gap-1.5">
              {PREDEFINED_QS.map((faq, i) => (
                <button 
                  key={i}
                  onClick={() => handleQuickQuestion(faq.q, faq.a)}
                  disabled={isProcessing}
                  className="w-full text-left px-3 py-2 bg-white/5 hover:bg-white/10 active:bg-white/15 rounded-xl border border-white/5 hover:border-white/10 text-[11px] text-slate-300 font-medium transition-all flex items-center justify-between group"
                >
                  <span className="truncate pr-2">{faq.q}</span>
                  <MessageSquare size={12} className="text-slate-500 group-hover:text-cyan-400 transition-colors flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* Spark Super Tools & Actions */}
          <div className="pt-3 border-t border-white/5 space-y-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1 mb-2">Atajos inteligentes de Spark</p>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => runAction('reading')}
                className={`p-3 text-left rounded-xl border transition-all flex flex-col justify-between h-20 group relative overflow-hidden ${readingMode ? 'bg-cyan-500/20 border-cyan-400/40 text-cyan-200' : 'bg-white/5 border-white/5 hover:bg-white/10 text-slate-300'}`}
              >
                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity"><Accessibility size={36} /></div>
                <Accessibility size={16} className={readingMode ? 'text-cyan-400' : 'text-slate-400 group-hover:text-cyan-400'} />
                <span className="text-[10px] font-bold leading-tight mt-2">Lectura Guiada (Audio)</span>
              </button>

              <button 
                onClick={() => runAction('contrast')}
                className={`p-3 text-left rounded-xl border transition-all flex flex-col justify-between h-20 group relative overflow-hidden ${highContrast ? 'bg-violet-500/20 border-violet-400/40 text-violet-200' : 'bg-white/5 border-white/5 hover:bg-white/10 text-slate-300'}`}
              >
                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity"><Accessibility size={36} /></div>
                <div className="w-4 h-4 rounded-full border border-slate-400 flex items-center justify-center overflow-hidden flex-shrink-0 group-hover:border-violet-400 transition-colors">
                  <div className="w-2 h-4 bg-slate-400 group-hover:bg-violet-400 transition-colors self-start" />
                </div>
                <span className="text-[10px] font-bold leading-tight mt-2">Alto Contraste</span>
              </button>

              <button 
                onClick={() => runAction('birth')}
                className="p-3 text-left bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-xl transition-all flex flex-col justify-between h-20 group relative overflow-hidden text-slate-300"
              >
                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity"><ShoppingBag size={36} /></div>
                <ShoppingBag size={16} className="text-slate-400 group-hover:text-cyan-400 transition-colors" />
                <span className="text-[10px] font-bold leading-tight mt-2">Añadir Certificado</span>
              </button>

              <button 
                onClick={() => runAction('schedule')}
                className="p-3 text-left bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-xl transition-all flex flex-col justify-between h-20 group relative overflow-hidden text-slate-300"
              >
                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity"><Calendar size={36} /></div>
                <Calendar size={16} className="text-slate-400 group-hover:text-violet-400 transition-colors" />
                <span className="text-[10px] font-bold leading-tight mt-2">Agendar Hora</span>
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mt-1">
              <button 
                onClick={() => runAction('folio')}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-[10px] font-semibold flex items-center justify-center gap-1.5 border border-white/5 hover:border-white/10 text-slate-300 transition-all"
              >
                <Search size={12} />
                <span>Seguimiento Folio</span>
              </button>

              <button 
                onClick={() => runAction('help')}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-[10px] font-semibold flex items-center justify-center gap-1.5 border border-white/5 hover:border-white/10 text-slate-300 transition-all"
              >
                <MessageSquare size={12} />
                <span>Ver Centro Ayuda</span>
              </button>
            </div>
          </div>
        </div>

        {/* Chat Input Footer */}
        <form onSubmit={handleSendMessage} className="p-3 bg-slate-950/80 border-t border-white/10 flex items-center gap-2">
          <input 
            type="text" 
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            disabled={isProcessing}
            placeholder="Escribe tu duda aquí..." 
            className="flex-1 bg-white/5 border border-white/5 rounded-xl px-3 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all outline-none"
          />
          <button 
            type="submit" 
            disabled={!customInput.trim() || isProcessing}
            className="p-2.5 bg-gradient-to-tr from-spark-cyan to-spark-violet rounded-xl hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:scale-100 transition-all flex items-center justify-center"
          >
            <Send size={13} className="text-white" />
          </button>
        </form>

      </div>

      {/* Trigger Button (Spark Character) */}
      <button 
        onClick={handleSparkInteraction}
        aria-label="Abrir asistente de accesibilidad y ayuda Spark"
        className={`
          relative flex items-center justify-center w-16 h-16 rounded-full 
          bg-slate-900/60 backdrop-blur-xl border border-white/15 
          cursor-pointer transition-all duration-300 hover:scale-110 focus:outline-none
          ${isOpen ? 'ring-4 ring-cyan-500/20' : ''}
          ${isProcessing ? 'animate-pulse-glow' : 'shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(139,92,246,0.6)] animate-float'}
        `}
      >
        {/* Glow rings in background */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-spark-cyan/20 to-spark-violet/20 animate-ping opacity-30 pointer-events-none" />

        {/* Paper Plane SVG with gorgeous gradient stroke & glowing dropshadow */}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="url(#spark-gradient)" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className={`w-7 h-7 transition-all duration-300 ${isProcessing || isOpen ? 'rotate-12 scale-110' : '-rotate-12'}`}
        >
          <defs>
            <linearGradient id="spark-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>
          <path d="M22 2L11 13" />
          <path d="M22 2L15 22L11 13L2 9L22 2Z" />
        </svg>

        {/* Online microdot indicator */}
        <div className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-emerald-500 border-[2.5px] border-slate-900 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
      </button>

    </div>
  );
}
