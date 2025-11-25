import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { generatePresentationImage } from './api';
import { loadImageFromSource } from '../utils/imageUtils';

const ImageGenerateControls = ({ onImageReady }) => {
  const [prompt, setPrompt] = useState('');
  const [status, setStatus] = useState({ type: null, message: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setStatus({ type: 'error', message: 'Enter a prompt to generate an image.' });
      return;
    }

    setIsLoading(true);
    setStatus({ type: null, message: '' });
    try {
      const dataUrl = await generatePresentationImage(prompt);
      const imageData = await loadImageFromSource(dataUrl);
      onImageReady?.(imageData, {
        origin: 'ai',
        prompt,
        label: `AI: ${prompt.slice(0, 24)}${prompt.length > 24 ? '…' : ''}`,
      });
      setPrompt('');
      setStatus({ type: 'success', message: 'Image added to canvas' });
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Failed to generate image' });
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
        gap: 10,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Sparkles size={18} color="#4f46e5" />
        <div>
          <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>AI Image</div>
          <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>
            Generate a brand new illustration for this slide.
          </p>
        </div>
      </div>

      <input
        type="text"
        placeholder="Describe the image you need..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !isLoading) {
            handleGenerate();
          }
        }}
        style={{
          width: '100%',
          padding: '10px 12px',
          borderRadius: 12,
          border: '1px solid rgba(148, 163, 184, 0.6)',
          fontSize: '0.9rem',
        }}
        disabled={isLoading}
      />

       <button
        onClick={handleGenerate}
        disabled={isLoading}
        style={{
          border: 'none',
          borderRadius: 14,
          padding: '10px 14px',
          background: '#0ea5e9',
          color: '#fff',
          fontWeight: 600,
          fontSize: '0.9rem',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          opacity: isLoading ? 0.7 : 1,
        }}
      >
        {isLoading ? 'Generating image...' : 'Generate with AI'}
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

export default ImageGenerateControls;

