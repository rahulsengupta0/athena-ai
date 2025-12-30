import React, { useState } from 'react';
import { X, Download, Loader, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import Konva from 'konva';
import PptxGenJS from 'pptxgenjs';
import { getShapePoints } from '../utils/shapeUtils';

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

  const layer = new Konva.Layer();
  stage.add(layer);

  // Background
  const bgRect = new Konva.Rect({
    x: 0,
    y: 0,
    width: layout.width * scale,
    height: layout.height * scale,
    fill: slide.background || '#ffffff',
  });
  layer.add(bgRect);

  // Render layers - collect image promises
  const imagePromises = [];
  
  slide.layers.forEach((layerData) => {
    if (!layerData.visible) return;

    const x = layerData.x * scale;
    const y = layerData.y * scale;
    const w = layerData.width * scale;
    const h = layerData.height * scale;

    if (layerData.type === 'text') {
      const text = new Konva.Text({
        x,
        y,
        width: w,
        height: h,
        text: layerData.text,
        fontSize: layerData.fontSize * scale,
        fontFamily: layerData.fontFamily,
        fontStyle: layerData.fontStyle || 'normal',
        fontWeight: layerData.fontWeight || 'normal',
        fill: layerData.color,
        align: layerData.textAlign,
        verticalAlign: 'middle',
        padding: 12 * scale,
        wrap: 'word',
      });
      layer.add(text);
    } else if (layerData.type === 'image') {
      // Load image and add to layer - return promise
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
          layer.add(konvaImage);
          layer.draw();
          resolve();
        };
        img.onerror = () => {
          // If image fails to load, still resolve to continue
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
        group.add(shape);
        layer.add(group);
      } else if (layerData.shape === 'ellipse') {
        shape = new Konva.Ellipse({
          x: w / 2,
          y: h / 2,
          radiusX: w / 2,
          radiusY: h / 2,
          fill: layerData.fillColor,
        });
        const group = new Konva.Group({ x, y });
        group.add(shape);
        layer.add(group);
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
        group.add(shape);
        layer.add(group);
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
          group.add(shape);
          layer.add(group);
        }
      }
    }
  });

  // Wait for all images to load before exporting
  await Promise.all(imagePromises);

  // Export as image - ensure we get PNG format
  return new Promise((resolve) => {
    stage.toDataURL({
      mimeType: 'image/png',
      pixelRatio: 2, // Higher quality
      callback: (dataUrl) => {
        resolve(dataUrl);
        stage.destroy();
        document.body.removeChild(container);
      },
    });
  });
};

// Standard PowerPoint aspect ratios
const PPTX_ASPECT_RATIOS = [
  {
    id: '16-9',
    name: '16:9 Widescreen',
    description: 'Standard widescreen format',
    width: 10,
    height: 5.625,
  },
  {
    id: '4-3',
    name: '4:3 Standard',
    description: 'Classic presentation format',
    width: 10,
    height: 7.5,
  },
  {
    id: '16-10',
    name: '16:10 Widescreen',
    description: 'Wide format for displays',
    width: 10,
    height: 6.25,
  },
  {
    id: 'original',
    name: 'Original Ratio',
    description: 'Keep original aspect ratio',
    width: null, // Will be calculated from layout
    height: null,
  },
];

const ShareModal = ({ isOpen, onClose, slides, layout }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [exportType, setExportType] = useState('pdf'); // 'pdf' or 'pptx'
  const [pptxAspectRatio, setPptxAspectRatio] = useState('16-9'); // Default to 16:9

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

  const handleDownloadPPTX = async () => {
    if (!slides || slides.length === 0) return;

    setIsGenerating(true);

    try {
      // Create a new PowerPoint presentation
      const pptx = new PptxGenJS();
      
      // Set presentation properties
      pptx.author = 'Athena AI';
      pptx.company = 'Athena AI';
      pptx.title = 'Presentation';
      pptx.subject = 'Exported Presentation';
      
      // Get selected aspect ratio or use original
      const selectedRatio = PPTX_ASPECT_RATIOS.find(r => r.id === pptxAspectRatio) || PPTX_ASPECT_RATIOS[0];
      
      let widthInches, heightInches;
      if (selectedRatio.id === 'original') {
        // Calculate from original layout, maintaining aspect ratio
        const isLandscape = layout.width > layout.height;
        const aspectRatio = layout.width / layout.height;
        if (isLandscape) {
          widthInches = 10;
          heightInches = 10 / aspectRatio;
        } else {
          heightInches = 7.5;
          widthInches = 7.5 * aspectRatio;
        }
      } else {
        // Use predefined aspect ratio
        widthInches = selectedRatio.width;
        heightInches = selectedRatio.height;
      }
      
      // Define custom layout
      pptx.defineLayout({ name: 'CUSTOM', width: widthInches, height: heightInches });
      pptx.layout = 'CUSTOM';

      // Helper function to convert data URL to base64
      const dataURLToBase64 = (dataURL) => {
        if (!dataURL) return null;
        if (dataURL.startsWith('data:image')) {
          const parts = dataURL.split(',');
          return parts.length > 1 ? parts[1] : null;
        }
        return dataURL;
      };

      // Process each slide
      for (let i = 0; i < slides.length; i++) {
        const slide = slides[i];
        
        // Render slide to image
        const imageDataURL = await renderSlideToImage(slide, layout, 2); // Higher scale for better quality
        
        if (!imageDataURL) {
          console.error(`Failed to render slide ${i + 1}`);
          continue;
        }
        
        // Add a new slide
        const slideObj = pptx.addSlide();
        
        // Convert data URL to base64 string
        const base64Data = dataURLToBase64(imageDataURL);
        
        if (!base64Data || base64Data.length === 0) {
          console.error(`Invalid image data for slide ${i + 1}`);
          // Add placeholder text
          slideObj.addText(`Slide ${i + 1} (Image Error)`, {
            x: 0.5,
            y: heightInches / 2 - 0.5,
            w: widthInches - 1,
            h: 1,
            fontSize: 24,
            align: 'center',
            valign: 'middle',
            color: '363636',
          });
          continue;
        }
        
        // Add image to slide (full slide background)
        // Try multiple methods to ensure compatibility
        try {
          // Method 1: Try using 'path' with data URL (most compatible)
          slideObj.addImage({
            path: imageDataURL,
            x: 0,
            y: 0,
            w: widthInches,
            h: heightInches,
          });
          console.log(`Successfully added image to slide ${i + 1} using path`);
        } catch (pathError) {
          console.warn(`Path method failed for slide ${i + 1}, trying data method:`, pathError);
          try {
            // Method 2: Try using 'data' with base64
            slideObj.addImage({
              data: base64Data,
              x: 0,
              y: 0,
              w: widthInches,
              h: heightInches,
            });
            console.log(`Successfully added image to slide ${i + 1} using data`);
          } catch (dataError) {
            console.error(`Both methods failed for slide ${i + 1}:`, dataError);
            // Add placeholder text if image fails
            slideObj.addText(`Slide ${i + 1} (Image Error)`, {
              x: 0.5,
              y: heightInches / 2 - 0.5,
              w: widthInches - 1,
              h: 1,
              fontSize: 20,
              align: 'center',
              valign: 'middle',
              color: '363636',
            });
          }
        }
      }

      // Save the presentation
      const fileName = `presentation-${new Date().toISOString().split('T')[0]}.pptx`;
      await pptx.writeFile({ fileName });
      
      setIsGenerating(false);
      onClose();
    } catch (error) {
      console.error('Error generating PPTX:', error);
      setIsGenerating(false);
      alert('Failed to generate PowerPoint file. Please try again.');
    }
  };

  const handleExport = async () => {
    if (exportType === 'pdf') {
      await handleDownloadPDF();
    } else if (exportType === 'pptx') {
      await handleDownloadPPTX();
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
              Download your presentation. Choose between PDF or PowerPoint format. The export will include all {slides.length} slide{slides.length !== 1 ? 's' : ''} with high-quality rendering.
            </p>
          </div>

          {/* Export Format Selection */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setExportType('pdf')}
                disabled={isGenerating}
                style={{
                  flex: 1,
                  padding: '16px',
                  borderRadius: '12px',
                  border: exportType === 'pdf' ? '2px solid #4f46e5' : '2px solid rgba(15, 23, 42, 0.1)',
                  background: exportType === 'pdf' ? 'rgba(79, 70, 229, 0.06)' : '#ffffff',
                  cursor: isGenerating ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                }}
                onMouseEnter={(e) => {
                  if (!isGenerating && exportType !== 'pdf') {
                    e.currentTarget.style.borderColor = 'rgba(79, 70, 229, 0.3)';
                    e.currentTarget.style.background = 'rgba(79, 70, 229, 0.03)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (exportType !== 'pdf') {
                    e.currentTarget.style.borderColor = 'rgba(15, 23, 42, 0.1)';
                    e.currentTarget.style.background = '#ffffff';
                  }
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: exportType === 'pdf' ? 'rgba(79, 70, 229, 0.12)' : 'rgba(15, 23, 42, 0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: exportType === 'pdf' ? '#4f46e5' : '#64748b',
                  }}
                >
                  <Download size={20} />
                </div>
                <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.9rem' }}>
                  PDF
                </div>
                <div style={{ color: '#64748b', fontSize: '0.75rem', textAlign: 'center' }}>
                  Portable Document Format
                </div>
              </button>

              <button
                onClick={() => setExportType('pptx')}
                disabled={isGenerating}
                style={{
                  flex: 1,
                  padding: '16px',
                  borderRadius: '12px',
                  border: exportType === 'pptx' ? '2px solid #4f46e5' : '2px solid rgba(15, 23, 42, 0.1)',
                  background: exportType === 'pptx' ? 'rgba(79, 70, 229, 0.06)' : '#ffffff',
                  cursor: isGenerating ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                }}
                onMouseEnter={(e) => {
                  if (!isGenerating && exportType !== 'pptx') {
                    e.currentTarget.style.borderColor = 'rgba(79, 70, 229, 0.3)';
                    e.currentTarget.style.background = 'rgba(79, 70, 229, 0.03)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (exportType !== 'pptx') {
                    e.currentTarget.style.borderColor = 'rgba(15, 23, 42, 0.1)';
                    e.currentTarget.style.background = '#ffffff';
                  }
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: exportType === 'pptx' ? 'rgba(79, 70, 229, 0.12)' : 'rgba(15, 23, 42, 0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: exportType === 'pptx' ? '#4f46e5' : '#64748b',
                  }}
                >
                  <FileText size={20} />
                </div>
                <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.9rem' }}>
                  PowerPoint
                </div>
                <div style={{ color: '#64748b', fontSize: '0.75rem', textAlign: 'center' }}>
                  .pptx Format
                </div>
              </button>
            </div>
          </div>

          {/* Aspect Ratio Selector (only for PPTX) */}
          {exportType === 'pptx' && (
            <div style={{ marginBottom: '20px' }}>
              <div style={{ marginBottom: '12px', fontWeight: 600, color: '#0f172a', fontSize: '0.9rem' }}>
                Slide Aspect Ratio
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                {PPTX_ASPECT_RATIOS.map((ratio) => (
                  <button
                    key={ratio.id}
                    onClick={() => setPptxAspectRatio(ratio.id)}
                    disabled={isGenerating}
                    style={{
                      padding: '12px',
                      borderRadius: '10px',
                      border: pptxAspectRatio === ratio.id ? '2px solid #4f46e5' : '2px solid rgba(15, 23, 42, 0.1)',
                      background: pptxAspectRatio === ratio.id ? 'rgba(79, 70, 229, 0.06)' : '#ffffff',
                      cursor: isGenerating ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s',
                      textAlign: 'left',
                    }}
                    onMouseEnter={(e) => {
                      if (!isGenerating && pptxAspectRatio !== ratio.id) {
                        e.currentTarget.style.borderColor = 'rgba(79, 70, 229, 0.3)';
                        e.currentTarget.style.background = 'rgba(79, 70, 229, 0.03)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (pptxAspectRatio !== ratio.id) {
                        e.currentTarget.style.borderColor = 'rgba(15, 23, 42, 0.1)';
                        e.currentTarget.style.background = '#ffffff';
                      }
                    }}
                  >
                    <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.85rem', marginBottom: '4px' }}>
                      {ratio.name}
                    </div>
                    <div style={{ color: '#64748b', fontSize: '0.75rem' }}>
                      {ratio.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Export Info */}
          <div
            style={{
              background: 'rgba(79, 70, 229, 0.06)',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '24px',
              border: '1px solid rgba(79, 70, 229, 0.12)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
                {exportType === 'pdf' ? <Download size={20} /> : <FileText size={20} />}
              </div>
              <div>
                <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.95rem' }}>
                  {exportType === 'pdf' ? 'PDF Export' : 'PowerPoint Export'}
                </div>
                <div style={{ color: '#64748b', fontSize: '0.85rem' }}>
                  {exportType === 'pptx' && pptxAspectRatio !== 'original' ? (
                    <>
                      {PPTX_ASPECT_RATIOS.find(r => r.id === pptxAspectRatio)?.name} • {slides.length} slide{slides.length !== 1 ? 's' : ''}
                    </>
                  ) : (
                    <>
                  {layout.width} × {layout.height}px • {slides.length} slide{slides.length !== 1 ? 's' : ''}
                    </>
                  )}
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
            onClick={handleExport}
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
                Generating {exportType === 'pdf' ? 'PDF' : 'PowerPoint'}...
              </>
            ) : (
              <>
                {exportType === 'pdf' ? <Download size={16} /> : <FileText size={16} />}
                Download {exportType === 'pdf' ? 'PDF' : 'PowerPoint'}
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

