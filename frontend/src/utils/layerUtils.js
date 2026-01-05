// src/utils/layerUtils.js

const DEFAULT_SHADOW = {
  enabled: false,
  x: 0,
  y: 0,
  blur: 0,
  spread: 0,
  color: '#000000',
  opacity: 50,
};

// Common layer style properties
const getCommonSettings = (layer) => ({
  brightness: layer.brightness ?? 100,
  contrast: layer.contrast ?? 100,
  blur: layer.blur ?? 0,
  opacity: layer.opacity ?? 100,
  shadows: layer.shadows || DEFAULT_SHADOW,
});

// Main function to extract settings based on layer type
export const getLayerSettings = (layer, prevDrawingSettings = {}) => {
  const common = getCommonSettings(layer);

  switch (layer.type) {
    case 'text':
      return {
        fontSize: layer.fontSize || 16,
        fontFamily: layer.fontFamily || 'Arial',
        fontWeight: layer.fontWeight || 'normal',
        fontStyle: layer.fontStyle || 'normal',
        textDecoration: layer.textDecoration || 'none',
        color: layer.color || '#000000',
        textAlign: layer.textAlign || 'left',
        ...common,
      };

    case 'shape':
      return {
        fillColor: layer.fillColor || '#3182ce',
        strokeColor: layer.strokeColor || '#000000',
        strokeWidth: layer.strokeWidth ?? 1,
        fillType: layer.fillType || 'color',
        fillImageSrc: layer.fillImageSrc || null,
        fillImageFit: layer.fillImageFit || 'cover',
        ...common,
      };

    case 'image':
      return {
        saturation: layer.saturation ?? 100,
        strokeColor: layer.strokeColor || '#000000',
        strokeWidth: layer.strokeWidth ?? 0,
        strokeStyle: layer.strokeStyle || 'solid',
        cornerRadius: layer.cornerRadius ?? 4,
        animation: layer.animation || 'none',
        ...common,
      };

    case 'drawing':
      return {
        ...prevDrawingSettings,
        brushSize: layer.brushSize || 5,
        brushColor: layer.color || '#000000',
        drawingMode: layer.mode || 'brush',
        ...common,
      };

    default:
      return common;
  }
};
