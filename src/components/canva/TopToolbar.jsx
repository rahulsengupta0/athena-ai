import React from 'react';
import { FiRotateCcw, FiRotateCw, FiZoomOut, FiZoomIn, FiMaximize, FiMinimize, FiGrid, FiSave, FiDownload, FiCopy } from 'react-icons/fi';

const TopToolbar = ({
  styles,
  undo,
  redo,
  historyIndex,
  historyLength,
  zoom,
  handleZoomOut,
  handleZoomIn,
  handleZoomReset,
  handleFitToScreen,
  showGrid,
  setShowGrid,
  canvasSize,
  selectedTool,
  onSave,
  onDuplicate,
  hasSelection
}) => {
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

      <button style={styles.toolbarButton} onClick={handleZoomOut}>
        <FiZoomOut size={16} />
      </button>
      <span style={{ fontSize: '14px', color: '#666', padding: '0 8px' }}>
        {zoom}%
      </span>
      <button style={styles.toolbarButton} onClick={handleZoomIn}>
        <FiZoomIn size={16} />
      </button>
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
      <button style={styles.toolbarButton}>
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


