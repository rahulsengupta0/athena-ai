import React, { useState } from "react";

// Card data structure for mapping
const tools = [
  {
    key: "upload",
    icon: (
      <svg width={38} height={38} stroke="#a084fd" fill="none" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M12 17V5M12 5L6 11M12 5l6 6" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="4" y="17" width="16" height="3" rx="1.5" fill="#f7f3ff" stroke="#f7f3ff"/>
      </svg>
    ),
    title: "Upload & Edit",
    desc: "Start with your own images"
  },
  {
    key: "photo",
    icon: (
      <svg width={38} height={38} stroke="#a084fd" fill="none" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="3" y="5" width="18" height="14" rx="3" strokeLinecap="round"/>
        <circle cx="8" cy="10" r="2" strokeLinecap="round"/>
        <path d="M21 19l-5-6-4 5-3-4-4 5" strokeLinecap="round"/>
      </svg>
    ),
    title: "Photo Session",
    desc: "AI-powered photo editing"
  },
  {
    key: "voice",
    icon: (
      <svg width={38} height={38} stroke="#a084fd" fill="none" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="9" y="3" width="6" height="12" rx="3" />
        <path d="M5 10v2a7 7 0 0 0 14 0v-2" />
        <path d="M12 19v2m-4 0h8" strokeLinecap="round"/>
      </svg>
    ),
    title: "Voice Command",
    desc: "Create with natural speech"
  },
  {
    key: "web",
    icon: (
      <svg width={38} height={38} stroke="#a084fd" fill="none" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" />
        <path d="M2.05 13h19.9M12 21a9 9 0 0 1 0-18m-5.31 3a9 9 0 0 1 10.62 0" />
        <ellipse cx="12" cy="12" rx="4" ry="9" />
      </svg>
    ),
    title: "Web Import",
    desc: "Import from URL or website"
  }
];

export const CreateHome = () => {
  const [hovered, setHovered] = useState(null);
  const [clicked, setClicked] = useState(null);

  return (
    <div style={{
      background: "none",
      minHeight: 360,
      paddingTop: 38,
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    }}>
      <h1 style={{
        fontSize: "2.35rem",
        fontWeight: 800,
        marginBottom: 10,
        color: "#b435d1",
        background: "linear-gradient(90deg,#ab6bff,#2ab8ed 88%,#af45a4)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        textAlign: "center"
      }}>
        Create Something Amazing
      </h1>
      <p style={{
        fontSize: "1.28rem",
        color: "#888bae",
        marginTop: -2,
        marginBottom: 36,
        textAlign: "center"
      }}>
        Choose your creative tool and bring your ideas to life with AI-powered design
      </p>
      <div style={{
        display: "flex",
        gap: 32,
        justifyContent: "center",
        width: "100%",
        maxWidth: 1240
      }}>
        {tools.map(tool => (
          <div
            key={tool.key}
            onMouseEnter={() => setHovered(tool.key)}
            onMouseLeave={() => setHovered(null)}
            onMouseDown={() => setClicked(tool.key)}
            onMouseUp={() => setClicked(null)}
            style={{
              flex: 1,
              minWidth: 210,
              background: "#fff",
              borderRadius: 26,
              border: "1.6px solid #ece7fc",
              boxShadow:
                hovered === tool.key
                  ? "0 6px 26px #d9c5f933"
                  : "0 3px 16px #f4ecff22",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-start",
              padding: "36px 18px 30px 18px",
              transition: "transform 0.12s, box-shadow 0.16s, border 0.19s",
              transform:
                clicked === tool.key
                  ? "scale(0.94)"
                  : hovered === tool.key
                  ? "scale(1.045)"
                  : "scale(1)",
              cursor: "pointer",
              userSelect: "none"
            }}
          >
            <span style={{
              marginBottom: 18,
              color: "#a084fd",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              {tool.icon}
            </span>
            <div style={{
              fontSize: "1.18rem",
              color: "#131235",
              fontWeight: 700,
              marginBottom: 6,
              textAlign: "center"
            }}>
              {tool.title}
            </div>
            <div style={{
              fontSize: "1.02rem",
              color: "#9498a5",
              textAlign: "center"
            }}>
              {tool.desc}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreateHome;
