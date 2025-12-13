import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const categories = [
  'Instagram Post',
  'Poster',
  'YouTube',
  'Story',
  'Business',
  'Social Media'
];

const TemplateManager = () => {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch templates when category changes
  useEffect(() => {
    fetchTemplates();
  }, [selectedCategory]);

  const fetchTemplates = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getTemplatesByCategory(selectedCategory);
      setTemplates(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load templates.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this template? This cannot be undone.')) {
      try {
        await api.deleteTemplate(id);
        // Remove from UI immediately
        setTemplates(prev => prev.filter(t => t._id !== id));
      } catch (err) {
        alert('Failed to delete template');
        console.error(err);
      }
    }
  };

  return (
    <div style={{ padding: '20px', background: 'white', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>Manage Existing Templates</h2>

        {/* Category Selector */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px' }}
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading templates...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : templates.length === 0 ? (
        <p style={{ color: '#666', fontStyle: 'italic' }}>No templates found in this category.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
          {templates.map(template => (
            <div key={template._id} style={{ border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
              <img
                src={template.thumbnailUrl}
                alt={template.name}
                style={{ width: '100%', height: '150px', objectFit: 'cover' }}
              />
              <div style={{ padding: '10px' }}>
                <h4 style={{ margin: '0 0 5px 0', fontSize: '14px', fontWeight: '600' }}>{template.name}</h4>
                <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>{new Date(template.createdAt).toLocaleDateString()}</p>
              </div>

              {/* Delete Button */}
              <button
                onClick={() => handleDelete(template._id)}
                style={{
                  width: '100%',
                  padding: '8px',
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '500',
                  transition: 'background 0.2s'
                }}
              >
                Delete Template
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TemplateManager;