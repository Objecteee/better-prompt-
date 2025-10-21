// 模块1：原始输入解析 - 基于API调用

import { callOptimizerAPI } from '../../llm';
import type { Message } from '../../templateProcessor';
import type { M1Input, M1Output, M1Config } from '../types/module1';

export class Module1Parser {
  private config: M1Config;
  
  constructor(config: Partial<M1Config> = {}) {
    this.config = {
      temperature: 0.2,
      maxTokens: 250,
      model: 'gpt-3.5-turbo-0125',
      enableAutoCorrection: true,
      enableClarification: true,
      maxClarificationQuestions: 3,
      confidenceThreshold: 0.7,
      ...config
    };
  }

  /**
   * 解析用户原始输入，通过API调用提取核心信息
   */
  async parse(input: M1Input): Promise<M1Output> {
    try {
      // 构建API调用的消息
      const messages = this.buildMessages(input);
      
      // 调用API
      const rawResponse = await callOptimizerAPI(messages, {
        model: this.config.model,
        llmParams: {
          temperature: this.config.temperature,
          max_tokens: this.config.maxTokens
        }
      });
      
      // 解析API响应
      const result = this.parseResponse(rawResponse);
      
      // 验证结果
      this.validateResult(result);
      
      return result;
      
    } catch (error) {
      console.error('模块1 API调用失败:', error);
      throw new Error(`模块1解析失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  /**
   * 构建API调用的消息
   */
  private buildMessages(input: M1Input): Message[] {
    const { originalInput, userContext } = input;
    
    // 构建system prompt
    const systemPrompt = this.buildSystemPrompt(userContext);
    
    // 构建user prompt
    const userPrompt = this.buildUserPrompt(originalInput);
    
    return [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];
  }

  /**
   * 构建system prompt
   */
  private buildSystemPrompt(userContext?: M1Input['userContext']): string {
    let prompt = `你是专业的AI绘画提示词解析助手。你的任务是分析用户的绘画需求，提取核心信息并修正错误。

核心任务：
1. 提取核心主体（用户想画什么）
2. 提取核心需求（用户明确提到的风格/感觉，未明确则写"未指定风格"）
3. 自动修正错别字和模糊表述
4. 识别隐含需求（仅基于用户上下文进行推断）
5. 生成补全询问（如果信息不足）

重要规则：
- 只有用户明确提到的风格才写入coreIntent，不要自行推断
- 如果用户只说"画美女"，coreIntent应该是"未指定风格"
- 补全询问要针对缺失的关键信息，不要重复已识别的信息
- 隐含需求仅基于用户上下文进行推断，没有上下文则写"未指定"

输出格式要求：
- 必须返回JSON格式
- 字段：coreSubject, coreIntent, corrections, clarificationQuestions, implicitNeeds, confidence
- corrections是字符串数组，记录修正内容
- clarificationQuestions是字符串数组，最多3个问题
- implicitNeeds包含mood, colorPalette, composition，仅基于用户上下文推断
- confidence是0-1之间的数字

示例输出：
{
  "coreSubject": "女孩",
  "coreIntent": "未指定风格",
  "corrections": ["赛博朋客 → 赛博朋克"],
  "clarificationQuestions": ["您希望什么风格？（如：写实、卡通、水彩等）", "您希望什么场景环境？"],
  "implicitNeeds": {
    "mood": "未指定",
    "colorPalette": "未指定",
    "composition": "未指定"
  },
  "confidence": 0.6
}`;

    // 如果有用户上下文，添加到提示中
    if (userContext) {
      prompt += `\n\n用户上下文信息：`;
      if (userContext.preferredStyle) {
        prompt += `\n- 常用风格：${userContext.preferredStyle}`;
      }
      if (userContext.commonSubjects && userContext.commonSubjects.length > 0) {
        prompt += `\n- 常用主体：${userContext.commonSubjects.join(', ')}`;
      }
      if (userContext.historyFeedback && userContext.historyFeedback.length > 0) {
        prompt += `\n- 历史反馈：${userContext.historyFeedback.join(', ')}`;
      }
    }

    // 添加隐含需求推断指导
    prompt += `\n\n隐含需求推断指导：
- 不要基于主体类型进行默认推导
- 仅根据用户上下文信息（preference）进行推断
- 如果用户上下文中有偏好信息，可以基于此推断implicitNeeds
- 如果没有用户上下文信息，则所有implicitNeeds字段都写"未指定"
- 不要进行任何主观推测或默认假设`;

    return prompt;
  }

  /**
   * 构建user prompt
   */
  private buildUserPrompt(originalInput: string): string {
    return `请分析以下用户输入，提取核心信息：

用户输入：${originalInput}

请按照要求返回JSON格式的解析结果。`;
  }

  /**
   * 解析API响应
   */
  private parseResponse(rawResponse: string): M1Output {
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
      if (!result.coreSubject || !result.coreIntent) {
        throw new Error('API响应缺少必要字段');
      }
      
      // 设置默认值
      return {
        coreSubject: result.coreSubject || '未指定主体',
        coreIntent: result.coreIntent || '未指定风格',
        corrections: Array.isArray(result.corrections) ? result.corrections : [],
        clarificationQuestions: Array.isArray(result.clarificationQuestions) ? result.clarificationQuestions : undefined,
        implicitNeeds: result.implicitNeeds || undefined,
        confidence: typeof result.confidence === 'number' ? result.confidence : 0.5
      };
      
    } catch (error) {
      console.error('解析API响应失败:', error);
      console.error('原始响应:', rawResponse);
      throw new Error(`API响应格式错误: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  /**
   * 验证解析结果
   */
  private validateResult(result: M1Output): void {
    // 验证必要字段
    if (!result.coreSubject || typeof result.coreSubject !== 'string') {
      throw new Error('coreSubject字段无效');
    }
    
    if (!result.coreIntent || typeof result.coreIntent !== 'string') {
      throw new Error('coreIntent字段无效');
    }
    
    if (!Array.isArray(result.corrections)) {
      throw new Error('corrections字段必须是数组');
    }
    
    if (result.clarificationQuestions !== undefined && !Array.isArray(result.clarificationQuestions)) {
      throw new Error('clarificationQuestions字段必须是数组');
    }
    
    if (typeof result.confidence !== 'number' || result.confidence < 0 || result.confidence > 1) {
      throw new Error('confidence字段必须是0-1之间的数字');
    }
    
    // 验证补全询问数量
    if (result.clarificationQuestions && result.clarificationQuestions.length > this.config.maxClarificationQuestions) {
      throw new Error(`补全询问数量超过限制（${this.config.maxClarificationQuestions}个）`);
    }
  }
}

// 导出便捷函数
export async function parseUserInput(input: string, userContext?: M1Input['userContext']): Promise<M1Output> {
  const parser = new Module1Parser();
  return parser.parse({ originalInput: input, userContext });
}