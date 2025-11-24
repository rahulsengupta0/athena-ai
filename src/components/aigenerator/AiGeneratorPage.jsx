import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MdOutlineDesignServices,
  MdOutlineContentPaste,
  MdViewQuilt,
  MdFlashOn,
  MdTextFields,
  MdWidgets,
  MdAutoAwesome,
} from 'react-icons/md';

const palette = {
  background: 'linear-gradient(145deg, #fdfaff 0%, #f4f5ff 45%, #fdf8ff 100%)',
  surface: 'rgba(255, 255, 255, 0.9)',
  surfaceMuted: 'rgba(255, 255, 255, 0.7)',
  border: 'rgba(151, 96, 255, 0.15)',
  accent: '#8a5bff',
  accentSoft: 'rgba(138, 91, 255, 0.12)',
  accentDark: '#5b3bd6',
  text: '#1f1b2d',
  textMuted: '#6f6b80',
  success: '#1f9d75',
};

const styles = {
  page: {
    minHeight: '100vh',
    padding: '3rem clamp(2rem, 4vw, 5rem)',
    fontFamily: "'Inter', 'Space Grotesk', sans-serif",
    background: palette.background,
    color: palette.text,
  },
  heroGrid: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 2fr) minmax(260px, 1fr)',
    gap: '2rem',
    alignItems: 'stretch',
  },
  heroCard: {
    background: palette.surface,
    borderRadius: '1.75rem',
    padding: '2rem',
    boxShadow: '0 35px 80px rgba(151, 96, 255, 0.18)',
    border: `1px solid ${palette.border}`,
    position: 'relative',
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    background: 'radial-gradient(circle at 20% 10%, rgba(151,96,255,0.25), transparent 55%)',
  },
  titleRow: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: '0.8rem',
    position: 'relative',
    zIndex: 1,
  },
  titleIconBackground: {
    borderRadius: '50%',
    background: palette.accentSoft,
    padding: '0.7rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainTitle: {
    fontSize: 'clamp(2rem, 4vw, 2.8rem)',
    fontWeight: 800,
    margin: 0,
  },
  subtitle: {
    fontSize: '1rem',
    color: palette.textMuted,
    marginTop: '0.5rem',
    lineHeight: 1.6,
    maxWidth: '40ch',
  },
  badgeRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.75rem',
    marginTop: '1.25rem',
  },
  badgeDot: {
    width: '0.45rem',
    height: '0.45rem',
    borderRadius: '50%',
    backgroundColor: palette.success,
    display: 'inline-block',
  },
  badge: {
    padding: '0.4rem 0.9rem',
    borderRadius: '999px',
    fontWeight: 600,
    fontSize: '0.85rem',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
  },
  badgeGreen: {
    backgroundColor: 'rgba(31, 157, 117, 0.1)',
    color: palette.success,
  },
  badgeGray: {
    backgroundColor: 'rgba(111, 107, 128, 0.1)',
    color: palette.textMuted,
  },
  heroSecondary: {
    background: 'rgba(10, 8, 20, 0.85)',
    borderRadius: '1.5rem',
    padding: '1.6rem',
    color: '#f3f2ff',
    boxShadow: '0 35px 60px rgba(15, 6, 56, 0.35)',
    position: 'relative',
    overflow: 'hidden',
  },
  heroSecondaryAccent: {
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.25), transparent 50%)',
    opacity: 0.6,
  },
  heroSecondaryContent: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem',
  },
  heroSecondaryTitle: {
    fontSize: '1.2rem',
    fontWeight: 700,
    margin: 0,
  },
  heroSecondaryDescription: {
    color: 'rgba(243, 242, 255, 0.8)',
    fontSize: '0.95rem',
    lineHeight: 1.6,
  },
  heroSecondaryCTA: {
    marginTop: 'auto',
    background: '#f8f4ff',
    color: palette.accentDark,
    padding: '0.9rem 1.2rem',
    borderRadius: '1rem',
    fontWeight: 600,
    border: 'none',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    transition: 'transform 0.2s ease',
  },
  grid: {
    marginTop: '3rem',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))',
    gap: '1.75rem',
  },
  card: {
    position: 'relative',
    background: 'rgba(255,255,255,0.95)',
    borderRadius: '1.5rem',
    padding: '1.9rem',
    border: `1px solid ${palette.border}`,
    boxShadow: '0 28px 50px rgba(96, 52, 160, 0.18)',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.1rem',
    overflow: 'hidden',
    transition: 'transform 0.35s ease, box-shadow 0.35s ease',
    cursor: 'pointer',
  },
  cardAccent: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(135deg, rgba(157,118,255,0.18), rgba(255,255,255,0))',
    opacity: 0,
    pointerEvents: 'none',
    transition: 'opacity 0.35s ease',
  },
  cardHover: {
    transform: 'translateY(-8px)',
    boxShadow: '0 42px 70px rgba(69, 28, 133, 0.2)',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.95rem',
  },
  iconBackground: {
    width: '3.4rem',
    height: '3.4rem',
    borderRadius: '1.1rem',
    background: 'linear-gradient(135deg, rgba(138,91,255,0.22), rgba(255,255,255,0.75))',
    border: `1px solid ${palette.border}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: palette.accentDark,
  },
  cardHeaderText: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
  },
  tag: {
    padding: '0.25rem 0.8rem',
    borderRadius: '999px',
    fontWeight: 600,
    fontSize: '0.72rem',
    color: palette.accentDark,
    backgroundColor: 'rgba(138, 91, 255, 0.16)',
    width: 'fit-content',
  },
  title: {
    fontWeight: 700,
    fontSize: '1.18rem',
    color: palette.text,
  },
  description: {
    color: palette.textMuted,
    lineHeight: 1.6,
  },
  confidenceRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    flexWrap: 'wrap',
  },
  confidenceLabel: {
    color: palette.textMuted,
    fontSize: '0.78rem',
  },
  progressBarBackground: {
    flex: 1,
    height: '8px',
    backgroundColor: 'rgba(247, 244, 255, 0.8)',
    borderRadius: '999px',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: '999px',
    backgroundImage: 'linear-gradient(120deg, #9c6bff, #6f4bff)',
    transition: 'width 0.4s ease',
  },
  progressPercent: {
    fontWeight: 700,
    color: palette.accentDark,
    fontSize: '0.85rem',
  },
  startButton: {
    marginTop: '0.5rem',
    background: 'linear-gradient(120deg, #9c6bff, #6f4bff)',
    borderRadius: '1rem',
    border: 'none',
    padding: '0.85rem',
    fontWeight: 600,
    color: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.4rem',
    transition: 'transform 0.15s ease, box-shadow 0.2s ease',
  },
  startButtonHover: {
    boxShadow: '0 18px 30px rgba(128, 94, 255, 0.3)',
    transform: 'translateY(-1px)',
  },
  startButtonActive: {
    transform: 'scale(0.97)',
  },
  quickActionsContainer: {
    marginTop: '3rem',
    background: 'rgba(255,255,255,0.9)',
    borderRadius: '1.5rem',
    padding: '2rem',
    border: `1px solid ${palette.border}`,
    boxShadow: '0 25px 50px rgba(93,62,169,0.12)',
  },
  quickActionsHeader: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  quickActionsTitle: {
    fontWeight: 700,
    fontSize: '1.3rem',
    margin: 0,
  },
  quickActionsSubtitle: {
    color: palette.textMuted,
    fontSize: '0.95rem',
  },
  quickActionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: '1rem',
  },
  quickActionButton: {
    background: 'rgba(252,251,255,0.8)',
    borderRadius: '1.2rem',
    padding: '1rem',
    fontWeight: 600,
    fontSize: '0.9rem',
    border: `1px solid ${palette.border}`,
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '0.65rem',
    transition: 'transform 0.2s ease, border 0.2s ease, box-shadow 0.2s ease',
    color: palette.text,
  },
  quickActionIcon: {
    color: palette.accent,
  },
};

export const AiGeneratorPage = () => {
  const navigate = useNavigate();
  const [hoveredTool, setHoveredTool] = React.useState(null);
  const [hoveredAction, setHoveredAction] = React.useState(null);
  const [btnActive, setBtnActive] = React.useState(null);

  const iconColor = palette.accentDark;

  const tools = [
    {
      title: 'Design Generator',
      tag: 'Popular',
      icon: <MdOutlineDesignServices size={34} color={iconColor} />,
      desc: 'Create stunning designs from text prompts using advanced AI',
      accuracy: 95,
      to: '/create/ai-design',
    },
    {
      title: 'Content Creator',
      tag: 'Pro',
      icon: <MdOutlineContentPaste size={34} color={iconColor} />,
      desc: 'Generate compelling copy and marketing content instantly',
      accuracy: 88,
      to: '/docGenerator',
    },
    {
      title: 'Layout Builder',
      tag: 'New',
      icon: <MdViewQuilt size={34} color={iconColor} />,
      desc: 'Smart layout generation for web and mobile interfaces',
      accuracy: 92,
      to: '/canva-clone',
    },
  ];

 

  return (
    <div style={styles.page}>
      <div style={styles.heroGrid}>
        <div style={styles.heroCard}>
          <div style={styles.glow} />
          <div style={styles.titleRow}>
            <div style={styles.titleIconBackground}>
              <MdOutlineDesignServices size={28} color={palette.accentDark} />
            </div>
            <h1 style={styles.mainTitle}>AI Generator Studio</h1>
          </div>
          <p style={styles.subtitle}>
            Launch the core Athena generators that cover visuals, copywriting and layout explorations.
          </p>
          <div style={styles.badgeRow}>
            <span style={{ ...styles.badge, ...styles.badgeGreen }}>
              <span style={styles.badgeDot} />
              Models online
            </span>
          </div>
        </div>
        <div style={styles.heroSecondary}>
          <div style={styles.heroSecondaryAccent} />
          <div style={styles.heroSecondaryContent}>
            <p style={styles.heroSecondaryTitle}>Live Studio Pulse</p>
            <p style={styles.heroSecondaryDescription}>
              See which generators the Athena community is leaning on right now. Launch any workspace with curated prompts ready to go.
            </p>
            <button
              style={styles.heroSecondaryCTA}
              onClick={() => navigate('/create')}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              Open Studio
              <MdFlashOn />
            </button>
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div style={styles.grid}>
        {tools.map((tool, idx) => {
          const cardStyle =
            hoveredTool === idx ? { ...styles.card, ...styles.cardHover } : styles.card;

          return (
            <div
              key={tool.title}
              style={cardStyle}
              onMouseEnter={() => setHoveredTool(idx)}
              onMouseLeave={() => setHoveredTool(null)}
            >
              <div
                style={{
                  ...styles.cardAccent,
                  opacity: hoveredTool === idx ? 1 : 0,
                }}
              />
              <div style={styles.cardHeader}>
                <div style={styles.iconBackground}>{tool.icon}</div>
                <div style={styles.cardHeaderText}>
                  <span style={styles.tag}>{tool.tag}</span>
                  <span style={styles.title}>{tool.title}</span>
                </div>
              </div>
              <div style={styles.description}>{tool.desc}</div>
              <div style={styles.confidenceRow}>
                <span style={styles.confidenceLabel}>AI Confidence</span>
                <div style={styles.progressBarBackground}>
                  <div style={{ ...styles.progressBar, width: `${tool.accuracy}%` }} />
                </div>
                <span style={styles.progressPercent}>{tool.accuracy}%</span>
              </div>
              <button
                style={{
                  ...styles.startButton,
                  ...(hoveredTool === idx ? styles.startButtonHover : {}),
                  ...(btnActive === idx ? styles.startButtonActive : {}),
                }}
                onMouseDown={() => setBtnActive(idx)}
                onMouseUp={() => setBtnActive(null)}
                onMouseLeave={() => setBtnActive(null)}
                onClick={() => navigate(tool.to)}
              >
                <MdFlashOn style={{ marginRight: '0.4rem' }} />
                Launch Tool
              </button>
            </div>
          );
        })}
      </div>

      

    </div>
  );
};
