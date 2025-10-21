import React, { useState } from 'react';
import { parseUserInput, runModule1Tests } from './core/pipeline';

export default function App() {
  const [input, setInput] = useState('生成一张美女图片');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTest = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const testResult = await parseUserInput(input);
      setResult(testResult);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRunTests = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await runModule1Tests();
      setResult({ message: '所有测试已完成，请查看控制台输出' });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 920, margin: '40px auto', padding: 16, fontFamily: 'system-ui, sans-serif' }}>
      <h2>模块1测试 - 原始输入解析</h2>
      <p style={{ color: '#666' }}>测试基于API的模块1功能</p>

      <div style={{ marginBottom: 16 }}>
        <label style={{ fontWeight: 600, display: 'block', marginBottom: 8 }}>测试输入</label>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          rows={3}
          style={{ width: '100%', padding: 12, boxSizing: 'border-box' }}
          placeholder="输入测试内容，如：生成一张美女图片"
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <button 
          onClick={handleTest} 
          disabled={loading}
          style={{ 
            padding: '8px 16px', 
            marginRight: 8,
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? '测试中...' : '测试模块1'}
        </button>
        
        <button 
          onClick={handleRunTests} 
          disabled={loading}
          style={{ 
            padding: '8px 16px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? '运行中...' : '运行所有测试'}
        </button>
      </div>

      {error && (
        <div style={{ 
          marginTop: 16, 
          padding: 12,
          backgroundColor: '#f8d7da',
          color: '#721c24',
          border: '1px solid #f5c6cb',
          borderRadius: 4
        }}>
          <strong>错误：</strong>{error}
        </div>
      )}

      {result && (
        <div style={{ marginTop: 16 }}>
          <h3>测试结果</h3>
          <div style={{
            backgroundColor: '#f8f9fa',
            border: '1px solid #dee2e6',
            padding: 12,
            borderRadius: 4,
            whiteSpace: 'pre-wrap',
            fontFamily: 'monospace',
            fontSize: '14px'
          }}>
            {JSON.stringify(result, null, 2)}
          </div>
        </div>
      )}
    </div>
  );
}
