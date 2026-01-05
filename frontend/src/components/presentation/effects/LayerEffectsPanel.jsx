import React, { useMemo } from 'react';
import EffectSlider from './EffectSlider';
import ShadowControls from './ShadowControls';
import { normalizeImageEffects, normalizeShadow } from '../utils/effectDefaults';

const LayerEffectsPanel = ({ effects, onChange }) => {
  const normalizedEffects = useMemo(() => normalizeImageEffects(effects), [effects]);

  const handleChange = (patch) => {
    onChange({
      ...normalizedEffects,
      ...patch,
    });
  };

  const handleResetAll = () => {
    onChange(normalizeImageEffects());
  };

  const handleShadowReset = () => {
    handleChange({ shadow: normalizeShadow() });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>Effects</span>
        <button
          onClick={handleResetAll}
          style={{
            border: 'none',
            background: 'rgba(79, 70, 229, 0.08)',
            color: '#4f46e5',
            borderRadius: 12,
            padding: '4px 10px',
            fontSize: '0.78rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Reset all
        </button>
      </div>

      <EffectSlider
        label="Brightness"
        min={-1}
        max={1}
        step={0.05}
        value={normalizedEffects.brightness}
        onChange={(value) => handleChange({ brightness: value })}
        formatValue={(value) => `${value > 0 ? '+' : ''}${value.toFixed(2)}`}
      />

      <EffectSlider
        label="Contrast"
        min={-50}
        max={50}
        step={1}
        value={normalizedEffects.contrast}
        onChange={(value) => handleChange({ contrast: value })}
        formatValue={(value) => `${value > 0 ? '+' : ''}${value}`}
      />

      <EffectSlider
        label="Blur"
        min={0}
        max={30}
        step={1}
        value={normalizedEffects.blur}
        onChange={(value) => handleChange({ blur: value })}
        formatValue={(value) => `${value.toFixed(0)}px`}
      />

      <EffectSlider
        label="Opacity"
        min={0}
        max={1}
        step={0.05}
        value={normalizedEffects.opacity}
        onChange={(value) => handleChange({ opacity: value })}
        formatValue={(value) => `${Math.round(value * 100)}%`}
      />

      <ShadowControls
        value={normalizedEffects.shadow}
        onChange={(shadow) => handleChange({ shadow })}
        onReset={handleShadowReset}
      />
    </div>
  );
};

export default LayerEffectsPanel;

