import React from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Reveal from "./Reveal";
import MotionCard from "./MotionCard";
import "./CreateSection.css";

const routeMap = {
  "Design Generator": "/create/ai-design",
  "Image Creator": "/create/image-creator",
  "Content Writer": "/create/content-writer",
  "Code Generator": "/create/code-generator",
};

const CreateSection = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selected, setSelected] = React.useState(null);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const update = () => setIsMobile(window.innerWidth <= 700);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const openModal = (title, desc) => {
    setSelected({ title, desc });
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
      background: "var(--modal-panel-bg)",
      border: "1px solid var(--glass-border)",
      borderRadius: 12,
      padding: 12,
    };
    const title = { fontWeight: 700, color: "var(--text)", marginBottom: 8 };
    const muted = { color: "var(--text-muted)", fontSize: 13, marginBottom: 10 };

    switch (selected.title) {
      case "Design Generator":
        return (
          <div style={box}>
            <div style={title}>Design Preview</div>
            <div style={muted}>Sample generated posters and logos</div>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(3,1fr)", gap: 8 }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} style={{ height: isMobile ? 80 : 100, borderRadius: 10, background: "linear-gradient(135deg,#e6f0ff,#fff0ff)", border: "1px dashed #e5e7eb" }} />
              ))}
            </div>
          </div>
        );
      case "Image Creator":
        return (
          <div style={box}>
            <div style={title}>Image Enhancer Preview</div>
            <div style={muted}>Before vs after enhancement</div>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 10 }}>
              <div style={{ height: isMobile ? 120 : 160, borderRadius: 10, background: "var(--modal-panel-bg)", border: "1px solid var(--glass-border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text)" }}>Before</div>
              <div style={{ height: isMobile ? 120 : 160, borderRadius: 10, background: "var(--modal-panel-bg)", border: "1px solid var(--glass-border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text)" }}>After</div>
            </div>
          </div>
        );
      case "Content Writer":
        return (
          <div style={box}>
            <div style={title}>Content Preview</div>
            <div style={muted}>Sample blog intro and call-to-action</div>
            <div style={{ background: "var(--modal-panel-bg)", border: "1px solid var(--glass-border)", borderRadius: 10, padding: 12, color: "var(--text)", lineHeight: 1.6 }}>
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
            <pre style={{ background: "#0f172a", color: "#e2e8f0", padding: 12, borderRadius: 10, fontSize: isMobile ? 11 : 12, overflowX: "auto" }}>{`
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

  const modalNode = (isModalOpen && selected) ? createPortal(
    (
      <div
        role="dialog"
        aria-modal="true"
        onClick={closeModal}
        style={{
          position: "fixed",
          inset: 0,
          background: "var(--overlay-bg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 99999,
          padding: isMobile ? 12 : 16,
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            width: isMobile ? "calc(100vw - 24px)" : "min(95vw, 820px)",
            maxHeight: "calc(100vh - 24px)",
            background: "var(--modal-bg)",
            borderRadius: isMobile ? 12 : 16,
            boxShadow: "0 30px 80px rgba(15,23,42,0.3)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            color: "var(--text)",
            overflowY: "auto",
          }}
        >
          <div style={{ padding: isMobile ? "12px 14px" : "16px 20px", borderBottom: "1px solid var(--glass-border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontWeight: 800, fontSize: "1.1rem", color: "var(--text)" }}>{selected.title} — Preview</div>
            <button
              onClick={closeModal}
              style={{ border: "none", background: "transparent", cursor: "pointer", color: "var(--text-muted)", width: 36, height: 36, borderRadius: 10 }}
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 12 : 16, padding: isMobile ? 12 : 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, background: "var(--modal-panel-bg)", border: "1px solid var(--glass-border)", borderRadius: 12, padding: 12 }}>
              <div style={{ fontWeight: 700, color: "var(--text)" }}>About this tool</div>
              <div style={{ color: "var(--text-muted)", fontSize: 14 }}>{selected.desc}</div>
              <div style={{ display: "grid", gap: 8 }}>
                <div style={{ color: "var(--text-muted)", fontSize: 13 }}>Enter a prompt (preview)</div>
                <input
                  placeholder="Describe what you want to create"
                  style={{ padding: "10px 12px", border: "1px solid var(--glass-border)", borderRadius: 12, outline: "none", background: "var(--modal-input-bg)", color: "var(--text)" }}
                />
                <div style={{ color: "var(--text-muted)", fontSize: 12 }}>Generation requires login</div>
              </div>
              <button
                onClick={handleGenerate}
                style={{
                  marginTop: isMobile ? 6 : 8,
                  alignSelf: "flex-start",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: "linear-gradient(90deg,#5b6ef5,#c06bff)",
                  color: "white",
                  border: "none",
                  borderRadius: 12,
                  padding: isMobile ? "8px 12px" : "10px 14px",
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
    ),
    document.body
  ) : null;

  return (
    <section className="create section" id="create">
      <Reveal className="center">
        <div className="kicker">Create</div>
        <h2 className="h2">Start a new creation</h2>
        <p className="muted">Designs, images, content, code and videos — begin with templates or a blank canvas.</p>
      </Reveal>

      <div className="create-grid">
        <Reveal>
        <MotionCard className="create-card card">
          <div className="cc-ico">🎨</div>
          <div className="cc-title">Design Generator</div>
          <div className="cc-desc">Generate posters, logos and social graphics from prompts.</div>
          <div className="f-cta" onClick={() => openModal("Design Generator", "Generate posters, logos and social graphics from prompts.")}>Open <span>→</span></div>
        </MotionCard>
        </Reveal>
        <Reveal delay={0.06}>
        <MotionCard className="create-card card">
          <div className="cc-ico">🖼️</div>
          <div className="cc-title">Image Creator</div>
          <div className="cc-desc">Create product mockups or stylized art instantly.</div>
          <div className="f-cta" onClick={() => openModal("Image Creator", "Create product mockups or stylized art instantly.")}>Open <span>→</span></div>
        </MotionCard>
        </Reveal>
        <Reveal delay={0.12}>
        <MotionCard className="create-card card">
          <div className="cc-ico">✍️</div>
          <div className="cc-title">Content Writer</div>
          <div className="cc-desc">Draft blogs, captions and emails with AI assistance.</div>
          <div className="f-cta" onClick={() => openModal("Content Writer", "Draft blogs, captions and emails with AI assistance.")}>Open <span>→</span></div>
        </MotionCard>
        </Reveal>
        <Reveal delay={0.18}>
        <MotionCard className="create-card card">
          <div className="cc-ico">💻</div>
          <div className="cc-title">Code Generator</div>
          <div className="cc-desc">Scaffold components or backend snippets from prompts.</div>
          <div className="f-cta" onClick={() => openModal("Code Generator", "Scaffold components or backend snippets from prompts.")}>Open <span>→</span></div>
        </MotionCard>
        </Reveal>
      </div>

      {modalNode}
    </section>
  );
};

export default CreateSection;