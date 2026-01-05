import React from 'react';

const ShadowsControl = ({ value, onChange }) => {
  const shadowValue = value || { enabled: false, x: 0, y: 0, blur: 0, spread: 0, color: '#000000', opacity: 50 };

  const handleChange = (property, val) => {
    const newValue = { ...shadowValue, [property]: val };
    onChange(newValue);
  };

  return (
    <div style={styles.container}>
      <div style={styles.propertyRow}>
        <span style={styles.propertyLabel}>Shadows</span>
        <input
          type="checkbox"
          checked={shadowValue.enabled}
          onChange={(e) => handleChange('enabled', e.target.checked)}
          style={{ cursor: 'pointer' }}
        />
      </div>
      {shadowValue.enabled && (
        <>
          <div style={styles.propertyRow}>
            <span style={styles.propertyLabel}>X Offset</span>
            <input
              type="range"
              min="-50"
              max="50"
              value={shadowValue.x}
              onChange={(e) => handleChange('x', parseInt(e.target.value))}
              style={{ width: '100px' }}
            />
            <span style={{ fontSize: '12px', color: '#666', minWidth: '30px' }}>
              {shadowValue.x}px
            </span>
          </div>
          <div style={styles.propertyRow}>
            <span style={styles.propertyLabel}>Y Offset</span>
            <input
              type="range"
              min="-50"
              max="50"
              value={shadowValue.y}
              onChange={(e) => handleChange('y', parseInt(e.target.value))}
              style={{ width: '100px' }}
            />
            <span style={{ fontSize: '12px', color: '#666', minWidth: '30px' }}>
              {shadowValue.y}px
            </span>
          </div>
          <div style={styles.propertyRow}>
            <span style={styles.propertyLabel}>Blur</span>
            <input
              type="range"
              min="0"
              max="50"
              value={shadowValue.blur}
              onChange={(e) => handleChange('blur', parseInt(e.target.value))}
              style={{ width: '100px' }}
            />
            <span style={{ fontSize: '12px', color: '#666', minWidth: '30px' }}>
              {shadowValue.blur}px
            </span>
          </div>
          <div style={styles.propertyRow}>
            <span style={styles.propertyLabel}>Spread</span>
            <input
              type="range"
              min="-20"
              max="20"
              value={shadowValue.spread}
              onChange={(e) => handleChange('spread', parseInt(e.target.value))}
              style={{ width: '100px' }}
            />
            <span style={{ fontSize: '12px', color: '#666', minWidth: '30px' }}>
              {shadowValue.spread}px
            </span>
          </div>
          <div style={styles.propertyRow}>
            <span style={styles.propertyLabel}>Color</span>
            <input
              type="color"
              value={shadowValue.color}
              onChange={(e) => handleChange('color', e.target.value)}
              style={styles.colorInput}
            />
          </div>
          <div style={styles.propertyRow}>
            <span style={styles.propertyLabel}>Shadow Opacity</span>
            <input
              type="range"
              min="0"
              max="100"
              value={shadowValue.opacity}
              onChange={(e) => handleChange('opacity', parseInt(e.target.value))}
              style={{ width: '100px' }}
            />
            <span style={{ fontSize: '12px', color: '#666', minWidth: '30px' }}>
              {shadowValue.opacity}%
            </span>
          </div>
        </>
      )}
    </div>
  );
};

const styles = {
  container: {
    marginBottom: '12px'
  },
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
  },
  colorInput: {
    width: '40px',
    height: '28px',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    cursor: 'pointer'
  }
};

export default ShadowsControl;

