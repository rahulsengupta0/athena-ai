import React from 'react';
import { FiType, FiImage, FiSquare, FiUpload, FiTriangle, FiEdit3, FiMove, FiGrid, FiChevronDown, FiChevronRight, FiStar, FiHeart, FiArrowUp, FiArrowDown, FiArrowLeft, FiArrowRight, FiCloud, FiZap, FiCrop, FiFilter, FiX } from 'react-icons/fi';

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
  // New custom styles for the redesigned sidebar
  const customStyles = {
    sidebar: {
      ...styles.leftSidebar,
      background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
      borderRight: '2px solid #374151',
    },
    sectionHeader: {
      color: '#f1f5f9',
      fontSize: '16px',
      fontWeight: '700',
      marginBottom: '16px',
      padding: '8px 0',
      borderBottom: '2px solid #374151',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    buttonContainer: {
      backgroundColor: '#1e293b',
      border: '1px solid #374151',
      borderRadius: '12px',
      padding: '12px',
      marginBottom: '12px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
    },
    shapeButton: {
      padding: '12px 16px',
      border: '1px solid #475569',
      borderRadius: '10px',
      backgroundColor: '#334155',
      cursor: 'pointer',
      margin: '6px 0',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      fontSize: '14px',
      fontWeight: '500',
      width: '100%',
      justifyContent: 'flex-start',
      transition: 'all 0.2s ease',
      color: '#f8fafc',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      '&:hover': {
        backgroundColor: '#475569',
        borderColor: '#60a5fa',
        color: '#ffffff',
        transform: 'translateY(-1px)',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)'
      }
    },
    uploadButton: {
      padding: '20px 16px',
      border: '2px dashed #8b5cf6',
      borderRadius: '12px',
      background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
      cursor: 'pointer',
      margin: '8px 0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px',
      fontWeight: '600',
      width: '100%',
      justifyContent: 'center',
      transition: 'all 0.3s ease',
      color: '#ffffff',
      boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
      minHeight: '80px',
      '&:hover': {
        background: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)',
        borderColor: '#a855f7',
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 16px rgba(139, 92, 246, 0.4)'
      }
    } 
  };

  // Function to get button style based on hover state
  const getButtonStyle = (buttonName) => ({
    ...customStyles.shapeButton,
    backgroundColor: hoveredOption === buttonName ? '#475569' : '#334155',
    borderColor: hoveredOption === buttonName ? '#60a5fa' : '#475569',
    color: '#f8fafc'
  });

  return (
    <div style={customStyles.sidebar} className="custom-scrollbar">
      <div style={customStyles.sectionHeader}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "12px",
            background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)"
          }}
        >
          <span style={{ color: "#ffffff", fontWeight: 700, fontSize: "1.5rem" }}>🎨</span>
        </div>
        <span style={{ fontWeight: 700, fontSize: "1.2rem", color: "#f1f5f9" }}>Design Tools</span>
      </div>

      <div>
        <button
          style={{
            ...styles.toolButton,
            justifyContent: 'space-between'
          }}
          onClick={() => toggleSection('selection')}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FiMove size={16} />
            Selection
          </span>
          {openSections.selection ? <FiChevronDown size={16} /> : <FiChevronRight size={16} />}
        </button>
        {openSections.selection && (
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
                  border: hoveredOption === 'select' ? '1px solid #ffffff' : 'none',
                  backgroundColor: hoveredOption === 'select' ? '#334155' : 'transparent',
                  ...(selectedTool === 'select' ? styles.activeTool : {})
                }}
                onMouseEnter={() => setHoveredOption('select')}
                onMouseLeave={() => setHoveredOption(null)}
                onClick={() => handleToolSelect('select')}
              >
                <FiMove size={16} />
                Select & Move
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
          onClick={() => toggleSection('text')}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FiType size={16} />
            Text
          </span>
          {openSections.text ? <FiChevronDown size={16} /> : <FiChevronRight size={16} />}
        </button>
        {openSections.text && (
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
                  border: hoveredOption === 'heading' ? '1px solid #ffffff' : 'none',
                  backgroundColor: hoveredOption === 'heading' ? '#334155' : 'transparent',
                  ...(selectedTool === 'heading' ? styles.activeTool : {})
                }}
                onMouseEnter={() => setHoveredOption('heading')}
                onMouseLeave={() => setHoveredOption(null)}
                onClick={() => { handleAddElement(100, 100, 'heading'); setSelectedTool('select'); }}
              >
                <FiType size={16} />
                Add Heading
              </button>
              <button
                style={{
                  ...styles.toolButton,
                  border: hoveredOption === 'subheading' ? '1px solid #ffffff' : 'none',
                  backgroundColor: hoveredOption === 'subheading' ? '#334155' : 'transparent',
                  ...(selectedTool === 'subheading' ? styles.activeTool : {})
                }}
                onMouseEnter={() => setHoveredOption('subheading')}
                onMouseLeave={() => setHoveredOption(null)}
                onClick={() => { handleAddElement(100, 150, 'subheading'); setSelectedTool('select'); }}
              >
                <FiType size={16} />
                Add Subheading
              </button>
              <button
                style={{
                  ...styles.toolButton,
                  border: hoveredOption === 'textbox' ? '1px solid #ffffff' : 'none',
                  backgroundColor: hoveredOption === 'textbox' ? '#334155' : 'transparent',
                  ...(selectedTool === 'textbox' ? styles.activeTool : {})
                }}
                onMouseEnter={() => setHoveredOption('textbox')}
                onMouseLeave={() => setHoveredOption(null)}
                onClick={() => { handleAddElement(100, 200, 'textbox'); setSelectedTool('select'); }}
              >
                <FiType size={16} />
                Add Text Box
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
            <div style={customStyles.buttonContainer}>
              <button
                style={{
                  ...styles.toolButton,
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
                  ...styles.toolButton,
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
                  ...styles.toolButton,
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
                  ...styles.toolButton,
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
                  ...styles.toolButton,
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
                  ...styles.toolButton,
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
                  ...styles.toolButton,
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
                  ...styles.toolButton,
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
                  ...styles.toolButton,
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
                  ...styles.toolButton,
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
                  ...styles.toolButton,
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
                  ...styles.toolButton,
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
                  ...styles.toolButton,
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
                  ...styles.toolButton,
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
                  ...styles.toolButton,
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
                  ...styles.toolButton,
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
                  ...styles.toolButton,
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
            <div style={customStyles.buttonContainer}>
              <button 
                style={{
                  // Rectangle shape with dashed border
                  padding: '24px 20px',
                  border: '1px dashed #ffffff',
                  borderRadius: '12px',
                  background: hoveredOption === 'upload' 
                    ? 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)' 
                    : 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
                  cursor: 'pointer',
                  margin: '8px 0',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  width: '100%',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                  color: '#ffffff',
                  boxShadow: hoveredOption === 'upload' 
                    ? '0 6px 16px rgba(139, 92, 246, 0.4)' 
                    : '0 4px 12px rgba(139, 92, 246, 0.3)',
                  minHeight: '100px',
                  borderColor: hoveredOption === 'upload' ? '#a855f7' : '#8b5cf6',
                  transform: 'translateY(0)'
                }}
                onMouseEnter={() => setHoveredOption('upload')}
                onMouseLeave={() => setHoveredOption(null)}
                onClick={() => fileInputRef.current?.click()}
              >
                <FiUpload size={24} color="#ffffff" />
                <span style={{ 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#ffffff',
                  textAlign: 'center',
                  lineHeight: '1.2'
                }}>Upload Media</span>
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
    </div>
  );
};

export default LeftSidebar;


