import React, { useState } from 'react';
import { MdOutlineImage, MdUploadFile } from 'react-icons/md';

const styles = {
  editorBox: {
    background: 'white',
    borderRadius: 23,
    boxShadow: '0 2px 24px rgba(217,210,237,0.11)',
    display: 'flex',
    marginTop: 22,
    padding: 40,
    justifyContent: 'space-between',
    gap: 32,
    minHeight: 370,
  },
  imageDrop: {
    flex: 2.2,
    minHeight: 280,
    background: '#f5f4fb',
    borderRadius: 15,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    border: '2px dashed #dedbf5',
    padding: 36,
    textAlign: 'center',
  },
  imageIcon: {
    color: '#cfc4e4',
    marginBottom: 20,
  },
  chooseBtn: {
    color: 'white',
    background: '#906BFF',
    padding: '10px 26px',
    borderRadius: 10,
    fontWeight: 700,
    fontSize: 16,
    marginTop: 27,
    cursor: 'pointer',
    border: 'none',
    outline: 'none',
    transition: 'background 0.18s',
  },
  editorControls: {
    flex: 1,
    minWidth: 210,
    padding: '12px 8px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 19,
    background: 'white',
    borderRadius: 12,
    boxShadow: '0 2px 16px #eee',
    marginLeft: 28,
  },
  editorControlsTitle: {
    fontSize: 19,
    fontWeight: 700,
    marginBottom: 2,
    color: '#17142B',
  },
  sliderRow: {
    width: '100%',
    margin: '13px 0 11px 0',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  sliderLabel: { fontSize: 15, fontWeight: 500, color: '#797885', width: 90 },
  slider: {
    flexGrow: 1,
    appearance: 'none',
    height: 5,
    borderRadius: 7,
    background: '#ebe6ff',
    outline: 'none',
    transition: 'background 0.3s',
    accentColor: '#906BFF',
  },
  undoRedoRow: {
    display: 'flex',
    gap: 13,
    margin: '13px 0',
    width: '100%',
  },
  undoRedoBtn: {
    background: '#f5f4fb',
    color: '#7e5aff',
    border: 'none',
    borderRadius: 8,
    padding: '8px 17px',
    fontWeight: 700,
    fontSize: 14,
    cursor: 'pointer',
    transition: 'background 0.18s,color 0.18s',
  },
  exportBtn: {
    background: '#906BFF',
    color: 'white',
    border: 'none',
    borderRadius: 11,
    padding: '12px 34px',
    fontWeight: 700,
    fontSize: 16,
    marginTop: 9,
    cursor: 'pointer',
    width: '100%',
    transition: 'background 0.2s',
  },
};

export default function EditorSection() {
  const [brightness, setBrightness] = useState(50);
  const [contrast, setContrast] = useState(50);

  return (
    <div style={styles.editorBox}>
      <div style={styles.imageDrop}>
        <MdOutlineImage size={60} style={styles.imageIcon} />
        <h3>Upload an image to start editing</h3>
        <div style={{ color: '#9e95b8', fontSize: 15, margin: '13px 0 5px 0' }}>
          Drag & drop or click to browse
        </div>
        <button style={styles.chooseBtn}>
          <MdUploadFile style={{ verticalAlign: 'middle', marginRight: 5 }} /> Choose Image
        </button>
      </div>
      <div style={styles.editorControls}>
        <div style={styles.editorControlsTitle}>Adjustments</div>
        <div style={styles.sliderRow}>
          <span style={styles.sliderLabel}>Brightness</span>
          <input
            type="range"
            min={0}
            max={100}
            value={brightness}
            style={styles.slider}
            onChange={e => setBrightness(e.target.value)}
          />
          <span style={{ color: '#8e83b2', fontSize: 14, width: 30 }}>{brightness}%</span>
        </div>
        <div style={styles.sliderRow}>
          <span style={styles.sliderLabel}>Contrast</span>
          <input
            type="range"
            min={0}
            max={100}
            value={contrast}
            style={styles.slider}
            onChange={e => setContrast(e.target.value)}
          />
          <span style={{ color: '#8e83b2', fontSize: 14, width: 30 }}>{contrast}%</span>
        </div>
        <div style={styles.undoRedoRow}>
          <button style={styles.undoRedoBtn} aria-label="Undo">{'↺'}</button>
          <button style={styles.undoRedoBtn} aria-label="Redo">{'↻'}</button>
        </div>
        <button style={styles.exportBtn}>
          <MdUploadFile style={{ verticalAlign: 'middle', marginRight: 7 }} /> Export Image
        </button>
      </div>
    </div>
  );
}
