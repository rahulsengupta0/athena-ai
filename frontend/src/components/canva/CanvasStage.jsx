import React from 'react';

const CanvasStage = ({
  styles,
  canvasAreaRef,
  contentWrapperRef,
  canvasRef,
  canvasSize,
  zoom,
  showGrid,
  pan,
  handleCanvasClick,
  handleDrawingMouseDown,
  handleCanvasMouseMove,
  handleCanvasMouseLeave,
  layers,
  hasChosenTemplate,
  templates,
  handleTemplateSelect,
  selectedLayer,
  selectedTool,
  handleLayerSelect,
  handleMouseDown,
  handleResizeMouseDown,
  handleTextContentChange,
  drawingSettings,
  currentPath,
  isMouseOverCanvas,
  mousePosition,
  scrollMetrics,
  SCROLLER_MARGIN,
  SCROLLER_THICKNESS,
  handleHTrackClick,
  handleHThumbMouseDown,
  handleVTrackClick,
  handleVThumbMouseDown,
  extraRightPadding = 0
}) => {
  return (
    <div style={{ ...styles.canvasArea, paddingRight: (styles.canvasArea?.padding || 20) + extraRightPadding }} className="custom-scrollbar canvas-scroll" ref={canvasAreaRef}>
      <div ref={contentWrapperRef}
        style={{
          width: canvasSize.width,
          height: canvasSize.height,
          position: 'relative'
        }}
      >
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
  );
};

export default CanvasStage;


