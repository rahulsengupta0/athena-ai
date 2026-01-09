import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiChevronsLeft } from "react-icons/fi";

import {
  FiGrid,
  FiPlus,
  FiFolder,
  FiZap,
  FiImage,
  FiFileText,
  FiVideo,
  FiUsers,
  FiBarChart,
  FiHelpCircle,
  FiSettings,
  FiMenu,
  FiX,
  FiShield,
  FiLayout,
  FiArrowLeft,
} from "react-icons/fi";
import { useSidebar } from "../contexts/SidebarContext";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";

const SECTIONS = ["Navigation", "AI Tools", "Workspace"];

const badgeClasses = {
  pro: "bg-indigo-100 text-indigo-700",
  beta: "bg-red-100 text-red-600",
  new: "bg-green-100 text-green-700",
};

const SideBar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { isCollapsed, setIsCollapsed, isMobile, setIsMobile } = useSidebar();
  const { isAdmin } = useAuth();

  const [isOpen, setIsOpen] = React.useState(false);
  const [profile, setProfile] = React.useState(null);
  const [hoverProfile, setHoverProfile] = React.useState(false);

  /* responsive */
  React.useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [setIsMobile]);

  React.useEffect(() => {
    if (isMobile) setIsOpen(false);
  }, [pathname, isMobile]);

  React.useEffect(() => {
    if (!isMobile) return;
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [isOpen, isMobile]);

  /* profile */
  React.useEffect(() => {
    (async () => {
      try {
        const data = await api.getProfile();
        setProfile(data);
      } catch { }
    })();
  }, []);

  const navItems = React.useMemo(() => {
    const base = [
      { label: "Dashboard", icon: FiGrid, section: "Navigation", path: "/home" },
      { label: "Create", icon: FiPlus, section: "Navigation", path: "/create", badge: "new" },
      { label: "Presentation", icon: FiLayout, section: "Navigation", path: "/presentation", badge: "beta" },
      { label: "Projects", icon: FiFolder, section: "Navigation", path: "/projects" },

      { label: "AI Generator", icon: FiZap, section: "AI Tools", path: "/ai-generator", badge: "pro" },
      { label: "Image Editor", icon: FiImage, section: "AI Tools", path: "/image-editor" },
      { label: "Canva Clone", icon: FiGrid, section: "AI Tools", path: "/canva-clone", badge: "new" },
      { label: "Content Writer", icon: FiFileText, section: "AI Tools", path: "/create/content-writer" },
      { label: "Video Maker", icon: FiVideo, section: "AI Tools", path: "/video-maker", badge: "beta" },

      { label: "Team", icon: FiUsers, section: "Workspace", path: "/team" },
      { label: "Analytics", icon: FiBarChart, section: "Workspace", path: "/analytics" },
      { label: "Help & Support", icon: FiHelpCircle, section: "Workspace", path: "/help-support" },
      { label: "Settings", icon: FiSettings, section: "Workspace", path: "/settings" },
    ];

    if (isAdmin) {
      base.push({
        label: "Admin Dash",
        icon: FiShield,
        section: "Workspace",
        path: "/admin-dash",
        badge: "pro",
      });
    }

    return base;
  }, [isAdmin]);

  return (
    <>
      {/* Mobile toggle */}
      {isMobile && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed top-3 left-3 z-[1100] w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow"
        >
          {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
      )}


      {/* Overlay */}
      {isMobile && isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/30 z-[900]"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen z-[1000]
          flex flex-col
          text-slate-700
          border-r border-slate-200
          transition-all duration-300
          bg-[linear-gradient(135deg,rgb(247,247,251)_0%,rgb(247,247,251)_40%,rgb(238,242,255)_100%)]
          ${isMobile ? (isOpen ? "translate-x-0" : "-translate-x-full") : ""}
          ${isCollapsed && !isMobile ? "w-16" : "w-64"}
        `}
      >

        {/* Collapse toggle */}
        {!isMobile && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute top-6 -right-4 w-8 h-8 rounded-full bg-white border border-slate-200
                       text-slate-600 shadow flex items-center cursor-pointer justify-center hover:bg-slate-100"
          >
            <FiChevronsLeft
  className={`transition-transform duration-300 ${
    isCollapsed ? "rotate-180" : ""
  }`}
/>

          </button>
        )}

        {/* Header */}
        <div
          className={`flex flex-col justify-center items-center px-5 pt-2 ${isCollapsed && !isMobile ? "justify-center px-0" : ""
            }`}
        >
          {(!isCollapsed || isMobile) && (
            <span className=" text-sm text-purple-600">Welcome To</span>
          )}
          {(!isCollapsed || isMobile) && (
            <span className="font-bold text-lg text-slate-800">Athena AI</span>
          )}
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {SECTIONS.map((section) => (
            <div key={section}>
              {(!isCollapsed || isMobile) && (
                <div className="px-5 mt-5 mb-2 text-xs uppercase tracking-wider font-semibold text-slate-400">
                  {section}
                </div>
              )}

              <ul>
                {navItems
                  .filter((n) => n.section === section)
                  .map((item) => {
                    const Icon = item.icon;
                    const active = pathname === item.path;

                    return (
                      <li key={item.path}>
                        <button
                          onClick={() => {
                            navigate(item.path);
                            if (isMobile) setIsOpen(false);
                          }}
                          title={isCollapsed && !isMobile ? item.label : ""}
                          className={`
                            w-full cursor-pointer flex items-center gap-3 px-5 py-3 text-left
                            transition-colors
                            ${active
                              ? "bg-indigo-50 text-indigo-700 font-semibold"
                              : "hover:bg-slate-100 text-slate-700"
                            }
                            ${isCollapsed && !isMobile ? "justify-center px-0" : ""}
                          `}
                        >
                          <Icon className="shrink-0" />
                          {(!isCollapsed || isMobile) && (
                            <>
                              <span className="flex-1">{item.label}</span>
                              {item.badge && (
                                <span
                                  className={`text-[10px] px-2 py-[2px] rounded-lg font-bold ${badgeClasses[item.badge]}`}
                                >
                                  {item.badge.toUpperCase()}
                                </span>
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
          className="relative bg-white border-t border-slate-200 p-4"
          onMouseEnter={() => setHoverProfile(true)}
          onMouseLeave={() => setHoverProfile(false)}
        >
          <div
            className={`flex items-center gap-3 ${isCollapsed && !isMobile ? "justify-center" : ""
              }`}
          >
            <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold overflow-hidden">
              {profile?.avatar ? (
                <img src={profile.avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                `${profile?.firstName?.[0] || "A"}${profile?.lastName?.[0] || "T"}`
              )}
            </div>

            {(!isCollapsed || isMobile) && (
              <div>
                <div className="font-semibold text-sm text-slate-800">
                  {profile
                    ? `${profile.firstName || ""} ${profile.lastName || ""}`.trim()
                    : "User"}
                </div>
                {profile?.plan && (
                  <div className="text-xs text-slate-500">{profile.plan}</div>
                )}
              </div>
            )}
          </div>

          {/* Hover profile card */}
          {hoverProfile && isCollapsed && !isMobile && (
            <div className="absolute left-16 bottom-4 bg-white text-slate-900 rounded-xl
                            shadow-xl border border-slate-200 p-3 w-56 z-[1200]">
              <div className="flex gap-3 mb-2">
                <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  {profile?.avatar ? (
                    <img src={profile.avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    `${profile?.firstName?.[0] || "A"}${profile?.lastName?.[0] || "T"}`
                  )}
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-sm truncate">
                    {profile
                      ? `${profile.firstName || ""} ${profile.lastName || ""}`.trim()
                      : "User"}
                  </div>
                  <div className="text-xs text-slate-500 truncate">
                    {profile?.email || "—"}
                  </div>
                </div>
              </div>
              {profile?.plan && (
                <div className="text-xs text-slate-600">
                  Plan: <span className="font-semibold">{profile.plan}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default SideBar;
