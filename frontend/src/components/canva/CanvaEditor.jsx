import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { BrightnessControl, ContrastControl, BlurControl, ShadowsControl, OpacityControl } from './controls';
import { getFilterCSS, getShadowCSS, hexToRgba } from '../../utils/styleUtils';
import { calculateTextDimensions, isHeadingLayer } from '../../utils/textUtils';
import { FiType, FiImage, FiSquare, FiUpload, FiDownload, FiSave, FiCircle, FiTriangle, FiEdit3, FiMove, FiRotateCw, FiRotateCcw, FiCrop, FiFilter, FiAlignLeft, FiAlignCenter, FiAlignRight, FiBold, FiItalic, FiUnderline, FiLayers, FiEye, FiEyeOff, FiTrash2, FiCopy, FiZoomIn, FiZoomOut, FiGrid, FiMaximize, FiMinimize, FiStar, FiHeart, FiZap, FiShield, FiTarget, FiTrendingUp, FiPlus, FiMinus, FiX, FiCheck, FiArrowUp, FiArrowDown, FiArrowLeft, FiArrowRight, FiChevronDown, FiChevronRight, FiCloud } from 'react-icons/fi';
import TopToolbar from './TopToolbar';
import SaveExportModal from './SaveExportModal';
import AIImageGenerator from './AIImageGenerator';
import FloatingToolbar from './FloatingToolbar';
import TextEnhanceButton from './TextEnhanceButton';
import { enhanceText } from './TextEnhanceService';
import TextStyleModal from './TextStyleModal';

const CanvaEditor = () => {
  const { id: projectId } = useParams();
  const navigate = useNavigate();
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
  const [isRotating, setIsRotating] = useState(false);
  const [rotateStart, setRotateStart] = useState({ cx: 0, cy: 0, startAngleDeg: 0, startRotation: 0, layerId: null });

  useEffect(() => {
    if (projectId) {
      api.getProject(projectId).then(project => {
        if (project && project.design) {
          setLayers(project.design.layers || []);
          setCanvasSize(project.design.canvasSize || { width: 800, height: 600 });
          setZoom(project.design.zoom || 100);
          setPan(project.design.pan || { x: 0, y: 0 });
        }
      }).catch(error => {
        console.error("Failed to load project", error);
        // Optionally, show an error message to the user
      });
    }
  }, [projectId]);


  // Drag and drop for layers panel
  const [draggedLayer, setDraggedLayer] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(-1);
  const [isLayerDragging, setIsLayerDragging] = useState(false);
  // Rename layer (right sidebar)
  const [renamingLayerId, setRenamingLayerId] = useState(null);
  const [renameValue, setRenameValue] = useState('');
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
    strokeWidth: 1,
    fillType: 'color', // 'color' | 'image'
    fillImageSrc: null,
    fillImageFit: 'cover' // 'cover' | 'contain'
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
  const [isEnhancingText, setIsEnhancingText] = useState(false);
  const [isGeneratingStyles, setIsGeneratingStyles] = useState(false);
  const [showStyleModal, setShowStyleModal] = useState(false);
  const [isHeading, setIsHeading] = useState(false);
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
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const handleAddElement = (x = 100, y = 100, toolOverride = null) => {
  let newLayer;
  const tool = toolOverride || selectedTool;

  if (tool === 'text' || tool === 'heading' || tool === 'subheading' || tool === 'textbox') {
    const isHeading = tool === 'heading';
    const isSubheading = tool === 'subheading';

    const presetName =
      tool === 'heading'
        ? 'Heading'
        : tool === 'subheading'
        ? 'Subheading'
        : 'Body Text';

    const presetText =
      tool === 'heading'
        ? 'Add a heading'
        : tool === 'subheading'
        ? 'Add a subheading'
        : 'Add some body text';

    const presetFontSize =
      tool === 'heading'
        ? 32
        : tool === 'subheading'
        ? 24
        : 16;

    const presetFontWeight = isHeading ? '700' : isSubheading ? '600' : '400';

    const width = 300;
    const height = isHeading ? 80 : isSubheading ? 60 : 50;

    const safeX = x;
    const safeY = y;

    newLayer = {
      id: Date.now(),
      type: 'text',
      name: presetName,
      text: presetText,
      x: safeX,
      y: safeY,
      width,
      height,
      ...textSettings,
      fontSize: presetFontSize,
      fontWeight: presetFontWeight,
      visible: true,
      locked: false,
      rotation: 0,
    };
  } else if (
    ['rectangle','roundedRectangle','circle','ellipse','triangle','rightTriangle',
     'diamond','pentagon','hexagon','star','star6','heart','arrow','arrowLeft',
     'arrowUp','arrowDown','cloud'].includes(tool)
  ) {
    const width =
      tool === 'ellipse' || tool === 'roundedRectangle' ? 160
      : tool.includes('arrow') ? 140
      : 100;
    const height =
      tool === 'ellipse' || tool === 'roundedRectangle' ? 100
      : 100;

    const safeX = clamp(x, 0, canvasSize.width - width);
    const safeY = clamp(y, 0, canvasSize.height - height);

    newLayer = {
      id: Date.now(),
      type: 'shape',
      name: tool.charAt(0).toUpperCase() + tool.slice(1),
      shape: tool,
      x: safeX,
      y: safeY,
      width,
      height,
      ...shapeSettings,
      visible: true,
      locked: false,
      rotation: 0,
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
      // Auto-detect if it's a heading based on name or font size
      const isHeadingText = isHeadingLayer(layer);
      setIsHeading(isHeadingText);
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

  // Keyboard shortcuts and custom events
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Delete' && selectedLayer) {
        handleLayerDelete(selectedLayer);
      }
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z') {
          e.preventDefault();
          undo();
        } else if (e.key === 'y') {
          e.preventDefault();
          redo();
        }
      }
    };

    const handleOpenTextStyleModal = () => {
      const selectedTextLayer = layers.find(l => l.id === selectedLayer && l.type === 'text');
      if (selectedTextLayer && selectedTextLayer.text && selectedTextLayer.text.trim()) {
        setShowStyleModal(true);
      }
    };

    const handleAddStyledImageFromEvent = (e) => {
      try {
        handleAddStyledImageToCanvas(e.detail.imageUrl);
      } catch (error) {
        console.error('Error adding styled image to canvas:', error);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('openTextStyleModal', handleOpenTextStyleModal);
    window.addEventListener('addStyledImageToCanvas', handleAddStyledImageFromEvent);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('openTextStyleModal', handleOpenTextStyleModal);
      window.removeEventListener('addStyledImageToCanvas', handleAddStyledImageFromEvent);
    };
  }, [selectedLayer, handleLayerDelete, undo, redo, layers]);

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

  // Inline rename helpers
  const startRenameLayer = (layer) => {
    setRenamingLayerId(layer.id);
    setRenameValue(layer.name || '');
  };

  const commitRenameLayer = () => {
    if (!renamingLayerId) return;
    const trimmed = renameValue.trim();
    const newLayers = layers.map(l => l.id === renamingLayerId ? { ...l, name: trimmed || l.name } : l);
    setLayers(newLayers);
    saveToHistory(newLayers);
    setRenamingLayerId(null);
    setRenameValue('');
  };

  const handleLayerMoveUp = (layerId) => {
    const currentIndex = layers.findIndex(l => l.id === layerId);
    if (currentIndex < layers.length - 1) {
      const newLayers = [...layers];
      [newLayers[currentIndex], newLayers[currentIndex + 1]] = [newLayers[currentIndex + 1], newLayers[currentIndex]];
      setLayers(newLayers);
      saveToHistory(newLayers);
    }
  };

  const handleLayerMoveDown = (layerId) => {
    const currentIndex = layers.findIndex(l => l.id === layerId);
    if (currentIndex > 0) {
      const newLayers = [...layers];
      [newLayers[currentIndex], newLayers[currentIndex - 1]] = [newLayers[currentIndex - 1], newLayers[currentIndex]];
      setLayers(newLayers);
      saveToHistory(newLayers);
    }
  };

  // Floating toolbar color helpers
  const getLayerPrimaryColor = (layer) => {
    if (!layer) return '#000000';
    if (layer.type === 'text') return layer.color || '#000000';
    if (layer.type === 'shape') return layer.fillColor || '#3182ce';
    if (layer.type === 'drawing') return layer.color || '#000000';
    if (layer.type === 'image') return layer.strokeColor || '#000000';
    return '#000000';
  };

  const handleQuickColorChange = (colorValue) => {
    if (!selectedLayer) return;
    const newLayers = layers.map(l => {
      if (l.id !== selectedLayer) return l;
      if (l.type === 'text') return { ...l, color: colorValue };
      if (l.type === 'shape') return { ...l, fillColor: colorValue };
      if (l.type === 'drawing') return { ...l, color: colorValue };
      if (l.type === 'image') return { ...l, strokeColor: colorValue };
      return l;
    });
    setLayers(newLayers);
    saveToHistory(newLayers);
  };

  // Drag and drop handlers for layers panel
  const handleLayerDragStart = (e, layerId) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.outerHTML);
    setDraggedLayer(layerId);
    setIsLayerDragging(true);
  };

  const handleLayerDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleLayerDragLeave = (e) => {
    // Only reset if we're actually leaving the layer item
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverIndex(-1);
    }
  };

  const handleLayerDrop = (e, dropIndex) => {
    e.preventDefault();

    if (draggedLayer === null) return;

    const draggedIndex = layers.findIndex(l => l.id === draggedLayer);
    if (draggedIndex === -1 || draggedIndex === dropIndex) {
      setDraggedLayer(null);
      setDragOverIndex(-1);
      setIsLayerDragging(false);
      return;
    }

    const newLayers = [...layers];
    const draggedLayerData = newLayers[draggedIndex];

    // Remove the dragged layer
    newLayers.splice(draggedIndex, 1);

    // Insert at new position
    const newIndex = draggedIndex < dropIndex ? dropIndex - 1 : dropIndex;
    newLayers.splice(newIndex, 0, draggedLayerData);

    setLayers(newLayers);
    saveToHistory(newLayers);

    // Reset drag state
    setDraggedLayer(null);
    setDragOverIndex(-1);
    setIsLayerDragging(false);
  };

  const handleLayerDragEnd = () => {
    setDraggedLayer(null);
    setDragOverIndex(-1);
    setIsLayerDragging(false);
  };

  // Export: open modal with export options
  const handleExport = () => {
    setIsSaveModalOpen(true);
  };

 //Handle save canva design (new + existing)
  const handleSave = async () => {
    const design = { layers, canvasSize, zoom, pan };

    try {
      if (projectId) {
        await api.updateProjectDesign(projectId, design);
        alert('Design saved successfully!');
      } else {
        const newProjectData = {
          title: "Untitled Design",
          desc: "Created in Canva Clone",
          icon: "🎨",
          category: "General",
          status: "Active",
          design: design,
        };

        const newProject = await api.createProject(newProjectData);

        if (newProject && newProject._id) {
          alert('Project created successfully!');

          navigate(`/canva-clone/${newProject._id}`, { replace: true });
        }
      }
    } catch (error) {
      console.error('Failed to save design:', error);
      alert('Error saving design. Please try again.');
    }
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
      // Apply effects
      ctx.globalAlpha = (layer.opacity ?? 100) / 100;
      ctx.filter = getFilterCSS({
        brightness: layer.brightness ?? 100,
        contrast: layer.contrast ?? 100,
        blur: layer.blur ?? 0
      });
      if (layer.shadows?.enabled) {
        ctx.shadowColor = hexToRgba(layer.shadows.color, (layer.shadows.opacity ?? 50) / 100);
        ctx.shadowBlur = layer.shadows.blur ?? 0;
        ctx.shadowOffsetX = layer.shadows.x ?? 0;
        ctx.shadowOffsetY = layer.shadows.y ?? 0;
      } else {
        // Explicitly reset shadow properties when disabled
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
      }
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

    // Helper function to draw shape path
    const drawShapePath = (ctx, s, x, y, w, h) => {
      if (s === 'rectangle') {
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.closePath();
      } else if (s === 'roundedRectangle') {
        drawRoundedRect(x, y, w, h, 16);
      } else if (s === 'circle') {
        ctx.beginPath();
        ctx.arc(x + Math.min(w, h) / 2, y + Math.min(w, h) / 2, Math.min(w, h) / 2, 0, Math.PI * 2);
        ctx.closePath();
      } else if (s === 'ellipse') {
        ctx.beginPath();
        ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
        ctx.closePath();
      } else if (s === 'triangle') {
        ctx.beginPath();
        ctx.moveTo(x + w / 2, y);
        ctx.lineTo(x, y + h);
        ctx.lineTo(x + w, y + h);
        ctx.closePath();
      } else if (s === 'rightTriangle') {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + w, y);
        ctx.lineTo(x, y + h);
        ctx.closePath();
      } else if (s === 'diamond') {
        ctx.beginPath();
        ctx.moveTo(x + w / 2, y);
        ctx.lineTo(x + w, y + h / 2);
        ctx.lineTo(x + w / 2, y + h);
        ctx.lineTo(x, y + h / 2);
        ctx.closePath();
      } else if (s === 'pentagon') {
        ctx.beginPath();
        ctx.moveTo(x + w * 0.5, y);
        ctx.lineTo(x + w * 0.95, y + h * 0.38);
        ctx.lineTo(x + w * 0.77, y + h);
        ctx.lineTo(x + w * 0.23, y + h);
        ctx.lineTo(x + w * 0.05, y + h * 0.38);
        ctx.closePath();
      } else if (s === 'hexagon') {
        ctx.beginPath();
        ctx.moveTo(x + w * 0.25, y);
        ctx.lineTo(x + w * 0.75, y);
        ctx.lineTo(x + w, y + h * 0.5);
        ctx.lineTo(x + w * 0.75, y + h);
        ctx.lineTo(x + w * 0.25, y + h);
        ctx.lineTo(x, y + h * 0.5);
        ctx.closePath();
      } else if (s === 'star') {
        ctx.beginPath();
        ctx.moveTo(x + w * 0.5, y);
        ctx.lineTo(x + w * 0.61, y + h * 0.35);
        ctx.lineTo(x + w * 0.98, y + h * 0.35);
        ctx.lineTo(x + w * 0.68, y + h * 0.57);
        ctx.lineTo(x + w * 0.79, y + h * 0.91);
        ctx.lineTo(x + w * 0.5, y + h * 0.70);
        ctx.lineTo(x + w * 0.21, y + h * 0.91);
        ctx.lineTo(x + w * 0.32, y + h * 0.57);
        ctx.lineTo(x + w * 0.02, y + h * 0.35);
        ctx.lineTo(x + w * 0.39, y + h * 0.35);
        ctx.closePath();
      } else if (s === 'star6') {
        ctx.beginPath();
        const centerX = x + w / 2;
        const centerY = y + h / 2;
        const outerRadius = Math.min(w, h) / 2;
        const innerRadius = outerRadius * 0.5;
        for (let i = 0; i < 12; i++) {
          const angle = (i * Math.PI) / 6 - Math.PI / 2;
          const radius = i % 2 === 0 ? outerRadius : innerRadius;
          const px = centerX + radius * Math.cos(angle);
          const py = centerY + radius * Math.sin(angle);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
      } else if (s === 'heart') {
        ctx.beginPath();
        ctx.moveTo(x + w * 0.5, y + h * 0.85);
        ctx.bezierCurveTo(x + w * 0.15, y + h * 0.85, x + w * 0.15, y + h * 0.50, x + w * 0.15, y + h * 0.50);
        ctx.bezierCurveTo(x + w * 0.15, y + h * 0.15, x + w * 0.35, y, x + w * 0.5, y + h * 0.15);
        ctx.bezierCurveTo(x + w * 0.65, y, x + w * 0.85, y + h * 0.15, x + w * 0.85, y + h * 0.50);
        ctx.bezierCurveTo(x + w * 0.85, y + h * 0.50, x + w * 0.85, y + h * 0.85, x + w * 0.5, y + h * 0.85);
        ctx.closePath();
      } else if (s === 'arrow') {
        ctx.beginPath();
        ctx.moveTo(x, y + h * 0.3);
        ctx.lineTo(x + w * 0.6, y + h * 0.3);
        ctx.lineTo(x + w * 0.6, y + h * 0.1);
        ctx.lineTo(x + w, y + h * 0.5);
        ctx.lineTo(x + w * 0.6, y + h * 0.9);
        ctx.lineTo(x + w * 0.6, y + h * 0.7);
        ctx.lineTo(x, y + h * 0.7);
        ctx.closePath();
      } else if (s === 'arrowLeft') {
        ctx.beginPath();
        ctx.moveTo(x + w, y + h * 0.3);
        ctx.lineTo(x + w * 0.4, y + h * 0.3);
        ctx.lineTo(x + w * 0.4, y + h * 0.1);
        ctx.lineTo(x, y + h * 0.5);
        ctx.lineTo(x + w * 0.4, y + h * 0.9);
        ctx.lineTo(x + w * 0.4, y + h * 0.7);
        ctx.lineTo(x + w, y + h * 0.7);
        ctx.closePath();
      } else if (s === 'arrowUp') {
        ctx.beginPath();
        ctx.moveTo(x + w * 0.3, y + h);
        ctx.lineTo(x + w * 0.3, y + h * 0.4);
        ctx.lineTo(x + w * 0.1, y + h * 0.4);
        ctx.lineTo(x + w * 0.5, y);
        ctx.lineTo(x + w * 0.9, y + h * 0.4);
        ctx.lineTo(x + w * 0.7, y + h * 0.4);
        ctx.lineTo(x + w * 0.7, y + h);
        ctx.closePath();
      } else if (s === 'arrowDown') {
        ctx.beginPath();
        ctx.moveTo(x + w * 0.3, y);
        ctx.lineTo(x + w * 0.3, y + h * 0.6);
        ctx.lineTo(x + w * 0.1, y + h * 0.6);
        ctx.lineTo(x + w * 0.5, y + h);
        ctx.lineTo(x + w * 0.9, y + h * 0.6);
        ctx.lineTo(x + w * 0.7, y + h * 0.6);
        ctx.lineTo(x + w * 0.7, y);
        ctx.closePath();
      } else if (s === 'cloud') {
        ctx.beginPath();
        ctx.moveTo(x + w * 0.25, y + h * 0.5);
        ctx.bezierCurveTo(x + w * 0.1, y + h * 0.5, x, y + h * 0.35, x + w * 0.1, y + h * 0.25);
        ctx.bezierCurveTo(x + w * 0.1, y + h * 0.1, x + w * 0.25, y, x + w * 0.4, y + h * 0.1);
        ctx.bezierCurveTo(x + w * 0.5, y, x + w * 0.6, y + h * 0.1, x + w * 0.6, y + h * 0.25);
        ctx.bezierCurveTo(x + w * 0.9, y + h * 0.25, x + w, y + h * 0.4, x + w * 0.85, y + h * 0.5);
        ctx.bezierCurveTo(x + w * 0.95, y + h * 0.6, x + w * 0.9, y + h * 0.75, x + w * 0.75, y + h * 0.8);
        ctx.bezierCurveTo(x + w * 0.7, y + h * 0.95, x + w * 0.5, y + h, x + w * 0.35, y + h * 0.9);
        ctx.bezierCurveTo(x + w * 0.2, y + h * 0.95, x + w * 0.05, y + h * 0.85, x + w * 0.1, y + h * 0.7);
        ctx.bezierCurveTo(x, y + h * 0.6, x + w * 0.05, y + h * 0.5, x + w * 0.15, y + h * 0.5);
        ctx.closePath();
      } else {
        drawRoundedRect(x, y, w, h, 8);
      }
    };

    const drawShape = (layer) => {
      const x = layer.x;
      const y = layer.y;
      const w = layer.width || 100;
      const h = layer.height || 100;
      const fill = layer.fillColor || '#3182ce';
      const stroke = layer.strokeColor || '#000000';
      const strokeWidth = Number.isFinite(layer.strokeWidth) ? layer.strokeWidth : 1;
      const s = layer.shape;

      ctx.save();
      // Apply effects
      ctx.globalAlpha = (layer.opacity ?? 100) / 100;
      ctx.filter = getFilterCSS({
        brightness: layer.brightness ?? 100,
        contrast: layer.contrast ?? 100,
        blur: layer.blur ?? 0
      });

      // Step 1: Draw shadow first (if enabled)
      if (layer.shadows?.enabled) {
        ctx.save();
        ctx.shadowColor = hexToRgba(layer.shadows.color, (layer.shadows.opacity ?? 50) / 100);
        ctx.shadowBlur = layer.shadows.blur ?? 0;
        ctx.shadowOffsetX = layer.shadows.x ?? 0;
        ctx.shadowOffsetY = layer.shadows.y ?? 0;
        ctx.fillStyle = fill;
        drawShapePath(ctx, s, x, y, w, h);
        // Use evenodd fill rule for star shapes
        if (s === 'star' || s === 'star6') {
          ctx.fill('evenodd');
        } else {
          ctx.fill();
        }
        ctx.restore();
      }

      // Step 2: Draw the actual shape fill (without shadow)
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.fillStyle = fill;

      if (layer.fillType === 'image' && layer.fillImageSrc) {
        // Image fill is handled separately
        const path = new Path2D();
        if (s === 'rectangle') {
          path.rect(x, y, w, h);
        } else if (s === 'circle') {
          path.arc(x + Math.min(w, h) / 2, y + Math.min(w, h) / 2, Math.min(w, h) / 2, 0, Math.PI * 2);
        } else if (s === 'triangle') {
          path.moveTo(x + w / 2, y);
          path.lineTo(x, y + h);
          path.lineTo(x + w, y + h);
          path.closePath();
        } else if (s === 'rightTriangle') {
          path.moveTo(x, y);
          path.lineTo(x + w, y);
          path.lineTo(x, y + h);
          path.closePath();
        } else if (s === 'diamond') {
          path.moveTo(x + w / 2, y);
          path.lineTo(x + w, y + h / 2);
          path.lineTo(x + w / 2, y + h);
          path.lineTo(x, y + h / 2);
          path.closePath();
        }
        ctx.clip(path);
        ctx.fillStyle = '#ddd';
        ctx.fill();
      } else {
        drawShapePath(ctx, s, x, y, w, h);
        // Use evenodd fill rule for star shapes
        if (s === 'star' || s === 'star6') {
          ctx.fill('evenodd');
        } else {
          ctx.fill();
        }
      }

      // Step 3: Draw stroke (if any)
      if (strokeWidth > 0) {
        ctx.strokeStyle = stroke;
        ctx.lineWidth = strokeWidth;
        // For star shapes, we need to redraw the path for stroke since fill('evenodd') consumes the path
        if (s === 'star' || s === 'star6') {
          drawShapePath(ctx, s, x, y, w, h);
        }
        ctx.stroke();
      }

      ctx.restore();
    };

    const drawShapeLayerWithImage = async (layer) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          const x = layer.x;
          const y = layer.y;
          const w = layer.width || img.width;
          const h = layer.height || img.height;

          ctx.save();
          // Apply effects
          ctx.globalAlpha = (layer.opacity ?? 100) / 100;
          ctx.filter = getFilterCSS({
            brightness: layer.brightness ?? 100,
            contrast: layer.contrast ?? 100,
            blur: layer.blur ?? 0
          });
          if (layer.shadows?.enabled) {
            ctx.shadowColor = hexToRgba(layer.shadows.color, (layer.shadows.opacity ?? 50) / 100);
            ctx.shadowBlur = layer.shadows.blur ?? 0;
            ctx.shadowOffsetX = layer.shadows.x ?? 0;
            ctx.shadowOffsetY = layer.shadows.y ?? 0;
          } else {
            // Explicitly reset shadow properties when disabled
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
          }
          // Draw shape directly on context (not Path2D) for proper shadow support
          const s = layer.shape;

          // First, draw the shape filled to create the shadow
          ctx.fillStyle = layer.fillColor || '#3182ce';
          if (s === 'rectangle') {
            ctx.beginPath();
            ctx.rect(x, y, w, h);
            ctx.closePath();
            ctx.fill();
          } else if (s === 'roundedRectangle') {
            drawRoundedRect(x, y, w, h, 16);
            ctx.fill();
          } else if (s === 'circle') {
            ctx.beginPath();
            ctx.arc(x + Math.min(w, h) / 2, y + Math.min(w, h) / 2, Math.min(w, h) / 2, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
          } else if (s === 'ellipse') {
            ctx.beginPath();
            ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
          } else if (s === 'triangle') {
            ctx.beginPath();
            ctx.moveTo(x + w / 2, y);
            ctx.lineTo(x, y + h);
            ctx.lineTo(x + w, y + h);
            ctx.closePath();
            ctx.fill();
          } else if (s === 'rightTriangle') {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + w, y);
            ctx.lineTo(x, y + h);
            ctx.closePath();
            ctx.fill();
          } else if (s === 'diamond') {
            ctx.beginPath();
            ctx.moveTo(x + w / 2, y);
            ctx.lineTo(x + w, y + h / 2);
            ctx.lineTo(x + w / 2, y + h);
            ctx.lineTo(x, y + h / 2);
            ctx.closePath();
            ctx.fill();
          } else if (s === 'pentagon') {
            ctx.beginPath();
            ctx.moveTo(x + w * 0.5, y);
            ctx.lineTo(x + w * 0.95, y + h * 0.38);
            ctx.lineTo(x + w * 0.77, y + h);
            ctx.lineTo(x + w * 0.23, y + h);
            ctx.lineTo(x + w * 0.05, y + h * 0.38);
            ctx.closePath();
            ctx.fill();
          } else if (s === 'hexagon') {
            ctx.beginPath();
            ctx.moveTo(x + w * 0.25, y);
            ctx.lineTo(x + w * 0.75, y);
            ctx.lineTo(x + w, y + h * 0.5);
            ctx.lineTo(x + w * 0.75, y + h);
            ctx.lineTo(x + w * 0.25, y + h);
            ctx.lineTo(x, y + h * 0.5);
            ctx.closePath();
            ctx.fill();
          } else if (s === 'star') {
            ctx.beginPath();
            ctx.moveTo(x + w * 0.5, y);
            ctx.lineTo(x + w * 0.61, y + h * 0.35);
            ctx.lineTo(x + w * 0.98, y + h * 0.35);
            ctx.lineTo(x + w * 0.68, y + h * 0.57);
            ctx.lineTo(x + w * 0.79, y + h * 0.91);
            ctx.lineTo(x + w * 0.5, y + h * 0.70);
            ctx.lineTo(x + w * 0.21, y + h * 0.91);
            ctx.lineTo(x + w * 0.32, y + h * 0.57);
            ctx.lineTo(x + w * 0.02, y + h * 0.35);
            ctx.lineTo(x + w * 0.39, y + h * 0.35);
            ctx.closePath();
            ctx.fill('evenodd');
          } else if (s === 'star6') {
            ctx.beginPath();
            const centerX = x + w / 2;
            const centerY = y + h / 2;
            const outerRadius = Math.min(w, h) / 2;
            const innerRadius = outerRadius * 0.5;
            for (let i = 0; i < 12; i++) {
              const angle = (i * Math.PI) / 6 - Math.PI / 2;
              const radius = i % 2 === 0 ? outerRadius : innerRadius;
              const px = centerX + radius * Math.cos(angle);
              const py = centerY + radius * Math.sin(angle);
              if (i === 0) ctx.moveTo(px, py);
              else ctx.lineTo(px, py);
            }
            ctx.closePath();
            ctx.fill('evenodd');
          } else if (s === 'heart') {
            ctx.beginPath();
            ctx.moveTo(x + w * 0.5, y + h * 0.85);
            ctx.bezierCurveTo(x + w * 0.15, y + h * 0.85, x + w * 0.15, y + h * 0.50, x + w * 0.15, y + h * 0.50);
            ctx.bezierCurveTo(x + w * 0.15, y + h * 0.15, x + w * 0.35, y, x + w * 0.5, y + h * 0.15);
            ctx.bezierCurveTo(x + w * 0.65, y, x + w * 0.85, y + h * 0.15, x + w * 0.85, y + h * 0.50);
            ctx.bezierCurveTo(x + w * 0.85, y + h * 0.50, x + w * 0.85, y + h * 0.85, x + w * 0.5, y + h * 0.85);
            ctx.closePath();
            ctx.fill();
          } else if (s === 'arrow') {
            ctx.beginPath();
            ctx.moveTo(x, y + h * 0.3);
            ctx.lineTo(x + w * 0.6, y + h * 0.3);
            ctx.lineTo(x + w * 0.6, y + h * 0.1);
            ctx.lineTo(x + w, y + h * 0.5);
            ctx.lineTo(x + w * 0.6, y + h * 0.9);
            ctx.lineTo(x + w * 0.6, y + h * 0.7);
            ctx.lineTo(x, y + h * 0.7);
            ctx.closePath();
            ctx.fill();
          } else if (s === 'arrowLeft') {
            ctx.beginPath();
            ctx.moveTo(x + w, y + h * 0.3);
            ctx.lineTo(x + w * 0.4, y + h * 0.3);
            ctx.lineTo(x + w * 0.4, y + h * 0.1);
            ctx.lineTo(x, y + h * 0.5);
            ctx.lineTo(x + w * 0.4, y + h * 0.9);
            ctx.lineTo(x + w * 0.4, y + h * 0.7);
            ctx.lineTo(x + w, y + h * 0.7);
            ctx.closePath();
            ctx.fill();
          } else if (s === 'arrowUp') {
            ctx.beginPath();
            ctx.moveTo(x + w * 0.3, y + h);
            ctx.lineTo(x + w * 0.3, y + h * 0.4);
            ctx.lineTo(x + w * 0.1, y + h * 0.4);
            ctx.lineTo(x + w * 0.5, y);
            ctx.lineTo(x + w * 0.9, y + h * 0.4);
            ctx.lineTo(x + w * 0.7, y + h * 0.4);
            ctx.lineTo(x + w * 0.7, y + h);
            ctx.closePath();
            ctx.fill();
          } else if (s === 'arrowDown') {
            ctx.beginPath();
            ctx.moveTo(x + w * 0.3, y);
            ctx.lineTo(x + w * 0.3, y + h * 0.6);
            ctx.lineTo(x + w * 0.1, y + h * 0.6);
            ctx.lineTo(x + w * 0.5, y + h);
            ctx.lineTo(x + w * 0.9, y + h * 0.6);
            ctx.lineTo(x + w * 0.7, y + h * 0.6);
            ctx.lineTo(x + w * 0.7, y);
            ctx.closePath();
            ctx.fill();
          } else if (s === 'cloud') {
            ctx.beginPath();
            ctx.moveTo(x + w * 0.25, y + h * 0.5);
            ctx.bezierCurveTo(x + w * 0.1, y + h * 0.5, x, y + h * 0.35, x + w * 0.1, y + h * 0.25);
            ctx.bezierCurveTo(x + w * 0.1, y + h * 0.1, x + w * 0.25, y, x + w * 0.4, y + h * 0.1);
            ctx.bezierCurveTo(x + w * 0.5, y, x + w * 0.6, y + h * 0.1, x + w * 0.6, y + h * 0.25);
            ctx.bezierCurveTo(x + w * 0.9, y + h * 0.25, x + w, y + h * 0.4, x + w * 0.85, y + h * 0.5);
            ctx.bezierCurveTo(x + w * 0.95, y + h * 0.6, x + w * 0.9, y + h * 0.75, x + w * 0.75, y + h * 0.8);
            ctx.bezierCurveTo(x + w * 0.7, y + h * 0.95, x + w * 0.5, y + h, x + w * 0.35, y + h * 0.9);
            ctx.bezierCurveTo(x + w * 0.2, y + h * 0.95, x + w * 0.05, y + h * 0.85, x + w * 0.1, y + h * 0.7);
            ctx.bezierCurveTo(x, y + h * 0.6, x + w * 0.05, y + h * 0.5, x + w * 0.15, y + h * 0.5);
            ctx.closePath();
            ctx.fill();
          } else {
            drawRoundedRect(x, y, w, h, 8);
            ctx.fill();
          }

          // Now clip and draw the image on top (replacing the fill)
          ctx.save();
          if (s === 'rectangle') {
            ctx.beginPath();
            ctx.rect(x, y, w, h);
            ctx.closePath();
            ctx.clip();
          } else if (s === 'roundedRectangle') {
            drawRoundedRect(x, y, w, h, 16);
            ctx.clip();
          } else if (s === 'circle') {
            ctx.beginPath();
            ctx.arc(x + Math.min(w, h) / 2, y + Math.min(w, h) / 2, Math.min(w, h) / 2, 0, Math.PI * 2);
            ctx.closePath();
            ctx.clip();
          } else if (s === 'ellipse') {
            ctx.beginPath();
            ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
            ctx.closePath();
            ctx.clip();
          } else if (s === 'triangle') {
            ctx.beginPath();
            ctx.moveTo(x + w / 2, y);
            ctx.lineTo(x, y + h);
            ctx.lineTo(x + w, y + h);
            ctx.closePath();
            ctx.clip();
          } else if (s === 'rightTriangle') {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + w, y);
            ctx.lineTo(x, y + h);
            ctx.closePath();
            ctx.clip();
          } else if (s === 'diamond') {
            ctx.beginPath();
            ctx.moveTo(x + w / 2, y);
            ctx.lineTo(x + w, y + h / 2);
            ctx.lineTo(x + w / 2, y + h);
            ctx.lineTo(x, y + h / 2);
            ctx.closePath();
            ctx.clip();
          } else if (s === 'pentagon') {
            ctx.beginPath();
            ctx.moveTo(x + w * 0.5, y);
            ctx.lineTo(x + w * 0.95, y + h * 0.38);
            ctx.lineTo(x + w * 0.77, y + h);
            ctx.lineTo(x + w * 0.23, y + h);
            ctx.lineTo(x + w * 0.05, y + h * 0.38);
            ctx.closePath();
            ctx.clip();
          } else if (s === 'hexagon') {
            ctx.beginPath();
            ctx.moveTo(x + w * 0.25, y);
            ctx.lineTo(x + w * 0.75, y);
            ctx.lineTo(x + w, y + h * 0.5);
            ctx.lineTo(x + w * 0.75, y + h);
            ctx.lineTo(x + w * 0.25, y + h);
            ctx.lineTo(x, y + h * 0.5);
            ctx.closePath();
            ctx.clip();
          } else if (s === 'star') {
            ctx.beginPath();
            ctx.moveTo(x + w * 0.5, y);
            ctx.lineTo(x + w * 0.61, y + h * 0.35);
            ctx.lineTo(x + w * 0.98, y + h * 0.35);
            ctx.lineTo(x + w * 0.68, y + h * 0.57);
            ctx.lineTo(x + w * 0.79, y + h * 0.91);
            ctx.lineTo(x + w * 0.5, y + h * 0.70);
            ctx.lineTo(x + w * 0.21, y + h * 0.91);
            ctx.lineTo(x + w * 0.32, y + h * 0.57);
            ctx.lineTo(x + w * 0.02, y + h * 0.35);
            ctx.lineTo(x + w * 0.39, y + h * 0.35);
            ctx.closePath();
            ctx.clip();
          } else if (s === 'star6') {
            ctx.beginPath();
            const centerX = x + w / 2;
            const centerY = y + h / 2;
            const outerRadius = Math.min(w, h) / 2;
            const innerRadius = outerRadius * 0.5;
            for (let i = 0; i < 12; i++) {
              const angle = (i * Math.PI) / 6 - Math.PI / 2;
              const radius = i % 2 === 0 ? outerRadius : innerRadius;
              const px = centerX + radius * Math.cos(angle);
              const py = centerY + radius * Math.sin(angle);
              if (i === 0) ctx.moveTo(px, py);
              else ctx.lineTo(px, py);
            }
            ctx.closePath();
            ctx.clip();
          } else if (s === 'heart') {
            ctx.beginPath();
            ctx.moveTo(x + w * 0.5, y + h * 0.85);
            ctx.bezierCurveTo(x + w * 0.15, y + h * 0.85, x + w * 0.15, y + h * 0.50, x + w * 0.15, y + h * 0.50);
            ctx.bezierCurveTo(x + w * 0.15, y + h * 0.15, x + w * 0.35, y, x + w * 0.5, y + h * 0.15);
            ctx.bezierCurveTo(x + w * 0.65, y, x + w * 0.85, y + h * 0.15, x + w * 0.85, y + h * 0.50);
            ctx.bezierCurveTo(x + w * 0.85, y + h * 0.50, x + w * 0.85, y + h * 0.85, x + w * 0.5, y + h * 0.85);
            ctx.closePath();
            ctx.clip();
          } else if (s === 'arrow') {
            ctx.beginPath();
            ctx.moveTo(x, y + h * 0.3);
            ctx.lineTo(x + w * 0.6, y + h * 0.3);
            ctx.lineTo(x + w * 0.6, y + h * 0.1);
            ctx.lineTo(x + w, y + h * 0.5);
            ctx.lineTo(x + w * 0.6, y + h * 0.9);
            ctx.lineTo(x + w * 0.6, y + h * 0.7);
            ctx.lineTo(x, y + h * 0.7);
            ctx.closePath();
            ctx.clip();
          } else if (s === 'arrowLeft') {
            ctx.beginPath();
            ctx.moveTo(x + w, y + h * 0.3);
            ctx.lineTo(x + w * 0.4, y + h * 0.3);
            ctx.lineTo(x + w * 0.4, y + h * 0.1);
            ctx.lineTo(x, y + h * 0.5);
            ctx.lineTo(x + w * 0.4, y + h * 0.9);
            ctx.lineTo(x + w * 0.4, y + h * 0.7);
            ctx.lineTo(x + w, y + h * 0.7);
            ctx.closePath();
            ctx.clip();
          } else if (s === 'arrowUp') {
            ctx.beginPath();
            ctx.moveTo(x + w * 0.3, y + h);
            ctx.lineTo(x + w * 0.3, y + h * 0.4);
            ctx.lineTo(x + w * 0.1, y + h * 0.4);
            ctx.lineTo(x + w * 0.5, y);
            ctx.lineTo(x + w * 0.9, y + h * 0.4);
            ctx.lineTo(x + w * 0.7, y + h * 0.4);
            ctx.lineTo(x + w * 0.7, y + h);
            ctx.closePath();
            ctx.clip();
          } else if (s === 'arrowDown') {
            ctx.beginPath();
            ctx.moveTo(x + w * 0.3, y);
            ctx.lineTo(x + w * 0.3, y + h * 0.6);
            ctx.lineTo(x + w * 0.1, y + h * 0.6);
            ctx.lineTo(x + w * 0.5, y + h);
            ctx.lineTo(x + w * 0.9, y + h * 0.6);
            ctx.lineTo(x + w * 0.7, y + h * 0.6);
            ctx.lineTo(x + w * 0.7, y);
            ctx.closePath();
            ctx.clip();
          } else if (s === 'cloud') {
            ctx.beginPath();
            ctx.moveTo(x + w * 0.25, y + h * 0.5);
            ctx.bezierCurveTo(x + w * 0.1, y + h * 0.5, x, y + h * 0.35, x + w * 0.1, y + h * 0.25);
            ctx.bezierCurveTo(x + w * 0.1, y + h * 0.1, x + w * 0.25, y, x + w * 0.4, y + h * 0.1);
            ctx.bezierCurveTo(x + w * 0.5, y, x + w * 0.6, y + h * 0.1, x + w * 0.6, y + h * 0.25);
            ctx.bezierCurveTo(x + w * 0.9, y + h * 0.25, x + w, y + h * 0.4, x + w * 0.85, y + h * 0.5);
            ctx.bezierCurveTo(x + w * 0.95, y + h * 0.6, x + w * 0.9, y + h * 0.75, x + w * 0.75, y + h * 0.8);
            ctx.bezierCurveTo(x + w * 0.7, y + h * 0.95, x + w * 0.5, y + h, x + w * 0.35, y + h * 0.9);
            ctx.bezierCurveTo(x + w * 0.2, y + h * 0.95, x + w * 0.05, y + h * 0.85, x + w * 0.1, y + h * 0.7);
            ctx.bezierCurveTo(x, y + h * 0.6, x + w * 0.05, y + h * 0.5, x + w * 0.15, y + h * 0.5);
            ctx.closePath();
            ctx.clip();
          } else {
            drawRoundedRect(x, y, w, h, 8);
            ctx.clip();
          }

          // Compute object-fit cover/contain into rect x,y,w,h
          const ir = img.width / img.height;
          const r = w / h;
          let dw = w, dh = h, dx = x, dy = y;
          if (layer.fillImageFit === 'contain' ? ir > r : ir < r) {
            dh = w / ir; dy = y + (h - dh) / 2;
          } else {
            dw = h * ir; dx = x + (w - dw) / 2;
          }
          ctx.drawImage(img, dx, dy, dw, dh);
          ctx.restore(); // Restore after clipping

          // Stroke
          const sw = Number.isFinite(layer.strokeWidth) ? layer.strokeWidth : 0;
          if (sw > 0) {
            ctx.lineWidth = sw;
            ctx.strokeStyle = layer.strokeColor || '#000000';
            // Draw stroke using the same shape path
            if (s === 'rectangle') {
              ctx.beginPath();
              ctx.rect(x, y, w, h);
              ctx.closePath();
            } else if (s === 'roundedRectangle') {
              drawRoundedRect(x, y, w, h, 16);
            } else if (s === 'circle') {
              ctx.beginPath();
              ctx.arc(x + Math.min(w, h) / 2, y + Math.min(w, h) / 2, Math.min(w, h) / 2, 0, Math.PI * 2);
              ctx.closePath();
            } else if (s === 'ellipse') {
              ctx.beginPath();
              ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
              ctx.closePath();
            } else if (s === 'triangle') {
              ctx.beginPath();
              ctx.moveTo(x + w / 2, y);
              ctx.lineTo(x, y + h);
              ctx.lineTo(x + w, y + h);
              ctx.closePath();
            } else if (s === 'rightTriangle') {
              ctx.beginPath();
              ctx.moveTo(x, y);
              ctx.lineTo(x + w, y);
              ctx.lineTo(x, y + h);
              ctx.closePath();
            } else if (s === 'diamond') {
              ctx.beginPath();
              ctx.moveTo(x + w / 2, y);
              ctx.lineTo(x + w, y + h / 2);
              ctx.lineTo(x + w / 2, y + h);
              ctx.lineTo(x, y + h / 2);
              ctx.closePath();
            } else if (s === 'pentagon') {
              ctx.beginPath();
              ctx.moveTo(x + w * 0.5, y);
              ctx.lineTo(x + w * 0.95, y + h * 0.38);
              ctx.lineTo(x + w * 0.77, y + h);
              ctx.lineTo(x + w * 0.23, y + h);
              ctx.lineTo(x + w * 0.05, y + h * 0.38);
              ctx.closePath();
            } else if (s === 'hexagon') {
              ctx.beginPath();
              ctx.moveTo(x + w * 0.25, y);
              ctx.lineTo(x + w * 0.75, y);
              ctx.lineTo(x + w, y + h * 0.5);
              ctx.lineTo(x + w * 0.75, y + h);
              ctx.lineTo(x + w * 0.25, y + h);
              ctx.lineTo(x, y + h * 0.5);
              ctx.closePath();
            } else if (s === 'star') {
              ctx.beginPath();
              ctx.moveTo(x + w * 0.5, y);
              ctx.lineTo(x + w * 0.61, y + h * 0.35);
              ctx.lineTo(x + w * 0.98, y + h * 0.35);
              ctx.lineTo(x + w * 0.68, y + h * 0.57);
              ctx.lineTo(x + w * 0.79, y + h * 0.91);
              ctx.lineTo(x + w * 0.5, y + h * 0.70);
              ctx.lineTo(x + w * 0.21, y + h * 0.91);
              ctx.lineTo(x + w * 0.32, y + h * 0.57);
              ctx.lineTo(x + w * 0.02, y + h * 0.35);
              ctx.lineTo(x + w * 0.39, y + h * 0.35);
              ctx.closePath();
            } else if (s === 'star6') {
              ctx.beginPath();
              const centerX = x + w / 2;
              const centerY = y + h / 2;
              const outerRadius = Math.min(w, h) / 2;
              const innerRadius = outerRadius * 0.5;
              for (let i = 0; i < 12; i++) {
                const angle = (i * Math.PI) / 6 - Math.PI / 2;
                const radius = i % 2 === 0 ? outerRadius : innerRadius;
                const px = centerX + radius * Math.cos(angle);
                const py = centerY + radius * Math.sin(angle);
                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
              }
              ctx.closePath();
            } else if (s === 'heart') {
              ctx.beginPath();
              ctx.moveTo(x + w * 0.5, y + h * 0.85);
              ctx.bezierCurveTo(x + w * 0.15, y + h * 0.85, x + w * 0.15, y + h * 0.50, x + w * 0.15, y + h * 0.50);
              ctx.bezierCurveTo(x + w * 0.15, y + h * 0.15, x + w * 0.35, y, x + w * 0.5, y + h * 0.15);
              ctx.bezierCurveTo(x + w * 0.65, y, x + w * 0.85, y + h * 0.15, x + w * 0.85, y + h * 0.50);
              ctx.bezierCurveTo(x + w * 0.85, y + h * 0.50, x + w * 0.85, y + h * 0.85, x + w * 0.5, y + h * 0.85);
              ctx.closePath();
            } else if (s === 'arrow') {
              ctx.beginPath();
              ctx.moveTo(x, y + h * 0.3);
              ctx.lineTo(x + w * 0.6, y + h * 0.3);
              ctx.lineTo(x + w * 0.6, y + h * 0.1);
              ctx.lineTo(x + w, y + h * 0.5);
              ctx.lineTo(x + w * 0.6, y + h * 0.9);
              ctx.lineTo(x + w * 0.6, y + h * 0.7);
              ctx.lineTo(x, y + h * 0.7);
              ctx.closePath();
            } else if (s === 'arrowLeft') {
              ctx.beginPath();
              ctx.moveTo(x + w, y + h * 0.3);
              ctx.lineTo(x + w * 0.4, y + h * 0.3);
              ctx.lineTo(x + w * 0.4, y + h * 0.1);
              ctx.lineTo(x, y + h * 0.5);
              ctx.lineTo(x + w * 0.4, y + h * 0.9);
              ctx.lineTo(x + w * 0.4, y + h * 0.7);
              ctx.lineTo(x + w, y + h * 0.7);
              ctx.closePath();
            } else if (s === 'arrowUp') {
              ctx.beginPath();
              ctx.moveTo(x + w * 0.3, y + h);
              ctx.lineTo(x + w * 0.3, y + h * 0.4);
              ctx.lineTo(x + w * 0.1, y + h * 0.4);
              ctx.lineTo(x + w * 0.5, y);
              ctx.lineTo(x + w * 0.9, y + h * 0.4);
              ctx.lineTo(x + w * 0.7, y + h * 0.4);
              ctx.lineTo(x + w * 0.7, y + h);
              ctx.closePath();
            } else if (s === 'arrowDown') {
              ctx.beginPath();
              ctx.moveTo(x + w * 0.3, y);
              ctx.lineTo(x + w * 0.3, y + h * 0.6);
              ctx.lineTo(x + w * 0.1, y + h * 0.6);
              ctx.lineTo(x + w * 0.5, y + h);
              ctx.lineTo(x + w * 0.9, y + h * 0.6);
              ctx.lineTo(x + w * 0.7, y + h * 0.6);
              ctx.lineTo(x + w * 0.7, y);
              ctx.closePath();
            } else if (s === 'cloud') {
              ctx.beginPath();
              ctx.moveTo(x + w * 0.25, y + h * 0.5);
              ctx.bezierCurveTo(x + w * 0.1, y + h * 0.5, x, y + h * 0.35, x + w * 0.1, y + h * 0.25);
              ctx.bezierCurveTo(x + w * 0.1, y + h * 0.1, x + w * 0.25, y, x + w * 0.4, y + h * 0.1);
              ctx.bezierCurveTo(x + w * 0.5, y, x + w * 0.6, y + h * 0.1, x + w * 0.6, y + h * 0.25);
              ctx.bezierCurveTo(x + w * 0.9, y + h * 0.25, x + w, y + h * 0.4, x + w * 0.85, y + h * 0.5);
              ctx.bezierCurveTo(x + w * 0.95, y + h * 0.6, x + w * 0.9, y + h * 0.75, x + w * 0.75, y + h * 0.8);
              ctx.bezierCurveTo(x + w * 0.7, y + h * 0.95, x + w * 0.5, y + h, x + w * 0.35, y + h * 0.9);
              ctx.bezierCurveTo(x + w * 0.2, y + h * 0.95, x + w * 0.05, y + h * 0.85, x + w * 0.1, y + h * 0.7);
              ctx.bezierCurveTo(x, y + h * 0.6, x + w * 0.05, y + h * 0.5, x + w * 0.15, y + h * 0.5);
              ctx.closePath();
            } else {
              drawRoundedRect(x, y, w, h, 8);
            }
            ctx.stroke();
          }

          ctx.restore();
          resolve();
        };
        img.onerror = () => resolve();
        img.src = layer.fillImageSrc;
      });
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
          // Apply effects
          ctx.globalAlpha = (layer.opacity ?? 100) / 100;
          ctx.filter = getFilterCSS({
            brightness: layer.brightness ?? 100,
            contrast: layer.contrast ?? 100,
            blur: layer.blur ?? 0
          });
          if (layer.shadows?.enabled) {
            ctx.shadowColor = hexToRgba(layer.shadows.color, (layer.shadows.opacity ?? 50) / 100);
            ctx.shadowBlur = layer.shadows.blur ?? 0;
            ctx.shadowOffsetX = layer.shadows.x ?? 0;
            ctx.shadowOffsetY = layer.shadows.y ?? 0;
          } else {
            // Explicitly reset shadow properties when disabled
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
          }
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
      // Apply effects (opacity, optional blur via filter)
      ctx.globalAlpha = (layer.opacity ?? 100) / 100;
      ctx.filter = getFilterCSS({
        brightness: layer.brightness ?? 100,
        contrast: layer.contrast ?? 100,
        blur: layer.blur ?? 0
      });
      if (layer.shadows?.enabled) {
        ctx.shadowColor = hexToRgba(layer.shadows.color, (layer.shadows.opacity ?? 50) / 100);
        ctx.shadowBlur = layer.shadows.blur ?? 0;
        ctx.shadowOffsetX = layer.shadows.x ?? 0;
        ctx.shadowOffsetY = layer.shadows.y ?? 0;
      } else {
        // Explicitly reset shadow properties when disabled
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
      }
      ctx.lineWidth = layer.brushSize || 5;
      ctx.strokeStyle = layer.color || '#000000';
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
        if (layer.fillType === 'image' && layer.fillImageSrc) {
          imageDrawPromises.push(drawShapeLayerWithImage(layer));
        } else {
          drawShape(layer);
        }
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

  const drawShapeLayer = (ctx, layer, images) => {
  const {
    x,
    y,
    width: w,
    height: h,
    fillType,
    fillColor,
    fillImageSrc,
    fillImageFit,
    shadows,
    strokeWidth,
    strokeColor,
  } = layer;

  if (!ctx) return;

  // Helper to convert HEX → RGBA
  const hexToRgba = (hex, alpha = 1) => {
    if (!hex) return `rgba(0, 0, 0, ${alpha})`;
    const [r, g, b] = hex.match(/\w\w/g).map((c) => parseInt(c, 16));
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  // Helper to draw shape path
  const drawShapePath = () => {
    const s = layer.shape;
    ctx.beginPath();

    switch (s) {
      case "rectangle":
        ctx.rect(x, y, w, h);
        break;

      case "circle":
        ctx.arc(x + w / 2, y + h / 2, Math.min(w, h) / 2, 0, Math.PI * 2);
        break;

      case "ellipse":
        ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
        break;

      case "triangle":
        ctx.moveTo(x + w / 2, y);
        ctx.lineTo(x + w, y + h);
        ctx.lineTo(x, y + h);
        ctx.closePath();
        break;

      case "star":
        drawStarPath(ctx, x, y, w, h);
        break;

      case "star6":
        drawStar6Path(ctx, x, y, w, h);
        break;

      case "arrow":
        drawArrowPath(ctx, x, y, w, h);
        break;

      case "heart":
        drawHeartPath(ctx, x, y, w, h);
        break;

      default:
        ctx.rect(x, y, w, h); // fallback
        break;
    }
  };

  // 🌟 Step 1: Draw shadow first
  if (shadows?.enabled) {
    ctx.save();
    ctx.shadowColor = hexToRgba(shadows.color || "#000000", (shadows.opacity ?? 50) / 100);
    ctx.shadowBlur = shadows.blur ?? 0;
    ctx.shadowOffsetX = shadows.x ?? 0;
    ctx.shadowOffsetY = shadows.y ?? 0;

    drawShapePath();
    ctx.fillStyle = fillColor || "#cccccc";
    ctx.fill("evenodd");
    ctx.restore();
  }

  // 🌈 Step 2: Draw actual shape fill
  ctx.save();
  drawShapePath();

  if (fillType === "image" && fillImageSrc && images?.[fillImageSrc]) {
    const img = images[fillImageSrc];
    ctx.clip();

    const [iw, ih] = [img.width, img.height];
    const scale =
      fillImageFit === "cover"
        ? Math.max(w / iw, h / ih)
        : Math.min(w / iw, h / ih);
    const dx = x + (w - iw * scale) / 2;
    const dy = y + (h - ih * scale) / 2;

    ctx.drawImage(img, dx, dy, iw * scale, ih * scale);
  } else {
    ctx.fillStyle = fillColor || "#3182ce";
    ctx.fill("evenodd");
  }

  ctx.restore();

  // ✏️ Step 3: Stroke outline (if any)
  if (strokeWidth > 0) {
    ctx.save();
    ctx.lineWidth = strokeWidth;
    ctx.strokeStyle = strokeColor || "#000";
    drawShapePath();
    ctx.stroke();
    ctx.restore();
  }
};

/* ---------- Shape Helper Functions ---------- */

const drawStarPath = (ctx, x, y, w, h, points = 5) => {
  const outerRadius = Math.min(w, h) / 2;
  const innerRadius = outerRadius / 2.5;
  const cx = x + w / 2;
  const cy = y + h / 2;

  ctx.beginPath();
  for (let i = 0; i < 2 * points; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = (Math.PI * i) / points - Math.PI / 2;
    const sx = cx + radius * Math.cos(angle);
    const sy = cy + radius * Math.sin(angle);
    if (i === 0) ctx.moveTo(sx, sy);
    else ctx.lineTo(sx, sy);
  }
  ctx.closePath();
};

const drawStar6Path = (ctx, x, y, w, h) => {
  const outerRadius = Math.min(w, h) / 2;
  const innerRadius = outerRadius * 0.5;
  const cx = x + w / 2;
  const cy = y + h / 2;

  ctx.beginPath();
  for (let i = 0; i < 12; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = (i * Math.PI) / 6 - Math.PI / 2;
    const sx = cx + radius * Math.cos(angle);
    const sy = cy + radius * Math.sin(angle);
    if (i === 0) ctx.moveTo(sx, sy);
    else ctx.lineTo(sx, sy);
  }
  ctx.closePath();
};

const drawArrowPath = (ctx, x, y, w, h) => {
  ctx.beginPath();
  ctx.moveTo(x, y + h / 2);
  ctx.lineTo(x + (w * 0.7), y + h / 2);
  ctx.lineTo(x + (w * 0.7), y);
  ctx.lineTo(x + w, y + h / 2);
  ctx.lineTo(x + (w * 0.7), y + h);
  ctx.lineTo(x + (w * 0.7), y + (h * 0.5));
  ctx.lineTo(x, y + (h * 0.5));
  ctx.closePath();
};

const drawHeartPath = (ctx, x, y, w, h) => {
  const topCurveHeight = h * 0.3;
  ctx.beginPath();
  ctx.moveTo(x + w / 2, y + h);
  ctx.bezierCurveTo(
    x + w / 2,
    y + h - topCurveHeight / 2,
    x,
    y + h / 2,
    x,
    y + topCurveHeight
  );
  ctx.bezierCurveTo(x, y, x + w / 2, y, x + w / 2, y + topCurveHeight);
  ctx.bezierCurveTo(
    x + w / 2,
    y,
    x + w,
    y,
    x + w,
    y + topCurveHeight
  );
  ctx.bezierCurveTo(
    x + w,
    y + h / 2,
    x + w / 2,
    y + h - topCurveHeight / 2,
    x + w / 2,
    y + h
  );
  ctx.closePath();
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
  const handleTextContentChange = (value, shouldAutoResize = false) => {
    if (!selectedLayer) return;

    const layer = layers.find(l => l.id === selectedLayer && l.type === 'text');
    if (!layer) return;

    let updatedLayer = { ...layer, text: value };

    // Auto-resize if requested
    if (shouldAutoResize) {
      const dimensions = calculateTextDimensions(value, layer);
      updatedLayer = {
        ...updatedLayer,
        width: dimensions.width,
        height: dimensions.height
      };
    }

    const newLayers = layers.map(l =>
      l.id === selectedLayer && l.type === 'text' ? updatedLayer : l
    );
    setLayers(newLayers);
    saveToHistory(newLayers);
  };

  // AI Text Enhancement
  const handleEnhanceText = async () => {
    if (!selectedLayer) return;

    const selectedTextLayer = layers.find(l => l.id === selectedLayer && l.type === 'text');
    if (!selectedTextLayer || !selectedTextLayer.text || !selectedTextLayer.text.trim()) {
      alert('Please enter some text to enhance');
      return;
    }

    // Determine if it's a heading based on multiple factors
    const detectedIsHeading = isHeading || isHeadingLayer(selectedTextLayer);

    setIsEnhancingText(true);
    try {
      const data = await enhanceText(selectedTextLayer.text, detectedIsHeading);
      // Update text and auto-resize the box to fit the enhanced text
      handleTextContentChange(data.enhancedText, true);
    } catch (error) {
      console.error('Error enhancing text:', error);
      alert('Error enhancing text: ' + error.message);
    } finally {
      setIsEnhancingText(false);
    }
  };

  // Add styled image to canvas
  const handleAddStyledImageToCanvas = (imageUrl) => {
    const newLayer = {
      id: Date.now().toString(),
      type: 'image',
      name: 'Styled Text',
      src: imageUrl,
      x: (canvasSize.width - 200) / 2,
      y: (canvasSize.height - 100) / 2,
      width: 200,
      height: 100,
      opacity: 100,
      visible: true,
      locked: false,
      mode: 'normal',
      filters: [],
      shadows: []
    };
    
    setLayers(prevLayers => {
      const newLayers = [...prevLayers, newLayer];
      saveToHistory(newLayers);
      return newLayers;
    });
    
    // Select the newly added layer
    setSelectedLayer(newLayer.id);
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
    if (isRotating && rotateStart.layerId) {
      const { x: mouseX, y: mouseY } = getCanvasPoint(e.clientX, e.clientY);
      const dx = mouseX - rotateStart.cx;
      const dy = mouseY - rotateStart.cy;
      const angleDeg = Math.atan2(dy, dx) * (180 / Math.PI);
      let newRotation = rotateStart.startRotation + (angleDeg - rotateStart.startAngleDeg);
      if (e.shiftKey) {
        newRotation = Math.round(newRotation / 15) * 15;
      }
      // Normalize to [-180, 180)
      if (newRotation >= 180) newRotation -= 360;
      if (newRotation < -180) newRotation += 360;
      setLayers(prevLayers => prevLayers.map(layer =>
        layer.id === rotateStart.layerId
          ? { ...layer, rotation: newRotation }
          : layer
      ));
      return;
    }
if (isResizing && resizeStart.layerId) {
  const deltaX = e.clientX - resizeStart.x;
  const deltaY = e.clientY - resizeStart.y;

  setLayers(prevLayers => prevLayers.map(layer => {
    if (layer.id !== resizeStart.layerId) return layer;

    const rawWidth = Math.max(10, resizeStart.width + deltaX);
    const rawHeight = Math.max(10, resizeStart.height + deltaY);
const newWidth = Math.max(10, rawWidth);
const newHeight = Math.max(10, rawHeight);


    return { ...layer, width: newWidth, height: newHeight };
  }));
  return;
}

if (isDragging && selectedLayer) {
  const deltaX = e.clientX - dragStart.x;
  const deltaY = e.clientY - dragStart.y;

  setLayers(prevLayers => prevLayers.map(layer => {
    if (layer.id !== selectedLayer) return layer;

const nextX = layer.x + deltaX;
const nextY = layer.y + deltaY;


    return { ...layer, x: nextX, y: nextY };
  }));

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
    if (isRotating) {
      setIsRotating(false);
      setRotateStart({ cx: 0, cy: 0, startAngleDeg: 0, startRotation: 0, layerId: null });
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
    if (isDragging || isResizing || isRotating || drawingSettings.isDrawing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, isRotating, drawingSettings.isDrawing, handleMouseMove, handleMouseUp]);

  const handleResizeMouseDown = (e, layer) => {
    e.stopPropagation();
    if (selectedTool !== 'select') return;
    setIsResizing(true);
    setResizeStart({ x: e.clientX, y: e.clientY, width: layer.width, height: layer.height, layerId: layer.id });
    setSelectedLayer(layer.id);
  };

  const handleRotateMouseDown = (e, layer) => {
    e.stopPropagation();
    if (selectedTool !== 'select') return;
    const centerX = layer.x + layer.width / 2;
    const centerY = layer.y + layer.height / 2;
    const { x: mouseX, y: mouseY } = getCanvasPoint(e.clientX, e.clientY);
    const startAngleDeg = Math.atan2(mouseY - centerY, mouseX - centerX) * (180 / Math.PI);
    setIsRotating(true);
    setRotateStart({ cx: centerX, cy: centerY, startAngleDeg, startRotation: layer.rotation || 0, layerId: layer.id });
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
          rotation: 0,
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

  // Handle AI generated image - callback from AIImageGenerator component
  const handleAIGeneratedImage = (newImage) => {
    const newLayers = [...layers, newImage];
    setLayers(newLayers);
    setSelectedLayer(newImage.id);
    saveToHistory(newLayers);
    setUploadedImages(prev => [...prev, newImage]);
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

  // Generic effects handler (brightness, contrast, blur, opacity, shadows)
  const handleEffectChange = (property, value) => {
    if (!selectedLayer) return;
    const newLayers = layers.map(l =>
      l.id === selectedLayer ? { ...l, [property]: value } : l
    );
    setLayers(newLayers);
    saveToHistory(newLayers);
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
  padding: '40px',
  paddingRight: '48px',
  position: 'relative',
  overflow: 'auto',  // ✅ This enables scrollbars
  minWidth: 0,
  // ADD THESE:
  overscrollBehavior: 'contain',  // Prevent page scroll
  scrollbarWidth: 'thin',         // Thin scrollbars
  WebkitOverflowScrolling: 'touch' ,// Smooth iOS scrolling
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
      overflow: 'visible',
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
      justifyContent: 'space-between',
      transition: 'all 0.2s ease',
      userSelect: 'none'
    },
    layerItemDragging: {
      opacity: 0.5,
      transform: 'rotate(5deg)',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)'
    },
    layerItemDragOver: {
      borderTop: '3px solid #3182ce',
      backgroundColor: '#f0f4ff'
    },
    dragHandle: {
      cursor: 'grab',
      padding: '4px',
      marginRight: '8px',
      color: '#666',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    dragHandleActive: {
      cursor: 'grabbing'
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
      justifyContent: 'center',
      opacity: 1,
      transition: 'opacity 0.2s ease'
    },
    // Floating action bar (color, duplicate, delete)
    floatingBar: {
      position: 'absolute',
      top: -44,
      left: 0,
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      backgroundColor: 'rgba(255,255,255,0.95)',
      border: '1px solid #e5e7eb',
      borderRadius: 18,
      padding: '6px 10px',
      boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
      backdropFilter: 'saturate(180%) blur(6px)',
      zIndex: 20
    },
    floatingBtn: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 28,
      height: 28,
      borderRadius: 8,
      border: '1px solid #e5e7eb',
      backgroundColor: '#ffffff',
      cursor: 'pointer'
    },
    floatingColor: {
      WebkitAppearance: 'none',
      appearance: 'none',
      width: 28,
      height: 28,
      padding: 0,
      border: '1px solid #e5e7eb',
      borderRadius: 8,
      background: 'none',
      cursor: 'pointer'
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

                {/* AI Generate Image Section */}
                <AIImageGenerator
                  onImageGenerated={handleAIGeneratedImage}
                  hoveredOption={hoveredOption}
                  setHoveredOption={setHoveredOption}
                  imageSettings={imageSettings}
                />

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
  setZoom={setZoom}  // ADD THIS LINE
  handleZoomOut={handleZoomOut}
  handleZoomIn={handleZoomIn}
  handleZoomReset={handleZoomReset}
  handleFitToScreen={handleFitToScreen}
  showGrid={showGrid}
  setShowGrid={setShowGrid}
  canvasSize={canvasSize}
  selectedTool={selectedTool}
  onSave={handleSave}
  onExport={handleExport}
  onDuplicate={handleDuplicateSelected}
  hasSelection={!!selectedLayer}
/>


        {/* Canvas Area */}
        <div style={styles.canvasArea} className="custom-scrollbar" ref={canvasAreaRef}>
          <div ref={contentWrapperRef}
            style={{
position: 'relative',
    width: `${canvasSize.width}px`,
    height: `${canvasSize.height}px`,
    overflow: 'hidden',                    // ← this clips elements
    transform: `scale(${zoom / 100}) translate(${pan.x}px, ${pan.y}px)`,
    transformOrigin: 'top left',
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
  style={{
        ...styles.canvas,
        position: 'relative',
        width: `${canvasSize.width}px`,
        height: `${canvasSize.height}px`,
        overflow: 'hidden',                          // ← keep here
        transform: `scale(${zoom / 100}) translate(${pan.x}px, ${pan.y}px)`,
        transformOrigin: 'top left',               // <- key line
  }}
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
                    userSelect: 'none',
                    transform: `rotate(${layer.rotation || 0}deg)`,
                    transformOrigin: 'center center'
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
                        userSelect: 'text',
                        filter: getFilterCSS({
                          brightness: layer.brightness ?? 100,
                          contrast: layer.contrast ?? 100,
                          blur: layer.blur ?? 0
                        }),
                        textShadow: layer.shadows?.enabled
                          ? `${layer.shadows.x ?? 0}px ${layer.shadows.y ?? 0}px ${layer.shadows.blur ?? 0}px ${hexToRgba(layer.shadows.color, (layer.shadows.opacity ?? 50) / 100)}`
                          : 'none',
                        opacity: (layer.opacity ?? 100) / 100
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
                    if (layer.fillType === 'image' && layer.fillImageSrc) {
                      return (
                        <div
                          style={{
                            width: '100%',
                            height: '100%',
                            position: 'relative',
                            border: `${layer.strokeWidth}px solid ${layer.strokeColor}`,
                            borderRadius: display.borderRadius,
                            clipPath: display.clipPath,
                            overflow: 'hidden',
                            backgroundImage: `url(${layer.fillImageSrc})`,
                            backgroundSize: layer.fillImageFit === 'contain' ? 'contain' : 'cover',
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center',
                            filter: getFilterCSS({
                              brightness: layer.brightness ?? 100,
                              contrast: layer.contrast ?? 100,
                              blur: layer.blur ?? 0
                            }),
                            boxShadow: getShadowCSS(layer.shadows),
                            opacity: (layer.opacity ?? 100) / 100
                          }}
                        />
                      );
                    }
                    return (
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          backgroundColor: layer.fillColor,
                          border: `${layer.strokeWidth}px solid ${layer.strokeColor}`,
                          borderRadius: display.borderRadius,
                          clipPath: display.clipPath,
                          filter: getFilterCSS({
                            brightness: layer.brightness ?? 100,
                            contrast: layer.contrast ?? 100,
                            blur: layer.blur ?? 0
                          }),
                          boxShadow: getShadowCSS(layer.shadows),
                          opacity: (layer.opacity ?? 100) / 100
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
                      filter: getFilterCSS({
                        brightness: layer.brightness ?? 100,
                        contrast: layer.contrast ?? 100,
                        blur: layer.blur ?? 0
                      }),
                      boxShadow: getShadowCSS(layer.shadows),
                      opacity: (layer.opacity ?? 100) / 100
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
                        pointerEvents: 'none',
                        filter: getFilterCSS({
                          brightness: layer.brightness ?? 100,
                          contrast: layer.contrast ?? 100,
                          blur: layer.blur ?? 0
                        }),
                        opacity: (layer.opacity ?? 100) / 100
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
                  {/* Floating actions for selected element */}
                  {selectedLayer === layer.id && (
                    <FloatingToolbar
                      layer={layer}
                      styles={styles}
                      onColorChange={handleQuickColorChange}
                      onDuplicate={handleLayerDuplicate}
                      onDelete={handleLayerDelete}
                      onEnhance={handleEnhanceText}
                      isEnhancing={isEnhancingText}
                      getLayerPrimaryColor={getLayerPrimaryColor}
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
                  {selectedLayer === layer.id && (
                    <>
                      <div
                        style={{
                          position: 'absolute',
                          top: -40,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: 1,
                          height: 32,
                          backgroundColor: '#3182ce',
                          zIndex: 99
                        }}
                      />
                      <div
                        onMouseDown={(e) => handleRotateMouseDown(e, layer)}
                        style={{
                          position: 'absolute',
                          top: -56,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: 16,
                          height: 16,
                          borderRadius: '50%',
                          backgroundColor: '#ffffff',
                          border: '2px solid #3182ce',
                          boxShadow: '0 0 0 1px #3182ce',
                          cursor: 'grab',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          zIndex: 100
                        }}
                        title="Rotate (hold Shift to snap)"
                      >
                        <FiRotateCw size={12} color="#3182ce" />
                      </div>
                    </>
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
              layers.map((layer, index) => (
                <div
                  key={layer.id}
                  draggable
                  onDragStart={(e) => handleLayerDragStart(e, layer.id)}
                  onDragOver={(e) => handleLayerDragOver(e, index)}
                  onDragLeave={handleLayerDragLeave}
                  onDrop={(e) => handleLayerDrop(e, index)}
                  onDragEnd={handleLayerDragEnd}
                  style={{
                    ...styles.layerItem,
                    ...(draggedLayer === layer.id ? styles.layerItemDragging : {}),
                    ...(dragOverIndex === index ? styles.layerItemDragOver : {}),
                    border: selectedLayer === layer.id ? '2px solid #3182ce' : '1px solid #e1e5e9',
                    backgroundColor: selectedLayer === layer.id ? '#f0f4ff' : 'white'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        ...styles.dragHandle,
                        ...(isLayerDragging ? styles.dragHandleActive : {})
                      }}
                      title="Drag to reorder"
                    >
                      <FiMove size={16} />
                    </div>
                    <div onClick={() => handleLayerSelect(layer.id)} style={{ flex: 1, minWidth: 0 }}>
                      {renamingLayerId === layer.id ? (
                        <input
                          autoFocus
                          value={renameValue}
                          onChange={(e) => setRenameValue(e.target.value)}
                          onBlur={commitRenameLayer}
                          onKeyDown={(e) => { if (e.key === 'Enter') commitRenameLayer(); if (e.key === 'Escape') { setRenamingLayerId(null); setRenameValue(''); } }}
                          style={{ width: '100%', padding: 6, border: '1px solid #d1d5db', borderRadius: 6, fontSize: 13 }}
                        />
                      ) : (
                        <div
                          title="Double-click to rename"
                          onDoubleClick={() => startRenameLayer(layer)}
                          style={{ fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                        >
                          {layer.name}
                        </div>
                      )}
                      <div style={{ fontSize: '12px', color: '#666', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{layer.type}</div>
                    </div>
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
            {/* Effects (applies to all layer types) */}
            {(() => {
              const sel = layers.find(l => l.id === selectedLayer);
              if (!sel) return null;
              return (
                <div style={{ marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #e5e7eb' }}>
                  <h5 style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#374151' }}>Effects</h5>
                  <BrightnessControl value={sel.brightness ?? 100} onChange={(v) => handleEffectChange('brightness', v)} />
                  <ContrastControl value={sel.contrast ?? 100} onChange={(v) => handleEffectChange('contrast', v)} />
                  <BlurControl value={sel.blur ?? 0} onChange={(v) => handleEffectChange('blur', v)} />
                  <OpacityControl value={sel.opacity ?? 100} onChange={(v) => handleEffectChange('opacity', v)} />
                  <ShadowsControl value={sel.shadows} onChange={(v) => handleEffectChange('shadows', v)} />
                </div>
              );
            })()}

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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', marginLeft: 8 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#4a5568', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={isHeading}
                        onChange={(e) => setIsHeading(e.target.checked)}
                        style={{ cursor: 'pointer' }}
                      />
                      <span>Is Heading</span>
                    </label>
                    <TextEnhanceButton
                      onClick={handleEnhanceText}
                      disabled={isEnhancingText || !layers.find(l => l.id === selectedLayer)?.text?.trim()}
                      isEnhancing={isEnhancingText}
                      variant="inline"
                      size={14}
                    />
                  </div>
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
                  <span style={styles.propertyLabel}>Fill Type</span>
                  <select
                    value={shapeSettings.fillType}
                    onChange={(e) => handleShapeSettingsChange('fillType', e.target.value)}
                    style={styles.propertyInput}
                  >
                    <option value="color">Color</option>
                    <option value="image">Image</option>
                  </select>
                </div>
                {shapeSettings.fillType === 'image' && (
                  <>
                    <div style={styles.propertyRow}>
                      <span style={styles.propertyLabel}>Image Fit</span>
                      <select
                        value={shapeSettings.fillImageFit}
                        onChange={(e) => handleShapeSettingsChange('fillImageFit', e.target.value)}
                        style={styles.propertyInput}
                      >
                        <option value="cover">Cover</option>
                        <option value="contain">Contain</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          style={styles.smallButton}
                          onClick={() => fileInputRef.current?.click()}
                          title="Upload image to use as fill"
                        >
                          Upload image
                        </button>
                        {shapeSettings.fillImageSrc && (
                          <img src={shapeSettings.fillImageSrc} alt="fill" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4, border: '1px solid #e5e7eb' }} />
                        )}
                      </div>
                      {uploadedImages.length > 0 && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, maxHeight: 120, overflowY: 'auto' }}>
                          {uploadedImages.map(ui => (
                            <button key={ui.id} onClick={() => handleShapeSettingsChange('fillImageSrc', ui.src)} title={ui.name} style={{ padding: 0, border: shapeSettings.fillImageSrc === ui.src ? '2px solid #3182ce' : '1px solid #e5e7eb', borderRadius: 4, overflow: 'hidden', background: '#fff' }}>
                              <img src={ui.src} alt={ui.name} style={{ width: '100%', height: 40, objectFit: 'cover', display: 'block' }} />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}
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
      
      {showStyleModal && (
        <TextStyleModal 
          text={layers.find(l => l.id === selectedLayer && l.type === 'text')?.text || ''}
          onClose={() => setShowStyleModal(false)}
          onAddToCanvas={handleAddStyledImageToCanvas}
        />
      )}
    </div>
  );
};

export default CanvaEditor;