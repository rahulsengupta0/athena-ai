import React from 'react';
import { MdDonutLarge, MdAccessTime } from 'react-icons/md';

const styles = {
  wrapper: {
    overflowX: 'hidden',
    width: '100%',
  },
  statRow: {
    display: 'flex',
    gap: 32,
    marginBottom: 30,
    flexWrap: 'wrap',
  },
  statCard: {
    background: 'white',
    borderRadius: 20,
    boxShadow: '0 2px 18px #f6f2fd30',
    padding: '30px 38px',
    minWidth: 210,
    width: 'calc(25% - 24px)',
    flex: '1 1 210px',
    display: 'flex',
    flexDirection: 'column',
    minHeight: 80,
    fontWeight: 700,
    boxSizing: 'border-box',
  },
  statNum: { fontSize: 29, color: '#332b48', marginBottom: 4 },
  statLabel: { color: '#82829e', fontWeight: 700, fontSize: 15, marginBottom: 6 },
  statTrend: { color: '#2dbe74', fontSize: 15, marginTop: 6, fontWeight: 700 },
  grid: {
    display: 'flex',
    gap: 27,
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  breakdown: {
    background: 'white',
    borderRadius: 20,
    boxShadow: '0 2px 18px #e7e2f820',
    flex: 2.1,
    minWidth: 370,
    padding: '30px 33px 23px 33px',
    marginTop: 13,
    marginRight: 7,
  },
  breakdownHead: { fontWeight: 800, color: '#241b47', fontSize: 23, marginBottom: 9 },
  breakdownSub: { fontSize: 15, color: '#968bb1', marginBottom: 19 },
  breakBarBg: {
    background: '#f3f0fc',
    borderRadius: 8,
    width: '100%',
    height: 8,
    marginTop: 5,
  },
  breakBar: {
    height: 8,
    borderRadius: 8,
    background: '#906bff',
    transition: 'width 0.35s',
  },
  breakdownRow: {
    fontWeight: 600,
    color: '#2a194a',
    fontSize: 15,
    marginBottom: 24,
    display: 'flex',
    justifyContent: 'space-between',
  },
  activity: {
    background: 'white',
    borderRadius: 20,
    boxShadow: '0 2px 18px #e7e2f820',
    flex: 2.1,
    minWidth: 370,
    padding: '28px 32px 22px 32px',
    marginTop: 13,
    marginLeft: 6,
  },
  activityHeadRow: { display: 'flex', alignItems: 'center', gap: 11 },
  activityIcon: {
    background: '#ece3fd',
    borderRadius: 10,
    color: '#8169ea',
    fontSize: 24,
    padding: 4,
  },
  activityTitle: { fontWeight: 800, fontSize: 22, margin: 0 },
  activitySubtitle: { color: '#847db0', fontSize: 15, marginBottom: 16, marginLeft: 2 },
  activityItem: {
    background: '#fafafd',
    borderRadius: 10,
    padding: '13px 17px 10px 18px',
    marginBottom: 13,
    fontWeight: 600,
    fontSize: 15,
    color: '#372c57',
  },
  activityQuality: {
    color: '#50c27e',
    fontWeight: 700,
    fontSize: 13,
    background: '#f2fbf7',
    borderRadius: 8,
    padding: '1px 8px',
    marginRight: 13,
    marginTop: 4,
  },
  activitySub: { color: '#8689a4', fontWeight: 500, fontSize: 14, marginTop: 3 },
};

const breakdownData = [
  { label: 'Design Projects', percent: 45 },
  { label: 'Content Writing', percent: 28 },
  { label: 'Video Creation', percent: 18 },
  { label: 'Image Editing', percent: 9 },
];
const activityItems = [
  {
    title: 'Generated design template',
    sub: 'E-commerce Landing',
    quality: '96% quality',
    ago: '2 hours ago',
  },
  {
    title: 'Enhanced product photos',
    sub: 'Brand Assets',
    quality: '94% quality',
    ago: '4 hours ago',
  },
  {
    title: 'Created video intro',
    sub: 'YouTube Channel',
    quality: '98% quality',
    ago: '1 day ago',
  },
  {
    title: 'Generated blog content',
    sub: 'Content Marketing',
    quality: '92% quality',
    ago: '2 days ago',
  },
];

export default function OverviewSection() {
  return (
    <div style={styles.wrapper}>
      {/* Top Stats */}
      <div style={styles.statRow}>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>Total Projects</span>
          <span style={styles.statNum}>247</span>
          <span style={styles.statTrend}>▲ +23%</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>AI Generations</span>
          <span style={styles.statNum}>1,847</span>
          <span style={styles.statTrend}>▲ +45%</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>Time Saved</span>
          <span style={styles.statNum}>127h</span>
          <span style={styles.statTrend}>▲ +67%</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>Success Rate</span>
          <span style={styles.statNum}>94.2%</span>
          <span style={styles.statTrend}>▲ +2.1%</span>
        </div>
      </div>
      <div style={styles.grid}>
        {/* Breakdown */}
        <div style={styles.breakdown}>
          <div style={styles.breakdownHead}>
            <MdDonutLarge style={{ marginRight: 8, verticalAlign: 'middle', color: '#7b6ae6', fontSize: 25 }} />
            Project Breakdown
          </div>
          <div style={styles.breakdownSub}>Distribution of project types this month</div>
          {breakdownData.map((item) => (
            <div key={item.label}>
              <div style={styles.breakdownRow}>
                <span>{item.label}</span>
                <span>{item.percent}%</span>
              </div>
              <div style={styles.breakBarBg}>
                <div style={{ ...styles.breakBar, width: `${item.percent}%` }} />
              </div>
            </div>
          ))}
        </div>
        {/* Activity */}
        <div style={styles.activity}>
          <div style={styles.activityHeadRow}>
            <span style={styles.activityIcon}><MdAccessTime /></span>
            <span style={styles.activityTitle}>Recent Activity</span>
          </div>
          <div style={styles.activitySubtitle}>Latest AI-powered creations</div>
          {activityItems.map((item, i) => (
            <div key={i} style={styles.activityItem}>
              <span style={{ color: '#7d7cff', fontSize: 16, marginRight: 7 }}>⬤</span>
              {item.title}
              <div style={styles.activitySub}>{item.sub}</div>
              <span style={styles.activityQuality}>{item.quality}</span>
              <span style={{ color: '#8d8aab', fontWeight: 500, marginLeft: 11, fontSize: 13 }}>{item.ago}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
