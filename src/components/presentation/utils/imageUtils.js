/**
 * Utility functions for handling image uploads and processing
 */

/**
 * Load an image from a file and return a promise with image data
 * @param {File} file - The image file to load
 * @returns {Promise<Object>} Promise that resolves with { src, width, height }
 */
import { normalizeImageEffects } from './effectDefaults';

export const loadImageFromFile = (file) => {
  return new Promise((resolve, reject) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      reject(new Error('File must be an image'));
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      reject(new Error('Image size must be less than 10MB'));
      return;
    }

    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new window.Image();
      
      img.onload = () => {
        resolve({
          src: e.target.result,
          width: img.width,
          height: img.height,
        });
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      img.src = e.target.result;
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * Load image metadata from a source string (URL or data URL)
 * @param {string} src
 * @returns {Promise<Object>} Promise resolving to { src, width, height }
 */
export const loadImageFromSource = (src) => {
  return new Promise((resolve, reject) => {
    if (!src) {
      reject(new Error('Image source is required'));
      return;
    }

    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      resolve({
        src,
        width: img.width,
        height: img.height,
      });
    };
    img.onerror = () => {
      reject(new Error('Failed to load image source'));
    };
    img.src = src;
  });
};

/**
 * Create an image layer object
 * @param {Object} imageData - Image data with src, width, height
 * @param {Object} coordinates - Position coordinates { x, y }
 * @param {Object} layout - Layout dimensions for sizing
 * @returns {Object} Image layer object
 */
export const createImageLayer = (imageData, coordinates = {}, layout) => {
  const { src, width: imgWidth, height: imgHeight } = imageData;
  
  // Calculate dimensions to fit within canvas while maintaining aspect ratio
  const maxWidth = layout.width * 0.6; // Max 60% of canvas width
  const maxHeight = layout.height * 0.6; // Max 60% of canvas height
  
  let width = imgWidth;
  let height = imgHeight;
  
  // Scale down if image is too large
  if (width > maxWidth || height > maxHeight) {
    const scale = Math.min(maxWidth / width, maxHeight / height);
    width = width * scale;
    height = height * scale;
  }
  
  const centeredX = Math.max(0, (layout.width - width) / 2);
  const centeredY = Math.max(0, (layout.height - height) / 2);

  return {
    id: `layer-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    type: 'image',
    name: 'Image',
    x: typeof coordinates.x === 'number' ? coordinates.x : Math.round(centeredX),
    y: typeof coordinates.y === 'number' ? coordinates.y : Math.round(centeredY),
    width: Math.round(width),
    height: Math.round(height),
    src: src,
    rotation: 0,
    visible: true,
    effects: normalizeImageEffects(),
  };
};


