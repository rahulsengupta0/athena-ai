import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiGrid, FiPlus, FiFolder, FiStar, FiZap, FiImage, FiFileText, FiVideo, FiUsers, FiBarChart, FiHelpCircle, FiSettings, FiMenu, FiX, FiShield, FiLayout, FiArrowLeft } from 'react-icons/fi';
import { useSidebar } from '../contexts/SidebarContext';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const NAV_ITEMS = [
  {
    label: "Dashboard",
    key: "dashboard",
    icon: <FiGrid size={18} />,
    section: "Navigation",
    path: "/home"
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
    label: "Presentation",
    key: "presentation",
    icon: <FiLayout size={18} />,
    section: "Navigation",
    sublabel: "Beta",
    sublabelClass: "beta",
    path: "/presentation"
  },
  {
    label: "Projects",
    key: "projects",
    icon: <FiFolder size={18} />,
    section: "Navigation",
    path: "/projects"
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
    label: "Presentation Studio",
    key: "presentationStudio",
    icon: <FiGrid size={18} />,
    section: "AI Tools",
    sublabel: "New",
    sublabelClass: "new",
    path: "/presentation-studio"
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
    label: "Editor",
    key: "editor",
    icon: <FiFileText size={18} />,
    section: "AI Tools",
    sublabel: "New",
    sublabelClass: "new",
    path: "/editor"
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
  const { isAdmin } = useAuth();

  const [isOpen, setIsOpen] = React.useState(false);
  const [profile, setProfile] = React.useState(null);
  const [isHoveringProfile, setIsHoveringProfile] = React.useState(false);

  // Dynamically add Admin Dash if user is admin
  const navItems = React.useMemo(() => {
    if (!isAdmin) return NAV_ITEMS;
    return [
      ...NAV_ITEMS,
      {
        label: "Admin Dash",
        key: "adminDash",
        icon: <FiShield size={18} />,
        section: "Workspace",
        path: "/admin-dash",
        sublabel: "Admin",
        sublabelClass: "pro",
      },
    ];
  }, [isAdmin]);

  // Detect viewport size
  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsMobile]);

  // Auto close drawer on route change for mobile
  React.useEffect(() => {
    if (isMobile) setIsOpen(false);
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

  // Fetch profile for avatar and basic info
  React.useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const data = await api.getProfile();
        if (!isMounted) return;
        setProfile(data || null);
      } catch {
        // Ignore silently if not authenticated or endpoint unavailable
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

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
            color: '#5f5aad',
          }}
        >
          {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
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

        {/* --- NEW DESKTOP TOGGLE BUTTON --- */}
        {!isMobile && (
          <button
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            onClick={() => setIsCollapsed(!isCollapsed)}
            style={{
              position: 'absolute',
              top: '24px',
              right: '-16px',
              zIndex: 1001,
              width: 32,
              height: 32,
              borderRadius: '50%',
              border: '1px solid #e5e5e9',
              background: '#ffffff',
              color: '#5f5aad',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
              transition: 'transform 0.25s ease',
            }}
          >
            <FiArrowLeft 
              size={20} 
              style={{ 
                transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.25s ease'
              }} 
            />
          </button>
        )}

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
                {navItems.filter((item) => item.section === section).map((item) => {
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
            position: "relative"
          }}
        >
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: 10,
            justifyContent: isCollapsed && !isMobile ? "center" : "flex-start"
          }}
          onMouseEnter={() => setIsHoveringProfile(true)}
          onMouseLeave={() => setIsHoveringProfile(false)}
          >
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
                overflow: "hidden"
              }}
            >
              {profile && profile.avatar && String(profile.avatar).startsWith('http') ? (
                <img
                  src={profile.avatar}
                  alt="avatar"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <span>
                  {(profile?.firstName?.[0] || 'A').toUpperCase()}
                  {(profile?.lastName?.[0] || 'T').toUpperCase()}
                </span>
              )}
            </div>
            {(!isCollapsed || isMobile) && (
              <div>
                <div style={{ fontWeight: 600, fontSize: "0.96rem", color: "#ffffff" }}>
                  {profile ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || 'User' : 'User'}
                </div>
                {profile?.plan && (
                  <div style={{ fontSize: "0.8rem", color: "#b8b5d6" }}>
                    {profile.plan}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Hover profile mini-card */}
          {isHoveringProfile && isCollapsed && !isMobile && (
            <div
              style={{
                position: "absolute",
                left: 68,
                bottom: 16,
                background: "#ffffff",
                color: "#0f172a",
                border: "1px solid #e2e8f0",
                borderRadius: 12,
                boxShadow: "0 12px 32px rgba(15,23,42,0.18)",
                padding: 12,
                minWidth: 220,
                zIndex: 1200,
              }}
              role="dialog"
              aria-label="Profile preview"
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "#f1f5f9",
                    color: "#5f5aad",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.95rem",
                    overflow: "hidden"
                  }}
                >
                  {profile && profile.avatar && String(profile.avatar).startsWith('http') ? (
                    <img
                      src={profile.avatar}
                      alt="avatar"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <span>
                      {(profile?.firstName?.[0] || 'A').toUpperCase()}
                      {(profile?.lastName?.[0] || 'T').toUpperCase()}
                    </span>
                  )}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#0f172a" }}>
                    {profile ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || 'User' : 'User'}
                  </div>
                  <div style={{ fontSize: "0.82rem", color: "#475569", overflow: "hidden", textOverflow: "ellipsis" }} title={profile?.email || ''}>
                    {profile?.email || '—'}
                  </div>
                </div>
              </div>
              {profile?.plan && (
                <div style={{ fontSize: "0.82rem", color: "#64748b" }}>
                  Plan: <span style={{ color: "#111827", fontWeight: 600 }}>{profile.plan}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SideBar;