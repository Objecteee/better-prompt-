// 模块3：表达逻辑优化 - 基于API调用

import { callOptimizerAPI } from '../../llm';
import type { Message } from '../../templateProcessor';
import type { M3Input, M3Output, M3Config } from '../types/module3';

export class Module3Optimizer {
  private config: M3Config;
  
  constructor(config: Partial<M3Config> = {}) {
    this.config = {
      temperature: 0.2,
      maxTokens: 1000,
      model: 'gpt-3.5-turbo-0125',
      enableReordering: true,
      enableGrouping: true,
      enableWeighting: false,
      enableSimplification: true,
      coreInfoWeight: 1.2,
      sceneInfoWeight: 1.0,
      technicalInfoWeight: 0.8,
      ...config
    };
  }

  /**
   * 优化表达逻辑，将模块2输出重组成符合AI理解逻辑的提示词
   */
  async optimize(input: M3Input): Promise<M3Output> {
    try {
      // 分析优化策略
      const strategy = this.analyzeOptimizationStrategy(input);
      
      // 构建API调用的消息
      const messages = this.buildMessages(input, strategy);
      
      // 调用API
      const rawResponse = await callOptimizerAPI(messages, {
        model: this.config.model,
        llmParams: {
          temperature: this.config.temperature,
          max_tokens: this.config.maxTokens
        }
      });
      
      // 解析API响应
      const result = this.parseResponse(rawResponse, input.m2Output, strategy);
      
      // 验证结果
      this.validateResult(result);
      
      return result;
      
    } catch (error) {
      console.error('模块3 API调用失败:', error);
      throw new Error(`模块3优化失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  /**
   * 分析优化策略
   */
  private analyzeOptimizationStrategy(input: M3Input): {
    level: 'basic' | 'enhanced' | 'advanced';
    reasoning: string;
  } {
    const { m2Output, optimizationLevel } = input;
    
    // 根据输入确定优化级别
    const level = optimizationLevel || 'enhanced';
    
    let reasoning = '';
    
    switch (level) {
      case 'basic':
        reasoning = '基础优化：重新排序信息，确保重要信息前置';
        break;
      case 'enhanced':
        reasoning = '增强优化：重新排序+分组+简化表达，提升AI理解效果';
        break;
      case 'advanced':
        reasoning = '高级优化：完整优化流程，包括权重标注和高级表达技巧';
        break;
    }
    
    return { level, reasoning };
  }

  /**
   * 构建API调用的消息
   */
  private buildMessages(input: M3Input, strategy: any): Message[] {
    const { m2Output, targetModel } = input;
    
    // 构建system prompt
    const systemPrompt = this.buildSystemPrompt(m2Output, targetModel, strategy);
    
    // 构建user prompt
    const userPrompt = this.buildUserPrompt(m2Output);
    
    return [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];
  }

  /**
   * 构建system prompt
   */
  private buildSystemPrompt(
    m2Output: M3Input['m2Output'], 
    targetModel: M3Input['targetModel'],
    strategy: any
  ): string {
    let prompt = `你是专业的AI绘画提示词优化助手。你的任务是将结构化的绘画信息重组成符合AI理解逻辑的优化提示词。

核心任务：
1. 重新排序：将重要信息（主体+风格）前置，次要信息（技术参数）后置
2. 信息分组：将同类信息合并表达，避免信息零散
3. 简化表达：去除冗余词汇，使用简洁明了的表达
4. 逻辑连贯：确保整个提示词逻辑清晰，易于AI理解

优化策略：${strategy.level}
策略说明：${strategy.reasoning}

重要规则：
1. 核心信息（主体+风格）必须放在最前面
2. 场景环境信息紧跟核心信息
3. 技术参数放在最后
4. 同类信息要合并表达，如"女孩（穿白裙、微笑）"
5. 使用简洁明了的语言，避免冗余
6. 保持逻辑连贯性，确保AI能准确理解

输出格式要求：
- 必须返回JSON格式
- 包含优化后的提示词和结构化信息
- 包含优化标记和策略信息
- 包含原始结构信息用于对比

示例输出：
{
  "optimizedPrompt": "一位优雅的美女，水彩风格，站在室内窗台旁，柔和自然光，4K分辨率，高质量渲染",
  "structureInfo": {
    "coreInfo": "一位优雅的美女，水彩风格",
    "sceneInfo": "站在室内窗台旁，柔和自然光",
    "technicalInfo": "4K分辨率，高质量渲染",
    "negativeInfo": "避免模糊、低质量、变形"
  },
  "optimizationMarks": {
    "reordered": true,
    "grouped": true,
    "weighted": false,
    "simplified": true
  },
  "optimizationStrategy": {
    "level": "enhanced",
    "reasoning": "增强优化：重新排序+分组+简化表达，提升AI理解效果"
  },
  "originalStructure": {
    "subjectAndFeatures": "美女，优雅姿态，温柔表情",
    "styleAndGenre": "水彩风格，清新淡雅",
    "sceneAndEnvironment": "室内窗台，柔和光线",
    "perspectiveAndComposition": "平视中景，居中构图",
    "technicalParameters": "4K分辨率，高质量渲染",
    "negativePrompts": "避免模糊、低质量、变形"
  }
}`;

    // 添加目标模型信息
    if (targetModel) {
      prompt += `\n\n目标模型：${targetModel}`;
    }

    return prompt;
  }

  /**
   * 构建user prompt
   */
  private buildUserPrompt(m2Output: M3Input['m2Output']): string {
    return `请优化以下模块2的结构化输出：

模块2输出结果：
- 主体与特征：${m2Output.subjectAndFeatures.coreSubject}，${m2Output.subjectAndFeatures.featureDetails}，${m2Output.subjectAndFeatures.actionState}
- 风格与流派：${m2Output.styleAndGenre.artStyle}，${m2Output.styleAndGenre.styleParameters}
- 场景与环境：${m2Output.sceneAndEnvironment.coreScene}，${m2Output.sceneAndEnvironment.environmentElements}，${m2Output.sceneAndEnvironment.lightAtmosphere}
- 视角与构图：${m2Output.perspectiveAndComposition.shootingPerspective}，${m2Output.perspectiveAndComposition.compositionMethod}，${m2Output.perspectiveAndComposition.subjectRatio}
- 技术与参数：${m2Output.technicalParameters.resolution}，${m2Output.technicalParameters.renderQuality}，${m2Output.technicalParameters.detailIntensity}
- 负面提示：${m2Output.negativePrompts.generalNegative.join(', ')}，${m2Output.negativePrompts.modelSpecificNegative.join(', ')}

请按照要求返回JSON格式的优化结果。`;
  }

  /**
   * 解析API响应
   */
  private parseResponse(rawResponse: string, m2Output: M3Input['m2Output'], strategy: any): M3Output {
    try {
      // 检查响应是否为空
      if (!rawResponse || rawResponse.trim().length === 0) {
        throw new Error('API返回空响应');
      }
      
      // 尝试直接解析JSON
      let jsonStr = rawResponse.trim();
      
      // 如果响应包含markdown代码块，提取JSON部分
      if (jsonStr.includes('```json')) {
        const match = jsonStr.match(/```json\s*([\s\S]*?)\s*```/);
        if (match) {
          jsonStr = match[1];
        }
      } else if (jsonStr.includes('```')) {
        const match = jsonStr.match(/```\s*([\s\S]*?)\s*```/);
        if (match) {
          jsonStr = match[1];
        }
      }
      
      // 尝试找到JSON对象
      const jsonStart = jsonStr.indexOf('{');
      const jsonEnd = jsonStr.lastIndexOf('}');
      
      if (jsonStart === -1 || jsonEnd === -1 || jsonStart >= jsonEnd) {
        throw new Error('API响应中未找到有效的JSON对象');
      }
      
      jsonStr = jsonStr.substring(jsonStart, jsonEnd + 1);
      
      // 解析JSON
      const result = JSON.parse(jsonStr);
      
      // 验证必要字段
      if (!result.optimizedPrompt || !result.structureInfo) {
        throw new Error('API响应缺少必要字段');
      }
      
      // 设置默认值
      return {
        optimizedPrompt: result.optimizedPrompt || '',
        structureInfo: result.structureInfo || {
          coreInfo: '',
          sceneInfo: '',
          technicalInfo: '',
          negativeInfo: ''
        },
        optimizationMarks: result.optimizationMarks || {
          reordered: false,
          grouped: false,
          weighted: false,
          simplified: false
        },
        optimizationStrategy: result.optimizationStrategy || strategy,
        originalStructure: result.originalStructure || {
          subjectAndFeatures: `${m2Output.subjectAndFeatures.coreSubject}，${m2Output.subjectAndFeatures.featureDetails}，${m2Output.subjectAndFeatures.actionState}`,
          styleAndGenre: `${m2Output.styleAndGenre.artStyle}，${m2Output.styleAndGenre.styleParameters}`,
          sceneAndEnvironment: `${m2Output.sceneAndEnvironment.coreScene}，${m2Output.sceneAndEnvironment.environmentElements}，${m2Output.sceneAndEnvironment.lightAtmosphere}`,
          perspectiveAndComposition: `${m2Output.perspectiveAndComposition.shootingPerspective}，${m2Output.perspectiveAndComposition.compositionMethod}，${m2Output.perspectiveAndComposition.subjectRatio}`,
          technicalParameters: `${m2Output.technicalParameters.resolution}，${m2Output.technicalParameters.renderQuality}，${m2Output.technicalParameters.detailIntensity}`,
          negativePrompts: `${m2Output.negativePrompts.generalNegative.join(', ')}，${m2Output.negativePrompts.modelSpecificNegative.join(', ')}`
        }
      };
      
    } catch (error) {
      console.error('解析API响应失败:', error);
      console.error('原始响应:', rawResponse);
      throw new Error(`API响应格式错误: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  /**
   * 验证优化结果
   */
  private validateResult(result: M3Output): void {
    // 验证必要字段
    if (!result.optimizedPrompt || typeof result.optimizedPrompt !== 'string') {
      throw new Error('optimizedPrompt字段无效');
    }
    
    if (!result.structureInfo || typeof result.structureInfo !== 'object') {
      throw new Error('structureInfo字段无效');
    }
    
    if (!result.optimizationMarks || typeof result.optimizationMarks !== 'object') {
      throw new Error('optimizationMarks字段无效');
    }
    
    if (!result.optimizationStrategy || typeof result.optimizationStrategy !== 'object') {
      throw new Error('optimizationStrategy字段无效');
    }
    
    // 验证优化后的提示词长度
    if (result.optimizedPrompt.length < 10) {
      throw new Error('优化后的提示词过短');
    }
  }
}

// 导出便捷函数
export async function optimizeExpression(
  m2Output: M3Input['m2Output'], 
  targetModel?: M3Input['targetModel'],
  optimizationLevel?: M3Input['optimizationLevel']
): Promise<M3Output> {
  const optimizer = new Module3Optimizer();
  return optimizer.optimize({ m2Output, targetModel, optimizationLevel });
}
