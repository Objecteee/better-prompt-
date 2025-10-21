// 清空LLM调用逻辑，保留基础导出
export type Message = { role: 'system' | 'user' | 'assistant'; content: string };

export async function callOptimizerAPI(
  messages: Message[], 
  opts?: { model?: string; llmParams?: Record<string, any> }
): Promise<string> {
  try {
    const response = await fetch('/api/optimize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages,
        model: opts?.model || 'gpt-3.5-turbo-0125',
        llmParams: opts?.llmParams || {}
      })
    });
    
    if (!response.ok) {
      throw new Error(`API调用失败: ${response.status}`);
    }
    
    const data = await response.json();
    return data.content || '';
  } catch (error) {
    console.error('API调用错误:', error);
    throw error;
  }
}