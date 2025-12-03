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
  {
    id: 'subheading-layer',
    type: 'text',
    name: 'Subheading',
    content: 'Add supporting copy here',
    fontSize: 36,
    color: '#4b5563',
    fontWeight: 500,
    textAlign: 'center',
    opacity: 1,
    x: width / 2,
    y: height * 0.42,
  },
  {
    id: 'cta-layer',
    type: 'text',
    name: 'CTA',
    content: 'Call to action',
    fontSize: 32,
    color: '#ffffff',
    fontWeight: 600,
    textAlign: 'center',
    opacity: 1,
    x: width / 2,
    y: height * 0.65,
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
  const [selectedElementId, setSelectedElementId] = useState(
    () => getDefaultLayers(INITIAL_CANVAS.width, INITIAL_CANVAS.height)[0]?.id || null
  );
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [backgroundFile, setBackgroundFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [backgroundPreview, setBackgroundPreview] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState({ type: '', message: '' });
  const [generatedJSON, setGeneratedJSON] = useState(null);
  const [jsonUrl, setJsonUrl] = useState('');
  const imageUploadInputRef = useRef(null);
  const dragInfoRef = useRef({ id: null, startX: 0, startY: 0, elementX: 0, elementY: 0 });
  const previousElementsRef = useRef([]);

  const selectedElement = elements.find((el) => el.id === selectedElementId) || null;

  // Generate preview URL for files
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

  // Cleanup blob URLs when elements are removed/unmounted
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

  useEffect(
    () => () => {
      previousElementsRef.current.forEach(cleanupElementResources);
    },
    [cleanupElementResources]
  );

  const handleChange = (field) => (e) => {
    const value =
      e.target.type === 'number' || e.target.type === 'range'
        ? Number(e.target.value)
        : e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field) => (e) => {
    const file = e.target.files?.[0] || null;
    if (field === 'thumbnail') {
      setThumbnailFile(file);
    } else {
      setBackgroundFile(file);
    }
  };

  const handleElementChange = (id, updates) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, ...updates } : el))
    );
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
  };

  const handleImageFileAdded = (file) => {
    if (!file) return;
    const previewSrc = URL.createObjectURL(file);
    const id = createLayerId('image');
    const newElement = {
      id,
      type: 'image',
      name: file.name || `Image ${elements.filter((el) => el.type === 'image').length + 1}`,
      previewSrc,
      uploadedSrc: null,
      file,
      width: Math.min(formData.canvasWidth * 0.6, 600),
      height: Math.min(formData.canvasHeight * 0.6, 600),
      opacity: 1,
      x: formData.canvasWidth / 2,
      y: formData.canvasHeight / 2,
    };
    setElements((prev) => [...prev, newElement]);
    setSelectedElementId(id);
  };

  const triggerImageUpload = () => {
    imageUploadInputRef.current?.click();
  };

  const handleImageUploadInput = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageFileAdded(file);
      event.target.value = '';
    }
  };

  const handleReplaceImage = (id, file) => {
    if (!file) return;
    const previewSrc = URL.createObjectURL(file);
    setElements((prev) =>
      prev.map((el) => {
        if (el.id !== id) return el;
        cleanupElementResources(el);
        return {
          ...el,
          previewSrc,
          uploadedSrc: null,
          file,
        };
      })
    );
  };

  const handleRemoveElement = (id) => {
    const removed = elements.find((el) => el.id === id);
    if (removed) {
      cleanupElementResources(removed);
    }
    setElements((prev) => prev.filter((el) => el.id !== id));
    if (selectedElementId === id) {
      setSelectedElementId(elements.find((el) => el.id !== id)?.id || null);
    }
  };

  const handleCanvasClick = () => {
    setSelectedElementId(null);
  };

  // Drag handling
  const previewScale = useMemo(() => {
    const maxWidth = 420;
    const maxHeight = 420;
    const scaleX = maxWidth / formData.canvasWidth;
    const scaleY = maxHeight / formData.canvasHeight;
    return Math.min(scaleX, scaleY, 0.5);
  }, [formData.canvasWidth, formData.canvasHeight]);

  const scaledWidth = formData.canvasWidth * previewScale;
  const scaledHeight = formData.canvasHeight * previewScale;

  const handleDragging = useCallback(
    (event) => {
      const info = dragInfoRef.current;
      if (!info.id) return;
      const deltaX = (event.clientX - info.startX) / previewScale;
      const deltaY = (event.clientY - info.startY) / previewScale;
      setElements((prev) =>
        prev.map((el) => {
          if (el.id !== info.id) return el;
          const nextX = clamp(info.elementX + deltaX, 0, formData.canvasWidth);
          const nextY = clamp(info.elementY + deltaY, 0, formData.canvasHeight);
          return { ...el, x: nextX, y: nextY };
        })
      );
    },
    [formData.canvasWidth, formData.canvasHeight, previewScale]
  );

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
    dragInfoRef.current = {
      id,
      startX: event.clientX,
      startY: event.clientY,
      elementX: element.x,
      elementY: element.y,
    };
    setSelectedElementId(id);
    window.addEventListener('mousemove', handleDragging);
    window.addEventListener('mouseup', stopDragging);
  };

  useEffect(() => {
    return () => {
      window.removeEventListener('mousemove', handleDragging);
      window.removeEventListener('mouseup', stopDragging);
    };
  }, [handleDragging, stopDragging]);

  // Ensure elements stay within new bounds if canvas size changes
  useEffect(() => {
    setElements((prev) =>
      prev.map((el) => ({
        ...el,
        x: clamp(el.x, 0, formData.canvasWidth),
        y: clamp(el.y, 0, formData.canvasHeight),
        width: el.type === 'image' ? clamp(el.width || 0, 20, formData.canvasWidth) : el.width,
        height: el.type === 'image' ? clamp(el.height || 0, 20, formData.canvasHeight) : el.height,
      }))
    );
  }, [formData.canvasWidth, formData.canvasHeight]);

  const handleGenerateJSON = async () => {
    if (!formData.templateName.trim()) {
      setUploadStatus({ type: 'error', message: 'Template name is required' });
      return;
    }

    if (!thumbnailFile || !backgroundFile) {
      setUploadStatus({
        type: 'error',
        message: 'Both thumbnail and background image are required',
      });
      return;
    }

    if (!elements.length) {
      setUploadStatus({
        type: 'error',
        message: 'Add at least one layer to the canvas before generating a template.',
      });
      return;
    }

    setIsUploading(true);
    setUploadStatus({ type: 'info', message: 'Uploading assets to S3...' });

    try {
      const [thumbnailResult, backgroundResult] = await Promise.all([
        api.uploadTemplateThumbnail(thumbnailFile),
        api.uploadTemplateBackground(backgroundFile),
      ]);

      const uploadedImageMap = {};
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
        } else {
          let imageUrl = element.uploadedSrc;
          if (!imageUrl && element.file) {
            const uploadResult = await api.uploadTemplateBackground(element.file);
            imageUrl = uploadResult.url;
            uploadedImageMap[element.id] = imageUrl;
          }

          if (!imageUrl) {
            throw new Error(
              `Image layer "${element.name}" requires either a file upload or an image URL.`
            );
          }

          resolvedElements.push({
            type: 'image',
            name: element.name,
            src: imageUrl,
            x: element.x,
            y: element.y,
            width: element.width,
            height: element.height,
            opacity: element.opacity ?? 1,
            rotation: element.rotation || 0,
          });
        }
      }

      if (Object.keys(uploadedImageMap).length > 0) {
        setElements((prev) =>
          prev.map((el) =>
            uploadedImageMap[el.id] ? { ...el, uploadedSrc: uploadedImageMap[el.id] } : el
          )
        );
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

      setUploadStatus({ type: 'info', message: 'Uploading template JSON...' });
      const jsonResult = await api.uploadTemplateJSON(templateJSON);

      setGeneratedJSON(templateJSON);
      setJsonUrl(jsonResult.url);
      setUploadStatus({ type: 'success', message: 'Template uploaded successfully!' });
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus({
        type: 'error',
        message: error.message || 'Failed to upload template. Please try again.',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="temp-upload-page">
      <div className="temp-upload-wrapper">
        <div className="temp-upload-card">
          <h2 className="temp-upload-title">Template Creator</h2>
          <p className="temp-upload-subtitle">
            Drag layers, drop new assets, and upload polished templates to S3.
          </p>

          <div className="temp-upload-main-grid">
            <div className="temp-form-column">
              <div className="temp-section">
                <h3 className="temp-section-title">Basic Information</h3>
                <div className="temp-two-column">
                  <div className="temp-field">
                    <label className="temp-label">Template Name *</label>
                    <input
                      type="text"
                      value={formData.templateName}
                      onChange={handleChange('templateName')}
                      className="temp-input"
                      placeholder="Enter template name"
                    />
                  </div>
                  <div className="temp-field">
                    <label className="temp-label">Category *</label>
                    <select
                      value={formData.category}
                      onChange={handleChange('category')}
                      className="temp-select"
                    >
                      <option value="Instagram Post">Instagram Post</option>
                      <option value="Poster">Poster</option>
                      <option value="YouTube Thumbnail">YouTube Thumbnail</option>
                      <option value="Story">Story</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="temp-section">
                <h3 className="temp-section-title">Canvas Settings</h3>
                <div className="temp-three-column">
                  <div className="temp-field">
                    <label className="temp-label">Width (px)</label>
                    <input
                      type="number"
                      value={formData.canvasWidth}
                      onChange={handleChange('canvasWidth')}
                      min="100"
                      className="temp-input"
                    />
                  </div>
                  <div className="temp-field">
                    <label className="temp-label">Height (px)</label>
                    <input
                      type="number"
                      value={formData.canvasHeight}
                      onChange={handleChange('canvasHeight')}
                      min="100"
                      className="temp-input"
                    />
                  </div>
                  <div className="temp-field">
                    <label className="temp-label">Background Color</label>
                    <div className="temp-color-row">
                      <input
                        type="color"
                        value={formData.backgroundColor}
                        onChange={handleChange('backgroundColor')}
                        className="temp-color-swatch"
                      />
                      <input
                        type="text"
                        value={formData.backgroundColor}
                        onChange={handleChange('backgroundColor')}
                        className="temp-input"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="temp-section">
                <h3 className="temp-section-title">Upload Files</h3>
                <div className="temp-files-grid">
                  <div className="temp-field">
                    <label className="temp-label">Thumbnail Image *</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange('thumbnail')}
                      className="temp-input"
                    />
                    {thumbnailPreview && (
                      <img
                        src={thumbnailPreview}
                        alt="Thumbnail preview"
                        className="temp-file-preview"
                      />
                    )}
                  </div>
                  <div className="temp-field">
                    <label className="temp-label">Background Image *</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange('background')}
                      className="temp-input"
                    />
                    {backgroundPreview && (
                      <img
                        src={backgroundPreview}
                        alt="Background preview"
                        className="temp-file-preview"
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="temp-section">
                <div className="temp-section-header">
                  <h3 className="temp-section-title">Canvas Layers</h3>
                  <p className="temp-layer-hint">
                    Drag layers in the preview or select one below to fine-tune.
                  </p>
                </div>
                <div className="temp-layer-actions">
                  <button type="button" className="temp-layer-btn" onClick={handleAddTextElement}>
                    + Add Text Layer
                  </button>
                  <button type="button" className="temp-layer-btn" onClick={triggerImageUpload}>
                    + Add Image Layer
                  </button>
                  <input
                    ref={imageUploadInputRef}
                    type="file"
                    accept="image/*"
                    className="temp-layer-file-input"
                    onChange={handleImageUploadInput}
                  />
                </div>
                <div className="temp-layer-list">
                  {elements.map((element) => (
                    <button
                      type="button"
                      key={element.id}
                      className={`temp-layer-item ${
                        element.id === selectedElementId ? 'is-selected' : ''
                      }`}
                      onClick={() => setSelectedElementId(element.id)}
                    >
                      <div>
                        <p className="temp-layer-name">{element.name}</p>
                        <span className="temp-layer-type">
                          {element.type === 'text' ? 'Text' : 'Image'}
                        </span>
                      </div>
                      <span className="temp-layer-position">
                        {Math.round(element.x)}px / {Math.round(element.y)}px
                      </span>
                    </button>
                  ))}
                  {!elements.length && (
                    <p className="temp-layer-empty">No layers yet — add text or image layers above.</p>
                  )}
                </div>
              </div>

              {selectedElement && (
                <div className="temp-section">
                  <div className="temp-section-header">
                    <h3 className="temp-section-title">Layer Settings</h3>
                    <p className="temp-layer-hint">Editing: {selectedElement.name}</p>
                  </div>
                  <div className="temp-section-group">
                    <div className="temp-field-grid">
                      <div className="temp-field">
                        <label className="temp-label">X Position</label>
                        <input
                          type="number"
                          value={Math.round(selectedElement.x)}
                          onChange={(e) =>
                            handleElementChange(selectedElement.id, {
                              x: Number(e.target.value) || 0,
                            })
                          }
                          className="temp-input"
                        />
                      </div>
                      <div className="temp-field">
                        <label className="temp-label">Y Position</label>
                        <input
                          type="number"
                          value={Math.round(selectedElement.y)}
                          onChange={(e) =>
                            handleElementChange(selectedElement.id, {
                              y: Number(e.target.value) || 0,
                            })
                          }
                          className="temp-input"
                        />
                      </div>
                      <div className="temp-field">
                        <label className="temp-label">Opacity</label>
                        <input
                          type="range"
                          min="0.1"
                          max="1"
                          step="0.05"
                          value={selectedElement.opacity ?? 1}
                          onChange={(e) =>
                            handleElementChange(selectedElement.id, {
                              opacity: Number(e.target.value),
                            })
                          }
                          className="temp-slider"
                        />
                      </div>
                    </div>

                    {selectedElement.type === 'text' ? (
                      <>
                        <div className="temp-field">
                          <label className="temp-label">Text</label>
                          <input
                            type="text"
                            value={selectedElement.content}
                            onChange={(e) =>
                              handleElementChange(selectedElement.id, {
                                content: e.target.value,
                              })
                            }
                            className="temp-input"
                          />
                        </div>
                        <div className="temp-field-grid">
                          <div className="temp-field">
                            <label className="temp-label">Font Size</label>
                            <input
                              type="number"
                              min="8"
                              value={selectedElement.fontSize}
                              onChange={(e) =>
                                handleElementChange(selectedElement.id, {
                                  fontSize: Number(e.target.value) || 12,
                                })
                              }
                              className="temp-input"
                            />
                          </div>
                          <div className="temp-field">
                            <label className="temp-label">Color</label>
                            <input
                              type="color"
                              value={selectedElement.color}
                              onChange={(e) =>
                                handleElementChange(selectedElement.id, { color: e.target.value })
                              }
                              className="temp-color-swatch"
                            />
                          </div>
                          <div className="temp-field">
                            <label className="temp-label">Font Weight</label>
                            <select
                              value={selectedElement.fontWeight}
                              onChange={(e) =>
                                handleElementChange(selectedElement.id, {
                                  fontWeight: Number(e.target.value),
                                })
                              }
                              className="temp-select"
                            >
                              <option value={400}>Regular</option>
                              <option value={500}>Medium</option>
                              <option value={600}>Semi-bold</option>
                              <option value={700}>Bold</option>
                              <option value={800}>Extra-bold</option>
                            </select>
                          </div>
                          <div className="temp-field">
                            <label className="temp-label">Alignment</label>
                            <select
                              value={selectedElement.textAlign}
                              onChange={(e) =>
                                handleElementChange(selectedElement.id, {
                                  textAlign: e.target.value,
                                })
                              }
                              className="temp-select"
                            >
                              <option value="left">Left</option>
                              <option value="center">Center</option>
                              <option value="right">Right</option>
                            </select>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="temp-field-grid">
                          <div className="temp-field">
                            <label className="temp-label">Width (px)</label>
                            <input
                              type="number"
                              min="20"
                              value={Math.round(selectedElement.width || 0)}
                              onChange={(e) =>
                                handleElementChange(selectedElement.id, {
                                  width: clamp(Number(e.target.value) || 20, 20, formData.canvasWidth),
                                })
                              }
                              className="temp-input"
                            />
                          </div>
                          <div className="temp-field">
                            <label className="temp-label">Height (px)</label>
                            <input
                              type="number"
                              min="20"
                              value={Math.round(selectedElement.height || 0)}
                              onChange={(e) =>
                                handleElementChange(selectedElement.id, {
                                  height: clamp(
                                    Number(e.target.value) || 20,
                                    20,
                                    formData.canvasHeight
                                  ),
                                })
                              }
                              className="temp-input"
                            />
                          </div>
                        </div>
                        <div className="temp-field">
                          <label className="temp-label">Image URL (optional)</label>
                          <input
                            type="text"
                            value={selectedElement.uploadedSrc || ''}
                            onChange={(e) =>
                              handleElementChange(selectedElement.id, {
                                uploadedSrc: e.target.value,
                                previewSrc: e.target.value,
                                file: null,
                              })
                            }
                            className="temp-input"
                            placeholder="https://example.com/asset.png"
                          />
                        </div>
                        <div className="temp-layer-actions">
                          <label className="temp-layer-btn secondary">
                            Replace Image
                            <input
                              type="file"
                              accept="image/*"
                              className="temp-layer-file-input"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleReplaceImage(selectedElement.id, file);
                                  e.target.value = '';
                                }
                              }}
                            />
                          </label>
                          <button
                            type="button"
                            className="temp-layer-btn danger"
                            onClick={() => handleRemoveElement(selectedElement.id)}
                          >
                            Remove Layer
                          </button>
                        </div>
                      </>
                    )}

                    {selectedElement.type === 'text' && (
                      <button
                        type="button"
                        className="temp-layer-btn danger"
                        onClick={() => handleRemoveElement(selectedElement.id)}
                      >
                        Remove Layer
                      </button>
                    )}
                  </div>
                </div>
              )}

              <button
                onClick={handleGenerateJSON}
                disabled={isUploading}
                className="temp-primary-button"
              >
                {isUploading ? 'Uploading...' : 'Generate JSON & Upload to S3'}
              </button>

              {uploadStatus.message && (
                <div className={`temp-status temp-status-${uploadStatus.type || 'info'}`}>
                  {uploadStatus.message}
                </div>
              )}

              {jsonUrl && (
                <div className="temp-json-url">
                  <p className="temp-label">Template JSON uploaded:</p>
                  <a
                    href={jsonUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="temp-json-link"
                  >
                    {jsonUrl}
                  </a>
                </div>
              )}
            </div>

            <div className="temp-preview-column">
              <div className="temp-preview-card">
                <h3 className="temp-section-title">Live Preview</h3>
                <div className="temp-preview-frame">
                  <div
                    className="temp-preview-canvas"
                    style={{
                      width: `${scaledWidth}px`,
                      height: `${scaledHeight}px`,
                      backgroundColor: formData.backgroundColor,
                    }}
                    onClick={handleCanvasClick}
                  >
                    {backgroundPreview && (
                      <img
                        src={backgroundPreview}
                        alt="Background"
                        className="temp-preview-image"
                        style={{ zIndex: 1 }}
                      />
                    )}

                    {elements.map((element) => {
                      const leftPercent = (element.x / formData.canvasWidth) * 100;
                      const topPercent = (element.y / formData.canvasHeight) * 100;
                      const isSelected = element.id === selectedElementId;
                      const baseStyles = {
                        left: `${leftPercent}%`,
                        top: `${topPercent}%`,
                        opacity: element.opacity ?? 1,
                      };

                      if (element.type === 'text') {
                        return (
                          <div
                            key={element.id}
                            className={`temp-preview-item temp-preview-text ${
                              isSelected ? 'is-selected' : ''
                            }`}
                            style={baseStyles}
                            onMouseDown={(e) => handleDragStart(element.id, e)}
                          >
                            <span
                              style={{
                                fontSize: `${(element.fontSize || 16) * previewScale}px`,
                                color: element.color,
                                fontWeight: element.fontWeight,
                                textAlign: element.textAlign,
                              }}
                            >
                              {element.content || 'Text layer'}
                            </span>
                          </div>
                        );
                      }

                      const imageSource = element.previewSrc || element.uploadedSrc;
                      if (!imageSource) {
                        return null;
                      }
                      const widthPx = (element.width || 100) * previewScale;
                      const heightPx = (element.height || 100) * previewScale;
                      return (
                        <div
                          key={element.id}
                          className={`temp-preview-item temp-preview-image-layer ${
                            isSelected ? 'is-selected' : ''
                          }`}
                          style={{
                            ...baseStyles,
                            width: `${widthPx}px`,
                            height: `${heightPx}px`,
                            marginLeft: `-${widthPx / 2}px`,
                            marginTop: `-${heightPx / 2}px`,
                          }}
                          onMouseDown={(e) => handleDragStart(element.id, e)}
                        >
                          <img src={imageSource} alt={element.name} draggable={false} />
                        </div>
                      );
                    })}
                  </div>
                </div>
                <p className="temp-preview-scale">
                  Preview scale: {(previewScale * 100).toFixed(1)}%
                </p>

                {thumbnailPreview && (
                  <div className="temp-thumbnail-preview">
                    <h4>Thumbnail Preview</h4>
                    <img src={thumbnailPreview} alt="Thumbnail" />
                  </div>
                )}
              </div>

              {generatedJSON && (
                <div className="temp-json-preview">
                  <h4 className="temp-json-preview-title">Generated JSON</h4>
                  <pre className="temp-json-preview-body">
                    {JSON.stringify(generatedJSON, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TempUpload;

