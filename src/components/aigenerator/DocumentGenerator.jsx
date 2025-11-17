import React, { useState } from 'react';

const formats = [
  { key: 'pdf', label: 'PDF', icon: '📄' },
  { key: 'docx', label: 'DOCX', icon: '📝' },
  { key: 'xlsx', label: 'XLSX', icon: '📊' },
  { key: 'csv', label: 'CSV', icon: '📈' },
  { key: 'txt', label: 'TXT', icon: '📃' },
  { key: 'md', label: 'Markdown', icon: '🔖' },
  { key: 'json', label: 'JSON', icon: '⚙️' },
  { key: 'image', label: 'Image (PNG)', icon: '🖼️' },
  { key: 'pptx', label: 'PPTX Presentation', icon: '📽️' },
];

function DocumentGenerator() {
  const [prompt, setPrompt] = useState('');
  const [format, setFormat] = useState('pdf');
  const [loading, setLoading] = useState(false);
  const [fileUrl, setFileUrl] = useState('');

  const handleGenerate = async () => {
    setLoading(true);
    setFileUrl('');

    try {
      const res = await fetch('/api/generate-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, format }),
      });

      if (res.headers.get("content-type")?.includes("application/json")) {
        const err = await res.json();
        alert(err.error);
        setLoading(false);
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setFileUrl(url);

    } catch (err) {
      alert("Error generating file.");
    }

    setLoading(false);
  };

  return (
    <div className="document-generator">
      <div className="generator-card">
        <div className="header">
          <h1 className="title">AI Document Generator</h1>
          <p className="subtitle">Transform your ideas into professional documents</p>
        </div>

        <div className="format-section">
          <label className="section-label">Select Format</label>
          <div className="format-grid">
            {formats.map(f => (
              <button
                key={f.key}
                onClick={() => setFormat(f.key)}
                className={`format-button ${format === f.key ? 'active' : ''}`}
              >
                <span className="format-icon">{f.icon}</span>
                <span className="format-label">{f.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="prompt-section">
          <label className="section-label">Describe your document</label>
          <textarea
            rows="5"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="Example: Create a quarterly business report with sales data and growth projections..."
            className="prompt-textarea"
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
          className={`generate-button ${loading ? 'loading' : ''} ${!prompt.trim() ? 'disabled' : ''}`}
        >
          {loading ? (
            <>
              <div className="spinner"></div>
              Generating Document...
            </>
          ) : (
            'Generate Document'
          )}
        </button>

        {fileUrl && (
          <div className="download-section">
            <div className="success-message">
              <span className="success-icon">✅</span>
              Document generated successfully!
            </div>
            <a 
              href={fileUrl} 
              download={`generated.${format}`}
              className="download-button"
            >
              <span className="download-icon">⬇️</span>
              Download {format.toUpperCase()} File
            </a>
          </div>
        )}
      </div>

      <style jsx>{`
        .document-generator {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .generator-card {
          background: white;
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          max-width: 650px;
          width: 100%;
        }

        .header {
          text-align: center;
          margin-bottom: 32px;
        }

        .title {
          color: #2d3748;
          font-size: 2.5rem;
          font-weight: 700;
          margin: 0 0 8px 0;
          background: linear-gradient(135deg, #7b3fe4, #5a2dbb);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .subtitle {
          color: #718096;
          font-size: 1.1rem;
          margin: 0;
        }

        .section-label {
          display: block;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 12px;
          font-size: 1rem;
        }

        .format-section {
          margin-bottom: 32px;
        }

        .format-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 12px;
        }

        .format-button {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 16px 12px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          background: white;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .format-button:hover {
          border-color: #7b3fe4;
          transform: translateY(-2px);
        }

        .format-button.active {
          border-color: #7b3fe4;
          background: linear-gradient(135deg, #7b3fe4, #5a2dbb);
          color: white;
        }

        .format-icon {
          font-size: 1.5rem;
          margin-bottom: 8px;
        }

        .format-label {
          font-size: 0.875rem;
          font-weight: 500;
          text-align: center;
        }

        .prompt-section {
          margin-bottom: 32px;
        }

        .prompt-textarea {
          width: 100%;
          padding: 16px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 1rem;
          resize: vertical;
          transition: border-color 0.2s ease;
          font-family: inherit;
        }

        .prompt-textarea:focus {
          outline: none;
          border-color: #7b3fe4;
          box-shadow: 0 0 0 3px rgba(123, 63, 228, 0.1);
        }

        .prompt-textarea::placeholder {
          color: #a0aec0;
        }

        .generate-button {
          width: 100%;
          padding: 16px 32px;
          background: linear-gradient(135deg, #7b3fe4, #5a2dbb);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .generate-button:hover:not(.disabled):not(.loading) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(123, 63, 228, 0.3);
        }

        .generate-button.disabled {
          background: #cbd5e0;
          cursor: not-allowed;
          transform: none;
        }

        .generate-button.loading {
          cursor: not-allowed;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid transparent;
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .download-section {
          margin-top: 24px;
          text-align: center;
        }

        .success-message {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: #38a169;
          font-weight: 600;
          margin-bottom: 16px;
          font-size: 1.1rem;
        }

        .download-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: linear-gradient(135deg, #48bb78, #38a169);
          color: white;
          text-decoration: none;
          border-radius: 10px;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .download-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(72, 187, 120, 0.3);
        }

        @media (max-width: 768px) {
          .generator-card {
            padding: 24px;
            margin: 20px;
          }

          .title {
            font-size: 2rem;
          }

          .format-grid {
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          }
        }
      `}</style>
    </div>
  );
}

export default DocumentGenerator;