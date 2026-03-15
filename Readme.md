# 🧭 JelajahBot — Asisten Wisata Indonesia

Chatbot berbasis AI untuk membantu pengguna merencanakan perjalanan wisata di Indonesia. Dibangun menggunakan **Google Gemini AI**, **Node.js**, **Express**, dan **Vanilla JavaScript**.

---

## 🎯 Use Case

**Travel & Wisata Assistant** — JelajahBot membantu pengguna dengan:
- Rekomendasi destinasi wisata di seluruh Indonesia
- Info kuliner khas tiap daerah
- Tips perjalanan & estimasi budget
- Itinerary perjalanan custom
- Hidden gems yang jarang diketahui

---

## ⚙️ Konfigurasi Parameter Gemini

| Parameter | Nilai | Alasan |
|---|---|---|
| `temperature` | `0.9` | Respons lebih kreatif & ekspresif — cocok untuk travel bot |
| `topP` | `0.95` | Variasi jawaban lebih kaya dengan nucleus sampling |
| `topK` | `40` | Batasi ke 40 token terbaik untuk kualitas output |
| `maxOutputTokens` | `1024` | Cukup untuk jawaban detail tentang destinasi wisata |

---

## 🏗️ Arsitektur Proyek

```
jelajah-chatbot/
├── public/
│   ├── index.html    ← UI chatbot (frontend)
│   ├── script.js     ← Logika frontend + fetch ke API
│   └── style.css     ← Styling antarmuka
├── .env              ← API Key (tidak di-push ke GitHub)
├── .env.example      ← Template konfigurasi
├── .gitignore
├── index.js          ← Backend Node.js + Express + Gemini
├── package.json
└── README.md
```

**Alur kerja:**
```
User → Frontend (Browser) → POST /api/chat → Backend (Express) → Gemini AI → Respons
```

---

## 🚀 Cara Menjalankan

### 1. Clone repository
```bash
git clone https://github.com/username/jelajah-chatbot.git
cd jelajah-chatbot
```

### 2. Install dependencies
```bash
npm install
```

### 3. Konfigurasi API Key
Buat file `.env` dari template:
```bash
cp .env.example .env
```
Isi dengan Gemini API Key kamu (dapatkan di [Google AI Studio](https://aistudio.google.com)):
```
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Jalankan aplikasi
```bash
node index.js
```

### 5. Buka di browser
```
http://localhost:3000
```

---

## ✨ Fitur

- 💬 **Multi-turn conversation** — bot ingat konteks percakapan sebelumnya
- 🎯 **System Instruction** — persona JelajahBot yang santai & ramah
- ⚡ **Typing indicator** — animasi "sedang mengetik" saat bot memproses
- 🏷️ **Suggestion chips** — shortcut topik populer untuk onboarding cepat
- 📱 **Responsive design** — tampilan optimal di desktop dan mobile

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **AI Model:** Google Gemini 2.5 Flash (`@google/genai`)
- **Frontend:** Vanilla JavaScript, HTML5, CSS3
- **API:** REST API (`POST /api/chat`)