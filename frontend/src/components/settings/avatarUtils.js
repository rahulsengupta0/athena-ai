import multiavatar from '@multiavatar/multiavatar';
import { createAvatar } from '@dicebear/core';
import * as collection from '@dicebear/collection';

// DiceBear styles mapping - using collection package
const dicebearStyles = {
  adventurer: collection.adventurer,
  avataaars: collection.avataaars,
  bottts: collection.bottts,
  fun: collection.fun,
  micah: collection.micah,
  personas: collection.personas,
  lorelei: collection.lorelei,
};

/**
 * Generate a color based on a string (for consistent avatar colors)
 */
const getColorFromString = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
};

/**
 * Generate a gradient color pair for initials avatars
 */
const getGradientColors = (str) => {
  const hash = Math.abs(getColorFromString(str));
  const colorPairs = [
    ['#6366f1', '#8b5cf6'], // Indigo to Purple
    ['#ec4899', '#f59e0b'], // Pink to Orange
    ['#10b981', '#06b6d4'], // Green to Cyan
    ['#8b5cf6', '#ec4899'], // Purple to Pink
    ['#f59e0b', '#ef4444'], // Orange to Red
    ['#06b6d4', '#3b82f6'], // Cyan to Blue
    ['#6366f1', '#ec4899'], // Indigo to Pink
    ['#10b981', '#6366f1'], // Green to Indigo
  ];
  return colorPairs[hash % colorPairs.length];
};

/**
 * Check if a string is a valid URL
 */
const isValidUrl = (string) => {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
};

/**
 * Get DiceBear style from string identifier
 */
const getDiceBearStyle = (styleName) => {
  return dicebearStyles[styleName] || null;
};

/**
 * Generate avatar using DiceBear
 */
export const generateDiceBearAvatar = (seed, styleName = 'adventurer', size = 128) => {
  const style = getDiceBearStyle(styleName);
  if (!style) {
    return generateAvatarDataUri(seed);
  }

  try {
    const avatar = createAvatar(style, {
      seed: seed || 'default',
      size: size,
      radius: 20,
    });
    return avatar.toDataUri();
  } catch (error) {
    console.error('Error generating DiceBear avatar:', error);
    return generateAvatarDataUri(seed);
  }
};

/**
 * Generate avatar SVG from multiavatar (fallback)
 */
export const generateAvatarSVG = (seed) => {
  if (!seed) seed = 'Default';
  try {
    return multiavatar(seed);
  } catch (error) {
    console.error('Error generating avatar:', error);
    return multiavatar('Default');
  }
};

/**
 * Generate avatar as data URI (for better caching and URL support)
 */
export const generateAvatarDataUri = (seed) => {
  const svg = generateAvatarSVG(seed);
  const base64 = btoa(unescape(encodeURIComponent(svg)));
  return `data:image/svg+xml;base64,${base64}`;
};

/**
 * Get avatar source - handles URLs, seeds, and initials
 * Now supports DiceBear styles via style parameter
 */
export const getAvatarSource = (value, type, style = null) => {
  // If it's a URL, return it directly
  if (isValidUrl(value)) {
    return value;
  }

  // If it's initials, we'll handle it in the component with a gradient background
  if (type === 'initials') {
    return null; // Return null to indicate we should render initials
  }

  // If it's emoji, return null to render emoji
  if (type === 'emoji') {
    return null;
  }

  // If style is specified, use DiceBear
  if (style) {
    return generateDiceBearAvatar(value, style, 128);
  }

  // Otherwise, generate from seed using multiavatar
  return generateAvatarDataUri(value);
};

/**
 * Generate initials from name or string
 */
export const getInitials = (str) => {
  if (!str) return '??';
  const parts = str.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return str.substring(0, 2).toUpperCase();
};

/**
 * Get gradient colors for initials avatar
 */
export const getInitialsColors = (initials) => {
  return getGradientColors(initials);
};

/**
 * Available DiceBear styles
 */
export const DICEBEAR_STYLES = [
  { id: 'adventurer', label: 'Adventurer', value: 'adventurer' },
  { id: 'avataaars', label: 'Classic', value: 'avataaars' },
  { id: 'bottts', label: 'Robot', value: 'bottts' },
  { id: 'fun', label: 'Fun', value: 'fun' },
  { id: 'micah', label: 'Modern', value: 'micah' },
  { id: 'personas', label: 'Professional', value: 'personas' },
  { id: 'lorelei', label: 'Abstract', value: 'lorelei' },
];

