<<<<<<< HEAD
import React from 'react';
import { FiType, FiImage, FiSquare, FiUpload, FiTriangle, FiEdit3, FiMove, FiGrid, FiChevronDown, FiChevronRight, FiStar, FiHeart, FiArrowUp, FiArrowDown, FiArrowLeft, FiArrowRight, FiCloud, FiZap, FiCrop, FiFilter, FiX } from 'react-icons/fi';
=======
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
>>>>>>> rc

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
<<<<<<< HEAD
  return (
    <div style={styles.leftSidebar} className="custom-scrollbar">
      <div style={{ 
        padding: "0 0 20px 0", 
        display: "flex", 
        alignItems: "center", 
        gap: 10,
        borderBottom: "1px solid #334155",
        marginBottom: "20px"
      }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "12px",
            background: "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ color: "#ffffff", fontWeight: 700, fontSize: "1.35rem" }}>🎨</span>
        </div>
        <span style={{ fontWeight: 700, fontSize: "1.12rem", color: "#ffffff" }}>Design Tools</span>
      </div>

      <div>
        <button
          style={{ ...styles.toolButton, justifyContent: 'space-between' }}
          onClick={() => toggleSection('selection')}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FiMove size={16} />
            Selection
=======
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
>>>>>>> rc
          </span>
          {openSections.selection ? <FiChevronDown size={16} /> : <FiChevronRight size={16} />}
        </button>
        {openSections.selection && (
          <div style={{ paddingLeft: 8 }}>
<<<<<<< HEAD
            <div
              style={{
                border: '1px solid #334155',
                borderRadius: '8px',
                backgroundColor: '#334155',
                padding: '8px',
                marginTop: '6px'
              }}
            >
              <button
                style={{
                  ...styles.toolButton,
                  border: hoveredOption === 'select' ? '1px solid #ffffff' : 'none',
                  backgroundColor: hoveredOption === 'select' ? '#334155' : 'transparent',
                  ...(selectedTool === 'select' ? styles.activeTool : {})
                }}
=======
            <div style={{ border: '1px solid #334155', borderRadius: 8, backgroundColor: '#334155', padding: 8, marginTop: 6 }}>
              <button
                style={getButtonStyle('select')}
>>>>>>> rc
                onMouseEnter={() => setHoveredOption('select')}
                onMouseLeave={() => setHoveredOption(null)}
                onClick={() => handleToolSelect('select')}
              >
                <FiMove size={16} />
<<<<<<< HEAD
                Select & Move
=======
                Select / Move
>>>>>>> rc
              </button>
            </div>
          </div>
        )}
      </div>

<<<<<<< HEAD
      <div style={{ marginTop: '12px' }}>
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
                onClick={() => { handleAddElement(100, 100, 'heading'); setSelectedTool('select'); }}
=======
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
>>>>>>> rc
              >
                <FiType size={16} />
                Add Heading
              </button>
<<<<<<< HEAD
              <button
                style={getButtonStyle('subheading')}
                onMouseEnter={() => setHoveredOption('subheading')}
                onMouseLeave={() => setHoveredOption(null)}
                onClick={() => { handleAddElement(100, 150, 'subheading'); setSelectedTool('select'); }}
=======

              <button
                style={getButtonStyle('subheading')}
                onMouseEnter={() => setHoveredOption('subheading')}
                onMouseLeave={() => setHoveredOption(null)}
                onClick={() => {
                  handleAddElement(100, 150, 'subheading');
                  setSelectedTool('select');
                }}
>>>>>>> rc
              >
                <FiType size={16} />
                Add Subheading
              </button>
<<<<<<< HEAD
              <button
                style={getButtonStyle('textbox')}
                onMouseEnter={() => setHoveredOption('textbox')}
                onMouseLeave={() => setHoveredOption(null)}
                onClick={() => { handleAddElement(100, 200, 'textbox'); setSelectedTool('select'); }}
=======

              <button
                style={getButtonStyle('textbox')}
                onMouseEnter={() => setHoveredOption('textbox')}
                onMouseLeave={() => setHoveredOption(null)}
                onClick={() => {
                  handleAddElement(100, 200, 'textbox');
                  setSelectedTool('select');
                }}
>>>>>>> rc
              >
                <FiType size={16} />
                Add Text Box
              </button>
            </div>
          </div>
        )}
      </div>

<<<<<<< HEAD
      <div style={{ marginTop: '12px' }}>
        <button
          style={{
            ...styles.toolButton,
            justifyContent: 'space-between'
          }}
          onClick={() => toggleSection('shapes')}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FiSquare size={16} />
            Shapes
          </span>
          {openSections.shapes ? <FiChevronDown size={16} /> : <FiChevronRight size={16} />}
        </button>
        {openSections.shapes && (
          <div style={{ paddingLeft: 8 }}>
            <div
              style={{
                border: '1px solid #334155',
                borderRadius: '8px',
                backgroundColor: '#334155',
                padding: '8px',
                marginTop: '6px'
              }}
            >
              <button
                style={{
                  ...styles.toolbarButton,
                  border: hoveredOption === 'rectangle' ? '1px solid #ffffff' : 'none',
                  backgroundColor: hoveredOption === 'rectangle' ? '#334155' : 'transparent',
                  ...(selectedTool === 'rectangle' ? styles.activeTool : {})
                }}
                onMouseEnter={() => setHoveredOption('rectangle')}
                onMouseLeave={() => setHoveredOption(null)}
                onClick={() => { handleAddElement(120, 120, 'rectangle'); setSelectedTool('select'); }}
              >
                <FiSquare size={16} />
                Rectangle
              </button>
              <button
                style={{
                  ...styles.toolbarButton,
                  border: hoveredOption === 'roundedRectangle' ? '1px solid #ffffff' : 'none',
                  backgroundColor: hoveredOption === 'roundedRectangle' ? '#334155' : 'transparent',
                  ...(selectedTool === 'roundedRectangle' ? styles.activeTool : {})
                }}
                onMouseEnter={() => setHoveredOption('roundedRectangle')}
                onMouseLeave={() => setHoveredOption(null)}
                onClick={() => { handleAddElement(140, 140, 'roundedRectangle'); setSelectedTool('select'); }}
              >
                <FiSquare size={16} />
                Rounded Rectangle
              </button>
              <button
                style={{
                  ...styles.toolbarButton,
                  border: hoveredOption === 'circle' ? '1px solid #ffffff' : 'none',
                  backgroundColor: hoveredOption === 'circle' ? '#334155' : 'transparent',
                  ...(selectedTool === 'circle' ? styles.activeTool : {})
                }}
                onMouseEnter={() => setHoveredOption('circle')}
                onMouseLeave={() => setHoveredOption(null)}
                onClick={() => { handleAddElement(160, 160, 'circle'); setSelectedTool('select'); }}
              >
                <FiSquare size={16} />
                Circle
              </button>
              <button
                style={{
                  ...styles.toolbarButton,
                  border: hoveredOption === 'ellipse' ? '1px solid #ffffff' : 'none',
                  backgroundColor: hoveredOption === 'ellipse' ? '#334155' : 'transparent',
                  ...(selectedTool === 'ellipse' ? styles.activeTool : {})
                }}
                onMouseEnter={() => setHoveredOption('ellipse')}
                onMouseLeave={() => setHoveredOption(null)}
                onClick={() => { handleAddElement(180, 180, 'ellipse'); setSelectedTool('select'); }}
              >
                <FiSquare size={16} />
                Ellipse
              </button>
              <button
                style={{
                  ...styles.toolbarButton,
                  border: hoveredOption === 'triangle' ? '1px solid #ffffff' : 'none',
                  backgroundColor: hoveredOption === 'triangle' ? '#334155' : 'transparent',
                  ...(selectedTool === 'triangle' ? styles.activeTool : {})
                }}
                onMouseEnter={() => setHoveredOption('triangle')}
                onMouseLeave={() => setHoveredOption(null)}
                onClick={() => { handleAddElement(200, 200, 'triangle'); setSelectedTool('select'); }}
              >
                <FiTriangle size={16} />
                Triangle
              </button>
              <button
                style={{
                  ...styles.toolbarButton,
                  border: hoveredOption === 'rightTriangle' ? '1px solid #ffffff' : 'none',
                  backgroundColor: hoveredOption === 'rightTriangle' ? '#334155' : 'transparent',
                  ...(selectedTool === 'rightTriangle' ? styles.activeTool : {})
                }}
                onMouseEnter={() => setHoveredOption('rightTriangle')}
                onMouseLeave={() => setHoveredOption(null)}
                onClick={() => { handleAddElement(220, 220, 'rightTriangle'); setSelectedTool('select'); }}
              >
                <FiTriangle size={16} />
                Right Triangle
              </button>
              <button
                style={{
                  ...styles.toolbarButton,
                  border: hoveredOption === 'star' ? '1px solid #ffffff' : 'none',
                  backgroundColor: hoveredOption === 'star' ? '#334155' : 'transparent',
                  ...(selectedTool === 'star' ? styles.activeTool : {})
                }}
                onMouseEnter={() => setHoveredOption('star')}
                onMouseLeave={() => setHoveredOption(null)}
                onClick={() => { handleAddElement(240, 240, 'star'); setSelectedTool('select'); }}
              >
                <FiStar size={16} />
                Star
              </button>
              <button
                style={{
                  ...styles.toolbarButton,
                  border: hoveredOption === 'star6' ? '1px solid #ffffff' : 'none',
                  backgroundColor: hoveredOption === 'star6' ? '#334155' : 'transparent',
                  ...(selectedTool === 'star6' ? styles.activeTool : {})
                }}
                onMouseEnter={() => setHoveredOption('star6')}
                onMouseLeave={() => setHoveredOption(null)}
                onClick={() => { handleAddElement(260, 260, 'star6'); setSelectedTool('select'); }}
              >
                <FiStar size={16} />
                6-Point Star
              </button>
              <button
                style={{
                  ...styles.toolbarButton,
                  border: hoveredOption === 'heart' ? '1px solid #ffffff' : 'none',
                  backgroundColor: hoveredOption === 'heart' ? '#334155' : 'transparent',
                  ...(selectedTool === 'heart' ? styles.activeTool : {})
                }}
                onMouseEnter={() => setHoveredOption('heart')}
                onMouseLeave={() => setHoveredOption(null)}
                onClick={() => { handleAddElement(280, 280, 'heart'); setSelectedTool('select'); }}
              >
                <FiHeart size={16} />
                Heart
              </button>
              <button
                style={{
                  ...styles.toolbarButton,
                  border: hoveredOption === 'diamond' ? '1px solid #ffffff' : 'none',
                  backgroundColor: hoveredOption === 'diamond' ? '#334155' : 'transparent',
                  ...(selectedTool === 'diamond' ? styles.activeTool : {})
                }}
                onMouseEnter={() => setHoveredOption('diamond')}
                onMouseLeave={() => setHoveredOption(null)}
                onClick={() => { handleAddElement(300, 300, 'diamond'); setSelectedTool('select'); }}
              >
                <FiSquare size={16} />
                Diamond
              </button>
              <button
                style={{
                  ...styles.toolbarButton,
                  border: hoveredOption === 'pentagon' ? '1px solid #ffffff' : 'none',
                  backgroundColor: hoveredOption === 'pentagon' ? '#334155' : 'transparent',
                  ...(selectedTool === 'pentagon' ? styles.activeTool : {})
                }}
                onMouseEnter={() => setHoveredOption('pentagon')}
                onMouseLeave={() => setHoveredOption(null)}
                onClick={() => { handleAddElement(320, 320, 'pentagon'); setSelectedTool('select'); }}
              >
                <FiSquare size={16} />
                Pentagon
              </button>
              <button
                style={{
                  ...styles.toolbarButton,
                  border: hoveredOption === 'hexagon' ? '1px solid #ffffff' : 'none',
                  backgroundColor: hoveredOption === 'hexagon' ? '#334155' : 'transparent',
                  ...(selectedTool === 'hexagon' ? styles.activeTool : {})
                }}
                onMouseEnter={() => setHoveredOption('hexagon')}
                onMouseLeave={() => setHoveredOption(null)}
                onClick={() => { handleAddElement(340, 340, 'hexagon'); setSelectedTool('select'); }}
              >
                <FiSquare size={16} />
                Hexagon
              </button>
              <button
                style={{
                  ...styles.toolbarButton,
                  border: hoveredOption === 'arrow' ? '1px solid #ffffff' : 'none',
                  backgroundColor: hoveredOption === 'arrow' ? '#334155' : 'transparent',
                  ...(selectedTool === 'arrow' ? styles.activeTool : {})
                }}
                onMouseEnter={() => setHoveredOption('arrow')}
                onMouseLeave={() => setHoveredOption(null)}
                onClick={() => { handleAddElement(360, 360, 'arrow'); setSelectedTool('select'); }}
              >
                <FiArrowRight size={16} />
                Arrow
              </button>
              <button
                style={{
                  ...styles.toolbarButton,
                  border: hoveredOption === 'arrowLeft' ? '1px solid #ffffff' : 'none',
                  backgroundColor: hoveredOption === 'arrowLeft' ? '#334155' : 'transparent',
                  ...(selectedTool === 'arrowLeft' ? styles.activeTool : {})
                }}
                onMouseEnter={() => setHoveredOption('arrowLeft')}
                onMouseLeave={() => setHoveredOption(null)}
                onClick={() => { handleAddElement(380, 380, 'arrowLeft'); setSelectedTool('select'); }}
              >
                <FiArrowLeft size={16} />
                Arrow Left
              </button>
              <button
                style={{
                  ...styles.toolbarButton,
                  border: hoveredOption === 'arrowUp' ? '1px solid #ffffff' : 'none',
                  backgroundColor: hoveredOption === 'arrowUp' ? '#334155' : 'transparent',
                  ...(selectedTool === 'arrowUp' ? styles.activeTool : {})
                }}
                onMouseEnter={() => setHoveredOption('arrowUp')}
                onMouseLeave={() => setHoveredOption(null)}
                onClick={() => { handleAddElement(400, 400, 'arrowUp'); setSelectedTool('select'); }}
              >
                <FiArrowUp size={16} />
                Arrow Up
              </button>
              <button
                style={{
                  ...styles.toolbarButton,
                  border: hoveredOption === 'arrowDown' ? '1px solid #ffffff' : 'none',
                  backgroundColor: hoveredOption === 'arrowDown' ? '#334155' : 'transparent',
                  ...(selectedTool === 'arrowDown' ? styles.activeTool : {})
                }}
                onMouseEnter={() => setHoveredOption('arrowDown')}
                onMouseLeave={() => setHoveredOption(null)}
                onClick={() => { handleAddElement(420, 420, 'arrowDown'); setSelectedTool('select'); }}
              >
                <FiArrowDown size={16} />
                Arrow Down
              </button>
              <button
                style={{
                  ...styles.toolbarButton,
                  border: hoveredOption === 'cloud' ? '1px solid #ffffff' : 'none',
                  backgroundColor: hoveredOption === 'cloud' ? '#334155' : 'transparent',
                  ...(selectedTool === 'cloud' ? styles.activeTool : {})
                }}
                onMouseEnter={() => setHoveredOption('cloud')}
                onMouseLeave={() => setHoveredOption(null)}
                onClick={() => { handleAddElement(440, 440, 'cloud'); setSelectedTool('select'); }}
              >
                <FiCloud size={16} />
                Cloud
              </button>
            </div>
          </div>
        )}
      </div>

      <div style={{ marginTop: '12px' }}>
        <button
          style={{
            ...styles.toolButton,
            justifyContent: 'space-between'
          }}
          onClick={() => toggleSection('drawing')}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FiEdit3 size={16} />
            Drawing
          </span>
          {openSections.drawing ? <FiChevronDown size={16} /> : <FiChevronRight size={16} />}
        </button>
        {openSections.drawing && (
          <div style={{ paddingLeft: 8 }}>
            <div
              style={{
                border: '1px solid #334155',
                borderRadius: '8px',
                backgroundColor: '#334155',
                padding: '8px',
                marginTop: '6px'
              }}
            >
              <button
                style={{
                  ...styles.toolButton,
                  border: hoveredOption === 'brush' ? '1px solid #ffffff' : 'none',
                  backgroundColor: hoveredOption === 'brush' ? '#334155' : 'transparent',
                  ...(selectedTool === 'brush' ? styles.activeTool : {})
                }}
                onMouseEnter={() => setHoveredOption('brush')}
                onMouseLeave={() => setHoveredOption(null)}
                onClick={() => handleToolSelect('brush')}
              >
                <FiEdit3 size={16} />
                Brush
              </button>
              <button
                style={{
                  ...styles.toolButton,
                  border: hoveredOption === 'pen' ? '1px solid #ffffff' : 'none',
                  backgroundColor: hoveredOption === 'pen' ? '#334155' : 'transparent',
                  ...(selectedTool === 'pen' ? styles.activeTool : {})
                }}
                onMouseEnter={() => setHoveredOption('pen')}
                onMouseLeave={() => setHoveredOption(null)}
                onClick={() => handleToolSelect('pen')}
              >
                <FiEdit3 size={16} />
                Pen
              </button>
              <button
                style={{
                  ...styles.toolButton,
                  border: hoveredOption === 'eraser' ? '1px solid #ffffff' : 'none',
                  backgroundColor: hoveredOption === 'eraser' ? '#334155' : 'transparent',
                  ...(selectedTool === 'eraser' ? styles.activeTool : {})
                }}
                onMouseEnter={() => setHoveredOption('eraser')}
                onMouseLeave={() => setHoveredOption(null)}
                onClick={() => handleToolSelect('eraser')}
              >
                <FiX size={16} />
                Eraser
              </button>
            </div>
          </div>
        )}
      </div>

      <div style={{ marginTop: '20px' }}>
        <h4 style={{ fontSize: '14px', margin: '0 0 10px 0' }}>Effects</h4>
        <button
          style={{
            ...styles.toolButton,
            ...(selectedTool === 'blur' ? styles.activeTool : {})
          }}
          onClick={() => handleToolSelect('blur')}
        >
          <FiFilter size={16} />
          Blur
        </button>
        <button
          style={{
            ...styles.toolButton,
            ...(selectedTool === 'sharpen' ? styles.activeTool : {})
          }}
          onClick={() => handleToolSelect('sharpen')}
        >
          <FiZap size={16} />
          Sharpen
        </button>
        <button
          style={{
            ...styles.toolButton,
            ...(selectedTool === 'crop' ? styles.activeTool : {})
          }}
          onClick={() => handleToolSelect('crop')}
        >
          <FiCrop size={16} />
          Crop
        </button>
      </div>

      <div style={{ marginTop: '12px' }}>
        <button
          style={{
            ...styles.toolButton,
            justifyContent: 'space-between'
          }}
          onClick={() => toggleSection('media')}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FiImage size={16} />
            Media
          </span>
          {openSections.media ? <FiChevronDown size={16} /> : <FiChevronRight size={16} />}
        </button>
        {openSections.media && (
          <div style={{ paddingLeft: 8 }}>
            <div
              style={{
                border: '1px solid #334155',
                borderRadius: '8px',
                backgroundColor: '#334155',
                padding: '8px',
                marginTop: '6px'
              }}
            >
              <button 
                style={{ ...styles.toolbarButton, border: hoveredOption === 'upload' ? '1px solid #ffffff' : 'none', backgroundColor: hoveredOption === 'upload' ? '#334155' : 'transparent' }}
                onMouseEnter={() => setHoveredOption('upload')}
                onMouseLeave={() => setHoveredOption(null)}
                onClick={() => fileInputRef.current?.click()}
              >
                <FiUpload size={16} />
                Upload Image
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
              {uploadedImages.length > 0 && (
                <div style={{
                  marginTop: '10px',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '8px',
                  maxHeight: '180px',
                  overflowY: 'auto'
                }}>
                  {uploadedImages.map(img => (
                    <button
                      key={img.id}
                      onClick={() => handleLayerDuplicate(img.id)}
                      style={{
                        padding: 0,
                        border: hoveredOption === `uploaded-${img.id}` ? '2px solid #3182ce' : '1px solid #e1e5e9',
                        borderRadius: '6px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        background: '#fff'
                      }}
                      onMouseEnter={() => setHoveredOption(`uploaded-${img.id}`)}
                      onMouseLeave={() => setHoveredOption(null)}
                      title={`Add ${img.name} to canvas`}
                    >
                      <img src={img.src} alt={img.name} style={{ width: '100%', height: 70, objectFit: 'cover' }} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div style={{ marginTop: '12px' }}>
        <button
          style={{
            ...styles.toolButton,
            justifyContent: 'space-between'
          }}
          onClick={() => toggleSection('templates')}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FiGrid size={16} />
            Templates
          </span>
          {openSections.templates ? <FiChevronDown size={16} /> : <FiChevronRight size={16} />}
        </button>
        {openSections.templates && (
          <div style={{ paddingLeft: 8 }}>
            <div
              style={{
                border: '1px solid #334155',
                borderRadius: '8px',
                backgroundColor: '#334155',
                padding: '8px',
                marginTop: '6px'
              }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', maxHeight: '200px', overflowY: 'auto' }}>
                {templates.map(template => (
                  <button
                    key={template.id}
                    style={{
                      ...styles.toolButton,
                      padding: '6px',
                      fontSize: '11px',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '2px',
                      minHeight: '60px',
                      border: hoveredOption === `tpl-${template.id}` ? '1px solid #ffffff' : '1px solid #e1e5e9',
                      backgroundColor: hoveredOption === `tpl-${template.id}` ? '#334155' : 'white'
                    }}
                    onMouseEnter={() => setHoveredOption(`tpl-${template.id}`)}
                    onMouseLeave={() => setHoveredOption(null)}
                    onClick={() => handleTemplateSelect(template)}
                    title={`${template.name} - ${template.width}×${template.height}`}
                  >
                    <span style={{ fontSize: '16px' }}>{template.thumbnail}</span>
                    <span style={{ fontSize: '10px', fontWeight: '500' }}>{template.name}</span>
                    <span style={{ fontSize: '9px', color: '#666' }}>
                      {template.width}×{template.height}
                    </span>
                    <span style={{ 
                      fontSize: '8px', 
                      color: '#3182ce', 
                      backgroundColor: '#e3f2fd',
                      padding: '1px 4px',
                      borderRadius: '2px'
                    }}>
                      {template.category}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {['brush', 'pen', 'eraser'].includes(selectedTool) && (
        <div style={{ marginTop: '12px' }}>
          <div
            style={{
              border: '1px solid #e1e5e9',
              borderRadius: '8px',
              backgroundColor: '#f8f9fa',
              padding: '12px',
              marginTop: '6px'
            }}
          >
            <h4 style={{ fontSize: '14px', margin: '0 0 12px 0', color: '#374151' }}>
              {selectedTool === 'eraser' ? 'Eraser Settings' : 'Drawing Settings'}
            </h4>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>
                {selectedTool === 'eraser' ? 'Eraser Size' : 'Brush Size'}: {drawingSettings.brushSize}px
              </label>
              <input
                type="range"
                min="1"
                max="50"
                value={drawingSettings.brushSize}
                onChange={(e) => handleDrawingSettingsChange('brushSize', parseInt(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>
                {selectedTool === 'eraser' ? 'Eraser Color' : 'Color'}
              </label>
              <input
                type="color"
                value={drawingSettings.brushColor}
                onChange={(e) => handleDrawingSettingsChange('brushColor', e.target.value)}
                style={{ width: '100%', height: '32px', border: '1px solid #d1d5db', borderRadius: '4px' }}
              />
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>
                Opacity: {drawingSettings.opacity}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={drawingSettings.opacity}
                onChange={(e) => handleDrawingSettingsChange('opacity', parseInt(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>
                Tool Mode
              </label>
              <select
                value={drawingSettings.drawingMode}
                onChange={(e) => {
                  handleDrawingSettingsChange('drawingMode', e.target.value);
                  setSelectedTool(e.target.value);
                }}
                style={{ width: '100%', padding: '6px', border: '1px solid #d1d5db', borderRadius: '4px' }}
              >
                <option value="brush">Brush</option>
                <option value="pen">Pen</option>
                <option value="eraser">Eraser</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <div style={{ marginTop: '12px' }}>
        <button
          style={{
            ...styles.toolButton,
            justifyContent: 'space-between'
          }}
          onClick={() => toggleSection('canvas')}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FiGrid size={16} />
            Canvas Size
          </span>
          {openSections.canvas ? <FiChevronDown size={16} /> : <FiChevronRight size={16} />}
        </button>
        {openSections.canvas && (
          <div style={{ paddingLeft: 8 }}>
            <div
              style={{
                border: '1px solid #334155',
                borderRadius: '8px',
                backgroundColor: '#334155',
                padding: '8px',
                marginTop: '6px'
              }}
            >
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input
                  type="number"
                  placeholder="Width"
                  value={canvasSize.width}
                  onChange={(e) => setCanvasSize(prev => ({ ...prev, width: parseInt(e.target.value) || 800 }))}
                  style={styles.propertyInput}
                />
                <input
                  type="number"
                  placeholder="Height"
                  value={canvasSize.height}
                  onChange={(e) => setCanvasSize(prev => ({ ...prev, height: parseInt(e.target.value) || 600 }))}
                  style={styles.propertyInput}
                />
              </div>
            </div>
          </div>
        )}
      </div>
=======
      {/* You can copy Shapes / Media / Canvas sections from the original code if needed */}
>>>>>>> rc
    </div>
  );
};

export default LeftSidebar;
<<<<<<< HEAD


=======
>>>>>>> rc
