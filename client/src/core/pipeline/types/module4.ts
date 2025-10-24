// 模块4：模型适配调整的类型定义

import type { M3Output } from './module3';

export type SupportedModel = 
  | '腾讯混元图像 3.0'
  | '字节跳动 Seedream 4.0'
  | '百度文心一格'
  | '阿里通义万相'
  | 'Stable Diffusion 3'
  | 'DALL·E 3'
  | 'Midjourney V6';

export interface M4Input {
  m3Output: M3Output;
  targetModel: SupportedModel;
  userPreferences?: {
    // 用户对特定模型的偏好设置
    preferredStyle?: string;
    qualityLevel?: 'standard' | 'high' | 'ultra';
    aspectRatio?: string;
    customParameters?: Record<string, any>;
  };
}

export interface M4Output {
  // 模型适配后的提示词
  adaptedPrompt: string;
  
  // 模型特定参数
  modelParameters: {
    // 通用参数
    aspectRatio?: string;
    quality?: string;
    style?: string;
    
    // 模型特定参数
    [key: string]: any;
  };
  
  // 适配标记
  adaptationMarks: {
    detailedScene: boolean;        // 是否添加详细场景构建
    styleSpecified: boolean;       // 是否明确风格指定
    elementsCombined: boolean;     // 是否精准元素组合
    fontDesigned: boolean;         // 是否具体字体设计
    naturalLanguage: boolean;      // 是否使用自然语言描述
    applicationScene: boolean;     // 是否明确应用场景
    textRendering: boolean;        // 是否准确文本渲染
    keywordArranged: boolean;      // 是否排列关键词
    universalArchitecture: boolean; // 是否使用万能架构
    preciseStructure: boolean;     // 是否精确结构
    layeredDescription: boolean;   // 是否分层描述
    multiDimensional: boolean;     // 是否多维度描述
  };
  
  // 适配策略
  adaptationStrategy: {
    model: SupportedModel;
    approach: string;
    reasoning: string;
  };
  
  // 原始信息（用于对比）
  originalPrompt: string;
  originalStructure: M3Output['structureInfo'];
  
  // 模型特定优化建议
  optimizationSuggestions: {
    strengths: string[];           // 该模型的优势
    improvements: string[];        // 改进建议
    bestPractices: string[];       // 最佳实践
  };
}

export interface M4Config {
  // API调用参数
  temperature: number;        // 0.2-0.4
  maxTokens: number;         // 600-1200
  model: string;             // 模型名称
  
  // 模型适配配置
  enableDetailedScene: boolean;      // 是否启用详细场景构建
  enableStyleSpecification: boolean; // 是否启用明确风格指定
  enableElementCombination: boolean; // 是否启用精准元素组合
  enableFontDesign: boolean;         // 是否启用具体字体设计
  enableNaturalLanguage: boolean;    // 是否启用自然语言描述
  enableApplicationScene: boolean;   // 是否启用明确应用场景
  enableTextRendering: boolean;      // 是否启用准确文本渲染
  enableKeywordArrangement: boolean; // 是否启用排列关键词
  enableUniversalArchitecture: boolean; // 是否启用万能架构
  enablePreciseStructure: boolean;   // 是否启用精确结构
  enableLayeredDescription: boolean; // 是否启用分层描述
  enableMultiDimensional: boolean;   // 是否启用多维度描述
}

// 模型特性配置
export interface ModelCharacteristics {
  [key: string]: {
    name: string;
    description: string;
    strengths: string[];
    requirements: string[];
    promptStructure: string;
    examples: {
      input: string;
      output: string;
    }[];
  };
}
