import React, { useState } from 'react';
import { optimizeImagePrompt, getClarification, optimizeImagePromptV2 } from './core/promptService';
import type { TargetModel } from './core/pipeline/types/pipeline';

export default function App() {
  const [input, setInput] = useState('生成一张美女图片');
  const [loading, setLoading] = useState(false);
  const [optimized, setOptimized] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [model, setModel] = useState<TargetModel>('Stable Diffusion');
  const [clarQuestions, setClarQuestions] = useState<string[] | null>(null);
  const [clarAnswer, setClarAnswer] = useState('');
  const [versions, setVersions] = useState<Array<{ kind: string; prompt: string; negativePrompt?: string }> | null>(null);
  const [editSuggestions, setEditSuggestions] = useState<{ subject: string[]; scene: string[]; style: string[]; technical: string[] } | null>(null);
  const [feedbackPrompts, setFeedbackPrompts] = useState<string[] | null>(null);

  const handleOptimize = async () => {
    setError(null);
    setOptimized('');
    setLoading(true);
    try {
      const out = await optimizeImagePrompt(input);
      setOptimized(out);
    } catch (e: any) {
      setError(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  };

  const handleClarifyThenOptimize = async () => {
    setError(null);
    setOptimized('');
    setVersions(null);
    setEditSuggestions(null);
    setFeedbackPrompts(null);
    setClarQuestions(null);
    setLoading(true);
    try {
      const m1 = await getClarification(input);
      if (m1.clarificationQuestions && m1.clarificationQuestions.length > 0) {
        setClarQuestions(m1.clarificationQuestions);
        // 等待用户回答，先不继续
      } else {
        const result = await optimizeImagePromptV2(input, model);
        setOptimized(result.m4.adaptedPrompt);
        setVersions(result.m5.versions);
        setEditSuggestions(result.m6.editSuggestions);
        setFeedbackPrompts(result.m6.feedbackPrompts);
      }
    } catch (e: any) {
      setError(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitClarification = async () => {
    if (!clarQuestions || !clarQuestions.length) return;
    setLoading(true);
    setError(null);
    try {
      const result = await optimizeImagePromptV2(input, model, { supplement: clarAnswer });
      setOptimized(result.m4.adaptedPrompt);
      setVersions(result.m5.versions);
      setEditSuggestions(result.m6.editSuggestions);
      setFeedbackPrompts(result.m6.feedbackPrompts);
      setClarQuestions(null);
      setClarAnswer('');
    } catch (e: any) {
      setError(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 920, margin: '40px auto', padding: 16, fontFamily: 'system-ui, sans-serif' }}>
      <h2>Image Prompt Optimizer (Template-driven)</h2>
      <p style={{ color: '#666' }}>将模糊的图像描述重写为结构化的自然语言提示词（302.ai GPT-3.5-turbo）</p>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
        <label style={{ fontWeight: 600 }}>目标模型</label>
        <select value={model} onChange={e => setModel(e.target.value as TargetModel)}>
          <option value="Midjourney">Midjourney</option>
          <option value="Stable Diffusion">Stable Diffusion</option>
          <option value="DALL·E 3">DALL·E 3</option>
        </select>
      </div>

      <label style={{ fontWeight: 600 }}>原始提示词</label>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        rows={5}
        style={{ width: '100%', padding: 12, marginTop: 8, boxSizing: 'border-box' }}
        placeholder="例如：生成一张美女图片"
      />

      <div style={{ marginTop: 12 }}>
        <button onClick={handleOptimize} disabled={loading} style={{ padding: '8px 16px', marginRight: 8 }}>
          {loading ? '优化中…' : '优化'}
        </button>
        <button onClick={handleClarifyThenOptimize} disabled={loading} style={{ padding: '8px 16px' }}>
          {loading ? '新流程中…' : '优化（新流程）'}
        </button>
      </div>

      {error && (
        <div style={{ marginTop: 16, color: '#b00020' }}>
          错误：{error}
        </div>
      )}

      {optimized && (
        <>
          <h3 style={{ marginTop: 24 }}>优化后的提示词</h3>
          <div
            style={{
              whiteSpace: 'pre-wrap',
              background: '#fafafa',
              border: '1px solid #eee',
              padding: 12,
              borderRadius: 6
            }}
          >
            {optimized}
          </div>
        </>
      )}

      {clarQuestions && (
        <div style={{ marginTop: 24, border: '1px solid #eee', padding: 12, borderRadius: 6 }}>
          <h3>需要补充的信息</h3>
          <ol>
            {clarQuestions.map((q, i) => (
              <li key={i} style={{ marginBottom: 4 }}>{q}</li>
            ))}
          </ol>
          <textarea
            value={clarAnswer}
            onChange={e => setClarAnswer(e.target.value)}
            rows={4}
            style={{ width: '100%', padding: 8, boxSizing: 'border-box' }}
            placeholder="在此补充你的回答（可逐条回答）"
          />
          <div style={{ marginTop: 8 }}>
            <button onClick={handleSubmitClarification} disabled={loading} style={{ padding: '6px 12px' }}>提交补充并继续</button>
          </div>
        </div>
      )}

      {versions && (
        <div style={{ marginTop: 24 }}>
          <h3>多版本结果</h3>
          <ul>
            {versions.map((v, i) => (
              <li key={i} style={{ marginBottom: 12 }}>
                <div style={{ fontWeight: 600 }}>{i + 1}. {v.kind}</div>
                <div style={{ whiteSpace: 'pre-wrap' }}>{v.prompt}</div>
                {v.negativePrompt && (
                  <div style={{ color: '#555', marginTop: 4 }}>Negative: {v.negativePrompt}</div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {editSuggestions && (
        <div style={{ marginTop: 24 }}>
          <h3>按维度编辑建议</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <div style={{ fontWeight: 600 }}>主体</div>
              <ul>{editSuggestions.subject.map((s, i) => (<li key={i}>{s}</li>))}</ul>
            </div>
            <div>
              <div style={{ fontWeight: 600 }}>场景</div>
              <ul>{editSuggestions.scene.map((s, i) => (<li key={i}>{s}</li>))}</ul>
            </div>
            <div>
              <div style={{ fontWeight: 600 }}>风格</div>
              <ul>{editSuggestions.style.map((s, i) => (<li key={i}>{s}</li>))}</ul>
            </div>
            <div>
              <div style={{ fontWeight: 600 }}>技术参数</div>
              <ul>{editSuggestions.technical.map((s, i) => (<li key={i}>{s}</li>))}</ul>
            </div>
          </div>
        </div>
      )}

      {feedbackPrompts && (
        <div style={{ marginTop: 24 }}>
          <h3>反馈话术建议</h3>
          <ul>
            {feedbackPrompts.map((f, i) => (<li key={i}>{f}</li>))}
          </ul>
        </div>
      )}
    </div>
  );
}
