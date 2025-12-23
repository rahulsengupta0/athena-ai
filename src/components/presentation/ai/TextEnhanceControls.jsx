import React, { useState } from 'react';
import { enhancePresentationText } from './api';

const TextEnhanceControls = ({ layer, onApply }) => {
  const [mode, setMode] = useState('body');
  const [status, setStatus] = useState({ type: null, message: '' });
  const [isLoading, setIsLoading] = useState(false);

  if (!layer || layer.type !== 'text') {
    return null;
  }

  const handleEnhance = async () => {
    if (!layer.text?.trim()) {
      setStatus({ type: 'error', message: 'Add some text before enhancing.' });
      return;
    }

    setIsLoading(true);
    setStatus({ type: null, message: '' });
    try {
      const enhanced = await enhancePresentationText({
        text: layer.text,
        isHeading: mode === 'heading',
      });
      onApply?.(enhanced);
      setStatus({ type: 'success', message: 'Enhanced text applied' });
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Failed to enhance text' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        border: '1px solid rgba(148, 163, 184, 0.35)',
        borderRadius: 18,
        padding: 16,
        background: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>AI Text Enhance</div>
          <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>
            Send the current text to our AI to rewrite it.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        {[
          { value: 'heading', label: 'Heading' },
          { value: 'body', label: 'Body' },
        ].map((option) => (
          <button
            key={option.value}
            onClick={() => setMode(option.value)}
            style={{
              flex: 1,
              border: '1px solid rgba(148, 163, 184, 0.35)',
              borderRadius: 12,
              padding: '8px 0',
              background: mode === option.value ? 'rgba(79, 70, 229, 0.08)' : '#ffffff',
              fontWeight: 600,
              color: mode === option.value ? '#4f46e5' : '#0f172a',
              cursor: 'pointer',
            }}
          >
            {option.label}
          </button>
        ))}
      </div>

      <button
        onClick={handleEnhance}
        disabled={isLoading}
        style={{
          border: 'none',
          borderRadius: 14,
          padding: '10px 14px',
          background: '#4f46e5',
          color: '#fff',
          fontWeight: 600,
          fontSize: '0.9rem',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          opacity: isLoading ? 0.7 : 1,
        }}
      >
        {isLoading ? 'Enhancing...' : 'Enhance text'}
      </button>

      {status.message && (
        <div
          style={{
            fontSize: '0.78rem',
            color: status.type === 'error' ? '#dc2626' : '#047857',
            background: status.type === 'error' ? 'rgba(248, 113, 113, 0.15)' : 'rgba(16, 185, 129, 0.15)',
            padding: '6px 10px',
            borderRadius: 10,
          }}
        >
          {status.message}
        </div>
      )}
    </div>
  );
};

export default TextEnhanceControls;




















