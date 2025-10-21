import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.AI302_API_KEY || 'sk-XiSKrNoQglsdLC5tr5XVcH6eZi6DNHodGKiYE26z1E4BCJhp';
const BASE_URL = process.env.AI302_BASE_URL || 'https://api.302.ai/v1';

if (!API_KEY) {
  console.warn('[WARN] Missing AI302_API_KEY. Set it in server/.env');
}

app.post('/api/optimize', async (req, res) => {
  try {
    const { messages, model = 'gpt-3.5-turbo-0125', llmParams = {} } = req.body || {};
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages is required' });
    }

    const rsp = await fetch(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        model,
        messages,
        ...llmParams
      })
    });

    const data = await rsp.json();
    if (!rsp.ok) {
      return res.status(rsp.status).json({ error: data });
    }

    const choice = data?.choices?.[0];
    const content = choice?.message?.content || '';
    const reasoning = choice?.message?.reasoning_content || '';
    res.json({ content, reasoning, raw: data });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: String(e) });
  }
});

const port = Number(process.env.PORT || 3001);
app.listen(port, () => console.log(`[server] listening on http://localhost:${port}`));


