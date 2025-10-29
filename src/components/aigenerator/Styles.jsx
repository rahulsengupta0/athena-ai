// Styles.js
import { useState, useEffect } from "react";

/**
 * useResponsive - custom hook to detect mobile breakpoint (<= 768px)
 * Usage: const isMobile = useResponsive();
 */
export function useResponsive() {
  const getMatch = () =>
    typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches;

  const [isMobile, setIsMobile] = useState(getMatch());

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 768px)");
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener ? mq.addEventListener("change", handler) : mq.addListener(handler);
    return () => (mq.removeEventListener ? mq.removeEventListener("change", handler) : mq.removeListener(handler));
  }, []);

  return isMobile;
}

/**
 * getStyles(isMobile) - returns the styles object used across components
 * Keep keys stable with your components (thumbnailContainer, thumbnail, titleIconBackground, badge, etc.)
 */
export default function getStyles(isMobile = typeof window !== "undefined" && window.matchMedia("(max-width:768px)").matches) {
  const baseFont = "'Inter', 'Poppins', Arial, sans-serif";

  return {
    // ===== PAGE LAYOUT =====
    page: {
      minHeight: "100vh",
      backgroundColor: "#fafafd",
      padding: isMobile ? "1rem 0.9rem" : "2rem 3rem",
      fontFamily: baseFont,
      color: "#26233a",
      fontSize: isMobile ? "15px" : "16px",
      transition: "padding 0.28s ease",
    },

    // ===== HEADER & TABS =====
    header: {
      marginBottom: isMobile ? "1.2rem" : "1.5rem",
    },
    mainTitle: {
      fontFamily: "'Poppins', 'Inter', sans-serif",
      fontSize: isMobile ? "1.4rem" : "2.2rem",
      fontWeight: "800",
      margin: 0,
      color: "#232241",
      letterSpacing: "0.01rem",
    },
    subtitle: {
      color: "#76768a",
      fontSize: isMobile ? "0.92rem" : "1rem",
      marginTop: "0.6rem",
      marginLeft: isMobile ? 0 : "0.4rem",
      fontWeight: "500",
    },
    tabsRow: {
      display: "flex",
      gap: isMobile ? "0.6rem" : "1rem",
      marginTop: isMobile ? "1.1rem" : "2rem",
      marginBottom: isMobile ? "1.6rem" : "3rem",
      flexWrap: isMobile ? "wrap" : "nowrap",
      justifyContent: isMobile ? "center" : "flex-start",
    },
    tab: {
      padding: isMobile ? "0.4rem 0.9rem" : "0.5rem 1.2rem",
      borderRadius: isMobile ? "0.65rem" : "0.75rem",
      fontWeight: "700",
      cursor: "pointer",
      backgroundColor: "white",
      border: "2px solid #ede6ff",
      boxShadow: "0 0 8px #ebe9f5",
      fontFamily: "'Inter', sans-serif",
      fontSize: isMobile ? "0.98rem" : "1.06rem",
      transition: "all 0.22s ease",
    },

    // ===== MAIN GRID =====
    grid: {
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(340px, 1fr))",
      gap: isMobile ? "1rem" : "1.8rem",
    },

    // ===== CARD STYLING =====
    card: {
      backgroundColor: "white",
      borderRadius: isMobile ? "1rem" : "1.35rem",
      padding: isMobile ? "1rem" : "1.6rem",
      boxShadow: "0 6px 22px rgba(151,96,255,0.06)",
      border: "1px solid #ece9fc",
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
      transition: "transform 0.35s cubic-bezier(.24,1,.32,1), box-shadow 0.35s ease",
      cursor: "pointer",
      position: "relative",
      zIndex: 0,
    },
    cardHover: {
      transform: isMobile ? "scale(1.02)" : "translateY(-8px) scale(1.03)",
      boxShadow: "0 14px 32px rgba(151,96,255,0.14)",
      zIndex: 2,
    },
    cardHeader: {
      display: "flex",
      alignItems: "center",
      gap: isMobile ? "0.5rem" : "0.75rem",
      marginBottom: isMobile ? "0.5rem" : "0.8rem",
      flexDirection: isMobile ? "column" : "row",
      justifyContent: "flex-start",
    },
    title: {
      fontWeight: "700",
      fontSize: isMobile ? "1rem" : "1.12rem",
      color: "#322957",
      flex: 1,
      wordBreak: "break-word",
    },
    description: {
      color: "#6d6681",
      fontSize: isMobile ? "0.95rem" : "0.98rem",
      fontWeight: "500",
      lineHeight: 1.4,
    },
    iconBackground: {
      padding: "0.55rem",
      borderRadius: "50%",
      backgroundColor: "rgba(154, 86, 255, 0.11)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    // legacy name used in Header
    titleIconBackground: {
      padding: "0.55rem",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(154,86,255,0.06)",
    },

    tag: {
      padding: "0.22rem 0.7rem",
      borderRadius: "0.55rem",
      fontWeight: "700",
      fontSize: isMobile ? "0.68rem" : "0.74rem",
      color: "#9760ff",
      backgroundColor: "#ebe6ff",
      fontFamily: "'Inter', sans-serif",
    },

    // ===== IMAGE / THUMBNAIL =====
    // Use a container + object-fit cover so images never overflow or overlap.
    thumbnailContainer: {
      position: "relative",
      width: "100%",
      // prefer aspect-ratio when available; height fallback ensures consistent visual balance
      aspectRatio: "16/9",
      maxHeight: isMobile ? "220px" : "260px",
      overflow: "hidden",
      borderRadius: "0.9rem",
      boxShadow: "0 4px 12px rgba(151,96,255,0.06)",
      backgroundColor: "#fbf9ff",
    },
    // fallback name still used by some components: keep both keys
    thumbnail: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "block",
      transition: "transform 0.5s cubic-bezier(.24,1,.32,1)",
      borderRadius: "0.9rem",
    },
    // a second alias for consistency with previous code
    thumbnailImage: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      transition: "transform 0.45s ease",
      display: "block",
      borderRadius: "0.9rem",
    },

    statusBadge: {
      position: "absolute",
      bottom: "10px",
      right: "10px",
      padding: isMobile ? "0.18rem 0.5rem" : "0.28rem 0.6rem",
      borderRadius: "0.55rem",
      fontWeight: "600",
      fontSize: isMobile ? "0.68rem" : "0.76rem",
      backgroundColor: "#fff",
      boxShadow: "0 2px 7px rgba(151,96,255,0.09)",
      fontFamily: "'Inter', sans-serif",
    },

    // ===== BUTTONS =====
    startButton: {
      marginTop: "1rem",
      backgroundColor: "#9760ff",
      borderRadius: isMobile ? "0.65rem" : "0.95rem",
      border: "none",
      padding: isMobile ? "0.65rem 0" : "0.85rem 0",
      fontWeight: "700",
      fontSize: isMobile ? "0.95rem" : "1rem",
      color: "#fff",
      cursor: "pointer",
      transition: "transform 0.24s ease, background-color 0.3s ease, box-shadow 0.3s ease",
      boxShadow: "0 4px 12px rgba(151,96,255,0.18)",
      minWidth: isMobile ? "96px" : "120px",
      fontFamily: "'Poppins', 'Inter', sans-serif",
      letterSpacing: "0.01em",
    },
    startButtonHover: {
      backgroundColor: "#8253e6",
      transform: "translateY(-2px) scale(1.02)",
      boxShadow: "0 7px 16px rgba(151,96,255,0.21)",
    },
    startButtonActive: { transform: "scale(0.97)" },

    // ===== PROGRESS / CONFIDENCE =====
    confidenceLabel: {
      fontWeight: 700,
      fontSize: "0.86rem",
      color: "#6d6681",
      marginTop: "0.4rem",
    },
    progressBarBackground: {
      height: 8,
      width: "100%",
      backgroundColor: "#f0eefc",
      borderRadius: 99,
      overflow: "hidden",
      marginTop: "0.5rem",
    },
    progressBar: {
      height: "100%",
      backgroundColor: "#9760ff",
      transition: "width 0.4s ease",
    },
    progressPercent: {
      marginTop: "0.4rem",
      fontSize: "0.9rem",
      color: "#322957",
      fontWeight: 700,
    },

    // ===== QUICK ACTIONS =====
    quickActionsContainer: {
      marginTop: "2.5rem",
      background: "#fff",
      borderRadius: isMobile ? "0.9rem" : "1.2rem",
      padding: isMobile ? "1rem" : "1.5rem 2rem",
      boxShadow: "0 3px 14px rgba(151,96,255,0.05)",
      border: "1px solid #eee",
    },
    quickActionsTitle: {
      fontWeight: 800,
      fontSize: isMobile ? "1rem" : "1.15rem",
      marginBottom: "0.25rem",
      color: "#232241",
    },
    quickActionsSubtitle: {
      marginBottom: "1rem",
      color: "#7b7e8c",
      fontSize: isMobile ? "0.88rem" : "0.93rem",
      fontWeight: 500,
    },
    quickActionsGrid: {
      display: "flex",
      flexWrap: isMobile ? "wrap" : "wrap",
      gap: isMobile ? "0.8rem" : "1.1rem",
      justifyContent: isMobile ? "center" : "flex-start",
    },
    quickActionCard: {
      flex: isMobile ? "1 1 calc(48% - 0.8rem)" : "1 1 calc(22% - 1.1rem)",
      maxWidth: isMobile ? "calc(50% - 0.8rem)" : "calc(25% - 1.1rem)",
      boxSizing: "border-box",
      background: "#fafafd",
      border: "1px solid #ebe9f5",
      borderRadius: "0.9rem",
      height: 165,
      padding: isMobile ? "1rem" : "1.2rem",
      boxShadow: "0 1px 5px rgba(151,96,255,0.05)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "space-between",
      cursor: "pointer",
      position: "relative",
      fontFamily: "'Inter', 'Poppins', Arial, sans-serif",
      transition: "all 0.2s cubic-bezier(.24,1,.32,1)",
    },


    // ===== ANALYTICS & TABLE =====
    analyticsOverview: { marginTop: "2rem" },
    analyticsOverviewGrid: {
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(220px, 1fr))",
      gap: isMobile ? "1rem" : "1.5rem",
    },
    analyticsOverviewCard: {
      backgroundColor: "white",
      borderRadius: "1rem",
      padding: isMobile ? "1rem" : "1.35rem",
      boxShadow: "0 3px 14px rgba(151,96,255,0.09)",
      textAlign: "center",
      border: "1px solid #ece9fc",
      transition: "transform 0.27s ease, box-shadow 0.27s ease",
      fontWeight: 600,
    },
    analyticsOverviewCardHover: {
      transform: "translateY(-4px) scale(1.02)",
      boxShadow: "0 8px 24px rgba(151,96,255,0.13)",
    },
    analyticsValue: {
      fontSize: isMobile ? "1.25rem" : "2.1rem",
      fontWeight: "800",
      color: "#9760ff",
    },
    analyticsLabel: {
      marginTop: "0.45rem",
      color: "#555",
      fontWeight: "600",
      fontSize: isMobile ? "0.9rem" : "0.93rem",
    },

    // table / top tools
    sectionTitle: {
      fontWeight: "700",
      fontSize: isMobile ? "1rem" : "1.08rem",
      marginBottom: "1rem",
      color: "#444",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      borderRadius: "0.75rem",
      overflow: "hidden",
      boxShadow: "0 1px 8px rgba(151,96,255,0.10)",
      fontSize: isMobile ? "0.9rem" : "1rem",
      fontFamily: baseFont,
    },
    th: {
      backgroundColor: "#f8f6ff",
      color: "#555",
      textAlign: "left",
      padding: isMobile ? "0.6rem 0.5rem" : "0.75rem 1rem",
      fontWeight: "700",
      borderBottom: "1px solid #eee",
    },
    tr: {
      borderBottom: "1px solid #f3f3f3",
      transition: "all 0.19s cubic-bezier(.24,1,.32,1)",
    },
    td: {
      padding: isMobile ? "0.6rem 0.5rem" : "0.8rem 1rem",
      fontSize: isMobile ? "0.9rem" : "0.97rem",
      color: "#322957",
    },

    // ===== BADGES used by Header =====
    badge: {
      padding: "0.22rem 0.8rem",
      borderRadius: "0.6rem",
      fontSize: isMobile ? "0.9rem" : "1rem",
      fontWeight: 700,
    },
    badgeGreen: {
      backgroundColor: "#e7fbf0",
      color: "#05944f",
    },
    badgeGray: {
      backgroundColor: "#f3f3f7",
      color: "#6b6a81",
    },

    // small helpers
    smallMuted: {
      color: "#888",
      fontSize: "0.87rem",
    },

    // keep legacy alias for image styles if used anywhere
    imageThumbnail: {
      width: "100%",
      height: "auto",
      borderRadius: "0.8rem",
      objectFit: "cover",
      display: "block",
      transition: "transform 0.3s ease",
    },
  };
}
