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
  
  const { 
    fontSize, 
    increaseFontSize, 
    decreaseFontSize, 
    readingMode, 
    toggleReadingMode, 
    highContrast, 
    toggleHighContrast 
  } = useAccessibility();
  const { totalItems, addToCart } = useContext(CartContext);
  const { setPage } = useContext(RouterContext);
  
  const chatEndRef = useRef(null);

  // Auto-scroll chat history
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, isProcessing]);

  const [selectedVoice, setSelectedVoice] = useState(null);

  // Selección de la voz en español más fluida y natural del sistema
  useEffect(() => {
    const selectBestVoice = () => {
      const synth = window.speechSynthesis;
      if (!synth) return;
      const voices = synth.getVoices();
      const spanishVoices = voices.filter(v => v.lang.toLowerCase().startsWith('es'));
      if (spanishVoices.length === 0) return;

      // Buscar por orden de preferencia para garantizar máxima fluidez regional:
      // 1. Español de Chile (es-CL)
      // 2. Español de México (es-MX)
      // 3. Voces de alta calidad ("natural", "google", "sabina", "helena")
      // 4. Primera voz en español disponible
      let voice = spanishVoices.find(v => v.lang.toLowerCase().includes('cl'));
      if (!voice) {
        voice = spanishVoices.find(v => v.lang.toLowerCase().includes('mx'));
      }
      if (!voice) {
        voice = spanishVoices.find(v => {
          const name = v.name.toLowerCase();
          return name.includes('google') || name.includes('natural') || name.includes('sabina') || name.includes('helena');
        });
      }
      if (!voice) {
        voice = spanishVoices[0];
      }
      setSelectedVoice(voice);
    };

    selectBestVoice();
    if (window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = selectBestVoice;
    }
  }, []);

  // Speech helper de alto rendimiento y naturalidad
  const speakText = (text) => {
    if (!soundEnabled) return;
    const synth = window.speechSynthesis;
    if (synth.speaking) synth.cancel();
    
    // Preprocesar el texto para mejorar el ritmo de lectura
    let cleanText = text.replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, "");
    
    // Mejorar pronunciación de términos técnicos y abreviaturas
    cleanText = cleanText.replace(/PDF/gi, "archivo P.D.F.");
    cleanText = cleanText.replace(/100%/g, "cien por ciento");
    cleanText = cleanText.replace(/RUT/gi, "rut");
    cleanText = cleanText.replace(/✨/g, ""); // remover chispas
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    } else {
      utterance.lang = 'es-CL';
    }
    
    // Calibración acústica premium para una cadencia y vocalización súper fluida
    utterance.rate = 0.93;  // Velocidad sutilmente más relajada para máxima claridad y naturalidad
    utterance.pitch = 1.06; // Tono levemente elevado para sonar entusiasta y amigable, no robótica
    
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
        style={{ fontSize: `${Math.max(12, fontSize * 0.85)}px` }}
        className={`
          mb-4 w-96 max-w-[calc(100vw-2rem)] rounded-3xl transition-all duration-300 transform origin-bottom-right
          backdrop-blur-xl overflow-hidden flex flex-col h-[520px]
          ${isOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-90 pointer-events-none'}
          ${highContrast 
            ? 'bg-slate-950/95 border border-cyan-500/40 text-white shadow-[0_0_30px_rgba(6,182,212,0.25)]' 
            : 'bg-white/90 border border-slate-200 text-slate-800 shadow-[0_10px_50px_rgba(0,0,0,0.12)]'}
        `}
      >
        {/* Panel Header */}
        <div 
          className={`
            px-5 py-4 flex items-center justify-between transition-colors duration-200
            ${highContrast 
              ? 'bg-gradient-to-r from-spark-cyan/20 to-spark-violet/20 border-b border-white/10' 
              : 'bg-gradient-to-r from-blue-50/80 to-slate-50/80 border-b border-slate-100'}
          `}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-spark-cyan to-spark-violet flex items-center justify-center shadow-lg relative animate-pulse">
              <Sparkles size={16} className="text-white animate-spin" style={{ animationDuration: '4s' }} />
            </div>
            <div>
              <p className={`font-bold text-[1.05em] tracking-wide ${highContrast ? 'bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent' : 'text-slate-800'}`}>Spark</p>
              <p className={`text-[0.75em] font-semibold tracking-wider uppercase ${highContrast ? 'text-cyan-300' : 'text-blue-600'}`}>Facilitador Digital</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5">
            <button 
              onClick={() => {
                const newState = !soundEnabled;
                setSoundEnabled(newState);
                if (newState) speakText("Voz de asistencia habilitada.");
              }}
              className={`
                p-2 rounded-xl border transition-all text-[0.85em]
                ${highContrast 
                  ? soundEnabled ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' : 'text-slate-400 hover:text-white hover:bg-white/5 border-white/5'
                  : soundEnabled ? 'bg-blue-100 text-blue-700 border-blue-200' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100 border-slate-200'}
              `}
              title={soundEnabled ? "Desactivar voz de Spark" : "Activar voz de Spark"}
            >
              {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
            </button>
            <button 
              onClick={() => setIsOpen(false)}
              className={`
                p-2 rounded-xl border transition-all text-[0.85em]
                ${highContrast 
                  ? 'text-slate-400 hover:text-white hover:bg-white/5 border-white/5' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100 border-slate-200'}
              `}
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
                    max-w-[85%] px-4 py-3 rounded-2xl text-[0.88em] leading-relaxed font-medium shadow-md
                    ${msg.sender === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : highContrast
                        ? 'bg-white/10 backdrop-blur-md border border-white/5 text-slate-100 rounded-tl-none'
                        : 'bg-slate-100 border border-slate-200/60 text-slate-700 rounded-tl-none'}
                  `}
                >
                  <p>{msg.text}</p>
                </div>
              </div>
            ))}
            
            {/* Spark Writing Indicator */}
            {isProcessing && (
              <div className="flex justify-start">
                <div className={`
                  px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-1.5 shadow-md border
                  ${highContrast 
                    ? 'bg-white/10 backdrop-blur-md border-white/5' 
                    : 'bg-slate-100 border-slate-200/60'}
                `}>
                  <span className={`w-1.5 h-1.5 rounded-full animate-bounce ${highContrast ? 'bg-cyan-400' : 'bg-blue-600'}`} style={{ animationDelay: '0ms' }} />
                  <span className={`w-1.5 h-1.5 rounded-full animate-bounce ${highContrast ? 'bg-violet-400' : 'bg-indigo-600'}`} style={{ animationDelay: '150ms' }} />
                  <span className={`w-1.5 h-1.5 rounded-full animate-bounce ${highContrast ? 'bg-cyan-400' : 'bg-blue-600'}`} style={{ animationDelay: '300ms' }} />
                  <span className="text-[0.78em] text-slate-400 font-semibold ml-1">Escribiendo...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Predefined Questions */}
          <div className={`pt-4 border-t space-y-2 ${highContrast ? 'border-white/5' : 'border-slate-100'}`}>
            <p className="text-[0.78em] font-bold text-slate-400 uppercase tracking-widest pl-1 mb-2">Preguntas frecuentes</p>
            <div className="flex flex-col gap-1.5">
              {PREDEFINED_QS.map((faq, i) => (
                <button 
                  key={i}
                  onClick={() => handleQuickQuestion(faq.q, faq.a)}
                  disabled={isProcessing}
                  className={`
                    w-full text-left px-3 py-2 rounded-xl border text-[0.82em] font-medium transition-all flex items-center justify-between group
                    ${highContrast 
                      ? 'bg-white/5 hover:bg-white/10 active:bg-white/15 border-white/5 hover:border-white/10 text-slate-300' 
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200/60 hover:border-slate-200 text-slate-600'}
                  `}
                >
                  <span className="truncate pr-2">{faq.q}</span>
                  <MessageSquare size={12} className={`flex-shrink-0 transition-colors ${highContrast ? 'text-slate-500 group-hover:text-cyan-400' : 'text-slate-400 group-hover:text-blue-600'}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Spark Super Tools & Actions */}
          <div className={`pt-3 border-t space-y-2 ${highContrast ? 'border-white/5' : 'border-slate-100'}`}>
            <p className="text-[0.78em] font-bold text-slate-400 uppercase tracking-widest pl-1 mb-2">Atajos inteligentes de Spark</p>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => runAction('reading')}
                className={`
                  p-3 text-left rounded-xl border transition-all flex flex-col justify-between h-20 group relative overflow-hidden 
                  ${readingMode 
                    ? highContrast ? 'bg-cyan-500/20 border-cyan-400/40 text-cyan-200' : 'bg-blue-50 border-blue-200 text-blue-700' 
                    : highContrast ? 'bg-white/5 border-white/5 hover:bg-white/10 text-slate-300' : 'bg-slate-50 border-slate-100 hover:bg-slate-100/80 text-slate-600'}
                `}
              >
                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity"><Accessibility size={36} /></div>
                <Accessibility size={16} className={readingMode ? (highContrast ? 'text-cyan-400' : 'text-blue-600') : (highContrast ? 'text-slate-400 group-hover:text-cyan-400' : 'text-slate-400 group-hover:text-blue-600')} />
                <span className="text-[0.78em] font-bold leading-tight mt-2">Lectura Guiada (Audio)</span>
              </button>

              <button 
                onClick={() => runAction('contrast')}
                className={`
                  p-3 text-left rounded-xl border transition-all flex flex-col justify-between h-20 group relative overflow-hidden 
                  ${highContrast 
                    ? 'bg-violet-500/20 border-violet-400/40 text-violet-200' 
                    : 'bg-slate-50 border-slate-100 hover:bg-slate-100/80 text-slate-600'}
                `}
              >
                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity"><Accessibility size={36} /></div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center overflow-hidden flex-shrink-0 transition-colors ${highContrast ? 'border-violet-400' : 'border-slate-400 group-hover:border-violet-600'}`}>
                  <div className={`w-2 h-4 ${highContrast ? 'bg-violet-400' : 'bg-slate-400 group-hover:bg-violet-600'}`} />
                </div>
                <span className="text-[0.78em] font-bold leading-tight mt-2">Alto Contraste</span>
              </button>

              <button 
                onClick={() => runAction('birth')}
                className={`
                  p-3 text-left border rounded-xl transition-all flex flex-col justify-between h-20 group relative overflow-hidden 
                  ${highContrast 
                    ? 'bg-white/5 border-white/5 hover:bg-white/10 text-slate-300' 
                    : 'bg-slate-50 border-slate-100 hover:bg-slate-100/80 text-slate-600'}
                `}
              >
                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity"><ShoppingBag size={36} /></div>
                <ShoppingBag size={16} className={`transition-colors ${highContrast ? 'text-slate-400 group-hover:text-cyan-400' : 'text-slate-400 group-hover:text-blue-600'}`} />
                <span className="text-[0.78em] font-bold leading-tight mt-2">Añadir Certificado</span>
              </button>

              <button 
                onClick={() => runAction('schedule')}
                className={`
                  p-3 text-left border rounded-xl transition-all flex flex-col justify-between h-20 group relative overflow-hidden 
                  ${highContrast 
                    ? 'bg-white/5 border-white/5 hover:bg-white/10 text-slate-300' 
                    : 'bg-slate-50 border-slate-100 hover:bg-slate-100/80 text-slate-600'}
                `}
              >
                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity"><Calendar size={36} /></div>
                <Calendar size={16} className={`transition-colors ${highContrast ? 'text-slate-400 group-hover:text-violet-400' : 'text-slate-400 group-hover:text-blue-600'}`} />
                <span className="text-[0.78em] font-bold leading-tight mt-2">Agendar Hora</span>
              </button>
            </div>
            
            {/* Control de Tamaño de Texto en toda la página */}
            <div 
              className={`
                p-3 border rounded-xl flex items-center justify-between transition-colors
                ${highContrast 
                  ? 'bg-white/5 border-white/5 text-slate-300' 
                  : 'bg-slate-50 border-slate-200/50 text-slate-700'}
              `}
            >
              <span className="font-semibold tracking-wide flex items-center gap-1.5 text-[0.85em]">
                <span className={`text-[0.78em] font-bold px-1.5 py-0.5 rounded border ${highContrast ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>A</span>
                Tamaño del Texto
              </span>
              <div className="flex items-center gap-1.5">
                <button 
                  onClick={decreaseFontSize}
                  className={`
                    w-8 h-8 rounded-lg border active:scale-95 transition-all font-bold flex items-center justify-center text-[0.85em]
                    ${highContrast 
                      ? 'bg-slate-800 hover:bg-slate-700 border-white/5 hover:border-white/10 text-slate-200' 
                      : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700 shadow-sm'}
                  `}
                  title="Disminuir tamaño de letra"
                >
                  A-
                </button>
                <span className={`font-extrabold text-[0.78em] w-12 text-center py-1 rounded-md tracking-wider ${highContrast ? 'bg-white/10 text-cyan-300' : 'bg-slate-200 text-blue-700'}`}>
                  {fontSize}px
                </span>
                <button 
                  onClick={increaseFontSize}
                  className={`
                    w-8 h-8 rounded-lg border active:scale-95 transition-all font-bold flex items-center justify-center text-[0.85em]
                    ${highContrast 
                      ? 'bg-slate-800 hover:bg-slate-700 border-white/5 hover:border-white/10 text-slate-200' 
                      : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700 shadow-sm'}
                  `}
                  title="Aumentar tamaño de letra"
                >
                  A+
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => runAction('folio')}
                className={`
                  px-3 py-2 rounded-xl text-[0.78em] font-semibold flex items-center justify-center gap-1.5 border transition-all
                  ${highContrast 
                    ? 'bg-slate-800 hover:bg-slate-700 border-white/5 hover:border-white/10 text-slate-300' 
                    : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'}
                `}
              >
                <Search size={12} />
                <span>Seguimiento Folio</span>
              </button>

              <button 
                onClick={() => runAction('help')}
                className={`
                  px-3 py-2 rounded-xl text-[0.78em] font-semibold flex items-center justify-center gap-1.5 border transition-all
                  ${highContrast 
                    ? 'bg-slate-800 hover:bg-slate-700 border-white/5 hover:border-white/10 text-slate-300' 
                    : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'}
                `}
              >
                <MessageSquare size={12} />
                <span>Ver Centro Ayuda</span>
              </button>
            </div>
          </div>
        </div>

        {/* Chat Input Footer */}
        <form 
          onSubmit={handleSendMessage} 
          className={`
            p-3 flex items-center gap-2 transition-colors duration-200
            ${highContrast 
              ? 'bg-slate-950/80 border-t border-white/10' 
              : 'bg-slate-50 border-t border-slate-200/60'}
          `}
        >
          <input 
            type="text" 
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            disabled={isProcessing}
            placeholder="Escribe tu duda aquí..." 
            className={`
              flex-1 border rounded-xl px-3 py-2.5 text-[0.85em] transition-all outline-none
              ${highContrast 
                ? 'bg-white/5 border-white/5 text-slate-100 placeholder-slate-300 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30' 
                : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20'}
            `}
          />
          <button 
            type="submit" 
            disabled={!customInput.trim() || isProcessing}
            className={`
              p-2.5 rounded-xl hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:scale-100 transition-all flex items-center justify-center text-[0.85em]
              ${highContrast 
                ? 'bg-gradient-to-tr from-spark-cyan to-spark-violet' 
                : 'bg-blue-600 text-white'}
            `}
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
          backdrop-blur-xl border cursor-pointer transition-all duration-300 hover:scale-110 focus:outline-none
          ${isOpen ? 'ring-4 ring-cyan-500/20' : ''}
          ${highContrast 
            ? 'bg-slate-900/60 border-white/15 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(139,92,246,0.6)]' 
            : 'bg-white/80 border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_10px_35px_rgba(139,92,246,0.2)]'}
          ${isProcessing ? 'animate-pulse-glow' : 'animate-float'}
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
