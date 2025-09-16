import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiGrid, FiPlus, FiFolder, FiStar, FiZap, FiImage, FiFileText, FiVideo, FiUsers, FiBarChart, FiHelpCircle, FiSettings } from 'react-icons/fi';

const NAV_ITEMS = [
  {
    label: "Dashboard",
    key: "dashboard",
    icon: <FiGrid size={18} />,
    section: "Navigation",
    path: "/"
  },
  {
    label: "Create",
    key: "create",
    icon: <FiPlus size={18} />,
    section: "Navigation",
    sublabel: "New",
    sublabelClass: "new",
    path: "/create"
  },
  {
    label: "Projects",
    key: "projects",
    icon: <FiFolder size={18} />,
    section: "Navigation",
    path: "/projects"
  },
  {
    label: "Favorites",
    key: "favorites",
    icon: <FiStar size={18} />,
    section: "Navigation",
    path: "/favorites"
  },
  {
    label: "AI Generator",
    key: "aiGenerator",
    icon: <FiZap size={18} />,
    section: "AI Tools",
    sublabel: "Pro",
    sublabelClass: "pro",
    path: "/ai-generator"
  },
  {
    label: "Image Editor",
    key: "imageEditor",
    icon: <FiImage size={18} />,
    section: "AI Tools",
    path: "/image-editor"
  },
  {
    label: "Content Writer",
    key: "contentWriter",
    icon: <FiFileText size={18} />,
    section: "AI Tools",
    path: "/content-writer"
  },
  {
    label: "Video Maker",
    key: "videoMaker",
    icon: <FiVideo size={18} />,
    section: "AI Tools",
    sublabel: "Beta",
    sublabelClass: "beta",
    path: "/video-maker"
  },
  {
    label: "Team",
    key: "team",
    icon: <FiUsers size={18} />,
    section: "Workspace",
    path: "/team"
  },
  {
    label: "Analytics",
    key: "analytics",
    icon: <FiBarChart size={18} />,
    section: "Workspace",
    path: "/analytics"
  },
  {
    label: "Help & Support",
    key: "helpSupport",
    icon: <FiHelpCircle size={18} />,
    section: "Workspace",
    path: "/help-support"
  },
  {
    label: "Settings",
    key: "settings",
    icon: <FiSettings size={18} />,
    section: "Workspace",
    path: "/settings"
  },
];

const SECTIONS = ["Navigation", "AI Tools", "Workspace"];

const sidebarBg = "#f5f6fa";
const activeBg = "#ece7fc";
const iconColor = "#5f5aad";
const textColor = "#292d34";
const sectionColor = "#b1b6cc";
const activeTextColor = "#5f5aad";

const sublabelStyles = {
  pro: {
    background: "#ede7fe",
    color: "#5f5aad",
    fontWeight: 600,
    fontSize: "0.70rem",
    borderRadius: "8px",
    padding: "2px 8px",
    marginLeft: "8px",
  },
  beta: {
    background: "#f8dada",
    color: "#d96464",
    fontWeight: 600,
    fontSize: "0.70rem",
    borderRadius: "8px",
    padding: "2px 8px",
    marginLeft: "8px",
  },
  new: {
    background: "#e9fae4",
    color: "#6cb670",
    fontWeight: 600,
    fontSize: "0.70rem",
    borderRadius: "8px",
    padding: "2px 8px",
    marginLeft: "8px",
  },
};

const SideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const activePath = location.pathname;

  return (
    <div
      style={{
        width: 260,
        background: sidebarBg,
        color: textColor,
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        borderRight: "1px solid #e5e5e9",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div style={{ padding: "28px 20px 12px 20px", display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "12px",
            background: "#ede7fe",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ color: iconColor, fontWeight: 700, fontSize: "1.35rem" }}>🧭</span>
        </div>
        <span style={{ fontWeight: 700, fontSize: "1.12rem", color: "#434678" }}>Athena AI</span>
      </div>

      {/* Sections */}
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
        {SECTIONS.map((section) => (
          <div key={section}>
            <div
              style={{
                fontSize: "0.78rem",
                letterSpacing: 1,
                textTransform: "uppercase",
                fontWeight: 600,
                margin: "20px 0 6px 20px",
                color: sectionColor,
              }}
            >
              {section}
            </div>
            <ul style={{ padding: 0, margin: 0, listStyle: "none" }}>
              {NAV_ITEMS.filter((item) => item.section === section).map((item) => {
                const isActive = activePath === item.path;
                return (
                  <li key={item.key}>
                    <button
                      onClick={() => navigate(item.path)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                        border: "none",
                        outline: "none",
                        padding: "11px 20px",
                        cursor: "pointer",
                        backgroundColor: isActive ? activeBg : "transparent",
                        color: isActive ? activeTextColor : textColor,
                        fontWeight: isActive ? 600 : 500,
                        fontSize: "1rem",
                        transition: "background 0.15s",
                      }}
                    >
                      <span
                        style={{
                          color: iconColor,
                          display: "flex",
                          alignItems: "center",
                          marginRight: "14px",
                        }}
                      >
                        {item.icon}
                      </span>
                      <span style={{ flex: 1, textAlign: "left" }}>{item.label}</span>
                      {item.sublabel && (
                        <span style={sublabelStyles[item.sublabelClass || "new"]}>{item.sublabel}</span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "16px 20px",
          borderTop: "1px solid #ece7fc",
          background: "#faf9fe",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              background: "#ede7fe",
              color: iconColor,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.0rem",
            }}
          >
            AT
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: "0.96rem", color: "#434678" }}>Alex Thompson</div>
            <div style={{ fontSize: "0.8rem", color: "#aba6c1" }}>Pro Plan</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
