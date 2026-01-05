import React, { useState, useCallback } from 'react';
import { FiRotateCcw, FiRotateCw, FiZoomOut, FiZoomIn, FiMaximize, FiMinimize, FiGrid, FiSave, FiDownload, FiCopy } from 'react-icons/fi';

const TopToolbar = ({
  styles,
  undo,
  redo,
  historyIndex,
  historyLength,
  zoom,
  setZoom,
  handleZoomOut,
  handleZoomIn,
  handleZoomReset,
  handleFitToScreen,
  showGrid,
  setShowGrid,
  canvasSize,
  selectedTool,
  onSave,
  onExport,
  onDuplicate,
  hasSelection
}) => {
  const [inputValue, setInputValue] = useState(zoom.toString());

  const handleZoomChange = useCallback((e) => {
    const value = e.target.value;
    setInputValue(value); // Allow typing any number
  }, []);

  const handleZoomBlur = useCallback((e) => {
    const value = parseInt(e.target.value);
    const clamped = Math.max(25, Math.min(400, isNaN(value) ? 100 : value));
    setZoom(clamped);
    setInputValue(clamped.toString());
  }, [setZoom]);

  const handleZoomEnter = useCallback((e) => {
    if (e.key === 'Enter') {
      handleZoomBlur(e);
      e.target.blur();
    }
  }, [handleZoomBlur]);

  React.useEffect(() => {
    setInputValue(zoom.toString());
  }, [zoom]);

  return (
    <div style={styles.topToolbar}>
      <button style={styles.toolbarButton} onClick={undo} disabled={historyIndex <= 0}>
        <FiRotateCcw size={16} />
        Undo
      </button>
      <button style={styles.toolbarButton} onClick={redo} disabled={historyIndex >= (historyLength - 1)}>
        <FiRotateCw size={16} />
        Redo
      </button>

      <div style={{ width: '1px', height: '24px', backgroundColor: '#e1e5e9', margin: '0 8px' }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <button style={styles.toolbarButton} onClick={handleZoomOut}>
          <FiZoomOut size={16} />
        </button>
        
        <input 
          type="text"  // CHANGED TO TEXT
          value={inputValue}
          onChange={handleZoomChange}
          onBlur={handleZoomBlur}
          onKeyDown={handleZoomEnter}
          style={{
            width: '60px',
            height: '28px',
            padding: '4px 8px',
            border: '1px solid #e1e5e9',
            borderRadius: '4px',
            textAlign: 'center',
            fontSize: '14px',
            fontFamily: 'monospace', // Better for numbers
            outline: 'none',
            backgroundColor: 'white',
            color: '#333',
            borderColor: zoom.toString() === inputValue ? '#e1e5e9' : '#3182ce' // Visual feedback
          }}
          onFocus={(e) => e.target.select()}
        />
        
        <span style={{ fontSize: '12px', color: '#666', minWidth: '12px' }}>%</span>
        
        <button style={styles.toolbarButton} onClick={handleZoomIn}>
          <FiZoomIn size={16} />
        </button>
      </div>

      <button style={styles.toolbarButton} onClick={handleZoomReset}>
        <FiMaximize size={16} />
      </button>
      <button style={styles.toolbarButton} onClick={handleFitToScreen} title="Fit to Screen">
        <FiMinimize size={16} />
      </button>

      <div style={{ width: '1px', height: '24px', backgroundColor: '#e1e5e9', margin: '0 8px' }} />

      <button 
        style={{
          ...styles.toolbarButton,
          backgroundColor: showGrid ? '#3182ce' : 'white',
          color: showGrid ? 'white' : '#666'
        }}
        onClick={() => setShowGrid(!showGrid)}
        title="Toggle Grid"
      >
        <FiGrid size={16} />
      </button>

      <div style={{ width: '1px', height: '24px', backgroundColor: '#e1e5e9', margin: '0 8px' }} />

      <button style={styles.toolbarButton} onClick={onSave} title="Save design">
        <FiSave size={16} />
        Save
      </button>
      <button style={styles.toolbarButton} onClick={onExport}>
        <FiDownload size={16} />
        Export
      </button>
      <button style={styles.toolbarButton} onClick={onDuplicate} disabled={!hasSelection} title={hasSelection ? 'Duplicate selected layer' : 'Select a layer to duplicate'}>
        <FiCopy size={16} />
        Duplicate
      </button>

      <div style={{ flex: 1 }} />

      <span style={{ fontSize: '14px', color: '#666', marginRight: '16px' }}>
        {canvasSize.width} × {canvasSize.height}
      </span>
      <span style={{ fontSize: '14px', color: '#666' }}>
        {selectedTool.charAt(0).toUpperCase() + selectedTool.slice(1)}
      </span>
    </div>
  );
};

export default TopToolbar;
