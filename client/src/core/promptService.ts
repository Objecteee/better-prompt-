// 清空业务逻辑，保留基础导出
export type TargetModel = 'Midjourney' | 'Stable Diffusion' | 'DALL·E 3';

export async function optimizeImagePrompt(originalPrompt: string): Promise<string> {
  return originalPrompt;
}

export async function getClarification(originalPrompt: string) {
  return { clarificationQuestions: [] };
}

export async function optimizeImagePromptV2(originalPrompt: string, targetModel: TargetModel) {
  return { m4: { adaptedPrompt: originalPrompt }, m5: { versions: [] }, m6: { editSuggestions: { subject: [], scene: [], style: [], technical: [] }, feedbackPrompts: [] } };
}