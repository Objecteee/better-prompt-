export type Clarification = {
  questions: string[];
};

export type M1Output = {
  coreSubject: string;
  coreIntent: string;
  corrections: string[];
  clarificationQuestions?: string[];
};

export type M2Output = {
  subjectDetails: { features: string[]; action?: string };
  scene: { location: string; lighting?: string; cameraView?: string };
  style: { name: string; details?: string[] };
  technical: { quality?: string; resolution?: string; extras?: string[] };
};

export type M3Output = {
  structuredPrompt: string;
  negativePrompt?: string;
};

export type M4Output = {
  adaptedPrompt: string;
  negativePrompt?: string;
};

export type VersionItem = {
  kind: '贴合版' | '风格强化版' | '场景扩展版';
  prompt: string;
  negativePrompt?: string;
};

export type M5Output = {
  versions: VersionItem[];
};

export type M6Output = {
  editSuggestions: { subject: string[]; scene: string[]; style: string[]; technical: string[] };
  feedbackPrompts: string[];
};

export type TargetModel = 'Midjourney' | 'Stable Diffusion' | 'DALL·E 3';

export type UserPrefs = {
  preferredStyle?: string;
  preferredCameraView?: string;
  negativesForSD?: string[];
};

export type PipelineResult = {
  m1: M1Output;
  m2: M2Output;
  m3: M3Output;
  m4: M4Output;
  m5: M5Output;
  m6: M6Output;
};


