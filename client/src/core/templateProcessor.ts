export type Message = { role: 'system' | 'user' | 'assistant'; content: string };

export interface TemplateContext {
  originalPrompt?: string;
}

const simpleMustache = (tpl: string, ctx: Record<string, string | undefined>) =>
  tpl.replace(/\{\{\s*([^}]+)\s*\}\}/g, (_, k) => (ctx[k.trim()] ?? ''));

export function renderTemplate(
  content: string | Message[],
  context: TemplateContext
): Message[] {
  if (typeof content === 'string') {
    const system = simpleMustache(content, context as any);
    const messages: Message[] = [{ role: 'system', content: system }];
    if (context.originalPrompt) {
      messages.push({ role: 'user', content: context.originalPrompt });
    }
    return messages;
  }
  return content.map(m => ({
    role: m.role,
    content: simpleMustache(m.content, context as any)
  }));
}


