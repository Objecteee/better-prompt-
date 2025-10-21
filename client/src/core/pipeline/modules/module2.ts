// 模块2：关键信息补全 - 基于API调用

import { callOptimizerAPI } from '../../llm';
import type { Message } from '../../templateProcessor';
import type { M1Output } from '../types/module1';
import type { M2Input, M2Output, M2Config } from '../types/module2';

export class Module2Completer {
  private config: M2Config;
  
  constructor(config: Partial<M2Config> = {}) {
    this.config = {
      temperature: 0.4,
      maxTokens: 1200,  // 增加token数量，避免截断
      model: 'gpt-3.5-turbo-0125',
      enableActiveExpansion: true,
      enableConservativeFocus: true,
      enableMinimalSafe: true,
      highConfidenceThreshold: 80,
      mediumConfidenceThreshold: 50,
      ...config
    };
  }

  /**
   * 补全关键信息，基于模块1输出进行6大维度补全
   */
  async complete(input: M2Input): Promise<M2Output> {
    try {
      // 分析模块1输出，确定补全策略
      const strategy = this.analyzeCompletionStrategy(input.m1Output);
      
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
      const result = this.parseResponse(rawResponse, input.m1Output, strategy);
      
      // 验证结果
      this.validateResult(result);
      
      return result;
      
    } catch (error) {
      console.error('模块2 API调用失败:', error);
      throw new Error(`模块2补全失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  /**
   * 分析补全策略
   */
  private analyzeCompletionStrategy(m1Output: M1Output): {
    confidenceLevel: 'high' | 'medium' | 'low';
    strategy: 'active_expansion' | 'conservative_focus' | 'minimal_safe';
    reasoning: string;
  } {
    const confidence = m1Output.confidence * 100; // 转换为0-100分
    
    if (confidence >= this.config.highConfidenceThreshold) {
      return {
        confidenceLevel: 'high',
        strategy: 'active_expansion',
        reasoning: `高置信度(${confidence.toFixed(1)}分)，主体和意图明确，采用主动扩展策略，深度补全细节`
      };
    } else if (confidence >= this.config.mediumConfidenceThreshold) {
      return {
        confidenceLevel: 'medium',
        strategy: 'conservative_focus',
        reasoning: `中等置信度(${confidence.toFixed(1)}分)，主体和意图大致明确，采用保守聚焦策略，聚焦核心维度`
      };
    } else {
      return {
        confidenceLevel: 'low',
        strategy: 'minimal_safe',
        reasoning: `低置信度(${confidence.toFixed(1)}分)，主体和意图模糊，采用极简安全策略，避免错误补全`
      };
    }
  }

  /**
   * 构建API调用的消息
   */
  private buildMessages(input: M2Input, strategy: any): Message[] {
    const { m1Output, preference, targetModel } = input;
    
    // 构建system prompt
    const systemPrompt = this.buildSystemPrompt(m1Output, preference, targetModel, strategy);
    
    // 构建user prompt
    const userPrompt = this.buildUserPrompt(m1Output);
    
    return [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];
  }

  /**
   * 构建system prompt
   */
  private buildSystemPrompt(
    m1Output: M1Output, 
    preference: M2Input['preference'], 
    targetModel: M2Input['targetModel'],
    strategy: any
  ): string {
    let prompt = `你是专业的AI绘画信息补全助手。你的任务是基于模块1的解析结果，按6大维度补全关键信息。

核心任务：
1. 主体与特征：明确"画什么"，补全特征细节和动作状态
2. 风格与流派：明确"画成什么风格"，补全艺术风格和风格化参数
3. 场景与环境：明确"在哪里"，补全核心场景和环境元素
4. 视角与构图：明确"从什么角度画"，补全拍摄视角和构图方式
5. 技术与参数：明确"生成质量标准"，补全分辨率和渲染质量
6. 负面提示：明确"避免什么"，补全通用和模型特定负面词

补全策略：${strategy.strategy}
置信度等级：${strategy.confidenceLevel}
策略说明：${strategy.reasoning}

重要规则：
1. 基于模块1的coreSubject进行主体补全，不得偏离核心
2. 基于coreIntent确定补全方向，优先满足用户明确需求
3. 基于implicitNeeds挖掘补全细节，满足潜在期望
4. 补全内容要自然化表达，避免机械罗列
5. 所有补全内容都要标记来源和类型

风格补全指导：
- 如果coreIntent是"未指定风格"，不要默认选择写实风格
- 根据主体类型和隐含需求选择合适风格：
  * 人物主体：可选择写实、卡通、水彩、油画、素描等
  * 动物主体：可选择可爱卡通、写实、水彩、插画等
  * 风景主体：可选择写实、水彩、油画、国画等
- 优先考虑用户偏好信息中的常用风格
- 避免总是选择写实风格，要多样化选择

输出格式要求：
- 必须返回JSON格式
- 包含6大维度的详细补全结果
- 包含补全标记信息
- 包含最终补全结果（自然语言描述）

示例输出：
{
  "subjectAndFeatures": {
    "coreSubject": "一只成年橘猫",
    "featureDetails": "橘色毛发用淡墨勾勒，毛尖晕着浅灰，一只眼睛是浓墨点的圆瞳，另一只泛着浅蓝",
    "actionState": "蜷在木质窗台上，尾巴像一抹墨色拖在桌面，偶尔轻轻扫过窗沿"
  },
  "styleAndGenre": {
    "artStyle": "水彩风格",
    "styleParameters": "清新淡雅的水彩渲染，色彩柔和自然，笔触轻盈流畅",
    "referenceSource": ""
  },
  "sceneAndEnvironment": {
    "coreScene": "室内窗台（铺着浅灰针织垫）",
    "environmentElements": "窗台上放着一本翻开的线装书，书页边缘有些泛黄，猫爪偶尔碰一下书页",
    "lightAtmosphere": "柔和的自然光从左侧窗户射入，在猫身上投下淡影，暖色调不刺眼"
  },
  "perspectiveAndComposition": {
    "shootingPerspective": "平视中景，清晰展现猫的动作与周边窗台场景",
    "compositionMethod": "居中构图，猫位于画面中心，背景轻微虚化",
    "subjectRatio": "约60%，突出猫的细节，背景不抢注意力"
  },
  "technicalParameters": {
    "resolution": "4K（平衡水彩风格的细节与生成速度）",
    "renderQuality": "水彩风格专用渲染，色彩渐变自然，笔触轻盈",
    "detailIntensity": "毛发用柔和色彩渲染，不追求写实纹理，符合水彩艺术感"
  },
  "negativePrompts": {
    "generalNegative": ["blurry", "low quality", "deformed"],
    "modelSpecificNegative": ["bad hands", "messy background"]
  },
  "completionMarks": {
    "coreSubject": {"isOriginal": true, "isEnhanced": true, "isAdded": false, "source": "m1_output"},
    "artStyle": {"isOriginal": false, "isEnhanced": false, "isAdded": true, "source": "preference"}
  },
  "completionStrategy": {
    "confidenceLevel": "high",
    "strategy": "active_expansion",
    "reasoning": "高置信度，主体和意图明确，采用主动扩展策略"
  },
  "finalResult": "一只成年橘猫蜷在木质窗台上，橘色毛发用柔和的水彩渲染，毛尖晕着浅灰，一只眼睛是深蓝的圆瞳，另一只泛着浅蓝。尾巴像一抹水彩拖在桌面，偶尔轻轻扫过窗沿。室内窗台铺着浅灰针织垫，窗台上放着一本翻开的线装书，书页边缘有些泛黄，猫爪偶尔碰一下书页。柔和的自然光从左侧窗户射入，在猫身上投下淡影，暖色调不刺眼。平视中景，居中构图，猫位于画面中心，背景轻微虚化，约60%占比突出猫的细节。4K分辨率，水彩风格专用渲染，色彩渐变自然，笔触轻盈，毛发用柔和色彩渲染，符合水彩艺术感。"
}`;

    // 添加用户偏好信息
    if (preference) {
      prompt += `\n\n用户偏好信息：`;
      if (preference.preferredStyle) {
        prompt += `\n- 常用风格：${preference.preferredStyle}`;
      }
      if (preference.commonSubjects && preference.commonSubjects.length > 0) {
        prompt += `\n- 常用主体：${preference.commonSubjects.join(', ')}`;
      }
      if (preference.preferredScenes && preference.preferredScenes.length > 0) {
        prompt += `\n- 常用场景：${preference.preferredScenes.join(', ')}`;
      }
      if (preference.preferredResolution) {
        prompt += `\n- 常用分辨率：${preference.preferredResolution}`;
      }
      if (preference.historyFeedback && preference.historyFeedback.length > 0) {
        prompt += `\n- 历史反馈：${preference.historyFeedback.join(', ')}`;
      }
    }

    // 添加目标模型信息
    if (targetModel) {
      prompt += `\n\n目标模型：${targetModel}`;
    }

    return prompt;
  }

  /**
   * 构建user prompt
   */
  private buildUserPrompt(m1Output: M1Output): string {
    return `请基于以下模块1的解析结果进行信息补全：

模块1解析结果：
- 核心主体：${m1Output.coreSubject}
- 核心需求：${m1Output.coreIntent}
- 错误修正：${m1Output.corrections.join(', ') || '无'}
- 补全询问：${m1Output.clarificationQuestions?.join(', ') || '无'}
- 隐含需求：${m1Output.implicitNeeds ? JSON.stringify(m1Output.implicitNeeds) : '无'}
- 置信度：${m1Output.confidence}

请按照要求返回JSON格式的补全结果。`;
  }

  /**
   * 解析API响应
   */
  private parseResponse(rawResponse: string, m1Output: M1Output, strategy: any): M2Output {
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
      
      // 尝试修复被截断的JSON
      jsonStr = this.fixTruncatedJson(jsonStr);
      
      // 解析JSON
      const result = JSON.parse(jsonStr);
      
      // 验证必要字段
      if (!result.subjectAndFeatures || !result.styleAndGenre || !result.sceneAndEnvironment) {
        throw new Error('API响应缺少必要字段');
      }
      
      // 设置默认值
      return {
        subjectAndFeatures: result.subjectAndFeatures || {
          coreSubject: m1Output.coreSubject,
          featureDetails: '',
          actionState: ''
        },
        styleAndGenre: result.styleAndGenre || {
          artStyle: m1Output.coreIntent,
          styleParameters: '',
          referenceSource: ''
        },
        sceneAndEnvironment: result.sceneAndEnvironment || {
          coreScene: '',
          environmentElements: '',
          lightAtmosphere: ''
        },
        perspectiveAndComposition: result.perspectiveAndComposition || {
          shootingPerspective: '',
          compositionMethod: '',
          subjectRatio: ''
        },
        technicalParameters: result.technicalParameters || {
          resolution: '4K',
          renderQuality: '',
          detailIntensity: ''
        },
        negativePrompts: result.negativePrompts || {
          generalNegative: ['blurry', 'low quality', 'deformed'],
          modelSpecificNegative: []
        },
        completionMarks: result.completionMarks || {},
        completionStrategy: result.completionStrategy || strategy,
        finalResult: result.finalResult || ''
      };
      
    } catch (error) {
      console.error('解析API响应失败:', error);
      console.error('原始响应:', rawResponse);
      throw new Error(`API响应格式错误: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  /**
   * 修复被截断的JSON
   */
  private fixTruncatedJson(jsonStr: string): string {
    try {
      // 先尝试直接解析
      JSON.parse(jsonStr);
      return jsonStr;
    } catch (error) {
      // 如果解析失败，尝试修复
      console.warn('JSON被截断，尝试修复...');
      
      // 找到最后一个完整的对象
      let fixedJson = jsonStr;
      
      // 如果JSON以不完整的字符串结尾，尝试修复
      if (fixedJson.includes('"isEnh')) {
        // 修复被截断的completionMarks
        fixedJson = fixedJson.replace(/"isEnh[^"]*$/, '"isEnhanced": false, "isAdded": true, "source": "default"');
      }
      
      // 如果JSON以不完整的对象结尾，尝试补全
      if (fixedJson.endsWith(',')) {
        fixedJson = fixedJson.slice(0, -1);
      }
      
      // 如果JSON以不完整的字符串结尾，尝试补全
      if (fixedJson.match(/"[^"]*$/)) {
        fixedJson = fixedJson.replace(/"[^"]*$/, '""');
      }
      
      // 如果JSON以不完整的对象结尾，尝试补全
      if (fixedJson.match(/\{[^}]*$/)) {
        fixedJson = fixedJson.replace(/\{[^}]*$/, '{}');
      }
      
      // 如果JSON以不完整的数组结尾，尝试补全
      if (fixedJson.match(/\[[^\]]*$/)) {
        fixedJson = fixedJson.replace(/\[[^\]]*$/, '[]');
      }
      
      // 确保JSON以}结尾
      if (!fixedJson.endsWith('}')) {
        fixedJson += '}';
      }
      
      return fixedJson;
    }
  }

  /**
   * 验证解析结果
   */
  private validateResult(result: M2Output): void {
    // 验证必要字段
    if (!result.subjectAndFeatures || !result.styleAndGenre || !result.sceneAndEnvironment) {
      throw new Error('补全结果缺少必要字段');
    }
    
    if (!result.perspectiveAndComposition || !result.technicalParameters || !result.negativePrompts) {
      throw new Error('补全结果缺少必要字段');
    }
    
    // 验证补全标记
    if (!result.completionMarks || typeof result.completionMarks !== 'object') {
      throw new Error('补全标记信息无效');
    }
    
    // 验证补全策略
    if (!result.completionStrategy || !result.completionStrategy.confidenceLevel) {
      throw new Error('补全策略信息无效');
    }
  }
}

// 导出便捷函数
export async function completeUserInput(
  m1Output: M1Output, 
  preference?: M2Input['preference'],
  targetModel?: M2Input['targetModel']
): Promise<M2Output> {
  const completer = new Module2Completer();
  return completer.complete({ m1Output, preference, targetModel });
}
