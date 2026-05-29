/**
 * Servicio de Voz Neuronal de Alta Fidelidad (AI Voice Service)
 * 
 * Admite múltiples proveedores de IA neuronal de nivel profesional:
 * - OpenAI TTS (tts-1 / tts-1-hd con voces alloy, echo, fable, onyx, nova, shimmer)
 * - ElevenLabs (Modelos multilingües con voces expresivas customizadas)
 * - Google Cloud TTS (Voces Wavenet y Neural2 optimizadas para es-CL o es-419)
 * - Google Free TTS (Fallback inmediato de costo cero para desarrollo fluido)
 * 
 * Reproduce el audio dinámicamente utilizando flujos binarios MP3 montados en
 * objetos de Audio de HTML5. Resuelve problemas de compatibilidad y asegura
 * la misma calidad y entonación empática en computadores, tablets y celulares (iOS/Android).
 */

// Referencia de audio activa y cola de reproducción para gestionar la detención inmediata
let activeAudio = null;

// Configuración por defecto recuperada de localStorage si existe
const getVoiceSettings = () => {
  try {
    const saved = localStorage.getItem('spark_voice_settings');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error("Error al leer los ajustes de voz del almacenamiento local:", e);
  }
  
  return {
    provider: 'google-free', // 'google-free', 'openai', 'elevenlabs', 'google-cloud'
    voice: 'alloy', // Nombre de la voz por defecto
    speed: 1.16,    // Velocidad optimizada para fluidez profesional
    apiKey: '',
    voiceId: '',     // ElevenLabs voice ID
    useCloudFunction: false,
    cloudFunctionUrl: ''
  };
};

/**
 * Preprocesa el texto para optimizar la pronunciación institucional chilena y el ritmo de lectura.
 */
const cleanSpeechText = (text) => {
  let clean = text.replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, "");
  clean = clean.replace(/PDF/gi, "archivo P. D. F.");
  clean = clean.replace(/100%/g, "cien por ciento");
  clean = clean.replace(/RUT/gi, "rut");
  clean = clean.replace(/ClaveÚnica/gi, "Clave Única");
  clean = clean.replace(/✨/g, "");
  clean = clean.replace(/⭐/g, "");
  return clean.trim();
};

/**
 * Sintetiza texto a voz neuronal según el proveedor configurado
 * @param {string} text Texto a sintetizar
 * @param {object} customSettings Parámetros opcionales para forzar configuraciones
 */
export const speakTextNeural = (text, customSettings = null) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Detener cualquier audio previo activo
      stopNeuralVoice();

      const settings = customSettings || getVoiceSettings();
      const cleanText = cleanSpeechText(text);

      if (!cleanText) {
        resolve(null);
        return;
      }

      console.log(`[AIVoiceService] Sintetizando con proveedor: ${settings.provider} (Velocidad: ${settings.speed})`);

      // 1. Delegar a Firebase Cloud Function si está habilitado
      if (settings.useCloudFunction && settings.cloudFunctionUrl) {
        try {
          const response = await fetch(settings.cloudFunctionUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              text: cleanText,
              provider: settings.provider,
              voice: settings.voice,
              speed: settings.speed,
              voiceId: settings.voiceId
            })
          });

          if (!response.ok) throw new Error("Error en Firebase Cloud Function");

          const blob = await response.blob();
          playAudioBlob(blob, resolve, reject);
          return;
        } catch (cfError) {
          console.warn("[AIVoiceService] Fallo en la pasarela de Cloud Function, derivando a petición directa o fallback:", cfError);
        }
      }

      // 2. Ejecutar peticiones directas del lado del cliente
      switch (settings.provider) {
        case 'openai':
          await synthesizeOpenAI(cleanText, settings, resolve, reject);
          break;
        case 'elevenlabs':
          await synthesizeElevenLabs(cleanText, settings, resolve, reject);
          break;
        case 'google-cloud':
          await synthesizeGoogleCloud(cleanText, settings, resolve, reject);
          break;
        case 'google-free':
        default:
          synthesizeGoogleFree(cleanText, settings, resolve, reject);
          break;
      }

    } catch (error) {
      console.error("[AIVoiceService] Error general en generación de voz IA:", error);
      reject(error);
    }
  });
};

/**
 * Detiene la voz en reproducción de manera inmediata y libera la memoria
 */
export const stopNeuralVoice = () => {
  if (activeAudio) {
    try {
      activeAudio.pause();
      // Eliminar el ObjectURL si existe para evitar pérdidas de memoria en navegadores móviles
      if (activeAudio.src && activeAudio.src.startsWith('blob:')) {
        URL.revokeObjectURL(activeAudio.src);
      }
    } catch (e) {
      console.warn("Error al detener el audio activo:", e);
    }
    activeAudio = null;
  }
};

/**
 * Reproductor de Blobs Binarios MP3 en HTML5 Audio
 */
const playAudioBlob = (blob, resolve, reject) => {
  try {
    const audioUrl = URL.createObjectURL(blob);
    const audio = new Audio(audioUrl);
    activeAudio = audio;

    audio.play()
      .then(() => {
        console.log("[AIVoiceService] Reproduciendo flujo binario MP3 neuronal...");
        resolve(audio);
      })
      .catch(err => {
        console.warn("[AIVoiceService] Reproducción automática bloqueada por el navegador:", err);
        reject(err);
      });

    audio.onended = () => {
      URL.revokeObjectURL(audioUrl);
      if (activeAudio === audio) activeAudio = null;
    };
  } catch (error) {
    reject(error);
  }
};

/**
 * Generador Directo OpenAI TTS (API)
 */
const synthesizeOpenAI = async (text, settings, resolve, reject) => {
  const key = settings.apiKey || import.meta.env.VITE_OPENAI_API_KEY;
  if (!key) {
    throw new Error("API Key de OpenAI no configurada.");
  }

  const response = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${key}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "tts-1",
      input: text,
      voice: settings.voice || "alloy", // alloy, echo, fable, onyx, nova, shimmer
      response_format: "mp3",
      speed: parseFloat(settings.speed) || 1.16
    })
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || `Error HTTP OpenAI: ${response.status}`);
  }

  const blob = await response.blob();
  playAudioBlob(blob, resolve, reject);
};

/**
 * Generador Directo ElevenLabs TTS (API)
 */
const synthesizeElevenLabs = async (text, settings, resolve, reject) => {
  const key = settings.apiKey || import.meta.env.VITE_ELEVENLABS_API_KEY;
  const voiceId = settings.voiceId || "21m00Tcm4TlvDq8ikWAM"; // Rachel por defecto
  
  if (!key) {
    throw new Error("API Key de ElevenLabs no configurada.");
  }

  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: "POST",
    headers: {
      "xi-api-key": key,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      text: text,
      model_id: "eleven_multilingual_v2",
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75
      }
    })
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => "");
    throw new Error(`Error HTTP ElevenLabs: ${response.status}. ${errText}`);
  }

  const blob = await response.blob();
  
  // Nota: ElevenLabs no permite ajustar la velocidad en su endpoint básico.
  // Pero podemos ajustar la velocidad de reproducción del elemento HTML5 Audio!
  try {
    const audioUrl = URL.createObjectURL(blob);
    const audio = new Audio(audioUrl);
    activeAudio = audio;
    
    // Ajustar tasa de reproducción de forma nativa en el navegador
    audio.playbackRate = parseFloat(settings.speed) || 1.16;

    audio.play()
      .then(() => {
        console.log("[AIVoiceService] Reproduciendo ElevenLabs a velocidad:", audio.playbackRate);
        resolve(audio);
      })
      .catch(err => reject(err));

    audio.onended = () => {
      URL.revokeObjectURL(audioUrl);
      if (activeAudio === audio) activeAudio = null;
    };
  } catch (error) {
    reject(error);
  }
};

/**
 * Generador Directo Google Cloud TTS (API)
 */
const synthesizeGoogleCloud = async (text, settings, resolve, reject) => {
  const key = settings.apiKey || import.meta.env.VITE_GOOGLE_CLOUD_TTS_API_KEY;
  if (!key) {
    throw new Error("API Key de Google Cloud no configurada.");
  }

  const voiceName = settings.voice || "es-CL-Wavenet-A"; // Voz chilena premium
  const langCode = voiceName.startsWith("es-CL") ? "es-CL" : "es-US";

  const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${key}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      input: { text: text },
      voice: {
        languageCode: langCode,
        name: voiceName
      },
      audioConfig: {
        audioEncoding: "MP3",
        speakingRate: parseFloat(settings.speed) || 1.16
      }
    })
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || `Error HTTP Google Cloud: ${response.status}`);
  }

  const data = await response.json();
  if (!data.audioContent) {
    throw new Error("Google Cloud TTS no retornó audioContent.");
  }

  // Convertir string Base64 a un Blob
  const byteCharacters = atob(data.audioContent);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: "audio/mp3" });

  playAudioBlob(blob, resolve, reject);
};

/**
 * Generador Directo Google Free TTS (Fallback sin límites, alta disponibilidad)
 */
const synthesizeGoogleFree = (text, settings, resolve, reject) => {
  try {
    // La variable tl=es-419 genera una voz de acento hispanoamericano neutro de alta fluidez
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=es-419&client=tw-ob&q=${encodeURIComponent(text)}`;
    
    const audio = new Audio(ttsUrl);
    activeAudio = audio;

    // Aumentamos la velocidad de reproducción nativa en HTML5 según la solicitud del usuario
    audio.playbackRate = parseFloat(settings.speed) || 1.16;

    audio.play()
      .then(() => {
        console.log(`[AIVoiceService] Reproduciendo fallback de traducción a velocidad: ${audio.playbackRate}`);
        resolve(audio);
      })
      .catch(err => {
        reject(err);
      });
  } catch (error) {
    reject(error);
  }
};
