import React, { useState, useEffect } from 'react';

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
    const token = localStorage.getItem('token');

    const res = await fetch('/api/my-documents', {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    setUserDocs(data.files || []);
  };

  useEffect(() => {
    fetchMyDocuments();
  }, []);

  // ---------------- GENERATE DOCUMENT ----------------
  const handleGenerate = async () => {
    setLoading(true);
    setFileUrl('');

    try {
      const token = localStorage.getItem('token');

      const res = await fetch('/api/generate-document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt, format }),
      });

      const result = await res.json();

      if (result.fileUrl) {
        setFileUrl(result.fileUrl);
        fetchMyDocuments(); // Refresh list
      }

    } catch (err) {
      alert("Error generating file.");
    }

    setLoading(false);
  };

  // ---------------- DELETE DOCUMENT ----------------
  const deleteDocument = async (key) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;

    const token = localStorage.getItem('token');

    const res = await fetch('/api/delete-document', {
      method: 'DELETE',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ key })
    });

    const data = await res.json();

    if (data.success) {
      alert("Document deleted!");
      fetchMyDocuments();
    } else {
      alert("Error deleting document.");
    }
  };

  return (
    <div className="document-generator">

      {/* ========= GENERATOR CARD ========= */}
      <div className="generator-card">
        <div className="header">
          <h1 className="title">AI Document Generator</h1>
          <p className="subtitle">Transform your ideas into professional documents</p>
        </div>

        {/* FORMAT SELECT */}
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

        {/* PROMPT INPUT */}
        <div className="prompt-section">
          <label className="section-label">Describe your document</label>
          <textarea
            rows="4"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="Example: Create a quarterly business report..."
            className="prompt-textarea"
          />
        </div>

        {/* GENERATE BUTTON */}
        <button
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
          className={`generate-button ${loading ? 'loading' : ''}`}
        >
          {loading ? "Generating..." : "Generate Document"}
        </button>

        {/* DOWNLOAD GENERATED FILE */}
        {fileUrl && (
          <div className="download-section">
            <div className="success-message">Document generated!</div>
            <a href={fileUrl} download className="download-button">Download File</a>
          </div>
        )}
      </div>

      {/* ========= USER DOCUMENT LIST ========= */}
      <div className="previous-docs">
        <h2>Your Documents</h2>

        {userDocs.length === 0 && <p>No documents yet.</p>}

        {userDocs.map((doc, index) => (
          <div key={index} className="doc-item">
            <span>{doc.filename}</span>

            <div className="doc-actions">
              <a href={doc.url} download target="_blank">Download</a>
              <button onClick={() => deleteDocument(doc.key)} className="delete-btn">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* ========= STYLES ========= */}
      <style jsx>{`
        .previous-docs {
          margin-top: 30px;
          padding: 20px;
          border-radius: 10px;
          background: white;
        }
        .doc-item {
          display: flex;
          justify-content: space-between;
          padding: 10px;
          border-bottom: 1px solid #eee;
        }
        .doc-actions {
          display: flex;
          gap: 15px;
        }
        .doc-item a {
          color: #7b3fe4;
          font-weight: 600;
          text-decoration: none;
        }
        .delete-btn {
          color: red;
          border: none;
          background: transparent;
          cursor: pointer;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
}

export default DocumentGenerator;
