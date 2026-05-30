import React, { useState, useContext, useEffect, useRef } from 'react';
import { useAccessibility, CartContext, RouterContext } from '../../context/AppContexts';
import { 
  MessageSquare, Accessibility, ShoppingBag, X, Send, 
  Volume2, VolumeX, Sparkles, Calendar, Search, Settings, 
  Play, Check, Eye, EyeOff, Sliders, Info 
} from 'lucide-react';
import { speakTextNeural, stopNeuralVoice } from '../../services/aiVoiceService';

const PREDEFINED_QS = [
  { q: "¿Cómo obtengo mi certificado de nacimiento?", a: "¡Es muy fácil! Puedes descargarlo de inmediato de forma 100% online y gratuita desde la pestaña 'Trámites'. Simplemente agrégalo a tu carro haciendo clic en su tarjeta." },
  { q: "¿Qué es la ClaveÚnica?", a: "La ClaveÚnica es tu llave digital de seguridad para realizar más de mil trámites del Estado. Puedes solicitarla online mediante videollamada o presencialmente en nuestras oficinas." },
  { q: "¿Dónde retiro mi cédula de identidad?", a: "Debes retirarla en la misma oficina donde realizaste el trámite. Puedes ver la dirección y horarios de nuestras sucursales en la pestaña de 'Sucursales' arriba." },
  { q: "¿Cómo funciona el carro de certificados?", a: "Agrega todos los certificados gratuitos que necesites. Luego presiona el botón 'Mi carro' arriba a la derecha para descargarlos de inmediato en formato PDF oficial." }
];

export default function SparkAssistant({ onOpenModal, onOpenLogin }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
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

  // Estados del Sub-Panel de Ajustes de Voz
  const [voiceSettings, setVoiceSettings] = useState({
    provider: 'google-free',
    voice: 'alloy',
    speed: 1.16, // Preajuste de velocidad optimizada a 1.16 para fluidez ideal
    apiKey: '',
    voiceId: '',
    useCloudFunction: false,
    cloudFunctionUrl: ''
  });
  
  const [showApiKey, setShowApiKey] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);

  // Cargar configuración inicial de localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('spark_voice_settings');
      if (saved) {
        setVoiceSettings(JSON.parse(saved));
      }
    } catch (e) {
      console.warn("Ajustes de voz locales no encontrados, usando valores predeterminados.");
    }
  }, []);

  // Guardar configuración en localStorage
  const saveSettings = (updatedSettings) => {
    try {
      localStorage.setItem('spark_voice_settings', JSON.stringify(updatedSettings));
      setVoiceSettings(updatedSettings);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (e) {
      console.error("Error al guardar ajustes de voz:", e);
    }
  };

  // Auto-scroll chat history
  useEffect(() => {
    if (chatEndRef.current && !showSettings) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, isProcessing, showSettings]);

  const [selectedVoice, setSelectedVoice] = useState(null);

  // Fallback: Selección de la voz en español local del sistema
  useEffect(() => {
    const selectBestVoice = () => {
      const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
      if (!synth) return;
      const voices = synth.getVoices();
      const spanishVoices = voices.filter(v => v.lang.toLowerCase().startsWith('es'));
      if (spanishVoices.length === 0) return;

      let voice = spanishVoices.find(v => {
        const name = v.name.toLowerCase();
        return name.includes('sabina') || name.includes('helena') || name.includes('natural') || name.includes('google');
      });

      if (!voice) {
        voice = spanishVoices.find(v => v.lang.toLowerCase().includes('es') && !v.lang.toLowerCase().includes('cl'));
      }
      
      if (!voice) {
        voice = spanishVoices[0];
      }
      
      setSelectedVoice(voice);
    };

    selectBestVoice();
    const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    if (synth) {
      synth.onvoiceschanged = selectBestVoice;
    }
  }, []);

  // Sintetizador unificado con fallback local de alto rendimiento
  const speakText = (text) => {
    if (!soundEnabled) return;

    // Intentar reproducción con voz neuronal IA premium configurada
    speakTextNeural(text, voiceSettings).catch((err) => {
      console.warn("[SparkAssistant] Fallo en síntesis neuronal activa, ejecutando fallback local seguro:", err);
      // Fallback seguro a la voz nativa local calibrada
      const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
      if (!synth) return;
      if (synth.speaking) synth.cancel();
      
      let cleanText = text.replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, "");
      cleanText = cleanText.replace(/PDF/gi, "archivo P.D.F.");
      cleanText = cleanText.replace(/100%/g, "cien por ciento");
      cleanText = cleanText.replace(/RUT/gi, "rut");
      cleanText = cleanText.replace(/✨/g, "");
      
      const utterance = new SpeechSynthesisUtterance(cleanText);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      } else {
        utterance.lang = 'es-CL';
      }
      // Ajustamos la tasa de velocidad en el fallback local también según sugerencia del usuario
      utterance.rate = parseFloat(voiceSettings.speed) || 1.16;
      utterance.pitch = 1.0;
      synth.speak(utterance);
    });
  };

  // Reproducir prueba rápida de voz neuronal
  const testNeuralVoice = () => {
    if (isPreviewPlaying) {
      stopNeuralVoice();
      setIsPreviewPlaying(false);
      return;
    }

    setIsPreviewPlaying(true);
    let sampleText = "¡Hola! Así suena mi nueva voz neuronal configurada en el Portal del Registro Civil.";
    if (voiceSettings.provider === 'openai') {
      sampleText = `Hola, esta es mi voz neuronal OpenAI con modelo de síntesis y timbre ${voiceSettings.voice}. ¿Se escucha fluido?`;
    } else if (voiceSettings.provider === 'elevenlabs') {
      sampleText = "Hola, esta es mi voz hiperrealista expresiva provista por ElevenLabs. Excelente para una conversación humana natural.";
    } else if (voiceSettings.provider === 'google-cloud') {
      sampleText = "Hola. Esta es mi voz de Google Cloud Text to Speech, ideal para el español oficial de Chile.";
    }

    speakTextNeural(sampleText, voiceSettings)
      .then((audio) => {
        if (audio) {
          audio.onended = () => setIsPreviewPlaying(false);
        } else {
          setIsPreviewPlaying(false);
        }
      })
      .catch(() => {
        setIsPreviewPlaying(false);
        alert("Error de conexión. Asegúrate de que las API Keys ingresadas sean válidas o usa el motor 'Google Neural Gratuito' que no requiere configuración.");
      });
  };

  const handleSparkInteraction = () => {
    if (!isOpen) {
      setIsOpen(true);
      speakText("¡Hola! Soy Spark, tu facilitador digital. ¿En qué te ayudo hoy?");
    } else {
      setIsOpen(false);
      // Detener de inmediato cualquier audio activo
      stopNeuralVoice();
      const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
      if (synth && synth.speaking) synth.cancel();
      setShowSettings(false);
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
    } else if (type === 'tramites') {
      setPage('tramites');
      setIsOpen(false);
      window.scrollTo(0, 0);
      const txt = "Te he llevado a la sección de Trámites. Aquí puedes buscar, ingresar tus datos y solicitar cualquier certificado de forma oficial.";
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
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* Spark Assistant Panel */}
      <div 
        style={{ fontSize: `${Math.max(12, fontSize * 0.85)}px` }}
        className={`
          mb-4 w-96 max-w-[calc(100vw-2rem)] rounded-3xl transition-all duration-300 transform origin-bottom-right
          backdrop-blur-xl overflow-hidden flex flex-col h-[530px]
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
            {/* Botón de Ajustes de Voz Neuronal IA */}
            <button 
              onClick={() => {
                setShowSettings(!showSettings);
                stopNeuralVoice();
                setIsPreviewPlaying(false);
              }}
              className={`
                p-2 rounded-xl border transition-all text-[0.85em] flex items-center justify-center
                ${highContrast 
                  ? showSettings ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' : 'text-slate-400 hover:text-white hover:bg-white/5 border-white/5'
                  : showSettings ? 'bg-blue-100 text-blue-700 border-blue-200' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100 border-slate-200'}
              `}
              title="Ajustes de Voz IA"
            >
              <Settings size={15} className={showSettings ? "animate-spin" : ""} style={{ animationDuration: '6s' }} />
            </button>

            {/* Habilitar Voz */}
            <button 
              onClick={() => {
                const newState = !soundEnabled;
                setSoundEnabled(newState);
                if (newState) {
                  speakText("Voz habilitada.");
                } else {
                  stopNeuralVoice();
                  const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
                  if (synth && synth.speaking) synth.cancel();
                }
              }}
              className={`
                p-2 rounded-xl border transition-all text-[0.85em] flex items-center justify-center
                ${highContrast 
                  ? soundEnabled ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' : 'text-slate-400 hover:text-white hover:bg-white/5 border-white/5'
                  : soundEnabled ? 'bg-blue-100 text-blue-700 border-blue-200' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100 border-slate-200'}
              `}
              title={soundEnabled ? "Desactivar voz de Spark" : "Activar voz de Spark"}
            >
              {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
            </button>

            <button 
              onClick={() => {
                setIsOpen(false);
                stopNeuralVoice();
                const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
                if (synth && synth.speaking) synth.cancel();
                setShowSettings(false);
              }}
              className={`
                p-2 rounded-xl border transition-all text-[0.85em] flex items-center justify-center
                ${highContrast 
                  ? 'text-slate-400 hover:text-white hover:bg-white/5 border-white/5' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100 border-slate-200'}
              `}
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Dynamic Panel Content (Chat vs. Settings Panel) */}
        {showSettings ? (
          <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin scrollbar-thumb-white/10 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-1 border-b border-slate-200/50 dark:border-white/5">
                <span className="font-extrabold tracking-wide flex items-center gap-1.5 text-blue-600 dark:text-cyan-400">
                  <Sliders size={14} />
                  Ajustes de Voz Neuronal
                </span>
                <span className="text-[0.72em] bg-blue-50 text-blue-700 dark:bg-white/5 dark:text-slate-300 font-bold px-2 py-0.5 rounded-full border border-blue-100/50 dark:border-white/5">
                  Calidad IA
                </span>
              </div>

              {/* Proveedor de Voz */}
              <div className="space-y-1">
                <label className="text-[0.78em] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider block pl-0.5">Proveedor de Voz</label>
                <select 
                  value={voiceSettings.provider}
                  onChange={(e) => {
                    const prov = e.target.value;
                    let defaultVoice = 'alloy';
                    if (prov === 'elevenlabs') defaultVoice = '21m00Tcm4TlvDq8ikWAM';
                    else if (prov === 'google-cloud') defaultVoice = 'es-CL-Wavenet-A';
                    else if (prov === 'google-free') defaultVoice = 'es-419';

                    saveSettings({
                      ...voiceSettings,
                      provider: prov,
                      voice: defaultVoice
                    });
                  }}
                  className={`
                    w-full px-3 py-2 rounded-xl text-[0.85em] border outline-none font-semibold transition-all
                    ${highContrast 
                      ? 'bg-slate-900 border-white/10 text-white focus:border-cyan-500' 
                      : 'bg-white border-slate-200 text-slate-700 focus:border-blue-500 shadow-sm'}
                  `}
                >
                  <option value="google-free">Google Neural Gratuito (Demo)</option>
                  <option value="openai">OpenAI TTS (Natural y Fluido)</option>
                  <option value="elevenlabs">ElevenLabs (Hiperrealista Expresivo)</option>
                  <option value="google-cloud">Google Cloud TTS (Oficial Wavenet)</option>
                </select>
                <span className="text-[0.7em] text-slate-400 dark:text-slate-500 block leading-normal mt-0.5 pl-0.5">
                  {voiceSettings.provider === 'google-free' && "✅ Listo para usar. Flujo de audio estable sin registrar tarjetas ni llaves de API."}
                  {voiceSettings.provider === 'openai' && "✨ Voces moduladas muy humanas. Excelente ritmo y entonación."}
                  {voiceSettings.provider === 'elevenlabs' && "🔥 Expresividad hiperrealista insuperable. Modulación emocional."}
                  {voiceSettings.provider === 'google-cloud' && "🇨🇱 Admite voces con acento chileno oficial (es-CL-Wavenet) altamente fluidas."}
                </span>
              </div>

              {/* Selector de Voces según Proveedor */}
              {voiceSettings.provider !== 'google-free' && (
                <div className="space-y-1 animate-in fade-in slide-in-from-top-1 duration-200">
                  <label className="text-[0.78em] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider block pl-0.5">Timbre / Voz</label>
                  <select 
                    value={voiceSettings.voice}
                    onChange={(e) => saveSettings({ ...voiceSettings, voice: e.target.value })}
                    className={`
                      w-full px-3 py-2 rounded-xl text-[0.85em] border outline-none font-semibold transition-all
                      ${highContrast 
                        ? 'bg-slate-900 border-white/10 text-white focus:border-cyan-500' 
                        : 'bg-white border-slate-200 text-slate-700 focus:border-blue-500 shadow-sm'}
                    `}
                  >
                    {voiceSettings.provider === 'openai' && (
                      <>
                        <option value="alloy">Alloy (Neutra / Equilibrada)</option>
                        <option value="echo">Echo (Masculina suave)</option>
                        <option value="fable">Fable (Cálida y musical)</option>
                        <option value="onyx">Onyx (Masculina profunda)</option>
                        <option value="nova">Nova (Femenina brillante / Enérgica)</option>
                        <option value="shimmer">Shimmer (Femenina clara / Profesional)</option>
                      </>
                    )}
                    {voiceSettings.provider === 'elevenlabs' && (
                      <>
                        <option value="21m00Tcm4TlvDq8ikWAM">Rachel (Femenina expresiva)</option>
                        <option value="AZnzlk1XvdvUeBnXmlld">Dom (Masculina madura)</option>
                        <option value="EXAVITQu4vr4xnSDxMaL">Bella (Femenina dulce)</option>
                        <option value="ErXwobaYiN019tkySvjV">Antoni (Masculina profesional)</option>
                        <option value="custom">-- ID de Voz Personalizada --</option>
                      </>
                    )}
                    {voiceSettings.provider === 'google-cloud' && (
                      <>
                        <option value="es-CL-Wavenet-A">🇨🇱 es-CL Wavenet A (Femenina)</option>
                        <option value="es-CL-Wavenet-B">🇨🇱 es-CL Wavenet B (Masculina)</option>
                        <option value="es-CL-Neural2-A">🇨🇱 es-CL Neural2 A (Femenina)</option>
                        <option value="es-419-Wavenet-A">🌎 es-419 Wavenet A (LatAm)</option>
                        <option value="es-419-Wavenet-B">🌎 es-419 Wavenet B (LatAm)</option>
                      </>
                    )}
                  </select>
                </div>
              )}

              {/* Si selecciona custom en ElevenLabs, ingresar ID de voz manual */}
              {voiceSettings.provider === 'elevenlabs' && voiceSettings.voice === 'custom' && (
                <div className="space-y-1 animate-in fade-in duration-200">
                  <label className="text-[0.78em] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider block pl-0.5">Voice ID de ElevenLabs</label>
                  <input 
                    type="text"
                    value={voiceSettings.voiceId}
                    onChange={(e) => saveSettings({ ...voiceSettings, voiceId: e.target.value })}
                    placeholder="Ej. AZnzlk1XvdvUeBnXmlld"
                    className={`
                      w-full px-3 py-2 rounded-xl text-[0.85em] border outline-none font-semibold transition-all
                      ${highContrast 
                        ? 'bg-slate-900 border-white/10 text-white focus:border-cyan-500' 
                        : 'bg-white border-slate-200 text-slate-700 focus:border-blue-500'}
                    `}
                  />
                </div>
              )}

              {/* API Keys Secretas (localStorage) */}
              {voiceSettings.provider !== 'google-free' && (
                <div className="space-y-1.5 p-3 rounded-2xl border border-slate-200/60 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between pl-0.5">
                    <label className="text-[0.78em] font-bold text-slate-400 dark:text-slate-300 uppercase tracking-wider">
                      Llave de API (Guardada Local)
                    </label>
                    <button 
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                    >
                      {showApiKey ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>
                  </div>
                  
                  <input 
                    type={showApiKey ? "text" : "password"}
                    value={voiceSettings.apiKey}
                    onChange={(e) => saveSettings({ ...voiceSettings, apiKey: e.target.value })}
                    placeholder={`Ingresa tu API Key de ${voiceSettings.provider === 'openai' ? 'OpenAI' : voiceSettings.provider === 'elevenlabs' ? 'ElevenLabs' : 'Google Cloud'}`}
                    className={`
                      w-full px-3 py-2 rounded-xl text-[0.8em] border outline-none transition-all
                      ${highContrast 
                        ? 'bg-slate-950 border-white/10 text-white focus:border-cyan-500' 
                        : 'bg-white border-slate-200 text-slate-800 focus:border-blue-500'}
                    `}
                  />
                  <span className="text-[0.68em] text-slate-400 dark:text-slate-400 block leading-normal mt-1 flex items-start gap-1">
                    <Info size={10} className="mt-0.5 flex-shrink-0" />
                    Tus llaves se guardan de forma 100% segura en tu navegador local (localStorage) y nunca tocan servidores externos.
                  </span>
                </div>
              )}

              {/* Slider de Velocidad (Speech Rate) - Integrado con feedback de usuario */}
              <div className="space-y-2 p-3 rounded-2xl border border-slate-200/60 dark:border-white/5 bg-slate-50/50 dark:bg-white/5">
                <div className="flex items-center justify-between pl-0.5">
                  <label className="text-[0.78em] font-bold text-slate-400 dark:text-slate-300 uppercase tracking-wider">
                    Velocidad de Lectura
                  </label>
                  <span className="text-[0.78em] font-extrabold text-blue-600 dark:text-cyan-400 bg-blue-100/50 dark:bg-cyan-500/10 px-2 py-0.5 rounded border border-blue-200 dark:border-cyan-500/20">
                    {voiceSettings.speed}x
                  </span>
                </div>
                
                <input 
                  type="range"
                  min="0.80"
                  max="1.50"
                  step="0.02"
                  value={voiceSettings.speed}
                  onChange={(e) => saveSettings({ ...voiceSettings, speed: parseFloat(e.target.value) })}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600 dark:accent-cyan-400"
                />
                <div className="flex items-center justify-between text-[0.68em] text-slate-400 dark:text-slate-500 px-0.5">
                  <span>Más Lenta</span>
                  <span className="font-semibold">Predeterminada (1.16x)</span>
                  <span>Más Rápida</span>
                </div>
              </div>
            </div>

            {/* Botón de Guardado y Demostración */}
            <div className="space-y-2 pt-3 border-t border-slate-200/50 dark:border-white/5">
              <div className="flex gap-2">
                <button 
                  onClick={testNeuralVoice}
                  className={`
                    flex-1 py-2.5 px-3 rounded-xl border font-bold text-[0.82em] transition-all flex items-center justify-center gap-1.5
                    ${isPreviewPlaying 
                      ? 'bg-amber-500 text-white border-amber-600 animate-pulse' 
                      : highContrast 
                        ? 'bg-slate-900 border-white/10 hover:bg-slate-800 text-slate-200' 
                        : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'}
                  `}
                >
                  {isPreviewPlaying ? (
                    <>
                      <div className="flex items-center gap-0.5">
                        <span className="w-1 h-3 bg-white animate-bounce-slow" />
                        <span className="w-1 h-4 bg-white animate-bounce" style={{ animationDelay: '100ms' }} />
                        <span className="w-1 h-2 bg-white animate-bounce-slow" style={{ animationDelay: '200ms' }} />
                      </div>
                      <span>Detener</span>
                    </>
                  ) : (
                    <>
                      <Play size={12} fill="currentColor" />
                      <span>Probar Voz</span>
                    </>
                  )}
                </button>

                <button 
                  onClick={() => {
                    saveSettings(voiceSettings);
                    setShowSettings(false);
                    // Emitir mensaje auditivo con la velocidad guardada
                    setTimeout(() => speakText("Ajustes de voz guardados y aplicados."), 300);
                  }}
                  className={`
                    flex-1 py-2.5 px-3 rounded-xl font-bold text-[0.82em] transition-all flex items-center justify-center gap-1.5 text-white
                    ${highContrast 
                      ? 'bg-gradient-to-tr from-cyan-500 to-violet-500 hover:opacity-90 shadow-[0_0_10px_rgba(6,182,212,0.3)]' 
                      : 'bg-blue-600 hover:bg-blue-700'}
                  `}
                >
                  {saveSuccess ? <Check size={12} className="animate-scale-in" /> : null}
                  <span>{saveSuccess ? "¡Guardado!" : "Guardar y Cerrar"}</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
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
                    onClick={() => runAction('tramites')}
                    className={`
                      p-3 text-left border rounded-xl transition-all flex flex-col justify-between h-20 group relative overflow-hidden 
                      ${highContrast 
                        ? 'bg-white/5 border-white/5 hover:bg-white/10 text-slate-300' 
                        : 'bg-slate-50 border-slate-100 hover:bg-slate-100/80 text-slate-600'}
                    `}
                    title="Ir a buscar y solicitar trámites oficiales"
                  >
                    <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity"><Search size={36} /></div>
                    <Search size={16} className={`transition-colors ${highContrast ? 'text-slate-400 group-hover:text-cyan-400' : 'text-slate-400 group-hover:text-blue-600'}`} />
                    <span className="text-[0.78em] font-bold leading-tight mt-2">Buscar Trámite</span>
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
          </>
        )}

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
