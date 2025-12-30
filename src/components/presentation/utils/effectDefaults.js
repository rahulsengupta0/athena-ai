export const DEFAULT_SHADOW = {
  enabled: false,
  color: '#0f172a',
  opacity: 0.35,
  blur: 18,
  offsetX: 0,
  offsetY: 8,
};

export const DEFAULT_IMAGE_EFFECTS = {
  brightness: 0,
  contrast: 0,
  blur: 0,
  opacity: 1,
  shadow: DEFAULT_SHADOW,
};

export const normalizeShadow = (shadow = {}) => ({
  ...DEFAULT_SHADOW,
  ...shadow,
});

export const normalizeImageEffects = (effects = {}) => ({
  ...DEFAULT_IMAGE_EFFECTS,
  ...effects,
  shadow: normalizeShadow(effects?.shadow),
});

