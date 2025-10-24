import type { M4Input, M4Output, SupportedModel } from '../types/module4';
import { adaptToModel } from '../modules/module4';

// 测试用例
export const module4TestCases: Array<{
  name: string;
  input: M4Input;
  expectedOutput?: Partial<M4Output>;
}> = [
  {
    name: '腾讯混元图像 3.0 - 美女适配',
    input: {
      m3Output: {
        optimizedPrompt: '一位优雅的美女，水彩风格，站在室内窗台旁，柔和自然光，4K分辨率，高质量渲染',
        structureInfo: {
          coreInfo: '一位优雅的美女，水彩风格',
          sceneInfo: '站在室内窗台旁，柔和自然光',
          technicalInfo: '4K分辨率，高质量渲染',
          negativeInfo: '避免模糊、低质量、变形'
        },
        optimizationMarks: {
          reordered: true,
          grouped: true,
          weighted: false,
          simplified: true
        },
        optimizationStrategy: {
          level: 'enhanced',
          reasoning: '增强优化：重新排序+分组+简化表达，提升AI理解效果'
        },
        originalStructure: {
          subjectAndFeatures: '美女，优雅姿态，温柔表情',
          styleAndGenre: '水彩风格，清新淡雅',
          sceneAndEnvironment: '室内窗台，柔和光线',
          perspectiveAndComposition: '平视中景，居中构图',
          technicalParameters: '4K分辨率，高质量渲染',
          negativePrompts: '避免模糊、低质量、变形'
        }
      },
      targetModel: '腾讯混元图像 3.0'
    },
    expectedOutput: {
      adaptationMarks: {
        detailedScene: true,
        styleSpecified: true,
        elementsCombined: true,
        fontDesigned: false,
        naturalLanguage: false,
        applicationScene: false,
        textRendering: false,
        keywordArranged: false,
        universalArchitecture: false,
        preciseStructure: false,
        layeredDescription: false,
        multiDimensional: false
      }
    }
  },
  {
    name: '字节跳动 Seedream 4.0 - 猫咪适配',
    input: {
      m3Output: {
        optimizedPrompt: '一只可爱的橘猫，卡通风格，趴在窗台上晒太阳，背景是城市街景，画面简洁清新',
        structureInfo: {
          coreInfo: '一只可爱的橘猫，卡通风格',
          sceneInfo: '趴在窗台上晒太阳，背景是城市街景',
          technicalInfo: '画面简洁清新',
          negativeInfo: '避免复杂背景'
        },
        optimizationMarks: {
          reordered: true,
          grouped: true,
          weighted: false,
          simplified: true
        },
        optimizationStrategy: {
          level: 'basic',
          reasoning: '基础优化：重新排序+分组，保持简洁'
        },
        originalStructure: {
          subjectAndFeatures: '橘猫，可爱表情，慵懒姿态',
          styleAndGenre: '卡通风格，简洁清新',
          sceneAndEnvironment: '窗台，城市背景',
          perspectiveAndComposition: '平视，居中构图',
          technicalParameters: '简洁清新',
          negativePrompts: '避免复杂背景'
        }
      },
      targetModel: '字节跳动 Seedream 4.0'
    },
    expectedOutput: {
      adaptationMarks: {
        detailedScene: false,
        styleSpecified: false,
        elementsCombined: false,
        fontDesigned: false,
        naturalLanguage: true,
        applicationScene: true,
        textRendering: false,
        keywordArranged: false,
        universalArchitecture: false,
        preciseStructure: false,
        layeredDescription: false,
        multiDimensional: false
      }
    }
  },
  {
    name: 'Stable Diffusion 3 - 风景适配',
    input: {
      m3Output: {
        optimizedPrompt: 'a majestic mountain peak, snow-capped, golden hour lighting, realistic style, 4K resolution, high quality',
        structureInfo: {
          coreInfo: 'a majestic mountain peak, realistic style',
          sceneInfo: 'snow-capped, golden hour lighting',
          technicalInfo: '4K resolution, high quality',
          negativeInfo: 'avoid blurry, low quality'
        },
        optimizationMarks: {
          reordered: true,
          grouped: true,
          weighted: false,
          simplified: true
        },
        optimizationStrategy: {
          level: 'advanced',
          reasoning: '高级优化：精确结构+分层描述，最大化AI理解效果'
        },
        originalStructure: {
          subjectAndFeatures: 'mountain peak, majestic',
          styleAndGenre: 'realistic style',
          sceneAndEnvironment: 'snow-capped, golden hour',
          perspectiveAndComposition: 'wide angle, rule of thirds',
          technicalParameters: '4K resolution, high quality',
          negativePrompts: 'avoid blurry, low quality'
        }
      },
      targetModel: 'Stable Diffusion 3'
    },
    expectedOutput: {
      adaptationMarks: {
        detailedScene: false,
        styleSpecified: false,
        elementsCombined: false,
        fontDesigned: false,
        naturalLanguage: false,
        applicationScene: false,
        textRendering: false,
        keywordArranged: false,
        universalArchitecture: false,
        preciseStructure: true,
        layeredDescription: true,
        multiDimensional: false
      }
    }
  },
  {
    name: 'Midjourney V6 - 人物适配',
    input: {
      m3Output: {
        optimizedPrompt: 'a beautiful woman in a red dress, standing in a garden, cinematic lighting, photorealistic style',
        structureInfo: {
          coreInfo: 'a beautiful woman in a red dress, photorealistic style',
          sceneInfo: 'standing in a garden, cinematic lighting',
          technicalInfo: 'high quality, detailed',
          negativeInfo: 'avoid blurry, deformed'
        },
        optimizationMarks: {
          reordered: true,
          grouped: true,
          weighted: false,
          simplified: true
        },
        optimizationStrategy: {
          level: 'enhanced',
          reasoning: '增强优化：多维度描述+精确参数，提升Midjourney生成效果'
        },
        originalStructure: {
          subjectAndFeatures: 'beautiful woman, red dress',
          styleAndGenre: 'photorealistic style',
          sceneAndEnvironment: 'garden, cinematic lighting',
          perspectiveAndComposition: 'full body, centered',
          technicalParameters: 'high quality, detailed',
          negativePrompts: 'avoid blurry, deformed'
        }
      },
      targetModel: 'Midjourney V6'
    },
    expectedOutput: {
      adaptationMarks: {
        detailedScene: false,
        styleSpecified: false,
        elementsCombined: false,
        fontDesigned: false,
        naturalLanguage: false,
        applicationScene: false,
        textRendering: false,
        keywordArranged: false,
        universalArchitecture: false,
        preciseStructure: false,
        layeredDescription: false,
        multiDimensional: true
      }
    }
  }
];

// 运行单个测试用例
export async function runModule4Test(testCase: typeof module4TestCases[0]): Promise<{
  success: boolean;
  result?: M4Output;
  error?: string;
  validation?: any;
}> {
  try {
    console.log(`\n🧪 运行测试: ${testCase.name}`);
    console.log(`📥 输入:`, testCase.input);
    
    const result = await adaptToModel(testCase.input);
    
    console.log(`📤 输出:`, result);
    
    // 验证输出
    const validation = {
      hasAdaptedPrompt: !!result.adaptedPrompt,
      hasModelParameters: !!result.modelParameters,
      hasAdaptationMarks: !!result.adaptationMarks,
      hasAdaptationStrategy: !!result.adaptationStrategy,
      hasOptimizationSuggestions: !!result.optimizationSuggestions
    };
    
    console.log(`✅ 验证结果:`, validation);
    
    return {
      success: true,
      result,
      validation
    };
  } catch (error) {
    console.error(`❌ 测试失败: ${testCase.name}`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

// 运行所有测试用例
export async function runAllModule4Tests(): Promise<{
  total: number;
  passed: number;
  failed: number;
  results: Array<{
    name: string;
    success: boolean;
    error?: string;
  }>;
}> {
  console.log('\n🚀 开始运行模块4所有测试用例...');
  
  const results: Array<{
    name: string;
    success: boolean;
    error?: string;
  }> = [];
  let passed = 0;
  let failed = 0;
  
  for (const testCase of module4TestCases) {
    const result = await runModule4Test(testCase);
    results.push({
      name: testCase.name,
      success: result.success,
      error: result.error
    });
    
    if (result.success) {
      passed++;
    } else {
      failed++;
    }
  }
  
  console.log(`\n📊 测试结果汇总:`);
  console.log(`总测试数: ${module4TestCases.length}`);
  console.log(`通过: ${passed}`);
  console.log(`失败: ${failed}`);
  console.log(`成功率: ${((passed / module4TestCases.length) * 100).toFixed(1)}%`);
  
  return {
    total: module4TestCases.length,
    passed,
    failed,
    results
  };
}

// 测试特定模型适配
export async function testModelAdaptation(targetModel: SupportedModel): Promise<{
  success: boolean;
  result?: M4Output;
  error?: string;
}> {
  const testInput: M4Input = {
    m3Output: {
      optimizedPrompt: '一位优雅的美女，水彩风格，站在室内窗台旁，柔和自然光，4K分辨率，高质量渲染',
      structureInfo: {
        coreInfo: '一位优雅的美女，水彩风格',
        sceneInfo: '站在室内窗台旁，柔和自然光',
        technicalInfo: '4K分辨率，高质量渲染',
        negativeInfo: '避免模糊、低质量、变形'
      },
      optimizationMarks: {
        reordered: true,
        grouped: true,
        weighted: false,
        simplified: true
      },
      optimizationStrategy: {
        level: 'enhanced',
        reasoning: '增强优化：重新排序+分组+简化表达，提升AI理解效果'
      },
      originalStructure: {
        subjectAndFeatures: '美女，优雅姿态，温柔表情',
        styleAndGenre: '水彩风格，清新淡雅',
        sceneAndEnvironment: '室内窗台，柔和光线',
        perspectiveAndComposition: '平视中景，居中构图',
        technicalParameters: '4K分辨率，高质量渲染',
        negativePrompts: '避免模糊、低质量、变形'
      }
    },
    targetModel
  };
  
  try {
    console.log(`\n🎯 测试模型适配: ${targetModel}`);
    const result = await adaptToModel(testInput);
    console.log(`✅ 适配成功:`, result);
    return { success: true, result };
  } catch (error) {
    console.error(`❌ 适配失败:`, error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}
