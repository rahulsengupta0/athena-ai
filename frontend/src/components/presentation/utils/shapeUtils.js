// Helper function to get shape path points for custom shapes
export const getShapePoints = (shape, width, height) => {
  const w = width;
  const h = height;
  const cx = w / 2;
  const cy = h / 2;

  switch (shape) {
    case 'triangle':
      return [cx, 0, w, h, 0, h];
    case 'right-triangle':
      return [0, 0, w, 0, 0, h];
    case 'diamond':
      return [cx, 0, w, cy, cx, h, 0, cy];
    case 'pentagon': {
      const points = [];
      for (let i = 0; i < 5; i++) {
        const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
        points.push(cx + (w / 2) * Math.cos(angle), cy + (h / 2) * Math.sin(angle));
      }
      return points;
    }
    case 'hexagon': {
      const points = [];
      for (let i = 0; i < 6; i++) {
        const angle = (i * 2 * Math.PI) / 6;
        points.push(cx + (w / 2) * Math.cos(angle), cy + (h / 2) * Math.sin(angle));
      }
      return points;
    }
    case 'star': {
      const points = [];
      const outerRadius = Math.min(w, h) / 2;
      const innerRadius = outerRadius * 0.4;
      for (let i = 0; i < 10; i++) {
        const angle = (i * Math.PI) / 5 - Math.PI / 2;
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        points.push(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle));
      }
      return points;
    }
    case 'heart': {
      return [
        cx, h * 0.7,
        cx - w * 0.25, h * 0.5,
        cx - w * 0.15, h * 0.2,
        cx, h * 0.15,
        cx + w * 0.15, h * 0.2,
        cx + w * 0.25, h * 0.5,
      ];
    }
    case 'arrow-right':
      return [0, h * 0.3, w * 0.7, h * 0.3, w * 0.7, 0, w, cy, w * 0.7, h, w * 0.7, h * 0.7, 0, h * 0.7];
    case 'arrow-left':
      return [w, h * 0.3, w * 0.3, h * 0.3, w * 0.3, 0, 0, cy, w * 0.3, h, w * 0.3, h * 0.7, w, h * 0.7];
    case 'arrow-up':
      return [w * 0.3, h, w * 0.3, h * 0.3, 0, h * 0.3, cx, 0, w, h * 0.3, w * 0.7, h * 0.3, w * 0.7, h];
    case 'arrow-down':
      return [w * 0.3, 0, w * 0.3, h * 0.7, 0, h * 0.7, cx, h, w, h * 0.7, w * 0.7, h * 0.7, w * 0.7, 0];
    case 'line':
      // Horizontal line from left-center to right-center
      return [-w / 2, 0, w / 2, 0];
    default:
      return [];
  }
};

