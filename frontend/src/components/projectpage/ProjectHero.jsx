import React from "react";

export const ProjectHero = () => (
  <div style={{ width: "100%", maxWidth: 1440, margin: "0 auto", padding: "36px 24px 0" }}>
    {/* Header Area */}
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", marginBottom: 32 }}>
      <div>
        <h1 style={{ fontSize: "2.08rem", fontWeight: 800, color: "#21222b", marginBottom: 4, letterSpacing: "-0.02em" }}>
          My Projects
        </h1>
        <p style={{ fontSize: "1.14rem", fontWeight: 500, color: "#898a98", marginTop: 0 }}>
          Manage your projects, templates, and brand kits
        </p>
      </div>
      <div style={{ display: "flex", gap: 12, flexShrink: 0, marginTop: "8px" }}>
        {/* New Project Button */}
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
          onMouseEnter={e => {
            e.currentTarget.style.transform = "scale(1.03)";
            e.currentTarget.style.boxShadow = "0 12px 32px #a499f917";
            e.currentTarget.style.borderColor = "#b2adf6";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = "";
            e.currentTarget.style.boxShadow = "0 2px 8px #a88ff520";
            e.currentTarget.style.borderColor = "";
          }}
        >
          New Project
        </button>
        {/* Import Button */}
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
          onMouseEnter={e => {
            e.currentTarget.style.transform = "scale(1.03)";
            e.currentTarget.style.boxShadow = "0 12px 32px #a499f917";
            e.currentTarget.style.borderColor = "#b2adf6";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = "";
            e.currentTarget.style.boxShadow = "0 1px 5px #edeaff1f";
            e.currentTarget.style.borderColor = "#eef0fc";
          }}
        >
          Import
        </button>
      </div>
    </div>
  </div>
);

export default ProjectHero;
