import React from "react";
import {
  FiMoreHorizontal,
  FiStar,
  FiEye,
  FiEdit2,
  FiDownload,
  FiShare2,
  FiTrash2,
} from "react-icons/fi";
import { FaRegStar, FaRegFileAlt } from "react-icons/fa";

const CARDS = [
  {
    icon: <FaRegFileAlt size={32} style={{ color: "#d7c3ee" }} />,
    title: "Marketing Brochure",
    desc: "Print-ready brochure design for medical practice",
    category: "Print Design",
    status: "Review",
    hashtags: ["#print", "#medical", "#brochure"],
    date: "2 days ago",
    size: "6.1 MB",
    favorite: false,
  },
];

const statusBg = {
  Completed: "#eafbf3",
  "In Progress": "#e7f0fd",
  Draft: "#fff9e7",
  Review: "#f7edfa",
};

const statusColor = {
  Completed: "#4db97f",
  "In Progress": "#387df6",
  Draft: "#b68d00",
  Review: "#ac50d9",
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
      transition: "background 0.11s",
    }}
    onMouseEnter={(e) =>
      (e.currentTarget.style.background = danger ? "#ffe8ea" : "#f6f4fd")
    }
    onMouseLeave={(e) =>
      (e.currentTarget.style.background = danger ? "#fff6f7" : "#fff")
    }
  >
    {icon}
    {text}
  </div>
);

const ArchiveProjectCard = ({ projects, hovered, setHovered, menuOpen, setMenuOpen }) => (
  <>
    {projects.map((data, i) => (
      <div
        key={i}
        style={{
          background: "#fff",
          borderRadius: 22,
          boxShadow:
            hovered === i ? "0 12px 48px #b1acf7cc" : "0 3px 17px #eaeaf93d",
          border: "1.7px solid #edeefa",
          padding: "30px 24px 22px 24px",
          minHeight: 212,
          display: "flex",
          flexDirection: "column",
          position: "relative",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          cursor: "pointer",
          transform: hovered === i ? "scale(1.05)" : "scale(1)",
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
            zIndex: 2,
          }}
        >
          {(hovered === i || menuOpen === i) && (
            <button
              onClick={(e) => {
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
                minWidth: 151,
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
            zIndex: 1,
          }}
        >
          {data.favorite ? (
            <FiStar
              size={22}
              color="#fdd835"
              title="Favorite"
              style={{ fill: "#fdd835" }}
            />
          ) : (
            <FaRegStar size={22} color="#e4e4e6" title="Not Favorite" />
          )}
        </div>
        {/* Project icon */}
        <div style={{ marginBottom: 16 }}>{data.icon}</div>
        <div
          style={{
            fontWeight: 700,
            fontSize: "1.16rem",
            color: "#181d3a",
            marginBottom: 5,
          }}
        >
          {data.title}
        </div>
        <div
          style={{
            color: "#757891",
            fontSize: "1.07rem",
            marginBottom: 16,
            minHeight: 38,
          }}
        >
          {data.desc}
        </div>
        <div
          style={{
            marginBottom: 13,
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          <span
            style={{
              background: "#f7f8fb",
              color: "#322d4c",
              fontWeight: 600,
              borderRadius: 9,
              fontSize: "0.99rem",
              padding: "5px 16px",
            }}
          >
            {data.category}
          </span>
          <span
            style={{
              background: statusBg[data.status],
              color: statusColor[data.status],
              fontWeight: 700,
              borderRadius: 10,
              fontSize: "1.01rem",
              padding: "5px 15px",
            }}
          >
            {data.status}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            marginBottom: 16,
          }}
        >
          {data.hashtags.map((tag, idx) => (
            <span
              key={tag}
              style={{
                background: "#f5f6fc",
                color: "#888ca9",
                fontWeight: 600,
                borderRadius: 8,
                fontSize: "0.99rem",
                padding: "4px 11px",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontWeight: 500,
            color: "#adb2c0",
            fontSize: "1.07rem",
          }}
        >
          <span>{data.date}</span>
          <span>{data.size}</span>
        </div>
      </div>
    ))}
  </>
);

export default ArchiveProjectCard;
