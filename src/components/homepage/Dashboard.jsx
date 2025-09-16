import React, { useState } from "react";

// Button data structure to allow easy mapping and badge display
const BUTTONS = [
  {
    key: "design",
    label: "Design for me",
    tag: "Popular",
    tagColor: "#ef4444", // Red
    icon: "🎨",
  },
  {
    key: "create-image",
    label: "Create an image",
    tag: "New",
    tagColor: "#22c55e", // Green
    icon: "🖼️",
  },
  {
    key: "draft-document",
    label: "Draft a document",
    icon: "📄",
  },
  {
    key: "generate-code",
    label: "Generate code",
    icon: "💻",
  },
  {
    key: "create-video",
    label: "Create video",
    tag: "Pro",
    tagColor: "#f59e42", // Yellow/Gold
    icon: "🎬",
  },
  {
    key: "brand-kit",
    label: "Brand kit",
    icon: "🎨",
  },
  {
    key: "smart-edit",
    label: "Smart edit",
    icon: "✂️",
  },
  {
    key: "ai-assistant",
    label: "AI assistant",
    icon: "🤖",
  },
];

const navTabs = [
  { label: "Your designs", key: "your-designs" },
  { label: "Templates", key: "templates" },
  { label: "Athena AI", key: "athena-ai", highlight: true },
];

export const Dashboard = () => {
  const [selectedButton, setSelectedButton] = useState(null);
  const [activeTab, setActiveTab] = useState("athena-ai");
  const [hoveredButton, setHoveredButton] = useState(null);
  const [clickedButton, setClickedButton] = useState(null);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(120deg,#eaefff 0%,#ffefff 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "44px 8px 12px 8px",
      }}
    >
      {/* HERO TITLE */}
      <h1
        style={{
          fontSize: "3.5rem",
          fontWeight: 800,
          margin: "0 0 20px 0",
          background: "linear-gradient(90deg,#a08afc 0%,#3dcaff 60%,#d32f93 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          textAlign: "center",
        }}
      >
        What will you create today?
      </h1>

      {/* NAVIGATION TABS */}
      <div
        style={{
          display: "flex",
          gap: 16,
          justifyContent: "center",
          marginBottom: 38,
        }}
      >
        {navTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: "8px 28px",
              borderRadius: "22px",
              background:
                activeTab === tab.key
                  ? "linear-gradient(90deg,#b692f6,#80c7fb)"
                  : "#fff",
              color: activeTab === tab.key ? "#fff" : "#52576d",
              fontWeight: 600,
              fontSize: "1.13rem",
              border: activeTab === tab.key ? "none" : "1.5px solid #eee",
              boxShadow:
                activeTab === tab.key ? "0 4px 28px 0 #c5bdf93d" : "none",
              transition: "all 0.18s",
              cursor: "pointer",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* MAIN PROMPT/SEARCH AREA */}
      <div
        style={{
          background: "#fff",
          borderRadius: "24px",
          boxShadow: "0 2px 32px #c9c6f211",
          padding: "30px 32px 24px 32px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minWidth: "740px",
          marginBottom: 30,
          border: "1.5px solid #f1eeff",
        }}
      >
        {/* Input and create buttons */}
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 26,
          }}
        >
          <button
            style={{
              border: "2px dashed #eae4ff",
              background: "transparent",
              borderRadius: "50%",
              width: 44,
              height: 44,
              fontSize: "1.4rem",
              color: "#d1c4ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            +
          </button>
          <input
            type="text"
            placeholder="Describe your idea, and I'll bring it to life..."
            style={{
              flex: 1,
              padding: "12px 22px",
              fontSize: "1.21rem",
              borderRadius: "14px",
              border: "1.5px solid #f2edfc",
              background: "#f7f3ff",
              outline: "none",
              marginRight: 10,
              color: "#52576d",
            }}
          />
          <button
            style={{
              background: "linear-gradient(90deg,#8ee0fb,#a892fd)",
              color: "#fff",
              fontWeight: 700,
              fontSize: "1.11rem",
              padding: "11px 32px",
              borderRadius: "12px",
              border: "none",
              boxShadow: "0 2px 10px #c7f7fd66",
              display: "flex",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
              transition: "background 0.14s",
            }}
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: "1.2rem",
              }}
            >
              ✨
            </span>
            Create
          </button>
        </div>

        {/* FEATURE BUTTONS */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "flex-start",
            gap: 14,
            width: "100%",
          }}
        >
          {BUTTONS.map((btn) => (
            <button
              key={btn.key}
              onClick={() => setSelectedButton(btn.key)}
              onMouseEnter={() => setHoveredButton(btn.key)}
              onMouseLeave={() => setHoveredButton(null)}
              onMouseDown={() => setClickedButton(btn.key)}
              onMouseUp={() => setClickedButton(null)}
              style={{
                border: "1.2px solid #ededf5",
                background:
                  selectedButton === btn.key
                    ? "linear-gradient(90deg,#cfdffe,#fdebfd 80%)"
                    : "#f8f9ff",
                boxShadow:
                  selectedButton === btn.key
                    ? "0 2px 8px #b2a5ed55"
                    : hoveredButton === btn.key
                    ? "0 4px 12px #a1a1d9aa"
                    : undefined,
                borderRadius: 12,
                padding: "9px 20px 9px 15px",
                display: "flex",
                alignItems: "center",
                fontWeight: selectedButton === btn.key ? 600 : 500,
                fontSize: "1.07rem",
                color: selectedButton === btn.key ? "#9e36c1" : "#3e4062",
                gap: 7,
                cursor: "pointer",
                position: "relative",
                minWidth: "100px",

                // Animation styles
                transform:
                  clickedButton === btn.key
                    ? "scale(0.95)"
                    : hoveredButton === btn.key
                    ? "scale(1.05)"
                    : "scale(1)",
                transition: "transform 0.15s ease, box-shadow 0.15s ease",
                userSelect: "none",
                outline: "none",
              }}
            >
              <span>{btn.icon}</span>
              {btn.label}
              {btn.tag && (
                <span
                  style={{
                    background: btn.tagColor,
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: "0.73rem",
                    borderRadius: "7px",
                    padding: "2.5px 10px",
                    marginLeft: 8,
                    userSelect: "none",
                  }}
                >
                  {btn.tag}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Compliance Footer */}
      <div
        style={{
          marginTop: 30,
          color: "#b6afd4",
          fontSize: "1.1rem",
          textAlign: "center",
        }}
      >
        Athena AI can make mistakes. Please verify important information.
      </div>
    </div>
  );
};

export default Dashboard;
