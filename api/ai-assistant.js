const OpenAI = require('openai');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'POST only' });
  }

  try {
    const key = process.env.OPENAI_API_KEY;
    if (!key) {
      return res.status(503).json({
        error: 'AI hozir sozlanmagan. Vercel Environment Variables ichida OPENAI_API_KEY ni qo‘shing.'
      });
    }

    const body = req.body && typeof req.body === 'object' ? req.body : {};
    const messages = Array.isArray(body.messages) ? body.messages.slice(-12) : [];

    const clean = messages
      .filter((m) =>
        m &&
        (m.role === 'user' || m.role === 'assistant') &&
        typeof m.content === 'string'
      )
      .map((m) => ({
        role: m.role,
        content: m.content.trim().slice(0, 3000)
      }))
      .filter((m) => m.content.length > 0);

    if (!clean.length) {
      return res.status(400).json({ error: 'Xabar yuboring.' });
    }

    const ai = new OpenAI({ apiKey: key });

    const system = `Sen Findo platformasining AI Yordamchisisan.

Asosiy vazifa:
- O‘zbek tilida tabiiy, qisqa va foydali javob ber.
- Findo yo‘qolgan va topilgan buyumlarni topishga yordam beradi.
- Foydalanuvchi yo‘qolgan buyumini topmoqchi bo‘lsa, buyum turi, rang/model, joy, taxminiy vaqt va ajratuvchi belgilarni so‘ra.
- Foydalanuvchini AI Qidiruvdan foydalanishga yo‘naltir.
- E’lon berish, qidiruv qilish, profil, QR va Findo funksiyalarini tushuntir.
- Mavjud e’lonlarni o‘zing to‘qib chiqma. Sen faqat foydalanuvchi bergan ma’lumotga tayangan holda gapir.
- Shaxsiy parol, karta raqami yoki boshqa maxfiy moliyaviy ma’lumotlarni so‘rama.
- Javoblar insoniy va ishonchli bo‘lsin.
- Javobni markdown bilan yozish mumkin, lekin ortiqcha uzun qilma.`;

    const response = await ai.responses.create({
      model: process.env.OPENAI_ASSISTANT_MODEL || 'gpt-5',
      input: [
        { role: 'system', content: system },
        ...clean
      ],
      max_output_tokens: 700
    });

    const reply = response.output_text?.trim();

    return res.status(200).json({
      reply: reply || 'Sizga yordam berishga tayyorman.'
    });
  } catch (error) {
    console.error('Findo AI assistant error:', error);

    const status = error?.status === 429 ? 429 : 500;
    return res.status(status).json({
      error:
        status === 429
          ? 'AI hozir juda ko‘p so‘rov olayapti. Bir ozdan keyin qayta urinib ko‘ring.'
          : 'AI yordamchi vaqtincha ishlamayapti. Keyinroq qayta urinib ko‘ring.'
    });
  }
};
