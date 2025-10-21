// 清空模板处理逻辑，保留基础导出
export type Message = { role: 'system' | 'user' | 'assistant'; content: string };

export function renderTemplate(content: any, context: any): Message[] {
  return [];
}