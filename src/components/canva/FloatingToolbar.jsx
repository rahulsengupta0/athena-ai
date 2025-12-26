import React from 'react';
import { FiCopy, FiTrash2 } from 'react-icons/fi';
import TextEnhanceButton from './TextEnhanceButton';
import TextStyleButton from './TextStyleButton';

/**
 * FloatingToolbar - Floating action bar that appears above selected elements
 * Contains color picker, duplicate, delete, and enhance (for text) buttons
 */
const FloatingToolbar = ({
  layer,
  styles,
  onColorChange,
  onDuplicate,
  onDelete,
  onEnhance,
  isEnhancing = false,
  getLayerPrimaryColor
}) => {
  if (!layer) return null;

  const hasTextContent = layer.type === 'text' && layer.text?.trim();

  return (
    <div style={styles.floatingBar} onMouseDown={(e) => e.stopPropagation()}>
      {/* Color Picker */}
      <input
        type="color"
        aria-label="Change color"
        value={getLayerPrimaryColor(layer)}
        onChange={(e) => onColorChange(e.target.value)}
        style={styles.floatingColor}
      />
      
      {/* Duplicate Button */}
      <button
        title="Duplicate"
        style={styles.floatingBtn}
        onClick={(e) => {
          e.stopPropagation();
          onDuplicate(layer.id);
        }}
      >
        <FiCopy size={16} color="#111827" />
      </button>
      
      {/* Delete Button */}
      <button
        title="Delete"
        style={styles.floatingBtn}
        onClick={(e) => {
          e.stopPropagation();
          onDelete(layer.id);
        }}
      >
        <FiTrash2 size={16} color="#dc2626" />
      </button>
      
      {/* Enhance Button (only for text layers) */}
      {layer.type === 'text' && (
        <>
          <TextEnhanceButton
            onClick={onEnhance}
            disabled={isEnhancing || !hasTextContent}
            isEnhancing={isEnhancing}
            variant="floating"
            size={16}
          />
          <TextStyleButton
            onClick={() => {
              // Dispatch event to open the modal in the parent component
              window.dispatchEvent(new CustomEvent('openTextStyleModal'));
            }}
            disabled={!hasTextContent}
            variant="floating"
            size={16}
          />
        </>
      )}
    </div>
  );
};

export default FloatingToolbar;

