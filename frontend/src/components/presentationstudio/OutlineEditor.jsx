import React, { useState } from 'react';
import { FiPlus, FiEdit2 } from 'react-icons/fi';
import { finalizePresentation } from '../../services/OutlineEditorService';
import './styles/OutlineEditor.css';

const OutlineEditor = ({ outlineData, onFinalize }) => {
  const [slides, setSlides] = useState(() => {
    // Initialize slides from outlineData
    if (!outlineData || !outlineData.slides) {
      return [];
    }
    return outlineData.slides.map((slide, index) => ({
      slideId: slide.slideId || `slide-${slide.slideNo || index + 1}`,
      slideNo: slide.slideNo || index + 1,
      source: slide.source || 'ai',
      title: slide.title || '',
      content: slide.content || { mode: 'raw', rawText: '' },
      layout: slide.layout || 'content',
      contentType: slide.contentType || 'paragraph'
    }));
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const handleTitleChange = (index, newTitle) => {
    const updated = [...slides];
    updated[index].title = newTitle;
    setSlides(updated);
  };

  const handleContentChange = (index, newContent) => {
    const updated = [...slides];
    updated[index].content = {
      mode: 'raw',
      rawText: newContent
    };
    setSlides(updated);
  };

  const handleAddSlide = () => {
    const newSlide = {
      slideId: `slide-${Date.now()}`,
      source: 'user',
      title: '',
      content: { mode: 'raw', rawText: '' }
    };
    setSlides([...slides, newSlide]);
  };

  const handleDeleteSlide = (index) => {
    if (slides.length <= 1) {
      alert('Cannot delete the last slide');
      return;
    }
    const updated = slides.filter((_, i) => i !== index);
    setSlides(updated);
  };

  const handleFinalize = async () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    setError(null);
    
    try {
      // Prepare the updated outline JSON
      const updatedOutline = {
        ...outlineData,
        slides: slides.map(slide => ({
          slideId: slide.slideId,
          slideNo: slide.slideNo,
          source: slide.source,
          title: slide.title,
          content: slide.content,
          layout: slide.layout,
          contentType: slide.contentType
        }))
      };

      // Call finalize API using service
      const finalPresentation = await finalizePresentation(updatedOutline);
      
      // Pass final presentation to parent
      onFinalize(finalPresentation);
    } catch (error) {
      console.error('Error finalizing presentation:', error);
      setError(error.message || 'Failed to finalize presentation. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const getContentText = (content) => {
    if (!content) return '';
    if (typeof content === 'string') return content;
    if (content.mode === 'raw') return content.rawText || '';
    if (content.mode === 'bullets' && Array.isArray(content.bullets)) {
      return content.bullets.map(bullet => `• ${bullet}`).join('\n');
    }
    if (content.mode === 'comparison') {
      const left = Array.isArray(content.left) ? content.left.map(item => `• ${item}`).join('\n') : '';
      const right = Array.isArray(content.right) ? content.right.map(item => `• ${item}`).join('\n') : '';
      return `Left:\n${left}\n\nRight:\n${right}`;
    }
    // Handle array content (bullets format from backend)
    if (Array.isArray(content)) {
      return content.map(item => `• ${item}`).join('\n');
    }
    return '';
  };

  return (
    <div className="outline-editor">
      <div className="outline-editor-container">
        <div className="outline-editor-header">
          <h2 className="outline-editor-title">Edit Outline</h2>
          <p className="outline-editor-subtitle">
            Review and edit your presentation outline. You can modify titles and content.
          </p>
        </div>

        <div className="outline-editor-content">
          <div className="outline-editor-slides">
            {slides.map((slide, index) => (
              <div key={slide.slideId || index} className="outline-editor-slide">
                <div className="outline-editor-slide-header">
                  <div className="outline-editor-slide-number">
                    Slide {index + 1}
                  </div>
                  {slide.source === 'user' && (
                    <span className="outline-editor-slide-badge">Custom</span>
                  )}
                  <button
                    onClick={() => handleDeleteSlide(index)}
                    className="outline-editor-slide-delete"
                    disabled={slides.length <= 1}
                  >
                    Delete
                  </button>
                </div>
                
                <div className="outline-editor-slide-body">
                  <div className="outline-editor-field">
                    <label className="outline-editor-label">Title</label>
                    <input
                      type="text"
                      value={slide.title}
                      onChange={(e) => handleTitleChange(index, e.target.value)}
                      className="outline-editor-input"
                      placeholder="Enter slide title"
                    />
                  </div>

                  <div className="outline-editor-field">
                    <label className="outline-editor-label">Content</label>
                    <textarea
                      value={getContentText(slide.content)}
                      onChange={(e) => handleContentChange(index, e.target.value)}
                      className="outline-editor-textarea"
                      placeholder="Enter slide content (bullets, paragraph, or raw text)"
                      rows={4}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="outline-editor-actions">
            <button
              onClick={handleAddSlide}
              className="outline-editor-add-button"
            >
              <FiPlus size={18} />
              Add Slide
            </button>
          </div>

          <div className="outline-editor-finalize">
            {error && (
              <div style={{ 
                marginBottom: '1rem', 
                padding: '1rem', 
                background: '#fee2e2', 
                border: '1px solid #fecaca', 
                borderRadius: '8px',
                color: '#991b1b'
              }}>
                <strong>Error:</strong> {error}
              </div>
            )}
            <button
              onClick={handleFinalize}
              disabled={isGenerating || slides.length === 0}
              className={`outline-editor-finalize-button ${isGenerating || slides.length === 0 ? 'outline-editor-finalize-button-disabled' : ''}`}
            >
              {isGenerating ? 'Generating Final Presentation...' : 'Generate Final Presentation'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutlineEditor;

