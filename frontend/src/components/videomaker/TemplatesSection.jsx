import React, { useState } from 'react';
import { MdPlayCircleOutline } from 'react-icons/md';

const styles = {
  categoryBar: {
    display: 'flex',
    gap: 13,
    margin: '12px 0 24px 3px',
  },
  catTab: {
    fontWeight: 700,
    fontSize: 15,
    border: 'none',
    outline: 'none',
    padding: '8px 15px',
    borderRadius: 10,
    background: '#f5f4fb',
    color: '#a39eca',
    cursor: 'pointer',
    marginRight: 4,
  },
  catTabActive: {
    background: '#ebe6ff',
    color: '#7e5aff',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit,minmax(370px,1fr))',
    gap: 31,
    marginTop: 10,
    width: '100%',
  },
  card: {
    background: 'white',
    borderRadius: 16,
    boxShadow: '0 2px 18px #ede6ff33',
    border: 'none',
    padding: '2rem 1.35rem 1.15rem 1.35rem',
    display: 'flex',
    flexDirection: 'column',
    minHeight: 275,
    gap: 10,
    position: 'relative',
    cursor: 'pointer',
    transition: 'box-shadow 0.22s, transform 0.16s',
  },
  cardHover: {
    boxShadow: '0 8px 38px 8px #cfc0ff49',
    transform: 'scale(1.03) translateY(-3px)',
  },
  badge: {
    position: 'absolute',
    top: 18,
    right: 22,
    fontSize: 13,
    fontWeight: 700,
    borderRadius: 8,
    padding: '2px 12px',
    background: '#f5f4fb',
    color: '#7e5aff',
    zIndex: 2,
  },
  playArea: {
    width: '100%',
    height: 157,
    background: '#f4f2fc',
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    position: 'relative',
    overflow: 'hidden',
    transition: 'transform 0.3s ease',
  },
  playIcon: {
    color: '#906BFF',
    fontSize: 61,
    opacity: 0.52,
    transition: 'transform 0.3s ease',
  },
  timeBadge: {
    position: 'absolute',
    left: 13,
    bottom: 7,
    padding: '2px 7px',
    background: 'black',
    color: 'white',
    fontWeight: 600,
    fontSize: 13,
    borderRadius: 7,
    opacity: 0.80,
  },
  cardTitle: { fontWeight: 700, fontSize: 20, margin: 0 },
  cardDesc: { color: '#7a7a84', margin: '8px 0 8px 0', fontSize: 15 },
  cardAction: {
    background: '#906BFF',
    width: '100%',
    color: 'white',
    fontWeight: 700,
    fontSize: 17,
    border: 'none',
    borderRadius: 9,
    padding: '13px 0',
    transition: 'background 0.19s, filter 0.21s',
    marginTop: 9,
    cursor: 'pointer',
  },
  cardActionHover: {
    background: '#7442cc',
    filter: 'brightness(1.08)',
    boxShadow: '0 0 12px rgba(116, 66, 204, 0.4)',
  },
};

const CATEGORYS = ['All Templates', 'Social Media', 'Business', 'YouTube', 'Music'];

const templatesByCategory = {
  'All Templates': [
    {
      badge: 'Popular',
      title: 'Social Media Story',
      desc: 'Vertical video template for Instagram and TikTok',
      seconds: '15s',
      gradient: 'linear-gradient(135deg, #F6F0FF 0%, #ECE5FF 100%)',
    },
    {
      badge: 'Pro',
      title: 'Product Showcase',
      desc: 'Professional product demonstration template',
      seconds: '30s',
      gradient: '#f4f2fc',
    },
    {
      badge: 'New',
      title: 'YouTube Intro',
      desc: 'Engaging intro template for YouTube videos',
      seconds: '5s',
      gradient: '#f4f2fc',
    },
  ],
  'Social Media': [
    {
      badge: 'Popular',
      title: 'Instagram Reel',
      desc: 'Reel template for Instagram',
      seconds: '10s',
      gradient: 'linear-gradient(135deg, #F6F0FF 0%, #ECE5FF 100%)',
    },
    {
      badge: 'Popular',
      title: 'TikTok Trends',
      desc: 'Trending TikTok template',
      seconds: '8s',
      gradient: '#f4f2fc',
    },
    {
      badge: '',
      title: 'Snap Story',
      desc: 'Snapchat story template',
      seconds: '12s',
      gradient: '#ece5ff',
    },
  ],
  'Business': [
    {
      badge: 'Pro',
      title: 'Product Showcase',
      desc: 'Professional product demonstration template',
      seconds: '30s',
      gradient: '#f4f2fc',
    },
    {
      badge: 'Pro',
      title: 'Business Pitch',
      desc: 'Perfect for new business pitches',
      seconds: '35s',
      gradient: '#e4e3fc',
    },
    {
      badge: '',
      title: 'Team Intro',
      desc: 'Introduce your team members',
      seconds: '28s',
      gradient: '#ebe6ff',
    },
  ],
  'YouTube': [
    {
      badge: 'New',
      title: 'YouTube Intro',
      desc: 'Engaging intro template for YouTube videos',
      seconds: '5s',
      gradient: '#f4f2fc',
    },
    {
      badge: 'New',
      title: 'YouTube Quick Facts',
      desc: 'Short video for quick info',
      seconds: '7s',
      gradient: '#ece5ff',
    },
    {
      badge: '',
      title: 'Subscribe Button',
      desc: 'Custom animation for subscribe CTA',
      seconds: '4s',
      gradient: '#ebe6ff',
    },
  ],
  'Music': [
    {
      badge: '',
      title: 'Music Lyric Story',
      desc: 'Lyrics with cool motion graphics',
      seconds: '18s',
      gradient: '#f4f2fc',
    },
    {
      badge: 'Hot',
      title: 'Artist Highlight',
      desc: 'Spotlight on new artists',
      seconds: '21s',
      gradient: '#ece5ff',
    },
    {
      badge: '',
      title: 'Track Reveal',
      desc: 'Reveal a new music track',
      seconds: '14s',
      gradient: '#ebe6ff',
    },
  ],
};

export default function TemplatesSection() {
  const [cat, setCat] = useState('All Templates');
  const [hovered, setHovered] = useState(null);

  return (
    <>
      <div style={styles.categoryBar}>
        {CATEGORYS.map((c) => (
          <button
            key={c}
            style={cat === c ? { ...styles.catTab, ...styles.catTabActive } : styles.catTab}
            onClick={() => setCat(c)}
          >
            {c}
          </button>
        ))}
      </div>
      <div style={styles.grid}>
        {templatesByCategory[cat].map((tpl, i) => (
          <div
            key={tpl.title}
            style={{
              ...styles.card,
              ...(hovered === i ? styles.cardHover : {}),
            }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            {tpl.badge && <span style={styles.badge}>{tpl.badge}</span>}
            <div 
              style={{
                ...styles.playArea,
                background: tpl.gradient,
                transform: hovered === i ? 'scale(1.02)' : 'scale(1)',
                position: 'relative',
              }}
            >
              <MdPlayCircleOutline
                style={{
                  ...styles.playIcon,
                  transform: hovered === i ? 'scale(1.15)' : 'scale(1)',
                  position: 'relative',
                  zIndex: 2,
                }}
              />
              <span style={{
                ...styles.timeBadge,
                borderRadius: '50%',
                background: 'linear-gradient(135deg,#8A4DFF, #C29CFF)',
                padding: '7px 0',
                width: 32,
                height: 32,
                textAlign: 'center',
                fontWeight: 700,
                boxShadow: '0 0 8px #906bff44',
                position: 'absolute',
                left: 13,
                bottom: 7,
                opacity: 0.9,
              }}>
                {tpl.seconds}
              </span>
            </div>
            <div style={styles.cardTitle}>{tpl.title}</div>
            <div style={styles.cardDesc}>{tpl.desc}</div>
            <button
              style={{
                ...styles.cardAction,
                ...(hovered === i ? styles.cardActionHover : {}),
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#7442cc')}
              onMouseLeave={e => (e.currentTarget.style.background = '#906BFF')}
            >
              Use Template
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
