import type { Message } from '../templateProcessor';
import type { M1Output, M2Output, M3Output, M4Output, M5Output, M6Output, TargetModel, UserPrefs } from './types/pipeline';

function forceJsonOnlyReminder(example: string) {
  return [
    '仅输出 JSON，且必须是合法 JSON。不要添加任何解释性文字或 Markdown。',
    `输出示例：${example}`
  ].join('\n');
}

function safeParse<T>(raw: string): T {
  const firstBrace = raw.indexOf('{');
  const lastBrace = raw.lastIndexOf('}');
  const jsonStr = firstBrace >= 0 && lastBrace > firstBrace ? raw.slice(firstBrace, lastBrace + 1) : raw;
  return JSON.parse(jsonStr) as T;
}

// M1
export function buildM1(input: { originalInput: string }): Message[] {
  const system = [
    '你是图像提示词的输入解析助手：',
    '1) 提取核心主体与核心需求；2) 纠错与消歧；3) 若信息不足给 2–3 个澄清问题；',
    forceJsonOnlyReminder('{"coreSubject":"...","coreIntent":"...","corrections":["..."],"clarificationQuestions":["..."]}')
  ].join('\n');
  const user = [
    `用户当前输入的绘画提示词：${input.originalInput}`,
    '如信息充分，可省略 clarificationQuestions 字段。'
  ].join('\n');
  return [
    { role: 'system', content: system },
    { role: 'user', content: user }
  ];
}
export function parseM1(raw: string): M1Output { return safeParse<M1Output>(raw); }

// M2
export function buildM2(input: { m1: M1Output; prefs?: UserPrefs }): Message[] {
  const { m1, prefs } = input;
  const system = [
    '你是信息补全助手：按主体细节、场景环境、风格、技术参数四个维度补全；不偏离用户意图；分维度 JSON 输出。',
    prefs?.preferredStyle ? `偏好风格：${prefs.preferredStyle}` : '',
    prefs?.preferredCameraView ? `偏好视角：${prefs.preferredCameraView}` : '',
    forceJsonOnlyReminder('{"subjectDetails":{"features":["..."],"action":"..."},"scene":{"location":"...","lighting":"...","cameraView":"..."},"style":{"name":"...","details":["..."]},"technical":{"quality":"...","resolution":"...","extras":["..."]}}')
  ].filter(Boolean).join('\n');
  const user = `已解析的核心信息：${JSON.stringify(m1)}`;
  return [
    { role: 'system', content: system },
    { role: 'user', content: user }
  ];
}
export function parseM2(raw: string): M2Output { return safeParse<M2Output>(raw); }

// M3
export function buildM3(input: { m2: M2Output }): Message[] {
  const system = [
    '你是结构优化助手：优先级（风格+主体→细节→场景→技术→负面），同类聚合。',
    '严格要求：structuredPrompt 必须为纯提示词文本，不得包含建议/说明/示例/前后缀；避免“你可以/建议/在这个基础上”等措辞；优先使用英文短语，逗号分隔；长度≤200字符；如有 negativePrompt，使用英文逗号分隔。',
    forceJsonOnlyReminder('{"structuredPrompt":"<prompt-only>","negativePrompt":"<optional-negative>"}')
  ].join('\n');
  const user = `当前已补全的各维度信息：${JSON.stringify(input.m2)}`;
  return [
    { role: 'system', content: system },
    { role: 'user', content: user }
  ];
}
export function parseM3(raw: string): M3Output { return safeParse<M3Output>(raw); }

// M4
export function buildM4(input: { m3: M3Output; targetModel: TargetModel }): Message[] {
  const commonRules = [
    '输出必须为 JSON；字段仅包含 adaptedPrompt、negativePrompt（可选）。',
    'adaptedPrompt 必须是最终可直接用于目标模型的提示词文本，不得包含任何解释或建议。'
  ].join('\n');

  const modelSpecific = input.targetModel === 'Midjourney'
    ? '目标模型：Midjourney。使用英文、逗号分隔的风格与要素短语，可加入摄影/艺术术语；不返回 negativePrompt 字段。禁止使用祈使句或建议性词汇（如 Add/Use/Consider）。'
    : input.targetModel === 'Stable Diffusion'
    ? [
        '目标模型：Stable Diffusion。',
        'adaptedPrompt 规则：',
        '- 使用英文、以名词/形容词短语为主的逗号分隔标签（tags），不使用祈使句或完整句子（禁止 Add/Use/Consider/Please 等）。',
        '- 先写主体与风格，再写细节与场景，最后写光线/相机/质量词，如: cinematic lighting, 4k, ultra-detailed。',
        '- 只使用逗号分隔，不要句号或多余连词；不要冠词或时态。',
        'negativePrompt 规则：必须提供，使用英文逗号分隔，一般包含 blurry, low quality, jpeg artifacts, deformed hands, extra fingers, text, watermark, signature 等。'
      ].join('\n')
    : '目标模型：DALL·E 3。adaptedPrompt 为简洁连贯的英文描述性短句/短段，弱化技术参数，不得包含建议/解释；不返回 negativePrompt。';

  const system = [
    '你是模型适配助手：针对不同模型输出最合适的提示词格式。',
    modelSpecific,
    commonRules,
    '禁止出现“你可以/建议/在这个基础上”等措辞。',
    forceJsonOnlyReminder('{"adaptedPrompt":"<prompt-only>","negativePrompt":"<optional-negative>"}')
  ].join('\n');
  const user = `用户选择的 AI 绘画模型：${input.targetModel}，已结构化的提示词：${JSON.stringify(input.m3)}`;
  return [
    { role: 'system', content: system },
    { role: 'user', content: user }
  ];
}
export function parseM4(raw: string): M4Output { return safeParse<M4Output>(raw); }

// M5
export function buildM5(input: { m4: M4Output; targetModel: TargetModel }): Message[] {
  const system = [
    '你是多版本生成助手：生成三类版本——贴合版、风格强化版、场景扩展版，严格为 3 个。',
    '每个版本的 prompt 必须是可直接用于目标模型的提示词文本；不得包含解释/建议/前后缀描述；使用英文为主；如目标模型为 Stable Diffusion，若存在 negativePrompt 字段则同样为英文逗号分隔。',
    forceJsonOnlyReminder('{"versions":[{"kind":"贴合版","prompt":"<prompt-only>","negativePrompt":"<optional-negative>"}]}')
  ].join('\n');
  const user = `已适配 ${input.targetModel} 的提示词：${JSON.stringify(input.m4)}，请生成 3 个差异化版本。`;
  return [
    { role: 'system', content: system },
    { role: 'user', content: user }
  ];
}
export function parseM5(raw: string): M5Output { return safeParse<M5Output>(raw); }

// M6
export function buildM6(input: { m5: M5Output }): Message[] {
  const system = [
    '你是反馈引导助手：输出维度拆分的编辑建议与反馈话术列表。',
    forceJsonOnlyReminder('{"editSuggestions":{"subject":["..."],"scene":["..."],"style":["..."],"technical":["..."]},"feedbackPrompts":["..."]}')
  ].join('\n');
  const user = `当前生成的 3 个优化版本：${JSON.stringify(input.m5)}，请生成编辑建议与反馈收集话术。`;
  return [
    { role: 'system', content: system },
    { role: 'user', content: user }
  ];
}
export function parseM6(raw: string): M6Output { return safeParse<M6Output>(raw); }


