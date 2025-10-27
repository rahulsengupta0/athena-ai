import React from 'react';
import styles from './Styles';

const QuickActions = ({ actions }) => (
  <div style={styles.quickActionsContainer}>
    <p style={styles.quickActionsTitle}>Quick Actions</p>
    <p style={styles.quickActionsSubtitle}>Jump into popular workflows</p>
    <div style={styles.quickActionsGrid}>
      {actions.map((action, idx) => (
        <button
          key={idx}
          style={styles.quickActionButton}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#ede6ff';
            e.currentTarget.style.boxShadow = '0 5px 20px rgb(217 210 237 / 0.4)';
            e.currentTarget.style.transform = 'scale(1.08)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#fafafd';
            e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.05)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          {action.icon}
          {action.label}
        </button>
      ))}
    </div>
  </div>
);

export default QuickActions;