import React from 'react';
import { MdBolt } from 'react-icons/md';

const styles = {
  grid: {
    display: 'flex',
    flexDirection: 'column',
    gap: 28,
    marginTop: 17,
  },
  card: {
    background: 'white',
    borderRadius: 20,
    boxShadow: '0 2px 18px #e7e2f820',
    padding: '32px 38px',
    display: 'flex',
    flexDirection: 'column',
    fontWeight: 700,
    minWidth: 400,
    marginBottom: 8,
  },
  titleRow: { display: 'flex', alignItems: 'center', gap: 13, marginBottom: 6 },
  icon: { color: '#846acf', fontSize: 27, background: '#ece3fc', borderRadius: 10, padding: 8 },
  toolName: { fontWeight: 800, fontSize: 21 },
  subtitle: { color: '#9b91c9', marginBottom: 13, fontWeight: 500 },
  meta: { color: '#a397c5', fontWeight: 700, fontSize: 15 },
  progressBarBg: { background: '#f2eefb', borderRadius: 8, width: '100%', height: 7, marginTop: 10, marginBottom: 6 },
  progressBar: { height: 7, background: '#906bff', borderRadius: 8, transition: 'width 0.32s' },
  effRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 2, fontWeight: 700, fontSize: 16 },
  small: { fontWeight: 600, fontSize: 14, color: '#9690b1' }
};

const tools = [
  {
    name: 'AI Design Generator',
    meta: '156 projects created',
    percent: 89,
    efficiency: '94% efficiency',
    avgQuality: '94%',
    lastUsed: '2 hours ago',
  },
  {
    name: 'Content Writer',
    meta: '134 projects created',
    percent: 76,
    efficiency: '91% efficiency',
    avgQuality: '91%',
    lastUsed: '2 hours ago',
  },
  {
    name: 'Image Editor',
    meta: '98 projects created',
    percent: 63,
    efficiency: '87% efficiency',
    avgQuality: '87%',
    lastUsed: '2 hours ago',
  },
  {
    name: 'Video Maker',
    meta: '67 projects created',
    percent: 45,
    efficiency: '83% efficiency',
    avgQuality: '83%',
    lastUsed: '2 hours ago',
  },
];

export default function AIToolsSection() {
  return (
    <div style={styles.grid}>
      {tools.map((tool, idx) => (
        <div style={styles.card} key={tool.name}>
          <div style={styles.titleRow}>
            <span style={styles.icon}><MdBolt /></span>
            <span style={styles.toolName}>{tool.name}</span>
          </div>
          <div style={styles.meta}>{tool.meta}</div>
          <div className={styles.subtitle}>Usage Rate</div>
          <div style={styles.progressBarBg}>
            <div style={{ ...styles.progressBar, width: `${tool.percent}%` }} />
          </div>
          <div style={styles.effRow}>
            <span>{tool.efficiency}</span>
            <span style={styles.small}>{tool.percent}%</span>
          </div>
          <div style={styles.small}>Average quality: {tool.avgQuality}</div>
          <div style={styles.small}>Last used {tool.lastUsed}</div>
        </div>
      ))}
    </div>
  );
}
