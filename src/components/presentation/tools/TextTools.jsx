import React, { useState } from 'react';
import { Type, ChevronDown, ChevronRight } from 'lucide-react';

const TEXT_PRESETS = [
  {
    id: 'heading',
    label: 'Heading',
    description: 'Bold title',
    icon: <Type size={16} />,
    preset: {
      type: 'text',
      text: 'Add a heading',
      fontSize: 64,
      fontWeight: 700,
      width: 800,
      height: 120,
    },
  },
  {
    id: 'subheading',
    label: 'Subheading',
    description: 'Supporting text',
    icon: <Type size={16} />,
    preset: {
      type: 'text',
      text: 'Add a subheading',
      fontSize: 36,
      fontWeight: 600,
      width: 620,
      height: 96,
    },
  },
  {
    id: 'body',
    label: 'Text',
    description: 'Body copy',
    icon: <Type size={16} />,
    preset: {
      type: 'text',
      text: 'Start typing here…',
      fontSize: 24,
      fontWeight: 400,
      width: 560,
      height: 140,
    },
  },
];

const TextTools = ({ selectedPreset, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: '4px 0',
        }}
      >
        <span
          style={{
            fontSize: '0.78rem',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: '#94a3b8',
            fontWeight: 700,
          }}
        >
          Text
        </span>
        {isOpen ? <ChevronDown size={16} color="#94a3b8" /> : <ChevronRight size={16} color="#94a3b8" />}
      </button>
      {isOpen && (
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {TEXT_PRESETS.map((preset) => {
          const isActive = selectedPreset?.id === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => onSelect(preset)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 14px',
                borderRadius: 16,
                border: isActive ? '1px solid rgba(79, 70, 229, 0.75)' : '1px solid rgba(15, 23, 42, 0.08)',
                background: isActive ? 'rgba(79, 70, 229, 0.08)' : '#ffffff',
                cursor: 'pointer',
                textAlign: 'left',
                fontWeight: 600,
                color: '#0f172a',
              }}
            >
              <span
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 14,
                  background: 'rgba(15, 23, 42, 0.06)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isActive ? '#4338ca' : '#0f172a',
                }}
              >
                {preset.icon}
              </span>
              <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span>{preset.label}</span>
                <span style={{ color: '#64748b', fontSize: '0.82rem', fontWeight: 500 }}>
                  {preset.description}
                </span>
              </span>
            </button>
          );
        })}
        </div>
      )}
    </div>
  );
};

export default TextTools;

