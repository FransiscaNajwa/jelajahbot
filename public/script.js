// ============================================================
// JelajahBot — Frontend Script (Vanilla JS)
// Menghubungkan UI dengan backend POST /api/chat
// ============================================================

const form      = document.getElementById('chat-form');
const input     = document.getElementById('user-input');
const chatBox   = document.getElementById('chat-box');
const sendBtn   = document.getElementById('send-btn');

// Menyimpan riwayat percakapan (multi-turn memory)
let conversationHistory = [];

// ============================================================
// Event: Submit form saat user kirim pesan
// ============================================================
form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  // Tampilkan pesan user di chat
  appendMessage('user', userMessage);
  input.value = '';
  sendBtn.disabled = true;

  // Tambah ke history percakapan
  conversationHistory.push({ role: 'user', text: userMessage });

  // Tampilkan indikator "sedang mengetik..."
  const thinkingEl = appendThinking();

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conversation: conversationHistory }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.statusText}`);
    }

    const data = await response.json();

    // Hapus indikator typing
    thinkingEl.remove();

    if (data && data.result) {
      // Tampilkan jawaban AI
      appendMessage('bot', data.result);
      // Simpan ke history
      conversationHistory.push({ role: 'model', text: data.result });
    } else {
      appendMessage('bot', 'Maaf, tidak ada respons yang diterima 😅');
    }

  } catch (error) {
    console.error('Error:', error);
    thinkingEl.remove();
    appendMessage('bot', 'Waduh, gagal konek ke server nih. Coba lagi ya! 🙏');
  } finally {
    sendBtn.disabled = false;
    input.focus();
  }
});

// ============================================================
// Fungsi: Tampilkan pesan di chat box
// ============================================================
function appendMessage(sender, text) {
  const row = document.createElement('div');
  row.classList.add('msg-row', sender);

  const formattedText = sender === 'bot' ? formatText(text) : escapeHtml(text);

  if (sender === 'bot') {
    row.innerHTML = `
      <div class="msg-avatar">🧭</div>
      <div class="bubble bot">${formattedText}</div>
    `;
  } else {
    row.innerHTML = `
      <div class="bubble user">${formattedText}</div>
    `;
  }

  chatBox.appendChild(row);
  chatBox.scrollTop = chatBox.scrollHeight;
  return row;
}

// ============================================================
// Fungsi: Tampilkan indikator "Bot sedang mengetik..."
// ============================================================
function appendThinking() {
  const row = document.createElement('div');
  row.classList.add('msg-row', 'bot');
  row.id = 'thinking-row';
  row.innerHTML = `
    <div class="msg-avatar">🧭</div>
    <div class="bubble bot thinking">
      <span></span><span></span><span></span>
    </div>
  `;
  chatBox.appendChild(row);
  chatBox.scrollTop = chatBox.scrollHeight;
  return row;
}

// ============================================================
// Fungsi: Kirim pesan dari chip suggestion
// ============================================================
function sendChip(text) {
  input.value = text;
  form.dispatchEvent(new Event('submit'));
  // Sembunyikan chips setelah dipakai
  document.getElementById('chips').style.display = 'none';
}

// ============================================================
// Helper: Format markdown sederhana
// ============================================================
function formatText(text) {
  return escapeHtml(text)
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>');
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}