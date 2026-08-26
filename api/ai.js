const OpenAI = require('openai');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST only' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({
      error: 'OPENAI_API_KEY is not configured in Vercel Production.'
    });
  }

  try {
    const body = req.body || {};
    const action = body.action || 'analyze';
    const text = typeof body.text === 'string' ? body.text.trim() : '';
    const items = Array.isArray(body.items) ? body.items : [];

    if (!text && items.length === 0) {
      return res.status(400).json({ error: 'Maʼlumot yuboring.' });
    }

    const client = new OpenAI({ apiKey });
    let prompt;

    if (action === 'match') {
      prompt = `You are Findo AI, a lost-and-found matching assistant for Uzbekistan.
Compare the user's lost item description with the candidate listings.
Return ONLY valid JSON in exactly this shape:
{"matches":[{"id":"...","score":0,"reason":"..."}],"advice":"..."}
Score must be an integer from 0 to 100. Never invent facts.

User description:
${text}

Listings:
${JSON.stringify(items).slice(0, 12000)}`;
    } else {
      prompt = `You are Findo AI for a lost-and-found app in Uzbekistan.
Analyze the user's Uzbek description and prepare a precise listing.
Return ONLY valid JSON in exactly this shape:
{"title":"...","category":"...","type":"lost|found","location":"...","keywords":["..."],"description":"...","tips":["..."],"searchQuery":"..."}
Do not invent missing details. If a field is unknown, use an empty string or empty array.

User description:
${text}`;
    }

    const response = await client.responses.create({
      model: 'gpt-5.6-luna',
      input: prompt
    });

    const raw = (response.output_text || '').trim();
    if (!raw) {
      return res.status(502).json({ error: 'AI javob qaytarmadi.' });
    }

    try {
      return res.status(200).json(JSON.parse(raw));
    } catch {
      return res.status(200).json({ text: raw });
    }
  } catch (error) {
    console.error('Findo AI error:', error);

    const message = error?.message || '';
    if (error?.status === 401) {
      return res.status(401).json({ error: 'OpenAI API key noto‘g‘ri yoki faol emas.' });
    }
    if (error?.status === 429) {
      return res.status(429).json({ error: 'OpenAI API limiti yoki balans muammosi.' });
    }
    if (error?.status === 400) {
      return res.status(400).json({ error: `OpenAI so‘rovi rad etildi: ${message}` });
    }

    return res.status(500).json({
      error: message || 'Findo AI vaqtincha ishlamadi.'
    });
  }
};
