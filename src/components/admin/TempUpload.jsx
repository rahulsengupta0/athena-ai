import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import api from '../../services/api';
import './TempUpload.css';

const INITIAL_CANVAS = {
  width: 1080,
  height: 1080,
};

const createLayerId = (prefix = 'layer') =>
  `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

const getDefaultLayers = (width, height) => [
  {
    id: 'heading-layer',
    type: 'text',
    name: 'Heading',
    content: 'Add a bold headline',
    fontSize: 72,
    color: '#111827',
    fontWeight: 700,
    textAlign: 'center',
    opacity: 1,
    x: width / 2,
    y: height * 0.28,
  },
];

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const TempUpload = () => {
  const [formData, setFormData] = useState({
    templateName: '',
    category: 'Instagram Post',
    canvasWidth: INITIAL_CANVAS.width,
    canvasHeight: INITIAL_CANVAS.height,
    backgroundColor: '#ffffff',
  });

  const [elements, setElements] = useState(() =>
    getDefaultLayers(INITIAL_CANVAS.width, INITIAL_CANVAS.height)
  );
  const [selectedElementId, setSelectedElementId] = useState(null);

  // File Upload States
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [backgroundFile, setBackgroundFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [backgroundPreview, setBackgroundPreview] = useState('');

  // UI States
  const [activeTab, setActiveTab] = useState('settings'); // 'settings' | 'layers'
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState({ type: '', message: '' });
  const [generatedJSON, setGeneratedJSON] = useState(null);
  const [jsonUrl, setJsonUrl] = useState('');

  const imageUploadInputRef = useRef(null);
  const dragInfoRef = useRef({ id: null, startX: 0, startY: 0, elementX: 0, elementY: 0 });
  const previousElementsRef = useRef([]);

  const selectedElement = elements.find((el) => el.id === selectedElementId) || null;

  // --- Effects ---
  useEffect(() => {
    if (thumbnailFile) {
      const url = URL.createObjectURL(thumbnailFile);
      setThumbnailPreview(url);
      return () => URL.revokeObjectURL(url);
    }
    setThumbnailPreview('');
  }, [thumbnailFile]);

  useEffect(() => {
    if (backgroundFile) {
      const url = URL.createObjectURL(backgroundFile);
      setBackgroundPreview(url);
      return () => URL.revokeObjectURL(url);
    }
    setBackgroundPreview('');
  }, [backgroundFile]);

  const cleanupElementResources = useCallback((element) => {
    if (element?.type === 'image' && element.previewSrc && element.previewSrc.startsWith('blob:')) {
      URL.revokeObjectURL(element.previewSrc);
    }
  }, []);

  useEffect(() => {
    const prevElements = previousElementsRef.current;
    prevElements.forEach((prevElement) => {
      if (!elements.find((el) => el.id === prevElement.id)) {
        cleanupElementResources(prevElement);
      }
    });
    previousElementsRef.current = elements;
  }, [elements, cleanupElementResources]);

  // --- Handlers ---
  const handleChange = (field) => (e) => {
    const value = e.target.type === 'number' || e.target.type === 'range' ? Number(e.target.value) : e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field) => (e) => {
    const file = e.target.files?.[0] || null;
    if (field === 'thumbnail') setThumbnailFile(file);
    else setBackgroundFile(file);
  };

  const handleElementChange = (id, updates) => {
    setElements((prev) => prev.map((el) => (el.id === id ? { ...el, ...updates } : el)));
  };

  const handleAddTextElement = () => {
    const id = createLayerId('text');
    const newElement = {
      id,
      type: 'text',
      name: `Text ${elements.filter((el) => el.type === 'text').length + 1}`,
      content: 'New text',
      fontSize: 36,
      color: '#111827',
      fontWeight: 600,
      textAlign: 'center',
      opacity: 1,
      x: formData.canvasWidth / 2,
      y: formData.canvasHeight / 2,
    };
    setElements((prev) => [...prev, newElement]);
    setSelectedElementId(id);
    setActiveTab('layers');
  };

  const handleAddShape = (shapeType) => {
    const id = createLayerId('shape');
    const newElement = {
      id,
      type: 'shape',
      shapeType: shapeType,
      name: shapeType === 'circle' ? 'Circle' : 'Rectangle',
      width: 300,
      height: 300,
      color: '#3b82f6',
      opacity: 1,
      x: formData.canvasWidth / 2,
      y: formData.canvasHeight / 2,
    };
    setElements((prev) => [...prev, newElement]);
    setSelectedElementId(id);
    setActiveTab('layers');
  };

  const handleImageFileAdded = (file) => {
    if (!file) return;
    const previewSrc = URL.createObjectURL(file);
    const id = createLayerId('image');
    const newElement = {
      id,
      type: 'image',
      name: file.name || 'Image',
      previewSrc,
      uploadedSrc: null,
      file,
      width: 400,
      height: 400,
      opacity: 1,
      x: formData.canvasWidth / 2,
      y: formData.canvasHeight / 2,
    };
    setElements((prev) => [...prev, newElement]);
    setSelectedElementId(id);
    setActiveTab('layers');
  };

  const triggerImageUpload = () => imageUploadInputRef.current?.click();
  const handleImageUploadInput = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageFileAdded(file);
      e.target.value = '';
    }
  };

  const handleRemoveElement = (id) => {
    const removed = elements.find((el) => el.id === id);
    if (removed) cleanupElementResources(removed);
    setElements((prev) => prev.filter((el) => el.id !== id));
    if (selectedElementId === id) setSelectedElementId(null);
  };

  // --- Drag & Selection Logic ---
  const previewScale = useMemo(() => {
    const maxWidth = 500;
    const maxHeight = 500;
    const scaleX = maxWidth / formData.canvasWidth;
    const scaleY = maxHeight / formData.canvasHeight;
    return Math.min(scaleX, scaleY, 0.6);
  }, [formData.canvasWidth, formData.canvasHeight]);

  const scaledWidth = formData.canvasWidth * previewScale;
  const scaledHeight = formData.canvasHeight * previewScale;

  const handleDragging = useCallback((event) => {
    const info = dragInfoRef.current;
    if (!info.id) return;

    const deltaX = (event.clientX - info.startX) / previewScale;
    const deltaY = (event.clientY - info.startY) / previewScale;

    setElements((prev) => prev.map((el) => {
      if (el.id !== info.id) return el;
      return {
        ...el,
        x: clamp(info.elementX + deltaX, 0, formData.canvasWidth),
        y: clamp(info.elementY + deltaY, 0, formData.canvasHeight)
      };
    }));
  }, [formData.canvasWidth, formData.canvasHeight, previewScale]);

  const stopDragging = useCallback(() => {
    dragInfoRef.current = { id: null, startX: 0, startY: 0, elementX: 0, elementY: 0 };
    window.removeEventListener('mousemove', handleDragging);
    window.removeEventListener('mouseup', stopDragging);
  }, [handleDragging]);

  const handleDragStart = (id, event) => {
    event.preventDefault();
    event.stopPropagation();

    const element = elements.find((el) => el.id === id);
    if (!element) return;

    dragInfoRef.current = { id, startX: event.clientX, startY: event.clientY, elementX: element.x, elementY: element.y };
    setSelectedElementId(id);
    window.addEventListener('mousemove', handleDragging);
    window.addEventListener('mouseup', stopDragging);
  };

  const handleBackgroundClick = (e) => {
    if (e.target.classList.contains('temp-preview-canvas') || e.target.classList.contains('temp-preview-column')) {
        setSelectedElementId(null);
    }
  };

  // --- Generate JSON ---
  const handleGenerateJSON = async () => {
    if (!formData.templateName.trim() || !thumbnailFile || !backgroundFile) {
      setUploadStatus({ type: 'error', message: 'Name, Thumbnail, and Background are required.' });
      return;
    }

    setIsUploading(true);
    setUploadStatus({ type: 'info', message: 'Uploading assets...' });

    try {
      const [thumbnailResult, backgroundResult] = await Promise.all([
        api.uploadTemplateThumbnail(thumbnailFile),
        api.uploadTemplateBackground(backgroundFile),
      ]);

      const resolvedElements = [];

      for (const element of elements) {
        if (element.type === 'text') {
          resolvedElements.push({
            type: 'text',
            name: element.name,
            content: element.content,
            x: element.x,
            y: element.y,
            fontSize: element.fontSize,
            color: element.color,
            fontWeight: element.fontWeight,
            textAlign: element.textAlign,
            opacity: element.opacity ?? 1,
          });
        }
        else if (element.type === 'shape') {
          resolvedElements.push({
            type: 'shape',
            shapeType: element.shapeType,
            name: element.name,
            x: element.x,
            y: element.y,
            width: element.width,
            height: element.height,
            color: element.color,
            opacity: element.opacity ?? 1,
          });
        }
        else if (element.type === 'image') {
          let imageUrl = element.uploadedSrc;
          if (!imageUrl && element.file) {
            const uploadResult = await api.uploadTemplateBackground(element.file);
            imageUrl = uploadResult.url;
          }
          if (!imageUrl) continue;

          resolvedElements.push({
            type: 'image',
            name: element.name,
            src: imageUrl,
            x: element.x,
            y: element.y,
            width: element.width,
            height: element.height,
            opacity: element.opacity ?? 1,
          });
        }
      }

      const templateJSON = {
        id: `template_${Date.now()}`,
        name: formData.templateName.trim(),
        category: formData.category,
        thumbnail: thumbnailResult.url,
        canvas: {
          width: formData.canvasWidth,
          height: formData.canvasHeight,
          backgroundColor: formData.backgroundColor,
        },
        elements: [
          {
            type: 'image',
            name: 'Background',
            src: backgroundResult.url,
            x: 0,
            y: 0,
            width: formData.canvasWidth,
            height: formData.canvasHeight,
          },
          ...resolvedElements,
        ],
      };

      const jsonResult = await api.uploadTemplateJSON(templateJSON);
      setGeneratedJSON(templateJSON);
      setJsonUrl(jsonResult.url);
      setUploadStatus({ type: 'success', message: 'Template saved successfully!' });
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus({ type: 'error', message: 'Failed to upload template.' });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="temp-upload-page">
      <div className="temp-upload-wrapper">
        <div className="temp-upload-card">
          <h2 className="temp-upload-title">Template Studio</h2>

          <div style={{ display: 'flex', gap: '20px', minHeight: '600px', marginTop: '20px' }}>

            {/* 1. LEFT SIDEBAR */}
            <div style={{
              width: '320px',
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '15px',
              borderRight: '1px solid #eee',
              paddingRight: '15px'
            }}>
              <div className="temp-tabs" style={{
                display: 'flex',
                background: '#f1f5f9',
                padding: '4px',
                borderRadius: '8px',
                gap: '4px'
              }}>
                {['settings', 'layers'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`temp-tab-btn ${activeTab === tab ? 'active' : ''}`}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: '6px',
                      border: 'none',
                      background: activeTab === tab ? '#fff' : 'transparent',
                      color: activeTab === tab ? '#0f172a' : '#64748b',
                      boxShadow: activeTab === tab ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              <div className="temp-sidebar-content" style={{ overflowY: 'auto', flex: 1, paddingRight: '5px' }}>
                {activeTab === 'settings' && (
                  <div className="temp-form-column">
                    <div className="temp-section">
                      <label className="temp-label">Template Name</label>
                      <input type="text" value={formData.templateName} onChange={handleChange('templateName')} className="temp-input" placeholder="e.g. Summer Sale" />

                      <label className="temp-label" style={{marginTop: '10px'}}>Category</label>
                      <select value={formData.category} onChange={handleChange('category')} className="temp-select">
                        <option value="Instagram Post">Instagram Post</option>
                        <option value="Poster">Poster</option>
                        <option value="YouTube Thumbnail">YouTube Thumbnail</option>
                        <option value="Story">Story</option>
                      </select>
                    </div>

                    <div className="temp-section">
                      <label className="temp-label">Canvas (px)</label>
                      <div className="temp-two-column">
                        <input type="number" value={formData.canvasWidth} onChange={handleChange('canvasWidth')} className="temp-input" placeholder="W" />
                        <input type="number" value={formData.canvasHeight} onChange={handleChange('canvasHeight')} className="temp-input" placeholder="H" />
                      </div>
                      <div className="temp-color-row" style={{marginTop: '10px'}}>
                        <input type="color" value={formData.backgroundColor} onChange={handleChange('backgroundColor')} className="temp-color-swatch" />
                        <span style={{fontSize:'12px', color:'#666'}}>Background Color</span>
                      </div>
                    </div>

                    <div className="temp-section">
                      <label className="temp-label">Assets</label>
                      <div className="temp-field" style={{marginBottom:'10px'}}>
                        <span style={{fontSize:'12px'}}>Thumbnail:</span>
                        <input type="file" accept="image/*" onChange={handleFileChange('thumbnail')} className="temp-input" />
                      </div>
                      <div className="temp-field">
                        <span style={{fontSize:'12px'}}>Background:</span>
                        <input type="file" accept="image/*" onChange={handleFileChange('background')} className="temp-input" />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'layers' && (
                  <div>
                    <div className="temp-layer-actions-grid" style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '10px',
                      marginBottom: '20px'
                    }}>
                      <button className="temp-layer-btn" onClick={handleAddTextElement} style={actionBtnStyle}>
                        <span style={{fontSize:'18px'}}>T</span> Add Text
                      </button>
                      <button className="temp-layer-btn" onClick={triggerImageUpload} style={actionBtnStyle}>
                        <span style={{fontSize:'18px'}}>🖼️</span> Add Image
                      </button>
                      <button className="temp-layer-btn" onClick={() => handleAddShape('rectangle')} style={actionBtnStyle}>
                        <div style={{width:'16px', height:'16px', border:'2px solid currentColor'}}></div> Rect
                      </button>
                      <button className="temp-layer-btn" onClick={() => handleAddShape('circle')} style={actionBtnStyle}>
                        <div style={{width:'16px', height:'16px', border:'2px solid currentColor', borderRadius:'50%'}}></div> Circle
                      </button>

                      <input ref={imageUploadInputRef} type="file" accept="image/*" style={{display:'none'}} onChange={handleImageUploadInput} />
                    </div>

                    <div className="temp-layer-list">
                      <h4 style={{fontSize: '12px', fontWeight: '600', color: '#94a3b8', marginBottom: '10px', textTransform: 'uppercase'}}>Layers</h4>
                      {elements.slice().reverse().map((element) => (
                        <div
                          key={element.id}
                          className={`temp-layer-item ${element.id === selectedElementId ? 'is-selected' : ''}`}
                          onClick={() => setSelectedElementId(element.id)}
                          style={{
                            padding: '10px',
                            marginBottom: '6px',
                            background: element.id === selectedElementId ? '#eff6ff' : '#fff',
                            border: element.id === selectedElementId ? '1px solid #3b82f6' : '1px solid #e2e8f0',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}
                        >
                          <span style={{fontWeight: 500, fontSize:'14px'}}>{element.name}</span>
                          <span style={{fontSize: '10px', color: '#64748b', textTransform: 'capitalize', background:'#f1f5f9', padding:'2px 6px', borderRadius:'4px'}}>{element.type}</span>
                        </div>
                      ))}
                      {elements.length === 0 && <p className="temp-layer-empty">No layers added.</p>}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handleGenerateJSON}
                disabled={isUploading}
                className="temp-primary-button"
                style={{marginTop: '10px'}}
              >
                {isUploading ? 'Saving...' : 'Save Template'}
              </button>

              {uploadStatus.message && (
                <div className={`temp-status temp-status-${uploadStatus.type}`}>
                  {uploadStatus.message}
                </div>
              )}

              {/* --- RESTORED JSON URL LINK --- */}
              {jsonUrl && (
                <div style={{
                  marginTop: '15px',
                  padding: '10px',
                  background: '#f0f9ff',
                  border: '1px solid #bae6fd',
                  borderRadius: '6px',
                  fontSize: '12px',
                  wordBreak: 'break-all'
                }}>
                  <p style={{fontWeight: 600, color: '#0369a1', marginBottom: '4px', margin: 0}}>Template Saved</p>
                  <a href={jsonUrl} target="_blank" rel="noopener noreferrer" style={{color: '#0284c7', textDecoration:'underline'}}>
                    {jsonUrl}
                  </a>
                </div>
              )}
            </div>

            {/* 2. MIDDLE PREVIEW */}
            <div
              className="temp-preview-column"
              onClick={handleBackgroundClick}
              style={{
                flex: 1,
                minWidth: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f3f4f6',
                borderRadius: '8px',
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              <div
                className="temp-preview-canvas"
                style={{
                  width: `${scaledWidth}px`,
                  height: `${scaledHeight}px`,
                  backgroundColor: formData.backgroundColor,
                  position: 'relative',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  overflow: 'hidden'
                }}
              >
                {backgroundPreview && (
                  <img src={backgroundPreview} alt="Background" style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 0 }} />
                )}

                {elements.map((element) => {
                  const isSelected = element.id === selectedElementId;
                  const baseStyle = {
                    position: 'absolute',
                    left: `${(element.x / formData.canvasWidth) * 100}%`,
                    top: `${(element.y / formData.canvasHeight) * 100}%`,
                    opacity: element.opacity ?? 1,
                    transform: 'translate(-50%, -50%)',
                    cursor: 'move',
                    border: isSelected ? '2px solid #3b82f6' : 'none',
                    zIndex: 10,
                    userSelect: 'none'
                  };

                  if (element.type === 'text') {
                    return (
                      <div key={element.id} style={baseStyle} onMouseDown={(e) => handleDragStart(element.id, e)}>
                        <span style={{
                          fontSize: `${element.fontSize * previewScale}px`,
                          color: element.color,
                          fontWeight: element.fontWeight,
                          textAlign: element.textAlign,
                          whiteSpace: 'nowrap'
                        }}>
                          {element.content}
                        </span>
                      </div>
                    );
                  }

                  if (element.type === 'shape') {
                    return (
                      <div key={element.id} style={{
                        ...baseStyle,
                        width: `${element.width * previewScale}px`,
                        height: `${element.height * previewScale}px`,
                        backgroundColor: element.color,
                        borderRadius: element.shapeType === 'circle' ? '50%' : '0%'
                      }} onMouseDown={(e) => handleDragStart(element.id, e)} />
                    );
                  }

                  if (element.type === 'image') {
                    const src = element.previewSrc || element.uploadedSrc;
                    if(!src) return null;
                    return (
                      <div key={element.id} style={{
                        ...baseStyle,
                        width: `${element.width * previewScale}px`,
                        height: `${element.height * previewScale}px`,
                      }} onMouseDown={(e) => handleDragStart(element.id, e)}>
                        <img src={src} alt="el" style={{width:'100%', height:'100%', objectFit:'cover'}} draggable={false} />
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
              <p className="temp-preview-scale" style={{marginTop:'15px', color:'#666', fontSize:'12px'}}>
                Preview Scale: {(previewScale * 100).toFixed(0)}%
              </p>
            </div>

            {/* 3. RIGHT PROPERTIES PANEL */}
            {selectedElement && (
              <div style={{
                width: '260px',
                flexShrink: 0,
                borderLeft: '1px solid #eee',
                paddingLeft: '15px',
                background: 'white',
                borderRadius: '0 8px 8px 0'
              }}>
                <h3 className="temp-section-title">Edit Layer</h3>

                <div className="temp-section-group">
                  <label className="temp-label">Position</label>
                  <div className="temp-two-column">
                    <input type="number" value={Math.round(selectedElement.x)} onChange={(e) => handleElementChange(selectedElement.id, { x: Number(e.target.value) })} className="temp-input" placeholder="X" />
                    <input type="number" value={Math.round(selectedElement.y)} onChange={(e) => handleElementChange(selectedElement.id, { y: Number(e.target.value) })} className="temp-input" placeholder="Y" />
                  </div>

                  <label className="temp-label">Opacity</label>
                  <input type="range" min="0.1" max="1" step="0.1" value={selectedElement.opacity || 1} onChange={(e) => handleElementChange(selectedElement.id, { opacity: Number(e.target.value) })} className="temp-slider" />

                  {selectedElement.type === 'text' && (
                    <>
                      <label className="temp-label">Content</label>
                      <input
                        type="text"
                        value={selectedElement.content}
                        onChange={(e) => handleElementChange(selectedElement.id, { content: e.target.value })}
                        className="temp-input"
                        autoFocus
                      />
                      <label className="temp-label">Style</label>
                      <div className="temp-two-column">
                        <input type="number" value={selectedElement.fontSize} onChange={(e) => handleElementChange(selectedElement.id, { fontSize: Number(e.target.value) })} className="temp-input" />
                        <input type="color" value={selectedElement.color} onChange={(e) => handleElementChange(selectedElement.id, { color: e.target.value })} className="temp-color-swatch" />
                      </div>
                    </>
                  )}

                  {(selectedElement.type === 'shape' || selectedElement.type === 'image') && (
                    <>
                      <label className="temp-label">Dimensions</label>
                      <div className="temp-two-column">
                        <input type="number" value={selectedElement.width} onChange={(e) => handleElementChange(selectedElement.id, { width: Number(e.target.value) })} className="temp-input" />
                        <input type="number" value={selectedElement.height} onChange={(e) => handleElementChange(selectedElement.id, { height: Number(e.target.value) })} className="temp-input" />
                      </div>
                    </>
                  )}

                  {selectedElement.type === 'shape' && (
                    <>
                      <label className="temp-label">Color</label>
                      <input type="color" value={selectedElement.color} onChange={(e) => handleElementChange(selectedElement.id, { color: e.target.value })} className="temp-color-swatch" style={{width:'100%'}} />
                    </>
                  )}

                  <button
                    onClick={() => handleRemoveElement(selectedElement.id)}
                    className="temp-layer-btn danger"
                    style={{marginTop: '20px', width: '100%'}}
                  >
                    Delete Layer
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Inline Styles for Action Buttons
const actionBtnStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  padding: '12px',
  background: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '13px',
  fontWeight: '600',
  color: '#334155',
  transition: 'all 0.2s',
};

export default TempUpload;