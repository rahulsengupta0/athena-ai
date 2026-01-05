// src/utils/textUtils.js
// Utility functions for text measurement and dimension calculation

/**
 * Calculate text dimensions based on content and font settings
 * @param {string} text - The text content to measure
 * @param {Object} layer - The layer object with font properties
 * @returns {Object} - Object with width and height
 */
export const calculateTextDimensions = (text, layer) => {
  if (!text || !text.trim()) {
    return {
      width: layer.width || 200,
      height: layer.height || 50
    };
  }

  // Create a temporary canvas to measure text
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  const fontWeight = layer.fontWeight || 'normal';
  const fontSize = layer.fontSize || 16;
  const fontFamily = layer.fontFamily || 'Arial';
  let fontString = `${fontWeight} ${fontSize}px ${fontFamily}`;
  if (layer.fontStyle === 'italic') {
    fontString = `italic ${fontWeight} ${fontSize}px ${fontFamily}`;
  }
  
  ctx.font = fontString;
  ctx.textBaseline = 'top';
  
  const padding = 8; // Same padding as used in rendering
  const lineHeight = fontSize * 1.3; // Same line height as used in rendering
  const minWidth = 200;
  const maxAllowedWidth = Math.max(minWidth, (layer.width || 300) * 2); // Allow expansion up to 2x current width
  const wrappingWidth = Math.max(200, layer.width || 300) - padding; // Use current width as wrapping reference
  
  // Split text into lines (handling explicit line breaks)
  const lines = (text || '').split(/\n/);
  let totalHeight = padding * 2;
  let maxLineWidth = 0;
  
  // Process each line (with explicit line breaks)
  lines.forEach(line => {
    if (!line.trim()) {
      // Empty line still takes space
      totalHeight += lineHeight;
      return;
    }
    
    // Measure the full line first
    const fullLineMetrics = ctx.measureText(line);
    
    // If line fits within wrapping width, use it as-is
    if (fullLineMetrics.width <= wrappingWidth) {
      maxLineWidth = Math.max(maxLineWidth, fullLineMetrics.width);
      totalHeight += lineHeight;
      return;
    }
    
    // Line needs wrapping
    const words = line.split(' ');
    let currentLine = '';
    
    words.forEach((word, index) => {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      const metrics = ctx.measureText(testLine);
      
      if (metrics.width > wrappingWidth && currentLine) {
        // Current line is full, measure it and start new line
        maxLineWidth = Math.max(maxLineWidth, ctx.measureText(currentLine).width);
        totalHeight += lineHeight;
        currentLine = word;
      } else {
        currentLine = testLine;
      }
      
      // Last word in line
      if (index === words.length - 1 && currentLine) {
        maxLineWidth = Math.max(maxLineWidth, ctx.measureText(currentLine).width);
        totalHeight += lineHeight;
      }
    });
  });
  
  // Calculate width: use the wider of current width or content width (with limits)
  const contentWidth = maxLineWidth + padding * 2;
  const calculatedWidth = Math.max(minWidth, Math.min(contentWidth, maxAllowedWidth));
  
  // Ensure minimum height
  const calculatedHeight = Math.max(50, totalHeight);
  
  return {
    width: calculatedWidth,
    height: calculatedHeight
  };
};

/**
 * Determine if a text layer should be treated as a heading
 * @param {Object} layer - The layer object
 * @returns {boolean} - True if the layer is a heading
 */
export const isHeadingLayer = (layer) => {
  if (!layer) return false;
  return (
    layer.name?.toLowerCase().includes('heading') || 
    (layer.fontSize && layer.fontSize >= 32) ||
    layer.fontWeight === 'bold'
  );
};

