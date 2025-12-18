import React from 'react';
import { Bold, Italic, Underline } from 'lucide-react';

const FontStyleControls = ({ fontWeight, fontStyle, textDecoration, onChange }) => {
  const isBold = fontWeight === 'bold' || fontWeight === '700' || fontWeight === 700;
  const isItalic = fontStyle === 'italic';
  const isUnderline = textDecoration === 'underline';

  const handleBoldToggle = () => {
    onChange({
      fontWeight: isBold ? 'normal' : 'bold',
    });
  };

  const handleItalicToggle = () => {
    onChange({
      fontStyle: isItalic ? 'normal' : 'italic',
    });
  };

  const handleUnderlineToggle = () => {
    onChange({
      textDecoration: isUnderline ? 'none' : 'underline',
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#475569' }}>Text Style</span>
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={handleBoldToggle}
          style={{
            flex: 1,
            border: '1px solid rgba(148, 163, 184, 0.35)',
            background: isBold ? 'rgba(79, 70, 229, 0.08)' : '#ffffff',
            borderRadius: 12,
            padding: '8px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontWeight: isBold ? 700 : 400,
          }}
          title="Bold"
        >
          <Bold size={16} color={isBold ? '#4f46e5' : '#475569'} />
        </button>
        <button
          onClick={handleItalicToggle}
          style={{
            flex: 1,
            border: '1px solid rgba(148, 163, 184, 0.35)',
            background: isItalic ? 'rgba(79, 70, 229, 0.08)' : '#ffffff',
            borderRadius: 12,
            padding: '8px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontStyle: isItalic ? 'italic' : 'normal',
          }}
          title="Italic"
        >
          <Italic size={16} color={isItalic ? '#4f46e5' : '#475569'} />
        </button>
        <button
          onClick={handleUnderlineToggle}
          style={{
            flex: 1,
            border: '1px solid rgba(148, 163, 184, 0.35)',
            background: isUnderline ? 'rgba(79, 70, 229, 0.08)' : '#ffffff',
            borderRadius: 12,
            padding: '8px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            textDecoration: isUnderline ? 'underline' : 'none',
          }}
          title="Underline"
        >
          <Underline size={16} color={isUnderline ? '#4f46e5' : '#475569'} />
        </button>
      </div>
    </div>
  );
};

export default FontStyleControls;















