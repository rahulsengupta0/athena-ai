import React, { useMemo, useState } from "react";

// Simple, self-contained page that mirrors the UI in the screenshot.
// It includes: title, tabs, prompt textarea, example prompts, and a generate button.
// Functionality: when Generate is clicked, it shows a mock "design preview" area
// with the selected category, size, and prompt. This can later be wired to a real API.

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

// Size bar kept fixed here for now; can be replaced by a shared component if present.
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
  cursor: "pointer",
});

const sizeItemStyle = (active) => ({
  padding: "8px 12px",
  borderRadius: 10,
  border: active ? "2px solid #7f5bff" : "1px solid #ebe9fb",
  background: active ? "#f3f0ff" : "#fff",
  color: "#3b3f70",
  fontWeight: 700,
  cursor: "pointer",
});

const box = {
  background: "#fff",
  border: "1.6px solid #efeefa",
  borderRadius: 16,
  boxShadow: "0 3px 16px #e9e4f33d",
};

export const AIDesign = () => {
  const [activeTab, setActiveTab] = useState("logo");
  const [prompt, setPrompt] = useState("");
  const [activeSize, setActiveSize] = useState("square");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  const selectedSize = useMemo(() => SIZES.find((s) => s.key === activeSize), [activeSize]);

  const onGenerate = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    // Simulate generation
    setTimeout(() => {
      setResult({
        id: Date.now(),
        text: prompt.trim(),
        tab: activeTab,
        size: selectedSize?.label,
      });
      setIsLoading(false);
    }, 900);
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <div style={{
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
        }}>✦</div>
        <div>
          <div style={{ fontSize: "1.55rem", fontWeight: 800, color: "#1a1f47" }}>AI Design Generator</div>
          <div style={{ color: "#858ab0" }}>Create stunning designs from text descriptions</div>
        </div>
      </div>

      <div style={{ ...box, padding: 10, display: "flex", gap: 10, marginBottom: 20 }}>
        {TABS.map((t) => (
          <button key={t.key} onClick={() => setActiveTab(t.key)} style={pillStyle(activeTab === t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
        <div style={{ ...box, padding: 16 }}>
          <div style={{ fontWeight: 800, fontSize: "1.05rem", color: "#1b1f4b", marginBottom: 10 }}>Describe Your Design</div>
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

          {/* Fixed size bar */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12 }}>
            <div style={{ color: "#6a6fa1", fontWeight: 700, minWidth: 44 }}>Size</div>
            {SIZES.map((s) => (
              <button key={s.key} onClick={() => setActiveSize(s.key)} style={sizeItemStyle(activeSize === s.key)}>
                {s.label}
              </button>
            ))}
          </div>

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
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ ...box, padding: 16 }}>
            <div style={{ fontWeight: 800, fontSize: "1.02rem", color: "#1b1f4b", marginBottom: 8 }}>Example Prompts</div>
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

          {result && (
            <div style={{ ...box, padding: 16 }}>
              <div style={{ fontWeight: 800, color: "#1b1f4b", marginBottom: 10 }}>Preview</div>
              <div
                style={{
                  width: "100%",
                  aspectRatio: activeSize === "portrait" ? "9/16" : activeSize === "landscape" ? "16/9" : "1/1",
                  border: "2px dashed #cfcaf5",
                  borderRadius: 16,
                  background: "linear-gradient(135deg,#faf9ff,#f3f1fe)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#6a6fa1",
                  textAlign: "center",
                  padding: 16,
                }}
              >
                <div>
                  <div style={{ fontWeight: 800, marginBottom: 6 }}>{TABS.find(t => t.key === result.tab)?.label} · {result.size}</div>
                  <div style={{ opacity: 0.9 }}>{result.text}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIDesign;


