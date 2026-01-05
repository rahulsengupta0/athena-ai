import React from 'react';
import './TemplatePreviewModal.css';

const TemplatePreviewModal = ({ template, onClose, onEdit }) => {
  if (!template) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2>{template.name}</h2>
        <div className="modal-body">
          <div className="modal-thumbnail-container">
            <img
              src={template.thumbnailUrl}
              alt={template.name}
              className="modal-thumbnail"
            />
          </div>
          <div className="modal-details">
            <p className="template-category">
              <strong>Category:</strong> {template.category}
            </p>
            {/* Add more template details here if needed */}
          </div>
        </div>
        <div className="modal-footer">
          <button className="edit-button" onClick={() => onEdit(template)}>
            Use Template
          </button>
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplatePreviewModal;
