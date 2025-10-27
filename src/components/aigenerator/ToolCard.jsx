import React from 'react';
import styles from './Styles';
import { MdFlashOn } from 'react-icons/md';

const ToolCard = ({ tool, idx, hoveredTool, setHoveredTool, navigate }) => {
  const [isActive, setIsActive] = React.useState(false);

  return (
    <div
      style={hoveredTool === idx ? { ...styles.card, ...styles.cardHover } : styles.card}
      onMouseEnter={() => setHoveredTool(idx)}
      onMouseLeave={() => setHoveredTool(null)}
    >
      <div style={styles.cardHeader}>
        <div style={styles.iconBackground}>{tool.icon}</div>
        <span style={styles.tag}>{tool.tag}</span>
        <span style={styles.title}>{tool.title}</span>
      </div>
      <div style={styles.description}>{tool.desc}</div>
      <div>
        <span style={styles.confidenceLabel}>AI Confidence</span>
        <div style={styles.progressBarBackground}>
          <div style={{ ...styles.progressBar, width: `${tool.accuracy}%` }} />
        </div>
        <span style={styles.progressPercent}>{tool.accuracy}%</span>
      </div>
      <button
        style={{
          ...styles.startButton,
          ...(isActive ? styles.startButtonActive : {}),
        }}
        onMouseDown={() => setIsActive(true)}
        onMouseUp={() => setIsActive(false)}
        onClick={() => navigate(tool.to)}
      >
        <MdFlashOn style={{ marginRight: '0.5rem' }} />
        Start Creating
      </button>
    </div>
  );
};

export default ToolCard;
