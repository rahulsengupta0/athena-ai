import React from "react";
import { MdBolt } from "react-icons/md";

const tools = [
  {
    name: "AI Design Generator",
    meta: "156 projects created",
    percent: 89,
    efficiency: "94% efficiency",
    avgQuality: "94%",
    lastUsed: "2 hours ago",
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Content Writer",
    meta: "134 projects created",
    percent: 76,
    efficiency: "91% efficiency",
    avgQuality: "91%",
    lastUsed: "3 hours ago",
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Image Editor",
    meta: "98 projects created",
    percent: 63,
    efficiency: "87% efficiency",
    avgQuality: "87%",
    lastUsed: "5 hours ago",
    image:
      "https://images.unsplash.com/photo-1581093588401-22e8c5f62f9b?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Video Maker",
    meta: "67 projects created",
    percent: 45,
    efficiency: "83% efficiency",
    avgQuality: "83%",
    lastUsed: "7 hours ago",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
  },
];

export default function AIToolsSection() {
  return (
    <div
      style={{
        display: "grid",
        gap: 28,
        marginTop: 20,
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
      }}
    >
      {tools.map((tool) => (
        <div
          key={tool.name}
          style={{
            position: "relative",
            overflow: "hidden",
            borderRadius: 20,
            boxShadow: "0 8px 32px rgba(31, 38, 135, 0.1)",
            backdropFilter: "blur(10px)",
            transition: "all 0.35s ease",
            cursor: "pointer",
            height: 250,
          }}
          className="tool-card"
        >
          {/* Background Image */}
          <img
            src={tool.image}
            alt={tool.name}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              objectFit: "cover",
              top: 0,
              left: 0,
              zIndex: 0,
              filter: "brightness(0.7)",
            }}
          />

          {/* Gradient Overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom right, rgba(0,0,0,0.4), rgba(0,0,0,0.6))",
              zIndex: 1,
            }}
          ></div>

          {/* Content */}
          <div
            style={{
              position: "relative",
              zIndex: 2,
              padding: "26px 30px",
              color: "#fff",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "100%",
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 6,
                }}
              >
                <span
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    borderRadius: 10,
                    padding: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <MdBolt size={22} color="#f5c542" />
                </span>
                <span style={{ fontSize: 21, fontWeight: 800 }}>
                  {tool.name}
                </span>
              </div>
              <div
                style={{
                  color: "#d8d4f0",
                  fontWeight: 500,
                  fontSize: 14,
                  marginBottom: 10,
                }}
              >
                {tool.meta}
              </div>

              {/* Progress Bar */}
              <div
                style={{
                  background: "rgba(255,255,255,0.15)",
                  borderRadius: 10,
                  width: "100%",
                  height: 7,
                  marginTop: 6,
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${tool.percent}%`,
                    background:
                      "linear-gradient(90deg, #8b5cf6, #c084fc, #a78bfa)",
                    borderRadius: 10,
                    transition: "width 0.3s ease",
                  }}
                ></div>
              </div>
            </div>

            {/* Efficiency Row */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontWeight: 600,
                fontSize: 15,
                color: "#fff",
                opacity: 0.9,
              }}
            >
              <span>{tool.efficiency}</span>
              <span style={{ color: "#d3bfff" }}>{tool.percent}%</span>
            </div>

            <div
              style={{
                fontSize: 13,
                color: "#c8bff5",
                fontWeight: 500,
                marginTop: 2,
              }}
            >
              Avg quality: {tool.avgQuality} | Last used {tool.lastUsed}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
