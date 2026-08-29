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

Vazifa:
- Foydalanuvchining HAR BIR savoliga uning aynan bergan savoliga mos javob ber. Bir xil tayyor javobni takrorlama.
- O‘zbek tilida tabiiy, qisqa va foydali yoz. Foydalanuvchi ruscha yoki inglizcha yozsa, o‘sha tilda javob ber.
- Findo yo‘qolgan va topilgan buyumlarni topishga yordam beradi.
- Yo‘qolgan buyum haqida gap ketsa, buyum turi, rang/model, joy, taxminiy vaqt va ajratuvchi belgilarni aniqlashga yordam ber.
- E’lon berish, AI qidiruv, profil, QR va Findo funksiyalarini tushuntir.
- Mavjud e’lonlar yoki foydalanuvchi ma’lumotlarini ko‘rmasang, ularni to‘qib chiqma va topilgandek ko‘rsatma.
- Oddiy suhbat, salomlashish va Findo’ga aloqasi bo‘lmagan umumiy savollarga ham savolning mazmuniga mos javob ber.
- Javob berish uchun yetarli ma’lumot bo‘lmasa, bitta-ikkita aniq aniqlashtiruvchi savol ber.
- Hech qachon “Sizga yordam berishga tayyorman” kabi mazmunsiz bir xil fallback javobni qaytarmaslikka harakat qil.
- Shaxsiy parol, karta raqami yoki boshqa maxfiy moliyaviy ma’lumotlarni so‘rama.
- Javobni markdown bilan yozish mumkin, lekin ortiqcha uzun qilma.`;

    const response = await ai.responses.create({
      model: process.env.OPENAI_ASSISTANT_MODEL || 'gpt-5',
      input: [
        { role: 'system', content: system },
        ...clean
      ],
      max_output_tokens: 700
    });

    // SDK'dagi output_text bo‘sh qoladigan holatlarda ham modelning
    // message/output bloklaridan matnni ishonchli chiqaramiz.
    let reply = typeof response.output_text === 'string'
      ? response.output_text.trim()
      : '';

    if (!reply && Array.isArray(response.output)) {
      const parts = [];
      for (const item of response.output) {
        if (item?.type !== 'message' || !Array.isArray(item.content)) continue;
        for (const part of item.content) {
          if (part?.type === 'output_text' && typeof part.text === 'string') {
            parts.push(part.text);
          }
        }
      }
      reply = parts.join('\n').trim();
    }

    if (!reply) {
      console.error('Findo AI returned no text', JSON.stringify({
        id: response.id,
        status: response.status,
        outputTypes: Array.isArray(response.output)
          ? response.output.map((x) => x?.type)
          : []
      }));
      return res.status(502).json({
        error: 'AI javob yaratmadi. Iltimos, savolni qayta yuboring.'
      });
    }

    return res.status(200).json({ reply });
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
