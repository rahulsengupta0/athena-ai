import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Stage, Layer, Group, Text, Rect, Circle, Line, Ellipse, Image as KonvaImage } from 'react-konva';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { getShapePoints } from '../utils/shapeUtils';
import { applyLayerEffectsToNode } from '../utils/effectUtils';
import { getKonvaFontStyle } from '../utils/fontUtils';

const useKonvaEffects = (nodeRef, effects, scaleFactor = 1, dependencies = []) => {
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

const PreviewElementLayer = ({ layer, scale, children }) => {
  const layerRef = useRef(null);
  const blurValue = layer.effects?.blur || 0;
  useLayerBlur(layerRef, blurValue, scale);
  return <Layer ref={layerRef}>{children}</Layer>;
};

const PreviewTextLayer = ({ layer, x, y, width, height, scale }) => {
  const textRef = useRef(null);
  useKonvaEffects(textRef, layer.effects, scale);

  return (
    <Group x={x} y={y}>
      <Text
        ref={textRef}
        x={0}
        y={0}
        width={width}
        height={height}
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
};

const PreviewImageLayer = ({ layer, x, y, width, height, scale }) => {
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

  useKonvaEffects(imageRef, layer.effects, scale, [imageLoaded]);

  return (
    <Group x={x} y={y}>
      <KonvaImage
        ref={imageRef}
        x={0}
        y={0}
        width={width}
        height={height}
        image={null}
        opacity={imageLoaded ? 1 : 0}
      />
      {!imageLoaded && (
        <Rect x={0} y={0} width={width} height={height} fill="#f1f5f9" stroke="#cbd5e1" strokeWidth={1} />
      )}
    </Group>
  );
};

const PreviewShapeLayer = ({ layer, x, y, width, height, scale }) => {
  const shapeRef = useRef(null);
  useKonvaEffects(shapeRef, layer.effects, scale);

  const circleRadius = Math.min(width, height) / 2;
  const groupX = layer.shape === 'circle' ? x + circleRadius : x;
  const groupY = layer.shape === 'circle' ? y + circleRadius : y;

  const renderShape = () => {
    if (layer.shape === 'circle') {
      return <Circle ref={shapeRef} x={circleRadius} y={circleRadius} radius={circleRadius} fill={layer.fillColor} />;
    }

    if (layer.shape === 'ellipse') {
      return (
        <Ellipse
          ref={shapeRef}
          x={width / 2}
          y={height / 2}
          radiusX={width / 2}
          radiusY={height / 2}
          fill={layer.fillColor}
        />
      );
    }

    if (layer.shape === 'rectangle') {
      return (
        <Rect
          ref={shapeRef}
          x={0}
          y={0}
          width={width}
          height={height}
          fill={layer.fillColor}
          cornerRadius={layer.borderRadius * scale}
        />
      );
    }

    const points = getShapePoints(layer.shape, width, height);
    if (points.length === 0) return null;

    return <Line ref={shapeRef} points={points} closed fill={layer.fillColor} stroke={layer.fillColor} />;
  };

  return (
    <Group x={groupX} y={groupY}>
      {renderShape()}
    </Group>
  );
};

const PreviewModal = ({
  isOpen,
  onClose,
  slides,
  layout,
  startSlideIndex = 0,
  mode = 'manual',
  defaultDuration = 5,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(startSlideIndex);

  // Calculate preview scale to fit viewport
  const previewScale = useMemo(() => {
    if (!isOpen) return 1;
    const viewportWidth = window.innerWidth - 80; // Account for minimal padding and chrome
    const viewportHeight = window.innerHeight - 120;
    return Math.min(viewportWidth / layout.width, viewportHeight / layout.height, 1);
  }, [isOpen, layout]);

  const previewWidth = Math.round(layout.width * previewScale);
  const previewHeight = Math.round(layout.height * previewScale);

  const currentSlide = slides[currentSlideIndex] || slides[0];

  // Handle keyboard navigation (always enabled to allow manual override)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentSlideIndex, slides.length]);

  // Reset to start slide when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentSlideIndex(Math.min(startSlideIndex, slides.length - 1));
    }
  }, [isOpen, startSlideIndex, slides.length]);

  const handlePrevious = () => {
    setCurrentSlideIndex((prev) => (prev > 0 ? prev - 1 : slides.length - 1));
  };

  const handleNext = () => {
    setCurrentSlideIndex((prev) => (prev < slides.length - 1 ? prev + 1 : 0));
  };

  // Auto play logic
  useEffect(() => {
    if (!isOpen || mode !== 'autoplay' || slides.length === 0) return;
    const durationSeconds =
      slides[currentSlideIndex]?.animationDuration ?? defaultDuration;
    const timer = window.setTimeout(
      () => setCurrentSlideIndex((prev) => (prev < slides.length - 1 ? prev + 1 : 0)),
      Math.max(1, durationSeconds) * 1000,
    );
    return () => window.clearTimeout(timer);
  }, [isOpen, mode, currentSlideIndex, slides, defaultDuration]);

  const renderSlide = (slide) => {
    if (!slide) return null;

    return (
      <Stage width={previewWidth} height={previewHeight}>
        <Layer>
          <Rect
            x={0}
            y={0}
            width={layout.width * previewScale}
            height={layout.height * previewScale}
            fill={slide.background || '#ffffff'}
          />
        </Layer>
        {slide.layers.map((layer) => {
          if (!layer.visible) return null;

          const previewX = layer.x * previewScale;
          const previewY = layer.y * previewScale;
          const previewWidthScaled = layer.width * previewScale;
          const previewHeightScaled = layer.height * previewScale;

          let renderedLayer = null;

          if (layer.type === 'text') {
            renderedLayer = (
              <PreviewTextLayer
                layer={layer}
                x={previewX}
                y={previewY}
                width={previewWidthScaled}
                height={previewHeightScaled}
                scale={previewScale}
              />
            );
          } else if (layer.type === 'image') {
            renderedLayer = (
              <PreviewImageLayer
                layer={layer}
                x={previewX}
                y={previewY}
                width={previewWidthScaled}
                height={previewHeightScaled}
                scale={previewScale}
              />
            );
          } else if (layer.type === 'shape') {
            renderedLayer = (
              <PreviewShapeLayer
                layer={layer}
                x={previewX}
                y={previewY}
                width={previewWidthScaled}
                height={previewHeightScaled}
                scale={previewScale}
              />
            );
          }

          if (!renderedLayer) return null;

          return (
            <PreviewElementLayer key={layer.id} layer={layer} scale={previewScale}>
              {renderedLayer}
            </PreviewElementLayer>
          );
        })}
      </Stage>
    );
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(15, 23, 42, 0.95)',
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'stretch',
        zIndex: 9999,
        padding: '24px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          background: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with close button and slide counter */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: '1px solid rgba(15, 23, 42, 0.1)',
            background: '#ffffff',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.9rem' }}>
              Slide {currentSlideIndex + 1} of {slides.length}
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(15, 23, 42, 0.06)',
              border: 'none',
              borderRadius: '8px',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#475569',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(15, 23, 42, 0.12)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(15, 23, 42, 0.06)')}
            title="Close preview (ESC)"
          >
            <X size={18} />
          </button>
        </div>

        {/* Slide content */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px 40px',
            position: 'relative',
            flex: 1,
          }}
        >
          {/* Previous button */}
          {slides.length > 1 && (
            <button
              onClick={handlePrevious}
              style={{
                position: 'absolute',
                left: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(15, 23, 42, 0.8)',
                border: 'none',
                borderRadius: '50%',
                width: '48px',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#ffffff',
                zIndex: 10,
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(15, 23, 42, 1)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(15, 23, 42, 0.8)')}
              title="Previous slide (←)"
            >
              <ChevronLeft size={24} />
            </button>
          )}

          {/* Slide */}
          {renderSlide(currentSlide)}

          {/* Next button */}
          {slides.length > 1 && (
            <button
              onClick={handleNext}
              style={{
                position: 'absolute',
                right: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(15, 23, 42, 0.8)',
                border: 'none',
                borderRadius: '50%',
                width: '48px',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#ffffff',
                zIndex: 10,
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(15, 23, 42, 1)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(15, 23, 42, 0.8)')}
              title="Next slide (→)"
            >
              <ChevronRight size={24} />
            </button>
          )}
        </div>

        {/* Footer with navigation dots */}
        {slides.length > 1 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '16px 20px',
              borderTop: '1px solid rgba(15, 23, 42, 0.1)',
              background: '#f8fafc',
            }}
          >
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlideIndex(index)}
                style={{
                  width: index === currentSlideIndex ? '24px' : '8px',
                  height: '8px',
                  borderRadius: '4px',
                  border: 'none',
                  background: index === currentSlideIndex ? '#4f46e5' : 'rgba(15, 23, 42, 0.2)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                title={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewModal;

