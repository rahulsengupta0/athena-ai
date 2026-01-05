import React from 'react';
import { RotateCcw, RotateCw } from 'lucide-react';

/**
 * Undo/Redo controls component
 * @param {Object} props
 * @param {number} props.historyIndex - Current position in history
 * @param {number} props.historyLength - Total history length
 * @param {Function} props.onUndo - Undo handler
 * @param {Function} props.onRedo - Redo handler
 */
const UndoRedoControls = ({ historyIndex, historyLength, onUndo, onRedo }) => {
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < historyLength - 1;

  return (
    <>
      <button
        onClick={onUndo}
        disabled={!canUndo}
        style={{
          border: '1px solid rgba(15, 23, 42, 0.1)',
          background: !canUndo ? 'rgba(15, 23, 42, 0.02)' : 'rgba(15, 23, 42, 0.04)',
          borderRadius: 10,
          padding: '6px 10px',
          fontWeight: 600,
          fontSize: '0.85rem',
          color: !canUndo ? '#94a3b8' : '#0f172a',
          cursor: !canUndo ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          opacity: !canUndo ? 0.5 : 1,
        }}
        title="Undo"
      >
        <RotateCcw size={14} />
        Undo
      </button>
      <button
        onClick={onRedo}
        disabled={!canRedo}
        style={{
          border: '1px solid rgba(15, 23, 42, 0.1)',
          background: !canRedo ? 'rgba(15, 23, 42, 0.02)' : 'rgba(15, 23, 42, 0.04)',
          borderRadius: 10,
          padding: '6px 10px',
          fontWeight: 600,
          fontSize: '0.85rem',
          color: !canRedo ? '#94a3b8' : '#0f172a',
          cursor: !canRedo ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          opacity: !canRedo ? 0.5 : 1,
        }}
        title="Redo"
      >
        <RotateCw size={14} />
        Redo
      </button>
    </>
  );
};

export default UndoRedoControls;

