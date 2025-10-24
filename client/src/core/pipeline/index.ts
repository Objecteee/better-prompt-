// 模块1、模块2和模块3的导出入口

// 模块1
export { Module1Parser, parseUserInput } from './modules/module1';
export type { M1Input, M1Output, M1Config } from './types/module1';
export { validateM1Output, validateM1Input, validateM1Config } from './validators/module1';
export { testCases, runModule1Tests, runPerformanceTest, runErrorHandlingTest } from './examples/module1';

// 模块2
export { Module2Completer, completeUserInput } from './modules/module2';
export type { M2Input, M2Output, M2Config } from './types/module2';
export { validateM2Output, validateM2Input, validateM2Config } from './validators/module2';
export { testCases as m2TestCases, runModule2Tests, runPerformanceTest as runM2PerformanceTest, runErrorHandlingTest as runM2ErrorHandlingTest } from './examples/module2';

// 模块3
export { Module3Optimizer, optimizeExpression } from './modules/module3';
export type { M3Input, M3Output, M3Config } from './types/module3';

// 模块4
export { Module4Adapter, adaptToModel } from './modules/module4';
export type { M4Input, M4Output, M4Config, SupportedModel } from './types/module4';
export { Module4Validator } from './validators/module4';
export { module4TestCases, runModule4Test, runAllModule4Tests, testModelAdaptation } from './examples/module4';