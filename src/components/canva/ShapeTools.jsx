import React, { useState } from 'react';
import { 
  FiSquare, FiCircle, FiTriangle, FiStar, FiHeart, 
  FiMinus, FiPlus, FiRotateCw, FiMove, FiCopy, FiTrash2,
  FiPalette, FiSliders, FiGrid, FiLayers
} from 'react-icons/fi';

const ShapeTools = ({ onShapeCreate, selectedTool, onToolSelect }) => {
  const [shapeProperties, setShapeProperties] = useState({
    fill: '#3182ce',
    stroke: '#2d3748',
    strokeWidth: 2,
    opacity: 1,
    rotation: 0
  });

  const shapes = [
    { id: 'rectangle', name: 'Rectangle', icon: FiSquare, category: 'basic' },
    { id: 'circle', name: 'Circle', icon: FiCircle, category: 'basic' },
    { id: 'triangle', name: 'Triangle', icon: FiTriangle, category: 'basic' },
    { id: 'star', name: 'Star', icon: FiStar, category: 'decorative' },
    { id: 'heart', name: 'Heart', icon: FiHeart, category: 'decorative' },
    { id: 'line', name: 'Line', icon: FiMinus, category: 'basic' },
    { id: 'arrow', name: 'Arrow', icon: FiPlus, category: 'basic' }
  ];

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: 'white'
    },
    header: {
      padding: '16px 20px',
      borderBottom: '1px solid #e1e5e9',
      backgroundColor: '#f8f9fa'
    },
    title: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#2d3748',
      margin: 0
    },
    content: {
      flex: 1,
      overflow: 'auto',
      padding: '16px'
    },
    category: {
      marginBottom: '24px'
    },
    categoryTitle: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#4a5568',
      margin: '0 0 12px 0',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    shapeGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
      gap: '12px'
    },
    shapeButton: {
      padding: '16px 12px',
      border: '2px solid #e1e5e9',
      borderRadius: '8px',
      backgroundColor: 'white',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '8px',
      transition: 'all 0.2s',
      position: 'relative'
    },
    activeShape: {
      borderColor: '#3182ce',
      backgroundColor: '#e6f3ff'
    },
    shapeIcon: {
      fontSize: '24px',
      color: '#4a5568'
    },
    shapeName: {
      fontSize: '12px',
      fontWeight: '500',
      color: '#2d3748',
      textAlign: 'center'
    },
    properties: {
      padding: '16px',
      borderTop: '1px solid #e1e5e9',
      backgroundColor: '#f8f9fa'
    },
    propertiesTitle: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#2d3748',
      margin: '0 0 12px 0'
    },
    propertyRow: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '12px',
      gap: '12px'
    },
    propertyLabel: {
      fontSize: '12px',
      fontWeight: '500',
      color: '#4a5568',
      minWidth: '60px'
    },
    colorInput: {
      width: '32px',
      height: '32px',
      border: '1px solid #e1e5e9',
      borderRadius: '6px',
      cursor: 'pointer'
    },
    numberInput: {
      width: '60px',
      padding: '4px 8px',
      border: '1px solid #e1e5e9',
      borderRadius: '4px',
      fontSize: '12px'
    },
    slider: {
      flex: 1,
      height: '4px',
      borderRadius: '2px',
      background: '#e1e5e9',
      outline: 'none',
      appearance: 'none'
    },
    sliderThumb: {
      appearance: 'none',
      width: '16px',
      height: '16px',
      borderRadius: '50%',
      background: '#3182ce',
      cursor: 'pointer'
    },
    preview: {
      width: '100%',
      height: '80px',
      border: '1px solid #e1e5e9',
      borderRadius: '6px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'white',
      marginBottom: '12px'
    },
    previewShape: {
      width: '40px',
      height: '40px',
      backgroundColor: shapeProperties.fill,
      border: `${shapeProperties.strokeWidth}px solid ${shapeProperties.stroke}`,
      opacity: shapeProperties.opacity,
      transform: `rotate(${shapeProperties.rotation}deg)`
    },
    createButton: {
      width: '100%',
      padding: '10px 16px',
      backgroundColor: '#3182ce',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '6px'
    }
  };

  const handleShapeSelect = (shapeId) => {
    onToolSelect(shapeId);
  };

  const handlePropertyChange = (property, value) => {
    setShapeProperties(prev => ({
      ...prev,
      [property]: value
    }));
  };

  const handleCreateShape = () => {
    if (selectedTool) {
      const newShape = {
        id: Date.now(),
        type: 'shape',
        shapeType: selectedTool,
        name: shapes.find(s => s.id === selectedTool)?.name || 'Shape',
        x: 100,
        y: 100,
        width: 100,
        height: 100,
        ...shapeProperties,
        visible: true,
        locked: false
      };
      onShapeCreate(newShape);
    }
  };

  const renderShapePreview = () => {
    const shapeStyle = {
      ...styles.previewShape,
      borderRadius: selectedTool === 'circle' ? '50%' : 
                   selectedTool === 'triangle' ? '0' : '4px',
      clipPath: selectedTool === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 'none'
    };

    return (
      <div style={styles.preview}>
        <div style={shapeStyle} />
      </div>
    );
  };

  const groupedShapes = shapes.reduce((acc, shape) => {
    if (!acc[shape.category]) {
      acc[shape.category] = [];
    }
    acc[shape.category].push(shape);
    return acc;
  }, {});

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>Shapes</h3>
      </div>

      <div style={styles.content}>
        {Object.entries(groupedShapes).map(([category, categoryShapes]) => (
          <div key={category} style={styles.category}>
            <h4 style={styles.categoryTitle}>{category}</h4>
            <div style={styles.shapeGrid}>
              {categoryShapes.map(shape => (
                <button
                  key={shape.id}
                  style={{
                    ...styles.shapeButton,
                    ...(selectedTool === shape.id ? styles.activeShape : {})
                  }}
                  onClick={() => handleShapeSelect(shape.id)}
                >
                  <shape.icon style={styles.shapeIcon} />
                  <span style={styles.shapeName}>{shape.name}</span>
                </button>
              ))}
            </div>
          </div>
        ))}

        {selectedTool && (
          <div style={styles.properties}>
            <h4 style={styles.propertiesTitle}>Properties</h4>
            
            {renderShapePreview()}

            <div style={styles.propertyRow}>
              <label style={styles.propertyLabel}>Fill:</label>
              <input
                type="color"
                value={shapeProperties.fill}
                onChange={(e) => handlePropertyChange('fill', e.target.value)}
                style={styles.colorInput}
              />
            </div>

            <div style={styles.propertyRow}>
              <label style={styles.propertyLabel}>Stroke:</label>
              <input
                type="color"
                value={shapeProperties.stroke}
                onChange={(e) => handlePropertyChange('stroke', e.target.value)}
                style={styles.colorInput}
              />
            </div>

            <div style={styles.propertyRow}>
              <label style={styles.propertyLabel}>Width:</label>
              <input
                type="number"
                value={shapeProperties.strokeWidth}
                onChange={(e) => handlePropertyChange('strokeWidth', parseInt(e.target.value))}
                style={styles.numberInput}
                min="0"
                max="20"
              />
            </div>

            <div style={styles.propertyRow}>
              <label style={styles.propertyLabel}>Opacity:</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={shapeProperties.opacity}
                onChange={(e) => handlePropertyChange('opacity', parseFloat(e.target.value))}
                style={styles.slider}
              />
              <span style={{ fontSize: '12px', color: '#718096', minWidth: '30px' }}>
                {Math.round(shapeProperties.opacity * 100)}%
              </span>
            </div>

            <div style={styles.propertyRow}>
              <label style={styles.propertyLabel}>Rotation:</label>
              <input
                type="range"
                min="0"
                max="360"
                value={shapeProperties.rotation}
                onChange={(e) => handlePropertyChange('rotation', parseInt(e.target.value))}
                style={styles.slider}
              />
              <span style={{ fontSize: '12px', color: '#718096', minWidth: '30px' }}>
                {shapeProperties.rotation}°
              </span>
            </div>

            <button
              style={styles.createButton}
              onClick={handleCreateShape}
            >
              <FiPlus size={16} />
              Create Shape
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShapeTools;
