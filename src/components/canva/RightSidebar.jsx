import React from 'react';
import { FiArrowLeft, FiArrowRight, FiEye, FiEyeOff, FiCopy, FiTrash2, FiType, FiSquare, FiImage, FiEdit3, FiAlignLeft, FiAlignCenter, FiAlignRight, FiBold, FiItalic, FiUnderline } from 'react-icons/fi';

const RightSidebar = ({
  styles,
  isRightSidebarCollapsed,
  setIsRightSidebarCollapsed,
  layers,
  selectedLayer,
  handleLayerSelect,
  handleLayerToggleVisibility,
  handleLayerDuplicate,
  handleLayerDelete,
  textSettings,
  handleTextContentChange,
  handleTextSettingsChange,
  shapeSettings,
  handleShapeSettingsChange,
  imageSettings,
  handleImageSettingsChange,
  drawingSettings,
  handleDrawingSettingsChange,
  setSelectedTool
}) => {
  return (
    <div style={styles.rightSidebar} className="custom-scrollbar">
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '20px',
        paddingBottom: '10px',
        borderBottom: '1px solid #e1e5e9'
      }}>
        {!isRightSidebarCollapsed && (
          <h3 style={{ margin: 0, fontSize: '16px' }}>Layers</h3>
        )}
        <button
          onClick={() => setIsRightSidebarCollapsed(!isRightSidebarCollapsed)}
          style={{
            padding: '8px',
            border: '1px solid #e1e5e9',
            borderRadius: '6px',
            backgroundColor: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
            minWidth: '32px',
            height: '32px'
          }}
          title={isRightSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isRightSidebarCollapsed ? (
            <FiArrowLeft size={16} color="#666" />
          ) : (
            <FiArrowRight size={16} color="#666" />
          )}
        </button>
      </div>

      {!isRightSidebarCollapsed && (
        <>
          {layers.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#666', fontSize: '14px' }}>
              No layers yet
            </div>
          ) : (
            layers.map(layer => (
              <div key={layer.id} style={{
                ...styles.layerItem,
                border: selectedLayer === layer.id ? '2px solid #3182ce' : '1px solid #e1e5e9',
                backgroundColor: selectedLayer === layer.id ? '#f0f4ff' : 'white'
              }}>
                <div onClick={() => handleLayerSelect(layer.id)} style={{ flex: 1 }}>
                <div style={{ fontWeight: '500' }}>{layer.name}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>{layer.type}</div>
                </div>
                <div style={styles.layerControls}>
                  <button
                    style={styles.controlButton}
                    onClick={() => handleLayerToggleVisibility(layer.id)}
                    title={layer.visible ? 'Hide' : 'Show'}
                  >
                    {layer.visible ? <FiEye size={14} /> : <FiEyeOff size={14} />}
                  </button>
                  <button
                    style={styles.controlButton}
                    onClick={() => handleLayerDuplicate(layer.id)}
                    title="Duplicate"
                  >
                    <FiCopy size={14} />
                  </button>
                  <button
                    style={styles.controlButton}
                    onClick={() => handleLayerDelete(layer.id)}
                    title="Delete"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </>
      )}

      {isRightSidebarCollapsed && (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          gap: '12px',
          paddingTop: '10px'
        }}>
          <div style={{ 
            textAlign: 'center', 
            fontSize: '12px', 
            color: '#666',
            fontWeight: '500'
          }}>
            {layers.length} layers
          </div>
          {layers.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
              {layers.slice(0, 3).map(layer => (
                <button
                  key={layer.id}
                  onClick={() => handleLayerSelect(layer.id)}
                  style={{
                    padding: '8px',
                    border: selectedLayer === layer.id ? '2px solid #3182ce' : '1px solid #e1e5e9',
                    borderRadius: '6px',
                    backgroundColor: selectedLayer === layer.id ? '#f0f4ff' : 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                    minHeight: '32px'
                  }}
                  title={`${layer.name} (${layer.type})`}
                >
                  {layer.type === 'text' && <FiType size={16} color="#666" />}
                  {layer.type === 'shape' && <FiSquare size={16} color="#666" />}
                  {layer.type === 'image' && <FiImage size={16} color="#666" />}
                  {layer.type === 'drawing' && <FiEdit3 size={16} color="#666" />}
                </button>
              ))}
              {layers.length > 3 && (
                <div style={{ 
                  textAlign: 'center', 
                  fontSize: '10px', 
                  color: '#999',
                  padding: '4px'
                }}>
                  +{layers.length - 3} more
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {selectedLayer && !isRightSidebarCollapsed && (
        <div style={styles.propertyPanel}>
          <h4 style={{ margin: '0 0 16px 0', fontSize: '16px' }}>Properties</h4>

          {layers.find(l => l.id === selectedLayer)?.type === 'text' && (
            <>
              <div style={styles.propertyRow}>
                <span style={styles.propertyLabel}>Content</span>
                <input
                  type="text"
                  value={layers.find(l => l.id === selectedLayer)?.text || ''}
                  onChange={(e) => handleTextContentChange(e.target.value)}
                  style={{ ...styles.propertyInput, width: '100%', marginLeft: 8 }}
                />
              </div>
              <div style={styles.propertyRow}>
                <span style={styles.propertyLabel}>Font Size</span>
                <input
                  type="number"
                  value={textSettings.fontSize}
                  onChange={(e) => handleTextSettingsChange('fontSize', parseInt(e.target.value))}
                  style={styles.propertyInput}
                />
              </div>
              <div style={styles.propertyRow}>
                <span style={styles.propertyLabel}>Font Family</span>
                <select
                  value={textSettings.fontFamily}
                  onChange={(e) => handleTextSettingsChange('fontFamily', e.target.value)}
                  style={styles.propertyInput}
                >
                  <option value="Arial">Arial</option>
                  <option value="Helvetica">Helvetica</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Open Sans">Open Sans</option>
                  <option value="Montserrat">Montserrat</option>
                  <option value="Poppins">Poppins</option>
                </select>
              </div>
              <div style={styles.propertyRow}>
                <span style={styles.propertyLabel}>Font Weight</span>
                <select
                  value={textSettings.fontWeight}
                  onChange={(e) => handleTextSettingsChange('fontWeight', e.target.value)}
                  style={styles.propertyInput}
                >
                  <option value="normal">Normal</option>
                  <option value="bold">Bold</option>
                  <option value="lighter">Light</option>
                  <option value="bolder">Bolder</option>
                </select>
              </div>
              <div style={styles.propertyRow}>
                <span style={styles.propertyLabel}>Color</span>
                <input
                  type="color"
                  value={textSettings.color}
                  onChange={(e) => handleTextSettingsChange('color', e.target.value)}
                  style={styles.colorInput}
                />
              </div>
              <div style={styles.propertyRow}>
                <span style={styles.propertyLabel}>Align</span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    style={{
                      ...styles.controlButton,
                      backgroundColor: textSettings.textAlign === 'left' ? '#3182ce' : 'transparent',
                      color: textSettings.textAlign === 'left' ? 'white' : '#666'
                    }}
                    onClick={() => handleTextSettingsChange('textAlign', 'left')}
                  >
                    <FiAlignLeft size={14} />
                  </button>
                  <button
                    style={{
                      ...styles.controlButton,
                      backgroundColor: textSettings.textAlign === 'center' ? '#3182ce' : 'transparent',
                      color: textSettings.textAlign === 'center' ? 'white' : '#666'
                    }}
                    onClick={() => handleTextSettingsChange('textAlign', 'center')}
                  >
                    <FiAlignCenter size={14} />
                  </button>
                  <button
                    style={{
                      ...styles.controlButton,
                      backgroundColor: textSettings.textAlign === 'right' ? '#3182ce' : 'transparent',
                      color: textSettings.textAlign === 'right' ? 'white' : '#666'
                    }}
                    onClick={() => handleTextSettingsChange('textAlign', 'right')}
                  >
                    <FiAlignRight size={14} />
                  </button>
                </div>
              </div>
              <div style={styles.propertyRow}>
                <span style={styles.propertyLabel}>Text Style</span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    style={{
                      ...styles.controlButton,
                      backgroundColor: textSettings.fontWeight === 'bold' ? '#3182ce' : 'transparent',
                      color: textSettings.fontWeight === 'bold' ? 'white' : '#666'
                    }}
                    onClick={() => handleTextSettingsChange('fontWeight', textSettings.fontWeight === 'bold' ? 'normal' : 'bold')}
                  >
                    <FiBold size={14} />
                  </button>
                  <button
                    style={{
                      ...styles.controlButton,
                      backgroundColor: textSettings.fontStyle === 'italic' ? '#3182ce' : 'transparent',
                      color: textSettings.fontStyle === 'italic' ? 'white' : '#666'
                    }}
                    onClick={() => handleTextSettingsChange('fontStyle', textSettings.fontStyle === 'italic' ? 'normal' : 'italic')}
                  >
                    <FiItalic size={14} />
                  </button>
                  <button
                    style={{
                      ...styles.controlButton,
                      backgroundColor: textSettings.textDecoration === 'underline' ? '#3182ce' : 'transparent',
                      color: textSettings.textDecoration === 'underline' ? 'white' : '#666'
                    }}
                    onClick={() => handleTextSettingsChange('textDecoration', textSettings.textDecoration === 'underline' ? 'none' : 'underline')}
                  >
                    <FiUnderline size={14} />
                  </button>
                </div>
              </div>
            </>
          )}

          {layers.find(l => l.id === selectedLayer)?.type === 'shape' && (
            <>
              <div style={styles.propertyRow}>
                <span style={styles.propertyLabel}>Fill Color</span>
                <input
                  type="color"
                  value={shapeSettings.fillColor}
                  onChange={(e) => handleShapeSettingsChange('fillColor', e.target.value)}
                  style={styles.colorInput}
                />
              </div>
              <div style={styles.propertyRow}>
                <span style={styles.propertyLabel}>Stroke Color</span>
                <input
                  type="color"
                  value={shapeSettings.strokeColor}
                  onChange={(e) => handleShapeSettingsChange('strokeColor', e.target.value)}
                  style={styles.colorInput}
                />
              </div>
              <div style={styles.propertyRow}>
                <span style={styles.propertyLabel}>Stroke Width</span>
                <input
                  type="number"
                  value={shapeSettings.strokeWidth}
                  onChange={(e) => handleShapeSettingsChange('strokeWidth', parseInt(e.target.value))}
                  style={styles.propertyInput}
                />
              </div>
            </>
          )}

          {layers.find(l => l.id === selectedLayer)?.type === 'image' && (
            <>
              <div style={styles.propertyRow}>
                <span style={styles.propertyLabel}>Brightness</span>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={imageSettings.brightness}
                  onChange={(e) => handleImageSettingsChange('brightness', parseInt(e.target.value))}
                  style={{ width: '100px' }}
                />
                <span style={{ fontSize: '12px', color: '#666', minWidth: '30px' }}>
                  {imageSettings.brightness}%
                </span>
              </div>
              <div style={styles.propertyRow}>
                <span style={styles.propertyLabel}>Contrast</span>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={imageSettings.contrast}
                  onChange={(e) => handleImageSettingsChange('contrast', parseInt(e.target.value))}
                  style={{ width: '100px' }}
                />
                <span style={{ fontSize: '12px', color: '#666', minWidth: '30px' }}>
                  {imageSettings.contrast}%
                </span>
              </div>
              <div style={styles.propertyRow}>
                <span style={styles.propertyLabel}>Saturation</span>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={imageSettings.saturation}
                  onChange={(e) => handleImageSettingsChange('saturation', parseInt(e.target.value))}
                  style={{ width: '100px' }}
                />
                <span style={{ fontSize: '12px', color: '#666', minWidth: '30px' }}>
                  {imageSettings.saturation}%
                </span>
              </div>
              <div style={styles.propertyRow}>
                <span style={styles.propertyLabel}>Blur</span>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={imageSettings.blur}
                  onChange={(e) => handleImageSettingsChange('blur', parseInt(e.target.value))}
                  style={{ width: '100px' }}
                />
                <span style={{ fontSize: '12px', color: '#666', minWidth: '30px' }}>
                  {imageSettings.blur}px
                </span>
              </div>
              <div style={styles.propertyRow}>
                <span style={styles.propertyLabel}>Opacity</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={imageSettings.opacity}
                  onChange={(e) => handleImageSettingsChange('opacity', parseInt(e.target.value))}
                  style={{ width: '100px' }}
                />
                <span style={{ fontSize: '12px', color: '#666', minWidth: '30px' }}>
                  {imageSettings.opacity}%
                </span>
              </div>
            </>
          )}

          {layers.find(l => l.id === selectedLayer)?.type === 'drawing' && (
            <>
              <div style={styles.propertyRow}>
                <span style={styles.propertyLabel}>Brush Size</span>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={drawingSettings.brushSize}
                  onChange={(e) => handleDrawingSettingsChange('brushSize', parseInt(e.target.value))}
                  style={{ width: '100px' }}
                />
                <span style={{ fontSize: '12px', color: '#666', minWidth: '30px' }}>
                  {drawingSettings.brushSize}px
                </span>
              </div>
              <div style={styles.propertyRow}>
                <span style={styles.propertyLabel}>Color</span>
                <input
                  type="color"
                  value={drawingSettings.brushColor}
                  onChange={(e) => handleDrawingSettingsChange('brushColor', e.target.value)}
                  style={styles.colorInput}
                />
              </div>
              <div style={styles.propertyRow}>
                <span style={styles.propertyLabel}>Opacity</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={drawingSettings.opacity}
                  onChange={(e) => handleDrawingSettingsChange('opacity', parseInt(e.target.value))}
                  style={{ width: '100px' }}
                />
                <span style={{ fontSize: '12px', color: '#666', minWidth: '30px' }}>
                  {drawingSettings.opacity}%
                </span>
              </div>
              <div style={styles.propertyRow}>
                <span style={styles.propertyLabel}>Mode</span>
                <select
                  value={drawingSettings.drawingMode}
                  onChange={(e) => {
                    handleDrawingSettingsChange('drawingMode', e.target.value);
                    setSelectedTool(e.target.value);
                  }}
                  style={styles.propertyInput}
                >
                  <option value="brush">Brush</option>
                  <option value="pen">Pen</option>
                  <option value="eraser">Eraser</option>
                </select>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default RightSidebar;


