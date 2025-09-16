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
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(120deg,#f8f0ff 0%, #f5f8ff 100%)",
        padding: "40px 0",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 28px",
        }}
      >
        {/* Title and actions with icons */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "18px",
          }}
        >
          <h1
            style={{
              fontSize: "2.1rem",
              fontWeight: 700,
              margin: 0,
            }}
          >
            Your Creations
          </h1>
          <div
            style={{
              display: "flex",
              gap: 13,
              fontSize: "1.08rem",
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
              }}
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
              }}
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
            gridTemplateColumns: "repeat(auto-fit,minmax(270px,1fr))",
            gap: "28px",
          }}
        >
          {creations.map((item) => (
            <div
              key={item.id}
              style={{
                background: "#fff",
                borderRadius: 24,
                boxShadow: "0 2px 16px #d8ccfb1c",
                padding: "26px 20px 20px 20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                border: "2px solid transparent",
                minHeight: 260,
                position: "relative",
                transition: "box-shadow 0.2s, border 0.2s",
                cursor: "pointer",
              }}
              className="creation-card"
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 10px 20px #c5bdfa66";
                e.currentTarget.style.border = "2px solid #b295ff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 2px 16px #d8ccfb1c";
                e.currentTarget.style.border = "2px solid transparent";
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  background: "#f5f4fb",
                  borderRadius: 18,
                  marginBottom: 14,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "2.6rem",
                  userSelect: "none",
                }}
              >
                {item.emoji}
              </div>
              <div
                style={{
                  fontSize: "1.15rem",
                  fontWeight: 700,
                  color: "#30325a",
                  marginBottom: 9,
                  lineHeight: "1.3",
                  maxWidth: "90%",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                }}
                title={item.title}
              >
                {item.title}
              </div>
              <div
                style={{
                  color: "#9498a5",
                  fontSize: "1.01rem",
                  marginBottom: 20,
                  maxWidth: "95%",
                  lineHeight: 1.3,
                  minHeight: "35px",
                }}
              >
                {item.description}
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "center",
                  marginTop: "auto",
                }}
              >
                <span
                  style={{
                    background: "#f7f7fb",
                    color: "#797b90",
                    fontWeight: 600,
                    fontSize: "0.93rem",
                    borderRadius: "12px",
                    padding: "4px 16px",
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
                      width: 32,
                      height: 32,
                      fontSize: "1.17rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      userSelect: "none",
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
                      width: 32,
                      height: 32,
                      fontSize: "1.17rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      userSelect: "none",
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
                      fontSize: "1rem",
                      borderRadius: "9px",
                      border: "none",
                      padding: "4px 18px",
                      marginLeft: 7,
                      cursor: "pointer",
                      userSelect: "none",
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
