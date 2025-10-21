// 模块1的示例和测试用例

import { parseUserInput, Module1Parser } from '../modules/module1';
import { validateM1Output } from '../validators/module1';

// 测试用例
export const testCases = [
  {
    name: '简单输入',
    input: '生成一张美女图片',
    userContext: undefined,
    expected: {
      hasSubject: true,
      hasIntent: false,
      needsClarification: true
    }
  },
  {
    name: '风格明确',
    input: '画一只写实风格的猫',
    userContext: undefined,
    expected: {
      hasSubject: true,
      hasIntent: true,
      needsClarification: false
    }
  },
  {
    name: '错别字修正',
    input: '赛博朋客风格的女孩',
    userContext: undefined,
    expected: {
      hasCorrections: true,
      correctionsCount: 1
    }
  },
  {
    name: '隐含需求',
    input: '画秋天的风景',
    userContext: undefined,
    expected: {
      hasImplicitNeeds: true,
      hasMood: true,
      hasColorPalette: true
    }
  },
  {
    name: '带用户上下文',
    input: '画一个角色',
    userContext: {
      preferredStyle: '动漫风格',
      commonSubjects: ['女孩', '猫'],
      historyFeedback: ['希望更可爱一些']
    },
    expected: {
      hasSubject: true,
      hasIntent: true,
      needsClarification: false
    }
  },
  {
    name: '复杂输入',
    input: '画一个超写实风格的女孩，在秋天的公园里，特写镜头',
    userContext: undefined,
    expected: {
      hasSubject: true,
      hasIntent: true,
      hasImplicitNeeds: true,
      needsClarification: false
    }
  }
];

// 运行测试
export async function runModule1Tests() {
  console.log('开始模块1 API测试...');
  
  for (const testCase of testCases) {
    try {
      console.log(`\n测试: ${testCase.name}`);
      console.log(`输入: ${testCase.input}`);
      
      const result = await parseUserInput(testCase.input, testCase.userContext);
      
      // 验证输出格式
      if (!validateM1Output(result)) {
        console.error(`❌ ${testCase.name}: 输出格式验证失败`);
        continue;
      }
      
      // 验证预期结果
      const { expected } = testCase;
      
      if (expected.hasSubject && result.coreSubject === '未指定主体') {
        console.error(`❌ ${testCase.name}: 应该识别出主体`);
        continue;
      }
      
      if (expected.hasIntent && result.coreIntent === '未指定风格') {
        console.error(`❌ ${testCase.name}: 应该识别出风格`);
        continue;
      }
      
      if (expected.needsClarification && (!result.clarificationQuestions || result.clarificationQuestions.length === 0)) {
        console.error(`❌ ${testCase.name}: 应该需要补全询问`);
        continue;
      }
      
      if (expected.hasCorrections && result.corrections.length === 0) {
        console.error(`❌ ${testCase.name}: 应该识别出错误`);
        continue;
      }
      
      if (expected.hasImplicitNeeds && !result.implicitNeeds) {
        console.error(`❌ ${testCase.name}: 应该识别出隐含需求`);
        continue;
      }
      
      console.log(`✅ ${testCase.name}: 通过`);
      console.log(`   主体: ${result.coreSubject}`);
      console.log(`   需求: ${result.coreIntent}`);
      console.log(`   置信度: ${result.confidence.toFixed(2)}`);
      if (result.corrections.length > 0) {
        console.log(`   修正: ${result.corrections.join(', ')}`);
      }
      if (result.clarificationQuestions && result.clarificationQuestions.length > 0) {
        console.log(`   询问: ${result.clarificationQuestions.join(', ')}`);
      }
      if (result.implicitNeeds) {
        console.log(`   隐含: ${JSON.stringify(result.implicitNeeds)}`);
      }
      
    } catch (error) {
      console.error(`❌ ${testCase.name}: 执行失败`, error);
    }
  }
  
  console.log('\n模块1 API测试完成');
}

// 性能测试
export async function runPerformanceTest() {
  console.log('开始模块1性能测试...');
  
  const testInput = '画一个超写实风格的女孩，在秋天的公园里，特写镜头';
  const iterations = 5; // 减少测试次数，避免API调用过多
  
  const startTime = Date.now();
  
  for (let i = 0; i < iterations; i++) {
    try {
      await parseUserInput(testInput);
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
  console.log('开始模块1错误处理测试...');
  
  const errorTestCases = [
    {
      name: '空输入',
      input: '',
      shouldThrow: true
    },
    {
      name: '无效输入',
      input: '   ',
      shouldThrow: true
    },
    {
      name: '正常输入',
      input: '画一只猫',
      shouldThrow: false
    }
  ];
  
  for (const testCase of errorTestCases) {
    try {
      await parseUserInput(testCase.input);
      
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