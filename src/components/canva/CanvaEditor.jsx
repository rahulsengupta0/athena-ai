import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FiType, FiImage, FiSquare, FiUpload, FiDownload, FiSave, FiCircle, FiTriangle, FiEdit3, FiMove, FiRotateCw, FiRotateCcw, FiCrop, FiFilter, FiAlignLeft, FiAlignCenter, FiAlignRight, FiBold, FiItalic, FiUnderline, FiLayers, FiEye, FiEyeOff, FiTrash2, FiCopy, FiZoomIn, FiZoomOut, FiGrid, FiMaximize, FiMinimize, FiStar, FiHeart, FiZap, FiShield, FiTarget, FiTrendingUp, FiPlus, FiMinus, FiX, FiCheck, FiArrowUp, FiArrowDown, FiArrowLeft, FiArrowRight, FiChevronDown, FiChevronRight, FiCloud } from 'react-icons/fi';
import TopToolbar from './TopToolbar';
import SaveExportModal from './SaveExportModal';
import LeftSidebar from './LeftSidebar';

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
    fontStyle: 'normal',
    textDecoration: 'none',
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
    opacity: 100,
    strokeColor: '#000000',
    strokeWidth: 0,
    strokeStyle: 'solid', // 'solid' | 'dashed'
    cornerRadius: 4,
    animation: 'none' // 'none' | 'fadeIn' | 'slideInUp' | 'slideInLeft' | 'zoomIn'
  });
  const [drawingSettings, setDrawingSettings] = useState({
    brushSize: 5,
    brushColor: '#000000',
    isDrawing: false,
    drawingMode: 'brush', // 'brush', 'pen', 'eraser'
    opacity: 100
  });
  const [drawingData, setDrawingData] = useState([]);
  const [currentPath, setCurrentPath] = useState([]);
  const [openSections, setOpenSections] = useState({
    selection: true,
    text: true,
    shapes: true,
    drawing: false,
    media: true,
    templates: true,
    canvas: true,
  });
  const [hasChosenTemplate, setHasChosenTemplate] = useState(false);
  const [isRightSidebarCollapsed, setIsRightSidebarCollapsed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMouseOverCanvas, setIsMouseOverCanvas] = useState(false);
  // Save/Export modal state
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState('png'); // 'png' | 'jpeg'
  const [exportQuality, setExportQuality] = useState(0.92); // for jpeg (0-1)
  const [isExporting, setIsExporting] = useState(false);
  const [includeProjectFile, setIncludeProjectFile] = useState(true);
  const [isSavingWorksheet, setIsSavingWorksheet] = useState(false);
  // Custom scroller state
  const [scrollMetrics, setScrollMetrics] = useState({
    contentWidth: 0,
    contentHeight: 0,
    viewportWidth: 0,
    viewportHeight: 0,
    scrollLeft: 0,
    scrollTop: 0,
    hThumbSize: 0,
    vThumbSize: 0,
    hThumbPos: 0,
    vThumbPos: 0,
    showH: false,
    showV: false
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
  const contentWrapperRef = useRef(null);
  const fileInputRef = useRef(null);
  const strokeColorInputRef = useRef(null);
  const textColorInputRef = useRef(null);
  const lastPointRef = useRef(null);
  const lastTimeRef = useRef(0);
  const hDragRef = useRef({ isDragging: false, startX: 0, startScrollLeft: 0 });
  const vDragRef = useRef({ isDragging: false, startY: 0, startScrollTop: 0 });

  const SCROLLER_THICKNESS = 12; // px
  const SCROLLER_MARGIN = 8; // px within the container

  const updateScrollMetrics = useCallback(() => {
    const area = canvasAreaRef.current;
    const contentEl = contentWrapperRef.current;
    if (!area || !contentEl) return;

    const contentWidth = contentEl.scrollWidth || contentEl.offsetWidth || 0;
    const contentHeight = contentEl.scrollHeight || contentEl.offsetHeight || 0;
    const viewportWidth = area.clientWidth;
    const viewportHeight = area.clientHeight;
    const scrollLeft = area.scrollLeft;
    const scrollTop = area.scrollTop;

    const showH = contentWidth > viewportWidth + 1;
    const showV = contentHeight > viewportHeight + 1;

    // Track sizes account for the opposite scrollbar presence
    const hTrackLen = Math.max(0, viewportWidth - (showV ? SCROLLER_THICKNESS + SCROLLER_MARGIN : 0) - SCROLLER_MARGIN * 2);
    const vTrackLen = Math.max(0, viewportHeight - (showH ? SCROLLER_THICKNESS + SCROLLER_MARGIN : 0) - SCROLLER_MARGIN * 2);

    const minThumb = 24;
    const hThumbSize = !showH ? 0 : Math.max(minThumb, Math.floor((viewportWidth / contentWidth) * hTrackLen));
    const vThumbSize = !showV ? 0 : Math.max(minThumb, Math.floor((viewportHeight / contentHeight) * vTrackLen));

    const hScrollable = Math.max(1, contentWidth - viewportWidth);
    const vScrollable = Math.max(1, contentHeight - viewportHeight);
    const hMovable = Math.max(0, hTrackLen - hThumbSize);
    const vMovable = Math.max(0, vTrackLen - vThumbSize);

    const hThumbPos = !showH ? 0 : Math.min(hMovable, Math.floor((scrollLeft / hScrollable) * hMovable));
    const vThumbPos = !showV ? 0 : Math.min(vMovable, Math.floor((scrollTop / vScrollable) * vMovable));

    setScrollMetrics({
      contentWidth,
      contentHeight,
      viewportWidth,
      viewportHeight,
      scrollLeft,
      scrollTop,
      hThumbSize,
      vThumbSize,
      hThumbPos,
      vThumbPos,
      showH,
      showV
    });
  }, [SCROLLER_MARGIN, SCROLLER_THICKNESS]);

  // Sync scroll metrics on layout-affecting changes
  useEffect(() => {
    updateScrollMetrics();
  }, [zoom, pan, canvasSize.width, canvasSize.height, layers.length, hasChosenTemplate, updateScrollMetrics]);

  useEffect(() => {
    const area = canvasAreaRef.current;
    if (!area) return;
    const onScroll = () => updateScrollMetrics();
    area.addEventListener('scroll', onScroll, { passive: true });
    const onResize = () => updateScrollMetrics();
    window.addEventListener('resize', onResize);
    // Observe size changes of the content wrapper for reliable updates
    let ro;
    if ('ResizeObserver' in window && contentWrapperRef.current) {
      ro = new ResizeObserver(() => updateScrollMetrics());
      ro.observe(contentWrapperRef.current);
    }
    // Initial
    updateScrollMetrics();
    return () => {
      area.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (ro) ro.disconnect();
    };
  }, [updateScrollMetrics]);

  // Drag handlers for custom scrollers
  useEffect(() => {
    const onMouseMove = (e) => {
      const area = canvasAreaRef.current;
      if (!area) return;
      // Horizontal drag
      if (hDragRef.current.isDragging) {
        e.preventDefault();
        const { startX, startScrollLeft } = hDragRef.current;
        const dx = e.clientX - startX;
        const hTrackLen = Math.max(0, scrollMetrics.viewportWidth - (scrollMetrics.showV ? SCROLLER_THICKNESS + SCROLLER_MARGIN : 0) - SCROLLER_MARGIN * 2);
        const movable = Math.max(1, hTrackLen - scrollMetrics.hThumbSize);
        const scrollable = Math.max(1, scrollMetrics.contentWidth - scrollMetrics.viewportWidth);
        const scrollDelta = (dx / movable) * scrollable;
        area.scrollLeft = Math.min(scrollable, Math.max(0, startScrollLeft + scrollDelta));
        updateScrollMetrics();
      }
      // Vertical drag
      if (vDragRef.current.isDragging) {
        e.preventDefault();
        const { startY, startScrollTop } = vDragRef.current;
        const dy = e.clientY - startY;
        const vTrackLen = Math.max(0, scrollMetrics.viewportHeight - (scrollMetrics.showH ? SCROLLER_THICKNESS + SCROLLER_MARGIN : 0) - SCROLLER_MARGIN * 2);
        const movable = Math.max(1, vTrackLen - scrollMetrics.vThumbSize);
        const scrollable = Math.max(1, scrollMetrics.contentHeight - scrollMetrics.viewportHeight);
        const scrollDelta = (dy / movable) * scrollable;
        area.scrollTop = Math.min(scrollable, Math.max(0, startScrollTop + scrollDelta));
        updateScrollMetrics();
      }
    };
    const onMouseUp = () => {
      if (hDragRef.current.isDragging || vDragRef.current.isDragging) {
        hDragRef.current.isDragging = false;
        vDragRef.current.isDragging = false;
        document.body.style.cursor = 'default';
      }
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [scrollMetrics, updateScrollMetrics]);

  // Convert mouse/touch client coordinates into untransformed canvas coordinates,
  // accounting for the current zoom and pan transforms applied via CSS.
  const getCanvasPoint = useCallback((clientX, clientY) => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return { x: 0, y: 0 };
    const rect = canvasEl.getBoundingClientRect();
    const rawX = clientX - rect.left;
    const rawY = clientY - rect.top;
    const scale = zoom / 100;
    // Inverse of transform: scale(scale) translate(pan.x, pan.y)
    // Since translate is applied before scale in CSS (right-to-left),
    // the inverse mapping is: p = (d / scale) - pan
    const x = rawX / scale - pan.x;
    const y = rawY / scale - pan.y;
    return { x, y };
  }, [zoom, pan]);

  const getDistance = (a, b) => {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.hypot(dx, dy);
  };

  // Eraser functionality - only affect drawing layers under cursor
  const handleEraserAction = (x, y) => {
    const eraserRadius = drawingSettings.brushSize / 2;
    
    // Find layers that intersect with the eraser area
    const layersToErase = layers.filter(layer => {
      if (!layer.visible) return false;
      // Only allow erasing on drawing layers; ignore shapes/images/text entirely
      if (layer.type !== 'drawing') return false;
      
      // Check if eraser circle intersects with layer bounds
      const layerLeft = layer.x;
      const layerRight = layer.x + layer.width;
      const layerTop = layer.y;
      const layerBottom = layer.y + layer.height;
      
      // Check if eraser circle intersects with layer rectangle
      const closestX = Math.max(layerLeft, Math.min(x, layerRight));
      const closestY = Math.max(layerTop, Math.min(y, layerBottom));
      const distance = Math.hypot(x - closestX, y - closestY);
      
      return distance <= eraserRadius;
    });
    
    if (layersToErase.length > 0) {
      // Only modify drawing layers; keep all other layers intact
      const newLayers = layers.map(layer => {
        const layerToErase = layersToErase.find(l => l.id === layer.id);
        if (!layerToErase) return layer;
        
        // For drawing layers, create holes by removing path points near the eraser
        const newPath = layer.path.filter(point => {
          const distance = Math.hypot(point.x - (x - layer.x), point.y - (y - layer.y));
          return distance > eraserRadius;
        });
        
        if (newPath.length < 2) {
          // If too few points remain, delete only this drawing layer
          return null;
        }
        
        return { ...layer, path: newPath };
      }).filter(Boolean);
      
      setLayers(newLayers);
      saveToHistory(newLayers);
      
      // Clear selection if selected layer was erased
      const erasedLayerIds = layersToErase.map(l => l.id);
      if (erasedLayerIds.includes(selectedLayer)) {
        setSelectedLayer(null);
      }
    }
  };

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
    
    // Set drawing mode when selecting drawing tools
    if (['brush', 'pen', 'eraser'].includes(toolId)) {
      setDrawingSettings(prev => ({ ...prev, drawingMode: toolId }));
    }
  };

  const handleDrawingSettingsChange = (property, value) => {
    setDrawingSettings(prev => ({ ...prev, [property]: value }));
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
        fontStyle: layer.fontStyle || 'normal',
        textDecoration: layer.textDecoration || 'none',
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

  // Save: open modal with export options
  const handleSaveDesign = () => {
    setIsSaveModalOpen(true);
  };

  // Duplicate currently selected layer (if any)
  const handleDuplicateSelected = () => {
    if (!selectedLayer) return;
    handleLayerDuplicate(selectedLayer);
  };

  // Export utility: render all layers to an offscreen canvas for a full-template export
  const exportCanvasAsImage = async (format = 'png', quality = 0.92) => {
    const width = canvasSize.width;
    const height = canvasSize.height;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    ctx.restore();

    // Helpers
    const drawRoundedRect = (x, y, w, h, r) => {
      const radius = Math.max(0, Math.min(r, Math.min(w, h) / 2));
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + w - radius, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
      ctx.lineTo(x + w, y + h - radius);
      ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
      ctx.lineTo(x + radius, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
    };

    const drawText = (layer) => {
      ctx.save();
      ctx.fillStyle = layer.color || '#000000';
      const fontWeight = layer.fontWeight || 'normal';
      const fontSize = layer.fontSize || 16;
      const fontFamily = layer.fontFamily || 'Arial';
      ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
      ctx.textBaseline = 'top';
      if (layer.fontStyle === 'italic') {
        ctx.font = `italic ${fontWeight} ${fontSize}px ${fontFamily}`;
      }
      const x = layer.x + 4;
      const y = layer.y + 4;
      const maxWidth = Math.max(10, (layer.width || 300) - 8);
      const lines = (layer.text || '').split(/\n/);
      let offsetY = 0;
      for (const line of lines) {
        if (layer.textDecoration === 'underline') {
          const metrics = ctx.measureText(line);
          const underlineY = y + offsetY + fontSize;
          ctx.fillText(line, x, y + offsetY, maxWidth);
          ctx.beginPath();
          ctx.moveTo(x, underlineY + 2);
          ctx.lineTo(x + metrics.width, underlineY + 2);
          ctx.lineWidth = Math.max(1, Math.floor(fontSize / 12));
          ctx.strokeStyle = layer.color || '#000000';
          ctx.stroke();
        } else {
          ctx.fillText(line, x, y + offsetY, maxWidth);
        }
        offsetY += fontSize * 1.3;
      }
      ctx.restore();
    };

    const drawShape = (layer) => {
      const x = layer.x;
      const y = layer.y;
      const w = layer.width || 100;
      const h = layer.height || 100;
      const fill = layer.fillColor || '#3182ce';
      const stroke = layer.strokeColor || '#000000';
      const strokeWidth = Number.isFinite(layer.strokeWidth) ? layer.strokeWidth : 1;

      ctx.save();
      ctx.fillStyle = fill;
      ctx.strokeStyle = stroke;
      ctx.lineWidth = strokeWidth;
      const s = layer.shape;
      if (s === 'rectangle') {
        ctx.fillRect(x, y, w, h);
        if (strokeWidth > 0) ctx.strokeRect(x, y, w, h);
      } else if (s === 'roundedRectangle') {
        drawRoundedRect(x, y, w, h, 16);
        ctx.fill();
        if (strokeWidth > 0) ctx.stroke();
      } else if (s === 'circle') {
        ctx.beginPath();
        const r = Math.min(w, h) / 2;
        ctx.arc(x + r, y + r, r, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
        if (strokeWidth > 0) ctx.stroke();
      } else if (s === 'ellipse') {
        ctx.beginPath();
        ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
        if (strokeWidth > 0) ctx.stroke();
      } else if (s === 'triangle') {
        ctx.beginPath();
        ctx.moveTo(x + w / 2, y);
        ctx.lineTo(x, y + h);
        ctx.lineTo(x + w, y + h);
        ctx.closePath();
        ctx.fill();
        if (strokeWidth > 0) ctx.stroke();
      } else if (s === 'rightTriangle') {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + w, y);
        ctx.lineTo(x, y + h);
        ctx.closePath();
        ctx.fill();
        if (strokeWidth > 0) ctx.stroke();
      } else if (s === 'diamond') {
        ctx.beginPath();
        ctx.moveTo(x + w / 2, y);
        ctx.lineTo(x + w, y + h / 2);
        ctx.lineTo(x + w / 2, y + h);
        ctx.lineTo(x, y + h / 2);
        ctx.closePath();
        ctx.fill();
        if (strokeWidth > 0) ctx.stroke();
      } else {
        // Fallback for complex shapes: draw as rounded rectangle
        drawRoundedRect(x, y, w, h, 8);
        ctx.fill();
        if (strokeWidth > 0) ctx.stroke();
      }
      ctx.restore();
    };

    const drawImageLayer = async (layer) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          const x = layer.x;
          const y = layer.y;
          const w = layer.width || img.width;
          const h = layer.height || img.height;

          ctx.save();
          ctx.globalAlpha = (layer.opacity ?? 100) / 100;
          // Corner radius mask
          const r = Math.max(0, Math.min(layer.cornerRadius ?? 4, Math.min(w, h) / 2));
          if (r > 0) {
            const path = new Path2D();
            path.moveTo(x + r, y);
            path.lineTo(x + w - r, y);
            path.quadraticCurveTo(x + w, y, x + w, y + r);
            path.lineTo(x + w, y + h - r);
            path.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
            path.lineTo(x + r, y + h);
            path.quadraticCurveTo(x, y + h, x, y + h - r);
            path.lineTo(x, y + r);
            path.quadraticCurveTo(x, y, x + r, y);
            path.closePath();
            ctx.save();
            ctx.clip(path);
            ctx.drawImage(img, x, y, w, h);
            ctx.restore();
          } else {
            ctx.drawImage(img, x, y, w, h);
          }

          // Stroke
          const sw = Number.isFinite(layer.strokeWidth) ? layer.strokeWidth : 0;
          if (sw > 0) {
            ctx.save();
            ctx.lineWidth = sw;
            ctx.strokeStyle = layer.strokeColor || '#000000';
            if (layer.strokeStyle === 'dashed') ctx.setLineDash([8, 6]);
            const path = new Path2D();
            const inset = sw / 2;
            const rx = Math.max(0, Math.min((layer.cornerRadius ?? 4), Math.min(w, h) / 2));
            path.moveTo(x + inset + rx, y + inset);
            path.lineTo(x + w - inset - rx, y + inset);
            path.quadraticCurveTo(x + w - inset, y + inset, x + w - inset, y + inset + rx);
            path.lineTo(x + w - inset, y + h - inset - rx);
            path.quadraticCurveTo(x + w - inset, y + h - inset, x + w - inset - rx, y + h - inset);
            path.lineTo(x + inset + rx, y + h - inset);
            path.quadraticCurveTo(x + inset, y + h - inset, x + inset, y + h - inset - rx);
            path.lineTo(x + inset, y + inset + rx);
            path.quadraticCurveTo(x + inset, y + inset, x + inset + rx, y + inset);
            path.closePath();
            ctx.stroke(path);
            ctx.restore();
          }

          ctx.restore();
          resolve();
        };
        img.onerror = () => resolve();
        img.src = layer.src;
      });
    };

    const drawDrawingLayer = (layer) => {
      if (!Array.isArray(layer.path) || layer.path.length < 2) return;
      ctx.save();
      ctx.lineWidth = layer.brushSize || 5;
      ctx.strokeStyle = layer.color || '#000000';
      ctx.globalAlpha = (layer.opacity ?? 100) / 100;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      const start = layer.path[0];
      ctx.moveTo(layer.x + start.x, layer.y + start.y);
      for (let i = 1; i < layer.path.length; i++) {
        const p = layer.path[i];
        ctx.lineTo(layer.x + p.x, layer.y + p.y);
      }
      ctx.stroke();
      ctx.restore();
    };

    // Draw all layers in order
    const imageDrawPromises = [];
    for (const layer of layers) {
      if (!layer || layer.visible === false) continue;
      if (layer.type === 'shape') {
        drawShape(layer);
      } else if (layer.type === 'text') {
        drawText(layer);
      } else if (layer.type === 'image') {
        imageDrawPromises.push(drawImageLayer(layer));
      } else if (layer.type === 'drawing') {
        drawDrawingLayer(layer);
      }
    }
    if (imageDrawPromises.length) {
      await Promise.all(imageDrawPromises);
    }

    const mime = format === 'jpeg' ? 'image/jpeg' : 'image/png';
    const dataUrl = canvas.toDataURL(mime, format === 'jpeg' ? quality : undefined);
    return dataUrl;
  };

  const handleDownloadExport = async () => {
    if (isExporting) return;
    setIsExporting(true);
    try {
      const dataUrl = await exportCanvasAsImage(exportFormat, exportQuality);
      if (!dataUrl) return;
      const link = document.createElement('a');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const ext = exportFormat === 'jpeg' ? 'jpg' : 'png';
      link.download = `design-${timestamp}.${ext}`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      // Optionally persist and download project file (worksheet)
      try {
        const design = { layers, canvasSize, zoom: 100, pan: { x: 0, y: 0 }, savedAt: Date.now() };
        localStorage.setItem('canvaDesign', JSON.stringify(design));
        if (includeProjectFile) {
          const blob = new Blob([JSON.stringify(design, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const jsonLink = document.createElement('a');
          jsonLink.href = url;
          jsonLink.download = `design-${timestamp}.json`;
          document.body.appendChild(jsonLink);
          jsonLink.click();
          document.body.removeChild(jsonLink);
          URL.revokeObjectURL(url);
        }
      } catch {}
    } finally {
      setIsExporting(false);
      setIsSaveModalOpen(false);
    }
  };

  // Save worksheet (project JSON) to a user-chosen location using File System Access API
  const handleSaveWorksheetToLocation = async () => {
    if (isSavingWorksheet) return;
    setIsSavingWorksheet(true);
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const design = { layers, canvasSize, zoom, pan, savedAt: Date.now() };
      const fileName = `design-${timestamp}.json`;

      // Feature-detect the File System Access API
      const canUseFSA = typeof window !== 'undefined' && 'showSaveFilePicker' in window;
      if (canUseFSA) {
        const opts = {
          suggestedName: fileName,
          types: [
            {
              description: 'JSON Files',
              accept: { 'application/json': ['.json'] }
            }
          ]
        };
        try {
          // @ts-ignore - showSaveFilePicker is not in TS DOM lib on all versions
          const handle = await window.showSaveFilePicker(opts);
          const writable = await handle.createWritable();
          await writable.write(new Blob([JSON.stringify(design, null, 2)], { type: 'application/json' }));
          await writable.close();
        } catch (err) {
          // If user cancels or error occurs, silently ignore
        }
      } else {
        // Fallback: trigger a regular download (user chooses location via browser dialog)
        const blob = new Blob([JSON.stringify(design, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } finally {
      setIsSavingWorksheet(false);
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
    } else if (['brush', 'pen', 'eraser'].includes(selectedTool)) {
      handleDrawingMouseDown(e);
    }
  };

  const handleMouseMove = useCallback((e) => {
    if (isResizing && resizeStart.layerId) {
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;
      const newWidth = Math.max(10, resizeStart.width + deltaX);
      const newHeight = Math.max(10, resizeStart.height + deltaY);
      setLayers(prevLayers => prevLayers.map(layer =>
        layer.id === resizeStart.layerId
          ? { ...layer, width: newWidth, height: newHeight }
          : layer
      ));
      return;
    }
    if (isDragging && selectedLayer) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      
      setLayers(prevLayers => prevLayers.map(layer => 
        layer.id === selectedLayer 
          ? { ...layer, x: layer.x + deltaX, y: layer.y + deltaY }
          : layer
      ));
      setDragStart({ x: e.clientX, y: e.clientY });
    }
    if (drawingSettings.isDrawing && ['brush', 'pen', 'eraser'].includes(selectedTool)) {
      const now = performance.now();
      const minMs = 8; // throttle
      if (now - lastTimeRef.current < minMs) return;
      const point = getCanvasPoint(e.clientX, e.clientY);
      
      if (selectedTool === 'eraser') {
        // Handle eraser dragging
        handleEraserAction(point.x, point.y);
        lastTimeRef.current = now;
        lastPointRef.current = point;
        return;
      }
      
      const lastPoint = lastPointRef.current || point;
      const minDist = Math.max(1, drawingSettings.brushSize * 0.25);
      if (Math.hypot(point.x - lastPoint.x, point.y - lastPoint.y) < minDist) return;
      lastTimeRef.current = now;
      lastPointRef.current = point;
      setCurrentPath(prev => [...prev, { ...point, pressure: 1 }]);
    }
  }, [isDragging, selectedLayer, dragStart, isResizing, resizeStart, drawingSettings.isDrawing, selectedTool]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      setLayers(currentLayers => {
        saveToHistory(currentLayers);
        return currentLayers;
      });
    }
    if (isResizing) {
      setIsResizing(false);
      setResizeStart({ x: 0, y: 0, width: 0, height: 0, layerId: null });
      setLayers(currentLayers => {
        saveToHistory(currentLayers);
        return currentLayers;
      });
    }
    if (drawingSettings.isDrawing && selectedTool === 'eraser') {
      // Eraser doesn't create drawing paths, just erase content
      setDrawingSettings(prev => ({ ...prev, isDrawing: false }));
      return;
    }
    
    if (drawingSettings.isDrawing && currentPath.length > 1) {
      // Calculate bounding box for the drawing path
      const minX = Math.min(...currentPath.map(p => p.x));
      const maxX = Math.max(...currentPath.map(p => p.x));
      const minY = Math.min(...currentPath.map(p => p.y));
      const maxY = Math.max(...currentPath.map(p => p.y));
      
      // Add padding for brush size
      const padding = Math.max(drawingSettings.brushSize / 2, 5);
      const width = maxX - minX + padding * 2;
      const height = maxY - minY + padding * 2;
      
      // Only create drawing layer if it has meaningful size
      if (width > 5 && height > 5) {
        // Normalize path coordinates relative to the bounding box
        const normalizedPath = currentPath.map(point => ({
          ...point,
          x: point.x - minX + padding,
          y: point.y - minY + padding
        }));
        
        const newDrawingPath = {
          id: Date.now(),
          type: 'drawing',
          name: `${drawingSettings.drawingMode.charAt(0).toUpperCase() + drawingSettings.drawingMode.slice(1)} Path`,
          path: normalizedPath,
          brushSize: drawingSettings.brushSize,
          color: drawingSettings.brushColor,
          mode: drawingSettings.drawingMode,
          opacity: drawingSettings.opacity,
          x: minX - padding,
          y: minY - padding,
          width: Math.max(width, 20),
          height: Math.max(height, 20),
          visible: true,
          locked: false
        };
        
        setLayers(prevLayers => {
          const newLayers = [...prevLayers, newDrawingPath];
          saveToHistory(newLayers);
          return newLayers;
        });
        setSelectedLayer(newDrawingPath.id);
      }
      
      setDrawingSettings(prev => ({ ...prev, isDrawing: false }));
      setCurrentPath([]);
    } else if (drawingSettings.isDrawing) {
      // Clear the drawing state even if path is too short
      setDrawingSettings(prev => ({ ...prev, isDrawing: false }));
      setCurrentPath([]);
    }
  }, [isDragging, isResizing, drawingSettings.isDrawing, currentPath, drawingSettings.drawingMode, drawingSettings.brushSize, drawingSettings.brushColor, drawingSettings.opacity]);

  useEffect(() => {
    if (isDragging || isResizing || drawingSettings.isDrawing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, drawingSettings.isDrawing, handleMouseMove, handleMouseUp]);

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
    setHasChosenTemplate(true);
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

  // Drawing functionality
  const handleDrawingMouseDown = (e) => {
    if (!['brush', 'pen', 'eraser'].includes(selectedTool)) return;
    const { x, y } = getCanvasPoint(e.clientX, e.clientY);
    
    if (selectedTool === 'eraser') {
      // Start eraser drawing mode and erase content under cursor
      setDrawingSettings(prev => ({ ...prev, isDrawing: true }));
      handleEraserAction(x, y);
      lastPointRef.current = { x, y, pressure: 1 };
      lastTimeRef.current = performance.now();
      return;
    }
    
    setDrawingSettings(prev => ({ ...prev, isDrawing: true }));
    const firstPoint = { x, y, pressure: 1 };
    lastPointRef.current = firstPoint;
    lastTimeRef.current = performance.now();
    setCurrentPath([firstPoint]);
  };

  const handleCanvasMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });
    setIsMouseOverCanvas(true);
  };

  const handleCanvasMouseLeave = () => {
    setIsMouseOverCanvas(false);
  };

  const handleHThumbMouseDown = (e) => {
    e.preventDefault();
    const area = canvasAreaRef.current;
    if (!area) return;
    hDragRef.current = {
      isDragging: true,
      startX: e.clientX,
      startScrollLeft: area.scrollLeft
    };
    document.body.style.cursor = 'grabbing';
  };

  const handleVThumbMouseDown = (e) => {
    e.preventDefault();
    const area = canvasAreaRef.current;
    if (!area) return;
    vDragRef.current = {
      isDragging: true,
      startY: e.clientY,
      startScrollTop: area.scrollTop
    };
    document.body.style.cursor = 'grabbing';
  };

  const handleHTrackClick = (e) => {
    // Jump scroll to clicked position relative to track
    const area = canvasAreaRef.current;
    if (!area) return;
    const track = e.currentTarget;
    const rect = track.getBoundingClientRect();
    const clickX = e.clientX - rect.left - SCROLLER_MARGIN;
    const hTrackLen = Math.max(0, scrollMetrics.viewportWidth - (scrollMetrics.showV ? SCROLLER_THICKNESS + SCROLLER_MARGIN : 0) - SCROLLER_MARGIN * 2);
    const movable = Math.max(1, hTrackLen - scrollMetrics.hThumbSize);
    const ratio = Math.min(1, Math.max(0, clickX / movable));
    const scrollable = Math.max(0, scrollMetrics.contentWidth - scrollMetrics.viewportWidth);
    area.scrollLeft = Math.floor(ratio * scrollable);
    updateScrollMetrics();
  };

  const handleVTrackClick = (e) => {
    const area = canvasAreaRef.current;
    if (!area) return;
    const track = e.currentTarget;
    const rect = track.getBoundingClientRect();
    const clickY = e.clientY - rect.top - SCROLLER_MARGIN;
    const vTrackLen = Math.max(0, scrollMetrics.viewportHeight - (scrollMetrics.showH ? SCROLLER_THICKNESS + SCROLLER_MARGIN : 0) - SCROLLER_MARGIN * 2);
    const movable = Math.max(1, vTrackLen - scrollMetrics.vThumbSize);
    const ratio = Math.min(1, Math.max(0, clickY / movable));
    const scrollable = Math.max(0, scrollMetrics.contentHeight - scrollMetrics.viewportHeight);
    area.scrollTop = Math.floor(ratio * scrollable);
    updateScrollMetrics();
  };

  const handleCanvasClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (selectedTool !== 'select' && !['brush', 'pen', 'eraser'].includes(selectedTool)) {
      handleAddElement(x, y);
    } else if (selectedTool === 'select') {
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
      backgroundColor: '#0f172a',
      borderRight: '2px solid #1e293b',
      padding: '20px',
      overflowY: 'auto',
      position: 'sticky',
      top: 0,
      height: '100vh',
      zIndex: 2,
      color: '#ffffff',
      boxShadow: '4px 0 12px rgba(0, 0, 0, 0.15)',
    },
    mainArea: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#f8f9fa',
      minWidth: 0,
      overflow: 'hidden',
      transition: 'all 0.3s ease'
    },
    topToolbar: {
      height: '60px',
      backgroundColor: 'white',
      borderBottom: '1px solid #e1e5e9',
      display: 'flex',
      alignItems: 'center',
      padding: '0 20px',
      gap: '12px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
    },
    toolbarButton: {
      padding: '8px 12px',
      border: '1px solid #e1e5e9',
      borderRadius: '6px',
      backgroundColor: 'white',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px',
      color: '#333',
      transition: 'all 0.2s ease',
      fontWeight: '500',
      '&:hover': {
        backgroundColor: '#f8f9fa',
        borderColor: '#d1d5db'
      },
      '&:disabled': {
        opacity: 0.5,
        cursor: 'not-allowed'
      }
    },
    canvasArea: {
      flex: 1,
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      padding: '20px',
      paddingRight: '28px',
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
      marginRight: isRightSidebarCollapsed ? 0 : 320,
      cursor: selectedTool === 'select' ? 'default' : 
              selectedTool === 'eraser' ? 'crosshair' :
              ['brush', 'pen'].includes(selectedTool) ? 'crosshair' : 'crosshair',
      overflow: 'hidden',
      transform: `scale(${zoom / 100}) translate(${pan.x}px, ${pan.y}px)`,
      transformOrigin: 'top left',
      backgroundImage: showGrid ? 'radial-gradient(circle, #ccc 1px, transparent 1px)' : 'none',
      backgroundSize: '20px 20px'
    },
    
    rightSidebar: {
      position: 'fixed',
      right: 20,
      top: 80, // below top toolbar (60px) with spacing
      width: isRightSidebarCollapsed ? '60px' : '320px',
      backgroundColor: 'white',
      padding: isRightSidebarCollapsed ? '80px 8px 20px' : '80px 20px 20px',
      overflowY: 'auto',
      height: 'calc(100vh - 100px)',
      zIndex: 10,
      transition: 'all 0.3s ease',
      border: '1px solid #e1e5e9',
      borderRadius: '12px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
    },
    toolButton: {
      padding: '14px 18px',
      border: '1px solid #374151',
      borderRadius: '12px',
      backgroundColor: '#1e293b',
      cursor: 'pointer',
      margin: '4px 0',
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
      fontSize: '15px',
      color: '#f8fafc',
      width: '100%',
      justifyContent: 'flex-start',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      '&:hover': {
        backgroundColor: '#334155',
        borderColor: '#60a5fa',
        transform: 'translateY(-1px)',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      }
    },
    activeTool: {
      backgroundColor: '#3b82f6',
      color: '#ffffff',
      borderColor: '#60a5fa',
      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
      transform: 'translateY(-1px)',
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
      
      {/* Left Sidebar */}
      <div style={styles.leftSidebar} className="custom-scrollbar">
        {/* Header */}
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
                    border: hoveredOption === 'subheading' ? '1px solid #ffffff' : 'none',
                    backgroundColor: hoveredOption === 'subheading' ? '#334155' : 'transparent',
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
                    border: hoveredOption === 'textbox' ? '1px solid #ffffff' : 'none',
                    backgroundColor: hoveredOption === 'textbox' ? '#334155' : 'transparent',
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
                <FiCircle size={16} />
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
                <FiCircle size={16} />
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
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  backgroundColor: '#334155',
                  padding: '8px',
                  marginTop: '6px'
                }}
              >
                <button 
                  style={{ 
                    // Rectangle shape with dashed border
                    padding: '20px 16px',
                    border: '2px dashed #8b5cf6',
                    borderRadius: '12px',
                    background: hoveredOption === 'upload' 
                      ? 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)' 
                      : 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
                    cursor: 'pointer',
                    margin: '8px 0',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '14px',
                    fontWeight: '600',
                    width: '100%',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                    color: '#ffffff',
                    boxShadow: hoveredOption === 'upload' 
                      ? '0 6px 16px rgba(139, 92, 246, 0.4)' 
                      : '0 4px 12px rgba(139, 92, 246, 0.3)',
                    minHeight: '90px',
                    borderColor: hoveredOption === 'upload' ? '#a855f7' : '#8b5cf6',
                    transform: hoveredOption === 'upload' ? 'translateY(-2px)' : 'translateY(0)'
                  }}
                  onMouseEnter={() => setHoveredOption('upload')}
                  onMouseLeave={() => setHoveredOption(null)}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FiUpload size={20} color="#ffffff" />
                  <span style={{ 
                    color: '#ffffff',
                    fontSize: '13px',
                    fontWeight: '600',
                    textAlign: 'center',
                    lineHeight: '1.2'
                  }}>Upload Image</span>
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

        {/* Drawing Settings */}
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

      {/* Main Area */}
      <div style={styles.mainArea}>
        {/* Top Toolbar */}
        <TopToolbar
          styles={styles}
          undo={undo}
          redo={redo}
          historyIndex={historyIndex}
          historyLength={history.length}
          zoom={zoom}
          handleZoomOut={handleZoomOut}
          handleZoomIn={handleZoomIn}
          handleZoomReset={handleZoomReset}
          handleFitToScreen={handleFitToScreen}
          showGrid={showGrid}
          setShowGrid={setShowGrid}
          canvasSize={canvasSize}
          selectedTool={selectedTool}
          onSave={handleSaveDesign}
          onDuplicate={handleDuplicateSelected}
          hasSelection={!!selectedLayer}
        />

        {/* Canvas Area */}
        <div style={styles.canvasArea} className="custom-scrollbar" ref={canvasAreaRef}>
          <div ref={contentWrapperRef}
            style={{
              width: canvasSize.width,
              height: canvasSize.height,
              position: 'relative'
            }}
          >
            {/* Invisible spacer to create scrollable area proportional to zoom */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: canvasSize.width * (zoom / 100),
                height: canvasSize.height * (zoom / 100),
                pointerEvents: 'none',
                opacity: 0
              }}
            />
            <div 
              style={styles.canvas} 
              onClick={handleCanvasClick} 
              onMouseDown={handleDrawingMouseDown}
              onMouseMove={handleCanvasMouseMove}
              onMouseLeave={handleCanvasMouseLeave}
              ref={canvasRef}
            >
            {layers.length === 0 && !hasChosenTemplate ? (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 20
                }}
              >
                <div
                  style={{
                    textAlign: 'center',
                    width: 'min(640px, 90%)',
                    background: 'white',
                    border: '1px solid #e1e5e9',
                    borderRadius: 12,
                    padding: 20,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
                  }}
                >
                <div style={{ fontSize: '40px', marginBottom: 8 }}>🎨</div>
                <div style={{ fontWeight: 700, fontSize: '16px', color: '#111827', marginBottom: 4 }}>
                  Choose a template to get started
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: 14 }}>
                  Pick a preset below. You can still adjust the canvas later.
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                    gap: 10,
                    textAlign: 'left'
                  }}
                >
                  {templates.map(template => (
                    <button
                      key={template.id}
                      onClick={() => handleTemplateSelect(template)}
                      title={`${template.name} - ${template.width}×${template.height}`}
                      style={{
                        cursor: 'pointer',
                        padding: 10,
                        border: '1px solid #e5e7eb',
                        borderRadius: 10,
                        background: 'white',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 6,
                        transition: 'box-shadow 0.15s ease, transform 0.05s ease',
                        alignItems: 'flex-start'
                      }}
                      onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
                      onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'}
                      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'scale(1)'; }}
                    >
                      <div style={{ fontSize: 18 }}>{template.thumbnail}</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{template.name}</div>
                      <div style={{ fontSize: 11, color: '#6b7280' }}>{template.width}×{template.height}</div>
                      <div
                        style={{
                          fontSize: 10,
                          color: '#2563eb',
                          backgroundColor: '#e0ecff',
                          padding: '2px 6px',
                          borderRadius: 999
                        }}
                      >
                        {template.category}
                      </div>
                    </button>
                  ))}
                </div>
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
                        fontStyle: layer.fontStyle || 'normal',
                        textDecoration: layer.textDecoration || 'none',
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
                  {layer.type === 'shape' && (() => {
                    const display = getShapeDisplayProps(layer.shape);
                    return (
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          backgroundColor: layer.fillColor,
                          border: `${layer.strokeWidth}px solid ${layer.strokeColor}`,
                          borderRadius: display.borderRadius,
                          clipPath: display.clipPath
                        }}
                      />
                    );
                  })()}
                  {layer.type === 'image' && (
                    <div style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: `${layer.cornerRadius ?? 4}px`,
                      overflow: 'hidden',
                      position: 'relative',
                      opacity: (layer.opacity ?? 100) / 100,
                      filter: `brightness(${layer.brightness ?? 100}%) contrast(${layer.contrast ?? 100}%) saturate(${layer.saturation ?? 100}%) blur(${layer.blur ?? 0}px)`
                    }}>
                      <img
                        src={layer.src}
                        alt={layer.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block'
                        }}
                        draggable={false}
                      />
                      {(layer.strokeWidth ?? 0) > 0 && (
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          borderRadius: `${layer.cornerRadius ?? 4}px`,
                          pointerEvents: 'none',
                          border: `${layer.strokeWidth ?? 0}px ${layer.strokeStyle === 'dashed' ? 'dashed' : 'solid'} ${layer.strokeColor ?? '#000'}`
                        }} />
                      )}
                    </div>
                  )}
                  {layer.type === 'drawing' && (
                    <svg
                      width={layer.width}
                      height={layer.height}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        pointerEvents: 'none'
                      }}
                      viewBox={`0 0 ${layer.width} ${layer.height}`}
                    >
                      <path
                        d={layer.path.map((point, index) => 
                          index === 0 ? `M ${point.x} ${point.y}` : `L ${point.x} ${point.y}`
                        ).join(' ')}
                        stroke={layer.mode === 'eraser' ? '#ffffff' : layer.color}
                        strokeWidth={layer.brushSize}
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity={layer.opacity / 100}
                        style={{
                          mixBlendMode: layer.mode === 'eraser' ? 'multiply' : 'normal'
                        }}
                      />
                    </svg>
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
            
            {/* Eraser preview - circular cursor */}
            {selectedTool === 'eraser' && isMouseOverCanvas && (
              <div
                style={{
                  position: 'absolute',
                  left: `${mousePosition.x}px`,
                  top: `${mousePosition.y}px`,
                  width: `${drawingSettings.brushSize}px`,
                  height: `${drawingSettings.brushSize}px`,
                  borderRadius: '50%',
                  border: `2px solid ${drawingSettings.brushColor}`,
                  backgroundColor: `${drawingSettings.brushColor}20`,
                  transform: 'translate(-50%, -50%)',
                  pointerEvents: 'none',
                  zIndex: 1000,
                  boxShadow: '0 0 0 1px rgba(0,0,0,0.3)'
                }}
              />
            )}

            {/* Current drawing path preview */}
            {drawingSettings.isDrawing && currentPath.length > 0 && selectedTool !== 'eraser' && (
              <svg
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: canvasSize.width,
                  height: canvasSize.height,
                  pointerEvents: 'none',
                  zIndex: 1000
                }}
                viewBox={`0 0 ${canvasSize.width} ${canvasSize.height}`}
              >
                <path
                  d={currentPath.map((point, index) => 
                    index === 0 ? `M ${point.x} ${point.y}` : `L ${point.x} ${point.y}`
                  ).join(' ')}
                  stroke={drawingSettings.drawingMode === 'eraser' ? '#ffffff' : drawingSettings.brushColor}
                  strokeWidth={drawingSettings.brushSize}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity={drawingSettings.opacity / 100}
                  style={{
                    mixBlendMode: drawingSettings.drawingMode === 'eraser' ? 'multiply' : 'normal'
                  }}
                />
              </svg>
            )}
            </div>
          </div>
          {/* Custom Scrollers */}
          {scrollMetrics.showH && (
            <div
              onMouseDown={handleHTrackClick}
              style={{
                position: 'absolute',
                left: SCROLLER_MARGIN,
                right: SCROLLER_MARGIN + (scrollMetrics.showV ? SCROLLER_THICKNESS + SCROLLER_MARGIN : 0),
                bottom: SCROLLER_MARGIN,
                height: SCROLLER_THICKNESS,
                background: '#e5e7eb',
                borderRadius: 6,
                cursor: 'pointer',
                zIndex: 2000,
                boxShadow: '0 1px 3px rgba(0,0,0,0.15)'
              }}
            >
              <div
                onMouseDown={handleHThumbMouseDown}
                style={{
                  position: 'absolute',
                  left: scrollMetrics.hThumbPos,
                  top: 0,
                  height: SCROLLER_THICKNESS,
                  width: scrollMetrics.hThumbSize,
                  background: '#9ca3af',
                  borderRadius: 6,
                  cursor: 'grab',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
                }}
              />
            </div>
          )}
          {scrollMetrics.showV && (
            <div
              onMouseDown={handleVTrackClick}
              style={{
                position: 'absolute',
                top: SCROLLER_MARGIN,
                bottom: SCROLLER_MARGIN + (scrollMetrics.showH ? SCROLLER_THICKNESS + SCROLLER_MARGIN : 0),
                right: SCROLLER_MARGIN,
                width: SCROLLER_THICKNESS,
                background: '#e5e7eb',
                borderRadius: 6,
                cursor: 'pointer',
                zIndex: 2000,
                boxShadow: '0 1px 3px rgba(0,0,0,0.15)'
              }}
            >
              <div
                onMouseDown={handleVThumbMouseDown}
                style={{
                  position: 'absolute',
                  top: scrollMetrics.vThumbPos,
                  left: 0,
                  width: SCROLLER_THICKNESS,
                  height: scrollMetrics.vThumbSize,
                  background: '#9ca3af',
                  borderRadius: 6,
                  cursor: 'grab',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
                }}
              />
            </div>
          )}
        </div>
      </div>
      <SaveExportModal
        open={isSaveModalOpen}
        onClose={() => !isExporting && setIsSaveModalOpen(false)}
        exportFormat={exportFormat}
        setExportFormat={setExportFormat}
        exportQuality={exportQuality}
        setExportQuality={setExportQuality}
        includeProjectFile={includeProjectFile}
        setIncludeProjectFile={setIncludeProjectFile}
        isExporting={isExporting}
        onDownload={handleDownloadExport}
        onSaveWorksheet={handleSaveWorksheetToLocation}
      />

      {/* Right Sidebar */}
      <div style={styles.rightSidebar} className="custom-scrollbar">
        {/* Toggle Button */}
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
                  <div onClick={() => handleLayerSelect(layer.id)} style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{layer.name}</div>
                  <div style={{ fontSize: '12px', color: '#666', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{layer.type}</div>
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

        {/* Collapsed state - show layer count and quick actions */}
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

        {/* Properties Panel */}
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
                  <div
                    onClick={() => textColorInputRef.current && textColorInputRef.current.click()}
                    title={textSettings.color}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      border: '1px solid #d1d5db',
                      boxShadow: 'inset 0 0 0 12px ' + (textSettings.color || '#000'),
                      cursor: 'pointer'
                    }}
                  />
                  <input
                    ref={textColorInputRef}
                    type="color"
                    value={textSettings.color}
                    onChange={(e) => handleTextSettingsChange('color', e.target.value)}
                    style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 0, height: 0 }}
                    tabIndex={-1}
                    aria-hidden="true"
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
                  <span style={styles.propertyLabel}>Stroke Color</span>
                  <div
                    onClick={() => strokeColorInputRef.current && strokeColorInputRef.current.click()}
                    title={imageSettings.strokeColor}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      border: '1px solid #d1d5db',
                      boxShadow: 'inset 0 0 0 12px ' + (imageSettings.strokeColor || '#000'),
                      cursor: 'pointer'
                    }}
                  />
                  <input
                    ref={strokeColorInputRef}
                    type="color"
                    value={imageSettings.strokeColor}
                    onChange={(e) => handleImageSettingsChange('strokeColor', e.target.value)}
                    style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 0, height: 0 }}
                    tabIndex={-1}
                    aria-hidden="true"
                  />
                </div>
                <div style={styles.propertyRow}>
                  <span style={styles.propertyLabel}>Stroke Width</span>
                  <input
                    type="number"
                    value={imageSettings.strokeWidth}
                    onChange={(e) => handleImageSettingsChange('strokeWidth', parseInt(e.target.value) || 0)}
                    style={styles.propertyInput}
                  />
                </div>
                <div style={styles.propertyRow}>
                  <span style={styles.propertyLabel}>Stroke Style</span>
                  <select
                    value={imageSettings.strokeStyle}
                    onChange={(e) => handleImageSettingsChange('strokeStyle', e.target.value)}
                    style={styles.propertyInput}
                  >
                    <option value="solid">Solid</option>
                    <option value="dashed">Dashed</option>
                  </select>
                </div>
                <div style={styles.propertyRow}>
                  <span style={styles.propertyLabel}>Corner Radius</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={imageSettings.cornerRadius}
                    onChange={(e) => handleImageSettingsChange('cornerRadius', parseInt(e.target.value))}
                    style={{ width: '100px' }}
                  />
                  <span style={{ fontSize: '12px', color: '#666', minWidth: '30px' }}>
                    {imageSettings.cornerRadius}px
                  </span>
                </div>
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
    </div>
  );
};

export default CanvaEditor;