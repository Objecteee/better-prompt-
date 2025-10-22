// 模块3：表达逻辑优化的类型定义

import type { M2Output } from './module2';

export interface M3Input {
  m2Output: M2Output;
  targetModel?: 'Midjourney' | 'Stable Diffusion' | 'DALL·E 3';
  optimizationLevel?: 'basic' | 'enhanced' | 'advanced';
}

export interface M3Output {
  // 优化后的提示词
  optimizedPrompt: string;
  
  // 结构化信息
  structureInfo: {
    // 核心信息（主体+风格）
    coreInfo: string;
    // 场景环境
    sceneInfo: string;
    // 技术参数
    technicalInfo: string;
    // 负面提示
    negativeInfo: string;
  };
  
  // 优化标记
  optimizationMarks: {
    reordered: boolean;        // 是否重新排序
    grouped: boolean;          // 是否进行分组
    weighted: boolean;         // 是否添加权重
    simplified: boolean;       // 是否简化表达
  };
  
  // 优化策略
  optimizationStrategy: {
    level: 'basic' | 'enhanced' | 'advanced';
    reasoning: string;
  };
  
  // 原始信息（用于对比）
  originalStructure: {
    subjectAndFeatures: string;
    styleAndGenre: string;
    sceneAndEnvironment: string;
    perspectiveAndComposition: string;
    technicalParameters: string;
    negativePrompts: string;
  };
}

export interface M3Config {
  // API调用参数
  temperature: number;        // 0.1-0.3
  maxTokens: number;         // 500-1200
  model: string;             // 模型名称
  
  // 优化配置
  enableReordering: boolean;     // 是否启用重新排序
  enableGrouping: boolean;       // 是否启用分组
  enableWeighting: boolean;      // 是否启用权重标注
  enableSimplification: boolean; // 是否启用表达简化
  
  // 权重配置
  coreInfoWeight: number;        // 核心信息权重
  sceneInfoWeight: number;       // 场景信息权重
  technicalInfoWeight: number;   // 技术信息权重
}
