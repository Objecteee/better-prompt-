import React, { useState } from 'react';
import { parseUserInput, runModule1Tests, completeUserInput, runModule2Tests } from './core/pipeline';

export default function App() {
  const [input, setInput] = useState('生成一张美女图片');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testMode, setTestMode] = useState<'m1' | 'm1+m2'>('m1');
  const [showRawData, setShowRawData] = useState(true);

  const handleTestM1 = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const testResult = await parseUserInput(input);
      setResult({ module: 'M1', data: testResult });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTestM1M2 = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      // 先运行模块1
      const m1Result = await parseUserInput(input);
      
      // 再运行模块2
      const m2Result = await completeUserInput(m1Result, {
        preferredStyle: '写实风格',
        commonSubjects: ['美女', '女孩'],
        preferredScenes: ['室内', '窗台'],
        preferredResolution: '4K'
      });
      
      setResult({ 
        module: 'M1+M2', 
        m1: m1Result, 
        m2: m2Result 
      });
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
      if (testMode === 'm1') {
        await runModule1Tests();
        setResult({ message: '模块1测试已完成，请查看控制台输出' });
      } else {
        await runModule2Tests();
        setResult({ message: '模块2测试已完成，请查看控制台输出' });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: '40px auto', padding: 16, fontFamily: 'system-ui, sans-serif' }}>
      <h2>模块1+模块2测试 - 完整流程</h2>
      <p style={{ color: '#666' }}>测试基于API的模块1解析和模块2补全功能</p>

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
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontWeight: 600, marginRight: 16 }}>测试模式：</label>
          <label style={{ marginRight: 16 }}>
            <input 
              type="radio" 
              value="m1" 
              checked={testMode === 'm1'} 
              onChange={e => setTestMode(e.target.value as 'm1')}
              style={{ marginRight: 4 }}
            />
            仅模块1
          </label>
          <label>
            <input 
              type="radio" 
              value="m1+m2" 
              checked={testMode === 'm1+m2'} 
              onChange={e => setTestMode(e.target.value as 'm1+m2')}
              style={{ marginRight: 4 }}
            />
            模块1+模块2
          </label>
        </div>
        
        <button 
          onClick={testMode === 'm1' ? handleTestM1 : handleTestM1M2} 
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
          {loading ? '测试中...' : `测试${testMode === 'm1' ? '模块1' : '模块1+模块2'}`}
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
          {loading ? '运行中...' : `运行${testMode === 'm1' ? '模块1' : '模块2'}测试`}
        </button>
      </div>

      {result && (
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontWeight: 600, marginRight: 16 }}>显示选项：</label>
          <label>
            <input 
              type="checkbox" 
              checked={showRawData} 
              onChange={e => setShowRawData(e.target.checked)}
              style={{ marginRight: 4 }}
            />
            显示完整原始数据
          </label>
        </div>
      )}

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
          
          {result.module === 'M1' && (
            <div>
              <h4>模块1结果</h4>
              <div style={{
                backgroundColor: '#f8f9fa',
                border: '1px solid #dee2e6',
                padding: 12,
                borderRadius: 4,
                marginBottom: 16
              }}>
                <div><strong>核心主体：</strong>{result.data.coreSubject}</div>
                <div><strong>核心需求：</strong>{result.data.coreIntent}</div>
                <div><strong>置信度：</strong>{result.data.confidence}</div>
                {result.data.corrections.length > 0 && (
                  <div><strong>错误修正：</strong>{result.data.corrections.join(', ')}</div>
                )}
                {result.data.clarificationQuestions && result.data.clarificationQuestions.length > 0 && (
                  <div><strong>补全询问：</strong>{result.data.clarificationQuestions.join(', ')}</div>
                )}
                {result.data.implicitNeeds && (
                  <div><strong>隐含需求：</strong>{JSON.stringify(result.data.implicitNeeds)}</div>
                )}
              </div>
              
              {showRawData && (
                <div>
                  <h5 style={{ color: '#007bff', borderBottom: '2px solid #007bff', paddingBottom: '8px' }}>
                    📊 完整JSON数据结构
                  </h5>
                  <div style={{
                    backgroundColor: '#f8f9fa',
                    border: '2px solid #28a745',
                    padding: 16,
                    borderRadius: 8,
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'Consolas, Monaco, monospace',
                    fontSize: '13px',
                    maxHeight: '500px',
                    overflow: 'auto',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}>
                    {JSON.stringify(result.data, null, 2)}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {result.module === 'M1+M2' && (
            <div>
              <h4>模块1结果</h4>
              <div style={{
                backgroundColor: '#f8f9fa',
                border: '1px solid #dee2e6',
                padding: 12,
                borderRadius: 4,
                marginBottom: 16
              }}>
                <div><strong>核心主体：</strong>{result.m1.coreSubject}</div>
                <div><strong>核心需求：</strong>{result.m1.coreIntent}</div>
                <div><strong>置信度：</strong>{result.m1.confidence}</div>
              </div>
              
              <h4>模块2结果</h4>
              <div style={{
                backgroundColor: '#f8f9fa',
                border: '1px solid #dee2e6',
                padding: 12,
                borderRadius: 4,
                marginBottom: 16
              }}>
                <div><strong>补全策略：</strong>{result.m2.completionStrategy.strategy}</div>
                <div><strong>置信度等级：</strong>{result.m2.completionStrategy.confidenceLevel}</div>
                <div><strong>主体与特征：</strong>{result.m2.subjectAndFeatures.coreSubject}</div>
                <div><strong>风格与流派：</strong>{result.m2.styleAndGenre.artStyle}</div>
                <div><strong>场景与环境：</strong>{result.m2.sceneAndEnvironment.coreScene}</div>
                <div><strong>视角与构图：</strong>{result.m2.perspectiveAndComposition.shootingPerspective}</div>
                <div><strong>技术与参数：</strong>{result.m2.technicalParameters.resolution}</div>
                <div><strong>负面提示：</strong>{result.m2.negativePrompts.generalNegative.join(', ')}</div>
              </div>
              
              <h4>最终补全结果</h4>
              <div style={{
                backgroundColor: '#e8f5e8',
                border: '1px solid #c3e6c3',
                padding: 12,
                borderRadius: 4,
                whiteSpace: 'pre-wrap',
                fontFamily: 'monospace',
                fontSize: '14px',
                marginBottom: 16
              }}>
                {result.m2.finalResult}
              </div>
              
              {showRawData && (
                <div>
                  <h5 style={{ color: '#007bff', borderBottom: '2px solid #007bff', paddingBottom: '8px' }}>
                    📊 完整JSON数据结构
                  </h5>
                  
                  <div style={{ marginBottom: 20 }}>
                    <h6 style={{ color: '#28a745', marginBottom: '8px' }}>🔍 模块1 JSON数据</h6>
                    <div style={{
                      backgroundColor: '#f8f9fa',
                      border: '2px solid #28a745',
                      padding: 16,
                      borderRadius: 8,
                      whiteSpace: 'pre-wrap',
                      fontFamily: 'Consolas, Monaco, monospace',
                      fontSize: '13px',
                      maxHeight: '400px',
                      overflow: 'auto',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                      {JSON.stringify(result.m1, null, 2)}
                    </div>
                  </div>
                  
                  <div>
                    <h6 style={{ color: '#dc3545', marginBottom: '8px' }}>🔍 模块2 JSON数据</h6>
                    <div style={{
                      backgroundColor: '#f8f9fa',
                      border: '2px solid #dc3545',
                      padding: 16,
                      borderRadius: 8,
                      whiteSpace: 'pre-wrap',
                      fontFamily: 'Consolas, Monaco, monospace',
                      fontSize: '13px',
                      maxHeight: '500px',
                      overflow: 'auto',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                      {JSON.stringify(result.m2, null, 2)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {result.message && (
            <div style={{
              backgroundColor: '#d4edda',
              border: '1px solid #c3e6cb',
              padding: 12,
              borderRadius: 4,
              color: '#155724'
            }}>
              {result.message}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
