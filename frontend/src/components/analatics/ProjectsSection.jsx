import React from 'react';

const styles = {
  main: {
    background: 'white',
    borderRadius: 23,
    padding: '36px 38px 28px 39px',
    boxShadow: '0 2px 18px #e7e2f820',
    minWidth: 420,
    marginTop: '13px'
  },
  title: { fontWeight: 800, color: '#241b47', fontSize: 23, marginBottom: 9 },
  sub: { fontSize: 16, color: '#968bb1', marginBottom: 19 },
  row: {
    display: 'flex',
    alignItems: 'center',
    background: '#fafafd',
    borderRadius: 13,
    marginBottom: 16,
    padding: '18px 27px',
    fontWeight: 700,
    fontSize: 18,
    color: '#2a194a',
    justifyContent: 'space-between'
  },
  chip: {
    width: 16, height: 16, borderRadius: 6, marginRight: 15, background: '#a191ea', display: 'inline-block'
  },
  amount: { color: '#747497', fontWeight: 500, fontSize: 15, marginLeft: 8 },
  pct: { color: '#7e5aff', fontWeight: 800, fontSize: 19 },
  pctLabel: { color: '#b2abce', fontWeight: 600, fontSize: 13, marginLeft: 6 }
};

const projectData = [
  { name: 'Design Projects', count: 45, percent: 45 },
  { name: 'Content Writing', count: 28, percent: 28 },
  { name: 'Video Creation', count: 18, percent: 18 },
  { name: 'Image Editing', count: 9, percent: 9 },
];

export default function ProjectsSection() {
  return (
    <div style={styles.main}>
      <div style={styles.title}>Project Performance</div>
      <div style={styles.sub}>
        Detailed breakdown of project metrics and success rates
      </div>
      {projectData.map(proj => (
        <div style={styles.row} key={proj.name}>
          <span>
            <span style={styles.chip}></span>
            {proj.name}
            <span style={styles.amount}>{proj.count} projects completed</span>
          </span>
          <span>
            <span style={styles.pct}>{proj.percent}%</span>
            <span style={styles.pctLabel}>of total</span>
          </span>
        </div>
      ))}
    </div>
  );
}
