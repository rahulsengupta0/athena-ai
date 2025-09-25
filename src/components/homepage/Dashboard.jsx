import React, { useState } from "react";

const BUTTONS = [
  { key: "design", label: "Design for me", tag: "Popular", tagColor: "#ef4444", icon: "🎨" },
  { key: "create-image", label: "Create an image", tag: "New", tagColor: "#22c55e", icon: "🖼️" },
  { key: "draft-document", label: "Draft a document", icon: "📄" },
  { key: "generate-code", label: "Generate code", icon: "💻" },
  { key: "create-video", label: "Create video", tag: "Pro", tagColor: "#f59e42", icon: "🎬" },
  { key: "brand-kit", label: "Brand kit", icon: "🎨" },
  { key: "smart-edit", label: "Smart edit", icon: "✂️" },
  { key: "ai-assistant", label: "AI assistant", icon: "🤖" },
];

const navTabs = [
  { label: "Your designs", key: "your-designs" },
  { label: "Templates", key: "templates" },
  { label: "Athena AI", key: "athena-ai", highlight: true },
];

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
  const [activeTab, setActiveTab] = useState("athena-ai");
  const [hoveredButton, setHoveredButton] = useState(null);
  const [clickedButton, setClickedButton] = useState(null);

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
        background: "linear-gradient(120deg,#eaefff 0%,#ffefff 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "44px 8px 12px 8px",
      }}
    >
      <h1
        style={{
          fontSize: "3.5rem",
          fontWeight: 800,
          margin: "0 0 20px 0",
          background: "linear-gradient(90deg,#a08afc 0%,#3dcaff 60%,#d32f93 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          textAlign: "center",
        }}
      >
        What will you create today?
      </h1>

      <div
        style={{
          display: "flex",
          gap: 16,
          justifyContent: "center",
          marginBottom: 38,
        }}
      >
        {navTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: "8px 28px",
              borderRadius: "22px",
              background: activeTab === tab.key ? "linear-gradient(90deg,#b692f6,#80c7fb)" : "#fff",
              color: activeTab === tab.key ? "#fff" : "#52576d",
              fontWeight: 600,
              fontSize: "1.13rem",
              border: activeTab === tab.key ? "none" : "1.5px solid #eee",
              boxShadow: activeTab === tab.key ? "0 4px 28px 0 #c5bdf93d" : "none",
              transition: "all 0.18s",
              cursor: "pointer",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: "24px",
          boxShadow: "0 2px 32px #c9c6f211",
          padding: "30px 32px 24px 32px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minWidth: "740px",
          marginBottom: 30,
          border: "1.5px solid #f1eeff",
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 26,
          }}
        >
          <button
            style={{
              border: "2px dashed #eae4ff",
              background: "transparent",
              borderRadius: "50%",
              width: 44,
              height: 44,
              fontSize: "1.4rem",
              color: "#d1c4ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
            onClick={() => setSelectedButton(null)}
          >
            +
          </button>
          <input
            type="text"
            placeholder="Describe your idea, and I'll bring it to life..."
            style={{
              flex: 1,
              padding: "12px 22px",
              fontSize: "1.21rem",
              borderRadius: "14px",
              border: "1.5px solid #f2edfc",
              background: "#f7f3ff",
              outline: "none",
              marginRight: 10,
              color: "#52576d",
            }}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button
            onClick={handleCreateClick}
            disabled={loading || videoLoading || !selectedButton}
            style={{
              background: "linear-gradient(90deg,#8ee0fb,#a892fd)",
              color: "#fff",
              fontWeight: 700,
              fontSize: "1.11rem",
              padding: "11px 32px",
              borderRadius: "12px",
              border: "none",
              boxShadow: "0 2px 10px #c7f7fd66",
              display: "flex",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
              transition: "background 0.14s",
            }}
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: "1.2rem",
              }}
            >
              ✨
            </span>
            {loading || videoLoading ? "Generating..." : "Create"}
          </button>
        </div>
        {outputText && (
          <div
            style={{
              width: "100%",
              minHeight: 60,
              border: "1.5px solid #f2edfc",
              borderRadius: 14,
              padding: 16,
              background: "#faf7ff",
              color: "#5c4a80",
              fontSize: "1.15rem",
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
            <a href={generatedImage} download="generated-logo.png" style={downloadButtonStyle}>
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
            justifyContent: "flex-start",
            gap: 14,
            width: "100%",
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
                border: "1.2px solid #ededf5",
                background:
                  selectedButton === btn.key ? "linear-gradient(90deg,#cfdffe,#fdebfd 80%)" : "#f8f9ff",
                boxShadow:
                  selectedButton === btn.key
                    ? "0 2px 8px #b2a5ed55"
                    : hoveredButton === btn.key
                    ? "0 4px 12px #a1a1d9aa"
                    : undefined,
                borderRadius: 12,
                padding: "9px 20px 9px 15px",
                display: "flex",
                alignItems: "center",
                fontWeight: selectedButton === btn.key ? 600 : 500,
                fontSize: "1.07rem",
                color: selectedButton === btn.key ? "#9e36c1" : "#3e4062",
                gap: 7,
                cursor: "pointer",
                position: "relative",
                minWidth: "100px",
                transform:
                  clickedButton === btn.key
                    ? "scale(0.95)"
                    : hoveredButton === btn.key
                    ? "scale(1.05)"
                    : "scale(1)",
                transition: "transform 0.15s ease, box-shadow 0.15s ease",
                userSelect: "none",
                outline: "none",
              }}
            >
              <span>{btn.icon}</span>
              {btn.label}
              {btn.tag && (
                <span
                  style={{
                    background: btn.tagColor,
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: "0.73rem",
                    borderRadius: "7px",
                    padding: "2.5px 10px",
                    marginLeft: 8,
                    userSelect: "none",
                  }}
                >
                  {btn.tag}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
      <div
        style={{
          marginTop: 30,
          color: "#b6afd4",
          fontSize: "1.1rem",
          textAlign: "center",
        }}
      >
        Athena AI can make mistakes. Please verify important information.
      </div>
    </div>
  );
};

export default Dashboard;
