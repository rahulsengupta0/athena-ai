import React, { useRef } from 'react';
import { Image, Loader } from 'lucide-react';
import { loadImageFromFile, createImageLayer } from '../utils/imageUtils';

/**
 * Image upload component
 * @param {Object} props
 * @param {Function} props.onImageUpload - Callback when image is uploaded, receives image layer object
 * @param {Object} props.layout - Layout dimensions for image sizing
 */
const ImageUpload = ({ onImageUpload, layout }) => {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = React.useState(false);

  const handleFileSelect = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      // Load image from file
      const imageData = await loadImageFromFile(file);
      
      // Create image layer (positioned at center of canvas)
      const imageLayer = createImageLayer(
        imageData,
        {
          x: (layout.width - imageData.width) / 2,
          y: (layout.height - imageData.height) / 2,
        },
        layout
      );
      
      // Call callback with the new layer
      onImageUpload(imageLayer);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert(error.message || 'Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
      <button
        onClick={handleButtonClick}
        disabled={isUploading}
        style={{
          flex: 1,
          border: '1px dashed rgba(15, 23, 42, 0.14)',
          borderRadius: 18,
          padding: '12px',
          background: isUploading ? 'rgba(15, 23, 42, 0.04)' : 'rgba(15, 23, 42, 0.02)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          fontWeight: 600,
          color: isUploading ? '#94a3b8' : '#475569',
          cursor: isUploading ? 'not-allowed' : 'pointer',
          opacity: isUploading ? 0.6 : 1,
        }}
      >
        {isUploading ? (
          <>
            <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} />
            Uploading...
          </>
        ) : (
          <>
            <Image size={16} />
            Upload image
          </>
        )}
      </button>
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </>
  );
};

export default ImageUpload;


