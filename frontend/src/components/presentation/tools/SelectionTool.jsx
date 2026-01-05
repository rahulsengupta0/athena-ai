import React, { useState } from 'react';
import { Move, ChevronDown, ChevronRight } from 'lucide-react';

const SelectionTool = ({ selectedTool, onSelect }) => {
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
          Selection
        </span>
        {isOpen ? <ChevronDown size={16} color="#94a3b8" /> : <ChevronRight size={16} color="#94a3b8" />}
      </button>
      {isOpen && (
        <div style={{ marginTop: 12 }}>
        <button
          onClick={() => onSelect('select')}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '12px 14px',
            borderRadius: 16,
            border: selectedTool === 'select' ? '1px solid rgba(79, 70, 229, 0.75)' : '1px solid rgba(15, 23, 42, 0.08)',
            background: selectedTool === 'select' ? 'rgba(79, 70, 229, 0.08)' : '#ffffff',
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
              color: selectedTool === 'select' ? '#4338ca' : '#0f172a',
            }}
          >
            <Move size={16} />
          </span>
          <span>Select & Move</span>
        </button>
        </div>
      )}
    </div>
  );
};

export default SelectionTool;

