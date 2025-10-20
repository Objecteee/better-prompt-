import type { Message } from './templateProcessor';

export async function callOptimizerAPI(
  messages: Message[],
  opts?: { model?: string; llmParams?: Record<string, any> }
): Promise<string> {
  const model = opts?.model ?? 'gpt-3.5-turbo-0125';
  const llmParams = opts?.llmParams ?? { temperature: 0.7 };
  const rsp = await fetch('/api/optimize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages,
      model,
      llmParams
    })
  });
  const data = await rsp.json();
  if (!rsp.ok) {
    throw new Error(data?.error ? JSON.stringify(data.error) : 'Request failed');
  }
  return data.content || '';
}


