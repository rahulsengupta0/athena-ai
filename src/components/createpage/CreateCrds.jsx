import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FiEdit3,
  FiImage,
  FiFileText,
  FiCode,
  FiVideo,
  FiFeather,
} from "react-icons/fi";

const cards = [
  {
    icon: <FiEdit3 size={30} color="#f8fafc" />,
    title: "AI Design Generator",
    desc: "Turn prompts into polished layouts in seconds.",
    badge: "Popular",
    badgeColor: "#f43f5e",
    route: "/create/ai-design",
    meta: "156 projects created",
    efficiency: "94% efficiency",
    lastUsed: "2 hours ago",
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=80",
  },
  {
    icon: <FiImage size={30} color="#f8fafc" />,
    title: "Image Creator",
    desc: "Generate vivid artwork and product renders.",
    badge: "New",
    badgeColor: "#22c55e",
    route: "/create/image-creator",
    meta: "134 projects created",
    efficiency: "91% efficiency",
    lastUsed: "3 hours ago",
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=900&q=80",
  },
  {
    icon: <FiFileText size={30} color="#f8fafc" />,
    title: "Content Writer",
    desc: "Craft on-brand copy, scripts, and campaigns.",
    route: "/create/content-writer",
    meta: "118 projects created",
    efficiency: "90% efficiency",
    lastUsed: "45 mins ago",
    image:
      "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=900&q=80",
  },
  {
    icon: <FiCode size={30} color="#f8fafc" />,
    title: "Code Generator",
    desc: "Ship production-ready snippets with AI.",
    route: "/create/code-generator",
    meta: "101 projects created",
    efficiency: "88% efficiency",
    lastUsed: "1 hour ago",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80",
  },
  {
    icon: <FiVideo size={30} color="#f8fafc" />,
    title: "Video Producer",
    desc: "Storyboard and export pro-grade clips.",
    badge: "Pro",
    badgeColor: "#facc15",
    route: "/create/video-producer",
    meta: "67 projects created",
    efficiency: "86% efficiency",
    lastUsed: "7 hours ago",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
  },
  {
    icon: <FiFeather size={30} color="#f8fafc" />,
    title: "Brand Builder",
    desc: "Develop cohesive identity systems.",
    route: "/create/brand-builder",
    meta: "84 projects created",
    efficiency: "89% efficiency",
    lastUsed: "Today",
    image:
      "https://images.unsplash.com/photo-1489710437720-ebb67ec84dd2?auto=format&fit=crop&w=900&q=80",
  },
];

const badgeStyle = (badgeColor) => ({
  background: badgeColor,
  color: badgeColor === "#facc15" ? "#5b4600" : "#fff",
  fontWeight: 700,
  fontSize: "0.82rem",
  borderRadius: "13px",
  padding: "4px 12px",
  position: "absolute",
  top: 20,
  right: 20,
  boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
  zIndex: 2,
});

export const CreateCrds = () => {
  const navigate = useNavigate();
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #f8f9ff 0%, #ffffff 45%, #f8f9ff 100%)",
        minHeight: 700,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "48px 20px 64px 20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1400,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "28px",
          margin: "0 auto",
          justifyItems: "center",
        }}
      >
        {cards.map((card, i) => (
          <Card
            key={i}
            card={card}
            onStart={() => {
              if (card.route) {
                navigate(card.route);
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
        overflow: "hidden",
        borderRadius: 24,
        boxShadow: "0 20px 35px rgba(15, 23, 42, 0.2)",
        minHeight: 320,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        background: "#0f172a",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.boxShadow = "0 25px 45px rgba(15, 23, 42, 0.35)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 20px 35px rgba(15, 23, 42, 0.2)";
      }}
    >
      {card.badge && (
        <span style={badgeStyle(card.badgeColor)} className="card-badge">
          {card.badge}
        </span>
      )}
      <img
        src={card.image}
        alt={card.title}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "brightness(0.55)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(200deg, rgba(4, 4, 5, 0) 0%, rgba(69, 62, 70, 0.75) 65%)",
        }}
      />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 14,
          padding: "26px 28px 28px 28px",
          color: "#f8fafc",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <span
            style={{
              background: "rgba(187, 193, 200, 0.65)",
              borderRadius: 50,
              width: 48,
              height: 48,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {card.icon}
          </span>
          <div>
            <div style={{ fontSize: "1.25rem", fontWeight: 700 }}>
              {card.title}
            </div>
            <div style={{ fontSize: "0.92rem", color: "#cbd5f5" }}>
              {card.meta}
            </div>
          </div>
        </div>
        <p
          style={{
            margin: 0,
            fontSize: "0.98rem",
            color: "#e2e8f0",
            lineHeight: 1.5,
          }}
        >
          {card.desc}
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "0.85rem",
            fontWeight: 600,
            color: "#cbd5f5",
          }}
        >
          <div>
            <div>{card.efficiency}</div>
            
          </div>
          <div style={{ fontSize: "0.78rem", opacity: 0.9 }}>
            {card.route?.replace("/create/", "").replace("-", " ")}
          </div>
        </div>
        <button
          style={{
            marginTop: 18,
            background: "linear-gradient(120deg, rgba(248,250,252,0.95), #fff)",
            color: "#0f172a",
            fontWeight: 700,
            fontSize: "0.98rem",
            padding: "11px 0px",
            borderRadius: 999,
            border: "none",
            width: "100%",
            boxShadow: "0 12px 24px rgba(15, 23, 42, 0.25)",
            cursor: "pointer",
          }}
          onClick={onStart}
        >
          Start Creating
        </button>
      </div>
    </div>
  );
};

export default CreateCrds;
