/**
 * PLANTILLA DE PRODUCCIÓN: Firebase Cloud Function para Text-to-Speech Neuronal Seguro
 * 
 * Copia y pega este código en tu archivo `functions/index.js` en tu proyecto de Firebase.
 * Esta función recibe el texto del frontend, procesa la petición en el servidor de forma
 * segura (manteniendo tus API Keys ocultas de los usuarios) y devuelve el archivo de audio MP3
 * binario directamente como respuesta.
 * 
 * Requisitos:
 * 1. Ejecutar en tu carpeta `functions/`: `npm install express cors node-fetch` (o usar axios/request)
 * 2. Configurar las variables de entorno en Firebase con:
 *    firebase functions:secrets:set OPENAI_API_KEY="tu-api-key"
 *    firebase functions:secrets:set ELEVENLABS_API_KEY="tu-api-key"
 */

const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const cors = require("cors")({ origin: true });
const fetch = require("node-fetch"); // node-fetch v2 es ideal para entornos Cloud Functions tradicionales

exports.synthesizeVoice = onRequest({ cors: true, secrets: ["OPENAI_API_KEY", "ELEVENLABS_API_KEY"] }, async (req, res) => {
  // Envolver la petición completa con CORS para evitar bloqueos del navegador
  return cors(req, res, async () => {
    try {
      // Solo permitir peticiones POST
      if (req.method !== "POST") {
        res.status(405).send("Método No Permitido (Usar POST)");
        return;
      }

      const { text, provider, voice, speed, voiceId } = req.body;

      if (!text) {
        res.status(400).send("Falta el parámetro requerido: text");
        return;
      }

      logger.info(`[TTS-CloudFunction] Procesando texto para: ${provider} (Voz: ${voice || voiceId})`);

      // 1. Integración de OpenAI TTS
      if (provider === "openai") {
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
          res.status(500).send("API Key de OpenAI no configurada en el servidor.");
          return;
        }

        const openAiResponse = await fetch("https://api.openai.com/v1/audio/speech", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "tts-1",
            input: text,
            voice: voice || "alloy",
            response_format: "mp3",
            speed: parseFloat(speed) || 1.12
          })
        });

        if (!openAiResponse.ok) {
          const errData = await openAiResponse.text();
          logger.error("[TTS-CloudFunction] Error en OpenAI API:", errData);
          res.status(openAiResponse.status).send(`Error de OpenAI: ${errData}`);
          return;
        }

        // Obtener el buffer binario del MP3 y servirlo con la cabecera correcta
        const buffer = await openAiResponse.buffer();
        res.set({
          "Content-Type": "audio/mpeg",
          "Content-Length": buffer.length,
          "Cache-Control": "public, max-age=3600"
        });
        res.send(buffer);
        return;
      }

      // 2. Integración de ElevenLabs TTS
      if (provider === "elevenlabs") {
        const apiKey = process.env.ELEVENLABS_API_KEY;
        const activeVoiceId = voiceId || "21m00Tcm4TlvDq8ikWAM"; // Rachel por defecto
        
        if (!apiKey) {
          res.status(500).send("API Key de ElevenLabs no configurada en el servidor.");
          return;
        }

        const elevenResponse = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${activeVoiceId}`, {
          method: "POST",
          headers: {
            "xi-api-key": apiKey,
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

        if (!elevenResponse.ok) {
          const errData = await elevenResponse.text();
          logger.error("[TTS-CloudFunction] Error en ElevenLabs API:", errData);
          res.status(elevenResponse.status).send(`Error de ElevenLabs: ${errData}`);
          return;
        }

        const buffer = await elevenResponse.buffer();
        res.set({
          "Content-Type": "audio/mpeg",
          "Content-Length": buffer.length
        });
        res.send(buffer);
        return;
      }

      // 3. Integración de Google Cloud TTS (Oficial)
      if (provider === "google-cloud") {
        const apiKey = process.env.GOOGLE_CLOUD_TTS_API_KEY;
        if (!apiKey) {
          res.status(500).send("API Key de Google Cloud no configurada en el servidor.");
          return;
        }

        const voiceName = voice || "es-CL-Wavenet-A";
        const langCode = voiceName.startsWith("es-CL") ? "es-CL" : "es-US";

        const googleResponse = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            input: { text: text },
            voice: { languageCode: langCode, name: voiceName },
            audioConfig: {
              audioEncoding: "MP3",
              speakingRate: parseFloat(speed) || 1.12
            }
          })
        });

        if (!googleResponse.ok) {
          const errData = await googleResponse.text();
          logger.error("[TTS-CloudFunction] Error en Google Cloud TTS API:", errData);
          res.status(googleResponse.status).send(`Error de Google Cloud TTS: ${errData}`);
          return;
        }

        const data = await googleResponse.json();
        if (!data.audioContent) {
          res.status(500).send("Google Cloud TTS no retornó audio binario.");
          return;
        }

        // Convertir la base64 a Buffer binario para retornar al cliente
        const buffer = Buffer.from(data.audioContent, "base64");
        res.set({
          "Content-Type": "audio/mpeg",
          "Content-Length": buffer.length
        });
        res.send(buffer);
        return;
      }

      // Proveedor no soportado en la nube
      res.status(400).send(`Proveedor '${provider}' no soportado o inválido.`);

    } catch (err) {
      logger.error("[TTS-CloudFunction] Error catastrófico en síntesis:", err);
      res.status(500).send("Error de servidor interno en síntesis de audio.");
    }
  });
});
