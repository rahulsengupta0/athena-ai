import React, { useState } from 'react';
import { FiCopy, FiTrash2, FiType, FiImage as FiImageIcon, FiBarChart2, FiLayout } from 'react-icons/fi';
import { MdAutoAwesome, MdFormatPaint, MdTextFields, MdImage } from 'react-icons/md';

const EditorSection = ({ 
  generatedSlides, 
  selectedSlide, 
  handleEditSlide, 
  handleDuplicateSlide, 
  handleDeleteSlide, 
  handleAiRewrite, 
  handleAddImage, 
  handleAddChart,
  handleAddSlide,
  setSelectedSlide,
  presentationTheme
}) => {
  const [slideTemplates] = useState([
    { title: 'Title Slide', content: '', image: null, isTitleSlide: true },
    { title: 'Section Header', content: '', image: null, isHeader: true },
    { title: 'Content Slide', content: 'Key points:\n• Point 1\n• Point 2\n• Point 3', image: null },
    { title: 'Image Slide', content: '', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80' },
    { title: 'Quote Slide', content: '"Quote or testimonial goes here"\n\n- Author Name', image: null, isQuote: true },
  ]);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('Default');
  const [selectedLayout, setSelectedLayout] = useState('Title & Content');
  const [aiInput, setAiInput] = useState('');

  const currentTheme = presentationTheme || { backgroundColor: '#ffffff', textColor: '#000000', font: 'inherit' };

  return (
    <div className="presentation-studio-editor">
      {/* Slides Thumbnails */}
      <div className="presentation-studio-thumbnails">
        <div className="presentation-studio-thumbnails-header">
          <h3 className="presentation-studio-thumbnails-title">Slides</h3>
          <div className="presentation-studio-thumbnails-actions">
            <button
              onClick={() => handleAddSlide()}
              className="presentation-studio-thumbnails-button"
            >
              + Add Slide
            </button>
            <div 
              className="presentation-studio-templates-dropdown"
              onBlur={() => setIsTemplatesOpen(false)}
              tabIndex="0"
            >
              <button 
                onClick={() => setIsTemplatesOpen(!isTemplatesOpen)}
                className="presentation-studio-thumbnails-button"
                aria-haspopup="true"
                aria-expanded={isTemplatesOpen}
              >
                Templates
              </button>
              {isTemplatesOpen && (
                <div className="presentation-studio-templates-menu">
                  {slideTemplates.map((template, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        handleAddSlide(template);
                        setIsTemplatesOpen(false);
                      }}
                      className="presentation-studio-templates-item"
                    >
                      {template.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="presentation-studio-thumbnails-list">
          {generatedSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`presentation-studio-thumbnail ${selectedSlide === index ? 'presentation-studio-thumbnail-selected' : ''}`}
              onClick={() => setSelectedSlide(index)}
            >
              <div className="presentation-studio-thumbnail-content">
                <div className="presentation-studio-thumbnail-info">
                  <h4 className="presentation-studio-thumbnail-title">
                    {slide.title || `Slide ${index + 1}`}
                  </h4>
                  <p className="presentation-studio-thumbnail-description">
                    {(slide.content || '').substring(0, 50)}...
                  </p>
                </div>
                <div className="presentation-studio-thumbnail-actions">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDuplicateSlide(index);
                    }}
                    className="presentation-studio-thumbnail-action-button"
                  >
                    <FiCopy size={14} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSlide(index);
                    }}
                    className="presentation-studio-thumbnail-action-button presentation-studio-thumbnail-action-delete"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Slide Preview */}
      <div className="presentation-studio-preview-container">
        <div 
          className="presentation-studio-preview"
          style={{
            background: currentTheme.backgroundColor,
            color: currentTheme.textColor,
            fontFamily: currentTheme.font
          }}
        >
          <div className="presentation-studio-preview-header">
            <h3 className="presentation-studio-preview-title">
              Slide {selectedSlide + 1}: {generatedSlides[selectedSlide]?.title || 'Untitled'}
            </h3>
            <div className="presentation-studio-preview-actions">
              <button className="presentation-studio-preview-action-button">
                <MdFormatPaint size={18} />
              </button>
              <button className="presentation-studio-preview-action-button">
                <MdTextFields size={18} />
              </button>
              <button className="presentation-studio-preview-action-button">
                <MdImage size={18} />
              </button>
            </div>
          </div>
          
          <div className="presentation-studio-slide-preview">
            <input
              type="text"
              value={generatedSlides[selectedSlide]?.title || ''}
              onChange={(e) => handleEditSlide(selectedSlide, 'title', e.target.value)}
              className="presentation-studio-slide-title"
              placeholder="Slide Title"
              style={{
                background: currentTheme.backgroundColor,
                color: currentTheme.textColor,
                fontFamily: currentTheme.font
              }}
            />
            {generatedSlides[selectedSlide]?.type === "bullet" && (
              <div>
                {generatedSlides[selectedSlide].bullets.map((bullet, i) => (
                  <input
                    key={i}
                    value={bullet}
                    onChange={(e) =>
                      handleEditSlide(selectedSlide, "bullets", {
                        index: i,
                        value: e.target.value
                      })
                    }
                    className="presentation-studio-slide-bullet"
                    style={{
                      background: currentTheme.backgroundColor,
                      color: currentTheme.textColor,
                      fontFamily: currentTheme.font
                    }}
                  />
                ))}
              </div>
            )}

            
            {generatedSlides[selectedSlide]?.image ? (
              <div className="presentation-studio-slide-image-container">
                <img 
                  src={generatedSlides[selectedSlide].image} 
                  alt="Slide" 
                  className="presentation-studio-slide-image"
                />
              </div>
            ) : (
              <div className="presentation-studio-slide-placeholder">
                <span className="presentation-studio-slide-placeholder-text">No image</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Slide Actions */}
        <div className="presentation-studio-slide-actions">
          <div className="presentation-studio-slide-actions-container">
            <button 
              onClick={() => handleAiRewrite('persuasive')}
              className="presentation-studio-slide-action-button"
            >
              <MdAutoAwesome size={16} />
              <span>Make Persuasive</span>
            </button>
            <button 
              onClick={() => handleAiRewrite('simplify')}
              className="presentation-studio-slide-action-button"
            >
              <FiType size={16} />
              <span>Simplify</span>
            </button>
            <button 
              onClick={handleAddImage}
              className="presentation-studio-slide-action-button"
            >
              <FiImageIcon size={16} />
              <span>Add Image</span>
            </button>
            <button 
              onClick={handleAddChart}
              className="presentation-studio-slide-action-button"
            >
              <FiBarChart2 size={16} />
              <span>Add Chart</span>
            </button>
          </div>
        </div>
      </div>

      {/* AI Controls Panel */}
      <div className="presentation-studio-ai-panel">
        <h3 className="presentation-studio-ai-panel-title">AI Assistant</h3>
        <div className="presentation-studio-ai-panel-content">
          <div className="presentation-studio-ai-section">
            <label className="presentation-studio-ai-label">
              Quick Actions
            </label>
            <div className="presentation-studio-ai-actions">
              <button 
                onClick={() => handleAiRewrite('persuasive')}
                className="presentation-studio-ai-action-button"
              >
                Make it more persuasive
              </button>
              <button 
                onClick={() => handleAiRewrite('simplify')}
                className="presentation-studio-ai-action-button"
              >
                Summarize to bullet points
              </button>
              <button 
                onClick={handleAddImage}
                className="presentation-studio-ai-action-button"
              >
                Add visual elements
              </button>
              <button 
                onClick={() => handleAiRewrite('expand')}
                className="presentation-studio-ai-action-button"
              >
                Change tone to friendly
              </button>
            </div>
          </div>
          
          <div className="presentation-studio-ai-section">
            <label className="presentation-studio-ai-label">
              Ask AI
            </label>
            <div className="presentation-studio-ai-ask">
              <input
                type="text"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder="E.g., 'Add a conclusion slide'"
                className="presentation-studio-ai-input"
              />
              <button 
                className="presentation-studio-ai-send-button"
                onClick={() => {
                  if (aiInput.trim()) {
                    // Handle AI request
                    alert(`AI request sent: ${aiInput}`);
                    setAiInput('');
                  }
                }}
              >
                Send
              </button>
            </div>
          </div>
          
          <div className="presentation-studio-ai-section">
            <label className="presentation-studio-ai-label">
              Theme
            </label>
            <div className="presentation-studio-theme-grid">
              {['Default', 'Modern', 'Bold', 'Elegant', 'Creative', 'Minimal'].map((theme) => (
                <button
                  key={theme}
                  className={`presentation-studio-theme-button ${selectedTheme === theme ? 'presentation-studio-theme-button-selected' : ''}`}
                  onClick={() => setSelectedTheme(theme)}
                >
                  {theme}
                </button>
              ))}
            </div>
          </div>
          
          <div className="presentation-studio-ai-section">
            <label className="presentation-studio-ai-label">
              Layout Options
            </label>
            <div className="presentation-studio-layout-options">
              <button 
                className={`presentation-studio-layout-button ${selectedLayout === 'Title Only' ? 'presentation-studio-layout-button-selected' : ''}`}
                onClick={() => setSelectedLayout('Title Only')}
              >
                <FiLayout size={12} />
                <span>Title Only</span>
              </button>
              <button 
                className={`presentation-studio-layout-button ${selectedLayout === 'Title & Content' ? 'presentation-studio-layout-button-selected' : ''}`}
                onClick={() => setSelectedLayout('Title & Content')}
              >
                <FiLayout size={12} />
                <span>Title & Content</span>
              </button>
              <button 
                className={`presentation-studio-layout-button ${selectedLayout === 'Image Focus' ? 'presentation-studio-layout-button-selected' : ''}`}
                onClick={() => setSelectedLayout('Image Focus')}
              >
                <FiImageIcon size={12} />
                <span>Image Focus</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorSection;
