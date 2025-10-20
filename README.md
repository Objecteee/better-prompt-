# React Image Prompt Optimizer (Template-driven)

一个最小可运行的示例，演示如何复用“模板驱动 + 上下文感知”的逻辑来优化 AI 绘画（文生图）提示词：
- 前端：React + Vite（TypeScript）
- 后端：Express 代理 DeepSeek（OpenAI 兼容 API），后端保存 API Key，前端不暴露密钥

## 目录结构

```
examples/react-image-optimizer/
  ├─ server/            # 后端代理（隐藏 DeepSeek 密钥）
  └─ client/            # React 前端（模板驱动优化逻辑）
```

## 运行步骤（Windows）

1) 配置并启动后端
```
cd examples/react-image-optimizer/server
pnpm install
copy .env.example .env  # 将 DEEPSEEK_API_KEY 写入 .env
pnpm dev
```

2) 启动前端
```
cd ../client
pnpm install
pnpm dev
```

3) 打开浏览器访问
```
http://localhost:5173
```

## 使用说明
- 在文本框中输入原始图像描述（例如：生成一张美女图片）。
- 点击“优化”，将根据内置模板将模糊描述改写为结构化的自然语言提示词：
  - 3–6 句自然语言
  - 维度：主体/动作/环境锚点 → 光线/时间/配色 → 氛围/风格（可选材质、构图/视角）
  - 关键名词配 2–3 个精准修饰词
  - 禁止参数/权重/负面清单，仅输出提示词本体

## 注意
- 不要在前端保存或暴露 API Key；仅在 `server/.env` 配置。
- 如需切换模型或自定义 baseURL，可在 `server/.env` 与 `server/index.js` 中调整。


