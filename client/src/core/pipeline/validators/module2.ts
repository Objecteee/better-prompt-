// 模块2的验证器

import type { M2Output, M2Input } from '../types/module2';

export function validateM2Output(output: M2Output): boolean {
  try {
    // 验证6大维度
    if (!output.subjectAndFeatures || typeof output.subjectAndFeatures !== 'object') {
      return false;
    }
    
    if (!output.styleAndGenre || typeof output.styleAndGenre !== 'object') {
      return false;
    }
    
    if (!output.sceneAndEnvironment || typeof output.sceneAndEnvironment !== 'object') {
      return false;
    }
    
    if (!output.perspectiveAndComposition || typeof output.perspectiveAndComposition !== 'object') {
      return false;
    }
    
    if (!output.technicalParameters || typeof output.technicalParameters !== 'object') {
      return false;
    }
    
    if (!output.negativePrompts || typeof output.negativePrompts !== 'object') {
      return false;
    }
    
    // 验证主体与特征
    const { coreSubject, featureDetails, actionState } = output.subjectAndFeatures;
    if (typeof coreSubject !== 'string' || coreSubject.length === 0) {
      return false;
    }
    if (typeof featureDetails !== 'string') {
      return false;
    }
    if (typeof actionState !== 'string') {
      return false;
    }
    
    // 验证风格与流派
    const { artStyle, styleParameters, referenceSource } = output.styleAndGenre;
    if (typeof artStyle !== 'string' || artStyle.length === 0) {
      return false;
    }
    if (typeof styleParameters !== 'string') {
      return false;
    }
    if (referenceSource !== undefined && typeof referenceSource !== 'string') {
      return false;
    }
    
    // 验证场景与环境
    const { coreScene, environmentElements, lightAtmosphere } = output.sceneAndEnvironment;
    if (typeof coreScene !== 'string') {
      return false;
    }
    if (typeof environmentElements !== 'string') {
      return false;
    }
    if (typeof lightAtmosphere !== 'string') {
      return false;
    }
    
    // 验证视角与构图
    const { shootingPerspective, compositionMethod, subjectRatio } = output.perspectiveAndComposition;
    if (typeof shootingPerspective !== 'string') {
      return false;
    }
    if (typeof compositionMethod !== 'string') {
      return false;
    }
    if (typeof subjectRatio !== 'string') {
      return false;
    }
    
    // 验证技术与参数
    const { resolution, renderQuality, detailIntensity } = output.technicalParameters;
    if (typeof resolution !== 'string') {
      return false;
    }
    if (typeof renderQuality !== 'string') {
      return false;
    }
    if (typeof detailIntensity !== 'string') {
      return false;
    }
    
    // 验证负面提示
    const { generalNegative, modelSpecificNegative } = output.negativePrompts;
    if (!Array.isArray(generalNegative)) {
      return false;
    }
    if (!Array.isArray(modelSpecificNegative)) {
      return false;
    }
    
    // 验证补全标记
    if (!output.completionMarks || typeof output.completionMarks !== 'object') {
      return false;
    }
    
    // 验证补全策略
    if (!output.completionStrategy || typeof output.completionStrategy !== 'object') {
      return false;
    }
    
    const { confidenceLevel, strategy, reasoning } = output.completionStrategy;
    if (typeof confidenceLevel !== 'string' || !['high', 'medium', 'low'].includes(confidenceLevel)) {
      return false;
    }
    if (typeof strategy !== 'string' || !['active_expansion', 'conservative_focus', 'minimal_safe'].includes(strategy)) {
      return false;
    }
    if (typeof reasoning !== 'string') {
      return false;
    }
    
    // 验证最终结果
    if (typeof output.finalResult !== 'string') {
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
}

export function validateM2Input(input: any): input is M2Input {
  if (!input || typeof input !== 'object') {
    return false;
  }
  
  if (!input.m1Output || typeof input.m1Output !== 'object') {
    return false;
  }
  
  // 验证m1Output的基本字段
  const { coreSubject, coreIntent, confidence } = input.m1Output;
  if (typeof coreSubject !== 'string' || coreSubject.length === 0) {
    return false;
  }
  if (typeof coreIntent !== 'string') {
    return false;
  }
  if (typeof confidence !== 'number' || confidence < 0 || confidence > 1) {
    return false;
  }
  
  // 验证preference（如果存在）
  if (input.preference !== undefined) {
    if (typeof input.preference !== 'object') {
      return false;
    }
    
    const { preferredStyle, commonSubjects, preferredScenes, preferredResolution, historyFeedback } = input.preference;
    
    if (preferredStyle !== undefined && typeof preferredStyle !== 'string') {
      return false;
    }
    if (commonSubjects !== undefined && !Array.isArray(commonSubjects)) {
      return false;
    }
    if (preferredScenes !== undefined && !Array.isArray(preferredScenes)) {
      return false;
    }
    if (preferredResolution !== undefined && typeof preferredResolution !== 'string') {
      return false;
    }
    if (historyFeedback !== undefined && !Array.isArray(historyFeedback)) {
      return false;
    }
  }
  
  // 验证targetModel（如果存在）
  if (input.targetModel !== undefined) {
    if (typeof input.targetModel !== 'string' || !['Midjourney', 'Stable Diffusion', 'DALL·E 3'].includes(input.targetModel)) {
      return false;
    }
  }
  
  return true;
}

export function validateM2Config(config: any): config is { temperature: number; maxTokens: number; model: string } {
  if (!config || typeof config !== 'object') {
    return false;
  }
  
  if (typeof config.temperature !== 'number' || config.temperature < 0 || config.temperature > 1) {
    return false;
  }
  
  if (typeof config.maxTokens !== 'number' || config.maxTokens < 1 || config.maxTokens > 4000) {
    return false;
  }
  
  if (typeof config.model !== 'string' || config.model.trim().length === 0) {
    return false;
  }
  
  return true;
}
