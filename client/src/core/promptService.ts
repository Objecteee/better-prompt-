import { renderTemplate, type Message } from './templateProcessor';
import { imageGeneralOptimizeTemplate } from './templates/imageGeneralOptimize';
import { callOptimizerAPI } from './llm';
import { runPipeline } from './pipeline/runPipeline';
import { buildM1, parseM1 } from './pipeline/modules';
import type { PipelineResult, TargetModel } from './pipeline/types/pipeline';
import { userPrefsStore } from './memory/userPrefs';

export async function optimizeImagePrompt(originalPrompt: string): Promise<string> {
  if (!originalPrompt.trim()) throw new Error('请输入原始提示词');
  const messages: Message[] = renderTemplate(imageGeneralOptimizeTemplate.content, {
    originalPrompt,
    text: originalPrompt
  } as any);
  const result = await callOptimizerAPI(messages);
  if (!result.trim()) throw new Error('模型返回为空');
  return result.trim();
}

// 先运行 M1，若存在澄清问题，返回解析结果给 UI 以便收集补充信息
export async function getClarification(originalPrompt: string) {
  if (!originalPrompt.trim()) throw new Error('请输入原始提示词');
  const m1Msgs = buildM1({ originalInput: originalPrompt });
  const raw = await callOptimizerAPI(m1Msgs, { llmParams: { temperature: 0.4 } });
  const m1 = parseM1(raw);
  return m1;
}

// 新流程入口：若提供 supplement，将其并入原始输入再跑全流程
export async function optimizeImagePromptV2(
  originalPrompt: string,
  targetModel: TargetModel,
  opts?: { supplement?: string }
): Promise<PipelineResult> {
  if (!originalPrompt.trim()) throw new Error('请输入原始提示词');
  const supplement = (opts?.supplement || '').trim();
  const combined = supplement ? `${originalPrompt}\n补充信息：${supplement}` : originalPrompt;
  const prefs = userPrefsStore.load();
  const result = await runPipeline(combined, targetModel, prefs);
  return result;
}


