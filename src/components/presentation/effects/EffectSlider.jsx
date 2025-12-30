import React from 'react';

const EffectSlider = ({
  label,
  min,
  max,
  step = 0.01,
  value,
  onChange,
  formatValue,
  disabled = false,
}) => {
  const displayValue =
    typeof formatValue === 'function'
      ? formatValue(value)
      : Math.round(value * 100) / 100;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#475569' }}>{label}</span>
        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{displayValue}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        style={{ width: '100%' }}
      />
    </div>
  );
};

export default EffectSlider;

