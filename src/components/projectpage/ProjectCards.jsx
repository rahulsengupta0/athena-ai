import React, { useState } from "react";
import {
  FiMoreHorizontal,
  FiStar,
  FiEye,
  FiEdit2,
  FiDownload,
  FiShare2,
  FiTrash2,
  FiSearch,
  FiChevronDown
} from "react-icons/fi";
import { FaPalette, FaCamera, FaGlobe, FaRegFileAlt, FaRegStar, FaRegStar as FaStarSolid, FaThLarge } from "react-icons/fa";

const projects = [
  {
    icon: <FaPalette size={32} style={{ color: "#f79ebb" }} />,
    title: "Brand Identity - TechStart",
    desc: "Complete brand package including logo, colors, and guidelines",
    category: "Brand",
    status: "Completed",
    statusColor: "#6cc996",
    hashtags: ["#branding", "#logo", "#startup"],
    date: "2 days ago",
    size: "12.4 MB",
    favorite: true
  },
  {
    icon: (
      <FaThLarge size={32} style={{ color: "#fbba46" }} />
    ),
    title: "Social Media Campaign",
    desc: "Instagram posts and stories for wellness brand",
    category: "Social Media",
    status: "In Progress",
    statusColor: "#6b91f6",
    hashtags: ["#social", "#wellness", "#instagram"],
    date: "1 hour ago",
    size: "8.7 MB",
    favorite: false
  },
  {
    icon: (
      <FaGlobe size={32} style={{ color: "#36c0ef" }} />
    ),
    title: "Website Landing Page",
    desc: "Modern landing page design for SaaS",
    category: "Web Design",
    status: "Draft",
    statusColor: "#ffd452",
    hashtags: ["#web", "#saas", "#landing"],
    date: "3 days ago",
    size: "15.2 MB",
    favorite: true
  },
  {
    icon: (
      <FaCamera size={32} style={{ color: "#b6aeea" }} />
    ),
    title: "Product Photography",
    desc: "AI-enhanced product photos for e-commerce",
    category: "Photography",
    status: "Completed",
    statusColor: "#6cc996",
    hashtags: ["#product", "#ecommerce", "#photo"],
    date: "1 week ago",
    size: "45.8 MB",
    favorite: false
  },
  {
    icon: (
      <FaThLarge size={32} style={{ color: "#fbba46" }} />
    ),
    title: "Mobile App UI Kit",
    desc: "Comprehensive UI components for mobile app",
    category: "UI Design",
    status: "In Progress",
    statusColor: "#6b91f6",
    hashtags: ["#mobile", "#ui", "#components"],
    date: "5 hours ago",
    size: "28.3 MB",
    favorite: true
  },
  {
    icon: (
      <FaRegFileAlt size={32} style={{ color: "#d7c3ee" }} />
    ),
    title: "Marketing Brochure",
    desc: "Print-ready brochure design for medical practice",
    category: "Print Design",
    status: "Review",
    statusColor: "#c98df7",
    hashtags: ["#print", "#medical", "#brochure"],
    date: "2 days ago",
    size: "6.1 MB",
    favorite: false
  }
];

const statusBg = {
  "Completed": "#eafbf3",
  "In Progress": "#e7f0fd",
  "Draft": "#fff9e7",
  "Review": "#f7edfa"
};

const statusColor = {
  "Completed": "#4db97f",
  "In Progress": "#387df6",
  "Draft": "#b68d00",
  "Review": "#ac50d9"
};

const projectFilters = [
  "All Projects",
  "Favorites",
  "Completed",
  "In Progress",
  "Draft",
  "Review"
];

export const ProjectCards = () => {
  const [dropdown, setDropdown] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(projectFilters[0]);
  const [hovered, setHovered] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);

  return (
    <div style={{
      width: "100%",
      maxWidth: 1320,
      margin: "0 auto", 
      padding: "28px 24px 20px 24px"
    }}>
      {/* Top bar */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 30,
        flexWrap: "wrap"
      }}>
        <div style={{
          position: "relative",
          width: 340,
          maxWidth: "90%"
        }}>
          <FiSearch style={{ position: "absolute", top: 14, left: 18, color: "#b3b7cd", fontSize: 20 }} />
          <input
            type="text"
            placeholder="Search projects..."
            style={{
              width: "100%",
              borderRadius: "16px",
              background: "#fafbff",
              border: "1.5px solid #eeeff7",
              outline: "none",
              padding: "11px 16px 11px 44px",
              fontSize: "1.11rem",
              color: "#24243b",
              fontWeight: 500,
            }}
          />
        </div>
        {/* Filter dropdown */}
        <div style={{ position: "relative", minWidth: 175 }}>
          <button
            onClick={() => setDropdown(d => !d)}
            style={{
              background: "#fff",
              border: "1.5px solid #eeeff7",
              color: "#6d6f80",
              padding: "8px 30px 8px 16px",
              borderRadius: "16px",
              fontSize: "1.07rem",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              minWidth: 148,
              boxShadow: dropdown ? "0 3px 28px #a889ff13" : "none"
            }}
          >
            {selectedFilter}
            <FiChevronDown style={{ marginLeft: 12, fontSize: 20, transition: "all 0.18s", transform: dropdown ? "rotate(-180deg)" : "" }} />
          </button>
          {dropdown &&
            <div style={{
              position: "absolute",
              right: 0,
              top: "102%",
              marginTop: 6,
              background: "#fff",
              borderRadius: 17,
              boxShadow: "0 6px 32px #aba7ed35",
              zIndex: 40,
              minWidth: 182,
              padding: "7px 0",
              border: "1.5px solid #edecfa"
            }}>
              {projectFilters.map((v, idx) =>
                <div
                  key={v}
                  onClick={() => {
                    setSelectedFilter(v);
                    setDropdown(false);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "10px 18px",
                    fontWeight: v === selectedFilter ? 700 : 500,
                    color: v === selectedFilter ? "#7049f7" : "#37344a",
                    background: v === selectedFilter ? "#ece7fc" : "none",
                    fontSize: "1.08rem",
                    cursor: "pointer"
                  }}
                >
                  {v === selectedFilter && <span style={{
                    width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                    <span style={{
                      display: "inline-block",
                      width: 13,
                      height: 13,
                      borderRadius: "50%",
                      background: "#9267fa",
                      marginRight: 10,
                      verticalAlign: "middle"
                    }}></span>
                  </span>}
                  {v}
                </div>
              )}
            </div>}
        </div>
      </div>
      {/* Card grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "28px"
      }}>
        {projects.map((card, i) => (
          <div
            key={i}
            style={{
              background: "#fff",
              borderRadius: 22,
              boxShadow: "0 3px 17px #eaeaf93d",
              border: "1.7px solid #edeefa",
              padding: "30px 24px 22px 24px",
              minHeight: 212,
              display: "flex",
              flexDirection: "column",
              position: "relative",
              transition: "transform 0.15s, box-shadow 0.15s, border 0.15s",
              cursor: "pointer"
            }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => {
              setHovered(null);
              setMenuOpen(null);
            }}
          >
            {/* Three dots hover menu */}
            <div
              style={{
                position: "absolute",
                top: 20,
                right: 24,
                zIndex: 2
              }}
            >
              {(hovered === i || menuOpen === i) && (
                <button
                  onClick={e => {
                    e.stopPropagation();
                    setMenuOpen(menuOpen === i ? null : i);
                  }}
                  style={{
                    background: "#f5f6ff",
                    border: "none",
                    borderRadius: "50%",
                    width: 36,
                    height: 36,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <FiMoreHorizontal size={22} color="#7268a3" />
                </button>
              )}
              {menuOpen === i && (
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: 36,
                    background: "#fff",
                    borderRadius: 15,
                    boxShadow: "0 10px 30px #7f7ee111",
                    border: "1.3px solid #ece9ff",
                    zIndex: 99,
                    minWidth: 151
                  }}
                >
                  <MenuItem icon={<FiEye />} text="View" />
                  <MenuItem icon={<FiEdit2 />} text="Edit" />
                  <MenuItem icon={<FiDownload />} text="Download" />
                  <MenuItem icon={<FiShare2 />} text="Share" />
                  <MenuItem icon={<FiTrash2 color="#ed5972" />} text="Delete" danger />
                </div>
              )}
            </div>
            {/* Star icon */}
            <div
              style={{
                position: "absolute",
                top: 20,
                left: 24,
                zIndex: 1
              }}
            >
              {card.favorite
                ? <FiStar size={22} color="#fdd835" title="Favorite" style={{fill: "#fdd835"}} />
                : <FaRegStar size={22} color="#e4e4e6" title="Not Favorite" />}
            </div>
            {/* Project icon */}
            <div style={{ marginBottom: 16 }}>{card.icon}</div>
            <div style={{ fontWeight: 700, fontSize: "1.16rem", color: "#181d3a", marginBottom: 5 }}>
              {card.title}
            </div>
            <div style={{ color: "#757891", fontSize: "1.07rem", marginBottom: 16, minHeight: 38 }}>
              {card.desc}
            </div>
            <div style={{ marginBottom: 13, display: "flex", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
              <span style={{
                background: "#f7f8fb",
                color: "#322d4c",
                fontWeight: 600,
                borderRadius: 9,
                fontSize: "0.99rem",
                padding: "5px 16px"
              }}>
                {card.category}
              </span>
              <span style={{
                background: statusBg[card.status],
                color: statusColor[card.status],
                fontWeight: 700,
                borderRadius: 10,
                fontSize: "1.01rem",
                padding: "5px 15px"
              }}>
                {card.status}
              </span>
            </div>
            <div style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              marginBottom: 16
            }}>
              {card.hashtags.map((tag, idx) => (
                <span
                  key={tag}
                  style={{
                    background: "#f5f6fc",
                    color: "#888ca9",
                    fontWeight: 600,
                    borderRadius: 8,
                    fontSize: "0.99rem",
                    padding: "4px 11px"
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontWeight: 500,
              color: "#adb2c0",
              fontSize: "1.07rem"
            }}>
              <span>{card.date}</span>
              <span>{card.size}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const MenuItem = ({ icon, text, danger }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "9px 20px",
      cursor: "pointer",
      color: danger ? "#ed5972" : "#35345e",
      fontWeight: 600,
      fontSize: "1.04rem",
      borderTop: "1px solid #f2f0ff",
      background: danger ? "#fff6f7" : "#fff",
      transition: "background 0.11s"
    }}
    onMouseEnter={e => e.currentTarget.style.background = danger ? "#ffe8ea" : "#f6f4fd"}
    onMouseLeave={e => e.currentTarget.style.background = danger ? "#fff6f7" : "#fff"}
  >
    {icon}
    {text}
  </div>
);

export default ProjectCards;
