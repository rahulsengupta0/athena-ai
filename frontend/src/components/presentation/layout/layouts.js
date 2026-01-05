export const PRESENTATION_LAYOUTS = [
  {
    id: '16-9',
    name: 'Widescreen 16:9',
    description: 'Perfect for desktops, projectors, and modern displays.',
    aspectLabel: '16:9',
    width: 1920,
    height: 1080,
    accent: '#6366f1',
    icon: 'desktop',
  },
  {
    id: '9-16',
    name: 'Vertical 9:16',
    description: 'Optimized for phones, reels, and story-style viewing.',
    aspectLabel: '9:16',
    width: 1080,
    height: 1920,
    accent: '#ec4899',
    icon: 'phone',
  },
  {
    id: '4-3',
    name: 'Classic 4:3',
    description: 'Ideal for traditional screens and printable decks.',
    aspectLabel: '4:3',
    width: 1600,
    height: 1200,
    accent: '#14b8a6',
    icon: 'classic',
  },
];

export const getLayoutById = (id) =>
  PRESENTATION_LAYOUTS.find((layout) => layout.id === id) || PRESENTATION_LAYOUTS[0];

