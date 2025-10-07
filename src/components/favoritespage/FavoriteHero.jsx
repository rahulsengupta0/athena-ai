import React from "react";
import { FiStar, FiBookmark, FiDownload, FiShare2 } from "react-icons/fi";
import { FaPalette, FaCamera } from "react-icons/fa";
import { PiTargetDuotone } from "react-icons/pi";
import { PiWrenchDuotone } from "react-icons/pi";
import { AiOutlineFontSize } from "react-icons/ai"; // Fixed icon import
import { LuSparkles } from "react-icons/lu";

const stats = [
  {
    label: "Total Favorites",
    value: 156,
    icon: <FiStar size={38} color="#8667f7" />,
    iconColor: "#8667f7",
  },
  {
    label: "Collections",
    value: 12,
    icon: <FiBookmark size={38} color="#8667f7" />,
    iconColor: "#8667f7",
  },
  {
    label: "Downloaded",
    value: 89,
    icon: <FiDownload size={38} color="#8667f7" />,
    iconColor: "#8667f7",
  },
  {
    label: "Shared",
    value: 23,
    icon: <FiShare2 size={38} color="#8667f7" />,
    iconColor: "#8667f7",
  },
];

const collections = [
  {
    name: "Brand Inspirations",
    count: 23,
    icon: <PiTargetDuotone size={32} color="#ff5672" style={{ marginTop: 3 }} />,
  },
  {
    name: "Color Schemes",
    count: 15,
    icon: <FaPalette size={32} color="#fd8ecb" />,
  },
  {
    name: "Typography",
    count: 12,
    icon: <AiOutlineFontSize size={30} color="#3a9dfd" style={{ marginTop: 2 }} />,
  },

  {
    name: "Photography",
    count: 18,
    icon: <FaCamera size={32} color="#eed46d" style={{ marginTop: 1 }} />,
  },
  {
    name: "UI Patterns",
    count: 29,
    icon: <PiWrenchDuotone size={32} color="#b79bef" style={{ marginTop: 1 }} />,
  },
  {
    name: "Illustrations",
    count: 8,
    icon: <LuSparkles size={32} color="#f9c571" style={{ marginTop: 3 }} />,
  },
];

export const FavoritesHero = () => (
  <div
    style={{
      width: "100%",
      maxWidth: 1380,
      margin: "0 auto",
      padding: "36px 0 0 0",
    }}
  >
    {/* Main title */}
    <h1
      style={{
        textAlign: "center",
        fontWeight: 800,
        fontSize: "2.18rem",
        color: "#181e2c",
        marginBottom: 6,
        letterSpacing: "-.02em",
      }}
    >
      Your Favorites
    </h1>
    <p
      style={{
        color: "#9a9cb9",
        fontSize: "1.1rem",
        fontWeight: 500,
        textAlign: "center",
        margin: 0,
        marginBottom: 33,
      }}
    >
      All your saved designs, templates, and inspiration in one place
    </p>
    {/* Stats cards */}
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4,1fr)",
        gap: 30,
        margin: "0 auto",
        marginBottom: 28,
        maxWidth: 950,
      }}
    >
      {stats.map((card, idx) => (
        <div
          key={card.label}
          style={{
            background: "#fff",
            borderRadius: 28,
            border: "1px solid #d1d1d6",    // Thin grey border line added here
            boxShadow: "0 3px 16px #e9e4f333",
            padding: "35px 18px 30px 18px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minWidth: 176,
            minHeight: 133,
            transition: "transform 0.16s, box-shadow 0.16s",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.boxShadow = "0 8px 28px #a597fc29";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 3px 16px #e9e4f333";
          }}
        >
          <div style={{ marginBottom: 8 }}>{card.icon}</div>
          <div
            style={{
              fontWeight: 800,
              color: "#23233b",
              fontSize: "2.15rem",
              letterSpacing: "-.02em",
            }}
          >
            {card.value}
          </div>
          <div
            style={{
              color: "#78778c",
              fontSize: "1.06rem",
              fontWeight: 600,
              marginTop: 0,
            }}
          >
            {card.label}
          </div>
        </div>
      ))}
    </div>
    {/* Collections Label */}
    <div
      style={{
        fontSize: "1.28rem",
        fontWeight: 700,
        color: "#26273a",
        margin: "5px 0 16px 13px",
      }}
    >
      Collections
    </div>
    {/* Collections cards */}
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(145px, 1fr))",
        gap: 16,
        marginLeft: 0,
      }}
    >
      {collections.map((col, idx) => (
        <div
          key={col.name}
          style={{
            background: "#fff",
            borderRadius: 22,
            border: "1px solid #d1d1d6",   // Thin grey border line added here as well
            minWidth: 145,
            maxWidth: 165,
            boxShadow: "0 2px 12px #f7e7fa22",
            padding: "28px 10px 20px 10px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            transition: "transform 0.13s, box-shadow 0.13s",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.055)";
            e.currentTarget.style.boxShadow = "0 10px 32px #b197f93a";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 2px 12px #f7e7fa22";
          }}
        >
          <div style={{ marginBottom: 9 }}>{col.icon}</div>
          <div
            style={{
              fontSize: "1.07rem",
              fontWeight: 700,
              color: "#2f3247",
              marginBottom: 2,
              textAlign: "center",
            }}
          >
            {col.name}
          </div>
          <div
            style={{
              color: "#989bb4",
              fontWeight: 600,
              fontSize: "1.01rem",
            }}
          >
            {col.count} items
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default FavoritesHero;
