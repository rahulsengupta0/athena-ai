import React, { useState } from 'react';

export default function ArtisticImageGenerator() {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setGeneratedImage(null);
    }
  };

  const handleSubmit = async () => {
  if (!prompt) {
    alert('Please enter a creative prompt');
    return;
  }

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  setLoading(true);

  try {
    const formData = new FormData();
    if (imageFile) formData.append('file', imageFile);
    formData.append('prompt', prompt);

    const response = await fetch(`${API_BASE_URL}/apply-style`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Failed: ${errText}`);
    }

    const data = await response.json();

    if (!data.image) throw new Error('No image returned from backend');

    const imageUrl = `data:image/png;base64,${data.image}`;
    setGeneratedImage(imageUrl);
  } catch (error) {
    console.error("Generation error:", error);
    alert(error.message);
  }

  setLoading(false);
};

  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = 'artistic-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setImageFile(null);
    setImagePreview(null);
    setPrompt('');
    setGeneratedImage(null);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.heading}>Artistic Image Generator</h1>
        <p style={styles.subtitle}>Transform your images with AI-powered artistic styles</p>
      </div>

      <div style={styles.uploadSection}>
        <input
          type="file"
          id="file-upload"
          accept="image/*"
          onChange={handleFileChange}
          style={styles.fileInput}
        />
        <label htmlFor="file-upload" style={styles.uploadLabel}>
          <div style={styles.uploadContent}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={styles.uploadIcon}>
              <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2"/>
              <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2"/>
              <path d="M16 13H8" stroke="currentColor" strokeWidth="2"/>
              <path d="M16 17H8" stroke="currentColor" strokeWidth="2"/>
              <path d="M10 9H9H8" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <div>
              <div style={styles.uploadText}>
                {imageFile ? imageFile.name : 'Choose an image file'}
              </div>
              <div style={styles.uploadHint}>
                {imageFile ? 'Click to change file' : 'PNG, JPG, JPEG up to 10MB'}
              </div> 
            </div>
          </div>
        </label>
      </div>

      {imagePreview && (
        <div style={styles.previewSection}>
          <h3 style={styles.previewTitle}>Original Image</h3>
          <div style={styles.imageContainer}>
            <img src={imagePreview} alt="Original preview" style={styles.previewImage} />
          </div>
        </div>
      )}

      <div style={styles.promptSection}>
        <label style={styles.promptLabel}>
          Style Prompt
          <span style={styles.required}>*</span>
        </label>
        <textarea
          placeholder="Describe the artistic style you want to apply (e.g., 'van gogh starry night style', 'watercolor painting', 'cyberpunk neon lights')"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          style={styles.textarea}
          rows={3}
        />
        <div style={styles.promptHint}>
          Be creative and descriptive for better results!
        </div>
      </div>

      <div style={styles.actions}>
        <button 
          onClick={handleSubmit} 
          style={{
            ...styles.button,
            ...styles.primaryButton,
            ...(loading || !prompt ? styles.buttonDisabled : {})
          }}
          disabled={loading || !prompt}
        >
          {loading ? (
            <div style={styles.buttonContent}>
              <div style={styles.spinner}></div>
              Generating Art...
            </div>
          ) : (
            'Generate Artistic Image'
          )}
        </button>

        {(imagePreview || prompt) && (
          <button 
            onClick={handleReset}
            style={{
              ...styles.button,
              ...styles.secondaryButton
            }}
          >
            Start Over
          </button>
        )}
      </div>

      {generatedImage && (
        <div style={styles.resultSection}>
          <div style={styles.resultHeader}>
            <h2 style={styles.resultTitle}>Your Artistic Creation</h2>
            <div style={styles.resultBadge}>Generated</div>
          </div>
          <div style={styles.imageComparison}>
            {imagePreview && (
              <div style={styles.comparisonItem}>
                <div style={styles.comparisonLabel}>Original</div>
                <img src={imagePreview} alt="Original" style={styles.comparisonImage} />
              </div>
            )}
            <div style={styles.comparisonItem}>
              <div style={styles.comparisonLabel}>Styled Result</div>
              <img src={generatedImage} alt="Generated artistic version" style={styles.comparisonImage} />
            </div>
          </div>
          <button 
            onClick={handleDownload}
            style={{
              ...styles.button,
              ...styles.downloadButton
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={styles.downloadIcon}>
              <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2"/>
              <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 15V3" stroke="currentColor" strokeWidth="2"/>
            </svg>
            Download Artistic Image
          </button>
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 800,
    margin: '2rem auto',
    padding: '2.5rem',
    background: 'white',
    borderRadius: 20,
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  header: {
    textAlign: 'center',
    marginBottom: '2.5rem',
  },
  heading: {
    margin: '0 0 0.5rem 0',
    fontSize: '2.25rem',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    color: '#6b7280',
    fontSize: '1.1rem',
    margin: 0,
    fontWeight: '400',
  },
  uploadSection: {
    marginBottom: '2rem',
  },
  fileInput: {
    display: 'none',
  },
  uploadLabel: {
    display: 'block',
    border: '2px dashed #d1d5db',
    borderRadius: 16,
    padding: '2.5rem 2rem',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backgroundColor: '#fafafa',
  },
  uploadContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    color: '#6b7280',
  },
  uploadIcon: {
    color: '#9ca3af',
  },
  uploadText: {
    fontWeight: '600',
    fontSize: '1.1rem',
    color: '#374151',
  },
  uploadHint: {
    fontSize: '0.875rem',
    marginTop: '0.25rem',
  },
  previewSection: {
    marginBottom: '2rem',
  },
  previewTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '1rem',
  },
  imageContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  previewImage: {
    width: '100%',
    height: 'auto',
    display: 'block',
  },
  promptSection: {
    marginBottom: '2rem',
  },
  promptLabel: {
    display: 'block',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '0.5rem',
    fontSize: '1.1rem',
  },
  
  required: {
    color: '#ef4444',
    marginLeft: '0.25rem',
  },
  textarea: {
    width: '100%',
    padding: '1rem',
    fontSize: '1rem',
    borderRadius: 12,
    border: '2px solid #e5e7eb',
    boxSizing: 'border-box',
    resize: 'vertical',
    fontFamily: 'inherit',
    transition: 'all 0.2s ease',
  },
  promptHint: {
    fontSize: '0.875rem',
    color: '#6b7280',
    marginTop: '0.5rem',
  },
  actions: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
  },
  button: {
    padding: '1rem 2rem',
    fontSize: '1rem',
    borderRadius: 12,
    border: 'none',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
  },
  primaryButton: {
    backgroundColor: '#8b5cf6',
    color: 'white',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    color: '#6b7280',
    border: '2px solid #d1d5db',
  },
  downloadButton: {
    backgroundColor: '#10b981',
    color: 'white',
  },
  buttonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  buttonContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  spinner: {
    width: 18,
    height: 18,
    border: '2px solid transparent',
    borderTop: '2px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  resultSection: {
    marginTop: '2rem',
    padding: '2rem',
    backgroundColor: '#f0fdf4',
    borderRadius: 16,
    border: '1px solid #bbf7d0',
  },
  resultHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1.5rem',
  },
  resultTitle: {
    margin: 0,
    color: '#065f46',
    fontSize: '1.5rem',
  },
  resultBadge: {
    backgroundColor: '#10b981',
    color: 'white',
    padding: '0.25rem 0.75rem',
    borderRadius: 20,
    fontSize: '0.875rem',
    fontWeight: '600',
  },
  imageComparison: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1.5rem',
    marginBottom: '1.5rem',
  },
  comparisonItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: '1rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
  },
  comparisonLabel: {
    fontWeight: '600',
    color: '#374151',
    marginBottom: '0.75rem',
    textAlign: 'center',
  },
  comparisonImage: {
    width: '100%',
    height: 'auto',
    borderRadius: 8,
  },
  downloadIcon: {
    marginRight: '0.5rem',
  },
};