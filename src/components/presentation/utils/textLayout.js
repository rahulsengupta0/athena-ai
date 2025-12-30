import Konva from 'konva';
import { getKonvaFontStyle } from './fontUtils';

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
  const widthConstraint = Math.min(layout.width * 0.75, layout.width - layer.x - 20);
  const maxWidth = Math.max(minWidth, widthConstraint);
  const baseWidth = layer.width || maxWidth;
  const width = Math.min(Math.max(baseWidth, minWidth), maxWidth);

  const tempText = new Konva.Text({
    text,
    width,
    fontSize: layer.fontSize,
    fontFamily: layer.fontFamily || 'Poppins',
    fontStyle: getKonvaFontStyle(layer.fontStyle, layer.fontWeight),
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



