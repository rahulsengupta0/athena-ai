import React, { useState } from 'react';
import { Paintbrush, PenTool, Eraser, ChevronDown, ChevronRight } from 'lucide-react';

const DRAWING_TOOLS = [
  {
    id: 'brush',
    label: 'Brush',
    description: 'Paint brush',
    icon: <Paintbrush size={16} />,
  },
  {
    id: 'pen',
    label: 'Pen',
    description: 'Drawing pen',
    icon: <PenTool size={16} />,
  },
  {
    id: 'eraser',
    label: 'Eraser',
    description: 'Erase drawing',
    icon: <Eraser size={16} />,
  },
];

const DrawingTools = ({ selectedTool, onSelect }) => {
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
          Drawing
        </span>
        {isOpen ? <ChevronDown size={16} color="#94a3b8" /> : <ChevronRight size={16} color="#94a3b8" />}
      </button>
      {isOpen && (
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {DRAWING_TOOLS.map((tool) => {
          const isActive = selectedTool === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => onSelect(tool.id)}
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
                {tool.icon}
              </span>
              <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span>{tool.label}</span>
                <span style={{ color: '#64748b', fontSize: '0.82rem', fontWeight: 500 }}>
                  {tool.description}
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

export default DrawingTools;

