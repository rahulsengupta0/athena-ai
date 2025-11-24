import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Stage, Layer, Group, Text, Rect, Circle, Line, Ellipse, Image as KonvaImage } from 'react-konva';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { getShapePoints } from '../utils/shapeUtils';

const PreviewModal = ({ isOpen, onClose, slides, layout, startSlideIndex = 0 }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(startSlideIndex);

  // Calculate preview scale to fit viewport
  const previewScale = useMemo(() => {
    if (!isOpen) return 1;
    const viewportWidth = window.innerWidth - 160; // Account for padding and controls
    const viewportHeight = window.innerHeight - 160;
    return Math.min(viewportWidth / layout.width, viewportHeight / layout.height, 1);
  }, [isOpen, layout]);

  const previewWidth = Math.round(layout.width * previewScale);
  const previewHeight = Math.round(layout.height * previewScale);

  const currentSlide = slides[currentSlideIndex] || slides[0];

  // Handle keyboard navigation
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

  const renderSlide = (slide) => {
    if (!slide) return null;

    return (
      <Stage width={previewWidth} height={previewHeight}>
        <Layer>
          {/* Background */}
          <Rect
            x={0}
            y={0}
            width={layout.width * previewScale}
            height={layout.height * previewScale}
            fill={slide.background || '#ffffff'}
          />
          
          {/* Layers */}
          {slide.layers.map((layer) => {
            if (!layer.visible) return null;

            const previewX = layer.x * previewScale;
            const previewY = layer.y * previewScale;
            const previewWidth_scaled = layer.width * previewScale;
            const previewHeight_scaled = layer.height * previewScale;

            if (layer.type === 'text') {
              return (
                <Group key={layer.id} x={previewX} y={previewY}>
                  <Text
                    x={0}
                    y={0}
                    width={previewWidth_scaled}
                    height={previewHeight_scaled}
                    text={layer.text}
                    fontSize={layer.fontSize * previewScale}
                    fontFamily={layer.fontFamily}
                    fontStyle={layer.fontStyle || 'normal'}
                    fontWeight={layer.fontWeight || 'normal'}
                    fill={layer.color}
                    align={layer.textAlign}
                    verticalAlign="middle"
                    padding={12 * previewScale}
                    wrap="word"
                  />
                </Group>
              );
            }

            if (layer.type === 'image') {
              const ImagePreview = ({ layer }) => {
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
                  img.src = layer.src;
                }, [layer.src]);

                return (
                  <Group key={layer.id} x={previewX} y={previewY}>
                    <KonvaImage
                      ref={imageRef}
                      x={0}
                      y={0}
                      width={previewWidth_scaled}
                      height={previewHeight_scaled}
                      image={null}
                      opacity={imageLoaded ? 1 : 0}
                    />
                    {!imageLoaded && (
                      <Rect
                        x={0}
                        y={0}
                        width={previewWidth_scaled}
                        height={previewHeight_scaled}
                        fill="#f1f5f9"
                        stroke="#cbd5e1"
                        strokeWidth={1}
                      />
                    )}
                  </Group>
                );
              };

              return <ImagePreview key={layer.id} layer={layer} />;
            }

            if (layer.type === 'shape') {
              const renderPreviewShape = () => {
                if (layer.shape === 'circle') {
                  const radius = Math.min(previewWidth_scaled, previewHeight_scaled) / 2;
                  return (
                    <Circle
                      x={radius}
                      y={radius}
                      radius={radius}
                      fill={layer.fillColor}
                    />
                  );
                } else if (layer.shape === 'ellipse') {
                  return (
                    <Ellipse
                      x={previewWidth_scaled / 2}
                      y={previewHeight_scaled / 2}
                      radiusX={previewWidth_scaled / 2}
                      radiusY={previewHeight_scaled / 2}
                      fill={layer.fillColor}
                    />
                  );
                } else if (layer.shape === 'rectangle') {
                  return (
                    <Rect
                      x={0}
                      y={0}
                      width={previewWidth_scaled}
                      height={previewHeight_scaled}
                      fill={layer.fillColor}
                      cornerRadius={layer.borderRadius * previewScale}
                    />
                  );
                } else {
                  const points = getShapePoints(layer.shape, previewWidth_scaled, previewHeight_scaled);
                  if (points.length === 0) return null;
                  return (
                    <Line
                      points={points}
                      closed
                      fill={layer.fillColor}
                      stroke={layer.fillColor}
                    />
                  );
                }
              };

              // Adjust position for circle (centered)
              const groupX = layer.shape === 'circle' 
                ? previewX + Math.min(previewWidth_scaled, previewHeight_scaled) / 2
                : previewX;
              const groupY = layer.shape === 'circle' 
                ? previewY + Math.min(previewWidth_scaled, previewHeight_scaled) / 2
                : previewY;

              return (
                <Group key={layer.id} x={groupX} y={groupY}>
                  {renderPreviewShape()}
                </Group>
              );
            }

            return null;
          })}
        </Layer>
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
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '40px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          position: 'relative',
          background: '#ffffff',
          borderRadius: '8px',
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
            padding: '40px',
            position: 'relative',
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

