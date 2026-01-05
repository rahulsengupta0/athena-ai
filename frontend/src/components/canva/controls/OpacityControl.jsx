import React from 'react';

const OpacityControl = ({ value, onChange, min = 0, max = 100 }) => {
  return (
    <div style={styles.propertyRow}>
      <span style={styles.propertyLabel}>Opacity</span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        style={{ width: '100px' }}
      />
      <span style={{ fontSize: '12px', color: '#666', minWidth: '30px' }}>
        {value}%
      </span>
    </div>
  );
};

const styles = {
  propertyRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '12px'
  },
  propertyLabel: {
    fontSize: '13px',
    color: '#374151',
    fontWeight: 500,
    minWidth: '80px'
  }
};

export default OpacityControl;

