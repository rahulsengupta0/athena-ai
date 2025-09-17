import React, { useState } from 'react';
import {
  MdAutoAwesome,
  MdStar,
  MdPalette,
  MdOutlineCrop,
  MdPhotoFilter,
} from 'react-icons/md';

const styles = {
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit,minmax(315px,1fr))',
    gap: 32,
    margin: '30px 0',
  },
  card: {
    background: 'white',
    borderRadius: 18,
    boxShadow: '0 2px 24px rgba(217,210,237,0.11)',
    border: 'none',
    padding: '2rem 1.5rem 1.3rem 1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: 18,
    alignItems: 'flex-start',
    minHeight: 190,
    position: 'relative',
    transition: 'box-shadow 0.23s, transform 0.2s',
    cursor: 'pointer',
  },
  cardHover: {
    boxShadow: '0 10px 40px 6px #d7d3f5b1',
    transform: 'translateY(-8px) scale(1.036)',
  },
  cardIcon: { background: '#ebe6ff', borderRadius: 12, padding: 8 },
  cardBadge: {
    fontSize: 13,
    fontWeight: 700,
    borderRadius: 8,
    padding: '2px 12px',
    background: '#f5f4fb',
    color: '#7e5aff',
    marginRight: 8,
  },
  cardBadgeDark: {
    background: '#ececec',
    color: '#757075',
  },
  cardTitle: { fontWeight: 700, fontSize: 20, margin: 0, marginTop: 3 },
  cardDesc: { color: '#767082', margin: '4px 0 12px 0', fontSize: 15 },
  cardAction: {
    background: '#906BFF',
    width: '100%',
    color: 'white',
    fontWeight: 700,
    fontSize: 17,
    border: 'none',
    borderRadius: 10,
    padding: '12px 0',
    transition: 'background 0.2s, filter 0.2s',
    marginTop: 12,
    cursor: 'pointer',
  },
  cardActionHover: {
    background: '#7442cc',
    filter: 'brightness(1.06)',
  },
};

const CARD_ICONS = {
  remove: <MdAutoAwesome size={32} color="#906BFF" />,
  enhance: <MdStar size={32} color="#906BFF" />,
  color: <MdPalette size={32} color="#906BFF" />,
  crop: <MdOutlineCrop size={32} color="#906BFF" />,
  style: <MdPhotoFilter size={32} color="#906BFF" />,
};

const toolCards = [
  {
    key: 'remove',
    badge: 'Pro',
    title: 'AI Background Removal',
    desc: 'Remove backgrounds instantly with AI precision',
  },
  {
    key: 'enhance',
    badge: 'Popular',
    title: 'Smart Enhance',
    desc: 'Automatically improve image quality and lighting',
  },
  {
    key: 'color',
    badge: 'New',
    title: 'Color Grading',
    desc: 'Professional color correction and styling',
  },
  {
    key: 'crop',
    badge: 'Beta',
    title: 'Smart Crop',
    desc: 'AI-powered cropping for perfect composition',
  },
  {
    key: 'style',
    badge: 'Pro',
    title: 'Style Transfer',
    desc: 'Apply artistic styles using neural networks',
  },
];

export default function ToolCards() {
  const [hovered, setHovered] = useState(null);

  return (
    <div style={styles.cardGrid}>
      {toolCards.map((tool, i) => (
        <div
          key={tool.key}
          style={{
            ...styles.card,
            ...(hovered === i ? styles.cardHover : {}),
          }}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(null)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={styles.cardIcon}>{CARD_ICONS[tool.key]}</span>
            <span
              style={{
                ...styles.cardBadge,
                ...(tool.badge === 'Beta' ? styles.cardBadgeDark : {}),
              }}
            >
              {tool.badge}
            </span>
          </div>
          <span style={styles.cardTitle}>{tool.title}</span>
          <span style={styles.cardDesc}>{tool.desc}</span>
          <button
            style={{
              ...styles.cardAction,
              ...(hovered === i ? styles.cardActionHover : {}),
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#7442cc')}
            onMouseLeave={e => (e.currentTarget.style.background = '#906BFF')}
          >
            Try Now
          </button>
        </div>
      ))}
    </div>
  );
}
