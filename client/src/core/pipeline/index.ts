// 模块1的导出入口

export { Module1Parser, parseUserInput } from './modules/module1';
export type { M1Input, M1Output, M1Config } from './types/module1';
export { validateM1Output, validateM1Input, validateM1Config } from './validators/module1';
export { testCases, runModule1Tests, runPerformanceTest, runErrorHandlingTest } from './examples/module1';