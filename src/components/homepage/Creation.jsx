import React from "react";

// Demo data for creations (unchanged)
const creations = [
  {
    id: 1,
    emoji: "✨",
    title: "A modern minimalist website design for a…",
    description: "AI-generated design based on your description",
    tag: "design",
    actions: ["favorite", "download", "open"],
  },
  {
    id: 2,
    emoji: "✨",
    title: "A professional business proposal template with…",
    description: "AI-generated document based on your description",
    tag: "document",
    actions: [],
  },
  {
    id: 3,
    emoji: "🖼️",
    title: "A dreamy sunset over lavender fields,…",
    description: "AI-generated image based on your description",
    tag: "image",
    actions: [],
  },
  {
    id: 4,
    emoji: "🎬",
    title: "An animated logo reveal for a tech startup",
    description: "AI-generated video based on your description",
    tag: "video",
    actions: [],
  },
  {
    id: 5,
    emoji: "🎨",
    title: "Social Media Post - Wellness Brand",
    description: "Vibrant Instagram post for organic wellness products",
    tag: "design",
    actions: [],
  },
  {
    id: 6,
    emoji: "🚀",
    title: "Hero Banner – Tech Startup",
    description: "Modern hero section with call-to-action",
    tag: "design",
    actions: [],
  },
  {
    id: 7,
    emoji: "📷",
    title: "Product Photography",
    description: "Professional product shots with soft lighting",
    tag: "image",
    actions: [],
  },
  {
    id: 8,
    emoji: "💻",
    title: "Landing Page Code",
    description: "Responsive React component with Tailwind CSS",
    tag: "code",
    actions: [],
  },
];

// Action icon buttons (replace with SVGs/icons if you want)
const actionIcons = {
  favorite: "♡",
  download: "⬇️",
  open: "Open",
};

// SVG icons for Export and Share buttons
const ExportIcon = () => (
  <svg
    style={{ width: 18, height: 18, marginRight: 6, verticalAlign: "middle" }}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 17h16" />
  </svg>
);

const ShareIcon = () => (
  <svg
    style={{ width: 18, height: 18, marginRight: 6, verticalAlign: "middle" }}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" />
  </svg>
);

export const Creation = () => {
  const [isMobile, setIsMobile] = React.useState(false);
  const [isTablet, setIsTablet] = React.useState(false);

  React.useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 768);
      setIsTablet(width > 768 && width <= 1024);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      style={{
        width: "100%",
        padding: isMobile ? "16px 0" : "36px 0",
        overflowX: "hidden",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: isMobile ? "0 14px" : isTablet ? "0 22px" : "0 24px",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {/* Title and actions with icons */}
        <div
          style={{
            display: "flex",
            alignItems: isMobile ? "flex-start" : "center",
            justifyContent: "space-between",
            marginBottom: isMobile ? "16px" : "16px",
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? "16px" : "0",
            width: "100%",
          }}
        >
          <h1
            style={{
              fontSize: isMobile ? "1.8rem" : isTablet ? "2rem" : "2.1rem",
              fontWeight: 700,
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            Explore Templates
          </h1>
          <div
            style={{
              display: "flex",
              gap: isMobile ? "6px" : "12px",
              fontSize: isMobile ? "0.95rem" : "1.08rem",
              flexWrap: "wrap",
              width: isMobile ? "100%" : "auto",
              justifyContent: isMobile ? "flex-start" : "flex-end",
              overflowX: isMobile ? "auto" : "visible",
              WebkitOverflowScrolling: isMobile ? "touch" : undefined,
            }}
          >
            <button
              style={{
                background: "none",
                border: "none",
                color: "#81859a",
                fontWeight: 500,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                padding: isMobile ? "8px 12px" : "4px 8px",
                borderRadius: isMobile ? "8px" : "4px",
                minHeight: isMobile ? "44px" : "auto",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = "#f5f5f5"}
              onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
              title="Export All"
            >
              <ExportIcon />
              Export All
            </button>
            <button
              style={{
                background: "none",
                border: "none",
                color: "#81859a",
                fontWeight: 500,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                padding: isMobile ? "8px 12px" : "4px 8px",
                borderRadius: isMobile ? "8px" : "4px",
                minHeight: isMobile ? "44px" : "auto",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = "#f5f5f5"}
              onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
              title="Share"
            >
              <ShareIcon />
              Share
            </button>
          </div>
        </div>

        {/* Card Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile 
              ? "1fr" 
              : isTablet 
                ? "repeat(auto-fit, minmax(280px, 1fr))" 
                : "repeat(auto-fit, minmax(270px, 1fr))",
            gap: isMobile ? "14px" : isTablet ? "20px" : "24px",
            width: "100%",
          }}
        >
          {creations.map((item) => (
            <div
              key={item.id}
              style={{
                background: "#fff",
                borderRadius: isMobile ? 16 : 22,
                boxShadow: "0 2px 16px #d8ccfb1c",
                padding: isMobile ? "16px 14px 14px 14px" : "22px 18px 18px 18px",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                border: "2px solid transparent",
                minHeight: isMobile ? 220 : 250,
                position: "relative",
                transition: "box-shadow 0.2s, border 0.2s, transform 0.2s",
                cursor: "pointer",
              }}
              className="creation-card"
              onMouseEnter={(e) => {
                if (!isMobile) {
                  e.currentTarget.style.boxShadow = "0 10px 20px #c5bdfa66";
                  e.currentTarget.style.border = "2px solid #b295ff";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isMobile) {
                  e.currentTarget.style.boxShadow = "0 2px 16px #d8ccfb1c";
                  e.currentTarget.style.border = "2px solid transparent";
                  e.currentTarget.style.transform = "translateY(0)";
                }
              }}
              onTouchStart={(e) => {
                if (isMobile) {
                  e.currentTarget.style.boxShadow = "0 10px 20px #c5bdfa66";
                  e.currentTarget.style.border = "2px solid #b295ff";
                  e.currentTarget.style.transform = "scale(0.98)";
                }
              }}
              onTouchEnd={(e) => {
                if (isMobile) {
                  setTimeout(() => {
                    e.currentTarget.style.boxShadow = "0 2px 16px #d8ccfb1c";
                    e.currentTarget.style.border = "2px solid transparent";
                    e.currentTarget.style.transform = "scale(1)";
                  }, 150);
                }
              }}
            >
              <div
                style={{
                  width: isMobile ? "52px" : "64px",
                  height: isMobile ? "52px" : "64px",
                  background: "#f5f4fb",
                  borderRadius: isMobile ? 14 : 18,
                  marginBottom: isMobile ? 10 : 14,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: isMobile ? "2rem" : "2.6rem",
                  userSelect: "none",
                }}
              >
                {item.emoji}
              </div>
              <div
                style={{
                  fontSize: isMobile ? "1rem" : "1.12rem",
                  fontWeight: 700,
                  color: "#30325a",
                  marginBottom: isMobile ? 6 : 8,
                  lineHeight: "1.3",
                  maxWidth: "90%",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  whiteSpace: isMobile ? "normal" : "nowrap",
                  display: isMobile ? "-webkit-box" : "block",
                  WebkitLineClamp: isMobile ? 2 : "none",
                  WebkitBoxOrient: isMobile ? "vertical" : "horizontal",
                }}
                title={item.title}
              >
                {item.title}
              </div>
              <div
                style={{
                  color: "#9498a5",
                  fontSize: isMobile ? "0.93rem" : "1rem",
                  marginBottom: isMobile ? 12 : 18,
                  maxWidth: "95%",
                  lineHeight: 1.3,
                  minHeight: isMobile ? "28px" : "34px",
                  display: isMobile ? "-webkit-box" : "block",
                  WebkitLineClamp: isMobile ? 2 : "none",
                  WebkitBoxOrient: isMobile ? "vertical" : "horizontal",
                  overflow: isMobile ? "hidden" : "visible",
                }}
              >
                {item.description}
              </div>
              <div
                style={{
                  display: "flex",
                  gap: isMobile ? 6 : 10,
                  alignItems: "center",
                  marginTop: "auto",
                  flexWrap: isMobile ? "wrap" : "nowrap",
                }}
              >
                <span
                  style={{
                    background: "#f7f7fb",
                    color: "#797b90",
                    fontWeight: 600,
                    fontSize: isMobile ? "0.83rem" : "0.9rem",
                    borderRadius: isMobile ? "10px" : "12px",
                    padding: isMobile ? "3px 10px" : "4px 14px",
                    letterSpacing: ".02em",
                  }}
                >
                  {item.tag}
                </span>
                {item.actions && item.actions.includes("favorite") && (
                  <button
                    style={{
                      border: "none",
                      background: "none",
                      color: "#b1bdd3",
                      borderRadius: "50%",
                      width: isMobile ? 36 : 32,
                      height: isMobile ? 36 : 32,
                      fontSize: isMobile ? "1.1rem" : "1.17rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      userSelect: "none",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      if (!isMobile) {
                        e.target.style.color = "#ff6b6b";
                        e.target.style.transform = "scale(1.1)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isMobile) {
                        e.target.style.color = "#b1bdd3";
                        e.target.style.transform = "scale(1)";
                      }
                    }}
                    title="Favorite"
                  >
                    {actionIcons["favorite"]}
                  </button>
                )}
                {item.actions && item.actions.includes("download") && (
                  <button
                    style={{
                      border: "none",
                      background: "none",
                      color: "#b1bdd3",
                      borderRadius: "50%",
                      width: isMobile ? 36 : 32,
                      height: isMobile ? 36 : 32,
                      fontSize: isMobile ? "1.1rem" : "1.17rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      userSelect: "none",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      if (!isMobile) {
                        e.target.style.color = "#4ecdc4";
                        e.target.style.transform = "scale(1.1)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isMobile) {
                        e.target.style.color = "#b1bdd3";
                        e.target.style.transform = "scale(1)";
                      }
                    }}
                    title="Download"
                  >
                    {actionIcons["download"]}
                  </button>
                )}
                {item.actions && item.actions.includes("open") && (
                  <button
                    style={{
                      background: "linear-gradient(90deg,#b4a2fa,#8be6ef)",
                      color: "#fff",
                      fontWeight: 600,
                      fontSize: isMobile ? "0.9rem" : "1rem",
                      borderRadius: isMobile ? "8px" : "9px",
                      border: "none",
                      padding: isMobile ? "6px 14px" : "4px 18px",
                      marginLeft: isMobile ? 4 : 7,
                      cursor: "pointer",
                      userSelect: "none",
                      minHeight: isMobile ? "36px" : "auto",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      if (!isMobile) {
                        e.target.style.transform = "scale(1.05)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isMobile) {
                        e.target.style.transform = "scale(1)";
                      }
                    }}
                    title="Open"
                  >
                    {actionIcons["open"]}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Creation;
