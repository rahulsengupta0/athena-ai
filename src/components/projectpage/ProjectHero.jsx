import React from "react";
import { FiFolder } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";

const folders = [
   { name: "Recent Projects", count: 12, route: "recent" },
   { name: "Client Work", count: 8, route: "client" },
   { name: "Personal", count: 5, route: "personal" },
   { name: "Templates", count: 15, route: "templates" },
   { name: "Archive", count: 23, route: "archive" },
];

const iconColor = "#4f5ae7";
const inactiveColor = "#2c2d33";
const buttonHoverStyles = { transform: "scale(1.03)", boxShadow: "0 12px 32px #a499f917", borderColor: "#b2adf6" };

export const ProjectHero = () => {
  const location = useLocation();
  const currentFolder = location.pathname.split("/")[2] || "recent";
  return (
    <div style={{ width: "100%", maxWidth: 1440, margin: "0 auto", padding: "36px 24px 0" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: "2.08rem", fontWeight: 800, color: "#21222b", marginBottom: 4, letterSpacing: "-0.02em" }}>
            My Projects
          </h1>
          <p style={{ fontSize: "1.14rem", fontWeight: 500, color: "#898a98", marginTop: 0 }}>
            6 projects in your workspace
          </p>
        </div>
        <div style={{ display: "flex", gap: 12, flexShrink: 0, marginTop: "8px" }}>
          <button
            style={{
              background: "linear-gradient(90deg,#a18afd,#7cb6ff 90%)",
              color: "#fff",
              fontWeight: 700,
              fontSize: "1.05rem",
              borderRadius: 24,
              padding: "8px 24px",
              border: "none",
              display: "flex",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
              boxShadow: "0 2px 8px #a88ff520",
              whiteSpace: "nowrap",
              transition: "transform 0.15s, box-shadow 0.15s, border-color 0.15s",
            }}
            onMouseEnter={e => { Object.assign(e.currentTarget.style, buttonHoverStyles); }}
            onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 2px 8px #a88ff520"; e.currentTarget.style.borderColor = ""; }}
          >
            New Project
          </button>
          <button
            style={{
              background: "#fff",
              border: "1.5px solid #eef0fc",
              color: "#23263b",
              fontWeight: 600,
              fontSize: "1.05rem",
              borderRadius: 20,
              padding: "8px 20px",
              display: "flex",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
              boxShadow: "0 1px 5px #edeaff1f",
              whiteSpace: "nowrap",
              transition: "transform 0.15s, box-shadow 0.15s, border-color 0.15s",
            }}
            onMouseEnter={e => { Object.assign(e.currentTarget.style, buttonHoverStyles); }}
            onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 1px 5px #edeaff1f"; e.currentTarget.style.borderColor = "#eef0fc"; }}
          >
            Import
          </button>
        </div>
      </div>
      <div style={{ display: "flex", gap: 16, overflowX: "auto", paddingBottom: 8 }}>
        {folders.map(folder => (
          <Link
            key={folder.name}
            to={`/projects/${folder.route}`}
            style={{ textDecoration: "none", flex: "0 0 160px" }}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: 16,
                border: currentFolder === folder.route ? "1.5px solid #b2adf6" : "1.5px solid #f1effb",
                padding: "20px 18px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
                cursor: "pointer",
                userSelect: "none",
                transition: "transform 0.15s, box-shadow 0.15s, border 0.15s",
                whiteSpace: "nowrap",
                boxShadow: currentFolder === folder.route
                  ? "0 12px 32px #a499f917"
                  : "0 3px 16px #ede9f622",
                transform: currentFolder === folder.route ? "scale(1.03)" : "scale(1)"
              }}
            >
              <FiFolder size={42} color={currentFolder === folder.route ? iconColor : inactiveColor} style={{ marginBottom: 12 }} />
              <div style={{ fontWeight: 600, fontSize: "1.05rem", color: "#16192a", marginBottom: 6, textAlign: "center", overflow: "hidden", textOverflow: "ellipsis", width: "100%" }} title={folder.name}>
                {folder.name}
              </div>
              <div style={{ fontWeight: 500, fontSize: "0.9rem", color: "#949aae" }}>
                {folder.count} items
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProjectHero;
