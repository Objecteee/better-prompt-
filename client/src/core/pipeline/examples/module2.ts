// 模块2的示例和测试用例

import { completeUserInput, Module2Completer } from '../modules/module2';
import { validateM2Output } from '../validators/module2';
import type { M1Output } from '../types/module1';

// 测试用例
export const testCases = [
  {
    name: '简单输入 - 高置信度',
    m1Output: {
      coreSubject: '美女',
      coreIntent: '未指定风格',
      corrections: [],
      clarificationQuestions: ['您希望什么风格？（如：写实、卡通、水彩等）'],
      implicitNeeds: {
        mood: '优雅',
        colorPalette: '未指定',
        composition: '未指定'
      },
      confidence: 0.9
    } as M1Output,
    preference: {
      preferredStyle: '写实风格',
      commonSubjects: ['美女', '女孩'],
      preferredScenes: ['室内', '窗台'],
      preferredResolution: '4K'
    },
    expected: {
      hasAllDimensions: true,
      hasCompletionMarks: true,
      hasFinalResult: true,
      strategy: 'active_expansion'
    }
  },
  {
    name: '复杂输入 - 中等置信度',
    m1Output: {
      coreSubject: '橘猫',
      coreIntent: '治愈风格',
      corrections: [],
      clarificationQuestions: [],
      implicitNeeds: {
        mood: '可爱',
        colorPalette: '暖色调',
        composition: '特写'
      },
      confidence: 0.7
    } as M1Output,
    preference: {
      preferredStyle: '卡通风格',
      commonSubjects: ['猫', '狗'],
      preferredScenes: ['室内', '窗台'],
      preferredResolution: '4K'
    },
    expected: {
      hasAllDimensions: true,
      hasCompletionMarks: true,
      hasFinalResult: true,
      strategy: 'conservative_focus'
    }
  },
  {
    name: '模糊输入 - 低置信度',
    m1Output: {
      coreSubject: '未知主体',
      coreIntent: '未指定风格',
      corrections: [],
      clarificationQuestions: ['您想画什么主体？'],
      implicitNeeds: undefined,
      confidence: 0.3
    } as M1Output,
    preference: undefined,
    expected: {
      hasAllDimensions: true,
      hasCompletionMarks: true,
      hasFinalResult: true,
      strategy: 'minimal_safe'
    }
  },
  {
    name: '带用户偏好',
    m1Output: {
      coreSubject: '女孩',
      coreIntent: '动漫风格',
      corrections: [],
      clarificationQuestions: [],
      implicitNeeds: {
        mood: '可爱',
        colorPalette: '明亮',
        composition: '特写'
      },
      confidence: 0.8
    } as M1Output,
    preference: {
      preferredStyle: '日式动漫',
      commonSubjects: ['女孩', '猫'],
      preferredScenes: ['校园', '室内'],
      preferredResolution: '8K',
      historyFeedback: ['希望更可爱一些', '喜欢双马尾']
    },
    expected: {
      hasAllDimensions: true,
      hasCompletionMarks: true,
      hasFinalResult: true,
      strategy: 'active_expansion'
    }
  }
];

// 运行测试
export async function runModule2Tests() {
  console.log('开始模块2 API测试...');
  
  for (const testCase of testCases) {
    try {
      console.log(`\n测试: ${testCase.name}`);
      console.log(`M1输出: ${JSON.stringify(testCase.m1Output, null, 2)}`);
      
      const result = await completeUserInput(
        testCase.m1Output, 
        testCase.preference
      );
      
      // 验证输出格式
      if (!validateM2Output(result)) {
        console.error(`❌ ${testCase.name}: 输出格式验证失败`);
        continue;
      }
      
      // 验证预期结果
      const { expected } = testCase;
      
      if (expected.hasAllDimensions) {
        const hasAll = result.subjectAndFeatures && result.styleAndGenre && 
                      result.sceneAndEnvironment && result.perspectiveAndComposition &&
                      result.technicalParameters && result.negativePrompts;
        if (!hasAll) {
          console.error(`❌ ${testCase.name}: 缺少必要维度`);
          continue;
        }
      }
      
      if (expected.hasCompletionMarks && Object.keys(result.completionMarks).length === 0) {
        console.error(`❌ ${testCase.name}: 缺少补全标记`);
        continue;
      }
      
      if (expected.hasFinalResult && !result.finalResult) {
        console.error(`❌ ${testCase.name}: 缺少最终结果`);
        continue;
      }
      
      if (expected.strategy && result.completionStrategy.strategy !== expected.strategy) {
        console.error(`❌ ${testCase.name}: 补全策略不匹配`);
        continue;
      }
      
      console.log(`✅ ${testCase.name}: 通过`);
      console.log(`   补全策略: ${result.completionStrategy.strategy}`);
      console.log(`   置信度等级: ${result.completionStrategy.confidenceLevel}`);
      console.log(`   主体: ${result.subjectAndFeatures.coreSubject}`);
      console.log(`   风格: ${result.styleAndGenre.artStyle}`);
      console.log(`   场景: ${result.sceneAndEnvironment.coreScene}`);
      console.log(`   最终结果长度: ${result.finalResult.length}字符`);
      
    } catch (error) {
      console.error(`❌ ${testCase.name}: 执行失败`, error);
    }
  }
  
  console.log('\n模块2 API测试完成');
}

// 性能测试
export async function runPerformanceTest() {
  console.log('开始模块2性能测试...');
  
  const testM1Output: M1Output = {
    coreSubject: '美女',
    coreIntent: '写实风格',
    corrections: [],
    clarificationQuestions: [],
    implicitNeeds: {
      mood: '优雅',
      colorPalette: '暖色调',
      composition: '特写'
    },
    confidence: 0.8
  };
  
  const iterations = 3; // 减少测试次数，避免API调用过多
  
  const startTime = Date.now();
  
  for (let i = 0; i < iterations; i++) {
    try {
      await completeUserInput(testM1Output);
    } catch (error) {
      console.error(`第${i+1}次调用失败:`, error);
    }
  }
  
  const endTime = Date.now();
  const totalTime = endTime - startTime;
  const avgTime = totalTime / iterations;
  
  console.log(`性能测试结果:`);
  console.log(`  总时间: ${totalTime}ms`);
  console.log(`  平均时间: ${avgTime.toFixed(2)}ms`);
  console.log(`  成功调用: ${iterations}次`);
}

// 错误处理测试
export async function runErrorHandlingTest() {
  console.log('开始模块2错误处理测试...');
  
  const errorTestCases = [
    {
      name: '无效M1输出',
      m1Output: null as any,
      shouldThrow: true
    },
    {
      name: '缺少必要字段',
      m1Output: {
        coreSubject: '',
        coreIntent: '',
        confidence: 0.5
      } as any,
      shouldThrow: true
    },
    {
      name: '正常M1输出',
      m1Output: {
        coreSubject: '猫',
        coreIntent: '写实风格',
        corrections: [],
        clarificationQuestions: [],
        implicitNeeds: undefined,
        confidence: 0.8
      } as M1Output,
      shouldThrow: false
    }
  ];
  
  for (const testCase of errorTestCases) {
    try {
      await completeUserInput(testCase.m1Output);
      
      if (testCase.shouldThrow) {
        console.error(`❌ ${testCase.name}: 应该抛出错误但没有`);
      } else {
        console.log(`✅ ${testCase.name}: 正常处理`);
      }
    } catch (error) {
      if (testCase.shouldThrow) {
        console.log(`✅ ${testCase.name}: 正确抛出错误`);
      } else {
        console.error(`❌ ${testCase.name}: 不应该抛出错误`, error);
      }
    }
  }
}
