import React, { useState } from "react";
import {
  FiPenTool,
  FiImage,
  FiFileText,
  FiCode,
  FiVideo,
  FiScissors,
  FiCpu,
  FiPlus,
  FiZap,
  FiLayers,
} from "react-icons/fi";
import Creation from "./Creation";
import AISuggestTemp from "./AISuggestTemp";
import Recents from "./Recents";

const BUTTONS = [
  { key: "design", label: "Design for me", tag: "Popular", tagColor: "#8b5cf6", icon: <FiPenTool /> },
  { key: "create-image", label: "Create an image", tag: "New", tagColor: "#22c55e", icon: <FiImage /> },
  { key: "draft-document", label: "Draft a document", icon: <FiFileText /> },
  { key: "generate-code", label: "Generate code", icon: <FiCode /> },
  { key: "create-video", label: "Create video", tag: "Pro", tagColor: "#f59e0b", icon: <FiVideo /> },
  { key: "brand-kit", label: "Brand kit", icon: <FiLayers /> },
  { key: "smart-edit", label: "Smart edit", icon: <FiScissors /> },
  { key: "ai-assistant", label: "AI assistant", icon: <FiCpu /> },
];

const navTabs = [
  { label: "Your designs", key: "your-designs" },
  { label: "Templates", key: "templates" },
  { label: "Athena AI", key: "athena-ai", highlight: true },
];

const uploadToS3 = async (base64Image) => {
  const token = localStorage.getItem('token'); // Or get from context/auth provider
  // Convert base64 to Blob (for FormData upload)
  const blob = await (await fetch(base64Image)).blob();
  const formData = new FormData();
  formData.append('file', blob, 'generated-logo.png');

  const response = await fetch('http://localhost:5000/api/upload', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData,
  });

  if (!response.ok) {
    alert('Failed to upload to S3');
    return;
  }
  const data = await response.json();
  alert('Image stored in S3!');
  // Optionally use data.fileUrl (S3 location) returned by backend
};


const downloadButtonStyle = {
  display: "inline-block",
  marginTop: "14px",
  padding: "10px 22px",
  background: "linear-gradient(90deg,#a08afc,#3dcaff)",
  color: "#fff",
  fontWeight: 600,
  borderRadius: "8px",
  textDecoration: "none",
  fontSize: "1rem",
  boxShadow: "0 2px 12px #a1a1d966",
  transition: "background 0.15s",
};

const Dashboard = () => {
  const [selectedButton, setSelectedButton] = useState(null);
  const [activeTab, setActiveTab] = useState("your-designs");
  const [hoveredButton, setHoveredButton] = useState(null);
  const [clickedButton, setClickedButton] = useState(null);
  const [isPhone, setIsPhone] = useState(false);
  const [isSmallMobile, setIsSmallMobile] = useState(false);

  React.useEffect(() => {
    const handle = () => {
      const width = window.innerWidth;
      setIsSmallMobile(width <= 360);
      setIsPhone(width <= 768);
    };
    handle();
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, []);


  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [generatedImage, setGeneratedImage] = useState(null);
  const [generatedVideo, setGeneratedVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);

  const handleGenerateLogo = async () => {
    setLoading(true);
    setOutputText("");
    setGeneratedImage(null);
    try {
      const response = await fetch("http://localhost:5000/api/generate-logo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: inputText }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        setOutputText("Error: " + (errorData.error || "Unknown error"));
        setLoading(false);
        return;
      }
      const data = await response.json();

      // Decode base64 JSON string to text
      const decodedJsonStr = atob(data.imageBase64);

      // Parse JSON to extract actual image URL
      const parsedJson = JSON.parse(decodedJsonStr);

      const imageUrl = parsedJson.images?.[0]?.url;

      if (imageUrl) {
        setGeneratedImage(imageUrl);
      } else {
        setOutputText("No image URL found in response.");
      }
    } catch (error) {
      setOutputText("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClick = async () => {
    if (!inputText.trim() || !selectedButton) return;

    setOutputText("");
    setGeneratedImage(null);
    setGeneratedVideo(null);

    try {
      if (selectedButton === "design") {
        await handleGenerateLogo();
      } else if (selectedButton === "create-image") {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/image/generate-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: inputText }),
        });
        const data = await response.json();
        const imageB64 = data.data?.[0]?.b64_json || "";
        if (imageB64.length > 50) {
          setGeneratedImage(`data:image/png;base64,${imageB64}`);
        } else {
          setOutputText("No image generated");
        }
        setLoading(false);
      } else if (selectedButton === "create-video") {
        setVideoLoading(true);
        const response = await fetch("http://localhost:5000/api/video/generate-video", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: inputText }),
        });
        const data = await response.json();
        if (data.videoBase64) {
          const videoUrl = `data:${data.mimeType};base64,${data.videoBase64}`;
          setGeneratedVideo(videoUrl);
        } else {
          setOutputText("No video generated");
        }
        setVideoLoading(false);
      } else {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/inference/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: inputText }),
        });
        const data = await response.json();
        setOutputText(data.choices?.[0]?.message?.content || "No response");
        setLoading(false);
      }
    } catch (error) {
      setOutputText("Error: " + error.message);
      setLoading(false);
      setVideoLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f7f7fb 0%, #f3f4f8 40%, #eef2ff 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: isSmallMobile ? "16px 12px 12px 12px" : isPhone ? "24px 16px 12px 16px" : "48px 8px 16px 8px",
        width: "100%",
        overflowX: "hidden",
        boxSizing: "border-box",
      }}
    >
      <h1
        style={{
          fontSize: isSmallMobile ? "1.55rem" : isPhone ? "clamp(1.8rem,6vw,2.6rem)" : "clamp(2rem,5vw,3rem)",
          fontWeight: 800,
          margin: isSmallMobile ? "0 0 10px 0" : isPhone ? "0 0 14px 0" : "0 0 18px 0",
          background: "linear-gradient(90deg,#6b8cff 0%,#9b8bfd 50%,#f472b6 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          textAlign: "center",
          lineHeight: 1.2,
          padding: isSmallMobile ? "0 8px" : "0",
        }}
      >
        What will you create today?
      </h1>

      <div
        style={{
          display: "flex",
          gap: isSmallMobile ? 8 : 12,
          justifyContent: "center",
          marginBottom: isSmallMobile ? 12 : isPhone ? 18 : 24,
          flexWrap: "wrap",
          width: isSmallMobile ? "100%" : "auto",
          padding: isSmallMobile ? "0 8px" : "0",
          overflowX: isSmallMobile ? "auto" : "visible",
          WebkitOverflowScrolling: isSmallMobile ? "touch" : undefined,
        }}
      >
        {navTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: "8px 24px",
              borderRadius: "20px",
              background: activeTab === tab.key ? "#0f172a" : "rgba(255,255,255,0.7)",
              color: activeTab === tab.key ? "#ffffff" : "#475569",
              fontWeight: 600,
              fontSize: isSmallMobile ? "0.84rem" : isPhone ? "0.95rem" : "clamp(0.95rem,2.5vw,1.05rem)",
              border: activeTab === tab.key ? "1px solid #0f172a" : "1px solid #e5e7eb",
              boxShadow: activeTab === tab.key ? "0 8px 24px rgba(15,23,42,0.18)" : "0 2px 10px rgba(2,6,23,0.06)",
              transition: "all 0.18s",
              cursor: "pointer",
              minHeight: isSmallMobile ? "36px" : isPhone ? "40px" : "auto",
              whiteSpace: "nowrap",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div
        style={{
          background: "rgba(255,255,255,0.7)",
          backdropFilter: "saturate(180%) blur(10px)",
          borderRadius: isSmallMobile ? "18px" : "22px",
          boxShadow: "0 10px 40px rgba(2,6,23,0.06)",
          padding: isSmallMobile ? "12px 12px" : isPhone ? "18px 16px" : "28px 28px 24px 28px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: isSmallMobile ? "100%" : isPhone ? "92vw" : "100%",
          maxWidth: isSmallMobile ? "100%" : isPhone ? 420 : 740,
          marginBottom: isSmallMobile ? 16 : isPhone ? 20 : 26,
          border: "1px solid rgba(2,6,23,0.06)",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: isSmallMobile ? "stretch" : isPhone ? "stretch" : "center",
            gap: isSmallMobile ? 8 : isPhone ? 10 : 12,
            marginBottom: isSmallMobile ? 12 : isPhone ? 14 : 22,
            flexWrap: isSmallMobile ? "wrap" : isPhone ? "wrap" : "nowrap",
            boxSizing: "border-box",
          }}
        >
          <button
            style={{
              border: "1px dashed #cbd5e1",
              background: "#ffffff",
              borderRadius: "12px",
              width: isSmallMobile ? 40 : isPhone ? 42 : 46,
              height: isSmallMobile ? 40 : isPhone ? 42 : 46,
              fontSize: isSmallMobile ? "1.1rem" : isPhone ? "1.2rem" : "1.3rem",
              color: "#64748b",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flexShrink: 0,
            }}
            onClick={() => setSelectedButton(null)}
          >
            <FiPlus />
          </button>
          <input
            type="text"
            placeholder={isSmallMobile ? "Describe your idea..." : "Describe your idea — and we’ll bring it to life"}
            style={{
              flex: 1,
              padding: isSmallMobile ? "10px 12px" : isPhone ? "12px 14px" : "13px 18px",
              fontSize: isSmallMobile ? "0.92rem" : isPhone ? "1rem" : "1.08rem",
              borderRadius: isSmallMobile ? "12px" : "14px",
              border: "1px solid #e5e7eb",
              background: "#ffffff",
              outline: "none",
              marginRight: isSmallMobile ? 0 : isPhone ? 0 : 10,
              color: "#0f172a",
              minHeight: isSmallMobile ? "34px" : isPhone ? "38px" : "auto",
              boxShadow: "0 1px 2px rgba(2,6,23,0.04)",
            }}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button
            onClick={handleCreateClick}
            disabled={loading || videoLoading || !selectedButton}
            style={{
              background: selectedButton ? "linear-gradient(90deg,#111827,#0f172a)" : "#e5e7eb",
              color: selectedButton ? "#ffffff" : "#9ca3af",
              fontWeight: 700,
              fontSize: isSmallMobile ? "0.9rem" : isPhone ? "1rem" : "1.05rem",
              padding: isSmallMobile ? "10px 14px" : isPhone ? "10px 16px" : "12px 24px",
              borderRadius: isSmallMobile ? "10px" : "12px",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: selectedButton ? "0 10px 24px rgba(2,6,23,0.15)" : "none",
              display: "flex",
              alignItems: "center",
              gap: isSmallMobile ? 6 : 8,
              cursor: "pointer",
              transition: "background 0.14s, transform 0.14s, box-shadow 0.14s",
              width: isSmallMobile ? "100%" : isPhone ? "100%" : undefined,
              minHeight: isSmallMobile ? "34px" : isPhone ? "38px" : "auto",
              justifyContent: "center",
            }}
            onMouseEnter={(e) => {
              if (!isSmallMobile && !isPhone) {
                e.target.style.transform = "scale(1.02)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isSmallMobile && !isPhone) {
                e.target.style.transform = "scale(1)";
              }
            }}
          >
            <span style={{ display: "flex", alignItems: "center", fontSize: isSmallMobile ? "1rem" : isPhone ? "1.05rem" : "1.15rem" }}>
              <FiZap />
            </span>
            {loading || videoLoading ? "Generating..." : "Create"}
          </button>
        </div>
        {outputText && (
          <div
            style={{
              width: "100%",
              minHeight: 60,
              border: "1px solid #e5e7eb",
              borderRadius: 12,
              padding: 16,
              background: "#f8fafc",
              color: "#0f172a",
              fontSize: "1.02rem",
              fontWeight: 600,
            }}
          >
            {outputText}
          </div>
        )}
        {generatedImage ? (
          <>
            <img
              src={generatedImage}
              alt="Generated"
              style={{ maxWidth: "600px", marginTop: "20px", borderRadius: "12px" }}
            />
            <a
  href={generatedImage}
  download="generated-logo.png"
  style={downloadButtonStyle}
  onClick={async (e) => {
    // Let the browser download the image
    // Then upload it to S3 for current user
    await uploadToS3(generatedImage);
  }}
>
  ⬇️ Download Logo
</a>

          </>
        ) : (
          outputText && <div style={{ color: "#b00", fontWeight: "bold", marginTop: "16px" }}>{outputText}</div>
        )}
        {generatedVideo && (
          <div style={{ marginTop: 20 }}>
            <video
              controls
              src={generatedVideo}
              style={{ maxWidth: "600px", borderRadius: "12px" }}
            />
            <a
              href={generatedVideo}
              download="generated-video.mp4"
              style={{
                display: "inline-block",
                marginTop: "14px",
                padding: "10px 22px",
                background: "linear-gradient(90deg,#a08afc,#3dcaff)",
                color: "#fff",
                fontWeight: 600,
                borderRadius: "8px",
                textDecoration: "none",
                fontSize: "1rem",
                boxShadow: "0 2px 12px #a1a1d966",
                transition: "background 0.15s",
              }}
            >
              ⬇️ Download Video
            </a>
          </div>
        )}

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: isSmallMobile ? 6 : 10,
            width: "100%",
            justifyContent: isSmallMobile ? "center" : "flex-start",
          }}
        >
          {BUTTONS.map((btn) => (
            <button
              key={btn.key}
              onClick={() => setSelectedButton(btn.key)}
              onMouseEnter={() => setHoveredButton(btn.key)}
              onMouseLeave={() => setHoveredButton(null)}
              onMouseDown={() => setClickedButton(btn.key)}
              onMouseUp={() => setClickedButton(null)}
              style={{
                border: selectedButton === btn.key ? "1px solid #0f172a" : "1px solid #e5e7eb",
                background: selectedButton === btn.key ? "#0f172a" : "#ffffff",
                boxShadow:
                  selectedButton === btn.key
                    ? "0 10px 22px rgba(15,23,42,0.18)"
                    : hoveredButton === btn.key
                    ? "0 8px 16px rgba(2,6,23,0.08)"
                    : "0 2px 8px rgba(2,6,23,0.04)",
                borderRadius: isSmallMobile ? 10 : 12,
                padding: isSmallMobile ? "8px 12px" : isPhone ? "10px 14px" : "11px 16px",
                display: "flex",
                alignItems: "center",
                fontWeight: 600,
                fontSize: isSmallMobile ? "0.88rem" : isPhone ? "0.97rem" : "1rem",
                color: selectedButton === btn.key ? "#ffffff" : "#0f172a",
                gap: isSmallMobile ? 8 : 10,
                cursor: "pointer",
                position: "relative",
                minWidth: "100px",
                transform:
                  clickedButton === btn.key
                    ? "scale(0.95)"
                    : hoveredButton === btn.key && !isSmallMobile && !isPhone
                    ? "scale(1.05)"
                    : "scale(1)",
                transition: "transform 0.15s ease, box-shadow 0.15s ease",
                userSelect: "none",
                outline: "none",
              }}
            >
              <span style={{ display: "inline-flex", alignItems: "center", fontSize: isSmallMobile ? 16 : isPhone ? 18 : 18 }}>
                {btn.icon}
              </span>
              <span style={{ marginLeft: 6 }}>{btn.label}</span>
              {btn.tag && (
                <span
                  style={{
                    background: selectedButton === btn.key ? "#ffffff22" : btn.tagColor,
                    color: selectedButton === btn.key ? "#ffffff" : "#ffffff",
                    fontWeight: 600,
                    fontSize: isSmallMobile ? "0.62rem" : "0.72rem",
                    borderRadius: isSmallMobile ? "6px" : "7px",
                    padding: isSmallMobile ? "2px 8px" : "3px 10px",
                    marginLeft: isSmallMobile ? 6 : 10,
                    userSelect: "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  {btn.tag}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Conditional sections based on active tab */}
      {activeTab === "your-designs" && (
        <>
          <div
            style={{
              width: "100%",
              marginTop: isSmallMobile ? 24 : isPhone ? 28 : 32,
            }}
          >
            <AISuggestTemp />
          </div>
          <div
            style={{
              width: "100%",
            }}
          >
            <Recents />
          </div>
        </>
      )}

      {activeTab === "templates" && (
        <div
          style={{
            width: "100%",
            marginTop: isSmallMobile ? 24 : isPhone ? 28 : 32,
          }}
        >
          <Creation />
        </div>
      )}

      <div
        style={{
          marginTop: isSmallMobile ? 20 : isPhone ? 24 : 30,
          color: "#94a3b8",
          fontSize: isSmallMobile ? "0.9rem" : isPhone ? "1rem" : "1.05rem",
          textAlign: "center",
          padding: isSmallMobile ? "0 16px" : "0",
          lineHeight: 1.4,
        }}
      >
        Athena AI can make mistakes. Please verify important information.
      </div>
    </div>
  );
};

export default Dashboard;
