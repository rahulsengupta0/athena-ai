import React, { useMemo, useState } from "react";
import api from "../../../utils/api";
const TABS = [
  { key: "logo", label: "Logo Design" },
  { key: "social", label: "Social Media" },
  { key: "web", label: "Web Design" },
  { key: "print", label: "Print Materials" }
];

const EXAMPLES = [
  "Create a modern logo for a tech startup with blue and silver colors",
  "Design an Instagram post for a coffee shop with warm, cozy vibes",
  "Generate a minimalist website header for a photography portfolio",
  "Create a business card design with professional look"
];

const SIZES = [
  { key: "square", label: "1024 × 1024" },
  { key: "landscape", label: "1280 × 720" },
  { key: "portrait", label: "720 × 1280" }
];

const pillStyle = (active) => ({
  padding: "9px 16px",
  borderRadius: 999,
  fontWeight: 700,
  fontSize: "0.96rem",
  color: active ? "#fff" : "#6169a5",
  background: active ? "#7f5bff" : "#f1effd",
  border: active ? "1px solid #7f5bff" : "1px solid #ece9ff",
  cursor: "pointer"
});

const sizeItemStyle = (active) => ({
  padding: "8px 12px",
  borderRadius: 10,
  border: active ? "2px solid #7f5bff" : "1px solid #ebe9fb",
  background: active ? "#f3f0ff" : "#fff",
  color: "#3b3f70",
  fontWeight: 700,
  cursor: "pointer"
});

const box = {
  background: "#fff",
  border: "1.6px solid #efeefa",
  borderRadius: 16,
  boxShadow: "0 3px 16px #e9e4f33d"
};

export const AIDesign = () => {
  const [activeTab, setActiveTab] = useState("logo");
  const [prompt, setPrompt] = useState("");
  const [activeSize, setActiveSize] = useState("square");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [error, setError] = useState(null);

  const selectedSize = useMemo(() => SIZES.find((s) => s.key === activeSize), [activeSize]);
const uploadGeneratedImage = async (base64Image) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(base64Image);
    const blob = await response.blob();
    const file = new File([blob], "generated-image.png", { type: blob.type });

    const formData = new FormData();
    formData.append("file", file);
    formData.append("featureFolder", "ai design generation");

    const res = await api.post("/upload", formData, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    return res.data.fileUrl;
  } catch (error) {
    console.error("Upload error:", error);
    setError("Upload failed: " + error.message);
  }
};


const handleGenerateLogo = async () => {
  if (!prompt.trim()) return;
  setIsLoading(true);
  setResult(null);
  setGeneratedImage(null);
  setError(null);

  try {
    const response = await api.post("/generate-logo", { prompt });
    const data = response.data;

    if (!data.imageBase64 || data.imageBase64.length < 1000) {
      setError("Received invalid or too short base64 image data");
      setIsLoading(false);
      return;
    }

    const cleanBase64 = data.imageBase64.replace(/\s/g, "");
    const imgSrc = `data:${data.mimeType};base64,${cleanBase64}`;

    await uploadGeneratedImage(imgSrc);

    setGeneratedImage(imgSrc);
    setResult({
      tab: activeTab,
      size: selectedSize?.label,
      text: prompt.trim(),
    });
  } catch (error) {
    setError("Error: " + error.message);
  } finally {
    setIsLoading(false);
  }
};



  const onGenerate = async () => {
    if (activeTab === "logo") {
      await handleGenerateLogo();
    } else {
      if (!prompt.trim()) return;
      setIsLoading(true);
      setError(null);
      setResult(null);
      setGeneratedImage(null);

      setTimeout(() => {
        setResult({
          id: Date.now(),
          text: prompt.trim(),
          tab: activeTab,
          size: selectedSize?.label,
        });
        setIsLoading(false);
      }, 900);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 12,
            background: "#f1effd",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#7f5bff",
            fontWeight: 800,
            fontSize: 20,
          }}
        >
          ✦
        </div>
        <div>
          <div style={{ fontSize: "1.55rem", fontWeight: 800, color: "#1a1f47" }}>
            AI Design Generator
          </div>
          <div style={{ color: "#858ab0" }}>Create stunning designs from text descriptions</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ ...box, padding: 10, display: "flex", gap: 10, marginBottom: 20 }}>
        {TABS.map((t) => (
          <button key={t.key} onClick={() => setActiveTab(t.key)} style={pillStyle(activeTab === t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Main grid layout */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
        {/* Left panel: Prompt input */}
        <div style={{ ...box, padding: 16 }}>
          <div style={{ fontWeight: 800, fontSize: "1.05rem", color: "#1b1f4b", marginBottom: 10 }}>
            Describe Your Design
          </div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the design you want to create..."
            style={{
              width: "100%",
              minHeight: 160,
              borderRadius: 12,
              border: "1.4px solid #ebe9fb",
              padding: 14,
              outline: "none",
              fontSize: "1rem",
              color: "#2a2f60",
              resize: "vertical",
            }}
          />

          {/* Size selector */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12 }}>
            <div style={{ color: "#6a6fa1", fontWeight: 700, minWidth: 44 }}>Size</div>
            {SIZES.map((s) => (
              <button key={s.key} onClick={() => setActiveSize(s.key)} style={sizeItemStyle(activeSize === s.key)}>
                {s.label}
              </button>
            ))}
          </div>

          {/* Generate and Clear buttons */}
          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            <button
              onClick={onGenerate}
              disabled={isLoading || !prompt.trim()}
              style={{
                background: "linear-gradient(90deg,#a365ec 18%,#4baaff 98%)",
                color: "#fff",
                fontWeight: 800,
                fontSize: "1rem",
                padding: "10px 16px",
                borderRadius: 12,
                border: "none",
                opacity: isLoading || !prompt.trim() ? 0.7 : 1,
                cursor: isLoading || !prompt.trim() ? "not-allowed" : "pointer",
              }}
            >
              {isLoading ? "Generating..." : "Generate Design"}
            </button>
            <button
              onClick={() => {
                setPrompt("");
                setResult(null);
                setGeneratedImage(null);
                setError(null);
              }}
              style={{
                background: "#f5f4fe",
                color: "#5b61a3",
                fontWeight: 800,
                fontSize: "1rem",
                padding: "10px 16px",
                borderRadius: 12,
                border: "1px solid #ebe9fb",
                cursor: "pointer",
              }}
            >
              Clear
            </button>
          </div>

          {/* Error message */}
          {error && (
            <div style={{ marginTop: 10, color: "red", fontWeight: "bold" }}>
              {error}
            </div>
          )}
        </div>

        {/* Right panel: Examples and Preview */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Examples */}
          <div style={{ ...box, padding: 16 }}>
            <div style={{ fontWeight: 800, fontSize: "1.02rem", color: "#1b1f4b", marginBottom: 8 }}>
              Example Prompts
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {EXAMPLES.map((ex, idx) => (
                <button
                  key={idx}
                  onClick={() => setPrompt(ex)}
                  style={{
                    textAlign: "left",
                    padding: 12,
                    borderRadius: 12,
                    border: "1px solid #ebe9fb",
                    background: "#fff",
                    color: "#414781",
                    cursor: "pointer",
                  }}
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          {result && (
            <div style={{ ...box, padding: 16 }}>
              <div style={{ fontWeight: 800, color: "#1b1f4b", marginBottom: 10 }}>
                Preview
              </div>
              <div
                style={{
                  width: "100%",
                  border: "2px dashed #cfcaf5",
                  borderRadius: 16,
                  background: "linear-gradient(135deg,#faf9ff,#f3f1fe)",
                  color: "#6a6fa1",
                  textAlign: "center",
                  padding: 16,
                }}
              >
                {activeTab === "logo" && generatedImage ? (
                  <img
                    src={generatedImage}
                    alt="Generated Logo"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "240px",
                      borderRadius: 12,
                      background: "#fff",
                    }}
                    onError={() => alert("Image failed to load")}
                    onLoad={() => console.log("Image loaded successfully")}
                  />
                ) : (
                  <div>
                    <div style={{ fontWeight: 800, marginBottom: 6 }}>
                      {TABS.find((t) => t.key === result.tab)?.label} · {result.size}
                    </div>
                    <div style={{ opacity: 0.9 }}>{result.text}</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIDesign;
