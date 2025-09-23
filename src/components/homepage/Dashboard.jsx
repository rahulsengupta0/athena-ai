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
  const [isPhone, setIsPhone] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isSmallMobile, setIsSmallMobile] = useState(false);

  React.useEffect(() => {
    const handle = () => {
      const width = window.innerWidth;
      setIsSmallMobile(width <= 360);
      setIsPhone(width <= 768);
      setIsTablet(width > 768 && width <= 1024);
    };
    handle();
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(120deg,#eaefff 0%,#ffefff 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: isSmallMobile ? "16px 12px 12px 12px" : isPhone ? "24px 16px 12px 16px" : "44px 8px 12px 8px",
        width: "100%",
        overflowX: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* HERO TITLE */}
      <h1
        style={{
          fontSize: isSmallMobile ? "1.6rem" : isPhone ? "clamp(1.8rem,6vw,2.8rem)" : "clamp(1.8rem,6vw,3.5rem)",
          fontWeight: 800,
          margin: isSmallMobile ? "0 0 12px 0" : isPhone ? "0 0 16px 0" : "0 0 20px 0",
          background: "linear-gradient(90deg,#a08afc 0%,#3dcaff 60%,#d32f93 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          textAlign: "center",
          lineHeight: 1.2,
          padding: isSmallMobile ? "0 8px" : "0",
        }}
      >
        What will you create today?
      </h1>

      {/* NAVIGATION TABS */}
      <div
        style={{
          display: "flex",
          gap: isSmallMobile ? 8 : 12,
          justifyContent: "center",
          marginBottom: isSmallMobile ? 12 : isPhone ? 18 : 24,
          flexWrap: "wrap",
          width: isSmallMobile ? "100%" : "auto",
          padding: isSmallMobile ? "0 8px" : "0",
          overflowX: isSmallMobile ? "auto" : "visible",
          WebkitOverflowScrolling: isSmallMobile ? "touch" : undefined,
        }}
      >
        {navTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: isSmallMobile ? "6px 16px" : isPhone ? "7px 18px" : "8px 22px",
              borderRadius: isSmallMobile ? "18px" : "22px",
              background:
                activeTab === tab.key
                  ? "linear-gradient(90deg,#b692f6,#80c7fb)"
                  : "#fff",
              color: activeTab === tab.key ? "#fff" : "#52576d",
              fontWeight: 600,
              fontSize: isSmallMobile ? "0.85rem" : isPhone ? "0.95rem" : "clamp(0.95rem,2.5vw,1.13rem)",
              border: activeTab === tab.key ? "none" : "1.5px solid #eee",
              boxShadow:
                activeTab === tab.key ? "0 4px 28px 0 #c5bdf93d" : "none",
              transition: "all 0.18s",
              cursor: "pointer",
              minHeight: isSmallMobile ? "36px" : isPhone ? "40px" : "auto",
              whiteSpace: "nowrap",
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
          borderRadius: isSmallMobile ? "20px" : "24px",
          boxShadow: "0 2px 32px #c9c6f211",
          padding: isSmallMobile ? "12px 12px" : isPhone ? "16px 14px" : "26px 28px 22px 28px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: isSmallMobile ? "100%" : isPhone ? "92vw" : "100%",
          maxWidth: isSmallMobile ? "100%" : isPhone ? 420 : 740,
          marginBottom: isSmallMobile ? 16 : isPhone ? 20 : 26,
          border: "1.5px solid #f1eeff",
          boxSizing: "border-box",
        }}
      >
        {/* Input and create buttons */}
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: isSmallMobile ? "stretch" : isPhone ? "stretch" : "center",
            gap: isSmallMobile ? 8 : isPhone ? 10 : 12,
            marginBottom: isSmallMobile ? 12 : isPhone ? 14 : 22,
            flexWrap: isSmallMobile ? "wrap" : isPhone ? "wrap" : "nowrap",
            boxSizing: "border-box",
          }}
        >
          <button
            style={{
              border: "2px dashed #eae4ff",
              background: "transparent",
              borderRadius: "50%",
              width: isSmallMobile ? 36 : isPhone ? 38 : 44,
              height: isSmallMobile ? 36 : isPhone ? 38 : 44,
              fontSize: isSmallMobile ? "1.1rem" : isPhone ? "1.2rem" : "1.4rem",
              color: "#d1c4ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            +
          </button>
          <input
            type="text"
            placeholder={isSmallMobile ? "Describe your idea..." : "Describe your idea, and I'll bring it to life..."}
            style={{
              flex: 1,
              padding: isSmallMobile ? "8px 10px" : isPhone ? "10px 12px" : "12px 22px",
              fontSize: isSmallMobile ? "0.9rem" : isPhone ? "1rem" : "1.21rem",
              borderRadius: isSmallMobile ? "12px" : "14px",
              border: "1.5px solid #f2edfc",
              background: "#f7f3ff",
              outline: "none",
              marginRight: isSmallMobile ? 0 : isPhone ? 0 : 10,
              color: "#52576d",
              minHeight: isSmallMobile ? "34px" : isPhone ? "38px" : "auto",
            }}
          />
          <button
            style={{
              background: "linear-gradient(90deg,#8ee0fb,#a892fd)",
              color: "#fff",
              fontWeight: 700,
              fontSize: isSmallMobile ? "0.9rem" : isPhone ? "1rem" : "1.11rem",
              padding: isSmallMobile ? "8px 14px" : isPhone ? "10px 16px" : "11px 32px",
              borderRadius: isSmallMobile ? "10px" : "12px",
              border: "none",
              boxShadow: "0 2px 10px #c7f7fd66",
              display: "flex",
              alignItems: "center",
              gap: isSmallMobile ? 6 : 8,
              cursor: "pointer",
              transition: "background 0.14s, transform 0.14s",
              width: isSmallMobile ? "100%" : isPhone ? "100%" : undefined,
              minHeight: isSmallMobile ? "34px" : isPhone ? "38px" : "auto",
              justifyContent: "center",
            }}
            onMouseEnter={(e) => {
              if (!isSmallMobile && !isPhone) {
                e.target.style.transform = "scale(1.02)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isSmallMobile && !isPhone) {
                e.target.style.transform = "scale(1)";
              }
            }}
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: isSmallMobile ? "0.9rem" : isPhone ? "1rem" : "1.2rem",
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
            gap: isSmallMobile ? 6 : 10,
            width: "100%",
            justifyContent: isSmallMobile ? "center" : "flex-start",
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
                borderRadius: isSmallMobile ? 10 : 12,
                padding: isSmallMobile ? "6px 10px" : isPhone ? "8px 12px" : "9px 20px 9px 15px",
                display: "flex",
                alignItems: "center",
                fontWeight: selectedButton === btn.key ? 600 : 500,
                fontSize: isSmallMobile ? "0.85rem" : isPhone ? "0.98rem" : "1.07rem",
                color: selectedButton === btn.key ? "#9e36c1" : "#3e4062",
                gap: isSmallMobile ? 5 : 7,
                cursor: "pointer",
                position: "relative",
                minWidth: isSmallMobile ? "calc(50% - 4px)" : isPhone ? "calc(50% - 5px)" : "120px",
                flex: isSmallMobile ? "1 1 calc(50% - 4px)" : isPhone ? "1 1 calc(50% - 5px)" : "0 0 auto",
                minHeight: isSmallMobile ? "36px" : isPhone ? "40px" : "auto",

                // Animation styles
                transform:
                  clickedButton === btn.key
                    ? "scale(0.95)"
                    : hoveredButton === btn.key && !isSmallMobile && !isPhone
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
                    fontSize: isSmallMobile ? "0.65rem" : "0.73rem",
                    borderRadius: isSmallMobile ? "6px" : "7px",
                    padding: isSmallMobile ? "2px 8px" : "2.5px 10px",
                    marginLeft: isSmallMobile ? 4 : 8,
                    userSelect: "none",
                    whiteSpace: "nowrap",
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
          marginTop: isSmallMobile ? 20 : isPhone ? 24 : 30,
          color: "#b6afd4",
          fontSize: isSmallMobile ? "0.9rem" : isPhone ? "1rem" : "1.1rem",
          textAlign: "center",
          padding: isSmallMobile ? "0 16px" : "0",
          lineHeight: 1.4,
        }}
      >
        Athena AI can make mistakes. Please verify important information.
      </div>
    </div>
  );
};

export default Dashboard;
