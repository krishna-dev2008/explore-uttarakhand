import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { buildLocalRAGResponse } from './src/utils/ragEngine.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Server-side RAG + Gemini AI endpoint for the AI Yatri Assistant
  app.post('/api/yatri-rag', async (req, res) => {
    const { query, history = [], userRole = 'traveler' } = req.body || {};

    if (!query || typeof query !== 'string') {
      res.status(400).json({ error: 'Query is required' });
      return;
    }

    // 1. Always run our deterministic Uttarakhand RAG retrieval first
    const ragContext = buildLocalRAGResponse(query);

    // 2. If GEMINI_API_KEY is available and valid, enrich the response with Gemini 3.8 Flash grounded on the RAG telemetry
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim().length > 10) {
      try {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });

        const recentTurns = Array.isArray(history)
          ? history
              .slice(-4)
              .map((m: { sender: string; text: string }) => `${m.sender.toUpperCase()}: ${m.text}`)
              .join('\n')
          : '';

        const systemInstruction = `You are the "AI Yatri Assistant", the official Retrieval-Augmented Generation (RAG) mountain concierge for the Explore Uttarakhand portal.
Your user is currently browsing with role: ${userRole}.
Always ground your answer strictly in the retrieved Uttarakhand Telemetry & Gazetteer Context provided below.
- If the user asks about weather in ANY town, village, or valley in Uttarakhand (e.g., Munsiyari, Chopta, Nainital, Pithoragarh, Lohaghat, Chaukori, Harshil, or any other settlement), cite the exact elevation, temperature (°C), wind speed, road status, and packing advice from the RAG context.
- Keep your response concise (110 to 160 words), structured with clean markdown bullet points, warm editorial Himalayan tone, and practical eco-guidelines.
- Never claim you only know 3-4 places; you have full dynamic coverage across all 13 districts of Garhwal and Kumaon.`;

        const response = await Promise.race([
          ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: `RETRIEVED UTTARAKHAND RAG TELEMETRY:\n${ragContext.retrievedContext}\n\nRECENT CHAT HISTORY:\n${recentTurns}\n\nUSER QUERY: ${query}`,
            config: {
              systemInstruction,
            },
          }),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Gemini RAG timeout fallback')), 1800)
          ),
        ]);

        if (response.text) {
          res.json({
            reply: response.text,
            telemetry: ragContext.telemetry,
            intentType: ragContext.intentType,
            source: 'gemini-rag',
          });
          return;
        }
      } catch (_err) {
        // Gracefully fall back to the deterministic RAG response if API key is unconfigured or network times out
      }
    }

    res.json({
      reply: ragContext.formattedResponse,
      telemetry: ragContext.telemetry,
      intentType: ragContext.intentType,
      source: 'local-rag-engine',
    });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Explore Uttarakhand server listening on http://localhost:${PORT}`);
  });
}

startServer();
