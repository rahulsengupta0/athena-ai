import React from 'react';
import { FiZap } from 'react-icons/fi';

/**
 * TextEnhanceButton - Button component for AI text enhancement
 * Used in floating toolbar and text editor
 */
const TextEnhanceButton = ({
  onClick,
  disabled = false,
  isEnhancing = false,
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
    backgroundColor: isEnhancing ? '#94a3b8' : '#8b5cf6',
    borderColor: isEnhancing ? '#94a3b8' : '#8b5cf6',
    color: '#ffffff',
  };

  const inlineStyle = {
    ...baseStyle,
    padding: '6px 12px',
    backgroundColor: isEnhancing ? '#94a3b8' : '#8b5cf6',
    color: '#ffffff',
  };

  const style = variant === 'floating' ? floatingStyle : inlineStyle;

  return (
    <button
      title={isEnhancing ? 'Enhancing...' : 'Enhance text with AI'}
      style={style}
      onClick={(e) => {
        e.stopPropagation();
        if (!disabled && onClick) {
          onClick();
        }
      }}
      disabled={disabled}
    >
      <FiZap size={size} color="#ffffff" />
      {variant === 'inline' && (
        <span>{isEnhancing ? 'Enhancing...' : 'Enhance with AI'}</span>
      )}
    </button>
  );
};

export default TextEnhanceButton;

