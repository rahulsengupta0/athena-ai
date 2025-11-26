import React, { useState } from 'react';
import { X, Download, Loader } from 'lucide-react';
import jsPDF from 'jspdf';
import Konva from 'konva';
import { getShapePoints } from '../utils/shapeUtils';
import { applyLayerEffectsToNode } from '../utils/effectUtils';

// Function to render a slide to an image
const renderSlideToImage = async (slide, layout, scale = 1) => {
  const width = layout.width * scale;
  const height = layout.height * scale;
  
  // Create a temporary container
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  document.body.appendChild(container);
  
  const stage = new Konva.Stage({
    container: container,
    width: width,
    height: height,
  });

  const backgroundLayer = new Konva.Layer();
  stage.add(backgroundLayer);

  // Background
  const bgRect = new Konva.Rect({
    x: 0,
    y: 0,
    width: layout.width * scale,
    height: layout.height * scale,
    fill: slide.background || '#ffffff',
  });
  backgroundLayer.add(bgRect);

  // Render layers - collect image promises
  const imagePromises = [];
  
  slide.layers.forEach((layerData) => {
    if (!layerData.visible) return;

    const x = layerData.x * scale;
    const y = layerData.y * scale;
    const w = layerData.width * scale;
    const h = layerData.height * scale;

    const elementLayer = new Konva.Layer();
    stage.add(elementLayer);

    const sceneCanvas = elementLayer.getCanvas();
    const sceneContext = sceneCanvas?.getContext();
    const nativeContext = sceneContext?._context || sceneContext?._context2d || sceneContext;
    if (nativeContext) {
      const blurAmount = (layerData.effects?.blur || 0) * scale;
      nativeContext.filter = blurAmount > 0 ? `blur(${blurAmount}px)` : 'none';
    }

    if (layerData.type === 'text') {
      const fontStyle = layerData.fontStyle === 'italic' ? 'italic ' : '';
      const fontWeight = layerData.fontWeight === 'bold' || layerData.fontWeight === '700' || layerData.fontWeight === 700 ? 'bold ' : '';
      const fontSize = layerData.fontSize * scale;
      const fontFamily = layerData.fontFamily || 'Poppins';
      const fontString = `${fontStyle}${fontWeight}${fontSize}px ${fontFamily}`;
      
      const text = new Konva.Text({
        x,
        y,
        width: w,
        height: h,
        text: layerData.text,
        fontSize: fontSize,
        fontFamily: fontFamily,
        font: fontString,
        fill: layerData.color,
        align: layerData.textAlign || 'left',
        verticalAlign: 'middle',
        padding: 12 * scale,
        wrap: 'word',
        textDecoration: layerData.textDecoration || 'none',
      });
      elementLayer.add(text);
      applyLayerEffectsToNode(text, layerData.effects, scale);
    } else if (layerData.type === 'image') {
      const imagePromise = new Promise((resolve) => {
        const img = new window.Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          const konvaImage = new Konva.Image({
            x,
            y,
            width: w,
            height: h,
            image: img,
          });
          elementLayer.add(konvaImage);
          applyLayerEffectsToNode(konvaImage, layerData.effects, scale);
          elementLayer.draw();
          resolve();
        };
        img.onerror = () => {
          resolve();
        };
        img.src = layerData.src;
      });
      imagePromises.push(imagePromise);
    } else if (layerData.type === 'shape') {
      let shape;

      if (layerData.shape === 'circle') {
        const radius = Math.min(w, h) / 2;
        const groupX = x + radius;
        const groupY = y + radius;
        shape = new Konva.Circle({
          x: radius,
          y: radius,
          radius,
          fill: layerData.fillColor,
        });
        const group = new Konva.Group({ x: groupX - radius, y: groupY - radius });
        applyLayerEffectsToNode(shape, layerData.effects, scale);
        group.add(shape);
        elementLayer.add(group);
      } else if (layerData.shape === 'ellipse') {
        shape = new Konva.Ellipse({
          x: w / 2,
          y: h / 2,
          radiusX: w / 2,
          radiusY: h / 2,
          fill: layerData.fillColor,
        });
        const group = new Konva.Group({ x, y });
        applyLayerEffectsToNode(shape, layerData.effects, scale);
        group.add(shape);
        elementLayer.add(group);
      } else if (layerData.shape === 'rectangle') {
        shape = new Konva.Rect({
          x: 0,
          y: 0,
          width: w,
          height: h,
          fill: layerData.fillColor,
          cornerRadius: layerData.borderRadius * scale,
        });
        const group = new Konva.Group({ x, y });
        applyLayerEffectsToNode(shape, layerData.effects, scale);
        group.add(shape);
        elementLayer.add(group);
      } else {
        const points = getShapePoints(layerData.shape, w, h);
        if (points.length > 0) {
          shape = new Konva.Line({
            points,
            closed: true,
            fill: layerData.fillColor,
            stroke: layerData.fillColor,
          });
          const group = new Konva.Group({ x, y });
          applyLayerEffectsToNode(shape, layerData.effects, scale);
          group.add(shape);
          elementLayer.add(group);
        }
      }
    }
  });

  // Wait for all images to load before exporting
  await Promise.all(imagePromises);

  // Export as image
  return new Promise((resolve) => {
    stage.toDataURL({
      pixelRatio: 2, // Higher quality
      callback: (dataUrl) => {
        resolve(dataUrl);
        stage.destroy();
        document.body.removeChild(container);
      },
    });
  });
};

const ShareModal = ({ isOpen, onClose, slides, layout }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadPDF = async () => {
    if (!slides || slides.length === 0) return;

    setIsGenerating(true);

    try {
      // Create PDF with slide dimensions
      const pdf = new jsPDF({
        orientation: layout.width > layout.height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [layout.width, layout.height],
      });

      // Process each slide
      for (let i = 0; i < slides.length; i++) {
        const slide = slides[i];
        
        // Render slide to image (using scale 1 for full quality)
        const imageData = await renderSlideToImage(slide, layout, 1);
        
        // Add page (except for first slide)
        if (i > 0) {
          pdf.addPage([layout.width, layout.height], layout.width > layout.height ? 'landscape' : 'portrait');
        }
        
        // Add image to PDF
        pdf.addImage(imageData, 'PNG', 0, 0, layout.width, layout.height);
      }

      // Save PDF
      const fileName = `presentation-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
      setIsGenerating(false);
      onClose();
    } catch (error) {
      console.error('Error generating PDF:', error);
      setIsGenerating(false);
      alert('Failed to generate PDF. Please try again.');
    }
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
        background: 'rgba(15, 23, 42, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
          width: '100%',
          maxWidth: '480px',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 24px',
            borderBottom: '1px solid rgba(15, 23, 42, 0.1)',
          }}
        >
          <h2 style={{ margin: 0, fontWeight: 700, fontSize: '1.25rem', color: '#0f172a' }}>
            Share Presentation
          </h2>
          <button
            onClick={onClose}
            style={{
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              color: '#64748b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4px',
              borderRadius: '8px',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(15, 23, 42, 0.06)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          <div style={{ marginBottom: '24px' }}>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.95rem', lineHeight: '1.6' }}>
              Download your presentation as a PDF file. The PDF will include all {slides.length} slide{slides.length !== 1 ? 's' : ''} with high-quality rendering.
            </p>
          </div>

          <div
            style={{
              background: 'rgba(79, 70, 229, 0.06)',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '24px',
              border: '1px solid rgba(79, 70, 229, 0.12)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'rgba(79, 70, 229, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#4f46e5',
                }}
              >
                <Download size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.95rem' }}>
                  PDF Export
                </div>
                <div style={{ color: '#64748b', fontSize: '0.85rem' }}>
                  {layout.width} × {layout.height}px • {slides.length} slide{slides.length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '12px',
            padding: '20px 24px',
            borderTop: '1px solid rgba(15, 23, 42, 0.1)',
            background: '#f8fafc',
          }}
        >
          <button
            onClick={onClose}
            disabled={isGenerating}
            style={{
              border: '1px solid rgba(15, 23, 42, 0.1)',
              background: '#ffffff',
              color: '#0f172a',
              padding: '10px 20px',
              borderRadius: '10px',
              fontWeight: 600,
              cursor: isGenerating ? 'not-allowed' : 'pointer',
              fontSize: '0.9rem',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleDownloadPDF}
            disabled={isGenerating}
            style={{
              border: 'none',
              background: isGenerating
                ? 'rgba(79, 70, 229, 0.5)'
                : 'linear-gradient(135deg, #4338ca 0%, #4f46ef 50%, #7c3aed 100%)',
              color: '#ffffff',
              padding: '10px 24px',
              borderRadius: '10px',
              fontWeight: 600,
              cursor: isGenerating ? 'not-allowed' : 'pointer',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: isGenerating ? 'none' : '0 4px 12px rgba(79, 70, 229, 0.3)',
            }}
          >
            {isGenerating ? (
              <>
                <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} />
                Generating PDF...
              </>
            ) : (
              <>
                <Download size={16} />
                Download PDF
              </>
            )}
          </button>
        </div>
      </div>

      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default ShareModal;

