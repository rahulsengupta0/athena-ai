const styles = {
  // ===== PAGE LAYOUT =====
  page: { 
    minHeight: '100vh', 
    backgroundColor: '#fafafd', 
    padding: '2rem 3rem' 
  },

  // ===== HEADER =====
  header: { marginBottom: '1rem' },
  titleRow: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
  titleIconBackground: { backgroundColor: '#ede6ff', padding: '0.3rem', borderRadius: '50%' },
  mainTitle: { fontSize: '2rem', fontWeight: '900', margin: 0 },
  badgeRow: { display: 'flex', gap: '0.5rem', marginTop: '0.5rem' },
  badge: { padding: '0.2rem 0.5rem', borderRadius: '100px', fontWeight: '700', fontSize: '0.75rem' },
  badgeGreen: { backgroundColor: '#e3f9e5', color: '#05944f' },
  badgeGray: { backgroundColor: '#f7f7f7', color: '#999' },
  subtitle: { color: '#666', fontSize: '0.9rem', marginTop: '0.5rem', marginLeft: '0.4rem' },
  tabsRow: { display: 'flex', gap: '1rem', marginTop: '2rem', marginBottom: '3rem' },
  tab: {
    padding: '0.5rem 1.2rem',
    borderRadius: '0.75rem',
    fontWeight: '700',
    cursor: 'pointer',
    backgroundColor: 'white',
    border: '2px solid #ede6ff',
    boxShadow: '0 0 8px #ebe9f5',
  },

  // ===== MAIN GRID =====
  grid: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit,minmax(350px,1fr))', 
    gap: '2rem',
    animation: 'fadeInUp 0.8s ease both'
  },

  // ===== CARD STYLING =====
  card: {
    backgroundColor: 'white',
    borderRadius: '1.25rem',
    padding: '1.5rem 2rem',
    boxShadow: '0 4px 12px rgba(217,210,237,0.12)',
    border: '1px solid #ebe9f5',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    transition: 'transform 0.35s ease, box-shadow 0.35s ease',
    cursor: 'pointer',
    animation: 'fadeInUp 0.6s ease both',
  },
  cardHover: { 
    transform: 'translateY(-6px) scale(1.02)', 
    boxShadow: '0 12px 32px rgba(151,96,255,0.18)' 
  },
  cardHeader: { display: 'flex', alignItems: 'center', gap: '0.7rem' },
  iconBackground: { padding: '0.5rem', borderRadius: '50%', backgroundColor: 'rgba(154, 86, 255, 0.1)' },
  tag: { padding: '0.2rem 0.6rem', borderRadius: '0.55rem', fontWeight: '700', fontSize: '0.7rem', color: '#9760ff', backgroundColor: '#ebe6ff' },
  title: { fontWeight: '700', fontSize: '1.1rem' },
  description: { color: '#666', fontSize: '0.9rem' },

  // ===== IMAGE STYLING =====
  thumbnailContainer: {
    position: 'relative',
    width: '100%',
    height: '180px',
    borderRadius: '0.9rem',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    transition: 'transform 0.4s ease, box-shadow 0.4s ease',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.6s ease',
  },
  statusBadge: {
    position: 'absolute',
    bottom: '10px',
    right: '10px',
    padding: '0.3rem 0.6rem',
    borderRadius: '0.5rem',
    fontWeight: '600',
    fontSize: '0.75rem',
    backgroundColor: '#fff',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
  },

  // ===== BUTTON STYLING =====
  startButton: {
    marginTop: '1rem',
    backgroundColor: '#9760ff',
    borderRadius: '0.9rem',
    border: 'none',
    padding: '0.75rem 0',
    fontWeight: '700',
    color: '#fff',
    cursor: 'pointer',
    transition: 'transform 0.2s ease, background-color 0.3s ease, box-shadow 0.3s ease',
    boxShadow: '0 4px 10px rgba(151,96,255,0.2)',
  },
  startButtonHover: {
    backgroundColor: '#8253e6',
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 16px rgba(151,96,255,0.3)',
  },
  startButtonActive: {
    transform: 'scale(0.96)',
  },

  // ===== QUICK ACTIONS =====
 quickActionsContainer: {
    marginTop: '2.5rem',
    background: '#fff',
    borderRadius: '1.2rem',
    padding: '1.5rem 2rem',
    boxShadow: '0 3px 12px 0 rgba(151, 96, 255, 0.04)',
    border: '1px solid #efebfa',
  },
  quickActionsTitle: {
    fontWeight: 800,
    fontSize: '1.15rem',
    marginBottom: '0.2rem',
    color: '#232241',
  },
  quickActionsSubtitle: {
    marginBottom: '1.1rem',
    color: '#7b7e8c',
    fontSize: '0.93rem',
    fontWeight: 500,
  },
  quickActionsGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    justifyContent: 'flex-start',
  },
  quickActionButton: {
    background: '#fafafd',
    border: 'none',
    borderRadius: '2rem', // pill-shape
    padding: '0.8rem 2rem',
    fontWeight: 700,
    color: '#2f2548',
    fontSize: '1rem',
    letterSpacing: '0.01em',
    transition: 'background 0.22s, box-shadow 0.22s, transform 0.2s',
    boxShadow: '0 0.5px 3px 0 rgba(151, 96, 255, 0.07)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.7rem',
    outline: 'none',
    cursor: 'pointer',
    minWidth: '130px',
    justifyContent: 'center',
  },
  // ===== ANALYTICS OVERVIEW =====
  analyticsOverview: {
    marginTop: '2rem',
  },
  analyticsOverviewGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "1.5rem",
  },
  analyticsOverviewCard: {
    backgroundColor: "white",
    borderRadius: "1rem",
    padding: "1.5rem",
    boxShadow: "0 3px 12px rgba(217,210,237,0.15)",
    textAlign: "center",
    border: "1px solid #ebe9f5",
    transition: "transform 0.25s ease, box-shadow 0.25s ease",
  },
  analyticsOverviewCardHover: {
    transform: "translateY(-4px)",
    boxShadow: "0 8px 24px rgba(151,96,255,0.15)",
  },
  analyticsValue: {
    fontSize: "2rem",
    fontWeight: "800",
    color: "#9760ff",
  },
  analyticsLabel: {
    marginTop: "0.4rem",
    color: "#555",
    fontWeight: "600",
    fontSize: "0.9rem",
  },

  // ===== ANALYTICS CHARTS & TABLES =====
  analyticsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "2rem",
    marginTop: "2.5rem",
  },
  sectionDivider: {
    margin: "2.5rem 0 1.5rem",
    border: "none",
    borderTop: "1px solid #eee",
  },
  sectionTitle: {
    fontWeight: "700",
    fontSize: "1.1rem",
    marginBottom: "1rem",
    color: "#444",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    borderRadius: "0.75rem",
    overflow: "hidden",
    boxShadow: "0 1px 8px rgba(217,210,237,0.15)",
  },
  th: {
    backgroundColor: "#f8f6ff",
    color: "#555",
    textAlign: "left",
    padding: "0.75rem 1rem",
    fontWeight: "700",
    fontSize: "0.9rem",
    borderBottom: "1px solid #eee",
  },
  tr: {
    borderBottom: "1px solid #f3f3f3",
    transition: "all 0.2s ease",
  },
  td: {
    padding: "0.8rem 1rem",
    fontSize: "0.9rem",
    color: "#333",
  },

  // ===== ANIMATIONS =====
  '@keyframes fadeInUp': {
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  },
};

export default styles;
