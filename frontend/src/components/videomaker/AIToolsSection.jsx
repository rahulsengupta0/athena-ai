import React from 'react';
import { MdAutoAwesome, MdMusicNote, MdTextFields, MdStar } from 'react-icons/md';

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 34,
    marginTop: 27,
  },
  card: {
    background: 'white',
    borderRadius: 19,
    boxShadow: '0 2px 16px #ede9fd38',
    border: '1.3px solid #efeafe',
    padding: '26px 32px 24px 26px',
    display: 'flex',
    flexDirection: 'column',
    minHeight: 124,
    marginBottom: 2,
    marginRight: 2,
  },
  headerRow: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 },
  icon: { color: '#906BFF', fontSize: 33, marginRight: 8 },
  cardTitle: { fontWeight: 700, fontSize: 20, margin: 0 },
  cardDesc: { color: '#8177a2', margin: '4px 0 13px 0', fontSize: 15 },
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
  }
};

const tools = [
  {
    icon: <MdAutoAwesome style={styles.icon} />,
    title: 'Auto-Edit',
    desc: 'AI automatically cuts and edits your footage',
  },
  {
    icon: <MdMusicNote style={styles.icon} />,
    title: 'Smart Audio',
    desc: 'Perfect music sync and sound enhancement',
  },
  {
    icon: <MdTextFields style={styles.icon} />,
    title: 'Auto Subtitles',
    desc: 'Generate accurate captions instantly',
  },
  {
    icon: <MdStar style={styles.icon} />,
    title: 'Style Transfer',
    desc: 'Apply cinematic styles with AI',
  },
];

export default function AIToolsSection() {
  return (
    <div style={styles.grid}>
      {tools.map((tool, i) => (
        <div style={styles.card} key={i}>
          <div style={styles.headerRow}>
            {tool.icon}
            <div style={styles.cardTitle}>{tool.title}</div>
          </div>
          <div style={styles.cardDesc}>{tool.desc}</div>
          <button style={styles.cardAction}>Try Now</button>
        </div>
      ))}
    </div>
  );
}
