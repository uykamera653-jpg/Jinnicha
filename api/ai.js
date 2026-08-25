const OpenAI = require('openai');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  if (!process.env.OPENAI_API_KEY) {
    return res.status(503).json({ error: 'OPENAI_API_KEY is not configured in Vercel.' });
  }

  try {
    const { action = 'analyze', text = '', items = [] } = req.body || {};
    if (!text && !items.length) return res.status(400).json({ error: 'Maʼlumot yuboring.' });

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    let prompt;

    if (action === 'match') {
      prompt = `You are Findo AI, a lost-and-found matching assistant for Uzbekistan.\nCompare the user's lost item description with the candidate found/lost listings below. Return ONLY valid JSON: {"matches":[{"id":"...","score":0-100,"reason":"..."}],"advice":"..."}. Never invent facts. User description: ${text}\nListings: ${JSON.stringify(items).slice(0, 12000)}`;
    } else {
      prompt = `You are Findo AI. Help a user create a precise lost-and-found listing. Read this Uzbek description and return ONLY valid JSON: {"title":"...","category":"...","type":"lost|found","location":"...","keywords":["..."],"description":"...","tips":["..."],"searchQuery":"..."}. Do not invent missing details. Description: ${text}`;
    }

    const response = await client.responses.create({ model: 'gpt-5.6-luna', input: prompt });
    const raw = response.output_text || '{}';
    let data;
    try { data = JSON.parse(raw); } catch { data = { text: raw }; }
    return res.status(200).json(data);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Findo AI vaqtincha ishlamadi.' });
  }
};
