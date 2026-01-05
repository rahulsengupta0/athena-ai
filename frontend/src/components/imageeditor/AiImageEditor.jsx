import React, { useState } from 'react';
import {
  MdOutlineImage,
  MdUploadFile,
  MdAutoAwesome,
} from 'react-icons/md';
import ToolCards from './ToolCards';
import EditorSection from './EditorSection';

const styles = {
  page: {
    minHeight: '100vh',
    background: '#fafafd',
    padding: '2rem 5%',
    fontFamily: 'Inter, sans-serif',
  },
  headerRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
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
    fontSize: 28,
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
    transition: 'box-shadow 0.2s',
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
    transition: 'box-shadow 0.2s, filter 0.18s',
  },
  tabBar: {
    margin: '28px 0 12px 0',
    display: 'flex',
    gap: 12,
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
  emptyPanel: {
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
  },
};

const TABS = ['Tools', 'Editor', 'Recent', 'Gallery'];

export default function AiImageEditor() {
  const [tab, setTab] = useState('Tools');

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.headerRow}>
        <div style={styles.titleRegion}>
          <span style={styles.iconRound}>
            <MdOutlineImage color="#906BFF" size={30} />
          </span>
          <div>
            <h2 style={styles.headTitle}>AI Image Editor</h2>
            <div style={styles.subTitle}>Professional image editing powered by AI</div>
          </div>
        </div>
        <div style={styles.btnRow}>
          <button style={styles.uploadBtn}>
            <MdUploadFile /> Upload Image
          </button>
          <button style={styles.actionBtn}>
            <MdAutoAwesome /> Start Editing
          </button>
        </div>
      </div>

      {/* Tabs */}
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

      {/* Tab Content */}
      {tab === 'Tools' && <ToolCards />}
      {tab === 'Editor' && <EditorSection />}
      {tab === 'Recent' && (
        <div style={styles.emptyPanel}>No recent edits yet.</div>
      )}
      {tab === 'Gallery' && (
        <div style={styles.emptyPanel}>Your edited images will appear here.</div>
      )}
    </div>
  );
}
