import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "./BrandKitResult.css";

const BrandKitResult = () => {
  const { state } = useLocation();
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  if (!state) {
    return (
      <div className="no-kit-container">
        <div className="no-kit-content">
          <h2>No Brand Kit Found</h2>
          <p>Please go back and generate your brand kit first.</p>
        </div>
      </div>
    );
  }

  const downloadAsset = (url, filename) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openImageModal = (imageSrc, title) => {
    setSelectedImage({ src: imageSrc, title });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedImage(null);
  };

  return (
    <div className="brand-kit-container">
      <div className="brand-kit-header">
        <h1 className="brand-kit-title">Your Generated Brand Kit</h1>
        <p className="brand-kit-subtitle">Click on any image to view it in full size</p>
      </div>

      <div className="assets-grid">
        {/* Logo Card */}
        <div className="asset-card">
          <div className="asset-header">
            <div className="asset-icon">🎨</div>
            <h3 className="asset-title">Logo</h3>
          </div>
          <div className="asset-preview">
            <img 
              src={state.logo} 
              alt="Logo" 
              className="asset-image logo-image clickable-image"
              onClick={() => openImageModal(state.logo, "Logo")}
            />
          </div>
          <button 
            className="download-btn"
            onClick={() => downloadAsset(state.logo, "logo.png")}
          >
            <span className="btn-icon">⬇️</span>
            Download Logo
          </button>
        </div>

        {/* Banner Card */}
        <div className="asset-card">
          <div className="asset-header">
            <div className="asset-icon">🖼️</div>
            <h3 className="asset-title">Banner</h3>
          </div>
          <div className="asset-preview">
            <img 
              src={state.banner} 
              alt="Banner" 
              className="asset-image banner-image clickable-image"
              onClick={() => openImageModal(state.banner, "Banner")}
            />
          </div>
          <button 
            className="download-btn"
            onClick={() => downloadAsset(state.banner, "banner.png")}
          >
            <span className="btn-icon">⬇️</span>
            Download Banner
          </button>
        </div>

        {/* Poster Card */}
        <div className="asset-card">
          <div className="asset-header">
            <div className="asset-icon">📄</div>
            <h3 className="asset-title">Poster</h3>
          </div>
          <div className="asset-preview">
            <img 
              src={state.poster} 
              alt="Poster" 
              className="asset-image poster-image clickable-image"
              onClick={() => openImageModal(state.poster, "Poster")}
            />
          </div>
          <button 
            className="download-btn"
            onClick={() => downloadAsset(state.poster, "poster.png")}
          >
            <span className="btn-icon">⬇️</span>
            Download Poster
          </button>
        </div>
      </div>

      <div className="action-section">
        <button className="primary-btn">
          Share Brand Kit
        </button>
        <button className="secondary-btn">
          Generate More Assets
        </button>
      </div>

      {/* Image Modal */}
      {modalOpen && selectedImage && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{selectedImage.title}</h3>
              <button className="modal-close" onClick={closeModal}>
                ✕
              </button>
            </div>
            <div className="modal-image-container">
              <img 
                src={selectedImage.src} 
                alt={selectedImage.title}
                className="modal-image"
              />
            </div>
            <div className="modal-actions">
              <button 
                className="modal-download-btn"
                onClick={() => downloadAsset(selectedImage.src, `${selectedImage.title.toLowerCase()}.png`)}
              >
                <span className="btn-icon">⬇️</span>
                Download {selectedImage.title}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandKitResult;