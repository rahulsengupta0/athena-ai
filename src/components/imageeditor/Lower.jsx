import React, { useState } from 'react';
import { MdFilterAlt } from 'react-icons/md';

const styles = {
  wrapper: {
    background: '#faf8ff',
    borderRadius: '20px',
    border: '1.5px solid #efeafe',
    padding: '32px 24px 24px 32px',
    margin: '18px 0',
    boxShadow: '0 1px 10px #ece4fa33',
    maxWidth: '100%',
    overflowX: 'auto',
  },
  headerRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 11,
    marginBottom: 2,
  },
  icon: {
    background: '#ebe6ff',
    borderRadius: '12px',
    padding: 8,
    color: '#8570c1',
  },
  title: {
    fontWeight: 700,
    fontSize: '1.6rem',
    color: '#23195c',
    margin: 0,
  },
  subtitle: {
    color: '#928bb3',
    marginLeft: 51,
    marginTop: 2,
    marginBottom: 18,
    fontWeight: 500,
    fontSize: 15,
  },
  effectsRow: {
    display: 'flex',
    gap: 22,
    marginTop: 9,
  },
  effectCard: {
    background: 'white',
    borderRadius: '18px',
    minWidth: 158,
    minHeight: 98,
    maxWidth: 170,
    border: '1.5px solid #f2eefb',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 1px 8px #ebe6ff50',
    cursor: 'pointer',
    transition: 'box-shadow 0.19s, transform 0.16s',
    marginRight: 3,
    marginBottom: 2,
  },
  effectCardHover: {
    boxShadow: '0 6px 30px #cfc0ff44',
    transform: 'scale(1.04) translateY(-2px)',
    border: '1.5px solid #e3d5fa',
  },
  effectIcon: {
    width: 34,
    height: 34,
    borderRadius: 9,
    background: '#efeafd',
    marginBottom: 11,
  },
  effectLabel: {
    fontSize: 17,
    fontWeight: 500,
    color: '#29204b',
    marginTop: 1,
  },
};

const EFFECTS = [
  'Vintage', 'B&W', 'Sepia', 'Vibrant', 'Soft', 'Dramatic'
];

export const Lower = () => {
  const [hovered, setHovered] = useState(null);

  return (
    <div style={styles.wrapper}>
      <div style={styles.headerRow}>
        <span style={styles.icon}>
          <MdFilterAlt size={26} />
        </span>
        <span style={styles.title}>Quick Effects</span>
      </div>
      <div style={styles.subtitle}>Apply popular effects with one click</div>
      <div style={styles.effectsRow}>
        {EFFECTS.map((effect, idx) => (
          <div
            key={effect}
            style={{
              ...styles.effectCard,
              ...(hovered === idx ? styles.effectCardHover : {}),
            }}
            onMouseEnter={() => setHovered(idx)}
            onMouseLeave={() => setHovered(null)}
          >
            <div style={styles.effectIcon} />
            <div style={styles.effectLabel}>{effect}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
