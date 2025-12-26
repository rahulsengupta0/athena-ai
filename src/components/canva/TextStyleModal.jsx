import React, { useState } from 'react';
import { generateTextStyles } from './TextStyleService';

const TextStyleModal = ({ text, onClose, onAddToCanvas }) => {
  const [styles, setStyles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateStyles = async () => {
    if (!text || !text.trim()) {
      setError('Please enter some text first');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const data = await generateTextStyles(text);
      setStyles(data.images);
    } catch (err) {
      console.error('Error generating styles:', err);
      setError(err.message || 'Failed to generate text styles');
    } finally {
      setLoading(false);
    }
  };

  // Generate styles when modal opens
  React.useEffect(() => {
    generateStyles();
  }, []);

  const handleStyleSelect = (imageUrl) => {
    onAddToCanvas(imageUrl);
    onClose();
  };

  const modalStyles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000
    },
    container: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      maxWidth: '800px',
      width: '90%',
      maxHeight: '90vh',
      overflowY: 'auto',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px'
    },
    title: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#1a202c',
      margin: 0
    },
    closeButton: {
      background: 'none',
      border: 'none',
      fontSize: '24px',
      cursor: 'pointer',
      color: '#718096',
      padding: '4px'
    },
    content: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
      gap: '16px'
    },
    thumbnail: {
      width: '100%',
      height: '150px',
      objectFit: 'contain',
      cursor: 'pointer',
      border: '2px solid transparent',
      borderRadius: '8px',
      transition: 'all 0.2s',
      backgroundColor: '#f7fafc'
    },
    thumbnailHover: {
      border: '2px solid #8b5cf6',
      transform: 'scale(1.05)'
    },
    loading: {
      textAlign: 'center',
      padding: '40px',
      color: '#718096'
    },
    error: {
      padding: '16px',
      backgroundColor: '#fed7d7',
      color: '#c53030',
      borderRadius: '6px',
      textAlign: 'center'
    },
    button: {
      padding: '10px 20px',
      backgroundColor: '#8b5cf6',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontWeight: '500',
      fontSize: '14px',
      alignSelf: 'flex-start'
    }
  };

  return (
    <div style={modalStyles.overlay} onClick={onClose}>
      <div style={modalStyles.container} onClick={(e) => e.stopPropagation()}>
        <div style={modalStyles.header}>
          <h2 style={modalStyles.title}>AI Text Styles</h2>
          <button style={modalStyles.closeButton} onClick={onClose}>×</button>
        </div>
        
        <div style={modalStyles.content}>
          {error && <div style={modalStyles.error}>{error}</div>}
          
          <button style={modalStyles.button} onClick={generateStyles} disabled={loading}>
            {loading ? 'Generating...' : 'Regenerate Styles'}
          </button>
          
          {loading ? (
            <div style={modalStyles.loading}>Generating stylish text designs...</div>
          ) : styles.length > 0 ? (
            <div style={modalStyles.grid}>
              {styles.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Style ${index + 1}`}
                  style={modalStyles.thumbnail}
                  onClick={() => handleStyleSelect(url)}
                  onMouseOver={(e) => {
                    e.target.style.border = modalStyles.thumbnailHover.border;
                    e.target.style.transform = modalStyles.thumbnailHover.transform;
                  }}
                  onMouseOut={(e) => {
                    e.target.style.border = modalStyles.thumbnail.border;
                    e.target.style.transform = 'none';
                  }}
                />
              ))}
            </div>
          ) : (
            <div style={modalStyles.loading}>No styles generated yet. Click "Regenerate Styles" to create some!</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TextStyleModal;