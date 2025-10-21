// 模块1的验证器

import type { M1Output, M1Input } from '../types/module1';

export function validateM1Output(output: M1Output): boolean {
  try {
    // 基础字段验证
    if (!output.coreSubject || typeof output.coreSubject !== 'string') {
      return false;
    }
    
    if (!output.coreIntent || typeof output.coreIntent !== 'string') {
      return false;
    }
    
    if (!Array.isArray(output.corrections)) {
      return false;
    }
    
    // 置信度验证
    if (typeof output.confidence !== 'number' || output.confidence < 0 || output.confidence > 1) {
      return false;
    }
    
    // 补全询问验证（如果存在）
    if (output.clarificationQuestions !== undefined) {
      if (!Array.isArray(output.clarificationQuestions)) {
        return false;
      }
      
      // 检查问题数量是否合理
      if (output.clarificationQuestions.length > 5) {
        return false;
      }
      
      // 检查问题内容是否合理
      for (const question of output.clarificationQuestions) {
        if (typeof question !== 'string' || question.length < 5) {
          return false;
        }
      }
    }
    
    // 隐含需求验证（如果存在）
    if (output.implicitNeeds !== undefined) {
      const { mood, colorPalette, composition } = output.implicitNeeds;
      
      if (mood !== undefined && typeof mood !== 'string') {
        return false;
      }
      
      if (colorPalette !== undefined && typeof colorPalette !== 'string') {
        return false;
      }
      
      if (composition !== undefined && typeof composition !== 'string') {
        return false;
      }
    }
    
    return true;
  } catch {
    return false;
  }
}

export function validateM1Input(input: any): input is M1Input {
  if (!input || typeof input !== 'object') {
    return false;
  }
  
  if (typeof input.originalInput !== 'string' || input.originalInput.trim().length === 0) {
    return false;
  }
  
  // 验证用户上下文（如果存在）
  if (input.userContext !== undefined) {
    const { userContext } = input;
    
    if (userContext.preferredStyle !== undefined && typeof userContext.preferredStyle !== 'string') {
      return false;
    }
    
    if (userContext.commonSubjects !== undefined && !Array.isArray(userContext.commonSubjects)) {
      return false;
    }
    
    if (userContext.historyFeedback !== undefined && !Array.isArray(userContext.historyFeedback)) {
      return false;
    }
  }
  
  return true;
}

export function validateM1Config(config: any): config is { temperature: number; maxTokens: number; model: string } {
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