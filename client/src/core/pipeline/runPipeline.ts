import { callOptimizerAPI } from '../llm';
import { buildM1, parseM1, buildM2, parseM2, buildM3, parseM3, buildM4, parseM4, buildM5, parseM5, buildM6, parseM6 } from './modules';
import type { PipelineResult, TargetModel, UserPrefs } from './types/pipeline';

async function invoke(messages: any[], temperature: number) {
  const raw = await callOptimizerAPI(messages as any, { llmParams: { temperature } });
  return raw;
}

export async function runPipeline(originalInput: string, targetModel: TargetModel, prefs?: UserPrefs): Promise<PipelineResult> {
  // M1
  const m1Raw = await invoke(buildM1({ originalInput }), 0.4);
  const m1 = parseM1(m1Raw);

  // M2
  const m2Raw = await invoke(buildM2({ m1, prefs }), 0.4);
  const m2 = parseM2(m2Raw);

  // M3
  const m3Raw = await invoke(buildM3({ m2 }), 0.4);
  const m3 = parseM3(m3Raw);

  // M4
  const m4Raw = await invoke(buildM4({ m3, targetModel }), 0.4);
  const m4 = parseM4(m4Raw);

  // M5
  const m5Raw = await invoke(buildM5({ m4, targetModel }), 0.7);
  const m5 = parseM5(m5Raw);

  // M6
  const m6Raw = await invoke(buildM6({ m5 }), 0.4);
  const m6 = parseM6(m6Raw);

  return { m1, m2, m3, m4, m5, m6 };
}


