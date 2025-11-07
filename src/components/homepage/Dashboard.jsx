import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  FiCopy,
} from "react-icons/fi";
import Creation from "./Creation";
import AISuggestTemp from "./AISuggestTemp";
import Recents from "./Recents";
import api from "../../services/api";

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
  await response.json();
  alert('Image stored in S3!');
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
  const navigate = useNavigate();
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
  const [codeMessages, setCodeMessages] = useState([]);
  const chatEndRef = useRef(null);
  const isCodeMode = selectedButton === "generate-code";
  const [copiedKey, setCopiedKey] = useState(null);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState([]);
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [brandKitOpen, setBrandKitOpen] = useState(false);
  const [creatingBrandKit, setCreatingBrandKit] = useState(false);
  const [brandForm, setBrandForm] = useState({
    name: '',
    primaryColor: '#6b8cff',
    secondaryColor: '#16a34a',
    logoUrl: '',
    tagline: ''
  });

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [codeMessages]);

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1500);
    });
  };

  const sendAiChat = async () => {
    if (!aiInput.trim()) return;
    const userMsg = { type: 'user', content: aiInput };
    setAiMessages((prev) => [...prev, userMsg]);
    const current = aiInput;
    setAiInput("");
    setAiLoading(true);
    try {
      const resp = await fetch("http://localhost:5000/api/inference/generate", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: current })
      });
      const data = await resp.json();
      const aiResp = data.choices?.[0]?.message?.content || 'No response';
      setAiMessages((prev) => [...prev, { type: 'ai', content: aiResp }]);
    } catch (e) {
      setAiMessages((prev) => [...prev, { type: 'ai', content: 'Error: ' + e.message }]);
    } finally {
      setAiLoading(false);
    }
  };

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

    if (data.imageBase64) {
      setGeneratedImage(`data:image/png;base64,${data.imageBase64}`);
    } else {
      setOutputText("No image found in response.");
    }
  } catch (error) {
    setOutputText("Error: " + error.message);
  } finally {
    setLoading(false);
  }
};


  const handleCreateClick = async () => {
    if (!inputText.trim() || !selectedButton) return;

    if (isCodeMode) {
      // Add user message to chat
      const userMessage = { type: "user", content: inputText };
      setCodeMessages((prev) => [...prev, userMessage]);
      const currentInput = inputText;
      setInputText("");
      setLoading(true);

      try {
        const response = await fetch("http://localhost:5000/api/inference/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: currentInput }),
        });
        const data = await response.json();
        const aiResponse = data.choices?.[0]?.message?.content || "No response";
        setCodeMessages((prev) => [...prev, { type: "ai", content: aiResponse }]);
      } catch (error) {
        setCodeMessages((prev) => [...prev, { type: "ai", content: "Error: " + error.message }]);
      } finally {
        setLoading(false);
      }
      return;
    }

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
  const videoUrl = `data:${data.mimeType || "video/mp4"};base64,${data.videoBase64}`;
  setGeneratedVideo(videoUrl);
} else if (data.videoUrl) {
  // For future: if backend sends a direct video URL
  setGeneratedVideo(data.videoUrl);
} else {
  setOutputText("No video generated");
}

  setVideoLoading(false);
}
 else {
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
  const handleBrandKitSubmit = async () => {
  if (creatingBrandKit) return;
  setCreatingBrandKit(true);
  try {
    const payload = {
      name: brandForm.name,
      tagline: brandForm.tagline,
      primaryColor: brandForm.primaryColor,
      secondaryColor: brandForm.secondaryColor,
    };
    // Call backend to generate brand kit assets
    const response = await fetch("http://localhost:5000/api/generate-brandkit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error("Failed to generate brand kit");
    const data = await response.json(); // { logo, banner, poster }
    // Route to results page, passing asset URLs/base64
    navigate("/brand-kit-result", { state: data });
  } catch (e) {
    alert("Failed to create brand kit");
  } finally {
    setCreatingBrandKit(false);
    setBrandKitOpen(false);
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

      {!isCodeMode && (
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
      )}

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
          maxWidth: isSmallMobile ? "100%" : isPhone ? 420 : isCodeMode ? 900 : 740,
          marginBottom: isSmallMobile ? 16 : isPhone ? 20 : 26,
          border: "1px solid rgba(2,6,23,0.06)",
          boxSizing: "border-box",
          height: isCodeMode ? (isSmallMobile ? "75vh" : isPhone ? "80vh" : "82vh") : "auto",
          transition: "height 220ms ease, max-width 220ms ease, padding 220ms ease",
        }}
      >
        {isCodeMode ? (
          <>
            <div style={{ width: "100%", display: "flex", alignItems: "center", marginBottom: 8 }}>
              <button
                onClick={() => { setSelectedButton(null); setCodeMessages([]); }}
                aria-label="Back"
                style={{
                  border: "1px solid #e5e7eb",
                  background: "#fff",
                  borderRadius: 10,
                  width: 36,
                  height: 36,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 8,
                }}
              >
                ‹
              </button>
              <div style={{ fontWeight: 700, color: "#0f172a" }}>Code Assistant</div>
            </div>
            {/* Chat Messages Area */}
            <div
              style={{
                width: "100%",
                flex: 1,
                overflowY: "auto",
                padding: "16px 0",
                marginBottom: 16,
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              {codeMessages.length === 0 && (
                <div
                  style={{
                    textAlign: "center",
                    color: "#94a3b8",
                    fontSize: "1rem",
                    padding: "40px 20px",
                  }}
                >
                  Ask me anything about code generation!
                </div>
              )}
              {codeMessages.map((msg, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    justifyContent: msg.type === "user" ? "flex-end" : "flex-start",
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "75%",
                      padding: "12px 16px",
                      borderRadius: "12px",
                      background: msg.type === "user" ? "#0f172a" : "#f8fafc",
                      color: msg.type === "user" ? "#ffffff" : "#0f172a",
                      fontSize: "0.95rem",
                      lineHeight: 1.5,
                      wordWrap: "break-word",
                    }}
                  >
                    {msg.type === "user" ? (
                      <div>
                        {msg.content.split(/```/).map((part, i) => {
                          if (i % 2 === 0) {
                            return part
                              .split(/\n\n+/)
                              .map((para, pi) => (
                                <p key={`${i}-${pi}`} style={{ margin: "0 0 8px 0" }}>{para}</p>
                              ));
                          } else {
                            const lines = part.split("\n");
                            const lang = lines[0]?.trim() || "";
                            const code = lines.slice(1).join("\n");
                            const key = `user-${idx}-${i}`;
                            return (
                              <div
                                key={i}
                                style={{
                                  background: "#1e293b",
                                  color: "#e2e8f0",
                                  padding: "12px",
                                  borderRadius: "8px",
                                  marginTop: 8,
                                  marginBottom: 8,
                                  position: "relative",
                                  fontFamily: "monospace",
                                  fontSize: "0.9rem",
                                }}
                              >
                                <button
                                  onClick={() => copyToClipboard(code, key)}
                                  style={{
                                    position: "absolute",
                                    top: 8,
                                    right: 8,
                                    background: "rgba(255,255,255,0.1)",
                                    border: "none",
                                    borderRadius: "6px",
                                    padding: "6px 10px",
                                    color: "#e2e8f0",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 4,
                                    fontSize: "0.8rem",
                                  }}
                                >
                                  <FiCopy /> {copiedKey === key ? "Copied" : "Copy"}
                                </button>
                                {lang && (
                                  <div style={{ color: "#94a3b8", fontSize: "0.8rem", marginBottom: 8 }}>
                                    {lang}
                                  </div>
                                )}
                                <pre style={{ margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                                  {code}
                                </pre>
                              </div>
                            );
                          }
                        })}
                      </div>
                    ) : (
                      <div>
                        {msg.content.split(/```/).map((part, i) => {
                          if (i % 2 === 0) {
                            return part
                              .split(/\n\n+/)
                              .map((para, pi) => (
                                <p key={`${i}-${pi}`} style={{ margin: "0 0 8px 0" }}>{para}</p>
                              ));
                          } else {
                            const lines = part.split("\n");
                            const lang = lines[0]?.trim() || "";
                            const code = lines.slice(1).join("\n");
                            const key = `${idx}-${i}`;
                            return (
                              <div
                                key={i}
                                style={{
                                  background: "#1e293b",
                                  color: "#e2e8f0",
                                  padding: "12px",
                                  borderRadius: "8px",
                                  marginTop: 8,
                                  marginBottom: 8,
                                  position: "relative",
                                  fontFamily: "monospace",
                                  fontSize: "0.9rem",
                                }}
                              >
                                <button
                                  onClick={() => copyToClipboard(code, key)}
                                  style={{
                                    position: "absolute",
                                    top: 8,
                                    right: 8,
                                    background: "rgba(255,255,255,0.1)",
                                    border: "none",
                                    borderRadius: "6px",
                                    padding: "6px 10px",
                                    color: "#e2e8f0",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 4,
                                    fontSize: "0.8rem",
                                  }}
                                >
                                  <FiCopy /> {copiedKey === key ? "Copied" : "Copy"}
                                </button>
                                {lang && (
                                  <div style={{ color: "#94a3b8", fontSize: "0.8rem", marginBottom: 8 }}>
                                    {lang}
                                  </div>
                                )}
                                <pre style={{ margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                                  {code}
                                </pre>
                              </div>
                            );
                          }
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      padding: "12px 16px",
                      borderRadius: "12px",
                      background: "#f8fafc",
                      color: "#94a3b8",
                    }}
                  >
                    Generating...
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            {/* Input Area */}
            <div
              style={{
                width: "100%",
                display: "flex",
                gap: isSmallMobile ? 8 : 12,
                alignItems: "center",
              }}
            >
              <input
                type="text"
                placeholder="Ask about code..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !loading) {
                    handleCreateClick();
                  }
                }}
                style={{
                  flex: 1,
                  padding: isSmallMobile ? "10px 12px" : isPhone ? "12px 14px" : "13px 18px",
                  fontSize: isSmallMobile ? "0.92rem" : isPhone ? "1rem" : "1.08rem",
                  borderRadius: isSmallMobile ? "12px" : "14px",
                  border: "1px solid #e5e7eb",
                  background: "#ffffff",
                  outline: "none",
                  color: "#0f172a",
                  minHeight: isSmallMobile ? "34px" : isPhone ? "38px" : "auto",
                  boxShadow: "0 1px 2px rgba(2,6,23,0.04)",
                }}
              />
              <button
                onClick={handleCreateClick}
                disabled={loading || !inputText.trim()}
                style={{
                  background: inputText.trim() ? "linear-gradient(90deg,#111827,#0f172a)" : "#e5e7eb",
                  color: inputText.trim() ? "#ffffff" : "#9ca3af",
                  fontWeight: 700,
                  fontSize: isSmallMobile ? "0.9rem" : isPhone ? "1rem" : "1.05rem",
                  padding: isSmallMobile ? "10px 14px" : isPhone ? "10px 16px" : "12px 24px",
                  borderRadius: isSmallMobile ? "10px" : "12px",
                  border: "none",
                  cursor: inputText.trim() ? "pointer" : "not-allowed",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  minHeight: isSmallMobile ? "34px" : isPhone ? "38px" : "auto",
                }}
              >
                <FiZap />
              </button>
            </div>
          </>
        ) : (
          <>
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
                onClick={() => {
                  setSelectedButton(null);
                  setCodeMessages([]);
                }}
          >
            <FiPlus />
          </button>
          <input
            type="text"
                placeholder={isSmallMobile ? "Describe your idea..." : "Describe your idea — and we'll bring it to life"}
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
          </>
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
  onClick={async () => {
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

        {!isCodeMode && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: isSmallMobile ? 6 : 10,
            width: "100%",
            justifyContent: isSmallMobile ? "center" : "flex-start",
          }}
        >
          {BUTTONS.filter((b) => b.key !== 'brand-kit' && b.key !== 'smart-edit' && b.key !== 'ai-assistant').map((btn) => (
            <button
              key={btn.key}
              onClick={() => {
                setSelectedButton(btn.key);
                if (btn.key !== "generate-code") {
                  setCodeMessages([]);
                }
              }}
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
        )}
      </div>

      {/* Floating AI Assistant button */}
      {!isCodeMode && (
        <button
          onClick={() => setAiChatOpen(true)}
          title="AI Assistant"
          style={{
            position: 'fixed',
            right: 16,
            bottom: 16,
            width: 56,
            height: 56,
            borderRadius: 28,
            border: 'none',
            background: 'linear-gradient(135deg, #111827, #0f172a)',
            color: '#fff',
            boxShadow: '0 10px 24px rgba(2,6,23,0.25)',
            cursor: 'pointer',
            zIndex: 1000,
            fontWeight: 700,
          }}
        >
          AI
        </button>
      )}

      {/* AI Assistant Modal */}
      {aiChatOpen && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setAiChatOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1100,
            padding: 16,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 'min(92vw, 900px)',
              height: 'min(85vh, 720px)',
              background: '#ffffff',
              borderRadius: 16,
              boxShadow: '0 20px 60px rgba(2,6,23,0.25)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', padding: 12, borderBottom: '1px solid #eef2f7' }}>
              <div style={{ fontWeight: 800, color: '#0f172a' }}>AI Assistant</div>
              <button
                onClick={() => setAiChatOpen(false)}
                aria-label="Close"
                style={{ marginLeft: 'auto', border: 'none', background: '#f1f5f9', borderRadius: 8, padding: '6px 10px', cursor: 'pointer' }}
              >
                Close
              </button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: 16, background: '#f8fafc' }}>
              {aiMessages.length === 0 && (
                <div style={{ color: '#94a3b8', textAlign: 'center', paddingTop: 40 }}>How can I help you today?</div>
              )}
              {aiMessages.map((m, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: m.type === 'user' ? 'flex-end' : 'flex-start', marginBottom: 10 }}>
                  <div
                    style={{
                      maxWidth: '75%',
                      background: m.type === 'user' ? '#0f172a' : '#ffffff',
                      color: m.type === 'user' ? '#ffffff' : '#0f172a',
                      padding: '10px 12px',
                      borderRadius: 12,
                      boxShadow: '0 2px 6px rgba(2,6,23,0.08)'
                    }}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {aiLoading && (
                <div style={{ color: '#94a3b8' }}>Thinking…</div>
              )}
            </div>
            <div style={{ display: 'flex', gap: 8, padding: 12, borderTop: '1px solid #eef2f7' }}>
              <input
                type="text"
                placeholder="Ask anything…"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !aiLoading) sendAiChat(); }}
                style={{ flex: 1, border: '1px solid #e5e7eb', borderRadius: 10, padding: '10px 12px', outline: 'none' }}
              />
              <button
                onClick={sendAiChat}
                disabled={aiLoading || !aiInput.trim()}
                style={{
                  background: aiInput.trim() ? 'linear-gradient(90deg,#111827,#0f172a)' : '#e5e7eb',
                  color: aiInput.trim() ? '#ffffff' : '#9ca3af',
                  border: 'none',
                  borderRadius: 10,
                  padding: '10px 16px',
                  fontWeight: 700,
                  cursor: aiInput.trim() ? 'pointer' : 'not-allowed'
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Brand Kit Modal */}
      {brandKitOpen && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setBrandKitOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1200,
            padding: 16,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 'min(92vw, 720px)',
              background: '#ffffff',
              borderRadius: 16,
              boxShadow: '0 20px 60px rgba(2,6,23,0.25)',
              overflow: 'hidden',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', padding: 14, borderBottom: '1px solid #eef2f7' }}>
              <div style={{ fontWeight: 800, color: '#0f172a' }}>Create Brand Kit</div>
              <button onClick={() => setBrandKitOpen(false)} style={{ marginLeft: 'auto', border: 'none', background: '#f1f5f9', borderRadius: 8, padding: '6px 10px', cursor: 'pointer' }}>Close</button>
            </div>
            <div style={{ padding: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Brand Name</label>
                <input value={brandForm.name} onChange={(e)=>setBrandForm({ ...brandForm, name: e.target.value })} placeholder="Acme Inc" style={{ width:'100%', border:'1px solid #e5e7eb', borderRadius:10, padding:'10px 12px', outline:'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Primary Color</label>
                <input type="color" value={brandForm.primaryColor} onChange={(e)=>setBrandForm({ ...brandForm, primaryColor: e.target.value })} style={{ width:'100%', height:42, border:'1px solid #e5e7eb', borderRadius:10, padding:0 }} />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Secondary Color</label>
                <input type="color" value={brandForm.secondaryColor} onChange={(e)=>setBrandForm({ ...brandForm, secondaryColor: e.target.value })} style={{ width:'100%', height:42, border:'1px solid #e5e7eb', borderRadius:10, padding:0 }} />
              </div>
              {/* Logo URL removed as requested */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Tagline</label>
                <input value={brandForm.tagline} onChange={(e)=>setBrandForm({ ...brandForm, tagline: e.target.value })} placeholder="Build something great" style={{ width:'100%', border:'1px solid #e5e7eb', borderRadius:10, padding:'10px 12px', outline:'none' }} />
              </div>
            </div>
            <div style={{ display:'flex', justifyContent:'flex-end', gap:10, padding:14, borderTop:'1px solid #eef2f7' }}>
              <button onClick={()=>setBrandKitOpen(false)} style={{ border:'1px solid #e5e7eb', background:'#fff', color:'#0f172a', borderRadius:10, padding:'8px 12px', cursor:'pointer' }}>Cancel</button>
              <button
  onClick={async () => {
    if (creatingBrandKit) return;
    setCreatingBrandKit(true);
    try {
      // Prepare data from your form
      const payload = {
        name: brandForm.name,
        tagline: brandForm.tagline,
        primaryColor: brandForm.primaryColor,
        secondaryColor: brandForm.secondaryColor,
      };
      // Call the backend API to generate logo, banner, and poster
      const userToken = localStorage.getItem("token"); // or get token from your auth context

const response = await fetch("http://localhost:5000/api/generate-brandkit", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${userToken}`,
  },
  body: JSON.stringify(payload),
});

      if (!response.ok) throw new Error("Failed to generate brand kit");
      const data = await response.json(); // { logo, banner, poster }
      // Navigate to BrandKitResult page, passing images in state
      navigate("/brand-kit-result", { state: data });
    } catch (e) {
      console.error(e);
      alert("Failed to create brand kit");
    } finally {
      setCreatingBrandKit(false);
      setBrandKitOpen(false);
    }
  }}
  disabled={creatingBrandKit}
  style={{ 
    border: 'none',
    background: 'linear-gradient(90deg,#6b8cff,#9b8bfd)', 
    color: '#fff',
    borderRadius: 10, 
    padding: '10px 16px',
    fontWeight: 700,
    cursor: creatingBrandKit ? 'not-allowed' : 'pointer',
    opacity: creatingBrandKit ? 0.7 : 1
  }}
>
  {creatingBrandKit ? "Creating..." : "Create"}
</button>

            </div>
          </div>
        </div>
      )}

      {/* Conditional sections based on active tab */}
      {!isCodeMode && activeTab === "your-designs" && (
        <>
          <div
            style={{
              width: "100%",
              marginTop: isSmallMobile ? 24 : isPhone ? 28 : 32,
            }}
          >
            {/* Quick links for excluded tools */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 12,
                marginBottom: 8,
              }}
            >
              <button
                onClick={() => setBrandKitOpen(true)}
                style={{
                  background: 'linear-gradient(90deg,#6b8cff,#9b8bfd)',
                  border: '1px solid #6b8cff',
                  borderRadius: 12,
                  padding: '10px 16px',
                  color: '#fff',
                  cursor: 'pointer',
                  fontWeight: 700,
                  boxShadow: '0 8px 20px rgba(107,140,255,0.35)'
                }}
              >
                Brand Kit
              </button>
              <button
                onClick={() => navigate('/image-editor')}
                style={{
                  background: 'linear-gradient(90deg,#22c55e,#16a34a)',
                  border: '1px solid #16a34a',
                  borderRadius: 12,
                  padding: '10px 16px',
                  color: '#fff',
                  cursor: 'pointer',
                  fontWeight: 700,
                  boxShadow: '0 8px 20px rgba(34,197,94,0.35)'
                }}
              >
                Smart Edit
              </button>
            </div>
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

      {!isCodeMode && activeTab === "templates" && (
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
