import React, { useState, useMemo, useEffect } from 'react';
import api from '../../services/api';
import './TempUpload.css';

const TempUpload = () => {
  const [formData, setFormData] = useState({
    templateName: '',
    category: 'Instagram Post',
    canvasWidth: 1080,
    canvasHeight: 1080,
    backgroundColor: '#ffffff',
    heading: '',
    headingFontSize: 48,
    headingColor: '#000000',
    headingX: 50,
    headingY: 100,
    subheading: '',
    subheadingFontSize: 32,
    subheadingColor: '#666666',
    subheadingX: 50,
    subheadingY: 200,
    cta: '',
    ctaFontSize: 24,
    ctaColor: '#ffffff',
    ctaX: 50,
    ctaY: 300,
  });

  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [backgroundFile, setBackgroundFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [backgroundPreview, setBackgroundPreview] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState({ type: '', message: '' });
  const [generatedJSON, setGeneratedJSON] = useState(null);
  const [jsonUrl, setJsonUrl] = useState('');

  // Generate preview URL for files
  useEffect(() => {
    if (thumbnailFile) {
      const url = URL.createObjectURL(thumbnailFile);
      setThumbnailPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setThumbnailPreview('');
    }
  }, [thumbnailFile]);

  useEffect(() => {
    if (backgroundFile) {
      const url = URL.createObjectURL(backgroundFile);
      setBackgroundPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setBackgroundPreview('');
    }
  }, [backgroundFile]);

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'number' || e.target.type === 'range' 
      ? Number(e.target.value) 
      : e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field) => (e) => {
    const file = e.target.files?.[0] || null;
    if (field === 'thumbnail') {
      setThumbnailFile(file);
    } else {
      setBackgroundFile(file);
    }
  };

  // Calculate preview scale to fit in preview container
  const previewScale = useMemo(() => {
    const maxWidth = 400;
    const maxHeight = 400;
    const scaleX = maxWidth / formData.canvasWidth;
    const scaleY = maxHeight / formData.canvasHeight;
    return Math.min(scaleX, scaleY, 0.3); // Limit to 30% max scale
  }, [formData.canvasWidth, formData.canvasHeight]);

  const scaledWidth = formData.canvasWidth * previewScale;
  const scaledHeight = formData.canvasHeight * previewScale;

  const handleGenerateJSON = async () => {
    if (!formData.templateName.trim()) {
      setUploadStatus({ type: 'error', message: 'Template name is required' });
      return;
    }

    if (!thumbnailFile || !backgroundFile) {
      setUploadStatus({ type: 'error', message: 'Both thumbnail and background image are required' });
      return;
    }

    setIsUploading(true);
    setUploadStatus({ type: 'info', message: 'Uploading files to S3...' });

    try {
      // Upload thumbnail
      const thumbnailResult = await api.uploadTemplateThumbnail(thumbnailFile);
      
      // Upload background image
      const backgroundResult = await api.uploadTemplateBackground(backgroundFile);

      // Generate template JSON structure
      const templateJSON = {
        id: `template_${Date.now()}`,
        name: formData.templateName,
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
            src: backgroundResult.url,
            x: 0,
            y: 0,
            width: formData.canvasWidth,
            height: formData.canvasHeight,
          },
          {
            type: 'text',
            content: formData.heading || '',
            x: formData.headingX,
            y: formData.headingY,
            fontSize: formData.headingFontSize,
            color: formData.headingColor,
          },
          {
            type: 'text',
            content: formData.subheading || '',
            x: formData.subheadingX,
            y: formData.subheadingY,
            fontSize: formData.subheadingFontSize,
            color: formData.subheadingColor,
          },
          {
            type: 'text',
            content: formData.cta || '',
            x: formData.ctaX,
            y: formData.ctaY,
            fontSize: formData.ctaFontSize,
            color: formData.ctaColor,
          },
        ],
      };

      // Upload JSON to S3
      setUploadStatus({ type: 'info', message: 'Uploading template JSON...' });
      const jsonResult = await api.uploadTemplateJSON(templateJSON);

      setGeneratedJSON(templateJSON);
      setJsonUrl(jsonResult.url);
      setUploadStatus({ type: 'success', message: 'Template uploaded successfully!' });

    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus({ 
        type: 'error', 
        message: error.message || 'Failed to upload template. Please try again.' 
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
          <p className="temp-upload-subtitle">Create and upload templates to S3</p>

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
                <h3 className="temp-section-title">Heading</h3>
                <div className="temp-section-group">
                  <div className="temp-field">
                    <label className="temp-label">Text</label>
                    <input
                      type="text"
                      value={formData.heading}
                      onChange={handleChange('heading')}
                      className="temp-input"
                      placeholder="Enter heading text"
                    />
                  </div>
                  <div className="temp-field-grid">
                    <div className="temp-field">
                      <label className="temp-label">Font Size</label>
                      <input
                        type="number"
                        value={formData.headingFontSize}
                        onChange={handleChange('headingFontSize')}
                        min="10"
                        className="temp-input"
                      />
                    </div>
                    <div className="temp-field">
                      <label className="temp-label">Color</label>
                      <input
                        type="color"
                        value={formData.headingColor}
                        onChange={handleChange('headingColor')}
                        className="temp-color-swatch"
                      />
                    </div>
                    <div className="temp-field">
                      <label className="temp-label">X Position</label>
                      <input
                        type="number"
                        value={formData.headingX}
                        onChange={handleChange('headingX')}
                        className="temp-input"
                      />
                    </div>
                    <div className="temp-field">
                      <label className="temp-label">Y Position</label>
                      <input
                        type="number"
                        value={formData.headingY}
                        onChange={handleChange('headingY')}
                        className="temp-input"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="temp-section">
                <h3 className="temp-section-title">Subheading</h3>
                <div className="temp-section-group">
                  <div className="temp-field">
                    <label className="temp-label">Text</label>
                    <input
                      type="text"
                      value={formData.subheading}
                      onChange={handleChange('subheading')}
                      className="temp-input"
                      placeholder="Enter subheading text"
                    />
                  </div>
                  <div className="temp-field-grid">
                    <div className="temp-field">
                      <label className="temp-label">Font Size</label>
                      <input
                        type="number"
                        value={formData.subheadingFontSize}
                        onChange={handleChange('subheadingFontSize')}
                        min="10"
                        className="temp-input"
                      />
                    </div>
                    <div className="temp-field">
                      <label className="temp-label">Color</label>
                      <input
                        type="color"
                        value={formData.subheadingColor}
                        onChange={handleChange('subheadingColor')}
                        className="temp-color-swatch"
                      />
                    </div>
                    <div className="temp-field">
                      <label className="temp-label">X Position</label>
                      <input
                        type="number"
                        value={formData.subheadingX}
                        onChange={handleChange('subheadingX')}
                        className="temp-input"
                      />
                    </div>
                    <div className="temp-field">
                      <label className="temp-label">Y Position</label>
                      <input
                        type="number"
                        value={formData.subheadingY}
                        onChange={handleChange('subheadingY')}
                        className="temp-input"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="temp-section">
                <h3 className="temp-section-title">CTA (Call to Action)</h3>
                <div className="temp-section-group">
                  <div className="temp-field">
                    <label className="temp-label">Text</label>
                    <input
                      type="text"
                      value={formData.cta}
                      onChange={handleChange('cta')}
                      className="temp-input"
                      placeholder="Enter CTA text"
                    />
                  </div>
                  <div className="temp-field-grid">
                    <div className="temp-field">
                      <label className="temp-label">Font Size</label>
                      <input
                        type="number"
                        value={formData.ctaFontSize}
                        onChange={handleChange('ctaFontSize')}
                        min="10"
                        className="temp-input"
                      />
                    </div>
                    <div className="temp-field">
                      <label className="temp-label">Color</label>
                      <input
                        type="color"
                        value={formData.ctaColor}
                        onChange={handleChange('ctaColor')}
                        className="temp-color-swatch"
                      />
                    </div>
                    <div className="temp-field">
                      <label className="temp-label">X Position</label>
                      <input
                        type="number"
                        value={formData.ctaX}
                        onChange={handleChange('ctaX')}
                        className="temp-input"
                      />
                    </div>
                    <div className="temp-field">
                      <label className="temp-label">Y Position</label>
                      <input
                        type="number"
                        value={formData.ctaY}
                        onChange={handleChange('ctaY')}
                        className="temp-input"
                      />
                    </div>
                  </div>
                </div>
              </div>

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
                  >
                    {backgroundPreview && (
                      <img
                        src={backgroundPreview}
                        alt="Background"
                        className="temp-preview-image"
                        style={{ zIndex: 1 }}
                      />
                    )}
                    {formData.heading && (
                      <div
                        className="temp-preview-text temp-preview-heading"
                        style={{
                          left: `${(formData.headingX / formData.canvasWidth) * 100}%`,
                          top: `${(formData.headingY / formData.canvasHeight) * 100}%`,
                          fontSize: `${formData.headingFontSize * previewScale}px`,
                          color: formData.headingColor,
                        }}
                      >
                        {formData.heading}
                      </div>
                    )}
                    {formData.subheading && (
                      <div
                        className="temp-preview-text temp-preview-subheading"
                        style={{
                          left: `${(formData.subheadingX / formData.canvasWidth) * 100}%`,
                          top: `${(formData.subheadingY / formData.canvasHeight) * 100}%`,
                          fontSize: `${formData.subheadingFontSize * previewScale}px`,
                          color: formData.subheadingColor,
                        }}
                      >
                        {formData.subheading}
                      </div>
                    )}
                    {formData.cta && (
                      <div
                        className="temp-preview-text temp-preview-cta"
                        style={{
                          left: `${(formData.ctaX / formData.canvasWidth) * 100}%`,
                          top: `${(formData.ctaY / formData.canvasHeight) * 100}%`,
                          fontSize: `${formData.ctaFontSize * previewScale}px`,
                          color: formData.ctaColor,
                        }}
                      >
                        {formData.cta}
                      </div>
                    )}
                  </div>
                </div>
                <p className="temp-preview-scale">
                  Preview scale: {(previewScale * 100).toFixed(1)}%
                </p>
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

