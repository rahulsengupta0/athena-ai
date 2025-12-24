import React, { useMemo, useRef, useState, useEffect, useCallback } from 'react';
import { Stage, Layer, Group, Text, Rect, Circle, Line, Ellipse, Image as KonvaImage } from 'react-konva';
import Konva from 'konva';
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
  Timer,
  GripVertical,
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
import ResizeHandles from './canvas/ResizeHandles';
import RotateHandle from './canvas/RotateHandle';
import LayerActionBar from './canvas/LayerActionBar';
import FontFamilySelector from './controls/FontFamilySelector';
import FontStyleControls from './controls/FontStyleControls';
import TextAlignControls from './controls/TextAlignControls';

import { getShapePoints } from './utils/shapeUtils';
import { useHistory } from './utils/useHistory';
import { applyLayerEffectsToNode } from './utils/effectUtils';
import { normalizeImageEffects } from './utils/effectDefaults';
import { createImageLayer } from './utils/imageUtils';
import { getAutoSizedTextFrame } from './utils/textLayout';
import { getKonvaFontStyle } from './utils/fontUtils';
import { enhancePresentationText } from './ai/api';

const useLayerEffects = (nodeRef, effects, scaleFactor = 1, dependencies = []) => {
  useEffect(() => {
    const node = nodeRef?.current;
    if (!node) return;
    applyLayerEffectsToNode(node, effects, scaleFactor);
  }, [nodeRef, effects, scaleFactor, ...dependencies]);
};

const ElementGroup = ({
  effects,
  scale,
  children,
}) => {
  const groupRef = useRef(null);
  
  // Apply blur effect to the group (replacing the CSS filter approach)
  useEffect(() => {
    const groupNode = groupRef?.current;
    if (!groupNode) return;
    
    const normalized = normalizeImageEffects(effects);
    const blurPx = Math.max(0, (normalized.blur || 0) * scale);
    
    // Apply blur filter if needed
    if (blurPx > 0) {
      const currentFilters = groupNode.filters() || [];
      if (!currentFilters.includes(Konva.Filters.Blur)) {
        groupNode.filters([...currentFilters, Konva.Filters.Blur]);
      }
      groupNode.blurRadius(blurPx);
      groupNode.cache();
    } else {
      const currentFilters = groupNode.filters() || [];
      const newFilters = currentFilters.filter(f => f !== Konva.Filters.Blur);
      groupNode.filters(newFilters);
      groupNode.blurRadius(0);
      if (newFilters.length === 0) {
        groupNode.clearCache();
      }
    }
    
    groupNode.getLayer()?.batchDraw();
  }, [groupRef, effects, scale]);
  
  return (
    <Group ref={groupRef}>
      {children}
    </Group>
  );
};


// Image component for rendering images on canvas
const ImageLayer = React.forwardRef((
  {
    layer,
    scaledX,
    scaledY,
    scaledWidth,
    scaledHeight,
    scale,
    onDragMove,
    onDragEnd,
    onClick,
  },
  ref,
) => {
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
      ref={ref}
      rotation={layer.rotation || 0}
      scaleX={1}
      scaleY={1}
      width={scaledWidth}
      height={scaledHeight}
      offsetX={scaledWidth / 2}
      offsetY={scaledHeight / 2}
      x={scaledX + scaledWidth / 2}
      y={scaledY + scaledHeight / 2}
      draggable
      onDragMove={onDragMove}
      onDragEnd={onDragEnd}
      onClick={onClick}
      onTap={onClick}
    >
      <KonvaImage
        ref={imageRef}
        x={-scaledWidth / 2}
        y={-scaledHeight / 2}
        width={scaledWidth}
        height={scaledHeight}
        image={null}
        opacity={imageLoaded ? 1 : 0}
        draggable={false}
        listening={true}
      />
      {!imageLoaded && (
        <Rect
          x={-scaledWidth / 2}
          y={-scaledHeight / 2}
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
});
ImageLayer.displayName = 'ImageLayer';

const TextLayer = React.forwardRef((
  {
    layer,
    scaledX,
    scaledY,
    scaledWidth,
    scaledHeight,
    scale,
    onDragMove,
    onDragEnd,
    onClick,
  },
  ref,
) => {
  const textRef = useRef(null);
  useLayerEffects(textRef, layer.effects, scale);

  return (
    <Group
      ref={ref}
      rotation={layer.rotation || 0}
      scaleX={1}
      scaleY={1}
      width={scaledWidth}
      height={scaledHeight}
      offsetX={scaledWidth / 2}
      offsetY={scaledHeight / 2}
      x={scaledX + scaledWidth / 2}
      y={scaledY + scaledHeight / 2}
      draggable
      onDragMove={onDragMove}
      onDragEnd={onDragEnd}
      onClick={onClick}
      onTap={onClick}
    >
      <Text
        ref={textRef}
        x={-scaledWidth / 2}
        y={-scaledHeight / 2}
        width={scaledWidth}
        height={scaledHeight}
        text={layer.text}
        fontSize={layer.fontSize * scale}
        fontFamily={layer.fontFamily || 'Poppins'}
        fontStyle={getKonvaFontStyle(layer.fontStyle, layer.fontWeight)}
        fill={layer.color}
        align={layer.textAlign || 'left'}
        verticalAlign="middle"
        padding={12 * scale}
        wrap="word"
        textDecoration={layer.textDecoration || 'none'}
      />
    </Group>
  );
});
TextLayer.displayName = 'TextLayer';

// Helper to create clip function for shapes (similar to CSS clipPath)
const getShapeClipFunc = (shape, width, height) => {
  return (ctx) => {
    ctx.beginPath();
    if (shape === 'circle') {
      const radius = Math.min(width, height) / 2;
      ctx.arc(radius, radius, radius, 0, Math.PI * 2);
    } else if (shape === 'ellipse') {
      ctx.ellipse(width / 2, height / 2, width / 2, height / 2, 0, 0, Math.PI * 2);
    } else if (shape === 'rectangle') {
      ctx.rect(0, 0, width, height);
    } else {
      // For custom shapes, use the points
      const points = getShapePoints(shape, width, height);
      if (points.length > 0) {
        ctx.moveTo(points[0], points[1]);
        for (let i = 2; i < points.length; i += 2) {
          ctx.lineTo(points[i], points[i + 1]);
        }
        ctx.closePath();
      }
    }
  };
};

const ShapeLayer = React.forwardRef((
  {
    layer,
    scaledX,
    scaledY,
    scaledWidth,
    scaledHeight,
    scale,
    onDragMove,
    onDragEnd,
    onClick,
  },
  ref,
) => {
  const shapeRef = useRef(null);
  const imageRef = useRef(null);
  const [imageData, setImageData] = useState(null);
  
  // Load image for image fill (CSS-like approach)
  useEffect(() => {
    if (layer.fillType === 'image' && layer.fillImageSrc) {
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        setImageData({ img, width: img.width, height: img.height });
        if (imageRef.current) {
          imageRef.current.image(img);
          imageRef.current.getLayer()?.batchDraw();
        }
      };
      img.onerror = () => setImageData(null);
      img.src = layer.fillImageSrc;
    } else {
      setImageData(null);
    }
  }, [layer.fillType, layer.fillImageSrc]);
  
  // Determine which ref to use for effects based on fill type
  const hasImageFill = layer.fillType === 'image' && layer.fillImageSrc && imageData;
  const effectsTargetRef = hasImageFill ? imageRef : shapeRef;
  
  // Apply effects to the appropriate target (image or shape)
  useLayerEffects(effectsTargetRef, layer.effects, scale, hasImageFill ? [imageData] : []);
  
  // Calculate image dimensions for cover/contain (same logic as CSS background-size)
  const imageDims = useMemo(() => {
    if (!imageData || !layer.fillImageSrc || layer.fillType !== 'image') {
      return null;
    }
    
    const { width: imgWidth, height: imgHeight } = imageData;
    const fit = layer.fillImageFit || 'cover';
    
    // Calculate scale (same logic as CSS background-size: cover/contain)
    const scaleX = scaledWidth / imgWidth;
    const scaleY = scaledHeight / imgHeight;
    const scale = fit === 'contain' ? Math.min(scaleX, scaleY) : Math.max(scaleX, scaleY);
    
    const drawWidth = imgWidth * scale;
    const drawHeight = imgHeight * scale;
    
    // Center the image (same as CSS background-position: center)
    const offsetX = (scaledWidth - drawWidth) / 2;
    const offsetY = (scaledHeight - drawHeight) / 2;
    
    return { width: drawWidth, height: drawHeight, x: offsetX, y: offsetY };
  }, [imageData, scaledWidth, scaledHeight, layer.fillImageFit, layer.fillType, layer.fillImageSrc]);

  const renderShape = () => {
    const hasImageFillRender = layer.fillType === 'image' && layer.fillImageSrc && imageDims;
    const clipFunc = hasImageFillRender ? getShapeClipFunc(layer.shape, scaledWidth, scaledHeight) : null;
    
    // Render shape with image fill or color fill
    const renderShapeContent = () => {
      if (hasImageFillRender) {
        // Render image fill with clipping (CSS-like approach)
        return (
          <Group clipFunc={clipFunc}>
            <KonvaImage
              ref={imageRef}
              x={imageDims.x}
              y={imageDims.y}
              width={imageDims.width}
              height={imageDims.height}
            />
            {/* Render shape outline for effects */}
            {layer.shape === 'circle' && (() => {
              const radius = Math.min(scaledWidth, scaledHeight) / 2;
              return <Circle ref={shapeRef} x={0} y={0} radius={radius} fill="transparent" />;
            })()}
            {layer.shape === 'ellipse' && (
              <Ellipse
                ref={shapeRef}
                x={0}
                y={0}
                radiusX={scaledWidth / 2}
                radiusY={scaledHeight / 2}
                fill="transparent"
              />
            )}
            {layer.shape === 'rectangle' && (
              <Rect
                ref={shapeRef}
                x={-scaledWidth / 2}
                y={-scaledHeight / 2}
                width={scaledWidth}
                height={scaledHeight}
                fill="transparent"
                cornerRadius={layer.borderRadius * scale}
              />
            )}
            {!['circle', 'ellipse', 'rectangle'].includes(layer.shape) && (() => {
              const points = getShapePoints(layer.shape, scaledWidth, scaledHeight);
              if (points.length === 0) return null;
              return <Line ref={shapeRef} points={points} closed fill="transparent" stroke="transparent" />;
            })()}
          </Group>
        );
      }
      
      // Render color fill (normal rendering)
      if (layer.shape === 'circle') {
        const radius = Math.min(scaledWidth, scaledHeight) / 2;
        return <Circle ref={shapeRef} x={0} y={0} radius={radius} fill={layer.fillColor} />;
      }
      
      if (layer.shape === 'ellipse') {
        return (
          <Ellipse
            ref={shapeRef}
            x={0}
            y={0}
            radiusX={scaledWidth / 2}
            radiusY={scaledHeight / 2}
            fill={layer.fillColor}
          />
        );
      }
      
      if (layer.shape === 'rectangle') {
        return (
          <Rect
            ref={shapeRef}
            x={-scaledWidth / 2}
            y={-scaledHeight / 2}
            width={scaledWidth}
            height={scaledHeight}
            fill={layer.fillColor}
            cornerRadius={layer.borderRadius * scale}
          />
        );
      }
      
      const points = getShapePoints(layer.shape, scaledWidth, scaledHeight);
      if (points.length === 0) return null;
      return <Line ref={shapeRef} points={points} closed fill={layer.fillColor} stroke={layer.fillColor} />;
    };
    
    return renderShapeContent();
  };

  return (
    <Group
      ref={ref}
      rotation={layer.rotation || 0}
      scaleX={1}
      scaleY={1}
      width={scaledWidth}
      height={scaledHeight}
      offsetX={scaledWidth / 2}
      offsetY={scaledHeight / 2}
      x={scaledX + scaledWidth / 2}
      y={scaledY + scaledHeight / 2}
      draggable
      onDragMove={onDragMove}
      onDragEnd={onDragEnd}
      onClick={onClick}
      onTap={onClick}
    >
      {renderShape()}
    </Group>
  );
});
ShapeLayer.displayName = 'ShapeLayer';

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
      fontWeight: preset.fontWeight || 'normal',
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      textDecoration: 'none',
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

const DEFAULT_SLIDE_DURATION = 5;

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
      animationDuration: DEFAULT_SLIDE_DURATION,
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
  const [previewDropdownOpen, setPreviewDropdownOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState('manual');
  const [zoom, setZoom] = useState(initialZoom);
  const [isPanning, setIsPanning] = useState(false);
  const [imageLibrary, setImageLibrary] = useState([]);
  const [enhancingLayerId, setEnhancingLayerId] = useState(null);
  const [uploadingLayerId, setUploadingLayerId] = useState(null);
  const [selectionBounds, setSelectionBounds] = useState(null);
  const [isTimingPanelOpen, setIsTimingPanelOpen] = useState(false);
  const [timingToast, setTimingToast] = useState(null);
  const [draggedSlideId, setDraggedSlideId] = useState(null);
  const [dragOverSlideId, setDragOverSlideId] = useState(null);
  const stageRef = useRef(null);
  const canvasContainerRef = useRef(null);
  const stageWrapperRef = useRef(null);
  const zoomTargetRef = useRef({ scrollLeft: null, scrollTop: null });
  const panStartRef = useRef({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0 });
  const hasPannedRef = useRef(false);
  const layerNodeRefs = useRef({});
  const inspectorRef = useRef(null);
  const timingButtonRef = useRef(null);
  const timingPanelRef = useRef(null);
  const previewButtonRef = useRef(null);
  const previewDropdownRef = useRef(null);
  const getLayerNodeRef = (layerId) => {
    if (!layerNodeRefs.current[layerId]) {
      layerNodeRefs.current[layerId] = React.createRef();
    }
    return layerNodeRefs.current[layerId];
  };

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
    if (!activeSlide) return;
    const ids = new Set(activeSlide.layers.map((layer) => layer.id));
    Object.keys(layerNodeRefs.current).forEach((layerId) => {
      if (!ids.has(layerId)) {
        delete layerNodeRefs.current[layerId];
      }
    });
  }, [activeSlide]);

  useEffect(() => {
    if (!activeSlide && slides.length > 0) {
      setActiveSlideId(slides[0].id);
    }
  }, [activeSlide, slides]);

  useEffect(() => {
    if (!activeSlide) return;
    const ids = new Set(activeSlide.layers.map((layer) => layer.id));
    if (enhancingLayerId && !ids.has(enhancingLayerId)) {
      setEnhancingLayerId(null);
    }
    if (uploadingLayerId && !ids.has(uploadingLayerId)) {
      setUploadingLayerId(null);
    }
  }, [activeSlide, enhancingLayerId, uploadingLayerId]);

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

const handleAddGeneratedImage = (imageData, meta = {}) => {
  if (!layout) return;
  // Always register in library first
  registerImageInLibrary(imageData, {
    origin: meta.origin || 'ai',
    label: meta.label || 'AI Image',
    prompt: meta.prompt,
  });
  // If shape is selected, fill it; otherwise add to canvas
  if (selectedLayer && selectedLayer.type === 'shape') {
    handleLayerChange({
      fillType: 'image',
      fillImageSrc: imageData.src,
    });
    return;
  }
  // Add to canvas as new image layer
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

  const handleLayerDragMove = (layer, e) => {
    let node = e.target;
    if (node.getType && node.getType() !== 'Group') {
      node = node.getParent();
    }
    if (!node) return;
    // Node position is now at center, convert to top-left
    const centerX = node.x();
    const centerY = node.y();
    const topLeftX = centerX - (layer.width * scale) / 2;
    const topLeftY = centerY - (layer.height * scale) / 2;
    setSelectionBounds({
      x: topLeftX,
      y: topLeftY,
      width: layer.width * scale,
      height: layer.height * scale,
    });
  };

  const handleLayerDragEnd = (layer, e) => {
    // Get the Group node (parent) if dragging a child element
    let node = e.target;
    if (node.getType && node.getType() !== 'Group') {
      node = node.getParent();
    }
    if (!node) return;
    
    // Node position is now at center, convert to top-left for storage
    const centerX = node.x() / scale;
    const centerY = node.y() / scale;
    let newX = centerX - layer.width / 2;
    let newY = centerY - layer.height / 2;
    
    // Clamp to canvas bounds
    const maxWidth = layout.width;
    const maxHeight = layout.height;
    newX = Math.max(0, Math.min(maxWidth - layer.width, newX));
    newY = Math.max(0, Math.min(maxHeight - layer.height, newY));
    
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
    // Position at center
    const newCenterX = (newX + layer.width / 2) * scale;
    const newCenterY = (newY + layer.height / 2) * scale;
    node.position({ x: newCenterX, y: newCenterY });
    setSelectionBounds({
      x: newX * scale,
      y: newY * scale,
      width: layer.width * scale,
      height: layer.height * scale,
    });
  };

  const handleLayerResize = (layerId, node) => {
    if (!node || !activeSlide) return;
    const layer = activeSlide.layers.find((l) => l.id === layerId);
    if (!layer) return;

    // CRITICAL: Use actual node dimensions, NOT bounding box
    // getClientRect() includes rotation, which inflates size for rotated elements
    // We must use node.width() and node.height() which return actual dimensions
    const rawWidth = node.width();
    const rawHeight = node.height();
    const scaleX = node.scaleX() || 1;
    const scaleY = node.scaleY() || 1;

    // Calculate actual size from node dimensions, not bounding box
    // This prevents rotated elements from appearing to grow
    const widthSource = rawWidth * scaleX;
    const heightSource = rawHeight * scaleY;

    const scaledWidth = Math.max(12, widthSource);
    const scaledHeight = Math.max(12, heightSource);

    // Reset scaling so future drags/resizes start from 1
    node.scaleX(1);
    node.scaleY(1);

    let newWidth = scaledWidth / scale;
    let newHeight = scaledHeight / scale;
    // Node position is at center, convert to top-left
    const centerX = node.x() / scale;
    const centerY = node.y() / scale;
    let newX = centerX - newWidth / 2;
    let newY = centerY - newHeight / 2;

    if (layer.type === 'shape' && layer.shape === 'circle') {
      const size = Math.max(newWidth, newHeight);
      newWidth = size;
      newHeight = size;
      // Recalculate position after size change
      newX = centerX - newWidth / 2;
      newY = centerY - newHeight / 2;
    }

    const maxWidth = layout.width;
    const maxHeight = layout.height;

    newWidth = Math.max(8, Math.min(maxWidth, newWidth));
    newHeight = Math.max(8, Math.min(maxHeight, newHeight));
    newX = Math.max(0, Math.min(maxWidth - newWidth, newX));
    newY = Math.max(0, Math.min(maxHeight - newHeight, newY));

    updateActiveSlide((slide) => {
      const updatedSlide = {
        ...slide,
        layers: slide.layers.map((l) =>
          l.id === layerId
            ? {
                ...l,
                width: newWidth,
                height: newHeight,
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
    
    // Reset node position to center
    const newCenterX = (newX + newWidth / 2) * scale;
    const newCenterY = (newY + newHeight / 2) * scale;
    node.position({ x: newCenterX, y: newCenterY });
    // Update offset for rotation center
    node.offsetX((newWidth * scale) / 2);
    node.offsetY((newHeight * scale) / 2);
    
    setSelectionBounds({
      x: newX * scale,
      y: newY * scale,
      width: newWidth * scale,
      height: newHeight * scale,
    });
  };

  const handleLayerRotate = (layerId, rotation) => {
    if (!activeSlide) return;
    const layer = activeSlide.layers.find((l) => l.id === layerId);
    if (!layer) return;

    // CRITICAL: Reset scale immediately to prevent accumulation
    // Rotation must never leave scale transforms behind
    const nodeRef = getLayerNodeRef(layerId);
    if (nodeRef?.current) {
      const node = nodeRef.current;
      // Explicitly reset scale to 1 - rotation should never affect scale
      node.scaleX(1);
      node.scaleY(1);
      node.getLayer()?.batchDraw();
    }

    updateActiveSlide((slide) => {
      const updatedSlide = {
        ...slide,
        layers: slide.layers.map((l) =>
          l.id === layerId
            ? {
                ...l,
                rotation: rotation, // CSS transform: rotate equivalent - no scale involved
              }
            : l,
        ),
      };
      const updatedSlides = slides.map((s) => (s.id === activeSlideId ? updatedSlide : s));
      saveToHistory(updatedSlides);
      return updatedSlide;
    });
  };

  const handleLayerClick = (layer, e) => {
    e.cancelBubble = true;
    setSelectedLayerId(layer.id);
  };

  const selectedLayer = useMemo(() => {
    if (!activeSlide) return null;
    return activeSlide.layers.find((layer) => layer.id === selectedLayerId) || null;
  }, [activeSlide, selectedLayerId]);
  const slideDuration = activeSlide?.animationDuration ?? DEFAULT_SLIDE_DURATION;
  useEffect(() => {
    setIsTimingPanelOpen(false);
  }, [activeSlideId]);

  useEffect(() => {
    if (!isTimingPanelOpen) return;
    const handleClickAway = (event) => {
      const buttonEl = timingButtonRef.current;
      const panelEl = timingPanelRef.current;
      if (
        buttonEl &&
        panelEl &&
        !buttonEl.contains(event.target) &&
        !panelEl.contains(event.target)
      ) {
        setIsTimingPanelOpen(false);
      }
    };
    document.addEventListener('pointerdown', handleClickAway, true);
    return () => document.removeEventListener('pointerdown', handleClickAway, true);
  }, [isTimingPanelOpen]);

  useEffect(() => {
    if (!previewDropdownOpen) return;
    const handleClickAway = (event) => {
      const buttonEl = previewButtonRef.current;
      const dropdownEl = previewDropdownRef.current;
      if (
        buttonEl &&
        dropdownEl &&        !buttonEl.contains(event.target) &&
        !dropdownEl.contains(event.target)
      ) {
        setPreviewDropdownOpen(false);
      }
    };
    document.addEventListener('pointerdown', handleClickAway, true);
    return () => document.removeEventListener('pointerdown', handleClickAway, true);
  }, [previewDropdownOpen]);

  const updateBoundsFromLayer = useCallback(
    (layer) => {
      if (!layer) {
        setSelectionBounds(null);
        return;
      }
      setSelectionBounds({
        x: layer.x * scale,
        y: layer.y * scale,
        width: layer.width * scale,
        height: layer.height * scale,
      });
    },
    [scale],
  );

  useEffect(() => {
    updateBoundsFromLayer(selectedLayer);
  }, [selectedLayer, updateBoundsFromLayer]);

  const updateLayerById = (layerId, updater) => {
    if (!layerId) return;
    updateActiveSlide((slide) => {
      const updatedSlide = {
        ...slide,
        layers: slide.layers.map((layer) => {
          if (layer.id !== layerId) return layer;
          const patch = typeof updater === 'function' ? updater(layer) : updater;
          if (!patch) return layer;
          return {
            ...layer,
            ...patch,
          };
        }),
      };
      const updatedSlides = slides.map((s) => (s.id === activeSlideId ? updatedSlide : s));
      saveToHistory(updatedSlides);
      return updatedSlide;
    });
  };

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

  const handleLayerEditButton = (layer) => {
    if (!layer) return;
    setSelectedLayerId(layer.id);
    setRightSidebarVisible(true);
    inspectorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleLayerEnhance = async (layer) => {
    if (!layer || enhancingLayerId === layer.id) return;
    if (layer.type === 'text') {
      if (!layer.text?.trim()) return;
      setEnhancingLayerId(layer.id);
      try {
        const enhanced = await enhancePresentationText({
          text: layer.text,
          isHeading: (layer.fontSize || 16) >= 32,
        });
        const framePatch = getAutoSizedTextFrame(layer, enhanced, layout) || {};
        updateLayerById(layer.id, {
          text: enhanced,
          ...framePatch,
        });
      } catch (error) {
        console.error('Failed to enhance text', error);
      } finally {
        setEnhancingLayerId(null);
      }
      return;
    }

    if (layer.type === 'image') {
      setEnhancingLayerId(layer.id);
      try {
        updateLayerById(layer.id, (currentLayer) => {
          const currentEffects = normalizeImageEffects(currentLayer.effects);
          const nextBrightness = Math.min(1, (currentEffects.brightness || 0) + 0.2);
          return {
            effects: {
              ...currentEffects,
              brightness: Number(nextBrightness.toFixed(2)),
            },
          };
        });
      } finally {
        setEnhancingLayerId(null);
      }
    }
  };

  const handleSlideTimingChange = (value) => {
    if (!activeSlide) return;
    const numeric = Number(value);
    const clamped = Number.isFinite(numeric)
      ? Math.max(1, Math.min(60, numeric))
      : DEFAULT_SLIDE_DURATION;

    updateActiveSlide((slide) => {
      const updatedSlide = {
        ...slide,
        animationDuration: clamped,
      };
      const updatedSlides = slides.map((s) => (s.id === activeSlideId ? updatedSlide : s));
      saveToHistory(updatedSlides);
      return updatedSlide;
    });
  };

  const handleApplyTimingToAllSlides = () => {
    if (!slides.length) return;
    const duration = activeSlide?.animationDuration ?? DEFAULT_SLIDE_DURATION;
    const clamped = Math.max(1, Math.min(60, duration));
    setSlides((prevSlides) => {
      const updatedSlides = prevSlides.map((slide) => ({
        ...slide,
        animationDuration: clamped,
      }));
      saveToHistory(updatedSlides);
      return updatedSlides;
    });
    setTimingToast('Timing applied to all slides');
    setTimeout(() => setTimingToast(null), 4000);
  };

  const openPreview = (mode) => {
    setPreviewMode(mode);
    setIsPreviewMode(true);
    setPreviewDropdownOpen(false);

    // Try to enter browser fullscreen for a true presentation feel
    if (typeof document !== 'undefined') {
      const root =
        document.fullscreenElement ||
        document.documentElement ||
        document.body;
      const requestFullscreen =
        root.requestFullscreen ||
        root.webkitRequestFullscreen ||
        root.mozRequestFullScreen ||
        root.msRequestFullscreen;
      try {
        requestFullscreen && requestFullscreen.call(root);
      } catch {
        // Ignore fullscreen errors (browser may block it)
      }
    }
  };

  const handleClosePreview = () => {
    setIsPreviewMode(false);
    if (typeof document !== 'undefined' && document.fullscreenElement) {
      try {
        document.exitFullscreen?.();
      } catch {
        // Ignore fullscreen errors
      }
    }
  };

  const handleLayerImageUpload = (layer) => {
    if (!layer || layer.type !== 'image') return;
    if (typeof window === 'undefined') return;

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.style.display = 'none';

    const cleanup = () => {
      input.remove();
    };

    input.onchange = (event) => {
      const file = event.target?.files?.[0];
      if (!file) {
        cleanup();
        return;
      }
      setUploadingLayerId(layer.id);
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        if (typeof result !== 'string') {
          setUploadingLayerId(null);
          cleanup();
          return;
        }
        const img = new window.Image();
        img.onload = () => {
          updateLayerById(layer.id, {
            src: result,
          });
          registerImageInLibrary(
            { src: result, width: img.width, height: img.height },
            { label: layer.name || 'Image', origin: 'upload' },
          );
          setUploadingLayerId(null);
          cleanup();
        };
        img.onerror = () => {
          setUploadingLayerId(null);
          cleanup();
        };
        img.src = result;
      };
      reader.onerror = () => {
        setUploadingLayerId(null);
        cleanup();
      };
      reader.readAsDataURL(file);
    };

    document.body.appendChild(input);
    input.click();
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
    if (enhancingLayerId === layerId) {
      setEnhancingLayerId(null);
    }
    if (uploadingLayerId === layerId) {
      setUploadingLayerId(null);
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
      animationDuration: DEFAULT_SLIDE_DURATION,
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

  const handleReorderSlides = (draggedId, targetId) => {
    if (draggedId === targetId) return;
    
    const draggedIndex = slides.findIndex(s => s.id === draggedId);
    const targetIndex = slides.findIndex(s => s.id === targetId);
    
    if (draggedIndex === -1 || targetIndex === -1) return;
    
    const newSlides = [...slides];
    const [removed] = newSlides.splice(draggedIndex, 1);
    newSlides.splice(targetIndex, 0, removed);
    
    setSlides(newSlides);
    saveToHistory(newSlides);
    
    // Keep the active slide ID the same (it will still be active after reordering)
    // No need to update activeSlideId as the slide object itself hasn't changed
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

            {timingToast && (
              <div
                style={{
                  position: 'fixed',
                  bottom: 28,
                  right: 28,
                  background: 'rgba(15, 23, 42, 0.92)',
                  color: '#fff',
                  padding: '10px 16px',
                  borderRadius: 12,
                  fontWeight: 600,
                  boxShadow: '0 18px 40px rgba(15, 23, 42, 0.35)',
                  zIndex: 1000,
                }}
              >
                {timingToast}
              </div>
            )}
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
          <div style={{ position: 'relative' }}>
            <button
              ref={previewButtonRef}
              onClick={() => setPreviewDropdownOpen((prev) => !prev)}
              style={{
                border: '1px solid rgba(15, 23, 42, 0.1)',
                background: 'rgba(15, 23, 42, 0.04)',
                borderRadius: 10,
                padding: '6px 14px',
                fontWeight: 600,
                fontSize: '0.85rem',
                color: '#0f172a',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              Preview
              <span style={{ fontSize: '0.7rem' }}>▾</span>
            </button>
            {previewDropdownOpen && (
              <div
                ref={previewDropdownRef}
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 'calc(100% + 6px)',
                  width: 240,
                  borderRadius: 14,
                  background: '#ffffff',
                  border: '1px solid rgba(15, 23, 42, 0.08)',
                  boxShadow: '0 18px 40px rgba(15, 23, 42, 0.18)',
                  padding: '8px 0',
                  zIndex: 50,
                }}
              >
                <button
                  onClick={() => openPreview('manual')}
                  style={{
                    width: '100%',
                    border: 'none',
                    background: 'transparent',
                    textAlign: 'left',
                    padding: '10px 16px',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ fontWeight: 600, color: '#0f172a' }}>Present fullscreen</div>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>
                    Use ← → keys to move through slides.
                  </p>
                </button>
                <div
                  style={{
                    height: 1,
                    background: 'rgba(15, 23, 42, 0.06)',
                    margin: '4px 0',
                  }}
                />
                <button
                  onClick={() => openPreview('autoplay')}
                  style={{
                    width: '100%',
                    border: 'none',
                    background: 'transparent',
                    textAlign: 'left',
                    padding: '10px 16px',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ fontWeight: 600, color: '#0f172a' }}>Auto play</div>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>
                    Plays fullscreen using slide timings.
                  </p>
                </button>
              </div>
            )}
          </div>
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
              const isDragging = draggedSlideId === slide.id;
              const isDragOver = dragOverSlideId === slide.id;
              
              return (
                <div
                  key={slide.id}
                  draggable
                  onDragStart={() => setDraggedSlideId(slide.id)}
                  onDragOver={(e) => {
                    e.preventDefault();
                    if (draggedSlideId && draggedSlideId !== slide.id) {
                      setDragOverSlideId(slide.id);
                    }
                  }}
                  onDragLeave={() => {
                    if (dragOverSlideId === slide.id) {
                      setDragOverSlideId(null);
                    }
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (draggedSlideId && draggedSlideId !== slide.id) {
                      handleReorderSlides(draggedSlideId, slide.id);
                    }
                    setDraggedSlideId(null);
                    setDragOverSlideId(null);
                  }}
                  onDragEnd={() => {
                    setDraggedSlideId(null);
                    setDragOverSlideId(null);
                  }}
                  style={{
                    borderRadius: 12,
                    padding: '8px',
                    background: isActive ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' : '#f8fafc',
                    color: isActive ? '#ffffff' : '#0f172a',
                    cursor: isDragging ? 'grabbing' : 'grab',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                    transition: 'transform 150ms ease, opacity 150ms ease',
                    opacity: isDragging ? 0.5 : 1,
                    transform: isDragOver ? 'translateY(4px)' : 'translateY(0)',
                    border: isDragOver ? '2px dashed rgba(79, 70, 229, 0.5)' : '2px solid transparent',
                    marginBottom: isDragOver ? '8px' : '0',
                  }}
                  onClick={() => setActiveSlideId(slide.id)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <GripVertical 
                        size={14} 
                        style={{ 
                          color: isActive ? 'rgba(255, 255, 255, 0.6)' : '#94a3b8',
                          cursor: 'grab',
                          flexShrink: 0,
                        }} 
                      />
                      <span style={{ fontWeight: 600, fontSize: '0.75rem' }}>Slide {index + 1}</span>
                    </div>
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
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '12px',
              justifyContent: 'space-between',
              flexShrink: 0,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1 1 240px' }}>
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

            <div style={{ position: 'relative', flex: '0 1 auto' }}>
              <button
                ref={timingButtonRef}
                onClick={() => setIsTimingPanelOpen((prev) => !prev)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 14px',
                  borderRadius: 14,
                  background: '#ffffff',
                  border: '1px solid rgba(148, 163, 184, 0.18)',
                  fontWeight: 600,
                  color: '#0f172a',
                  cursor: 'pointer',
                  boxShadow: isTimingPanelOpen ? '0 10px 25px rgba(15, 23, 42, 0.12)' : 'none',
                }}
              >
                <Timer size={16} color="#4f46e5" />
                <span>{slideDuration}s</span>
              </button>
              {isTimingPanelOpen && (
                <div
                  ref={timingPanelRef}
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 10px)',
                    right: 0,
                    width: 320,
                    borderRadius: 16,
                    background: '#ffffff',
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                    boxShadow: '0 18px 40px rgba(15, 23, 42, 0.2)',
                    padding: '14px 16px',
                    zIndex: 20,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, color: '#0f172a' }}>Slide animation timing</span>
                    <span style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 600 }}>
                      {slideDuration}s
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <input
                      type="range"
                      min={1}
                      max={60}
                      value={slideDuration}
                      onChange={(e) => handleSlideTimingChange(e.target.value)}
                      style={{ flex: 1 }}
                    />
                    <input
                      type="number"
                      min={1}
                      max={60}
                      value={slideDuration}
                      onChange={(e) => handleSlideTimingChange(e.target.value)}
                      style={{
                        width: 60,
                        borderRadius: 10,
                        border: '1px solid rgba(148, 163, 184, 0.5)',
                        padding: '6px 8px',
                        textAlign: 'center',
                      }}
                    />
                  </div>
                  <button
                    onClick={handleApplyTimingToAllSlides}
                    style={{
                      border: 'none',
                      borderRadius: 10,
                      padding: '8px 12px',
                      background: '#4f46e5',
                      color: '#fff',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Apply to all slides
                  </button>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b', lineHeight: 1.5 }}>
                    Determines how long this slide stays visible when animations auto-play.
                  </p>
                </div>
              )}
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
              ref={stageWrapperRef}
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
                {/* Background Layer */}
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
                
                {/* Elements Layer - All elements grouped together */}
                <Layer>
                  {activeSlide?.layers.map((layer) => {
                    const layerRef = getLayerNodeRef(layer.id);
                    if (!layer.visible) return null;

                    const scaledX = layer.x * scale;
                    const scaledY = layer.y * scale;
                    const scaledWidth = layer.width * scale;
                    const scaledHeight = layer.height * scale;

                    let renderedLayer = null;

                    if (layer.type === 'text') {
                      renderedLayer = (
                        <TextLayer
                          ref={layerRef}
                          layer={layer}
                          scaledX={scaledX}
                          scaledY={scaledY}
                          scaledWidth={scaledWidth}
                          scaledHeight={scaledHeight}
                          scale={scale}
                          onDragMove={(e) => handleLayerDragMove(layer, e)}
                          onDragEnd={(e) => handleLayerDragEnd(layer, e)}
                          onClick={(e) => handleLayerClick(layer, e)}
                        />
                      );
                    } else if (layer.type === 'image') {
                      renderedLayer = (
                        <ImageLayer
                          ref={layerRef}
                          layer={layer}
                          scaledX={scaledX}
                          scaledY={scaledY}
                          scaledWidth={scaledWidth}
                          scaledHeight={scaledHeight}
                          scale={scale}
                          onDragMove={(e) => handleLayerDragMove(layer, e)}
                          onDragEnd={(e) => handleLayerDragEnd(layer, e)}
                          onClick={(e) => handleLayerClick(layer, e)}
                        />
                      );
                    } else if (layer.type === 'shape') {
                      renderedLayer = (
                        <ShapeLayer
                          ref={layerRef}
                          layer={layer}
                          scaledX={scaledX}
                          scaledY={scaledY}
                          scaledWidth={scaledWidth}
                          scaledHeight={scaledHeight}
                          scale={scale}
                          onDragMove={(e) => handleLayerDragMove(layer, e)}
                          onDragEnd={(e) => handleLayerDragEnd(layer, e)}
                          onClick={(e) => handleLayerClick(layer, e)}
                        />
                      );
                    }

                    if (!renderedLayer) return null;

                    return (
                      <ElementGroup
                        key={layer.id}
                        effects={layer.effects}
                        scale={scale}
                      >
                        {renderedLayer}
                      </ElementGroup>
                    );
                  })}
                </Layer>
                
                {/* Selection/Transform Layer - For resize handles and rotate handle */}
                <Layer>
                  {activeSlide?.layers.map((layer) => {
                    if (!layer.visible) return null;
                    const isSelected = selectedLayerId === layer.id;
                    if (!isSelected) return null;
                    
                    const layerRef = getLayerNodeRef(layer.id);
                    const selectionVersion = `${layer.x}-${layer.y}-${layer.width}-${layer.height}-${layer.rotation}-${scale}`;
                    
                    return (
                      <React.Fragment key={`handles-${layer.id}`}>
                        <ResizeHandles
                          isVisible={isSelected}
                          targetRef={layerRef}
                          scale={scale}
                          expectedWidth={layer.width}
                          expectedHeight={layer.height}
                          onResize={(node) => handleLayerResize(layer.id, node)}
                          selectionKey={selectionVersion}
                        />
                        <RotateHandle
                          isVisible={isSelected}
                          targetRef={layerRef}
                          scale={scale}
                          layer={layer}
                          onRotate={(rotation) => handleLayerRotate(layer.id, rotation)}
                        />
                      </React.Fragment>
                    );
                  })}
                </Layer>
              </Stage>
              <LayerActionBar
                layer={selectedLayer}
                bounds={selectionBounds}
                onDuplicate={(layer) => handleDuplicateLayer(layer.id)}
                onEdit={handleLayerEditButton}
                onDelete={(layer) => handleRemoveLayer(layer.id)}
                onEnhance={handleLayerEnhance}
                onUpload={handleLayerImageUpload}
                enhancing={selectedLayer ? enhancingLayerId === selectedLayer.id : false}
                uploading={selectedLayer ? uploadingLayerId === selectedLayer.id : false}
              />
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
            onUpdateLayer={updateLayerById}
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

        <div ref={inspectorRef}>
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
                        onChange={(event) => {
                          const newText = event.target.value;
                          // Auto-resize text box when text changes
                          const framePatch = getAutoSizedTextFrame(selectedLayer, newText, layout) || {};
                          handleLayerChange({
                            text: newText,
                            ...framePatch,
                          });
                        }}
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
                    
                    <FontFamilySelector
                      value={selectedLayer.fontFamily}
                      onChange={(fontFamily) => {
                        handleLayerChange({ fontFamily });
                        // Recalculate size when font changes
                        const framePatch = getAutoSizedTextFrame(
                          { ...selectedLayer, fontFamily },
                          selectedLayer.text,
                          layout
                        ) || {};
                        if (framePatch.width || framePatch.height) {
                          handleLayerChange({ fontFamily, ...framePatch });
                        }
                      }}
                    />
                    
                    <div style={{ display: 'flex', gap: 12 }}>
                      <label style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#475569' }}>Font size</span>
                        <input
                          type="number"
                          min={8}
                          max={120}
                          value={selectedLayer.fontSize}
                          onChange={(event) => {
                            const newFontSize = Number(event.target.value);
                            handleLayerChange({ fontSize: newFontSize });
                            // Recalculate size when font size changes
                            const framePatch = getAutoSizedTextFrame(
                              { ...selectedLayer, fontSize: newFontSize },
                              selectedLayer.text,
                              layout
                            ) || {};
                            if (framePatch.width || framePatch.height) {
                              handleLayerChange({ fontSize: newFontSize, ...framePatch });
                            }
                          }}
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
                    
                    <FontStyleControls
                      fontWeight={selectedLayer.fontWeight}
                      fontStyle={selectedLayer.fontStyle}
                      textDecoration={selectedLayer.textDecoration}
                      onChange={(patch) => {
                        handleLayerChange(patch);
                        // Recalculate size when font style changes
                        const updatedLayer = { ...selectedLayer, ...patch };
                        const framePatch = getAutoSizedTextFrame(updatedLayer, selectedLayer.text, layout) || {};
                        if (framePatch.width || framePatch.height) {
                          handleLayerChange({ ...patch, ...framePatch });
                        }
                      }}
                    />
                    
                    <TextAlignControls
                      value={selectedLayer.textAlign || 'left'}
                      onChange={(textAlign) => handleLayerChange({ textAlign })}
                    />

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
        onClose={handleClosePreview}
        slides={slides}
        layout={layout}
        startSlideIndex={startSlideIndex}
        mode={previewMode}
        defaultDuration={DEFAULT_SLIDE_DURATION}
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

