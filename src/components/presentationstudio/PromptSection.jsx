import React from 'react';
import { FiSettings, FiRefreshCw } from 'react-icons/fi';
import { MdAutoAwesome } from 'react-icons/md';

const PromptSection = ({ 
  prompt, 
  setPrompt, 
  tone, 
  setTone, 
  length, 
  setLength, 
  mediaStyle, 
  setMediaStyle, 
  useBrandStyle, 
  setUseBrandStyle, 
  showAdvanced, 
  setShowAdvanced, 
  outlineText, 
  setOutlineText, 
  handleGenerate, 
  isGenerating, 
  generationStep 
}) => {
  const tones = ['Professional', 'Friendly', 'Minimal', 'Corporate', 'Creative'];
  const lengths = ['5', '10', '15', '20'];
  const mediaStyles = ['AI Graphics', 'Stock Images', 'None'];

  return (
    <div className="presentation-studio-creation-hub">
      <div className="presentation-studio-creation-container">
        <div className="presentation-studio-creation-header">
          <h2 className="presentation-studio-creation-title">Create Your Presentation</h2>
          <p className="presentation-studio-creation-subtitle">
            Describe what you need and let AI generate a beautiful presentation for you
          </p>
        </div>

        <div className="presentation-studio-form">
          {/* Prompt Input */}
          <div className="presentation-studio-form-group">
            <label className="presentation-studio-label">
              Presentation Topic
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="E.g., 'Annual Marketing Strategy for 2024' or 'Introduction to Machine Learning'"
              className="presentation-studio-textarea"
            />
          </div>

          {/* Options Grid (Cards Instead of Dropdowns) */}
          <div className="presentation-studio-card-options">
            {/* Tone Cards */}
            <div className="presentation-studio-form-group">
              <label className="presentation-studio-label">Tone</label>
              <div className="presentation-studio-card-grid">
                {tones.map(t => (
                  <div
                    key={t}
                    className={`presentation-studio-card-option ${tone === t ? "selected" : ""}`}
                    onClick={() => setTone(t)}
                    data-tone={t}
                  >
                    {t !== 'Professional' && t !== 'Friendly' && t !== 'Minimal' && t !== 'Corporate' && (
                      <img 
                        src={`/assets/tone/${t.toLowerCase()}.png`} 
                        alt={t} 
                        className="presentation-studio-card-image"
                      />
                    )}
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Length Cards */}
            <div className="presentation-studio-form-group">
              <label className="presentation-studio-label">Length</label>
              <div className="presentation-studio-card-grid">
                {lengths.map(l => (
                  <div
                    key={l}
                    className={`presentation-studio-card-option ${length === l ? "selected" : ""}`}
                    onClick={() => setLength(l)}
                    data-length={l}
                  >
                    <span>{l} slides</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Media Style Cards */}
            <div className="presentation-studio-form-group">
              <label className="presentation-studio-label">Media Style</label>
              <div className="presentation-studio-card-grid">
                {mediaStyles.map(s => (
                  <div
                    key={s}
                    className={`presentation-studio-card-option ${mediaStyle === s ? "selected" : ""} ${s === 'AI Graphics' ? 'ai-graphics-card' : ''} ${s === 'Stock Images' ? 'stock-images-card' : ''} ${s === 'None' ? 'none-card' : ''}`}
                    onClick={() => setMediaStyle(s)}
                    {...(s === 'AI Graphics' ? { 'data-media': 'ai-graphics' } : {})}
                    {...(s === 'Stock Images' ? { 'data-media': 'stock-images' } : {})}
                    {...(s === 'None' ? { 'data-media': 'none' } : {})}
                  >
                    {s !== 'AI Graphics' && s !== 'Stock Images' && s !== 'None' && (
                      <img 
                        src={`/assets/media/${s.toLowerCase().replace(" ", "-")}.png`} 
                        alt={s} 
                        className="presentation-studio-card-image"
                      />
                    )}
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Brand Style Checkbox */}
            <div className="presentation-studio-checkbox-group" style={{ marginTop: "1rem" }}>
              <input
                type="checkbox"
                id="brandStyle"
                checked={useBrandStyle}
                onChange={(e) => setUseBrandStyle(e.target.checked)}
                className="presentation-studio-checkbox"
              />
              <label htmlFor="brandStyle" className="presentation-studio-checkbox-label">
                Use Brand Style
              </label>
            </div>
          </div>

          {/* Advanced Options */}
          <div className="presentation-studio-advanced-options">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="presentation-studio-advanced-toggle"
            >
              <span>{showAdvanced ? 'Hide' : 'Show'} Advanced Options</span>
              <FiSettings className={`presentation-studio-advanced-icon ${showAdvanced ? 'presentation-studio-advanced-icon-open' : ''}`} />
            </button>

            {showAdvanced && (
              <div className="presentation-studio-advanced-content">
                <div className="presentation-studio-form-group">
                  <label className="presentation-studio-label">
                    Outline (Optional)
                  </label>
                  <textarea
                    value={outlineText}
                    onChange={(e) => setOutlineText(e.target.value)}
                    placeholder="Provide a structured outline for your presentation..."
                    className="presentation-studio-textarea presentation-studio-textarea-small"
                  />
                </div>
                <div className="presentation-studio-form-group">
                  <label className="presentation-studio-label">
                    Reference Document
                  </label>
                  <div className="presentation-studio-file-upload">
                    <label className="presentation-studio-file-upload-label">
                      <div className="presentation-studio-file-upload-content">
                        <svg className="presentation-studio-file-upload-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                        </svg>
                        <p className="presentation-studio-file-upload-text">
                          <span className="presentation-studio-file-upload-bold">Click to upload</span> or drag and drop
                        </p>
                        <p className="presentation-studio-file-upload-subtext">
                          PDF, DOC, DOCX (MAX. 10MB)
                        </p>
                      </div>
                      <input 
                        type="file" 
                        className="presentation-studio-file-input" 
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            // Handle file upload
                            alert(`File selected: ${e.target.files[0].name}`);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Generate Button */}
          <div className="presentation-studio-generate-container">
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className={`presentation-studio-generate-button ${isGenerating || !prompt.trim() ? 'presentation-studio-generate-button-disabled' : ''}`}
            >
              {isGenerating ? (
                <>
                  <FiRefreshCw className="presentation-studio-spinner" />
                  {[
                    'Structuring story...',
                    'Visualizing content...',
                    'Designing slides...',
                    'Finalizing presentation...'
                  ][generationStep] || 'Generating...'}
                </>
              ) : (
                <>
                  <MdAutoAwesome className="presentation-studio-generate-icon" />
                  Generate Presentation
                </>
              )}
            </button>
          </div>
          
          {/* Progress bar during generation */}
          {isGenerating && (
            <div className="presentation-studio-progress-container">
              <div className="presentation-studio-progress-bar">
                <div 
                  className="presentation-studio-progress-fill" 
                  style={{ width: `${((generationStep + 1) / 4) * 100}%` }}
                ></div>
              </div>
              <div className="presentation-studio-progress-labels">
                <span>0%</span>
                <span>100%</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PromptSection;