import React, { useState, useEffect } from 'react';
import api from '../../services/api';
const formats = [
  { key: 'pdf', label: 'PDF', icon: '📄' },
  { key: 'docx', label: 'DOCX', icon: '📝' },
  { key: 'xlsx', label: 'XLSX', icon: '📊' },
  { key: 'csv', label: 'CSV', icon: '📈' },
  { key: 'txt', label: 'TXT', icon: '📃' },
  { key: 'md', label: 'Markdown', icon: '🔖' },
  { key: 'json', label: 'JSON', icon: '⚙️' },
  { key: 'image', label: 'Image (PNG)', icon: '🖼️' },
  { key: 'pptx', label: 'PPTX', icon: '📽️' },
];

function DocumentGenerator() {
  const [prompt, setPrompt] = useState('');
  const [format, setFormat] = useState('pdf');
  const [loading, setLoading] = useState(false);
  const [fileUrl, setFileUrl] = useState('');
  const [userDocs, setUserDocs] = useState([]);

  // ---------------- FETCH USER DOCUMENTS ----------------
  const fetchMyDocuments = async () => {
    try {
      const data = await api.getMyDocuments();
      setUserDocs(data.files || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  useEffect(() => {
    fetchMyDocuments();
  }, []);

  // ---------------- GENERATE DOCUMENT ----------------
  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    setFileUrl('');

    try {
      const result = await api.generateDocument(prompt, format);

      if (result.fileUrl) {
        setFileUrl(result.fileUrl);
        fetchMyDocuments(); // Refresh list
      } else {
        alert("Failed to generate document. Please try again.");
      }

    } catch (err) {
      alert("Error generating file. Please check your connection.");
    }

    setLoading(false);
  };

  // ---------------- DELETE DOCUMENT ----------------
  const deleteDocument = async (key) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;

    try {
      const data = await api.deleteDocument(key);

      if (data.success) {
        fetchMyDocuments();
      } else {
        alert("Error deleting document.");
      }
    } catch (error) {
      alert("Error deleting document. Please try again.");
    }
  };

  // ---------------- GET FILE ICON ----------------
  const getFileIcon = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    const formatMap = {
      'pdf': '📄',
      'docx': '📝',
      'xlsx': '📊',
      'csv': '📈',
      'txt': '📃',
      'md': '🔖',
      'json': '⚙️',
      'png': '🖼️',
      'jpg': '🖼️',
      'jpeg': '🖼️',
      'pptx': '📽️'
    };
    return formatMap[ext] || '📄';
  };

  return (
    <div className="document-generator">
      <div className="container">
        
        {/* ========= MAIN GENERATOR SECTION ========= */}
        <div className="generator-section">
          <div className="generator-card">
            <div className="header">
              <h1 className="title">AI Document Generator</h1>
              <p className="subtitle">Transform your ideas into professional documents instantly</p>
            </div>

            {/* FORMAT SELECTION */}
            <div className="format-section">
              <label className="section-label">Select Document Format</label>
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

            {/* PROMPT INPUT */}
            <div className="prompt-section">
              <label className="section-label">
                Describe your document
                <span className="char-count">{prompt.length}/500</span>
              </label>
              <textarea
                rows="4"
                value={prompt}
                maxLength={500}
                onChange={e => setPrompt(e.target.value)}
                placeholder="Example: Create a quarterly business report with sales figures, growth metrics, and future projections..."
                className="prompt-textarea"
              />
            </div>

            {/* GENERATE BUTTON */}
            <button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className={`generate-button ${loading ? 'loading' : ''}`}
            >
              {loading ? (
                <>
                  <div className="spinner"></div>
                  Generating...
                </>
              ) : (
                'Generate Document'
              )}
            </button>

            {/* DOWNLOAD SECTION */}
            {fileUrl && (
              <div className="download-section">
                <div className="success-alert">
                  <span className="success-icon">✅</span>
                  <div>
                    <div className="success-title">Document Generated Successfully!</div>
                    <div className="success-subtitle">Your document is ready for download</div>
                  </div>
                </div>
                <a href={fileUrl} download className="download-button">
                  <span className="download-icon">⬇️</span>
                  Download File
                </a>
              </div>
            )}
          </div>
        </div>

        {/* ========= DOCUMENTS LIBRARY ========= */}
        <div className="documents-section">
          <div className="section-header">
            <h2>Your Documents</h2>
            <button onClick={fetchMyDocuments} className="refresh-button">
              🔄 Refresh
            </button>
          </div>

          {userDocs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📁</div>
              <h3>No documents yet</h3>
              <p>Generate your first document to see it here</p>
            </div>
          ) : (
            <div className="documents-grid">
              {userDocs.map((doc, index) => (
                <div key={index} className="document-card">
                  <div className="document-header">
                    <span className="file-icon">{getFileIcon(doc.filename)}</span>
                    <div className="document-info">
                      <h4 className="document-title">{doc.filename}</h4>
                      <span className="document-date">Generated recently</span>
                    </div>
                  </div>
                  
                  <div className="document-actions">
                    <a 
                      href={doc.url} 
                      download 
                      className="action-button download-action"
                    >
                      Download
                    </a>
                    <button 
                      onClick={() => deleteDocument(doc.key)} 
                      className="action-button delete-action"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ========= STYLES ========= */}
      <style jsx>{`
        .document-generator {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          align-items: start;
        }

        @media (max-width: 768px) {
          .container {
            grid-template-columns: 1fr;
          }
        }

        /* Generator Card Styles */
        .generator-card {
          background: white;
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          border: 1px solid #e1e5e9;
        }

        .header {
          text-align: center;
          margin-bottom: 32px;
        }

        .title {
          font-size: 2rem;
          font-weight: 700;
          color: #1a202c;
          margin: 0 0 8px 0;
        }

        .subtitle {
          font-size: 1rem;
          color: #718096;
          margin: 0;
        }

        /* Format Section */
        .format-section {
          margin-bottom: 24px;
        }

        .section-label {
          display: block;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 12px;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .format-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }

        @media (max-width: 480px) {
          .format-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .format-button {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 12px 8px;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          background: white;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .format-button:hover {
          border-color: #667eea;
          transform: translateY(-2px);
        }

        .format-button.active {
          border-color: #667eea;
          background: #667eea;
          color: white;
        }

        .format-icon {
          font-size: 1.5rem;
          margin-bottom: 4px;
        }

        .format-label {
          font-size: 0.8rem;
          font-weight: 500;
        }

        /* Prompt Section */
        .prompt-section {
          margin-bottom: 24px;
        }

        .char-count {
          float: right;
          font-size: 0.8rem;
          color: #a0aec0;
          font-weight: normal;
        }

        .prompt-textarea {
          width: 100%;
          padding: 16px;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1rem;
          resize: vertical;
          transition: border-color 0.2s ease;
          font-family: inherit;
        }

        .prompt-textarea:focus {
          outline: none;
          border-color: #667eea;
        }

        /* Generate Button */
        .generate-button {
          width: 100%;
          padding: 16px 24px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .generate-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }

        .generate-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid transparent;
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Download Section */
        .download-section {
          margin-top: 20px;
          animation: slideDown 0.3s ease;
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .success-alert {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: #f0fff4;
          border: 1px solid #9ae6b4;
          border-radius: 8px;
          margin-bottom: 16px;
        }

        .success-icon {
          font-size: 1.2rem;
        }

        .success-title {
          font-weight: 600;
          color: #22543d;
        }

        .success-subtitle {
          font-size: 0.9rem;
          color: #38a169;
        }

        .download-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 24px;
          background: #38a169;
          color: white;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .download-button:hover {
          background: #2f855a;
          transform: translateY(-1px);
        }

        /* Documents Section */
        .documents-section {
          background: white;
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          border: 1px solid #e1e5e9;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .section-header h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1a202c;
          margin: 0;
        }

        .refresh-button {
          padding: 8px 16px;
          background: #edf2f7;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.2s ease;
        }

        .refresh-button:hover {
          background: #e2e8f0;
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #718096;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 16px;
          opacity: 0.5;
        }

        .empty-state h3 {
          margin: 0 0 8px 0;
          color: #4a5568;
        }

        .empty-state p {
          margin: 0;
          font-size: 0.9rem;
        }

        /* Documents Grid */
        .documents-grid {
          display: grid;
          gap: 16px;
        }

        .document-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .document-card:hover {
          border-color: #667eea;
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .document-header {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
        }

        .file-icon {
          font-size: 1.5rem;
        }

        .document-info {
          flex: 1;
        }

        .document-title {
          margin: 0 0 4px 0;
          font-weight: 600;
          color: #2d3748;
          font-size: 0.95rem;
          word-break: break-word;
        }

        .document-date {
          font-size: 0.8rem;
          color: #718096;
        }

        .document-actions {
          display: flex;
          gap: 8px;
        }

        .action-button {
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          text-decoration: none;
        }

        .download-action {
          background: #edf2f7;
          color: #2d3748;
        }

        .download-action:hover {
          background: #e2e8f0;
        }

        .delete-action {
          background: #fed7d7;
          color: #c53030;
        }

        .delete-action:hover {
          background: #feb2b2;
        }
      `}</style>
    </div>
  );
}

export default DocumentGenerator;