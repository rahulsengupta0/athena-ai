import React from 'react';
import { MdBolt, MdTrendingUp, MdAdjust } from 'react-icons/md';

const styles = {
  wrapper: {
    background: '#faf8ff',
    borderRadius: '19px',
    border: '1.2px solid #efeafe',
    padding: '28px 32px 26px 33px',
    boxShadow: '0 1px 10px #ece4fa26',
    margin: '26px 0 18px 0',
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '100%',
  },
  headerRow: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 3 },
  icon: {
    background: '#ebe6ff',
    borderRadius: '12px',
    padding: 8,
    color: '#8570c1',
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    fontWeight: 700,
    fontSize: '1.5rem',
    color: '#23195c',
    margin: 0,
    marginRight: 9
  },
  subtitle: {
    color: '#9c98bd',
    fontWeight: 500,
    fontSize: 15,
    marginLeft: 49,
    marginTop: 1,
    marginBottom: 21,
  },
  insightsRow: {
    width: '100%',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 22,
  },
  insightCard: {
    background: 'white',
    borderRadius: 15,
    padding: '13px 33px 15px 28px',
    boxShadow: '0 1px 10px #efebfa29',
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
    minHeight: 64,
    minWidth: 0,
  },
  insightFlex: { display: 'flex', alignItems: 'center', gap: 13, marginBottom: 5 },
  insightIcon: {
    fontSize: 28,
    background: 'none',
    color: '#3ac281',
  },
  insightTitle: {
    fontWeight: 650,
    fontSize: 16,
    color: '#2a235d',
    margin: 0,
  },
  insightDesc: {
    color: '#848197',
    fontSize: 15,
    marginTop: 0,
    marginLeft: 41,
  },
  insightIconAlt: {
    color: '#7761dc',
    fontSize: 25,
    background: '#ece3fc',
    borderRadius: 9,
    padding: 4,
  }
};

export default function PerformanceInsights() {
  return (
    <div style={styles.wrapper}>
      <div style={styles.headerRow}>
        <span style={styles.icon}>
          <MdBolt size={25} />
        </span>
        <span style={styles.title}>Performance Insights</span>
      </div>
      <div style={styles.subtitle}>AI-powered recommendations to boost productivity</div>
      <div style={styles.insightsRow}>
        {/* Insight left */}
        <div style={styles.insightCard}>
          <div style={styles.insightFlex}>
            <MdTrendingUp style={styles.insightIcon} />
            <span style={styles.insightTitle}>Peak Productivity Hours</span>
          </div>
          <div style={styles.insightDesc}>
            You're most productive between 2-4 PM. Schedule complex tasks during this time.
          </div>
        </div>
        {/* Insight right */}
        <div style={styles.insightCard}>
          <div style={styles.insightFlex}>
            <MdAdjust style={styles.insightIconAlt} />
            <span style={styles.insightTitle}>AI Tool Recommendation</span>
          </div>
          <div style={styles.insightDesc}>
            Try the Brand Builder for consistent visual identity across projects.
          </div>
        </div>
      </div>
    </div>
  );
}
