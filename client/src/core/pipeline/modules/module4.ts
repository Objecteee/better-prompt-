import { callOptimizerAPI } from '../../llm';
import type { M4Input, M4Output, M4Config, SupportedModel, ModelCharacteristics } from '../types/module4';

export class Module4Adapter {
  private config: M4Config;

  constructor(config?: Partial<M4Config>) {
    this.config = {
      temperature: 0.3,
      maxTokens: 900,
      model: 'gpt-3.5-turbo',
      enableDetailedScene: true,
      enableStyleSpecification: true,
      enableElementCombination: true,
      enableFontDesign: true,
      enableNaturalLanguage: true,
      enableApplicationScene: true,
      enableTextRendering: true,
      enableKeywordArrangement: true,
      enableUniversalArchitecture: true,
      enablePreciseStructure: true,
      enableLayeredDescription: true,
      enableMultiDimensional: true,
      ...config
    };
  }

  // 模型特性配置
  private getModelCharacteristics(): ModelCharacteristics {
    return {
      '腾讯混元图像 3.0': {
        name: '腾讯混元图像 3.0',
        description: '需要详细场景构建和明确风格指定',
        strengths: ['详细场景构建', '明确风格指定', '精准元素组合', '具体字体设计'],
        requirements: ['详细描述场景各个方面', '清晰指明风格', '详细列出关键元素', '描述字体风格'],
        promptStructure: '详细场景 + 明确风格 + 精准元素 + 字体设计',
        examples: [
          {
            input: '一个女孩在教室里',
            output: '在一个充满阳光的教室里，黑板位于画面中央，光线从左侧窗户斜射进来，在黑板上形成明暗对比，教室里摆放着整齐的桌椅。一位年轻的女孩坐在课桌前，她穿着白色的校服，长发披肩，表情专注，采用写实风格，线条细腻流畅，色彩鲜艳且富有层次感。'
          }
        ]
      },
      '字节跳动 Seedream 4.0': {
        name: '字节跳动 Seedream 4.0',
        description: '使用自然语言描述和明确应用场景',
        strengths: ['自然语言描述', '明确应用场景', '准确文本渲染'],
        requirements: ['简洁连贯的自然语言', '明确应用场景', '文字内容用双引号'],
        promptStructure: '自然语言 + 应用场景 + 文本渲染',
        examples: [
          {
            input: '一个小男孩放风筝',
            output: '一个小男孩在公园的草地上放风筝，阳光明媚，天空湛蓝，采用印象派绘画风格，色彩明亮鲜艳，光影效果自然。设计一张手机壁纸，画面简洁清新，适合作为手机屏幕背景。'
          }
        ]
      },
      '百度文心一格': {
        name: '百度文心一格',
        description: '支持自然语言描述、关键词排列和万能架构',
        strengths: ['自然语言描述', '排列关键词', '万能架构'],
        requirements: ['简单通俗描述', '关键词叠加', '万能架构结构'],
        promptStructure: '自然语言 | 关键词排列 | 万能架构',
        examples: [
          {
            input: '一只飞翔的鸟',
            output: '主题是一只飞翔的鸟，媒介为油画，背景是广阔的天空，灯光为自然光，颜色为蓝色和白色，色彩明亮，气氛自由，视角为仰视，镜头为长焦，构图为中心构图，艺术风格为印象派。'
          }
        ]
      },
      '阿里通义万相': {
        name: '阿里通义万相',
        description: '支持基础公式和进阶公式',
        strengths: ['基础公式', '进阶公式'],
        requirements: ['主体+场景+风格', '主体描述+场景描述+风格+镜头语言+氛围词+细节修饰'],
        promptStructure: '基础公式 | 进阶公式',
        examples: [
          {
            input: '古装女子',
            output: '一位穿着古装的女子，在古色古香的庭院中翩翩起舞，庭院中有盛开的花朵和古老的建筑，采用中国风的工笔画风格，中景镜头，营造出一种优雅、宁静的氛围，女子的服饰和发型细节丰富，色彩鲜艳。'
          }
        ]
      },
      'Stable Diffusion 3': {
        name: 'Stable Diffusion 3',
        description: '需要精确结构和分层描述',
        strengths: ['精确结构', '分层描述'],
        requirements: ['主体描述+细节修饰+艺术风格+颜色光线+摄影参数', '分层次描述'],
        promptStructure: '主体描述，细节修饰，艺术风格，颜色和光线，摄影参数',
        examples: [
          {
            input: '美女在花园里',
            output: 'a beautiful woman in a red dress, standing in a garden full of flowers, with long hair flowing gently, realistic style, warm sunlight shining on her, soft focus, --W 1024 --H 768 --CFG 10 --steps 50'
          }
        ]
      },
      'DALL·E 3': {
        name: 'DALL·E 3',
        description: '使用自然语言对话和细节调整',
        strengths: ['自然语言对话', '细节调整'],
        requirements: ['像和人对话一样描述', '可以反复调整细节'],
        promptStructure: '自然语言对话 + 细节调整',
        examples: [
          {
            input: '魔法森林',
            output: '我想要一张图片，展示一个魔法森林的场景，里面有高大的树木，树上挂满了发光的果实，地面上有一些小精灵在玩耍，整体氛围要神秘而梦幻。把小精灵的数量增加到五个，让它们的服装颜色更加鲜艳，再在森林中添加一条小溪，溪水潺潺流动。'
          }
        ]
      },
      'Midjourney V6': {
        name: 'Midjourney V6',
        description: '使用多维度描述',
        strengths: ['多维度描述'],
        requirements: ['组合多个维度描述词'],
        promptStructure: 'photo type + subject focus + color tone + setting + atmosphere + texture + mood + composition + lighting',
        examples: [
          {
            input: '山峰风景',
            output: 'photo type: landscape, subject focus: a majestic mountain peak, color tone: cool blue and white, setting: a snowy mountain range, atmosphere: serene and peaceful, texture: rough rock surface, mood: awe-inspiring, composition: rule of thirds, lighting: soft diffused light --ar 16:9 --style raw --v 6.0'
          }
        ]
      }
    };
  }

  // 确定适配策略
  private determineAdaptationStrategy(targetModel: SupportedModel): {
    approach: string;
    reasoning: string;
  } {
    const characteristics = this.getModelCharacteristics();
    const model = characteristics[targetModel];
    
    if (!model) {
      return {
        approach: '通用适配',
        reasoning: '未知模型，使用通用适配策略'
      };
    }

    return {
      approach: model.promptStructure,
      reasoning: `针对${targetModel}的特性：${model.strengths.join('、')}，采用${model.promptStructure}的适配策略`
    };
  }

  // 构建系统提示词
  private buildSystemPrompt(
    m3Output: M4Input['m3Output'],
    targetModel: SupportedModel,
    strategy: any
  ): string {
    const characteristics = this.getModelCharacteristics();
    const model = characteristics[targetModel];
    
    let prompt = `你是专业的AI绘画提示词模型适配助手。你的任务是基于模块3的优化结果，针对特定模型进行个性化适配。

核心任务：
1. 根据目标模型特性调整提示词结构
2. 添加模型特定的参数和关键词
3. 优化表达方式以匹配模型偏好
4. 提供模型特定的优化建议

目标模型：${targetModel}
模型特性：${model?.description || '通用模型'}
适配策略：${strategy.approach}
策略说明：${strategy.reasoning}

重要规则：
- 必须严格按照目标模型的特性进行适配
- 保持原始意图不变，只调整表达方式
- 添加模型特定的参数和关键词
- 确保适配后的提示词符合模型要求

输出格式要求：
- 必须返回JSON格式
- 字段：adaptedPrompt, modelParameters, adaptationMarks, adaptationStrategy, originalPrompt, originalStructure, optimizationSuggestions
- adaptedPrompt是适配后的提示词字符串
- modelParameters包含模型特定参数
- adaptationMarks标记各种适配操作
- optimizationSuggestions包含优化建议

示例输出：
{
  "adaptedPrompt": "一位优雅的美女，水彩风格，站在室内窗台旁，柔和自然光，4K分辨率，高质量渲染",
  "modelParameters": {
    "aspectRatio": "16:9",
    "quality": "high",
    "style": "watercolor"
  },
  "adaptationMarks": {
    "detailedScene": true,
    "styleSpecified": true,
    "elementsCombined": false,
    "fontDesigned": false,
    "naturalLanguage": true,
    "applicationScene": false,
    "textRendering": false,
    "keywordArranged": false,
    "universalArchitecture": false,
    "preciseStructure": false,
    "layeredDescription": false,
    "multiDimensional": false
  },
  "adaptationStrategy": {
    "model": "${targetModel}",
    "approach": "${strategy.approach}",
    "reasoning": "${strategy.reasoning}"
  },
  "originalPrompt": "原始提示词",
  "originalStructure": {
    "coreInfo": "核心信息",
    "sceneInfo": "场景信息",
    "technicalInfo": "技术信息",
    "negativeInfo": "负面信息"
  },
  "optimizationSuggestions": {
    "strengths": ["该模型的优势"],
    "improvements": ["改进建议"],
    "bestPractices": ["最佳实践"]
  }
}`;

    // 添加模型特定指导
    if (model) {
      prompt += `\n\n${targetModel}特定指导：`;
      prompt += `\n- 模型优势：${model.strengths.join('、')}`;
      prompt += `\n- 适配要求：${model.requirements.join('、')}`;
      prompt += `\n- 提示词结构：${model.promptStructure}`;
      
      if (model.examples.length > 0) {
        prompt += `\n- 示例：`;
        model.examples.forEach((example, index) => {
          prompt += `\n  ${index + 1}. 输入：${example.input}`;
          prompt += `\n     输出：${example.output}`;
        });
      }
    }

    return prompt;
  }

  // 构建用户提示词
  private buildUserPrompt(m3Output: M4Input['m3Output']): string {
    return `请基于以下模块3的优化结果进行模型适配：

原始提示词：${m3Output.optimizedPrompt}

结构信息：
- 核心信息：${m3Output.structureInfo.coreInfo}
- 场景信息：${m3Output.structureInfo.sceneInfo}
- 技术信息：${m3Output.structureInfo.technicalInfo}
- 负面信息：${m3Output.structureInfo.negativeInfo}

优化标记：
- 重新排序：${m3Output.optimizationMarks.reordered}
- 信息分组：${m3Output.optimizationMarks.grouped}
- 权重标注：${m3Output.optimizationMarks.weighted}
- 简化表达：${m3Output.optimizationMarks.simplified}

请根据目标模型特性进行适配。`;
  }

  // 解析API响应
  private parseResponse(response: string): M4Output {
    try {
      // 尝试直接解析JSON
      const parsed = JSON.parse(response);
      return parsed;
    } catch (error) {
      // 如果解析失败，尝试修复截断的JSON
      const fixedJson = this.fixTruncatedJson(response);
      try {
        return JSON.parse(fixedJson);
      } catch (secondError) {
        console.error('模块4解析API响应失败:', secondError);
        throw new Error(`模块4解析失败: ${secondError}`);
      }
    }
  }

  // 修复截断的JSON
  private fixTruncatedJson(jsonString: string): string {
    // 移除可能的markdown代码块标记
    let cleaned = jsonString.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    // 如果JSON不完整，尝试补全
    if (!cleaned.trim().endsWith('}')) {
      // 查找最后一个完整的字段
      const lastCompleteField = cleaned.lastIndexOf('"');
      if (lastCompleteField > 0) {
        const beforeLastField = cleaned.lastIndexOf('"', lastCompleteField - 1);
        if (beforeLastField > 0) {
          const fieldName = cleaned.substring(beforeLastField + 1, lastCompleteField);
          // 尝试补全缺失的字段
          if (fieldName === 'adaptedPrompt') {
            cleaned += '"}';
          } else if (fieldName === 'modelParameters') {
            cleaned += '}';
          } else if (fieldName === 'adaptationMarks') {
            cleaned += '}';
          } else if (fieldName === 'adaptationStrategy') {
            cleaned += '}';
          } else if (fieldName === 'originalPrompt') {
            cleaned += '"';
          } else if (fieldName === 'originalStructure') {
            cleaned += '}';
          } else if (fieldName === 'optimizationSuggestions') {
            cleaned += '}';
          }
        }
      }
      
      // 如果还是不完整，添加基本的结束结构
      if (!cleaned.trim().endsWith('}')) {
        cleaned += '}';
      }
    }
    
    return cleaned;
  }

  // 验证输出
  private validateOutput(output: M4Output): boolean {
    if (!output.adaptedPrompt || typeof output.adaptedPrompt !== 'string') {
      return false;
    }
    
    if (!output.modelParameters || typeof output.modelParameters !== 'object') {
      return false;
    }
    
    if (!output.adaptationMarks || typeof output.adaptationMarks !== 'object') {
      return false;
    }
    
    if (!output.adaptationStrategy || typeof output.adaptationStrategy !== 'object') {
      return false;
    }
    
    return true;
  }

  // 主要适配方法
  async adapt(input: M4Input): Promise<M4Output> {
    try {
      // 确定适配策略
      const strategy = this.determineAdaptationStrategy(input.targetModel);
      
      // 构建提示词
      const systemPrompt = this.buildSystemPrompt(input.m3Output, input.targetModel, strategy);
      const userPrompt = this.buildUserPrompt(input.m3Output);
      
      // 调用API
      const messages = [
        { role: 'system' as const, content: systemPrompt },
        { role: 'user' as const, content: userPrompt }
      ];
      const response = await callOptimizerAPI(messages);
      
      if (!response) {
        throw new Error('模块4 API调用失败：无响应');
      }
      
      // 解析响应
      const output = this.parseResponse(response);
      
      // 验证输出
      if (!this.validateOutput(output)) {
        throw new Error('模块4输出验证失败：格式不正确');
      }
      
      return output;
    } catch (error) {
      console.error('模块4适配失败:', error);
      throw error;
    }
  }
}

// 导出便捷函数
export async function adaptToModel(input: M4Input, config?: Partial<M4Config>): Promise<M4Output> {
  const adapter = new Module4Adapter(config);
  return await adapter.adapt(input);
}
