import Konva from 'konva';

/**
 * Calculate an updated width/height for a text layer so that new text wraps nicely.
 * @param {Object} layer
 * @param {string} text
 * @param {Object} layout
 * @returns {Object} { width?, height? }
 */
export const getAutoSizedTextFrame = (layer, text, layout) => {
  if (!layer || !layout || !text) {
    return {};
  }

  const padding = 12;
  const minWidth = 160;
  const maxWidth = Math.min(layout.width * 0.75, layout.width - layer.x - 20);
  const baseWidth = layer.width || maxWidth;
  const width = Math.min(Math.max(baseWidth, minWidth), maxWidth);

  const fontStyle = layer.fontStyle === 'italic' ? 'italic ' : '';
  const fontWeight = layer.fontWeight === 'bold' || layer.fontWeight === '700' || layer.fontWeight === 700 ? 'bold ' : '';
  const fontSize = layer.fontSize;
  const fontFamily = layer.fontFamily || 'Poppins';
  const fontString = `${fontStyle}${fontWeight}${fontSize}px ${fontFamily}`;
  
  const tempText = new Konva.Text({
    text,
    width,
    fontSize: fontSize,
    fontFamily: fontFamily,
    font: fontString,
    align: layer.textAlign || 'left',
    wrap: 'word',
    padding,
    textDecoration: layer.textDecoration || 'none',
  });

  const textHeight = tempText.height();
  const minHeight = layer.fontSize ? layer.fontSize * 2 : 80;
  const maxHeight = Math.max(minHeight, layout.height - layer.y - 20);
  const height = Math.min(Math.max(textHeight, minHeight), maxHeight);

  return {
    width: Math.round(width),
    height: Math.round(height),
  };
};



