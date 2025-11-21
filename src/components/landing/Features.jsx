import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Reveal from "./Reveal";
import MotionCard from "./MotionCard";
import "./Features.css";

const featureList = [
  {title:"AI Design Generator", desc:"Create logos, posters or social images from text prompts.", ico:"🎨"},
  {title:"Image Creator", desc:"Generate product mockups or stylized art instantly.", ico:"🖼️"},
  {title:"Content Writer", desc:"AI-powered blog, caption, and email drafts.", ico:"✍️"},
  {title:"Code Generator", desc:"Scaffold components or backend snippets from prompts.", ico:"💻"},
  {title:"Video Maker", desc:"Turn ideas into short videos with templates.", ico:"🎬"},
  {title:"Brand Builder", desc:"Auto-suggest palettes, fonts and assets for your brand.", ico:"🧭"},
];

const routeMap = {
  "AI Design Generator": "/create/ai-design",
  "Image Creator": "/create/image-creator",
  "Content Writer": "/create/content-writer",
  "Code Generator": "/create/code-generator",
  "Video Maker": "/create/video-producer",
  "Brand Builder": "/create/brand-builder",
};

const Features = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selected, setSelected] = React.useState(null);

  const openModal = (feature) => {
    setSelected(feature);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelected(null);
  };
  const handleGenerate = () => {
    if (!selected) return;
    const to = routeMap[selected.title] || "/create";
    if (!isAuthenticated) {
      navigate("/login", { state: { redirectTo: to } });
      return;
    }
    navigate(to);
  };

  const renderPreview = () => {
    if (!selected) return null;
    const box = {
      background: "linear-gradient(180deg,#fbfbff,#fff)",
      border: "1px solid #e5e7eb",
      borderRadius: 12,
      padding: 12,
    };
    const title = { fontWeight: 700, color: "#111827", marginBottom: 8 };
    const muted = { color: "#6b7280", fontSize: 13, marginBottom: 10 };

    switch (selected.title) {
      case "AI Design Generator":
        return (
          <div style={box}>
            <div style={title}>Design Preview</div>
            <div style={muted}>Sample generated posters and logos</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} style={{ height: 100, borderRadius: 10, background: "linear-gradient(135deg,#e6f0ff,#fff0ff)", border: "1px dashed #e5e7eb" }} />
              ))}
            </div>
          </div>
        );
      case "Image Creator":
        return (
          <div style={box}>
            <div style={title}>Image Enhancer Preview</div>
            <div style={muted}>Before vs after enhancement</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div style={{ height: 160, borderRadius: 10, background: "#f3f4f6", border: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af" }}>Before</div>
              <div style={{ height: 160, borderRadius: 10, background: "linear-gradient(135deg,#e6f0ff,#fff0ff)", border: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af" }}>After</div>
            </div>
          </div>
        );
      case "Content Writer":
        return (
          <div style={box}>
            <div style={title}>Content Preview</div>
            <div style={muted}>Sample blog intro and call-to-action</div>
            <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 10, padding: 12, color: "#374151", lineHeight: 1.6 }}>
              <strong>Title:</strong> 5 Tips to Supercharge Your Design Workflow<br/><br/>
              <strong>Intro:</strong> Designing at speed doesn’t mean compromising quality. With AI-assisted tools, you can iterate faster, collaborate better, and ship confidently.<br/><br/>
              <strong>CTA:</strong> Ready to level up? Start generating compelling visuals today.
            </div>
          </div>
        );
      case "Code Generator":
        return (
          <div style={box}>
            <div style={title}>Code Preview</div>
            <div style={muted}>Generated React component snippet</div>
            <pre style={{ background: "#0f172a", color: "#e2e8f0", padding: 12, borderRadius: 10, fontSize: 12, overflowX: "auto" }}>{`
function Button({ label }) {
  return (
    <button style={{
      background: 'linear-gradient(90deg,#5b6ef5,#c06bff)',
      color: 'white', border: 'none', padding: '10px 14px', borderRadius: 12
    }}>
      {label}
    </button>
  );
}
export default Button;`}</pre>
          </div>
        );
      case "Video Maker":
        return (
          <div style={box}>
            <div style={title}>Storyboard Preview</div>
            <div style={muted}>Auto-generated frames</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
              {[...Array(8)].map((_, i) => (
                <div key={i} style={{ height: 80, borderRadius: 8, background: "linear-gradient(135deg,#f8fafc,#eef2ff)", border: "1px dashed #e5e7eb" }} />
              ))}
            </div>
          </div>
        );
      case "Brand Builder":
        return (
          <div style={box}>
            <div style={title}>Brand Kit Preview</div>
            <div style={muted}>Palette and typography suggestions</div>
            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
              {["#5b6ef5", "#c06bff", "#14b8a6", "#f59e0b"].map((c) => (
                <div key={c} style={{ width: 34, height: 34, borderRadius: 10, background: c, border: "1px solid #e5e7eb" }} />
              ))}
            </div>
            <div style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: 12 }}>
              <div style={{ fontFamily: "'Georgia', serif", fontSize: 20, marginBottom: 8 }}>Heading — Playfair Display</div>
              <div style={{ fontFamily: "'Inter', system-ui", fontSize: 14, color: "#6b7280" }}>Body — Inter Regular</div>
            </div>
          </div>
        );
      default:
        return (
          <div style={box}>
            <div style={title}>Preview Output</div>
            <div style={muted}>A sample of what this tool produces</div>
            <div style={{ height: 220, borderRadius: 10, background: "linear-gradient(120deg,#f3f6ff,#fff0ff)", border: "1px dashed #e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af" }}>
              No generation in preview
            </div>
          </div>
        );
    }
  };

  return (
    <section className="features section" id="features">
      <Reveal className="center">
        <div className="kicker">Core tools</div>
        <h2 className="h2">Built for creators & teams</h2>
        <p className="muted">Everything you need to design, write, code and collaborate — in one workspace.</p>
      </Reveal>

      <div className="features-grid">
        {featureList.map((f,i)=>(
          <Reveal key={i} delay={i*0.06}>
            <MotionCard className="feature card">
              <div className="f-ico">{f.ico}</div>
              <h3 className="f-title">{f.title}</h3>
              <p className="f-desc">{f.desc}</p>
              <div className="f-cta" onClick={() => openModal(f)}>Open <span>→</span></div>
            </MotionCard>
          </Reveal>
        ))}
      </div>

      {isModalOpen && selected && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={closeModal}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,23,42,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1400,
            padding: 16,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "min(95vw, 820px)",
              background: "#ffffff",
              borderRadius: 16,
              boxShadow: "0 30px 80px rgba(15,23,42,0.3)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontWeight: 800, fontSize: "1.1rem", color: "#0f172a" }}>{selected.title} — Preview</div>
              <button
                onClick={closeModal}
                style={{ border: "none", background: "transparent", cursor: "pointer", color: "#64748b", width: 36, height: 36, borderRadius: 10 }}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, padding: 16 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ fontWeight: 700, color: "#111827" }}>About this tool</div>
                <div style={{ color: "#6b7280", fontSize: 14 }}>{selected.desc}</div>
                <div style={{ display: "grid", gap: 8 }}>
                  <div style={{ color: "#6b7280", fontSize: 13 }}>Enter a prompt (preview)</div>
                  <input
                    placeholder="Describe what you want to create"
                    style={{ padding: "10px 12px", border: "1px solid #e5e7eb", borderRadius: 12, outline: "none" }}
                  />
                  <div style={{ color: "#9ca3af", fontSize: 12 }}>Generation requires login</div>
                </div>
                <button
                  onClick={handleGenerate}
                  style={{
                    marginTop: 8,
                    alignSelf: "flex-start",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    background: "linear-gradient(90deg,#5b6ef5,#c06bff)",
                    color: "white",
                    border: "none",
                    borderRadius: 12,
                    padding: "10px 14px",
                    cursor: "pointer",
                  }}
                >
                  Login to generate
                </button>
              </div>
              {renderPreview()}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Features;
