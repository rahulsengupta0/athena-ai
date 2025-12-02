import React, { useState } from 'react';
import { FiDownload, FiShare2, FiSave, FiRefreshCw } from 'react-icons/fi';
import { MdAutoAwesome } from 'react-icons/md';

const Header = ({ 
  handleSavePresentation, 
  handleExport, 
  handleSharePresentation, 
  isExporting 
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="presentation-studio-header">
      <div>
        <h1 className="presentation-studio-title">AI Presentation Studio</h1>
        <p className="presentation-studio-subtitle">
          Create stunning presentations with AI in seconds
        </p>
      </div>
      <div className="presentation-studio-header-actions">
        <button 
          onClick={handleSavePresentation}
          className="presentation-studio-button presentation-studio-button-primary"
        >
          <FiSave size={18} />
          <span>Save</span>
        </button>
        <div 
          className="presentation-studio-dropdown"
          onBlur={() => setIsDropdownOpen(false)}
          tabIndex="0"
        >
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`presentation-studio-button presentation-studio-button-secondary ${isExporting ? 'presentation-studio-button-disabled' : ''}`}
            aria-haspopup="true"
            aria-expanded={isDropdownOpen}
          >
            {isExporting ? (
              <FiRefreshCw className="presentation-studio-spinner" size={18} />
            ) : (
              <FiDownload size={18} />
            )}
            <span>Export</span>
          </button>
          {isDropdownOpen && (
            <div className="presentation-studio-dropdown-menu">
              <button 
                onClick={() => {
                  handleExport('pdf');
                  setIsDropdownOpen(false);
                }}
                className="presentation-studio-dropdown-item"
              >
                Export as PDF
              </button>
              <button 
                onClick={() => {
                  handleExport('pptx');
                  setIsDropdownOpen(false);
                }}
                className="presentation-studio-dropdown-item"
              >
                Export as PowerPoint
              </button>
              <button 
                onClick={() => {
                  handleExport('png');
                  setIsDropdownOpen(false);
                }}
                className="presentation-studio-dropdown-item"
              >
                Export as Images
              </button>
            </div>
          )}
        </div>
        <button 
          onClick={handleSharePresentation}
          className="presentation-studio-button presentation-studio-button-secondary"
        >
          <FiShare2 size={18} />
          <span>Share</span>
        </button>
      </div>
    </div>
  );
};

export default Header;