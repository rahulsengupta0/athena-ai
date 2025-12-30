import Konva from 'konva';
import { normalizeImageEffects } from './effectDefaults';

/**
 * Apply image effect values to a Konva node
 * @param {Konva.Image} node
 * @param {Object} effects
 */
export const applyLayerEffectsToNode = (node, effects, scaleFactor = 1) => {
  if (!node) return;

  const normalized = normalizeImageEffects(effects);
  const filters = [];

  if (normalized.brightness !== 0) {
    filters.push(Konva.Filters.Brighten);
    node.brightness(normalized.brightness);
  } else {
    node.brightness(0);
  }

  if (normalized.contrast !== 0) {
    filters.push(Konva.Filters.Contrast);
    node.contrast(normalized.contrast);
  } else {
    node.contrast(0);
  }

  node.saturation(0);
  node.blurRadius(0);

  if (filters.length > 0) {
    node.filters(filters);
    node.cache();
  } else {
    node.filters([]);
    node.clearCache();
  }

  const opacityValue =
    typeof normalized.opacity === 'number'
      ? Math.max(0, Math.min(1, normalized.opacity))
      : 1;
  node.opacity(opacityValue);

  if (normalized.shadow.enabled) {
    node.shadowColor(normalized.shadow.color);
    node.shadowBlur(normalized.shadow.blur * scaleFactor);
    node.shadowOffsetX(normalized.shadow.offsetX * scaleFactor);
    node.shadowOffsetY(normalized.shadow.offsetY * scaleFactor);
    node.shadowOpacity(normalized.shadow.opacity);
  } else {
    node.shadowColor('rgba(0,0,0,0)');
    node.shadowBlur(0);
    node.shadowOffsetX(0);
    node.shadowOffsetY(0);
    node.shadowOpacity(0);
  }

  node.getLayer()?.batchDraw();
};
