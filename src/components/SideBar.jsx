import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiGrid, FiPlus, FiFolder, FiStar, FiZap, FiImage, FiFileText, FiVideo, FiUsers, FiBarChart, FiHelpCircle, FiSettings, FiMenu, FiX } from 'react-icons/fi';
import { useSidebar } from '../contexts/SidebarContext';

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
    label: "Canva Clone",
    key: "canvaClone",
    icon: <FiGrid size={18} />,
    section: "AI Tools",
    sublabel: "New",
    sublabelClass: "new",
    path: "/canva-clone"
  },
  {
    label: "Content Writer",
    key: "contentWriter",
    icon: <FiFileText size={18} />,
    section: "AI Tools",
    path: "/create/content-writer"
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

const sidebarBg = "#5f5aad";
const activeBg = "#4a4594";
const iconColor = "#ffffff";
const textColor = "#ffffff";
const sectionColor = "#b8b5d6";
const activeTextColor = "#ffffff";

const sublabelStyles = {
  pro: {
    background: "#ffffff",
    color: "#5f5aad",
    fontWeight: 600,
    fontSize: "0.70rem",
    borderRadius: "8px",
    padding: "2px 8px",
    marginLeft: "8px",
  },
  beta: {
    background: "#ff6b6b",
    color: "#ffffff",
    fontWeight: 600,
    fontSize: "0.70rem",
    borderRadius: "8px",
    padding: "2px 8px",
    marginLeft: "8px",
  },
  new: {
    background: "#51cf66",
    color: "#ffffff",
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
  const { isCollapsed, setIsCollapsed, isMobile, setIsMobile } = useSidebar();

  const [isOpen, setIsOpen] = React.useState(false);

  // Detect viewport size
  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto close drawer on route change for mobile
  React.useEffect(() => {
    if (isMobile) setIsOpen(false);
  }, [activePath, isMobile]);

  // Auto collapse sidebar on route change for desktop
  React.useEffect(() => {
    if (!isMobile) setIsCollapsed(true);
  }, [activePath, isMobile]);

  // Prevent background scroll when mobile drawer is open
  React.useEffect(() => {
    if (!isMobile) return;
    const originalOverflow = document.body.style.overflow;
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = originalOverflow || '';
    }
    return () => {
      document.body.style.overflow = originalOverflow || '';
    };
  }, [isOpen, isMobile]);

  const drawerWidth = isMobile ? Math.min(window.innerWidth, 420) : (isCollapsed ? 60 : 260);
  const sidebarStyle = {
    width: drawerWidth,
    background: sidebarBg,
    color: textColor,
    height: "100vh",
    position: "fixed",
    top: 0,
    left: 0,
    borderRight: "1px solid #e5e5e9",
    display: "flex",
    flexDirection: "column",
    transition: isMobile ? "transform 0.25s ease" : "width 0.25s ease",
    transform: isMobile ? (isOpen ? "translateX(0)" : "translateX(-100%)") : "none",
    willChange: isMobile ? "transform" : "width",
    zIndex: 1000,
    boxShadow: isMobile && isOpen ? "0 10px 30px rgba(0,0,0,0.15)" : "none",
  };

  return (
    <>
      {/* Mobile hamburger */}
      {isMobile && (
        <button
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setIsOpen((v) => !v)}
          style={{
            position: "fixed",
            top: 12,
            left: 12,
            zIndex: 1100,
            width: 40,
            height: 40,
            borderRadius: 12,
            border: "1px solid #e5e5e9",
            background: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
            cursor: "pointer",
          }}
        >
          {isOpen ? <FiX size={20} color={iconColor} /> : <FiMenu size={20} color={iconColor} />}
        </button>
      )}

      {/* Desktop toggle button - only show when collapsed */}
      {!isMobile && isCollapsed && (
        <button
          aria-label="Expand sidebar"
          onClick={() => setIsCollapsed(false)}
          style={{
            position: "fixed",
            top: 80,
            left: 14,
            zIndex: 1100,
            width: 32,
            height: 32,
            borderRadius: 8,
            border: "none",
            background: "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "none",
            cursor: "pointer",
          }}
        >
          <FiMenu size={16} color={iconColor} />
        </button>
      )}

      {/* Overlay */}
      {isMobile && isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.25)",
            zIndex: 900,
          }}
        />
      )}

      <div style={sidebarStyle} className="custom-scrollbar">
      {/* Header */}
      <div style={{ 
        padding: isCollapsed && !isMobile ? "28px 12px 12px 12px" : "28px 20px 12px 20px", 
        display: "flex", 
        alignItems: "center", 
        gap: 10,
        justifyContent: isCollapsed && !isMobile ? "center" : "flex-start"
      }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "12px",
            background: "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ color: "#ffffff", fontWeight: 700, fontSize: "1.35rem" }}>🧭</span>
        </div>
        {(!isCollapsed || isMobile) && (
          <span style={{ fontWeight: 700, fontSize: "1.12rem", color: "#ffffff" }}>Athena AI</span>
        )}
      </div>

      {/* Sections */}
      <div style={{ 
        flex: 1, 
        minHeight: 0, 
        overflowY: "auto",
        marginTop: isCollapsed && !isMobile ? "60px" : "0"
      }} className="custom-scrollbar">
        {SECTIONS.map((section) => (
          <div key={section}>
            {(!isCollapsed || isMobile) && (
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
            )}
            <ul style={{ padding: 0, margin: 0, listStyle: "none" }}>
              {NAV_ITEMS.filter((item) => item.section === section).map((item) => {
                const isActive = activePath === item.path;
                return (
                  <li key={item.key}>
                    <button
                      onClick={() => {
                        navigate(item.path);
                        if (isMobile) setIsOpen(false);
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                        border: "none",
                        outline: "none",
                        padding: isCollapsed && !isMobile ? "11px 12px" : "11px 20px",
                        cursor: "pointer",
                        backgroundColor: isActive ? activeBg : "transparent",
                        color: isActive ? activeTextColor : textColor,
                        fontWeight: isActive ? 600 : 500,
                        fontSize: "1rem",
                        transition: "background 0.15s",
                        justifyContent: isCollapsed && !isMobile ? "center" : "flex-start",
                      }}
                      title={isCollapsed && !isMobile ? item.label : undefined}
                    >
                      <span
                        style={{
                          color: iconColor,
                          display: "flex",
                          alignItems: "center",
                          marginRight: isCollapsed && !isMobile ? "0" : "14px",
                        }}
                      >
                        {item.icon}
                      </span>
                      {(!isCollapsed || isMobile) && (
                        <>
                          <span style={{ flex: 1, textAlign: "left" }}>{item.label}</span>
                          {item.sublabel && (
                            <span style={sublabelStyles[item.sublabelClass || "new"]}>{item.sublabel}</span>
                          )}
                        </>
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
          padding: isCollapsed && !isMobile ? "16px 12px" : "16px 20px",
          borderTop: "1px solid #4a4594",
          background: "#4a4594",
        }}
      >
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: 10,
          justifyContent: isCollapsed && !isMobile ? "center" : "flex-start"
        }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              background: "#ffffff",
              color: "#5f5aad",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.0rem",
            }}
          >
            AT
          </div>
          {(!isCollapsed || isMobile) && (
            <div>
              <div style={{ fontWeight: 600, fontSize: "0.96rem", color: "#ffffff" }}>Alex Thompson</div>
              <div style={{ fontSize: "0.8rem", color: "#b8b5d6" }}>Pro Plan</div>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default SideBar;
