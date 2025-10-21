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

app.post('/api/optimize', async (_req, res) => {
  // 保留路由和配置，但禁用真实外部调用
  return res.status(501).json({ error: 'LLM proxy disabled' });
});

const port = Number(process.env.PORT || 3001);
app.listen(port, () => console.log(`[server] listening on http://localhost:${port}`));


