import type { M4Output, SupportedModel } from '../types/module4';

export class Module4Validator {
  // 验证适配后的提示词
  static validateAdaptedPrompt(adaptedPrompt: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    
    if (!adaptedPrompt || adaptedPrompt.trim().length === 0) {
      errors.push('适配后的提示词不能为空');
    }
    
    if (adaptedPrompt.length > 2000) {
      errors.push('适配后的提示词过长（超过2000字符）');
    }
    
    // 检查是否包含基本的绘画元素
    const hasSubject = /(人物|动物|风景|物体|建筑|场景)/.test(adaptedPrompt);
    if (!hasSubject) {
      errors.push('适配后的提示词缺少主体描述');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // 验证模型参数
  static validateModelParameters(modelParameters: any, targetModel: SupportedModel): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    
    if (!modelParameters || typeof modelParameters !== 'object') {
      errors.push('模型参数必须是对象');
      return { isValid: false, errors };
    }
    
    // 根据目标模型验证特定参数
    switch (targetModel) {
      case 'Stable Diffusion 3':
        if (modelParameters.width && (modelParameters.width < 512 || modelParameters.width > 2048)) {
          errors.push('Stable Diffusion 3的宽度应在512-2048之间');
        }
        if (modelParameters.height && (modelParameters.height < 512 || modelParameters.height > 2048)) {
          errors.push('Stable Diffusion 3的高度应在512-2048之间');
        }
        if (modelParameters.cfg && (modelParameters.cfg < 1 || modelParameters.cfg > 20)) {
          errors.push('Stable Diffusion 3的CFG应在1-20之间');
        }
        if (modelParameters.steps && (modelParameters.steps < 10 || modelParameters.steps > 100)) {
          errors.push('Stable Diffusion 3的步数应在10-100之间');
        }
        break;
        
      case 'Midjourney V6':
        if (modelParameters.aspectRatio && !/^\d+:\d+$/.test(modelParameters.aspectRatio)) {
          errors.push('Midjourney V6的宽高比格式应为"数字:数字"');
        }
        break;
        
      case 'DALL·E 3':
        if (modelParameters.quality && !['standard', 'hd'].includes(modelParameters.quality)) {
          errors.push('DALL·E 3的质量参数应为standard或hd');
        }
        if (modelParameters.size && !['1024x1024', '1024x1792', '1792x1024'].includes(modelParameters.size)) {
          errors.push('DALL·E 3的尺寸参数应为1024x1024、1024x1792或1792x1024');
        }
        break;
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // 验证适配标记
  static validateAdaptationMarks(adaptationMarks: any, targetModel: SupportedModel): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    
    if (!adaptationMarks || typeof adaptationMarks !== 'object') {
      errors.push('适配标记必须是对象');
      return { isValid: false, errors };
    }
    
    // 检查必需的标记字段
    const requiredFields = [
      'detailedScene', 'styleSpecified', 'elementsCombined', 'fontDesigned',
      'naturalLanguage', 'applicationScene', 'textRendering', 'keywordArranged',
      'universalArchitecture', 'preciseStructure', 'layeredDescription', 'multiDimensional'
    ];
    
    for (const field of requiredFields) {
      if (adaptationMarks[field] === undefined) {
        errors.push(`缺少必需的适配标记字段: ${field}`);
      } else if (typeof adaptationMarks[field] !== 'boolean') {
        errors.push(`适配标记字段 ${field} 必须是布尔值`);
      }
    }
    
    // 根据目标模型验证特定的适配标记
    switch (targetModel) {
      case '腾讯混元图像 3.0':
        if (!adaptationMarks.detailedScene) {
          errors.push('腾讯混元图像 3.0需要详细场景构建');
        }
        if (!adaptationMarks.styleSpecified) {
          errors.push('腾讯混元图像 3.0需要明确风格指定');
        }
        break;
        
      case '字节跳动 Seedream 4.0':
        if (!adaptationMarks.naturalLanguage) {
          errors.push('字节跳动 Seedream 4.0需要自然语言描述');
        }
        break;
        
      case '百度文心一格':
        if (!adaptationMarks.naturalLanguage && !adaptationMarks.keywordArranged && !adaptationMarks.universalArchitecture) {
          errors.push('百度文心一格需要至少一种描述方式');
        }
        break;
        
      case 'Stable Diffusion 3':
        if (!adaptationMarks.preciseStructure) {
          errors.push('Stable Diffusion 3需要精确结构');
        }
        break;
        
      case 'Midjourney V6':
        if (!adaptationMarks.multiDimensional) {
          errors.push('Midjourney V6需要多维度描述');
        }
        break;
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // 验证适配策略
  static validateAdaptationStrategy(adaptationStrategy: any, targetModel: SupportedModel): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    
    if (!adaptationStrategy || typeof adaptationStrategy !== 'object') {
      errors.push('适配策略必须是对象');
      return { isValid: false, errors };
    }
    
    if (!adaptationStrategy.model || adaptationStrategy.model !== targetModel) {
      errors.push('适配策略中的模型与目标模型不匹配');
    }
    
    if (!adaptationStrategy.approach || typeof adaptationStrategy.approach !== 'string') {
      errors.push('适配策略缺少approach字段或格式不正确');
    }
    
    if (!adaptationStrategy.reasoning || typeof adaptationStrategy.reasoning !== 'string') {
      errors.push('适配策略缺少reasoning字段或格式不正确');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // 验证优化建议
  static validateOptimizationSuggestions(optimizationSuggestions: any): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    
    if (!optimizationSuggestions || typeof optimizationSuggestions !== 'object') {
      errors.push('优化建议必须是对象');
      return { isValid: false, errors };
    }
    
    if (!Array.isArray(optimizationSuggestions.strengths)) {
      errors.push('优化建议的strengths必须是数组');
    }
    
    if (!Array.isArray(optimizationSuggestions.improvements)) {
      errors.push('优化建议的improvements必须是数组');
    }
    
    if (!Array.isArray(optimizationSuggestions.bestPractices)) {
      errors.push('优化建议的bestPractices必须是数组');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // 综合验证
  static validateM4Output(output: M4Output, targetModel: SupportedModel): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // 验证适配后的提示词
    const promptValidation = this.validateAdaptedPrompt(output.adaptedPrompt);
    if (!promptValidation.isValid) {
      errors.push(...promptValidation.errors);
    }
    
    // 验证模型参数
    const parametersValidation = this.validateModelParameters(output.modelParameters, targetModel);
    if (!parametersValidation.isValid) {
      errors.push(...parametersValidation.errors);
    }
    
    // 验证适配标记
    const marksValidation = this.validateAdaptationMarks(output.adaptationMarks, targetModel);
    if (!marksValidation.isValid) {
      errors.push(...marksValidation.errors);
    }
    
    // 验证适配策略
    const strategyValidation = this.validateAdaptationStrategy(output.adaptationStrategy, targetModel);
    if (!strategyValidation.isValid) {
      errors.push(...strategyValidation.errors);
    }
    
    // 验证优化建议
    const suggestionsValidation = this.validateOptimizationSuggestions(output.optimizationSuggestions);
    if (!suggestionsValidation.isValid) {
      errors.push(...suggestionsValidation.errors);
    }
    
    // 检查原始信息
    if (!output.originalPrompt || output.originalPrompt.trim().length === 0) {
      warnings.push('原始提示词为空');
    }
    
    if (!output.originalStructure || typeof output.originalStructure !== 'object') {
      warnings.push('原始结构信息格式不正确');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
}
