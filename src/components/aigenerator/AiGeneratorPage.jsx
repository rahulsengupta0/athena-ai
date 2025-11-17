import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MdOutlineDesignServices,
  MdOutlineContentPaste,
  MdViewQuilt,
  MdImage,
  MdFlashOn,
  MdTextFields,
  MdWidgets,
  MdAutoAwesome,
} from 'react-icons/md';

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#fafafd',
    padding: '2rem 3rem',
    fontFamily: "'Inter', sans-serif",
  },
  header: {
    marginBottom: '1rem',
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  titleIconBackground: {
    borderRadius: '50%',
    backgroundColor: '#ede6ff',
    padding: '0.3rem',
  },
  mainTitle: {
    fontSize: '2rem',
    fontWeight: '900',
    margin: 0,
  },
  badgeRow: {
    display: 'flex',
    gap: '0.5rem',
    marginTop: '0.5rem',
  },
  badge: {
    padding: '0.2rem 0.5rem',
    borderRadius: '100px',
    fontWeight: '700',
    fontSize: '0.75rem',
  },
  badgeGreen: {
    backgroundColor: '#e3f9e5',
    color: '#05944f',
  },
  badgeGray: {
    backgroundColor: '#f7f7f7',
    color: '#999999',
    fontWeight: '500',
  },
  subtitle: {
    color: '#666666',
    fontSize: '0.9rem',
    marginTop: '0.5rem',
    marginLeft: '0.4rem',
  },
  tabsRow: {
    display: 'flex',
    gap: '1rem',
    marginTop: '2rem',
    marginBottom: '3rem',
  },
  tab: {
    padding: '0.5rem 1.2rem',
    borderRadius: '0.75rem',
    fontWeight: '700',
    fontSize: '1rem',
    cursor: 'pointer',
    userSelect: 'none',
    boxShadow: '0 0 8px #ebe9f5',
    border: '2px solid #ede6ff',
    backgroundColor: 'white',
    color: 'black',
  },
  tabDisabled: {
    color: '#c6c6c6',
    cursor: 'default',
    backgroundColor: 'white',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit,minmax(350px,1fr))',
    gap: '2rem',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '1.25rem',
    padding: '1.5rem 2rem',
    boxShadow: '0 2px 16px rgb(217 210 237 / 0.12)',
    border: '1px solid #ebe9f5',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    transition: 'all 0.25s ease',
    cursor: 'pointer',
  },
  cardHover: {
    boxShadow: '0 15px 40px rgb(217 210 237 / 0.3)',
    transform: 'translateY(-6px) scale(1.012)',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.7rem',
  },
  iconBackground: {
    padding: '0.5rem',
    borderRadius: '50%',
    backgroundColor: 'rgba(154, 86, 255, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  tag: {
    padding: '0.2rem 0.6rem',
    borderRadius: '0.55rem',
    fontWeight: '700',
    fontSize: '0.7rem',
    whiteSpace: 'nowrap',
    color: '#9760ff',
    backgroundColor: '#ebe6ff',
  },
  title: {
    fontWeight: '700',
    fontSize: '1.1rem',
  },
  description: {
    color: '#666666',
    marginLeft: '3.5rem',
    fontSize: '0.9rem',
  },
  confidenceLabel: {
    marginLeft: '3.5rem',
    color: '#8b8b8b',
    fontSize: '0.75rem',
  },
  progressBarBackground: {
    width: '100%',
    height: '8px',
    backgroundColor: '#ebe6ff',
    borderRadius: '6px',
    marginTop: '0.2rem',
    overflow: 'hidden',
  },
  progressBar: {
    height: '8px',
    borderRadius: '6px',
    backgroundColor: '#9760ff',
    transition: 'width 0.3s ease-in-out',
  },
  progressPercent: {
    marginLeft: '0.5rem',
    color: '#9760ff',
    fontWeight: '700',
    fontSize: '0.8rem',
    lineHeight: 1,
  },
  startButton: {
    marginTop: '1rem',
    backgroundColor: '#c7b8ff',
    borderRadius: '0.9rem',
    border: 'none',
    padding: '0.7rem 0',
    fontWeight: '700',
    color: '#fff',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, box-shadow 0.3s ease, transform 0.15s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButtonHover: {
    backgroundColor: '#9760ff',
    boxShadow: '0 4px 15px rgba(151, 96, 255, 0.4)',
  },
  startButtonActive: {
    transform: 'scale(0.95)',
  },
  quickActionsContainer: {
    marginTop: '3rem',
    backgroundColor: 'white',
    borderRadius: '1rem',
    padding: '1.5rem 2.5rem',
    boxShadow: '0 6px 24px rgb(217 210 237 / 0.15)',
    border: '1px solid #ebe9f5',
  },
  quickActionsTitle: {
    fontWeight: '700',
    fontSize: '1.2rem',
    marginBottom: '0.8rem',
  },
  quickActionsSubtitle: {
    marginBottom: '1.5rem',
    color: '#999999',
  },
  quickActionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat( auto-fill, minmax(160px, 1fr))',
    gap: '1rem',
  },
  quickActionButton: {
    background: '#fafafd',
    borderRadius: '1rem',
    padding: '1rem 0',
    fontWeight: '600',
    fontSize: '0.9rem',
    border: '1px solid #e6e6f7',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    transition: 'all 0.3s ease',
    userSelect: 'none',
  },
  quickActionIcon: {
    marginBottom: '0.4rem',
    color: '#969696',
  },
};

export const AiGeneratorPage = () => {
  const navigate = useNavigate();
  const [hoveredTool, setHoveredTool] = React.useState(null);
  const [btnActive, setBtnActive] = React.useState(null);

  const tools = [
    {
      title: 'Design Generator',
      tag: 'Popular',
      icon: <MdOutlineDesignServices size={34} color="#9760ff" />,
      desc: 'Create stunning designs from text prompts using advanced AI',
      accuracy: 95,
      to: '/create/ai-design',
    },
    {
      title: 'Content Creator',
      tag: 'Pro',
      icon: <MdOutlineContentPaste size={34} color="#9760ff" />,
      desc: 'Generate compelling copy and marketing content instantly',
      accuracy: 88,
      to: '/docGenerator',
    },
    {
      title: 'Layout Builder',
      tag: 'New',
      icon: <MdViewQuilt size={34} color="#9760ff" />,
      desc: 'Smart layout generation for web and mobile interfaces',
      accuracy: 92,
      to: '/create/ai-design',
    },
    {
      title: 'Image Enhancer',
      tag: 'Beta',
      icon: <MdImage size={34} color="#9760ff" />,
      desc: 'AI-powered image editing and enhancement tools',
      accuracy: 78,
      to: '/create/image-creator',
    },
  ];

  const quickActions = [
    { label: 'Auto Design', icon: <MdFlashOn size={24} style={styles.quickActionIcon} /> },
    { label: 'Smart Copy', icon: <MdTextFields size={24} style={styles.quickActionIcon} /> },
    { label: 'Layout Magic', icon: <MdWidgets size={24} style={styles.quickActionIcon} /> },
    { label: 'AI Enhance', icon: <MdAutoAwesome size={24} style={styles.quickActionIcon} /> },
  ];

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.titleRow}>
          <div style={styles.titleIconBackground}>
            <MdOutlineDesignServices size={28} color="#9760ff" />
          </div>
          <h1 style={styles.mainTitle}>AI Generator Studio</h1>
        </div>
        <div style={styles.badgeRow}>
          <span style={{ ...styles.badge, ...styles.badgeGreen }}>AI Models Online</span>
          <span style={{ ...styles.badge, ...styles.badgeGray }}>47 generations today</span>
        </div>
        <p style={styles.subtitle}>Create amazing content with advanced AI tools</p>
      </div>

      {/* Tabs */}
      <div style={styles.tabsRow}>
        <button style={{ ...styles.tab, ...styles.tabActive }}>AI Tools</button>
        <button style={{ ...styles.tab, ...styles.tabDisabled }}>Recent</button>
        <button style={{ ...styles.tab, ...styles.tabDisabled }}>Analytics</button>
      </div>

      {/* Tools Grid */}
      <div style={styles.grid}>
        {tools.map((tool, idx) => (
          <div
            key={tool.title}
            style={
              hoveredTool === idx
                ? { ...styles.card, ...styles.cardHover }
                : styles.card
            }
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
                <div
                  style={{ ...styles.progressBar, width: `${tool.accuracy}%` }}
                />
              </div>
              <span style={styles.progressPercent}>{tool.accuracy}%</span>
            </div>
            <button
              style={{
                ...styles.startButton,
                ...(btnActive === idx ? styles.startButtonActive : {}),
              }}
              onMouseDown={() => setBtnActive(idx)}
              onMouseUp={() => setBtnActive(null)}
              onClick={() => navigate(tool.to)}
              onMouseLeave={() => setBtnActive(null)}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#9760ff';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(151, 96, 255, 0.4)';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#c7b8ff';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.color = '#fff';
              }}
            >
              <MdFlashOn style={{ marginRight: '0.5rem' }} />
              Start Creating
            </button>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={styles.quickActionsContainer}>
        <p style={styles.quickActionsTitle}>Quick Actions</p>
        <p style={styles.quickActionsSubtitle}>Jump into popular workflows</p>
        <div style={styles.quickActionsGrid}>
          {quickActions.map((action, idx) => (
            <button
              key={idx}
              style={styles.quickActionButton}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#ede6ff';
                e.currentTarget.style.boxShadow = '0 5px 20px rgb(217 210 237 / 0.4)';
                e.currentTarget.style.transform = 'scale(1.08)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#fafafd';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              {action.icon}
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
