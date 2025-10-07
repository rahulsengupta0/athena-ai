import React from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit3, FiImage, FiFileText, FiCode, FiVideo, FiFeather } from "react-icons/fi";

// Demo data for the "Start Creating" cards, with react-icons
const cards = [
  {
    icon: <FiEdit3 size={34} color="#fc5f93" />,
    iconBg: "#fbe0ec",
    title: "AI Design Generator",
    desc: "Create stunning designs from text descriptions",
    features: ["Logo design", "Social media posts", "Web layouts", "Print materials"],
    badge: "Popular",
    badgeColor: "#ff5253",
  },
  {
    icon: <FiImage size={34} color="#14cbbe" />,
    iconBg: "#d4f8f5",
    title: "Image Creator",
    desc: "Generate high-quality images and artwork",
    features: ["Photo-realistic images", "Digital art", "Illustrations", "Product mockups"],
    badge: "New",
    badgeColor: "#22c55e",
  },
  {
    icon: <FiFileText size={34} color="#409cff" />,
    iconBg: "#e0f5ff",
    title: "Content Writer",
    desc: "AI-powered content and copywriting",
    features: ["Blog posts", "Marketing copy", "Social captions", "Email templates"],
  },
  {
    icon: <FiCode size={34} color="#f85c2c" />,
    iconBg: "#ffe8db",
    title: "Code Generator",
    desc: "Generate and optimize code snippets",
    features: ["React components", "CSS animations", "API integrations", "Database queries"],
  },
  {
    icon: <FiVideo size={34} color="#a365ec" />,
    iconBg: "#f2e8fd",
    title: "Video Producer",
    desc: "Create animated videos and presentations",
    features: ["Animated logos", "Explainer videos", "Social media clips", "Presentations"],
    badge: "Pro",
    badgeColor: "#ffd347",
  },
  {
    icon: <FiFeather size={34} color="#fa8bb5" />,
    iconBg: "#fae6f2",
    title: "Brand Builder",
    desc: "Complete brand identity packages",
    features: ["Color palettes", "Typography", "Brand guidelines", "Asset library"],
  },
];

const badgeStyle = (badgeColor) => ({
  background: badgeColor,
  color: badgeColor === "#ffd347" ? "#694700" : "#fff",
  fontWeight: 700,
  fontSize: "0.82rem",
  borderRadius: "13px",
  padding: "3px 12px",
  position: "absolute",
  top: 18,
  right: 22,
  boxShadow: badgeColor === "#ffd347" ? "0 1px 1px #b7a76422" : undefined,
  zIndex: 2,
});

export const CreateCrds = () => {
  const navigate = useNavigate();
  return (
    <div
      style={{
        background: "none",
        minHeight: 700,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "28px 0 32px 0",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1400,
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)", // 3 equal columns
          gap: "28px",
          justifyContent: "center",
        }}
      >
        {cards.map((card, i) => (
          <Card
            key={i}
            card={card}
            onStart={() => {
              if (card.title === "AI Design Generator") {
                navigate("/create/ai-design");
              } else if (card.title === "Image Creator") {
                navigate("/create/image-creator");
              } else if (card.title === "Content Writer") {
                navigate("/create/content-writer");
              } else if (card.title === "Code Generator") {
                navigate("/create/code-generator");
              } else if (card.title === "Video Producer") {
                navigate("/create/video-producer");
              } else if (card.title === "Brand Builder") {
                navigate("/create/brand-builder");
              }
              
            }}
          />
        ))}
      </div>
    </div>
  );
};

const Card = ({ card, onStart }) => {
  return (
    <div
      style={{
        position: "relative",
        background: "#fff",
        borderRadius: 22,
        boxShadow: "0 3px 16px #e9e4f33d",
        border: "1.7px solid #efeefa",
        padding: "34px 36px 28px 32px",
        minHeight: 316,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        transition: "transform 0.17s cubic-bezier(.4,1,.7,1), box-shadow 0.17s",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.027)";
        e.currentTarget.style.boxShadow = "0 10px 32px #c5bdfa33";
        e.currentTarget.style.border = "1.7px solid #b79cfb";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 3px 16px #e9e4f33d";
        e.currentTarget.style.border = "1.7px solid #efeefa";
      }}
    >
      {card.badge && <span style={badgeStyle(card.badgeColor)}>{card.badge}</span>}
      <div
        style={{
          marginBottom: 14,
          marginTop: 3,
          background: card.iconBg,
          borderRadius: "13px",
          width: 48,
          height: 48,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {card.icon}
      </div>
      <div
        style={{
          fontSize: "1.22rem",
          fontWeight: 700,
          color: "#181d3a",
          marginBottom: 7,
          letterSpacing: "-.01em",
        }}
      >
        {card.title}
      </div>
      <div
        style={{
          color: "#868bad",
          fontSize: "1.085rem",
          marginBottom: 12,
          minHeight: 26,
        }}
      >
        {card.desc}
      </div>
      <ul
        style={{
          margin: 0,
          padding: 0,
          marginBottom: 18,
          listStyleType: "disc",
          paddingLeft: 22,
          color: "#4d55a3",
          fontSize: "1.03rem",
          fontWeight: 400,
          opacity: 0.91,
        }}
      >
        {card.features.map((feature, idx) => (
          <li key={idx} style={{ marginBottom: 1 }}>
            {feature}
          </li>
        ))}
      </ul>
      <button
        style={{
          marginTop: "auto",
          background: "linear-gradient(90deg,#a365ec 18%,#4baaff 98%)",
          color: "#fff",
          fontWeight: 700,
          fontSize: "1.08rem",
          padding: "10px 0px",
          borderRadius: "13px",
          border: "none",
          width: "100%",
          boxShadow: "0 0px 5px #a09acd23",
          letterSpacing: "0.01em",
          cursor: "pointer",
        }}
        onClick={onStart}
      >
        Start Creating
      </button>
    </div>
  );
};

export default CreateCrds;
