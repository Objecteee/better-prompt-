// 清空LLM调用逻辑，保留基础导出
export type Message = { role: 'system' | 'user' | 'assistant'; content: string };

export async function callOptimizerAPI(messages: Message[]): Promise<string> {
  return '';
}