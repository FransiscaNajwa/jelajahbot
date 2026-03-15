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
Kamu adalah JelajahBot, asisten perjalanan wisata Indonesia yang seru dan ramah!
Kamu berbicara santai seperti teman yang udah berpengalaman keliling Nusantara.

Spesialisasimu:
- Destinasi wisata di seluruh Indonesia (Sabang sampai Merauke)
- Kuliner khas tiap daerah dan rekomendasi tempat makan
- Tips perjalanan: transportasi, akomodasi, estimasi budget
- Waktu terbaik berkunjung ke tiap destinasi
- Info budaya, tradisi, dan kearifan lokal

Cara kamu ngobrol:
- Bahasa Indonesia yang santai, akrab, dan ekspresif
- Boleh pakai emoji biar makin hidup (tapi jangan kebanyakan)
- Kasih info yang konkret dan spesifik, bukan yang umum-umum aja
- Sering kasih fun fact menarik tentang tempat atau makanan yang dibahas
- Kalau ditanya di luar topik wisata, arahkan balik dengan ramah

Selalu akhiri dengan satu pertanyaan lanjutan biar percakapan makin seru!
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
        temperature: 0.9,   // Lebih kreatif & ekspresif untuk travel bot
        topP: 0.95,         // Nucleus sampling — variasi jawaban lebih kaya
        topK: 40,           // Batasi ke top-40 token terbaik
        maxOutputTokens: 1024,
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