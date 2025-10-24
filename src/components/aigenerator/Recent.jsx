import React from 'react';
import styles from './Styles';

const Recent = () => {
  const recentItems = [
    {
      id: 1,
      title: 'Modern UI Landing Page',
      type: 'Design Generator',
      date: 'October 22, 2025',
      thumbnail: 'https://via.placeholder.com/80x60.png',
    },
    {
      id: 2,
      title: 'AI Blog Content Outline',
      type: 'Content Creator',
      date: 'October 20, 2025',
      thumbnail: 'https://via.placeholder.com/80x60.png',
    },
    {
      id: 3,
      title: 'Dashboard Layout Concept',
      type: 'Layout Builder',
      date: 'October 18, 2025',
      thumbnail: 'https://via.placeholder.com/80x60.png',
    },
  ];

  return (
    <div style={{ ...styles.quickActionsContainer, marginTop: '1rem' }}>
      <p style={styles.quickActionsTitle}>Recent Activity</p>
      <p style={styles.quickActionsSubtitle}>Your latest generated projects</p>
      <div style={{ display: 'grid', gap: '1rem' }}>
        {recentItems.map((item) => (
          <div
            key={item.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              border: '1px solid #ebe9f5',
              borderRadius: '1rem',
              backgroundColor: 'white',
              padding: '1rem 1.5rem',
              boxShadow: '0 4px 15px rgb(217 210 237 / 0.1)',
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <img
                src={item.thumbnail}
                alt={item.title}
                style={{
                  width: '80px',
                  height: '60px',
                  borderRadius: '0.5rem',
                  objectFit: 'cover',
                  backgroundColor: '#f6f6f6',
                }}
              />
              <div>
                <h3 style={{ margin: 0, fontWeight: '700', fontSize: '1rem' }}>{item.title}</h3>
                <p style={{ margin: '0.3rem 0', color: '#8b8b8b', fontSize: '0.85rem' }}>{item.type}</p>
                <p style={{ margin: 0, color: '#aaa', fontSize: '0.75rem' }}>{item.date}</p>
              </div>
            </div>
            <button
              style={{
                backgroundColor: '#9760ff',
                color: 'white',
                padding: '0.5rem 1rem',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: '600',
                cursor: 'pointer',
              }}
              onClick={() => alert(`Opening ${item.title}`)}
            >
              Open
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recent;
