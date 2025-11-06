import React, { useState, useEffect } from "react";
import { FaPalette, FaCamera } from "react-icons/fa";
import { FiHeart, FiDownload, FiEye } from "react-icons/fi";
import { AiFillHeart } from "react-icons/ai";
import { AiOutlineAppstore } from "react-icons/ai";
import { AiFillAppstore } from "react-icons/ai";
import { AiOutlineFontSize } from "react-icons/ai";
import api from "../../services/api";

// Helper function to render icon based on icon type string
const renderIcon = (iconType, color) => {
  const size = 32;
  const style = { color };
  switch(iconType) {
    case "palette": return <FaPalette size={size} style={style} />;
    case "camera": return <FaCamera size={size} style={style} />;
    case "appstore": return <AiOutlineAppstore size={size} style={style} />;
    case "font": return <AiOutlineFontSize size={size} style={style} />;
    default: return <FaPalette size={size} style={style} />;
  }
};

export const FavoriteCards = () => {
  const [hovered, setHovered] = useState(null);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const data = await api.getFavorites();
        setCards(data);
      } catch (error) {
        console.error('Error fetching favorites:', error);
        setCards([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  if (loading) {
    return (
      <div style={{
        width: "100%",
        maxWidth: 1240,
        margin: "0 auto",
        padding: "32px 0 16px 0",
        textAlign: "center",
        fontSize: "1.2rem",
        color: "#888"
      }}>
        Loading favorites...
      </div>
    );
  }

  return (
    <div style={{
      width: "100%",
      maxWidth: 1240,
      margin: "0 auto",
      padding: "32px 0 16px 0"
    }}>
      {/* Search/Filter row */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 26,
        flexWrap: "wrap"
      }}>
        <div style={{
          position: "relative",
          width: 340,
          maxWidth: "90%"
        }}>
          <input
            type="text"
            placeholder="Search favorites..."
            style={{
              width: "100%",
              borderRadius: "17px",
              background: "#fafbff",
              border: "1.5px solid #ececf7",
              outline: "none",
              padding: "12px 20px 12px 42px",
              fontSize: "1.12rem",
              color: "#24243b",
              fontWeight: 500
            }}
          />
          <FiEye style={{
            position: "absolute",
            top: 14, left: 15,
            color: "#c1c2c9",
            fontSize: 22
          }} />
        </div>
        {/* Categories Filter Dropdown (Fake) */}
        <div
          style={{
            background: "#fff",
            border: "1.5px solid #cdbef7",
            color: "#7d67ef",
            padding: "10px 28px 10px 19px",
            borderRadius: "18px",
            fontSize: "1.08rem",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            minWidth: 160,
            boxShadow: "0 0px 5px #eae3fc24",
            position: "relative"
          }}
        >
          All Categories
          <svg style={{ marginLeft: 13 }} width={19} height={19} fill="none" viewBox="0 0 24 24">
            <path d="M7 10l5 5 5-5" stroke="#b1a5ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div />
      </div>

      {/* Cards Area */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3,1fr)",
        gap: "26px"
      }}>
        {cards.map((card, i) => (
          <div
            key={i}
            style={{
              background: "#fff",
              borderRadius: 24,
              border: "1px solid #e7e7ef",
              boxShadow: hovered === i
                ? "0 8px 28px #a89dfa18"
                : "0 2px 12px #f7e7fa1b",
              padding: "32px 26px 20px 26px",
              minHeight: 210,
              display: "flex",
              flexDirection: "column",
              transition: "transform 0.16s, box-shadow 0.16s",
              cursor: "pointer",
              position: "relative",
              transform: hovered === i ? "scale(1.028)" : "scale(1)"
            }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            {/* Heart icon Top Right */}
            <div style={{
              position: "absolute",
              top: 18,
              right: 22,
              zIndex: 1,
              color: "#fa508f"
            }}>
              <AiFillHeart size={25} color="#fa508f" />
            </div>
            {/* Card icon */}
            <div style={{ marginBottom: 16 }}>
              {renderIcon(card.iconType || "palette", card.iconColor || "#f79ebb")}
            </div>
            {/* Title */}
            <div style={{ fontWeight: 700, fontSize: "1.16rem", color: "#181d3a", marginBottom: 5 }}>
              {card.title}
            </div>
            <div style={{ color: "#7d7e9e", fontSize: "1.02rem", marginBottom: 14 }}>
              {card.desc}
            </div>
            {/* Categories */}
            <div style={{ display: "flex", gap: 8, marginBottom: 7 }}>
              {card.categories.map((cat) =>
                <span key={cat} style={{
                  background: "#f7f8fa",
                  color: "#626273",
                  fontWeight: 600,
                  borderRadius: 9,
                  fontSize: "0.99rem",
                  padding: "5px 15px"
                }}>{cat}</span>
              )}
            </div>
            {/* Tags */}
            <div style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              marginBottom: 15
            }}>
              {card.tags.map((tag) =>
                <span
                  key={tag}
                  style={{
                    background: "#f5f6fc",
                    color: "#899fc3",
                    fontWeight: 600,
                    borderRadius: 8,
                    fontSize: "0.99rem",
                    padding: "4px 10px"
                  }}
                >
                  {tag}
                </span>
              )}
            </div>
            {/* Footer row */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              color: "#a6a3bd",
              fontSize: "1.03rem",
              marginTop: "auto"
            }}>
              <span>{card.time}</span>
              <span style={{ display: "flex", alignItems: "center", gap: 21 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <FiDownload size={18} style={{ marginTop: 1 }} />
                  {card.downloads}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <FiHeart size={17} style={{ marginLeft: 2, marginTop: 1 }} />
                  {card.likes}
                </span>
              </span>
            </div>
            {/* Action buttons if present */}
            {card.hasActions && (
              <div style={{
                display: "flex",
                gap: 10,
                marginTop: 19,
                alignItems: "center"
              }}>
                <button
                  style={{
                    border: "none",
                    background: "#f5f6fc",
                    color: "#8681c2",
                    fontWeight: 700,
                    fontSize: "1.07rem",
                    borderRadius: 11,
                    padding: "7px 22px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 7
                  }}>
                  <FiEye style={{ marginRight: 5, fontSize: 17 }} />
                  View
                </button>
                <button
                  style={{
                    border: "none",
                    background: "linear-gradient(90deg,#9c78ec 8%,#7269ef 98%)",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "1.07rem",
                    borderRadius: 11,
                    padding: "7px 25px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    boxShadow: "0 1px 4px #c9bffc22"
                  }}>
                  Use
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoriteCards;
