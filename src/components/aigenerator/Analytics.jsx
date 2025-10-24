import React from 'react';
import styles from './Styles';

const Analytics = () => {
  const analyticsData = [
    { label: 'Total Creations', value: 128 },
    { label: 'Active Tools Used', value: 4 },
    { label: 'Avg. AI Confidence', value: '89%' },
    { label: 'Saved Projects', value: 42 },
  ];

  return (
    <div style={{ ...styles.quickActionsContainer, marginTop: '1rem' }}>
      <p style={styles.quickActionsTitle}>Analytics Overview</p>
      <p style={styles.quickActionsSubtitle}>Your AI usage and performance insights</p>
      <div style={styles.quickActionsGrid}>
        {analyticsData.map((item, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: 'white',
              border: '1px solid #ebe9f5',
              borderRadius: '1rem',
              padding: '1.5rem',
              boxShadow: '0 6px 24px rgb(217 210 237 / 0.15)',
              textAlign: 'center',
            }}
          >
            <h3 style={{ margin: 0, fontSize: '1.8rem', color: '#9760ff', fontWeight: '900' }}>
              {item.value}
            </h3>
            <p style={{ color: '#666', marginTop: '0.4rem', fontWeight: '600' }}>{item.label}</p>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <p style={{ color: '#999' }}>
          Charts and graphical analytics will be displayed here once backend data is integrated.
        </p>
      </div>
    </div>
  );
};

export default Analytics;
