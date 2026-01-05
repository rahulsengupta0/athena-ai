import React, { useState } from 'react';
import { MdBarChart } from 'react-icons/md';
import OverviewSection from './OverviewSection';
import ProjectsSection from './ProjectsSection';
import AIToolsSection from './AIToolsSection';
import PerformanceInsights from './PerformanceInsights';

const styles = {
  page: {
    minHeight: '100vh',
    background: '#fafafd',
    padding: '2.6rem 4%',
    fontFamily: 'Inter, sans-serif',
  },
  headerRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between', // key for right alignment!
    marginBottom: 5,
    gap: 15,
  },
  icon: { background: '#ece7ff', borderRadius: '19px', padding: 10 },
  pageTitle: { fontWeight: 800, fontSize: 29, margin: 0 },
  subtitle: { color: '#999', fontSize: 16, marginLeft: 3 },
  subBar: { margin: '24px 0 28px 0', display: 'flex', gap: 18 },
  subTab: {
    fontWeight: 700,
    fontSize: 18,
    border: 'none',
    outline: 'none',
    padding: '12px 34px',
    borderRadius: 14,
    background: '#f5f4fb',
    color: '#8570c1',
    cursor: 'pointer',
    transition: 'background 0.18s,color 0.2s',
    marginRight: 5,
  },
  subTabActive: {
    background: 'white',
    color: '#1a144c',
    boxShadow: '0 4px 16px #ece9f5',
    border: '1.5px solid #dedbf5',
  },
  rightBtns: {
    display: 'flex',
    gap: 12,
    alignItems: 'center'
  },
  drop: {
    background: 'white',
    color: '#757095',
    borderRadius: 10,
    border: '1px solid #ebe9f5',
    padding: '10px 20px',
    fontWeight: 600,
    fontSize: 15,
    marginRight: 6,
    cursor: 'pointer'
  },
  exportBtn: {
    border: '1.3px solid #ebe9f5',
    padding: '10px 24px',
    borderRadius: 10,
    color: '#7f69e9',
    fontWeight: 700,
    background: 'white',
    fontSize: 15,
    cursor: 'pointer'
  }
};

const TABS = ['Overview', 'Projects', 'AI Tools', 'Team'];

export default function AnalyticsDashboard() {
    const [tab, setTab] = useState('Overview');
  
    return (
      <div style={styles.page}>
        {/* Header, now flexes both sides correctly */}
        <div style={styles.headerRow}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
            <span style={styles.icon}>
              <MdBarChart size={33} color="#906bff" />
            </span>
            <div>
              <div style={styles.pageTitle}>Analytics Dashboard</div>
              <div style={styles.subtitle}>Track your productivity and AI usage insights</div>
            </div>
          </div>
          <div style={styles.rightBtns}>
            <select style={styles.drop} value="Last 7 days" readOnly>
              <option>Last 7 days</option>
            </select>
            <button style={styles.exportBtn}>⭳ Export</button>
          </div>
        </div>

      {/* Subtabs */}
      <div style={styles.subBar}>
        {TABS.map(t => (
          <button
            key={t}
            style={tab === t ? { ...styles.subTab, ...styles.subTabActive } : styles.subTab}
            onClick={() => setTab(t)}
            disabled={t === 'Team'} // Only the first 3 tabs are implemented in this sample
          >
            {t}
          </button>
        ))}
      </div>

      {/* Content views */}
      {tab === 'Overview' && <OverviewSection />}
      {tab === 'Projects' && <ProjectsSection />}
      {tab === 'AI Tools' && <AIToolsSection />}
      {tab === 'Team' && (
        <div style={{
          background: 'white',
          borderRadius: 25,
          padding: 60,
          marginTop: 30,
          minHeight: 220,
          color: '#aaa',
          fontWeight: 600,
          fontSize: 21,
          textAlign: 'center',
        }}>Team UI not implemented in this demo</div>
      )}
      <PerformanceInsights/>
    </div>
  );
}
