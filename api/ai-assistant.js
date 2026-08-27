const OpenAI = require('openai');

module.exports = async function (req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  try {
    const key = process.env.OPENAI_API_KEY;
    if (!key) return res.status(503).json({ error: 'OPENAI_API_KEY sozlanmagan.' });

    const body = req.body || {};
    const messages = Array.isArray(body.messages) ? body.messages.slice(-12) : [];
    const clean = messages
      .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
      .map(m => ({ role: m.role, content: m.content.slice(0, 3000) }));

    if (!clean.length) return res.status(400).json({ error: 'Xabar yuboring.' });

    const ai = new OpenAI({ apiKey: key });
    const system = `Sen Findo platformasining AI Yordamchisisan. O'zbek tilida tabiiy, qisqa va foydali javob ber. Findo yo'qolgan va topilgan buyumlarni topishga yordam beradi. AI Qidiruv buyumning rasm/matn/ovoz tavsifidan mos e'lonlarni qidiradi; AI Yordamchi esa foydalanuvchiga maslahat beradi, e'lon berishni tushuntiradi, qidiruvga tayyorlaydi va Findo funksiyalarini tushuntiradi. Foydalanuvchi buyumini topmoqchi bo'lsa, kerakli ma'lumotlarni (nima, rang/model, joy, vaqt, ajratuvchi belgi) so'rab, keyin /api/ai-vision orqali qidirishni tavsiya qil. Hech qachon mavjud e'lonlarni o'zing to'qib chiqma. Shaxsiy yoki moliyaviy ma'lumotlarni so'rama. Javoblarni insoniy va ishonchli qil.`;
    const r = await ai.responses.create({
      model: 'gpt-5.6-luna',
      instructions: system,
      input: clean
    });
    res.status(200).json({ reply: (r.output_text || '').trim() || 'Sizga yordam berishga tayyorman.' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message || 'AI yordamchi xatosi' });
  }
};
