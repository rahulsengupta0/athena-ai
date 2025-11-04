import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const Recents = () => {
  const navigate = useNavigate();
  const [recentProjects, setRecentProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [isPhone, setIsPhone] = useState(false);
  const [isSmallMobile, setIsSmallMobile] = useState(false);

  useEffect(() => {
    const handle = () => {
      const width = window.innerWidth;
      setIsSmallMobile(width <= 360);
      setIsPhone(width <= 768);
    };
    handle();
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, []);

  useEffect(() => {
    const fetchRecentProjects = async () => {
      setLoadingProjects(true);
      try {
        const projects = await api.getProjects();
        // Sort by createdAt (most recent first) and take first 6
        const sorted = projects.sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));
        setRecentProjects(sorted.slice(0, 6));
      } catch (error) {
        console.error('Error fetching recent projects:', error);
        setRecentProjects([]);
      } finally {
        setLoadingProjects(false);
      }
    };
    fetchRecentProjects();
  }, []);

  return (
    <div
      style={{
        width: "100%",
        padding: isSmallMobile ? "16px 0" : isPhone ? "24px 0" : "32px 0",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: isSmallMobile ? "0 14px" : isPhone ? "0 22px" : "0 24px",
        }}
      >
        <h2
          style={{
            fontSize: isSmallMobile ? "1.3rem" : isPhone ? "1.5rem" : "1.8rem",
            fontWeight: 700,
            color: "#24243b",
            margin: 0,
            marginBottom: isSmallMobile ? 16 : isPhone ? 18 : 20,
          }}
        >
          Recents
        </h2>
        {loadingProjects ? (
          <div
            style={{
              background: "#fff",
              borderRadius: isSmallMobile ? "20px" : "24px",
              padding: isSmallMobile ? "40px 20px" : isPhone ? "50px 24px" : "60px 28px",
              textAlign: "center",
              color: "#757891",
              fontSize: "1.1rem",
            }}
          >
            Loading...
          </div>
        ) : recentProjects.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isSmallMobile ? "1fr" : isPhone ? "repeat(2, 1fr)" : "repeat(3, 1fr)",
              gap: isSmallMobile ? 12 : isPhone ? 16 : 20,
            }}
          >
            {recentProjects.map((project, index) => (
              <div
                key={project._id || index}
                onClick={() => navigate(`/projects`)}
                style={{
                  background: "#fff",
                  borderRadius: isSmallMobile ? "16px" : "20px",
                  padding: isSmallMobile ? "16px" : isPhone ? "20px" : "24px",
                  border: "1.5px solid #f1eeff",
                  cursor: "pointer",
                  transition: "transform 0.15s, box-shadow 0.15s",
                  boxShadow: "0 2px 12px #c9c6f211",
                }}
                onMouseEnter={(e) => {
                  if (!isSmallMobile && !isPhone) {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 4px 20px #c9c6f233";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSmallMobile && !isPhone) {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 2px 12px #c9c6f211";
                  }
                }}
              >
                <div
                  style={{
                    fontSize: isSmallMobile ? "1.8rem" : "2rem",
                    marginBottom: isSmallMobile ? 8 : 12,
                  }}
                >
                  {project.icon || "🎨"}
                </div>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: isSmallMobile ? "0.95rem" : "1.05rem",
                    color: "#181d3a",
                    marginBottom: 6,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {project.title}
                </div>
                <div
                  style={{
                    color: "#757891",
                    fontSize: isSmallMobile ? "0.85rem" : "0.95rem",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    lineHeight: 1.4,
                    marginBottom: 8,
                  }}
                >
                  {project.desc}
                </div>
                <div
                  style={{
                    fontSize: isSmallMobile ? "0.8rem" : "0.9rem",
                    color: "#adb2c0",
                  }}
                >
                  {project.date || new Date(project.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              background: "#fff",
              borderRadius: isSmallMobile ? "20px" : "24px",
              padding: isSmallMobile ? "40px 20px" : isPhone ? "50px 24px" : "60px 28px",
              textAlign: "center",
              color: "#757891",
              fontSize: "1.1rem",
              border: "1.5px solid #f1eeff",
            }}
          >
            No recent designs yet. Start creating to see them here!
          </div>
        )}
      </div>
    </div>
  );
};

export default Recents;

