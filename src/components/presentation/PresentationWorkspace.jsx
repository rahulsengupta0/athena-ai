  const handleInsertLibraryImage = (image) => {
    if (!layout || !image?.src) return;
    const imageLayer = createImageLayer(image, undefined, layout);
    handleImageUpload(imageLayer);
  };

  const handleApplyLibraryImageToShape = (image) => {
    if (!image?.src || !selectedLayer || selectedLayer.type !== 'shape') return;
    handleLayerChange({
      fillType: 'image',
      fillImageSrc: image.src,
    });
  };

import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Stage, Layer, Group, Text, Rect, Circle, Line, Ellipse, Image as KonvaImage } from 'react-konva';
import {
  ChevronLeft,
  Copy,
  Layers,
  Plus,
  Maximize,
  Trash2,
  Image,
  PanelLeft,
  PanelRight,
  ChevronRight,
  X,
} from 'lucide-react';
import SelectionTool from './tools/SelectionTool';
import TextTools from './tools/TextTools';
import ShapeTools from './tools/ShapeTools';
import DrawingTools from './tools/DrawingTools';
import LayerManager from './layers/LayerManager';
import PreviewModal from './modals/PreviewModal';
import ShareModal from './modals/ShareModal';
import ZoomControls from './controls/ZoomControls';
import UndoRedoControls from './controls/UndoRedoControls';
import ImageUpload from './controls/ImageUpload';
import LayerEffectsPanel from './effects/LayerEffectsPanel';
import TextEnhanceControls from './ai/TextEnhanceControls';
import ImageGenerateControls from './ai/ImageGenerateControls';
import ShapeImageFillControls from './effects/ShapeImageFillControls';
import ImageLibrary from './controls/ImageLibrary';

import { getShapePoints } from './utils/shapeUtils';
import { useHistory } from './utils/useHistory';
import { applyLayerEffectsToNode } from './utils/effectUtils';
import { normalizeImageEffects } from './utils/effectDefaults';
import { createImageLayer } from './utils/imageUtils';
import { getAutoSizedTextFrame } from './utils/textLayout';

const useLayerEffects = (nodeRef, effects, scaleFactor = 1, dependencies = []) => {
  useEffect(() => {
    const node = nodeRef?.current;
    if (!node) return;
    applyLayerEffectsToNode(node, effects, scaleFactor);
  }, [nodeRef, effects, scaleFactor, ...dependencies]);
};

const useLayerBlur = (layerRef, blurValue = 0, scaleFactor = 1) => {
  useEffect(() => {
    const layerNode = layerRef?.current;
    if (!layerNode) return;
    const canvasElement = layerNode.getCanvas()?._canvas;
    if (!canvasElement) return;
    const blurPx = Math.max(0, (blurValue || 0) * scaleFactor);
    canvasElement.style.filter = blurPx > 0 ? `blur(${blurPx}px)` : 'none';
    return () => {
      canvasElement.style.filter = 'none';
    };
  }, [layerRef, blurValue, scaleFactor]);
};

const ElementLayer = ({ effects, scale, children }) => {
  const layerRef = useRef(null);
  const blurValue = effects?.blur || 0;
  useLayerBlur(layerRef, blurValue, scale);
  return (
    <Layer ref={layerRef}>
      {children}
    </Layer>
  );
};

const useShapeImageFill = (shapeRef, fillType, imageSrc, fallbackFill, dims, fit = 'cover') => {
  useEffect(() => {
    const shape = shapeRef?.current;
    if (!shape) return;

    const resetFill = () => {
      shape.fillPatternImage(null);
      shape.fill(fallbackFill);
      shape.getLayer()?.batchDraw();
    };

    if (fillType !== 'image' || !imageSrc) {
      resetFill();
      return;
    }

    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const scaleX = dims.width / img.width;
      const scaleY = dims.height / img.height;
      const scale = fit === 'contain' ? Math.min(scaleX, scaleY) : Math.max(scaleX, scaleY);
      const drawWidth = img.width * scale;
      const drawHeight = img.height * scale;
      const offsetX = (dims.width - drawWidth) / 2;
      const offsetY = (dims.height - drawHeight) / 2;

      shape.fillPatternImage(img);
      shape.fillPatternScale({ x: scale, y: scale });
      shape.fillPatternRepeat('no-repeat');
      shape.fillPatternOffset({ x: -offsetX, y: -offsetY });
      shape.fill('#ffffff');
      shape.getLayer()?.batchDraw();
    };
    img.onerror = resetFill;
    img.src = imageSrc;

    return () => {
      resetFill();
    };
  }, [shapeRef, fillType, imageSrc, fallbackFill, dims.width, dims.height, fit]);
};

// Image component for rendering images on canvas
const ImageLayer = ({ layer, scaledX, scaledY, scaledWidth, scaledHeight, isSelected, scale, onDragEnd, onClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageRef = useRef(null);

  useEffect(() => {
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setImageLoaded(true);
      if (imageRef.current) {
        imageRef.current.image(img);
      }
    };
    img.onerror = () => {
      setImageLoaded(false);
    };
    img.src = layer.src;
  }, [layer.src]);

  useLayerEffects(imageRef, layer.effects, scale, [imageLoaded]);

  return (
    <Group
      x={scaledX}
      y={scaledY}
      draggable
      onDragEnd={onDragEnd}
      onClick={onClick}
      onTap={onClick}
    >
      {/* Selection border */}
      {isSelected && (
        <Rect
          x={-2}
          y={-2}
          width={scaledWidth + 4}
          height={scaledHeight + 4}
          stroke="rgba(79, 70, 229, 0.9)"
          strokeWidth={2}
          fill="transparent"
        />
      )}
      <KonvaImage
        ref={imageRef}
        x={0}
        y={0}
        width={scaledWidth}
        height={scaledHeight}
        image={null}
        opacity={imageLoaded ? 1 : 0}
        draggable={false}
        listening={true}
      />
      {!imageLoaded && (
        <Rect
          x={0}
          y={0}
          width={scaledWidth}
          height={scaledHeight}
          fill="#f1f5f9"
          stroke="#cbd5e1"
          strokeWidth={1}
          draggable={false}
        />
      )}
    </Group>
  );
};

const TextLayer = ({
  layer,
  scaledX,
  scaledY,
  scaledWidth,
  scaledHeight,
  isSelected,
  scale,
  onDragEnd,
  onClick,
}) => {
  const textRef = useRef(null);
  useLayerEffects(textRef, layer.effects, scale);

  return (
    <Group
      x={scaledX}
      y={scaledY}
      draggable
      onDragEnd={onDragEnd}
      onClick={onClick}
      onTap={onClick}
    >
      {isSelected && (
        <Rect
          x={-2}
          y={-2}
          width={scaledWidth + 4}
          height={scaledHeight + 4}
          stroke="rgba(79, 70, 229, 0.9)"
          strokeWidth={2}
          fill="transparent"
          cornerRadius={12}
        />
      )}
      <Text
        ref={textRef}
        x={0}
        y={0}
        width={scaledWidth}
        height={scaledHeight}
        text={layer.text}
        fontSize={layer.fontSize * scale}
        fontFamily={layer.fontFamily}
        fontStyle={layer.fontStyle || 'normal'}
        fontWeight={layer.fontWeight || 'normal'}
        fill={layer.color}
        align={layer.textAlign}
        verticalAlign="middle"
        padding={12 * scale}
        wrap="word"
      />
    </Group>
  );
};

const ShapeLayer = ({
  layer,
  scaledX,
  scaledY,
  scaledWidth,
  scaledHeight,
  isSelected,
  scale,
  onDragEnd,
  onClick,
}) => {
  const shapeRef = useRef(null);
  useLayerEffects(shapeRef, layer.effects, scale);
  useShapeImageFill(
    shapeRef,
    layer.fillType || 'color',
    layer.fillImageSrc,
    layer.fillColor,
    { width: scaledWidth, height: scaledHeight },
    layer.fillImageFit || 'cover',
  );

  const renderShape = () => {
    if (layer.shape === 'circle') {
      const radius = Math.min(scaledWidth, scaledHeight) / 2;
      return (
        <>
          {isSelected && (
            <Circle
              x={radius}
              y={radius}
              radius={radius + 2}
              stroke="rgba(79, 70, 229, 0.9)"
              strokeWidth={2}
              fill="transparent"
            />
          )}
          <Circle ref={shapeRef} x={radius} y={radius} radius={radius} fill={layer.fillColor} />
        </>
      );
    }

    if (layer.shape === 'ellipse') {
      return (
        <>
          {isSelected && (
            <Ellipse
              x={scaledWidth / 2}
              y={scaledHeight / 2}
              radiusX={scaledWidth / 2 + 2}
              radiusY={scaledHeight / 2 + 2}
              stroke="rgba(79, 70, 229, 0.9)"
              strokeWidth={2}
              fill="transparent"
            />
          )}
          <Ellipse
            ref={shapeRef}
            x={scaledWidth / 2}
            y={scaledHeight / 2}
            radiusX={scaledWidth / 2}
            radiusY={scaledHeight / 2}
            fill={layer.fillColor}
          />
        </>
      );
    }

    if (layer.shape === 'rectangle') {
      return (
        <>
          {isSelected && (
            <Rect
              x={-2}
              y={-2}
              width={scaledWidth + 4}
              height={scaledHeight + 4}
              stroke="rgba(79, 70, 229, 0.9)"
              strokeWidth={2}
              fill="transparent"
              cornerRadius={layer.borderRadius * scale + 2}
            />
          )}
          <Rect
            ref={shapeRef}
            x={0}
            y={0}
            width={scaledWidth}
            height={scaledHeight}
            fill={layer.fillColor}
            cornerRadius={layer.borderRadius * scale}
          />
        </>
      );
    }

    const points = getShapePoints(layer.shape, scaledWidth, scaledHeight);
    if (points.length === 0) return null;

    return (
      <>
        {isSelected && (
          <Line
            points={points.map((p) => p - 2)}
            closed
            stroke="rgba(79, 70, 229, 0.9)"
            strokeWidth={2}
            fill="transparent"
          />
        )}
        <Line ref={shapeRef} points={points} closed fill={layer.fillColor} stroke={layer.fillColor} />
      </>
    );
  };

  const circleOffset = Math.min(scaledWidth, scaledHeight) / 2;
  const isCircle = layer.shape === 'circle';
  const groupX = isCircle ? scaledX + circleOffset : scaledX;
  const groupY = isCircle ? scaledY + circleOffset : scaledY;

  return (
    <Group
      x={groupX}
      y={groupY}
      draggable
      onDragEnd={onDragEnd}
      onClick={onClick}
      onTap={onClick}
    >
      {renderShape()}
    </Group>
  );
};

const createLayer = (definition, coordinates) => {
  const preset = definition.preset;
  const base = {
    id: `layer-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    x: coordinates.x,
    y: coordinates.y,
    rotation: 0,
    visible: true,
    effects: normalizeImageEffects(),
  };

  if (preset.type === 'text') {
    return {
      ...base,
      type: 'text',
      name: definition.label || 'Text',
      text: preset.text,
      fontSize: preset.fontSize,
      fontWeight: preset.fontWeight,
      fontFamily: 'Poppins, sans-serif',
      color: '#0f172a',
      width: preset.width,
      height: preset.height,
      textAlign: 'left',
    };
  }

  if (preset.type === 'shape') {
    const shapeNames = {
      'rectangle': 'Rectangle',
      'circle': 'Circle',
      'ellipse': 'Ellipse',
      'triangle': 'Triangle',
      'right-triangle': 'Right Triangle',
      'star': 'Star',
      'heart': 'Heart',
      'diamond': 'Diamond',
      'pentagon': 'Pentagon',
      'hexagon': 'Hexagon',
      'arrow-right': 'Arrow Right',
      'arrow-left': 'Arrow Left',
      'arrow-up': 'Arrow Up',
      'arrow-down': 'Arrow Down',
    };
    
    return {
      ...base,
      type: 'shape',
      name: definition.label || shapeNames[preset.shape] || 'Shape',
      shape: preset.shape,
      width: preset.width,
      height: preset.height,
      fillColor: preset.fillColor,
      borderRadius: preset.shape === 'circle' ? preset.width / 2 : preset.borderRadius || 16,
      fillType: 'color',
      fillImageSrc: null,
      fillImageFit: 'cover',
    };
  }

  return base;
};

const PresentationWorkspace = ({ layout, onBack }) => {
  // Constants for canvas sizing
  const maxCanvasWidth = 980;
  const maxCanvasHeight = 620;
  
  // Calculate initial zoom to fit canvas in viewport
  const initialZoom = useMemo(() => {
    const { width, height } = layout;
    return Math.min(maxCanvasWidth / width, maxCanvasHeight / height);
  }, [layout]);

  const [slides, setSlides] = useState(() => [
    {
      id: 'slide-1',
      name: 'Slide 1',
      background: '#ffffff',
      layers: [],
    },
  ]);
  const [activeSlideId, setActiveSlideId] = useState('slide-1');
  const [selectedTool, setSelectedTool] = useState('select');
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [selectedLayerId, setSelectedLayerId] = useState(null);
  const [leftSidebarVisible, setLeftSidebarVisible] = useState(true);
  const [rightSidebarVisible, setRightSidebarVisible] = useState(true);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [zoom, setZoom] = useState(initialZoom);
  const [isPanning, setIsPanning] = useState(false);
  const [imageLibrary, setImageLibrary] = useState([]);
  const stageRef = useRef(null);
  const canvasContainerRef = useRef(null);
  const zoomTargetRef = useRef({ scrollLeft: null, scrollTop: null });
  const panStartRef = useRef({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0 });
  const hasPannedRef = useRef(false);
  const lastGeneratedImageRef = useRef(null);
  
  const IMAGE_LIBRARY_STORAGE_KEY = 'presentation-image-library';

  // History management hook
  const { historyIndex, historyLength, saveToHistory, handleUndo, handleRedo } = useHistory(slides);
  
  // Update zoom when layout changes
  useEffect(() => {
    setZoom(initialZoom);
  }, [initialZoom]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const saved = window.localStorage.getItem(IMAGE_LIBRARY_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setImageLibrary(parsed);
        }
      }
    } catch (error) {
      console.error('Failed to load image library', error);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(IMAGE_LIBRARY_STORAGE_KEY, JSON.stringify(imageLibrary));
    } catch (error) {
      console.error('Failed to persist image library', error);
    }
  }, [imageLibrary]);

  // Adjust scroll position when zoom changes to keep mouse position fixed
  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container || zoomTargetRef.current.scrollLeft === null) return;

    // Use requestAnimationFrame to ensure DOM has updated with new zoom
    requestAnimationFrame(() => {
      if (container && zoomTargetRef.current.scrollLeft !== null) {
        const { scrollLeft, scrollTop } = zoomTargetRef.current;
        
        // Clamp scroll positions to valid range (0 to max scroll)
        const maxScrollLeft = Math.max(0, container.scrollWidth - container.clientWidth);
        const maxScrollTop = Math.max(0, container.scrollHeight - container.clientHeight);
        
        container.scrollLeft = Math.max(0, Math.min(maxScrollLeft, scrollLeft));
        container.scrollTop = Math.max(0, Math.min(maxScrollTop, scrollTop));
        
        // Reset the target
        zoomTargetRef.current = { scrollLeft: null, scrollTop: null };
      }
    });
  }, [zoom]);

  // Attach wheel event listener to stage for zooming with mouse position tracking
  useEffect(() => {
    const stage = stageRef.current;
    const container = canvasContainerRef.current;
    if (!stage || !container) return;

    const handleWheel = (e) => {
      e.evt.preventDefault();
      e.evt.stopPropagation();
      
      // Get mouse position relative to the container
      const containerRect = container.getBoundingClientRect();
      const mouseX = e.evt.clientX - containerRect.left;
      const mouseY = e.evt.clientY - containerRect.top;
      
      // Get current scroll position
      const scrollLeft = container.scrollLeft;
      const scrollTop = container.scrollTop;
      
      // Padding of the container
      const padding = 20;
      
      // Calculate the canvas point under the mouse (in scaled coordinates)
      // Mouse position relative to canvas content = mouse position - padding + scroll
      const canvasX = mouseX - padding + scrollLeft;
      const canvasY = mouseY - padding + scrollTop;
      
      // Calculate zoom delta based on scroll direction
      const deltaY = e.evt.deltaY || 0;
      const zoomSpeed = 0.1;
      
      // Use functional update to get latest zoom value and calculate new scroll
      setZoom((currentZoom) => {
        const delta = deltaY > 0 ? 1 - zoomSpeed : 1 + zoomSpeed;
        const newZoom = Math.max(0.1, Math.min(3, currentZoom * delta));
        
        // Calculate the canvas point in actual canvas coordinates (not scaled)
        // canvasX and canvasY are in scaled coordinates, so divide by current zoom
        const canvasPointX = canvasX / currentZoom;
        const canvasPointY = canvasY / currentZoom;
        
        // Calculate new scroll position to keep the same canvas point under the mouse
        // After zoom, the canvas point will be at: canvasPoint * newZoom (in scaled coordinates)
        // To keep it under the mouse: newScroll = (canvasPoint * newZoom) - (mouse - padding)
        const newScrollLeft = canvasPointX * newZoom - (mouseX - padding);
        const newScrollTop = canvasPointY * newZoom - (mouseY - padding);
        
        // Store the target scroll position to be applied after DOM updates
        zoomTargetRef.current = {
          scrollLeft: newScrollLeft,
          scrollTop: newScrollTop,
        };
        
        return newZoom;
      });
    };

    stage.on('wheel', handleWheel);

    return () => {
      stage.off('wheel', handleWheel);
    };
  }, [stageRef, layout]);

  const activeSlide = useMemo(
    () => slides.find((slide) => slide.id === activeSlideId) || slides[0],
    [slides, activeSlideId],
  );

  useEffect(() => {
    if (!activeSlide && slides.length > 0) {
      setActiveSlideId(slides[0].id);
    }
  }, [activeSlide, slides]);

  // Undo/Redo handlers
  const onUndo = () => {
    handleUndo(slides, setSlides, activeSlideId, setActiveSlideId, setSelectedLayerId);
  };

  const onRedo = () => {
    handleRedo(slides, setSlides, activeSlideId, setActiveSlideId, setSelectedLayerId);
  };

  // Base scale to fit canvas in default viewport (for reference)
  const baseScale = useMemo(() => {
    const { width, height } = layout;
    return Math.min(maxCanvasWidth / width, maxCanvasHeight / height);
  }, [layout, maxCanvasHeight, maxCanvasWidth]);

  // Final scale with zoom applied
  // zoom=1 means 100% (actual canvas size), zoom<1 means zoomed out, zoom>1 means zoomed in
  const scale = useMemo(() => {
    return zoom;
  }, [zoom]);

  const canvasRenderWidth = Math.round(layout.width * scale);
  const canvasRenderHeight = Math.round(layout.height * scale);

  // Calculate fit to screen scale based on available viewport
  const calculateFitToScreenScale = () => {
    if (!canvasContainerRef.current) return initialZoom;
    const container = canvasContainerRef.current;
    const availableWidth = container.clientWidth - 40; // Account for padding
    const availableHeight = container.clientHeight - 40;
    
    if (availableWidth <= 0 || availableHeight <= 0) return initialZoom;
    
    const { width, height } = layout;
    const scaleX = availableWidth / width;
    const scaleY = availableHeight / height;
    // Calculate the scale needed to fit the canvas in the viewport
    const fitScale = Math.min(scaleX, scaleY);
    
    // Don't zoom in beyond 100% (actual size)
    return Math.min(fitScale, 1);
  };

  const handleZoomChange = (newZoom) => {
    setZoom(newZoom);
  };

  const handleFitToScreen = () => {
    const fitZoom = calculateFitToScreenScale();
    setZoom(Math.max(0.1, Math.min(fitZoom, 3))); // Clamp between 10% and 300%
  };

  const handleZoomTo100 = () => {
    setZoom(1); // 100% means actual canvas size
  };

  // Handle mouse wheel zoom on canvas container - only when Ctrl/Cmd is pressed
  const handleWheel = (e) => {
    // Only zoom when Ctrl/Cmd is pressed to avoid interfering with scrolling
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      e.stopPropagation();
      
      // Calculate zoom delta based on scroll direction
      const zoomSpeed = 0.1;
      const delta = e.deltaY > 0 ? 1 - zoomSpeed : 1 + zoomSpeed; // Zoom out on scroll down, zoom in on scroll up
      const newZoom = Math.max(0.1, Math.min(3, zoom * delta));
      setZoom(newZoom);
    }
  };

  // Get the index of the currently active slide for preview
  const startSlideIndex = useMemo(() => {
    return slides.findIndex((slide) => slide.id === activeSlideId);
  }, [slides, activeSlideId]);

  const updateActiveSlide = (updater) => {
    setSlides((prevSlides) =>
      prevSlides.map((slide) => {
        if (slide.id !== activeSlideId) return slide;
        return updater(slide);
      }),
    );
  };

  // Handle canvas panning (dragging to move canvas)
  const handlePanStart = (e) => {
    const container = canvasContainerRef.current;
    if (!container) return;

    // Don't allow panning when an element is selected
    if (selectedLayerId) {
      return;
    }

    // Only start panning on left mouse button
    const button = e.button !== undefined ? e.button : (e.evt && e.evt.button !== undefined ? e.evt.button : 0);
    if (button !== 0) return;
    
    // Determine if this is a Konva event or regular DOM event
    const isKonvaEvent = !!e.evt;
    let shouldStartPanning = false;
    
    if (isKonvaEvent) {
      // For Konva Stage events
      const stage = e.target.getStage();
      if (!stage) return;
      
      const targetName = e.target.name();
      const isBackground = e.target === stage || targetName === 'background';
      
      // Simple check: if it's not the stage or background, it's probably an element
      const nodeType = e.target.getType && e.target.getType();
      const isElement = nodeType && 
                       ['Text', 'Rect', 'Circle', 'Line', 'Ellipse', 'Group'].includes(nodeType) &&
                       e.target !== stage && 
                       targetName !== 'background';
      
      // Always allow panning when clicking on background (if no element is selected)
      // Also allow when selection tool is active, no preset, no selected element, and not clicking on an element
      if (isBackground) {
        shouldStartPanning = true;
      } else if (selectedTool === 'select' && !selectedPreset && !selectedLayerId && !isElement) {
        shouldStartPanning = true;
      } else {
        shouldStartPanning = false;
      }
    } else {
      // For container div events
      const isContainerClick = e.target === e.currentTarget || 
                                e.target === container || 
                                (e.target.closest && e.target.closest('[data-canvas-container]') === container);
      shouldStartPanning = isContainerClick && selectedTool === 'select' && !selectedPreset && !selectedLayerId;
    }

    // Don't start panning if conditions aren't met
    if (!shouldStartPanning) {
      return;
    }

    // Prevent default to avoid text selection and other behaviors
    e.preventDefault();
    e.stopPropagation();
    if (e.evt) {
      e.evt.preventDefault();
      e.evt.stopPropagation();
    }

    setIsPanning(true);
    hasPannedRef.current = false;

    // Store initial mouse position and scroll position
    const clientX = e.clientX || (e.evt && e.evt.clientX) || 0;
    const clientY = e.clientY || (e.evt && e.evt.clientY) || 0;
    const containerRect = container.getBoundingClientRect();
    
    panStartRef.current = {
      x: clientX - containerRect.left,
      y: clientY - containerRect.top,
      scrollLeft: container.scrollLeft,
      scrollTop: container.scrollTop,
    };

    // Change cursor to grabbing
    container.style.cursor = 'grabbing';
    if (stageRef.current) {
      const stage = stageRef.current.getStage();
      if (stage && stage.container()) {
        stage.container().style.cursor = 'grabbing';
      }
    }
  };

  const handlePanMove = (e) => {
    const container = canvasContainerRef.current;
    if (!container || !isPanning) return;

    // Get client coordinates from either regular event or Konva event
    const clientX = e.clientX || (e.evt && e.evt.clientX) || 0;
    const clientY = e.clientY || (e.evt && e.evt.clientY) || 0;

    // Calculate mouse movement
    const containerRect = container.getBoundingClientRect();
    const currentX = clientX - containerRect.left;
    const currentY = clientY - containerRect.top;
    
    const deltaX = currentX - panStartRef.current.x;
    const deltaY = currentY - panStartRef.current.y;

    // Mark as panned if mouse has moved
    if (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2) {
      hasPannedRef.current = true;
    }

    // Update scroll position (inverse because we're dragging the canvas)
    const newScrollLeft = panStartRef.current.scrollLeft - deltaX;
    const newScrollTop = panStartRef.current.scrollTop - deltaY;

    // Clamp scroll positions
    const maxScrollLeft = Math.max(0, container.scrollWidth - container.clientWidth);
    const maxScrollTop = Math.max(0, container.scrollHeight - container.clientHeight);

    container.scrollLeft = Math.max(0, Math.min(maxScrollLeft, newScrollLeft));
    container.scrollTop = Math.max(0, Math.min(maxScrollTop, newScrollTop));
  };

  const handlePanEnd = () => {
    const container = canvasContainerRef.current;
    setIsPanning(false);
    
    if (container) {
      container.style.cursor = '';
    }
    if (stageRef.current) {
      const stage = stageRef.current.getStage();
      if (stage && stage.container()) {
        stage.container().style.cursor = '';
      }
    }
    panStartRef.current = { x: 0, y: 0, scrollLeft: 0, scrollTop: 0 };
  };

  // Add global mouse listeners for panning when dragging
  useEffect(() => {
    if (!isPanning) return;

    const handleGlobalMouseMove = (e) => {
      handlePanMove(e);
    };

    const handleGlobalMouseUp = () => {
      handlePanEnd();
    };

    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('mouseup', handleGlobalMouseUp);
    document.addEventListener('mouseleave', handleGlobalMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('mouseleave', handleGlobalMouseUp);
    };
  }, [isPanning]);

  const handleStageClick = (e) => {
    const stage = e.target.getStage();
    if (!stage) return;
    
    // Don't handle clicks when panning or if we just panned
    if (isPanning || hasPannedRef.current) {
      // Reset the flag after a short delay
      setTimeout(() => {
        hasPannedRef.current = false;
      }, 100);
      return;
    }
    
    // If selection tool is active, don't create new layers
    if (selectedTool === 'select') {
      // If clicking on empty space, deselect
      if (e.target === stage || e.target.name() === 'background') {
        setSelectedLayerId(null);
      }
      return;
    }

    // If drawing tool is active, handle drawing (to be implemented)
    if (selectedTool && ['brush', 'pen', 'eraser'].includes(selectedTool)) {
      // Drawing functionality to be implemented
      return;
    }

    // If no preset is selected, don't create anything
    if (!selectedPreset || !activeSlide) {
      return;
    }
    
    // Check if we clicked on a shape/text, if so, don't create a new layer
    // Allow clicks on background or stage itself
    if (e.target !== stage && e.target.name() !== 'background') {
      return;
    }

    const pointerPos = stage.getPointerPosition();
    if (!pointerPos) return;

    // Convert from stage coordinates to canvas coordinates (accounting for scale)
    // scale already includes zoom, so we divide by it
    const clickX = pointerPos.x / scale;
    const clickY = pointerPos.y / scale;

    const offsetX = selectedPreset.preset.width ? selectedPreset.preset.width / 2 : 0;
    const offsetY = selectedPreset.preset.height ? selectedPreset.preset.height / 2 : 0;

    const layer = createLayer(selectedPreset, {
      x: Math.max(0, clickX - offsetX),
      y: Math.max(0, clickY - offsetY),
    });

    updateActiveSlide((slide) => {
      const updatedSlide = {
      ...slide,
      layers: [...slide.layers, layer],
      };
      const updatedSlides = slides.map((s) => (s.id === activeSlideId ? updatedSlide : s));
      saveToHistory(updatedSlides);
      return updatedSlide;
    });
    setSelectedLayerId(layer.id);
    // Switch back to select tool after creating
    setSelectedTool('select');
    setSelectedPreset(null);
  };

  const handlePresetSelect = (preset) => {
    setSelectedPreset(preset);
    setSelectedTool(null); // Clear tool selection when preset is selected
  };

  const handleToolSelect = (toolId) => {
    setSelectedTool(toolId);
    setSelectedPreset(null); // Clear preset selection when tool is selected
  };

  const registerImageInLibrary = (imageData, meta = {}) => {
    if (!imageData?.src) return null;
    const entry = {
      id: meta.id || `library-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
      src: imageData.src,
      width: imageData.width || layout.width * 0.35,
      height: imageData.height || layout.height * 0.35,
      name: meta.label || 'Image',
      origin: meta.origin || 'upload',
      prompt: meta.prompt || null,
      addedAt: Date.now(),
    };
    setImageLibrary((prev) => {
      const withoutDup = prev.filter((img) => img.src !== entry.src);
      return [entry, ...withoutDup].slice(0, 60);
    });
    return entry;
  };

  const handleImageUpload = (imageLayer) => {
    updateActiveSlide((slide) => {
      const updatedSlide = {
        ...slide,
        layers: [...slide.layers, imageLayer],
      };
      const updatedSlides = slides.map((s) => (s.id === activeSlideId ? updatedSlide : s));
      saveToHistory(updatedSlides);
      return updatedSlide;
    });
    setSelectedLayerId(imageLayer.id);
    setSelectedTool('select');
  registerImageInLibrary(imageLayer, { label: imageLayer.name || 'Image', origin: 'upload' });
  };

const handleAddGeneratedImage = (imageData, meta = {}) => {
  if (!layout) return;
  const entry = registerImageInLibrary(imageData, {
    origin: meta.origin || 'ai',
    label: meta.label || 'AI Image',
    prompt: meta.prompt,
  });
  if (entry) {
    lastGeneratedImageRef.current = entry;
  } else {
    lastGeneratedImageRef.current = imageData;
  }
  if (selectedLayer && selectedLayer.type === 'shape') {
    handleLayerChange({
      fillType: 'image',
      fillImageSrc: imageData.src,
    });
    return;
  }
  const imageLayer = createImageLayer(imageData, undefined, layout);
  handleImageUpload(imageLayer);
};

const handleApplyEnhancedText = (enhancedText) => {
  if (!selectedLayer || selectedLayer.type !== 'text') return;
  const framePatch = getAutoSizedTextFrame(selectedLayer, enhancedText, layout) || {};
  handleLayerChange({
    text: enhancedText,
    ...framePatch,
  });
};

  const handleLayerDragEnd = (layer, e) => {
    // Get the Group node (parent) if dragging a child element
    let node = e.target;
    if (node.getType && node.getType() !== 'Group') {
      node = node.getParent();
    }
    if (!node) return;
    
    // scale already includes zoom, so we divide by it to get canvas coordinates
    let newX = node.x() / scale;
    let newY = node.y() / scale;
    
    // For circles, the Group position is centered, so we need to adjust
    if (layer.type === 'shape' && layer.shape === 'circle') {
      const radius = Math.min(layer.width, layer.height) / 2;
      newX = newX - radius;
      newY = newY - radius;
    }
    
    // Clamp to canvas bounds
    newX = Math.max(0, Math.min(layout.width - layer.width, newX));
    newY = Math.max(0, Math.min(layout.height - layer.height, newY));

    updateActiveSlide((slide) => {
      const updatedSlide = {
        ...slide,
        layers: slide.layers.map((l) =>
          l.id === layer.id
            ? {
                ...l,
                x: newX,
                y: newY,
              }
            : l,
        ),
      };
      const updatedSlides = slides.map((s) => (s.id === activeSlideId ? updatedSlide : s));
      saveToHistory(updatedSlides);
      return updatedSlide;
    });
    
    // Reset node position to keep it in sync with the new coordinates
    // scale already includes zoom
    node.position({ x: newX * scale, y: newY * scale });
    };

  const handleLayerClick = (layer, e) => {
    e.cancelBubble = true;
    setSelectedLayerId(layer.id);
  };

  const selectedLayer = useMemo(() => {
    if (!activeSlide) return null;
    return activeSlide.layers.find((layer) => layer.id === selectedLayerId) || null;
  }, [activeSlide, selectedLayerId]);

  const handleLayerChange = (patch) => {
    if (!selectedLayer) return;
    updateActiveSlide((slide) => {
      const updatedSlide = {
      ...slide,
      layers: slide.layers.map((layer) =>
        layer.id === selectedLayer.id
          ? {
              ...layer,
              ...patch,
            }
          : layer,
      ),
      };
      const updatedSlides = slides.map((s) => (s.id === activeSlideId ? updatedSlide : s));
      saveToHistory(updatedSlides);
      return updatedSlide;
    });
  };

  const handleRemoveLayer = (layerId) => {
    updateActiveSlide((slide) => {
      const updatedSlide = {
      ...slide,
      layers: slide.layers.filter((layer) => layer.id !== layerId),
      };
      const updatedSlides = slides.map((s) => (s.id === activeSlideId ? updatedSlide : s));
      saveToHistory(updatedSlides);
      return updatedSlide;
    });
    if (selectedLayerId === layerId) {
      setSelectedLayerId(null);
    }
  };

  const handleDuplicateLayer = (layerId) => {
    const layer = activeSlide?.layers.find((l) => l.id === layerId);
    if (!layer) return;

    const duplicated = {
      ...layer,
      id: `layer-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
      name: `${layer.name} copy`,
      x: layer.x + 20,
      y: layer.y + 20,
    };

    updateActiveSlide((slide) => {
      const updatedSlide = {
        ...slide,
        layers: [...slide.layers, duplicated],
      };
      const updatedSlides = slides.map((s) => (s.id === activeSlideId ? updatedSlide : s));
      saveToHistory(updatedSlides);
      return updatedSlide;
    });
    setSelectedLayerId(duplicated.id);
  };

  const handleToggleLayerVisibility = (layerId) => {
    updateActiveSlide((slide) => {
      const updatedSlide = {
        ...slide,
        layers: slide.layers.map((layer) =>
          layer.id === layerId
            ? {
                ...layer,
                visible: !layer.visible,
              }
            : layer,
        ),
      };
      const updatedSlides = slides.map((s) => (s.id === activeSlideId ? updatedSlide : s));
      saveToHistory(updatedSlides);
      return updatedSlide;
    });
  };

  const handleReorderLayers = (newLayers) => {
    updateActiveSlide((slide) => {
      const updatedSlide = {
        ...slide,
        layers: newLayers,
      };
      const updatedSlides = slides.map((s) => (s.id === activeSlideId ? updatedSlide : s));
      saveToHistory(updatedSlides);
      return updatedSlide;
    });
  };

  const handleAddSlide = () => {
    const currentIndex = slides.findIndex((slide) => slide.id === activeSlideId);
    const newSlide = {
      id: `slide-${Date.now()}`,
      name: `Slide ${slides.length + 1}`,
      background: '#ffffff',
      layers: [],
    };
    
    let updatedSlides;
    if (currentIndex === -1) {
      // If no active slide, add at the end
      updatedSlides = [...slides, newSlide];
    } else {
      // Insert below the current slide
      updatedSlides = [...slides];
      updatedSlides.splice(currentIndex + 1, 0, newSlide);
    }
    setSlides(updatedSlides);
    saveToHistory(updatedSlides);
    setActiveSlideId(newSlide.id);
    setSelectedLayerId(null);
  };

  const handleDeleteSlide = (slideId) => {
    if (slides.length <= 1) {
      // Don't allow deleting the last slide
      return;
    }
    
    const slideIndex = slides.findIndex((slide) => slide.id === slideId);
    if (slideIndex === -1) return;
    
    const updatedSlides = slides.filter((slide) => slide.id !== slideId);
    setSlides(updatedSlides);
    saveToHistory(updatedSlides);
    
    // If we deleted the active slide, switch to another one
    if (slideId === activeSlideId) {
      const newIndex = slideIndex > 0 ? slideIndex - 1 : 0;
      if (updatedSlides.length > 0) {
        setActiveSlideId(updatedSlides[newIndex].id);
      }
    }
    setSelectedLayerId(null);
  };

  const handleDuplicateSlide = (slide) => {
    const duplicate = {
      ...slide,
      id: `slide-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
      name: `${slide.name} copy`,
      layers: slide.layers.map((layer) => ({ ...layer, id: `${layer.id}-copy` })),
    };
    const updatedSlides = [...slides, duplicate];
    setSlides(updatedSlides);
    saveToHistory(updatedSlides);
    setActiveSlideId(duplicate.id);
  };

  const baseBackground = 'linear-gradient(135deg, #eef2ff 0%, #f8fafc 100%)';

  return (
    <>
      <style>
        {`
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(241, 245, 249, 0.3);
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(148, 163, 184, 0.5);
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(148, 163, 184, 0.7);
          }
          .custom-scrollbar::-webkit-scrollbar-corner {
            background: rgba(241, 245, 249, 0.3);
          }
        `}
      </style>
    <div
      style={{
          height: '100vh',
        width: '100%',
        background: baseBackground,
          padding: '32px 28px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: '18px',
          overflow: 'hidden',
          position: 'relative',
      }}
    >
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: '#ffffff',
          borderRadius: '16px',
          padding: '12px 16px',
          boxShadow: '0 18px 48px rgba(15, 23, 42, 0.08)',
          flexShrink: 0,
        }}
      >
        <button
          onClick={onBack}
          style={{
            border: '1px solid rgba(99, 102, 241, 0.18)',
            background: 'rgba(99, 102, 241, 0.08)',
            color: '#4338ca',
            borderRadius: '14px',
            padding: '10px 12px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <ChevronLeft size={18} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.9rem',
            }}
          >
            {layout.aspectLabel}
          </div>
          <div>
            <div
              style={{
                fontWeight: 700,
                fontSize: '1rem',
                color: '#0f172a',
              }}
            >
              {layout.name}
            </div>
            <div
              style={{
                fontSize: '0.8rem',
                color: '#475569',
                marginTop: 2,
              }}
            >
              {layout.width} × {layout.height}px canvas
            </div>
          </div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <UndoRedoControls
            historyIndex={historyIndex}
            historyLength={historyLength}
            onUndo={onUndo}
            onRedo={onRedo}
          />
          <div
            style={{
              width: 1,
              height: 20,
              background: 'rgba(15, 23, 42, 0.1)',
            }}
          />
          <ZoomControls
            zoom={zoom}
            onZoomChange={handleZoomChange}
            onFitToScreen={handleFitToScreen}
            onZoomTo100={handleZoomTo100}
            compact={true}
          />
          <div
            style={{
              width: 1,
              height: 20,
              background: 'rgba(15, 23, 42, 0.1)',
            }}
          />
          <button
            onClick={() => setIsPreviewMode(true)}
            style={{
              border: '1px solid rgba(15, 23, 42, 0.1)',
              background: 'rgba(15, 23, 42, 0.04)',
              borderRadius: 10,
              padding: '6px 14px',
              fontWeight: 600,
              fontSize: '0.85rem',
              color: '#0f172a',
              cursor: 'pointer',
            }}
          >
            Preview
          </button>
          <button
            onClick={() => setIsShareModalOpen(true)}
            style={{
              border: 'none',
              background: 'linear-gradient(135deg, #4338ca 0%, #4f46ef 50%, #7c3aed 100%)',
              borderRadius: 10,
              padding: '6px 20px',
              fontWeight: 600,
              fontSize: '0.85rem',
              color: '#ffffff',
              cursor: 'pointer',
              boxShadow: '0 14px 30px rgba(79, 70, 229, 0.32)',
            }}
          >
            Share
          </button>
        </div>
      </header>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: leftSidebarVisible && rightSidebarVisible
            ? '180px minmax(0, 1fr) 300px'
            : leftSidebarVisible
            ? '180px minmax(0, 1fr)'
            : rightSidebarVisible
            ? 'minmax(0, 1fr) 300px'
            : 'minmax(0, 1fr)',
          gap: '12px',
          flex: 1,
          minHeight: 0,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Slides rail */}
        {leftSidebarVisible && (
        <aside
          style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '12px',
            boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            overflowY: 'auto',
            overflowX: 'hidden',
            height: '100%',
            minHeight: 0,
            maxHeight: '100%',
          }}
          className="custom-scrollbar"
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            <span style={{ fontWeight: 700, fontSize: '0.8rem', color: '#0f172a' }}>Slides</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              onClick={handleAddSlide}
              title="Add slide"
              style={{
                border: 'none',
                background: 'rgba(99, 102, 241, 0.1)',
                color: '#4f46e5',
                  borderRadius: 10,
                  padding: '4px',
                display: 'inline-flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
              }}
            >
                <Plus size={14} />
              </button>
              <button
                onClick={() => setLeftSidebarVisible(false)}
                title="Hide slides panel"
                style={{
                  border: 'none',
                  background: 'rgba(15, 23, 42, 0.06)',
                  color: '#475569',
                  borderRadius: 10,
                  padding: '4px',
                  display: 'inline-flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                }}
              >
                <ChevronLeft size={14} />
            </button>
            </div>
          </div>

          <div
            className="custom-scrollbar"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              overflowY: 'auto',
              overflowX: 'hidden',
              flex: 1,
              minHeight: 0,
              paddingRight: '4px',
            }}
          >
            {slides.map((slide, index) => {
              const isActive = slide.id === activeSlideId;
              return (
                <div
                  key={slide.id}
                  style={{
                    borderRadius: 12,
                    padding: '8px',
                    background: isActive ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' : '#f8fafc',
                    color: isActive ? '#ffffff' : '#0f172a',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                    transition: 'transform 150ms ease',
                  }}
                  onClick={() => setActiveSlideId(slide.id)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.75rem' }}>Slide {index + 1}</span>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        handleDuplicateSlide(slide);
                      }}
                      style={{
                        border: 'none',
                        background: 'transparent',
                        color: isActive ? '#e0e7ff' : '#6366f1',
                        cursor: 'pointer',
                        display: 'inline-flex',
                          padding: 4,
                          borderRadius: 6,
                      }}
                        title="Duplicate slide"
                    >
                        <Copy size={14} />
                    </button>
                      {slides.length > 1 && (
                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            handleDeleteSlide(slide.id);
                          }}
                          style={{
                            border: 'none',
                            background: 'transparent',
                            color: isActive ? '#fca5a5' : '#ef4444',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            padding: 4,
                            borderRadius: 6,
                          }}
                          title="Delete slide"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                  <div
                    style={{
                      borderRadius: 10,
                      background: '#ffffff',
                      height: 70,
                      border: '1px solid rgba(15, 23, 42, 0.08)',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        inset: '8px',
                        borderRadius: 8,
                        background: slide.background,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#94a3b8',
                        fontSize: '0.65rem',
                        fontWeight: 500,
                      }}
                    >
                      {slide.layers.length ? `${slide.layers.length} elements` : 'Empty'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>
        )}

        {/* Canvas area */}
        <section
          style={{
            background: '#f1f5f9',
            borderRadius: '22px',
            padding: '16px',
            boxShadow: '0 10px 30px rgba(15, 23, 42, 0.05)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            height: '100%',
            minHeight: 0,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              justifyContent: 'space-between',
              flexShrink: 0,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '4px 10px',
                  borderRadius: 10,
                  background: 'rgba(79, 70, 229, 0.12)',
                  color: '#4338ca',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  whiteSpace: 'nowrap',
                }}
              >
                <Layers size={12} />
                <span>{activeSlide?.layers.length || 0} layers</span>
              </span>
              <span style={{ color: '#475569', fontSize: '0.75rem' }}>
                Tip: Choose a preset on the right, then click anywhere on the slide.
              </span>
            </div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                padding: '6px 12px',
                borderRadius: 12,
                background: '#ffffff',
                border: '1px solid rgba(148, 163, 184, 0.18)',
                fontWeight: 600,
                color: '#0f172a',
              }}
            >
              <Maximize size={14} />
              {layout.aspectLabel}
            </div>
          </div>

          <div
            ref={canvasContainerRef}
            onWheel={handleWheel}
            onMouseDown={handlePanStart}
            onMouseLeave={handlePanEnd}
            data-canvas-container
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              overflowY: 'auto',
              overflowX: 'auto',
              maxHeight: '100%',
              maxWidth: '100%',
              minHeight: 0,
              minWidth: 0,
              padding: '20px',
              position: 'relative',
              cursor: isPanning ? 'grabbing' : (selectedTool === 'select' && !selectedPreset && !selectedLayerId ? 'grab' : selectedPreset ? 'crosshair' : 'default'),
            }}
            className="custom-scrollbar"
          >
            <div
              style={{
                width: canvasRenderWidth,
                height: canvasRenderHeight,
                minWidth: canvasRenderWidth,
                minHeight: canvasRenderHeight,
                background: '#ffffff',
                borderRadius: 24,
                boxShadow: '0 30px 60px rgba(15, 23, 42, 0.14)',
                border: '1px solid rgba(148, 163, 184, 0.25)',
                position: 'relative',
                overflow: 'hidden',
                flexShrink: 0,
                backgroundImage:
                  'linear-gradient(0deg, transparent 24%, rgba(148, 163, 184, 0.08) 25%, rgba(148, 163, 184, 0.08) 26%, transparent 27%), linear-gradient(90deg, transparent 24%, rgba(148, 163, 184, 0.08) 25%, rgba(148, 163, 184, 0.08) 26%, transparent 27%)',
                backgroundSize: '40px 40px',
              }}
            >
              <Stage
                ref={stageRef}
                width={canvasRenderWidth}
                height={canvasRenderHeight}
                onClick={handleStageClick}
                onTap={handleStageClick}
                onMouseDown={handlePanStart}
                data-canvas-stage
                  style={{
                  cursor: isPanning 
                    ? 'grabbing' 
                    : selectedPreset 
                    ? 'crosshair' 
                    : selectedTool === 'select' && !selectedPreset && !selectedLayerId
                    ? 'grab' 
                    : 'default' 
                }}
                onMouseMove={(e) => {
                  // Update cursor on hover
                  if (!isPanning && selectedTool === 'select' && !selectedPreset && !selectedLayerId) {
                    const stage = e.target.getStage();
                    if (stage && (e.target === stage || e.target.name() === 'background')) {
                      if (stage.container()) {
                        stage.container().style.cursor = 'grab';
                      }
                    }
                  }
                }}
              >
                <Layer>
                  <Rect
                    name="background"
                    x={0}
                    y={0}
                    width={layout.width * scale}
                    height={layout.height * scale}
                    fill={activeSlide?.background || '#ffffff'}
                  />
                </Layer>
                {activeSlide?.layers.map((layer) => {
                  if (!layer.visible) return null;

                  const isSelected = layer.id === selectedLayerId;
                  const scaledX = layer.x * scale;
                  const scaledY = layer.y * scale;
                  const scaledWidth = layer.width * scale;
                  const scaledHeight = layer.height * scale;

                  let renderedLayer = null;

                  if (layer.type === 'text') {
                    renderedLayer = (
                      <TextLayer
                        layer={layer}
                        scaledX={scaledX}
                        scaledY={scaledY}
                        scaledWidth={scaledWidth}
                        scaledHeight={scaledHeight}
                        isSelected={isSelected}
                        scale={scale}
                        onDragEnd={(e) => handleLayerDragEnd(layer, e)}
                        onClick={(e) => handleLayerClick(layer, e)}
                      />
                    );
                  } else if (layer.type === 'image') {
                    renderedLayer = (
                      <ImageLayer
                        layer={layer}
                        scaledX={scaledX}
                        scaledY={scaledY}
                        scaledWidth={scaledWidth}
                        scaledHeight={scaledHeight}
                        isSelected={isSelected}
                        scale={scale}
                        onDragEnd={(e) => handleLayerDragEnd(layer, e)}
                        onClick={(e) => handleLayerClick(layer, e)}
                      />
                    );
                  } else if (layer.type === 'shape') {
                    renderedLayer = (
                      <ShapeLayer
                        layer={layer}
                        scaledX={scaledX}
                        scaledY={scaledY}
                        scaledWidth={scaledWidth}
                        scaledHeight={scaledHeight}
                        isSelected={isSelected}
                        scale={scale}
                        onDragEnd={(e) => handleLayerDragEnd(layer, e)}
                        onClick={(e) => handleLayerClick(layer, e)}
                      />
                    );
                  }

                  if (!renderedLayer) return null;

                  return (
                    <ElementLayer key={layer.id} effects={layer.effects} scale={scale}>
                      {renderedLayer}
                    </ElementLayer>
                  );
                })}
              </Stage>
            </div>
          </div>
        </section>

        {/* Tools & inspector */}
        {rightSidebarVisible && (
        <aside
          style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '12px 14px',
            boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            overflowY: 'auto',
            overflowX: 'hidden',
            minHeight: 0,
            maxHeight: '100%',
            height: '100%',
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(148, 163, 184, 0.5) rgba(241, 245, 249, 0.3)',
              }}
          className="custom-scrollbar"
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginBottom: '8px', flexShrink: 0 }}>
                  <button
              onClick={() => setRightSidebarVisible(false)}
              title="Hide tools panel"
                    style={{
                border: 'none',
                        background: 'rgba(15, 23, 42, 0.06)',
                color: '#475569',
                borderRadius: 10,
                padding: '4px',
                        display: 'inline-flex',
                        justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
              }}
            >
              <ChevronRight size={14} />
                  </button>
          </div>

          <LayerManager
            layers={activeSlide?.layers || []}
            selectedLayerId={selectedLayerId}
            onSelectLayer={setSelectedLayerId}
            onDeleteLayer={handleRemoveLayer}
            onToggleVisibility={handleToggleLayerVisibility}
            onDuplicateLayer={handleDuplicateLayer}
            onReorderLayers={handleReorderLayers}
          />

          <div
              style={{
              height: 1,
              background: 'linear-gradient(to right, transparent, rgba(203, 213, 225, 0.7), transparent)',
            }}
          />

          <SelectionTool selectedTool={selectedTool} onSelect={handleToolSelect} />

          <div
                    style={{
              height: 1,
              background: 'linear-gradient(to right, transparent, rgba(203, 213, 225, 0.7), transparent)',
            }}
          />

          <TextTools selectedPreset={selectedPreset} onSelect={handlePresetSelect} />

          <div
                      style={{
              height: 1,
              background: 'linear-gradient(to right, transparent, rgba(203, 213, 225, 0.7), transparent)',
            }}
          />

          <ShapeTools selectedPreset={selectedPreset} onSelect={handlePresetSelect} />

          <div
                      style={{
              height: 1,
              background: 'linear-gradient(to right, transparent, rgba(203, 213, 225, 0.7), transparent)',
                      }}
          />

          <DrawingTools selectedTool={selectedTool} onSelect={handleToolSelect} />

          <div
            style={{
              height: 1,
              background: 'linear-gradient(to right, transparent, rgba(203, 213, 225, 0.7), transparent)',
            }}
          />

          <div>
            <span
              style={{
                fontSize: '0.78rem',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: '#94a3b8',
                fontWeight: 700,
              }}
            >
              Inspector
            </span>

            {selectedLayer ? (
              <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>{selectedLayer.name || 'Layer'}</span>
                  <button
                    onClick={() => handleRemoveLayer(selectedLayer.id)}
                    style={{
                      border: 'none',
                      background: 'rgba(239, 68, 68, 0.12)',
                      color: '#dc2626',
                      borderRadius: 12,
                      padding: '6px 10px',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <Trash2 size={14} />
                    Remove
                  </button>
                </div>

                {selectedLayer.type === 'text' && (
                  <>
                    <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Content</span>
                      <textarea
                        value={selectedLayer.text}
                        onChange={(event) => handleLayerChange({ text: event.target.value })}
                        rows={3}
                        style={{
                          borderRadius: 14,
                          border: '1px solid rgba(148, 163, 184, 0.35)',
                          padding: '10px 12px',
                          fontFamily: 'inherit',
                          fontSize: '0.95rem',
                          color: '#0f172a',
                        }}
                      />
                    </label>
                    <div style={{ display: 'flex', gap: 12 }}>
                      <label style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#475569' }}>Font size</span>
                        <input
                          type="number"
                          min={8}
                          max={120}
                          value={selectedLayer.fontSize}
                          onChange={(event) => handleLayerChange({ fontSize: Number(event.target.value) })}
                          style={{
                            borderRadius: 12,
                            border: '1px solid rgba(148, 163, 184, 0.35)',
                            padding: '8px 10px',
                          }}
                        />
                      </label>
                      <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#475569' }}>Color</span>
                        <input
                          type="color"
                          value={selectedLayer.color}
                          onChange={(event) => handleLayerChange({ color: event.target.value })}
                          style={{
                            width: 48,
                            height: 38,
                            borderRadius: 12,
                            border: '1px solid rgba(148, 163, 184, 0.35)',
                            padding: 4,
                          }}
                        />
                      </label>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {['left', 'center', 'right'].map((align) => (
                        <button
                          key={align}
                          onClick={() => handleLayerChange({ textAlign: align })}
                          style={{
                            flex: 1,
                            border: '1px solid rgba(148, 163, 184, 0.35)',
                            background:
                              selectedLayer.textAlign === align ? 'rgba(79, 70, 229, 0.08)' : '#ffffff',
                            borderRadius: 12,
                            padding: '8px 0',
                            fontWeight: 600,
                            color: '#1e293b',
                            cursor: 'pointer',
                            textTransform: 'capitalize',
                          }}
                        >
                          {align}
                        </button>
                      ))}
                    </div>

                    <TextEnhanceControls
                      layer={selectedLayer}
                      onApply={handleApplyEnhancedText}
                    />
                  </>
                )}

                {selectedLayer.type === 'shape' && (
                  <>
                    <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Fill colour</span>
                      <input
                        type="color"
                        value={selectedLayer.fillColor}
                        onChange={(event) => handleLayerChange({ fillColor: event.target.value })}
                        style={{
                          width: '100%',
                          height: 42,
                          borderRadius: 12,
                          border: '1px solid rgba(148, 163, 184, 0.35)',
                        }}
                      />
                    </label>
                    <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>
                        Corner radius
                      </span>
                      <input
                        type="range"
                        min={0}
                        max={selectedLayer.shape === 'circle' ? selectedLayer.width / 2 : 80}
                        value={selectedLayer.borderRadius}
                        onChange={(event) =>
                          handleLayerChange({ borderRadius: Number(event.target.value) })
                        }
                      />
                    </label>
                    <ShapeImageFillControls
                      layer={selectedLayer}
                      onChange={handleLayerChange}
                      latestGeneratedImage={lastGeneratedImageRef.current}
                      imageLibrary={imageLibrary}
                      onStoreImage={(image) =>
                        registerImageInLibrary(image, { origin: 'upload', label: 'Shape upload' })
                      }
                    />
                  </>
                )}

                <div
                  style={{
                    border: '1px solid rgba(148, 163, 184, 0.35)',
                    borderRadius: 18,
                    padding: 16,
                    background: '#ffffff',
                  }}
                >
                  <LayerEffectsPanel
                    effects={selectedLayer.effects}
                    onChange={(effects) => handleLayerChange({ effects })}
                  />
                </div>
              </div>
            ) : (
              <div
                style={{
                  marginTop: 18,
                  background: 'rgba(248, 250, 252, 0.9)',
                  borderRadius: 18,
                  padding: '18px',
                  textAlign: 'center',
                  color: '#64748b',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  lineHeight: 1.5,
                }}
              >
                Select an element on the canvas to customise it. You can add new content with the quick
                presets above.
              </div>
            )}
          </div>

          <div
            style={{
              height: 1,
              background: 'linear-gradient(to right, transparent, rgba(203, 213, 225, 0.7), transparent)',
            }}
          />

          <div>
            <span
              style={{
                fontSize: '0.78rem',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: '#94a3b8',
                fontWeight: 700,
              }}
            >
              Slide background
            </span>
            <div style={{ marginTop: 12, display: 'flex', gap: 12 }}>
              <input
                type="color"
                value={activeSlide?.background || '#ffffff'}
                onChange={(event) => {
                  updateActiveSlide((slide) => {
                    const updatedSlide = { ...slide, background: event.target.value };
                    const updatedSlides = slides.map((s) => (s.id === activeSlideId ? updatedSlide : s));
                    saveToHistory(updatedSlides);
                    return updatedSlide;
                  });
                }}
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 18,
                  border: '1px solid rgba(148, 163, 184, 0.35)',
                }}
              />
              <ImageUpload
                onImageUpload={handleImageUpload}
                layout={layout}
              />
            </div>
            <div style={{ marginTop: 12 }}>
              <ImageGenerateControls onImageReady={handleAddGeneratedImage} />
            </div>
            <div style={{ marginTop: 12 }}>
              <ImageLibrary
                images={imageLibrary}
                onInsertImage={handleInsertLibraryImage}
                onApplyToShape={
                  selectedLayer?.type === 'shape' ? handleApplyLibraryImageToShape : undefined
                }
              />
            </div>
          </div>
        </aside>
        )}

        {/* Toggle buttons for sidebars */}
        {!leftSidebarVisible && (
              <button
            onClick={() => setLeftSidebarVisible(true)}
                style={{
              position: 'absolute',
              left: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              background: '#ffffff',
              border: '1px solid rgba(15, 23, 42, 0.1)',
              borderRadius: '0 12px 12px 0',
              padding: '12px 6px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(15, 23, 42, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
              zIndex: 10,
            }}
            title="Show slides panel"
          >
            <ChevronRight size={18} color="#475569" />
          </button>
        )}

        {!rightSidebarVisible && (
          <button
            onClick={() => setRightSidebarVisible(true)}
            style={{
              position: 'absolute',
              right: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              background: '#ffffff',
              border: '1px solid rgba(15, 23, 42, 0.1)',
              borderRadius: '12px 0 0 12px',
              padding: '12px 6px',
                  cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(15, 23, 42, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
                }}
            title="Show tools panel"
              >
            <ChevronLeft size={18} color="#475569" />
              </button>
        )}
            </div>

      {/* Preview Modal */}
      <PreviewModal
        isOpen={isPreviewMode}
        onClose={() => setIsPreviewMode(false)}
        slides={slides}
        layout={layout}
        startSlideIndex={startSlideIndex}
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        slides={slides}
        layout={layout}
      />
          </div>
    </>
  );
};

export default PresentationWorkspace;

