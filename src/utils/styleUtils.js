// --- utils/styleUtils.js ---
// Clean, reusable, and future-proof CSS helpers

export const hexToRgba = (hex, alpha = 1) => {
  if (!hex) return `rgba(0, 0, 0, ${alpha})`;
  const [r, g, b] = hex.match(/\w\w/g).map((c) => parseInt(c, 16));
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const getShadowCSS = (shadows) => {
  if (!shadows?.enabled) return 'none';
  const { x = 0, y = 0, blur = 0, spread = 0, color = '#000000', opacity = 50 } = shadows;
  return `${x}px ${y}px ${blur}px ${spread}px ${hexToRgba(color, opacity / 100)}`;
};

export const getFilterCSS = ({ brightness = 100, contrast = 100, blur = 0 }) => {
  const filters = [];
  if (brightness !== 100) filters.push(`brightness(${brightness}%)`);
  if (contrast !== 100) filters.push(`contrast(${contrast}%)`);
  if (blur > 0) filters.push(`blur(${blur}px)`);
  return filters.length ? filters.join(' ') : 'none';
};
