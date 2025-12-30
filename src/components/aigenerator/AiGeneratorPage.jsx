import React from "react";
import { useNavigate } from "react-router-dom";
import {
  MdOutlineDesignServices,
  MdOutlineContentPaste,
  MdViewQuilt,
  MdFlashOn,
} from "react-icons/md";

import Header from "./Header";
import Tabs from "./Tabs";
import ToolCard from "./ToolCard";
import QuickActions from "./QuickActions";
import Recent from "./Recent";
import Analytics from "./Analytics";
import getStyles, { useResponsive } from "./Styles";

const palette = {
  background: "linear-gradient(145deg, #fdfaff 0%, #f4f5ff 45%, #fdf8ff 100%)",
  surface: "rgba(255, 255, 255, 0.9)",
  surfaceMuted: "rgba(255, 255, 255, 0.7)",
  border: "rgba(151, 96, 255, 0.15)",
  accent: "#8a5bff",
  accentSoft: "rgba(138, 91, 255, 0.12)",
  accentDark: "#5b3bd6",
  text: "#1f1b2d",
  textMuted: "#6f6b80",
  success: "#1f9d75",
};

const toolsList = [
  {
    title: "Design Generator",
    tag: "Popular",
    icon: <MdOutlineDesignServices size={34} color={palette.accentDark} />,
    desc: "Create stunning designs from text prompts using advanced AI",
    accuracy: 95,
    to: "/create/ai-design",
  },
  {
    title: "Content Creator",
    tag: "Pro",
    icon: <MdOutlineContentPaste size={34} color={palette.accentDark} />,
    desc: "Generate compelling copy and marketing content instantly",
    accuracy: 88,
    to: "/docGenerator",
  },
  {
    title: "Layout Builder",
    tag: "New",
    icon: <MdViewQuilt size={34} color={palette.accentDark} />,
    desc: "Smart layout generation for web and mobile interfaces",
    accuracy: 92,
    to: "/canva-clone",
  },
];

const AiGeneratorPage = () => {
  const isMobile = useResponsive();
  const styles = getStyles(isMobile);

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState("AI Tools");
  const [hoveredTool, setHoveredTool] = React.useState(null);
  const [btnActive, setBtnActive] = React.useState(null);

  return (
    <div style={styles.page}>
      {/* HERO SECTION */}
      <div style={styles.heroGrid}>
        <div style={styles.heroCard}>
          <div style={styles.glow} />
          <div style={styles.titleRow}>
            <div style={styles.titleIconBackground}>
              <MdOutlineDesignServices size={28} color={palette.accentDark} />
            </div>
            <h1 style={styles.mainTitle}>AI Generator Studio</h1>
          </div>
          <p style={styles.subtitle}>
            Launch the core Athena generators that cover visuals, copywriting and layout explorations.
          </p>
          <div style={styles.badgeRow}>
            <span style={{ ...styles.badge, ...styles.badgeGreen }}>
              <span style={styles.badgeDot} />
              Models online
            </span>
          </div>
        </div>

        {/* RIGHT HERO BOX */}
        <div style={styles.heroSecondary}>
          <div style={styles.heroSecondaryAccent} />
          <div style={styles.heroSecondaryContent}>
            <p style={styles.heroSecondaryTitle}>Live Studio Pulse</p>
            <p style={styles.heroSecondaryDescription}>
              See which generators the Athena community is using right now.
            </p>

            <button
              style={styles.heroSecondaryCTA}
              onClick={() => navigate("/create")}
            >
              Open Studio
              <MdFlashOn />
            </button>
          </div>
        </div>
      </div>

      {/* TOOLS GRID */}
      <div style={styles.grid}>
        {toolsList.map((tool, idx) => {
          const cardStyle =
            hoveredTool === idx ? { ...styles.card, ...styles.cardHover } : styles.card;

          return (
            <div
              key={tool.title}
              style={cardStyle}
              onMouseEnter={() => setHoveredTool(idx)}
              onMouseLeave={() => setHoveredTool(null)}
            >
              <div
                style={{
                  ...styles.cardAccent,
                  opacity: hoveredTool === idx ? 1 : 0,
                }}
              />
              <div style={styles.cardHeader}>
                <div style={styles.iconBackground}>{tool.icon}</div>
                <div style={styles.cardHeaderText}>
                  <span style={styles.tag}>{tool.tag}</span>
                  <span style={styles.title}>{tool.title}</span>
                </div>
              </div>

              <div style={styles.description}>{tool.desc}</div>

              <div style={styles.confidenceRow}>
                <span style={styles.confidenceLabel}>AI Confidence</span>
                <div style={styles.progressBarBackground}>
                  <div
                    style={{
                      ...styles.progressBar,
                      width: `${tool.accuracy}%`,
                    }}
                  />
                </div>
                <span style={styles.progressPercent}>{tool.accuracy}%</span>
              </div>

              <button
                style={styles.startButton}
                onClick={() => navigate(tool.to)}
              >
                <MdFlashOn />
                Launch Tool
              </button>
            </div>
          );
        })}
      </div>

      {/* SECTIONS BELOW TABS */}
      <Header />
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "AI Tools" && (
        <>
          <div style={styles.grid}>
            {toolsList.map((tool, idx) => (
              <ToolCard
                key={tool.title}
                tool={tool}
                idx={idx}
                hoveredTool={hoveredTool}
                setHoveredTool={setHoveredTool}
                navigate={navigate}
              />
            ))}
          </div>

          <QuickActions />
        </>
      )}

      {activeTab === "Recent" && <Recent />}
      {activeTab === "Analytics" && <Analytics />}
    </div>
  );
};

export default AiGeneratorPage;
