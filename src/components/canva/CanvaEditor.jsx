import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FiType, FiImage, FiSquare, FiUpload, FiDownload, FiSave, FiCircle, FiTriangle, FiEdit3, FiMove, FiRotateCw, FiRotateCcw, FiCrop, FiFilter, FiAlignLeft, FiAlignCenter, FiAlignRight, FiBold, FiItalic, FiUnderline, FiLayers, FiEye, FiEyeOff, FiTrash2, FiCopy, FiZoomIn, FiZoomOut, FiGrid, FiMaximize, FiMinimize, FiStar, FiHeart, FiZap, FiShield, FiTarget, FiTrendingUp, FiPlus, FiMinus, FiX, FiCheck, FiArrowUp, FiArrowDown, FiArrowLeft, FiArrowRight, FiChevronDown, FiChevronRight, FiCloud } from 'react-icons/fi';

const CanvaEditor = () => {
  const [selectedTool, setSelectedTool] = useState('select');
  const [layers, setLayers] = useState([]);
  const [selectedLayer, setSelectedLayer] = useState(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [zoom, setZoom] = useState(100);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0, layerId: null });
  const [showGrid, setShowGrid] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [hoveredOption, setHoveredOption] = useState(null);
  const [templates, setTemplates] = useState([
    { id: 1, name: 'Social Media Post', width: 1080, height: 1080, thumbnail: '📱', category: 'Social' },
    { id: 2, name: 'Instagram Story', width: 1080, height: 1920, thumbnail: '📸', category: 'Social' },
    { id: 3, name: 'Facebook Cover', width: 1200, height: 630, thumbnail: '📘', category: 'Social' },
    { id: 4, name: 'YouTube Thumbnail', width: 1280, height: 720, thumbnail: '🎥', category: 'Video' },
    { id: 5, name: 'Business Card', width: 1050, height: 600, thumbnail: '💼', category: 'Business' },
    { id: 6, name: 'Presentation', width: 1920, height: 1080, thumbnail: '📊', category: 'Business' },
    { id: 7, name: 'Logo Design', width: 800, height: 800, thumbnail: '🎨', category: 'Branding' },
    { id: 8, name: 'Poster', width: 1080, height: 1350, thumbnail: '🖼️', category: 'Print' },
    { id: 9, name: 'Banner', width: 1200, height: 300, thumbnail: '🏷️', category: 'Web' },
    { id: 10, name: 'Flyer', width: 850, height: 1100, thumbnail: '📄', category: 'Print' }
  ]);
  const [textSettings, setTextSettings] = useState({
    fontSize: 16,
    fontFamily: 'Arial',
    fontWeight: 'normal',
    color: '#000000',
    textAlign: 'left'
  });
  const [shapeSettings, setShapeSettings] = useState({
    fillColor: '#3182ce',
    strokeColor: '#000000',
    strokeWidth: 1
  });
  const [imageSettings, setImageSettings] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
    opacity: 100
  });
  const [openSections, setOpenSections] = useState({
    selection: true,
    text: true,
    shapes: true,
    drawing: false,
    media: true,
    templates: true,
    canvas: true,
  });

  const toggleSection = (key) => {
    setOpenSections(prev => {
      const isCurrentlyOpen = !!prev[key];
      const nextState = Object.keys(prev).reduce((acc, sectionKey) => {
        acc[sectionKey] = false;
        return acc;
      }, {});
      nextState[key] = !isCurrentlyOpen;
      return nextState;
    });
  };
  const canvasRef = useRef(null);
  const canvasAreaRef = useRef(null);
  const fileInputRef = useRef(null);

  // History management
  const saveToHistory = (newLayers) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...newLayers]);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setLayers([...history[historyIndex - 1]]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setLayers([...history[historyIndex + 1]]);
    }
  };

  const handleToolSelect = (toolId) => {
    setSelectedTool(toolId);
    setSelectedLayer(null);
  };

  const handleAddElement = (x = 100, y = 100, toolOverride = null) => {
    let newLayer;
    const tool = toolOverride || selectedTool;
    
    if (tool === 'text' || tool === 'heading' || tool === 'subheading' || tool === 'textbox') {
      const isHeading = tool === 'heading';
      const isSubheading = tool === 'subheading';
      const isTextBox = tool === 'textbox' || tool === 'text';
      const presetFontSize = isHeading ? 48 : isSubheading ? 32 : 16;
      const presetFontWeight = isHeading ? 'bold' : 'normal';
      const presetText = isHeading
        ? 'Add a heading'
        : isSubheading
        ? 'Add a subheading'
        : 'Add a little bit of body text';
      const presetName = isHeading ? 'Heading' : isSubheading ? 'Subheading' : 'Text Box';

      newLayer = {
        id: Date.now(),
        type: 'text',
        name: presetName,
        text: presetText,
        x: x,
        y: y,
        width: 300,
        height: isHeading ? 80 : isSubheading ? 60 : 50,
        ...textSettings,
        fontSize: presetFontSize,
        fontWeight: presetFontWeight,
        visible: true,
        locked: false
      };
    } else if (
      ['rectangle','roundedRectangle','circle','ellipse','triangle','rightTriangle','diamond','pentagon','hexagon','star','star6','heart','arrow','arrowLeft','arrowUp','arrowDown','cloud'].includes(tool)
    ) {
      newLayer = {
        id: Date.now(),
        type: 'shape',
        name: tool.charAt(0).toUpperCase() + tool.slice(1),
        shape: tool,
        x: x,
        y: y,
        width: tool === 'ellipse' || tool === 'roundedRectangle' ? 160 : tool.includes('arrow') ? 140 : 100,
        height: tool === 'ellipse' || tool === 'roundedRectangle' ? 100 : 100,
        ...shapeSettings,
        visible: true,
        locked: false
      };
    }

    if (newLayer) {
      const newLayers = [...layers, newLayer];
      setLayers(newLayers);
      setSelectedLayer(newLayer.id);
      saveToHistory(newLayers);
    }
  };

  const handleLayerSelect = (layerId) => {
    setSelectedLayer(layerId);
    const layer = layers.find(l => l.id === layerId);
    if (layer && layer.type === 'text') {
      setTextSettings({
        fontSize: layer.fontSize || 16,
        fontFamily: layer.fontFamily || 'Arial',
        fontWeight: layer.fontWeight || 'normal',
        color: layer.color || '#000000',
        textAlign: layer.textAlign || 'left'
      });
    }
  };

  const handleLayerDelete = (layerId) => {
    const newLayers = layers.filter(l => l.id !== layerId);
    setLayers(newLayers);
    if (selectedLayer === layerId) {
      setSelectedLayer(null);
    }
    saveToHistory(newLayers);
  };

  const handleLayerToggleVisibility = (layerId) => {
    const newLayers = layers.map(l => 
      l.id === layerId ? { ...l, visible: !l.visible } : l
    );
    setLayers(newLayers);
    saveToHistory(newLayers);
  };

  const handleLayerDuplicate = (layerId) => {
    const layer = layers.find(l => l.id === layerId);
    if (layer) {
      const newLayer = {
        ...layer,
        id: Date.now(),
        x: layer.x + 20,
        y: layer.y + 20,
        name: layer.name + ' Copy'
      };
      const newLayers = [...layers, newLayer];
      setLayers(newLayers);
      setSelectedLayer(newLayer.id);
      saveToHistory(newLayers);
    }
  };

  const handleTextSettingsChange = (property, value) => {
    setTextSettings(prev => ({ ...prev, [property]: value }));
    if (selectedLayer) {
      const newLayers = layers.map(l => 
        l.id === selectedLayer ? { ...l, [property]: value } : l
      );
      setLayers(newLayers);
      saveToHistory(newLayers);
    }
  };

  // Update the textual content of a text layer
  const handleTextContentChange = (value) => {
    if (!selectedLayer) return;
    const newLayers = layers.map(l =>
      l.id === selectedLayer && l.type === 'text' ? { ...l, text: value } : l
    );
    setLayers(newLayers);
    saveToHistory(newLayers);
  };

  const handleShapeSettingsChange = (property, value) => {
    setShapeSettings(prev => ({ ...prev, [property]: value }));
    if (selectedLayer) {
      const newLayers = layers.map(l => 
        l.id === selectedLayer ? { ...l, [property]: value } : l
      );
      setLayers(newLayers);
      saveToHistory(newLayers);
    }
  };

  // Drag and drop functionality
  const handleMouseDown = (e, layerId) => {
    if (selectedTool === 'select' && layerId) {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      setSelectedLayer(layerId);
    }
  };

  const handleMouseMove = useCallback((e) => {
    if (isResizing && resizeStart.layerId) {
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;
      const newWidth = Math.max(10, resizeStart.width + deltaX);
      const newHeight = Math.max(10, resizeStart.height + deltaY);
      const newLayers = layers.map(layer =>
        layer.id === resizeStart.layerId
          ? { ...layer, width: newWidth, height: newHeight }
          : layer
      );
      setLayers(newLayers);
      return;
    }
    if (isDragging && selectedLayer) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      
      const newLayers = layers.map(layer => 
        layer.id === selectedLayer 
          ? { ...layer, x: layer.x + deltaX, y: layer.y + deltaY }
          : layer
      );
      setLayers(newLayers);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  }, [isDragging, selectedLayer, dragStart, layers, isResizing, resizeStart]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      saveToHistory(layers);
    }
    if (isResizing) {
      setIsResizing(false);
      setResizeStart({ x: 0, y: 0, width: 0, height: 0, layerId: null });
      saveToHistory(layers);
    }
  }, [isDragging, isResizing, layers]);

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  const handleResizeMouseDown = (e, layer) => {
    e.stopPropagation();
    if (selectedTool !== 'select') return;
    setIsResizing(true);
    setResizeStart({ x: e.clientX, y: e.clientY, width: layer.width, height: layer.height, layerId: layer.id });
    setSelectedLayer(layer.id);
  };

  // Image upload functionality
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newImage = {
          id: Date.now(),
          type: 'image',
          name: file.name,
          src: event.target.result,
          x: 100,
          y: 100,
          width: 200,
          height: 200,
          visible: true,
          locked: false,
          ...imageSettings
        };
        const newLayers = [...layers, newImage];
        setLayers(newLayers);
        setSelectedLayer(newImage.id);
        saveToHistory(newLayers);
        setUploadedImages(prev => [...prev, newImage]);
      };
      reader.readAsDataURL(file);
    }
  };

  // Template selection
  const handleTemplateSelect = (template) => {
    setCanvasSize({ width: template.width, height: template.height });
    setLayers([]);
    setSelectedLayer(null);
    saveToHistory([]);
  };

  // Zoom functionality
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 400));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 25));
  };

  const handleZoomReset = () => {
    setZoom(100);
    setPan({ x: 0, y: 0 });
  };

  const handleFitToScreen = () => {
    const area = canvasAreaRef.current;
    if (!area) return;
    const availableWidth = area.clientWidth - 40; // padding margin
    const availableHeight = area.clientHeight - 40;
    if (availableWidth <= 0 || availableHeight <= 0) return;
    const scale = Math.min(
      availableWidth / canvasSize.width,
      availableHeight / canvasSize.height
    );
    const target = Math.min(Math.max(Math.floor(scale * 100), 10), 400);
    setZoom(target);
    setPan({ x: 0, y: 0 });
  };

  // Image editing functions
  const handleImageSettingsChange = (property, value) => {
    setImageSettings(prev => ({ ...prev, [property]: value }));
    if (selectedLayer) {
      const newLayers = layers.map(l => 
        l.id === selectedLayer ? { ...l, [property]: value } : l
      );
      setLayers(newLayers);
      saveToHistory(newLayers);
    }
  };

  const handleCanvasClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (selectedTool !== 'select') {
      handleAddElement(x, y);
    } else {
      setSelectedLayer(null);
    }
  };

  const styles = {
    container: {
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      fontFamily: 'Arial, sans-serif',
      position: 'relative',
      zIndex: 1,
      marginLeft: '0',
      paddingLeft: '0',
      width: '100%',
      maxWidth: '100%',
      overflowX: 'hidden'
    },
    leftSidebar: {
      width: '280px',
      minWidth: '280px',
      flex: '0 0 280px',
      backgroundColor: 'white',
      borderRight: '1px solid #e1e5e9',
      padding: '20px',
      overflowY: 'auto',
      position: 'sticky',
      top: 0,
      height: '100vh',
      zIndex: 2,
    },
    mainArea: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#f8f9fa',
      minWidth: 0,
      overflow: 'hidden'
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
      padding: '20px',
      position: 'relative',
      overflow: 'auto',
      minWidth: 0
    },
    canvas: {
      width: canvasSize.width,
      height: canvasSize.height,
      backgroundColor: 'white',
      border: '2px solid #e1e5e9',
      borderRadius: '8px',
      position: 'relative',
      cursor: selectedTool === 'select' ? 'default' : 'crosshair',
      overflow: 'hidden',
      transform: `scale(${zoom / 100}) translate(${pan.x}px, ${pan.y}px)`,
      transformOrigin: 'center center',
      backgroundImage: showGrid ? 'radial-gradient(circle, #ccc 1px, transparent 1px)' : 'none',
      backgroundSize: '20px 20px'
    },
    rightSidebar: {
      width: '280px',
      minWidth: '280px',
      flex: '0 0 280px',
      backgroundColor: 'white',
      borderLeft: '1px solid #e1e5e9',
      padding: '20px',
      overflowY: 'auto',
      position: 'sticky',
      top: 0,
      height: '100vh',
      zIndex: 2
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
      padding: '12px',
      border: selectedLayer === layers.find(l => l.id === selectedLayer)?.id ? '2px solid #3182ce' : '1px solid #e1e5e9',
      borderRadius: '6px',
      margin: '4px 0',
      fontSize: '14px',
      backgroundColor: selectedLayer === layers.find(l => l.id === selectedLayer)?.id ? '#f0f4ff' : 'white',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    layerControls: {
      display: 'flex',
      gap: '4px',
      alignItems: 'center'
    },
    controlButton: {
      padding: '4px',
      border: 'none',
      backgroundColor: 'transparent',
      cursor: 'pointer',
      borderRadius: '4px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    propertyPanel: {
      marginTop: '20px',
      padding: '16px',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px'
    },
    propertyRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '12px'
    },
    propertyLabel: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#374151'
    },
    propertyInput: {
      padding: '6px 8px',
      border: '1px solid #d1d5db',
      borderRadius: '4px',
      fontSize: '14px',
      width: '80px'
    },
    colorInput: {
      width: '40px',
      height: '32px',
      border: '1px solid #d1d5db',
      borderRadius: '4px',
      cursor: 'pointer'
    }
  };

  const getShapeDisplayProps = (shape) => {
    // Returns { borderRadius, clipPath }
    switch (shape) {
      case 'circle':
        return { borderRadius: '50%', clipPath: 'none' };
      case 'ellipse':
        return { borderRadius: '50%', clipPath: 'none' };
      case 'roundedRectangle':
        return { borderRadius: '16px', clipPath: 'none' };
      case 'triangle':
        return { borderRadius: '0', clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' };
      case 'rightTriangle':
        return { borderRadius: '0', clipPath: 'polygon(0% 0%, 100% 0%, 0% 100%)' };
      case 'diamond':
        return { borderRadius: '0', clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' };
      case 'pentagon':
        return { borderRadius: '0', clipPath: 'polygon(50% 0%, 95% 38%, 77% 100%, 23% 100%, 5% 38%)' };
      case 'hexagon':
        return { borderRadius: '0', clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' };
      case 'star':
        return { borderRadius: '0', clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' };
      case 'star6':
        return { borderRadius: '0', clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' };
      case 'heart':
        return { borderRadius: '0', clipPath: 'polygon(50% 85%, 15% 50%, 15% 15%, 35% 0%, 50% 15%, 65% 0%, 85% 15%, 85% 50%)' };
      case 'arrow': // right
        return { borderRadius: '0', clipPath: 'polygon(0% 30%, 60% 30%, 60% 10%, 100% 50%, 60% 90%, 60% 70%, 0% 70%)' };
      case 'arrowLeft':
        return { borderRadius: '0', clipPath: 'polygon(100% 30%, 40% 30%, 40% 10%, 0% 50%, 40% 90%, 40% 70%, 100% 70%)' };
      case 'arrowUp':
        return { borderRadius: '0', clipPath: 'polygon(30% 100%, 30% 40%, 10% 40%, 50% 0%, 90% 40%, 70% 40%, 70% 100%)' };
      case 'arrowDown':
        return { borderRadius: '0', clipPath: 'polygon(30% 0%, 30% 60%, 10% 60%, 50% 100%, 90% 60%, 70% 60%, 70% 0%)' };
      case 'cloud':
        return { borderRadius: '0', clipPath: 'path("M20 60 C20 40, 40 40, 45 50 C50 35, 70 35, 75 50 C90 50, 95 60, 90 70 C85 80, 70 85, 60 80 C50 90, 35 90, 30 80 C15 80, 10 70, 20 60 Z")' };
      default:
        return { borderRadius: '0', clipPath: 'none' };
    }
  };

  return (
    <div style={styles.container}>
      {/* Debug Info */}
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        zIndex: 1000,
        backgroundColor: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '8px 12px',
        borderRadius: '4px',
        fontSize: '12px'
      }}>
        Canva Editor Active
      </div>
      
      {/* Left Sidebar */}
      <div style={styles.leftSidebar}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '16px' }}>Tools</h3>
        
        {/* Selection Tool */}
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
                  border: '1px solid #e1e5e9',
                  borderRadius: '8px',
                  backgroundColor: '#f8f9fa',
                  padding: '8px',
                  marginTop: '6px'
                }}
              >
                <button
                  style={{
                    ...styles.toolButton,
                    border: hoveredOption === 'select' ? '1px solid #3182ce' : 'none',
                    backgroundColor: hoveredOption === 'select' ? '#eaf2ff' : 'transparent',
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

        {/* Text Tools */}
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
                  border: '1px solid #e1e5e9',
                  borderRadius: '8px',
                  backgroundColor: '#f8f9fa',
                  padding: '8px',
                  marginTop: '6px'
                }}
              >
                <button
                  style={{
                    ...styles.toolButton,
                    border: hoveredOption === 'heading' ? '1px solid #3182ce' : 'none',
                    backgroundColor: hoveredOption === 'heading' ? '#eaf2ff' : 'transparent',
                    ...(selectedTool === 'heading' ? styles.activeTool : {})
                  }}
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
                  style={{
                    ...styles.toolButton,
                    border: hoveredOption === 'subheading' ? '1px solid #3182ce' : 'none',
                    backgroundColor: hoveredOption === 'subheading' ? '#eaf2ff' : 'transparent',
                    ...(selectedTool === 'subheading' ? styles.activeTool : {})
                  }}
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
                  style={{
                    ...styles.toolButton,
                    border: hoveredOption === 'textbox' ? '1px solid #3182ce' : 'none',
                    backgroundColor: hoveredOption === 'textbox' ? '#eaf2ff' : 'transparent',
                    ...(selectedTool === 'textbox' ? styles.activeTool : {})
                  }}
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

        {/* Shape Tools */}
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
                  border: '1px solid #e1e5e9',
                  borderRadius: '8px',
                  backgroundColor: '#f8f9fa',
                  padding: '8px',
                  marginTop: '6px'
                }}
              >
              <button
                style={{
                  ...styles.toolButton,
                    border: hoveredOption === 'rectangle' ? '1px solid #3182ce' : 'none',
                    backgroundColor: hoveredOption === 'rectangle' ? '#eaf2ff' : 'transparent',
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
                    border: hoveredOption === 'roundedRectangle' ? '1px solid #3182ce' : 'none',
                    backgroundColor: hoveredOption === 'roundedRectangle' ? '#eaf2ff' : 'transparent',
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
                    border: hoveredOption === 'circle' ? '1px solid #3182ce' : 'none',
                    backgroundColor: hoveredOption === 'circle' ? '#eaf2ff' : 'transparent',
                  ...(selectedTool === 'circle' ? styles.activeTool : {})
                }}
                  onMouseEnter={() => setHoveredOption('circle')}
                  onMouseLeave={() => setHoveredOption(null)}
                onClick={() => { handleAddElement(160, 160, 'circle'); setSelectedTool('select'); }}
              >
                <FiCircle size={16} />
                Circle
              </button>
              <button
                style={{
                  ...styles.toolButton,
                    border: hoveredOption === 'ellipse' ? '1px solid #3182ce' : 'none',
                    backgroundColor: hoveredOption === 'ellipse' ? '#eaf2ff' : 'transparent',
                  ...(selectedTool === 'ellipse' ? styles.activeTool : {})
                }}
                  onMouseEnter={() => setHoveredOption('ellipse')}
                  onMouseLeave={() => setHoveredOption(null)}
                onClick={() => { handleAddElement(180, 180, 'ellipse'); setSelectedTool('select'); }}
              >
                <FiCircle size={16} />
                Ellipse
              </button>
              <button
                style={{
                  ...styles.toolButton,
                    border: hoveredOption === 'triangle' ? '1px solid #3182ce' : 'none',
                    backgroundColor: hoveredOption === 'triangle' ? '#eaf2ff' : 'transparent',
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
                    border: hoveredOption === 'rightTriangle' ? '1px solid #3182ce' : 'none',
                    backgroundColor: hoveredOption === 'rightTriangle' ? '#eaf2ff' : 'transparent',
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
                    border: hoveredOption === 'star' ? '1px solid #3182ce' : 'none',
                    backgroundColor: hoveredOption === 'star' ? '#eaf2ff' : 'transparent',
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
                    border: hoveredOption === 'star6' ? '1px solid #3182ce' : 'none',
                    backgroundColor: hoveredOption === 'star6' ? '#eaf2ff' : 'transparent',
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
                    border: hoveredOption === 'heart' ? '1px solid #3182ce' : 'none',
                    backgroundColor: hoveredOption === 'heart' ? '#eaf2ff' : 'transparent',
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
                    border: hoveredOption === 'diamond' ? '1px solid #3182ce' : 'none',
                    backgroundColor: hoveredOption === 'diamond' ? '#eaf2ff' : 'transparent',
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
                    border: hoveredOption === 'pentagon' ? '1px solid #3182ce' : 'none',
                    backgroundColor: hoveredOption === 'pentagon' ? '#eaf2ff' : 'transparent',
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
                    border: hoveredOption === 'hexagon' ? '1px solid #3182ce' : 'none',
                    backgroundColor: hoveredOption === 'hexagon' ? '#eaf2ff' : 'transparent',
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
                    border: hoveredOption === 'arrow' ? '1px solid #3182ce' : 'none',
                    backgroundColor: hoveredOption === 'arrow' ? '#eaf2ff' : 'transparent',
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
                    border: hoveredOption === 'arrowLeft' ? '1px solid #3182ce' : 'none',
                    backgroundColor: hoveredOption === 'arrowLeft' ? '#eaf2ff' : 'transparent',
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
                    border: hoveredOption === 'arrowUp' ? '1px solid #3182ce' : 'none',
                    backgroundColor: hoveredOption === 'arrowUp' ? '#eaf2ff' : 'transparent',
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
                    border: hoveredOption === 'arrowDown' ? '1px solid #3182ce' : 'none',
                    backgroundColor: hoveredOption === 'arrowDown' ? '#eaf2ff' : 'transparent',
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
                    border: hoveredOption === 'cloud' ? '1px solid #3182ce' : 'none',
                    backgroundColor: hoveredOption === 'cloud' ? '#eaf2ff' : 'transparent',
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

        {/* Drawing Tools */}
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
                  border: '1px solid #e1e5e9',
                  borderRadius: '8px',
                  backgroundColor: '#f8f9fa',
                  padding: '8px',
                  marginTop: '6px'
                }}
              >
                <button
                  style={{
                    ...styles.toolButton,
                    border: hoveredOption === 'brush' ? '1px solid #3182ce' : 'none',
                    backgroundColor: hoveredOption === 'brush' ? '#eaf2ff' : 'transparent',
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
                    border: hoveredOption === 'pen' ? '1px solid #3182ce' : 'none',
                    backgroundColor: hoveredOption === 'pen' ? '#eaf2ff' : 'transparent',
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
                    border: hoveredOption === 'eraser' ? '1px solid #3182ce' : 'none',
                    backgroundColor: hoveredOption === 'eraser' ? '#eaf2ff' : 'transparent',
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

        {/* Effects & Filters */}
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

        {/* Media Tools */}
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
                  border: '1px solid #e1e5e9',
                  borderRadius: '8px',
                  backgroundColor: '#f8f9fa',
                  padding: '8px',
                  marginTop: '6px'
                }}
              >
                <button 
                  style={{ ...styles.toolButton, border: hoveredOption === 'upload' ? '1px solid #3182ce' : 'none', backgroundColor: hoveredOption === 'upload' ? '#eaf2ff' : 'transparent' }}
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

        {/* Templates */}
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
                  border: '1px solid #e1e5e9',
                  borderRadius: '8px',
                  backgroundColor: '#f8f9fa',
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
                        border: hoveredOption === `tpl-${template.id}` ? '1px solid #3182ce' : '1px solid #e1e5e9',
                        backgroundColor: hoveredOption === `tpl-${template.id}` ? '#eaf2ff' : 'white'
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

        {/* Canvas Size Controls */}
        <div style={{ marginTop: '12px' }}>
          <button
            style={{
              ...styles.toolButton,
              justifyContent: 'space-between'
            }}
            onClick={() => toggleSection('canvas')}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <FiMaximize size={16} />
              Canvas Size
            </span>
            {openSections.canvas ? <FiChevronDown size={16} /> : <FiChevronRight size={16} />}
          </button>
          {openSections.canvas && (
            <div style={{ paddingLeft: 8 }}>
              <div
                style={{
                  border: '1px solid #e1e5e9',
                  borderRadius: '8px',
                  backgroundColor: '#f8f9fa',
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

      {/* Main Area */}
      <div style={styles.mainArea}>
        {/* Top Toolbar */}
        <div style={styles.topToolbar}>
          {/* History Controls */}
          <button style={styles.toolButton} onClick={undo} disabled={historyIndex <= 0}>
            <FiRotateCcw size={16} />
            Undo
          </button>
          <button style={styles.toolButton} onClick={redo} disabled={historyIndex >= history.length - 1}>
            <FiRotateCw size={16} />
            Redo
          </button>
          
          <div style={{ width: '1px', height: '24px', backgroundColor: '#e1e5e9', margin: '0 8px' }} />
          
          {/* Zoom Controls */}
          <button style={styles.toolButton} onClick={handleZoomOut}>
            <FiZoomOut size={16} />
          </button>
          <span style={{ fontSize: '14px', color: '#666', padding: '0 8px' }}>
            {zoom}%
          </span>
          <button style={styles.toolButton} onClick={handleZoomIn}>
            <FiZoomIn size={16} />
          </button>
          <button style={styles.toolButton} onClick={handleZoomReset}>
            <FiMaximize size={16} />
          </button>
          <button style={styles.toolButton} onClick={handleFitToScreen} title="Fit to Screen">
            <FiMinimize size={16} />
          </button>
          
          <div style={{ width: '1px', height: '24px', backgroundColor: '#e1e5e9', margin: '0 8px' }} />
          
          {/* View Controls */}
          <button 
            style={{
              ...styles.toolButton,
              backgroundColor: showGrid ? '#3182ce' : 'white',
              color: showGrid ? 'white' : '#666'
            }}
            onClick={() => setShowGrid(!showGrid)}
            title="Toggle Grid"
          >
            <FiGrid size={16} />
          </button>
          
          <div style={{ width: '1px', height: '24px', backgroundColor: '#e1e5e9', margin: '0 8px' }} />
          
          {/* File Operations */}
          <button style={styles.toolButton}>
            <FiSave size={16} />
            Save
          </button>
          <button style={styles.toolButton}>
            <FiDownload size={16} />
            Export
          </button>
          <button style={styles.toolButton}>
            <FiCopy size={16} />
            Duplicate
          </button>
          
          <div style={{ flex: 1 }} />
          
          {/* Status Info */}
          <span style={{ fontSize: '14px', color: '#666', marginRight: '16px' }}>
            {canvasSize.width} × {canvasSize.height}
          </span>
          <span style={{ fontSize: '14px', color: '#666' }}>
            {selectedTool.charAt(0).toUpperCase() + selectedTool.slice(1)}
          </span>
        </div>

        {/* Canvas Area */}
        <div style={styles.canvasArea} ref={canvasAreaRef}>
          <div style={styles.canvas} onClick={handleCanvasClick} ref={canvasRef}>
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
                    border: selectedLayer === layer.id ? '2px dashed #3182ce' : 'none',
                    cursor: selectedTool === 'select' ? 'move' : 'default',
                    display: layer.visible ? 'block' : 'none',
                    userSelect: 'none'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLayerSelect(layer.id);
                  }}
                  onMouseDown={(e) => handleMouseDown(e, layer.id)}
                >
                  {layer.type === 'text' && (
                    <div
                      style={{
                        fontSize: layer.fontSize,
                        fontFamily: layer.fontFamily,
                        fontWeight: layer.fontWeight,
                        color: layer.color,
                        textAlign: layer.textAlign,
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '4px',
                        userSelect: 'text'
                      }}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        handleLayerSelect(layer.id);
                        const newText = window.prompt('Edit text', layer.text || '');
                        if (newText !== null) {
                          setSelectedLayer(layer.id);
                          handleTextContentChange(newText);
                        }
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
                        border: `${layer.strokeWidth}px solid ${layer.strokeColor}`,
                        borderRadius: layer.shape === 'circle' ? '50%' : '0',
                        clipPath: layer.shape === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' :
                                  layer.shape === 'star' ? 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' :
                                  layer.shape === 'heart' ? 'polygon(50% 85%, 15% 50%, 15% 15%, 50% 15%, 85% 15%, 85% 50%)' :
                                  layer.shape === 'arrow' ? 'polygon(0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%)' : 'none'
                      }}
                    />
                  )}
                  {layer.type === 'image' && (
                    <img
                      src={layer.src}
                      alt={layer.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '4px',
                        filter: `brightness(${layer.brightness || 100}%) contrast(${layer.contrast || 100}%) saturate(${layer.saturation || 100}%) blur(${layer.blur || 0}px)`,
                        opacity: (layer.opacity || 100) / 100
                      }}
                      draggable={false}
                    />
                  )}
                  {selectedLayer === layer.id && (
                    <div
                      onMouseDown={(e) => handleResizeMouseDown(e, layer)}
                      style={{
                        position: 'absolute',
                        right: -6,
                        bottom: -6,
                        width: 12,
                        height: 12,
                        backgroundColor: '#3182ce',
                        borderRadius: 2,
                        cursor: 'nwse-resize',
                        border: '2px solid white',
                        boxShadow: '0 0 0 1px #3182ce'
                      }}
                      title="Resize"
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

        {/* Properties Panel */}
        {selectedLayer && (
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
          </div>
        )}
      </div>
    </div>
  );
};

export default CanvaEditor;