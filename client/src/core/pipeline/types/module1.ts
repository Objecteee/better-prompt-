// 模块1：原始输入解析的类型定义

export interface M1Input {
  originalInput: string;
  userContext?: {
    previousPrompts?: string[];
    preferredStyle?: string;
    commonSubjects?: string[];
    historyFeedback?: string[];
  };
}

export interface M1Output {
  // 核心主体：用户想画什么
  coreSubject: string;
  
  // 核心需求：用户要什么风格/感觉
  coreIntent: string;
  
  // 错误修正：自动纠错的列表
  corrections: string[];
  
  // 补全询问：需要用户补充的问题（可选）
  clarificationQuestions?: string[];
  
  // 隐含需求：从输入中推断的隐含信息
  implicitNeeds?: {
    mood?: string;
    colorPalette?: string;
    composition?: string;
  };
  
  // 置信度：解析结果的可靠性
  confidence: number;
}

export interface M1Config {
  // API调用参数
  temperature: number;        // 0.1-0.3
  maxTokens: number;         // 200-300
  model: string;             // 模型名称
  
  // 功能开关
  enableAutoCorrection: boolean;
  enableClarification: boolean;
  maxClarificationQuestions: number;
  confidenceThreshold: number;
}