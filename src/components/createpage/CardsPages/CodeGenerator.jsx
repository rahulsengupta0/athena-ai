import React, { useMemo, useState } from 'react'

const wrapper = { background: '#fff', border: '1.6px solid #efeefa', borderRadius: 16, boxShadow: '0 3px 16px #e9e4f33d' }

const LANGS = ['typescript', 'javascript', 'python']
const FRAMEWORKS = ['react', 'node', 'django']

const CodeGenerator = () => {
  const [language, setLanguage] = useState('typescript')
  const [framework, setFramework] = useState('react')
  const [prompt, setPrompt] = useState('Build a modal dialog component with animations')
  const [isLoading, setIsLoading] = useState(false)
  const [code, setCode] = useState('')

  const lineCount = useMemo(() => code ? code.split('\n').length : 0, [code])

  const generateDemoCode = () => {
    const header = `// AI Generated ${language.toUpperCase()} Code\n// Framework: ${framework}\n// Prompt: ${prompt}\n`
    if (language === 'typescript' && framework === 'react') {
      return (
`${header}
import React, { useState, useEffect } from 'react';

type ModalProps = {
  title: string;
  isOpen: boolean;
  onClose: () => void;
};

export const GeneratedModal: React.FC<ModalProps> = ({ title, isOpen, onClose, children }) => {
  const [visible, setVisible] = useState(isOpen);

  useEffect(() => {
    if (isOpen) setVisible(true);
  }, [isOpen]);

  const handleBackdrop = () => {
    setVisible(false);
    setTimeout(onClose, 180);
  };

  if (!isOpen && !visible) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.35)', transition: 'opacity 180ms ease'
    }} onClick={handleBackdrop}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ width: 520, background: '#0b0e12', color: '#e6f1ff', borderRadius: 12, padding: 18,
                 transform: isOpen ? 'scale(1)' : 'scale(0.96)', transition: 'transform 180ms ease' }}
      >
        <div style={{ fontWeight: 800, marginBottom: 8 }}>{title}</div>
        <div>{children}</div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
          <button onClick={handleBackdrop} style={{ padding: '8px 12px', borderRadius: 8 }}>Close</button>
        </div>
      </div>
    </div>
  );
};
`
      )
    }

    if (language === 'javascript') {
      return (
`${header}
function hello(name){
  return 'Hello, ' + name + '!';
}

console.log(hello('World'));
`
      )
    }

    // python
    return (
`${header}
def hello(name: str) -> str:
    return f"Hello, {name}!"

if __name__ == "__main__":
    print(hello("World"))
`
    )
  }

const onGenerate = async () => {
  if (!prompt.trim()) return;
  setIsLoading(true);
  setCode('');
  try {
    const response = await fetch('http://localhost:5000/api/codegen/generate-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, language, framework }),
    });

    if (!response.ok) {
      const errData = await response.json();
      setCode(`Error: ${errData.error || 'Failed to generate code'}`);
      setIsLoading(false);
      return;
    }

    const data = await response.json();
    setCode(data.code || '');
  } catch (error) {
    setCode(`Error: ${error.message}`);
  } finally {
    setIsLoading(false);
  }
};


  const copyCode = async () => {
    try { await navigator.clipboard.writeText(code) } catch (_) {}
  }

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <div style={{ width: 38, height: 38, borderRadius: 12, background: '#ffe8db', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f85c2c', fontWeight: 800, fontSize: 20 }}>🧩</div>
        <div>
          <div style={{ fontSize: '1.55rem', fontWeight: 800, color: '#1a1f47' }}>AI Code Generator</div>
          <div style={{ color: '#858ab0' }}>Generate and optimize code snippets</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        {/* Left column: Prompt & Controls */}
        <div style={{ ...wrapper, padding: 16 }}>
          <div style={{ fontWeight: 800, color: '#1b1f4b', marginBottom: 10 }}>Request</div>
          <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Describe what to generate..." style={{ width: '100%', minHeight: 140, borderRadius: 12, border: '1.4px solid #ebe9fb', padding: 14, outline: 'none', fontSize: '1rem', color: '#2a2f60' }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
            <div>
              <div style={{ color: '#6a6fa1', fontWeight: 700, marginBottom: 6 }}>Language</div>
              <select value={language} onChange={(e) => setLanguage(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #ebe9fb', color: '#3b3f70', fontWeight: 700 }}>
                {LANGS.map((l) => (<option key={l} value={l}>{l}</option>))}
              </select>
            </div>
            <div>
              <div style={{ color: '#6a6fa1', fontWeight: 700, marginBottom: 6 }}>Framework</div>
              <select value={framework} onChange={(e) => setFramework(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #ebe9fb', color: '#3b3f70', fontWeight: 700 }}>
                {FRAMEWORKS.map((f) => (<option key={f} value={f}>{f}</option>))}
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
            <button onClick={onGenerate} disabled={isLoading || !prompt.trim()} style={{ background: 'linear-gradient(90deg,#f85c2c 18%,#ff9d66 98%)', color: '#fff', fontWeight: 800, fontSize: '1rem', padding: '10px 16px', borderRadius: 12, border: 'none', opacity: isLoading || !prompt.trim() ? 0.7 : 1, cursor: isLoading || !prompt.trim() ? 'not-allowed' : 'pointer' }}>{isLoading ? 'Generating...' : 'Generate Code'}</button>
            <button onClick={() => setCode('')} style={{ background: '#f5f4fe', color: '#5b61a3', fontWeight: 800, fontSize: '1rem', padding: '10px 16px', borderRadius: 12, border: '1px solid #ebe9fb', cursor: 'pointer' }}>Clear</button>
          </div>
        </div>

        {/* Right column: Tips */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ ...wrapper, padding: 16 }}>
            <div style={{ fontWeight: 800, color: '#1b1f4b', marginBottom: 8 }}>Suggestions</div>
            <ul style={{ margin: 0, paddingLeft: 18, color: '#6a6fa1', lineHeight: 1.6 }}>
              <li>Specify language and framework clearly</li>
              <li>Mention state management or libraries if needed</li>
              <li>Provide function signatures or types</li>
              <li>Request comments and documentation</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Generated Code section */}
      {code && (
        <div style={{ marginTop: 16 }}>
          <div style={{ fontWeight: 800, color: '#1b1f4b', marginBottom: 8 }}>Generated Code</div>
          <div style={{ ...wrapper, padding: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 12 }}>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ padding: '6px 10px', borderRadius: 999, background: '#f1effd', border: '1px solid #ebe9fb', color: '#6169a5', fontWeight: 800 }}>{language}</span>
                <span style={{ padding: '6px 10px', borderRadius: 999, background: '#f1effd', border: '1px solid #ebe9fb', color: '#6169a5', fontWeight: 800 }}>{framework}</span>
                <span style={{ padding: '6px 10px', borderRadius: 999, background: '#f1effd', border: '1px solid #ebe9fb', color: '#6169a5', fontWeight: 800 }}>{lineCount} lines</span>
              </div>
              <button onClick={copyCode} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', borderRadius: 10, border: '1px solid #ebe9fb', background: '#fff', color: '#414781', cursor: 'pointer', marginRight: 8 }}>📋 Copy Code</button>
            </div>
            <div style={{ background: '#0b0e12', color: '#a7ffb5', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace', padding: 16, borderBottomLeftRadius: 16, borderBottomRightRadius: 16, overflowX: 'auto' }}>
              <pre style={{ margin: 0, whiteSpace: 'pre' }}>{code}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CodeGenerator


