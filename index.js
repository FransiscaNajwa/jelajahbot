import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

// Setup __dirname untuk ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Inisialisasi Gemini AI
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const GEMINI_MODEL = 'gemini-2.5-flash';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ============================================================
// System Instruction - Persona Chatbot
// ============================================================
const SYSTEM_INSTRUCTION = `
Kamu adalah JelajahBot, asisten wisata Indonesia yang ramah dan santai.
Bicara seperti teman yang berpengalaman keliling Nusantara.

Spesialisasi: destinasi wisata, kuliner daerah, tips perjalanan, budget, budaya lokal.

Gaya bicara: santai, pakai emoji secukupnya, konkret dan spesifik.

ATURAN KETAT - WAJIB DIIKUTI:
- Jawab MAKSIMAL 80 kata
- Berikan HANYA 1 rekomendasi per jawaban
- Langsung ke poin, tanpa pembuka panjang
- Akhiri dengan 1 pertanyaan singkat
- Jika ditanya di luar wisata, arahkan balik dengan ramah
`;

// ============================================================
// POST /api/chat — Endpoint Utama Chatbot
// ============================================================
app.post('/api/chat', async (req, res) => {
  const { conversation } = req.body;

  try {
    // Validasi input
    if (!Array.isArray(conversation)) {
      throw new Error('Format conversation harus berupa array!');
    }

    // Mapping conversation ke format Gemini
    const contents = conversation.map(({ role, text }) => ({
      role,
      parts: [{ text }],
    }));

    // Generate response dari Gemini AI
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents,
      config: {
        // Parameter Konfigurasi Gemini
        temperature: 0.7,   
        topP: 0.95,         // Nucleus sampling — variasi jawaban lebih kaya
        topK: 40,           // Batasi ke top-40 token terbaik
        maxOutputTokens: 8192,
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    res.status(200).json({ result: response.text });

  } catch (error) {
    console.error('Error dari Gemini API:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`🧭 JelajahBot running on http://localhost:${PORT}`);
});