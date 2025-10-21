// 模块2：关键信息补全的类型定义

import type { M1Output } from './module1';

export interface M2Input {
  m1Output: M1Output;
  preference?: {
    preferredStyle?: string;
    commonSubjects?: string[];
    preferredScenes?: string[];
    preferredResolution?: string;
    historyFeedback?: string[];
  };
  targetModel?: 'Midjourney' | 'Stable Diffusion' | 'DALL·E 3';
}

export interface M2Output {
  // 6大维度补全结果
  subjectAndFeatures: {
    coreSubject: string;
    featureDetails: string;
    actionState: string;
  };
  
  styleAndGenre: {
    artStyle: string;
    styleParameters: string;
    referenceSource?: string;
  };
  
  sceneAndEnvironment: {
    coreScene: string;
    environmentElements: string;
    lightAtmosphere: string;
  };
  
  perspectiveAndComposition: {
    shootingPerspective: string;
    compositionMethod: string;
    subjectRatio: string;
  };
  
  technicalParameters: {
    resolution: string;
    renderQuality: string;
    detailIntensity: string;
  };
  
  negativePrompts: {
    generalNegative: string[];
    modelSpecificNegative: string[];
  };
  
  // 补全标记信息
  completionMarks: {
    [key: string]: {
      isOriginal: boolean;
      isEnhanced: boolean;
      isAdded: boolean;
      source: 'user_input' | 'm1_output' | 'preference' | 'common_sense' | 'default';
    };
  };
  
  // 补全策略信息
  completionStrategy: {
    confidenceLevel: 'high' | 'medium' | 'low';
    strategy: 'active_expansion' | 'conservative_focus' | 'minimal_safe';
    reasoning: string;
  };
  
  // 最终补全结果（自然语言描述）
  finalResult: string;
}

export interface M2Config {
  // API调用参数
  temperature: number;        // 0.3-0.5
  maxTokens: number;         // 400-600
  model: string;             // 模型名称
  
  // 补全策略配置
  enableActiveExpansion: boolean;    // 是否启用主动扩展
  enableConservativeFocus: boolean;  // 是否启用保守聚焦
  enableMinimalSafe: boolean;        // 是否启用极简安全
  
  // 置信度阈值
  highConfidenceThreshold: number;   // 80
  mediumConfidenceThreshold: number; // 50
}
