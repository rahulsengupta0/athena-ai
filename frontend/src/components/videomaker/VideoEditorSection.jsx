import React from 'react';
import {
  MdPlayCircleOutline,
  MdCollections,
  MdTextFields,
  MdAudiotrack,
  MdAutoAwesome,
  MdUploadFile
} from 'react-icons/md';

const styles = {
  grid: {
    display: 'flex',
    gap: 36,
    marginTop: 28,
  },
  left: {
    flex: 2.4,
  },
  editorArea: {
    background: '#f7f7fb',
    borderRadius: 30,
    minHeight: 406,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#9e9eac',
    textAlign: 'center',
    marginBottom: 30,
    border: '1.8px solid #f1eefb',
  },
  playIcon: {
    fontSize: 70,
    color: '#aab0c7',
    opacity: 0.61,
    marginBottom: 18,
  },
  previewTitle: {
    fontWeight: 700,
    color: '#363857',
    fontSize: 21,
  },
  previewSub: {
    fontSize: 15,
    color: '#a3a4ba',
    fontWeight: 500,
    marginTop: 1,
    letterSpacing: 0.5,
  },
  timeline: {
    marginTop: 5,
    background: 'white',
    borderRadius: 12,
    border: '1.5px solid #f2eefb',
    padding: '18px 26px',
  },
  timelineTitle: {
    fontWeight: 600,
    fontSize: 17,
    marginBottom: 10,
    color: '#7069b5',
  },
  timelineBar: {
    display: 'flex',
    gap: 13,
  },
  timelineItem: {
    background: '#ebe6ff',
    borderRadius: 8,
    width: 60,
    height: 25,
    opacity: 0.46,
  },
  right: {
    flex: 1.2,
    background: 'white',
    borderRadius: 20,
    border: '1.5px solid #ebe9f5',
    boxShadow: '0 1px 10px #efeafe38',
    padding: '33px 25px 25px 25px',
    minWidth: 270,
    minHeight: 450,
    display: 'flex',
    flexDirection: 'column',
    gap: 11,
  },
  sideTitle: {
    fontWeight: 700,
    fontSize: 19,
    marginBottom: 14,
    color: '#352b75',
  },
  toolBtn: {
    display: 'flex',
    alignItems: 'center',
    background: 'white',
    border: 'none',
    borderRadius: 8,
    padding: '13px 14px',
    fontWeight: 600,
    fontSize: 16,
    color: '#6d638e',
    marginBottom: 9,
    cursor: 'pointer',
    boxShadow: '0 1px 6px #efeafe3f',
    transition: 'background 0.18s, color 0.15s, box-shadow 0.17s',
  },
  toolBtnActive: {
    background: '#906BFF',
    color: 'white',
  },
  progressLabel: {
    color: '#8e8bb0',
    marginTop: 16,
    marginBottom: 2,
    fontWeight: 700,
    fontSize: 14,
  },
  progressBarWrap: {
    marginBottom: 6,
    background: '#f1eefb',
    borderRadius: 6,
    width: '100%',
    minHeight: 8,
    display: 'flex',
    alignItems: 'center',
    overflow: 'hidden',
  },
  progressBar: {
    height: 8,
    background: '#906bff',
    width: '67%',
    borderRadius: 6,
    transition: 'width 0.3s',
  },
  progressText: {
    color: '#7442cc',
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 17,
  },
  exportBtn: {
    background: '#906BFF',
    color: 'white',
    border: 'none',
    borderRadius: 11,
    padding: '17px 0',
    fontWeight: 700,
    fontSize: 16,
    marginTop: 13,
    cursor: 'pointer',
    marginBottom: 7,
    width: '100%',
    transition: 'background 0.2s',
  },
};

export default function VideoEditorSection() {
  const tools = [
    { icon: <MdCollections size={23} />, label: 'Add Media', active: true },
    { icon: <MdTextFields size={23} />, label: 'Add Text' },
    { icon: <MdAudiotrack size={23} />, label: 'Add Audio' },
    { icon: <MdAutoAwesome size={23} />, label: 'AI Enhance' },
  ];

  return (
    <div style={styles.grid}>
      <div style={styles.left}>
        <div style={styles.editorArea}>
          <MdPlayCircleOutline style={styles.playIcon} />
          <div style={styles.previewTitle}>Preview Area</div>
          <div style={styles.previewSub}>Your video preview will appear here</div>
        </div>
        <div style={styles.timeline}>
          <div style={styles.timelineTitle}>Timeline</div>
          <div style={styles.timelineBar}>
            {Array(8).fill(0).map((_, i) => (
              <div style={styles.timelineItem} key={i}></div>
            ))}
          </div>
        </div>
      </div>
      <div style={styles.right}>
        <div style={styles.sideTitle}>Tools</div>
        {tools.map((tool, i) => (
          <button
            key={tool.label}
            style={tool.active ? { ...styles.toolBtn, ...styles.toolBtnActive } : styles.toolBtn}
          >
            {tool.icon} <span style={{ marginLeft: 12 }}>{tool.label}</span>
          </button>
        ))}
        <div style={styles.progressLabel}>Export Progress</div>
        <div style={styles.progressBarWrap}>
          <div style={styles.progressBar}></div>
        </div>
        <div style={styles.progressText}>67% complete</div>
        <button style={styles.exportBtn}>
          <MdUploadFile style={{ verticalAlign: 'middle', marginRight: 7 }} /> Export Video
        </button>
      </div>
    </div>
  );
}
