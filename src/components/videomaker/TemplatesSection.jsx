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
  },
  playIcon: {
    color: '#906BFF',
    fontSize: 61,
    opacity: 0.52,
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
  },
};

const CATEGORYS = ['All Templates', 'Social Media', 'Business', 'YouTube', 'Music'];
const templates = [
  {
    badge: 'Popular',
    title: 'Social Media Story',
    desc: 'Vertical video template for Instagram and TikTok',
    seconds: '15s',
  },
  {
    badge: 'Pro',
    title: 'Product Showcase',
    desc: 'Professional product demonstration template',
    seconds: '30s',
  },
  {
    badge: 'New',
    title: 'YouTube Intro',
    desc: 'Engaging intro template for YouTube videos',
    seconds: '5s',
  },
];

export default function TemplatesSection() {
  const [cat, setCat] = useState(0);
  const [hovered, setHovered] = useState(null);

  return (
    <>
      <div style={styles.categoryBar}>
        {CATEGORYS.map((c, i) => (
          <button
            key={c}
            style={cat === i ? { ...styles.catTab, ...styles.catTabActive } : styles.catTab}
            onClick={() => setCat(i)}
            disabled={i !== 0}
          >
            {c}
          </button>
        ))}
      </div>
      <div style={styles.grid}>
        {templates.map((tpl, i) => (
          <div
            key={tpl.title}
            style={{
              ...styles.card,
              ...(hovered === i ? styles.cardHover : {})
            }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            {tpl.badge && <span style={styles.badge}>{tpl.badge}</span>}
            <div style={styles.playArea}>
              <MdPlayCircleOutline style={styles.playIcon} />
              <span style={styles.timeBadge}>{tpl.seconds}</span>
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
