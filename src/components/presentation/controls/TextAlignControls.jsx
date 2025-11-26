import React from 'react';
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

const TextAlignControls = ({ value, onChange }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#475569' }}>Align</span>
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={() => onChange('left')}
          style={{
            flex: 1,
            border: '1px solid rgba(148, 163, 184, 0.35)',
            background: value === 'left' ? 'rgba(79, 70, 229, 0.08)' : '#ffffff',
            borderRadius: 12,
            padding: '8px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
          title="Left align"
        >
          <AlignLeft size={16} color={value === 'left' ? '#4f46e5' : '#475569'} />
        </button>
        <button
          onClick={() => onChange('center')}
          style={{
            flex: 1,
            border: '1px solid rgba(148, 163, 184, 0.35)',
            background: value === 'center' ? 'rgba(79, 70, 229, 0.08)' : '#ffffff',
            borderRadius: 12,
            padding: '8px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
          title="Center align"
        >
          <AlignCenter size={16} color={value === 'center' ? '#4f46e5' : '#475569'} />
        </button>
        <button
          onClick={() => onChange('right')}
          style={{
            flex: 1,
            border: '1px solid rgba(148, 163, 184, 0.35)',
            background: value === 'right' ? 'rgba(79, 70, 229, 0.08)' : '#ffffff',
            borderRadius: 12,
            padding: '8px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
          title="Right align"
        >
          <AlignRight size={16} color={value === 'right' ? '#4f46e5' : '#475569'} />
        </button>
      </div>
    </div>
  );
};

export default TextAlignControls;

