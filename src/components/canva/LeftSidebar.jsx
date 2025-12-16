// LeftSidebar.jsx
import React from 'react';
import {
  FiType,
  FiMove,
  FiSquare,
  FiImage,
  FiUpload,
  FiTriangle,
  FiChevronDown,
  FiChevronRight,
  FiStar,
  FiHeart,
  FiArrowUp,
  FiArrowDown,
  FiArrowLeft,
  FiArrowRight,
  FiCloud,
  FiZap,
  FiGrid,
  FiCrop,
  FiFilter,
  FiX
} from 'react-icons/fi';

const LeftSidebar = ({
  styles,
  toggleSection,
  openSections,
  hoveredOption,
  setHoveredOption,
  selectedTool,
  setSelectedTool,
  handleToolSelect,
  handleAddElement,
  fileInputRef,
  handleImageUpload,
  uploadedImages,
  handleLayerDuplicate,
  templates,
  handleTemplateSelect,
  drawingSettings,
  handleDrawingSettingsChange,
  canvasSize,
  setCanvasSize,
  showGrid,
  setShowGrid
}) => {
  const customStyles = {
    ...styles,
    sidebar: {
      ...styles.leftSidebar,
      background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
      borderRight: '2px solid #374151'
    }
  };

  const getButtonStyle = (buttonName) => ({
    ...styles.toolButton,
    border: hoveredOption === buttonName ? '1px solid #ffffff' : '1px solid #374151',
    backgroundColor: hoveredOption === buttonName ? '#334155' : 'transparent',
    ...(selectedTool === buttonName ? styles.activeTool : {})
  });

  return (
    <div style={customStyles.sidebar}>
      {/* Selection section (optional, from original code) */}
      <div style={{ marginTop: 0 }}>
        <button
          style={{ ...styles.toolButton, justifyContent: 'space-between' }}
          onClick={() => toggleSection('selection')}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FiMove size={16} /> Selection
          </span>
          {openSections.selection ? <FiChevronDown size={16} /> : <FiChevronRight size={16} />}
        </button>
        {openSections.selection && (
          <div style={{ paddingLeft: 8 }}>
            <div style={{ border: '1px solid #334155', borderRadius: 8, backgroundColor: '#334155', padding: 8, marginTop: 6 }}>
              <button
                style={getButtonStyle('select')}
                onMouseEnter={() => setHoveredOption('select')}
                onMouseLeave={() => setHoveredOption(null)}
                onClick={() => handleToolSelect('select')}
              >
                <FiMove size={16} />
                Select / Move
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Text Tools – this is what actually inserts headings */}
      <div style={{ marginTop: 12 }}>
        <button
          style={{ ...styles.toolButton, justifyContent: 'space-between' }}
          onClick={() => toggleSection('text')}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FiType size={16} /> Text
          </span>
          {openSections.text ? <FiChevronDown size={16} /> : <FiChevronRight size={16} />}
        </button>

        {openSections.text && (
          <div style={{ paddingLeft: 8 }}>
            <div style={{ border: '1px solid #334155', borderRadius: 8, backgroundColor: '#334155', padding: 8, marginTop: 6 }}>
              <button
                style={getButtonStyle('heading')}
                onMouseEnter={() => setHoveredOption('heading')}
                onMouseLeave={() => setHoveredOption(null)}
                onClick={() => {
                  handleAddElement(100, 100, 'heading');
                  setSelectedTool('select');
                }}
              >
                <FiType size={16} />
                Add Heading
              </button>

              <button
                style={getButtonStyle('subheading')}
                onMouseEnter={() => setHoveredOption('subheading')}
                onMouseLeave={() => setHoveredOption(null)}
                onClick={() => {
                  handleAddElement(100, 150, 'subheading');
                  setSelectedTool('select');
                }}
              >
                <FiType size={16} />
                Add Subheading
              </button>

              <button
                style={getButtonStyle('textbox')}
                onMouseEnter={() => setHoveredOption('textbox')}
                onMouseLeave={() => setHoveredOption(null)}
                onClick={() => {
                  handleAddElement(100, 200, 'textbox');
                  setSelectedTool('select');
                }}
              >
                <FiType size={16} />
                Add Text Box
              </button>
            </div>
          </div>
        )}
      </div>

      {/* You can copy Shapes / Media / Canvas sections from the original code if needed */}
    </div>
  );
};

export default LeftSidebar;
