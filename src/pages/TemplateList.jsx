import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import TemplateEditorModal from '../components/TemplateEditorModal';

const TemplateList = () => {
  const { categoryName } = useParams(); // e.g., "Business"
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        // Ensure categoryName matches what you stored (e.g., "Instagram Post")
        const data = await api.getTemplatesByCategory(categoryName);
        setTemplates(data);
      } catch (err) {
        console.error("Failed to load templates", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTemplates();
  }, [categoryName]);

  return (
    <div style={{ padding: '40px', background: '#f8f9fa', minHeight: '100vh' }}>
      <h2 style={{ marginBottom: '24px', textTransform: 'capitalize' }}>
        {categoryName.replace('-', ' ')} Templates
      </h2>

      {loading ? (
        <p>Loading templates...</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '24px'
        }}>
          {templates.map(t => (
            <div
              key={t._id}
              onClick={() => setSelectedTemplate(t)}
              style={{
                cursor: 'pointer',
                background: 'white',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <img
                src={t.thumbnailUrl}
                alt={t.name}
                style={{ width: '100%', height: '250px', objectFit: 'cover' }}
              />
              <div style={{ padding: '16px' }}>
                <h3 style={{ fontSize: '16px', margin: 0 }}>{t.name}</h3>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedTemplate && (
        <TemplateEditorModal
          template={selectedTemplate}
          onClose={() => setSelectedTemplate(null)}
        />
      )}
    </div>
  );
};

export default TemplateList;