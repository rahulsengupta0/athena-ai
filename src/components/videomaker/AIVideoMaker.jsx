import React, { useState } from 'react';
import { MdOutlineVideoCameraBack, MdUploadFile } from 'react-icons/md';
import TemplatesSection from './TemplatesSection';
import VideoEditorSection from './VideoEditorSection';
import AIToolsSection from './AIToolsSection';

const styles = {
  page: {
    minHeight: '100vh',
    background: '#fafafd',
    padding: '2rem 4% 2rem 3%',
    fontFamily: 'Inter, sans-serif',
  },
  headerRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    flexWrap: 'wrap',
  },
  titleRegion: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
  },
  iconRound: {
    borderRadius: '50%',
    background: '#ebe6ff',
    padding: 8,
    display: 'inline-flex',
  },
  headTitle: {
    fontWeight: 800,
    fontSize: 29,
    margin: 0,
  },
  subTitle: {
    color: '#999',
    fontSize: 16,
    fontWeight: 400,
    marginLeft: 4,
  },
  btnRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  recording: {
    background: '#ffe6e6',
    color: '#ff5858',
    padding: '2px 12px',
    borderRadius: 32,
    fontWeight: 700,
    marginRight: 7,
    fontSize: 13,
  },
  uploadBtn: {
    background: 'white',
    border: '1.5px solid #dedbf5',
    borderRadius: 12,
    padding: '8px 20px',
    fontWeight: 700,
    color: '#906BFF',
    fontSize: 15,
    cursor: 'pointer',
    display: 'flex',
    gap: 6,
    alignItems: 'center',
  },
  actionBtn: {
    background: '#906BFF',
    border: 'none',
    color: 'white',
    borderRadius: 12,
    padding: '10px 24px',
    fontWeight: 700,
    fontSize: 16,
    cursor: 'pointer',
    marginLeft: 12,
    display: 'flex',
    gap: 8,
    alignItems: 'center',
  },
  tabBar: {
    margin: '24px 0 8px 0',
    display: 'flex',
    gap: 13,
  },
  tab: {
    fontWeight: 700,
    fontSize: 17,
    border: 'none',
    outline: 'none',
    padding: '9px 26px',
    borderRadius: 15,
    background: '#f5f4fb',
    color: '#8570c1',
    cursor: 'pointer',
    transition: 'background 0.18s,color 0.2s',
    marginRight: 7,
  },
  tabActive: {
    background: 'white',
    color: '#1a144c',
    boxShadow: '0 4px 16px #ebe9f5',
    border: '1.5px solid #dedbf5',
  },
};

const TABS = ['Templates', 'Editor', 'Recent', 'AI Tools'];

export default function AIVideoMaker() {
  const [tab, setTab] = useState('Templates');

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.headerRow}>
        <div style={styles.titleRegion}>
          <span style={styles.iconRound}>
            <MdOutlineVideoCameraBack color="#906BFF" size={30} />
          </span>
          <div>
            <h2 style={styles.headTitle}>AI Video Maker</h2>
            <div style={styles.subTitle}>Create professional videos with AI assistance</div>
          </div>
        </div>
        <div style={styles.btnRow}>
          <span style={styles.recording}>● Recording</span>
          <button style={styles.uploadBtn}>
            <MdUploadFile /> Upload Media
          </button>
          <button style={styles.actionBtn}>
            ▶ Start Creating
          </button>
        </div>
      </div>

      {/* Main Tabs */}
      <div style={styles.tabBar}>
        {TABS.map(t => (
          <button
            key={t}
            style={tab === t ? { ...styles.tab, ...styles.tabActive } : styles.tab}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Content Panels */}
      {tab === 'Templates' && <TemplatesSection />}
      {tab === 'Editor' && <VideoEditorSection />}
      {tab === 'AI Tools' && <AIToolsSection />}
      {tab === 'Recent' && (
        <div
          style={{
            background: 'white',
            borderRadius: 22,
            padding: '52px',
            marginTop: 32,
            minHeight: 220,
            boxShadow: '0 3px 18px #e8e6f7',
            textAlign: 'center',
            fontWeight: 600,
            color: '#888',
            fontSize: 20,
          }}
        >
          No recent edits yet.
        </div>
      )}
    </div>
  );
}
