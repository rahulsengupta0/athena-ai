import React from 'react';
import { FiStar } from 'react-icons/fi';

/**
 * TextStyleButton - Button component for AI text styling
 * Used in floating toolbar and text editor
 */
const TextStyleButton = ({
  onClick,
  disabled = false,
  size = 16,
  variant = 'floating' // 'floating' or 'inline'
}) => {
  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    border: 'none',
    borderRadius: variant === 'floating' ? '8px' : '6px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s',
    opacity: disabled ? 0.6 : 1,
    fontSize: variant === 'floating' ? '13px' : '12px',
    fontWeight: '600',
  };

  const floatingStyle = {
    ...baseStyle,
    width: 28,
    height: 28,
    backgroundColor: '#f59e0b',
    borderColor: '#f59e0b',
    color: '#ffffff',
  };

  const inlineStyle = {
    ...baseStyle,
    padding: '6px 12px',
    backgroundColor: '#f59e0b',
    color: '#ffffff',
  };

  const style = variant === 'floating' ? floatingStyle : inlineStyle;

  return (
    <button
      title="Generate text styles with AI"
      style={style}
      onClick={(e) => {
        e.stopPropagation();
        if (!disabled && onClick) {
          onClick();
        }
      }}
      disabled={disabled}
    >
      <FiStar size={size} color="#ffffff" />
      {variant === 'inline' && (
        <span>Text Styles</span>
      )}
    </button>
  );
};

export default TextStyleButton;