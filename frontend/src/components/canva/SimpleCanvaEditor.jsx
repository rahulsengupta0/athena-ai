import React, { useState } from 'react';
import { FiType, FiSquare, FiCircle, FiUpload, FiSave, FiDownload } from 'react-icons/fi';

const SimpleCanvaEditor = () => {
  const [selectedTool, setSelectedTool] = useState('select');
  const [layers, setLayers] = useState([]);

  const handleToolSelect = (toolId) => {
    setSelectedTool(toolId);
  };

  const handleAddElement = (x = 100, y = 100) => {
    let newLayer;
    
    if (selectedTool === 'text') {
      newLayer = {
        id: Date.now(),
        type: 'text',
        name: 'Text Element',
        text: 'Hello World!',
        x: x,
        y: y,
        width: 200,
        height: 50,
        visible: true
      };
    } else if (selectedTool === 'rectangle') {
      newLayer = {
        id: Date.now(),
        type: 'shape',
        name: 'Rectangle',
        shape: 'rectangle',
        x: x,
        y: y,
        width: 100,
        height: 100,
        fillColor: '#3182ce',
        visible: true
      };
    } else if (selectedTool === 'circle') {
      newLayer = {
        id: Date.now(),
        type: 'shape',
        name: 'Circle',
        shape: 'circle',
        x: x,
        y: y,
        width: 100,
        height: 100,
        fillColor: '#3182ce',
        visible: true
      };
    }

    if (newLayer) {
      setLayers(prev => [...prev, newLayer]);
    }
  };

  const handleCanvasClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (selectedTool !== 'select') {
      handleAddElement(x, y);
    }
  };

  const styles = {
    container: {
      display: 'flex',
      height: '100vh',
      backgroundColor: '#f8f9fa',
      fontFamily: 'Arial, sans-serif'
    },
    leftSidebar: {
      width: '250px',
      backgroundColor: 'white',
      borderRight: '1px solid #e1e5e9',
      padding: '20px'
    },
    mainArea: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#f8f9fa'
    },
    topToolbar: {
      height: '60px',
      backgroundColor: 'white',
      borderBottom: '1px solid #e1e5e9',
      display: 'flex',
      alignItems: 'center',
      padding: '0 20px',
      gap: '12px'
    },
    canvasArea: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    },
    canvas: {
      width: '600px',
      height: '400px',
      backgroundColor: 'white',
      border: '2px solid #e1e5e9',
      borderRadius: '8px',
      position: 'relative',
      cursor: selectedTool === 'select' ? 'default' : 'crosshair',
      overflow: 'hidden'
    },
    rightSidebar: {
      width: '250px',
      backgroundColor: 'white',
      borderLeft: '1px solid #e1e5e9',
      padding: '20px'
    },
    toolButton: {
      padding: '10px 16px',
      border: '1px solid #e1e5e9',
      borderRadius: '6px',
      backgroundColor: 'white',
      cursor: 'pointer',
      margin: '4px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px',
      width: '100%',
      justifyContent: 'flex-start'
    },
    activeTool: {
      backgroundColor: '#3182ce',
      color: 'white',
      borderColor: '#3182ce'
    },
    layerItem: {
      padding: '8px',
      border: '1px solid #e1e5e9',
      borderRadius: '4px',
      margin: '4px 0',
      fontSize: '14px'
    }
  };

  return (
    <div style={styles.container}>
      {/* Left Sidebar */}
      <div style={styles.leftSidebar}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '16px' }}>Tools</h3>
        
        <div>
          <h4 style={{ fontSize: '14px', margin: '0 0 10px 0' }}>Text</h4>
          <button
            style={{
              ...styles.toolButton,
              ...(selectedTool === 'text' ? styles.activeTool : {})
            }}
            onClick={() => handleToolSelect('text')}
          >
            <FiType size={16} />
            Add Text
          </button>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h4 style={{ fontSize: '14px', margin: '0 0 10px 0' }}>Shapes</h4>
          <button
            style={{
              ...styles.toolButton,
              ...(selectedTool === 'rectangle' ? styles.activeTool : {})
            }}
            onClick={() => handleToolSelect('rectangle')}
          >
            <FiSquare size={16} />
            Rectangle
          </button>
          <button
            style={{
              ...styles.toolButton,
              ...(selectedTool === 'circle' ? styles.activeTool : {})
            }}
            onClick={() => handleToolSelect('circle')}
          >
            <FiCircle size={16} />
            Circle
          </button>
        </div>
      </div>

      {/* Main Area */}
      <div style={styles.mainArea}>
        {/* Top Toolbar */}
        <div style={styles.topToolbar}>
          <button style={styles.toolButton}>
            <FiSave size={16} />
            Save
          </button>
          <button style={styles.toolButton}>
            <FiDownload size={16} />
            Download
          </button>
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: '14px', color: '#666' }}>
            Active Tool: {selectedTool}
          </span>
        </div>

        {/* Canvas Area */}
        <div style={styles.canvasArea}>
          <div style={styles.canvas} onClick={handleCanvasClick}>
            {layers.length === 0 ? (
              <div style={{ textAlign: 'center', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                <div style={{ fontSize: '48px', marginBottom: '10px' }}>🎨</div>
                <div>Click here to add elements</div>
                <div style={{ fontSize: '12px', color: '#999', marginTop: '5px' }}>
                  Select a tool from the left sidebar first
                </div>
              </div>
            ) : (
              layers.map(layer => (
                <div
                  key={layer.id}
                  style={{
                    position: 'absolute',
                    left: layer.x,
                    top: layer.y,
                    width: layer.width,
                    height: layer.height,
                    border: '2px dashed #3182ce',
                    cursor: 'move',
                    display: layer.visible ? 'block' : 'none'
                  }}
                >
                  {layer.type === 'text' && (
                    <div
                      style={{
                        fontSize: '16px',
                        color: '#000',
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '4px'
                      }}
                    >
                      {layer.text}
                    </div>
                  )}
                  {layer.type === 'shape' && (
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: layer.fillColor,
                        borderRadius: layer.shape === 'circle' ? '50%' : '0'
                      }}
                    />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div style={styles.rightSidebar}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '16px' }}>Layers</h3>
        
        {layers.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#666', fontSize: '14px' }}>
            No layers yet
          </div>
        ) : (
          layers.map(layer => (
            <div key={layer.id} style={styles.layerItem}>
              <div style={{ fontWeight: '500' }}>{layer.name}</div>
              <div style={{ fontSize: '12px', color: '#666' }}>{layer.type}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SimpleCanvaEditor;
