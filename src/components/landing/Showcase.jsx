import React from "react";
import Reveal from "./Reveal";
import MotionCard from "./MotionCard";
import { 
  FiLayers, 
  FiType,
  FiSquare,
  FiCircle,
  FiImage,
  FiZap,
  FiCheck,
  FiMove,
  FiStar,
  FiHeart,
  FiCode,
  FiMessageSquare
} from "react-icons/fi";
import "./Showcase.css";

// Import real assets
import socialMedia from "../../assets/socialMedia.PNG";
import poster from "../../assets/poster.PNG";
import insta from "../../assets/insta.PNG";

const Showcase = () => {
  // Real AI generations showcase
  const aiGenerations = [
    {
      id: 1,
      title: 'Social Media Post',
      preview: socialMedia,
      type: 'Instagram Post',
      time: '2s',
      quality: '96%'
    },
    {
      id: 2,
      title: 'Event Poster',
      preview: poster,
      type: 'Marketing Poster',
      time: '3s',
      quality: '94%'
    },
    {
      id: 3,
      title: 'Instagram Story',
      preview: insta,
      type: 'Story Design',
      time: '2s',
      quality: '98%'
    }
  ];

  return (
    <section className="showcase section">
      <Reveal className="center">
        <div className="kicker">See It In Action</div>
        <h2 className="h2">Professional Design Tools</h2>
        <p className="muted">
          From powerful canvas editing to AI-generated designs — create stunning visuals in minutes.
        </p>
      </Reveal>

      {/* Main Showcase Layout */}
      <div className="showcase-modern-layout">
        {/* Left: Canvas Editor Preview */}
        <Reveal delay={0.1}>
          <MotionCard className="showcase-canvas-card">
            <div className="showcase-card-header">
              <div className="header-left">
                <FiLayers size={20} className="header-icon" />
                <h3>Drag & Drop Editor</h3>
              </div>
              <div className="live-badge">
                <span className="pulse-dot"></span>
                <span>Live</span>
              </div>
            </div>

            {/* Canvas Editor with Figma-style layout */}
            <div className="canvas-editor-demo">
              {/* Top Toolbar */}
              <div className="canvas-demo-toolbar">
                <div className="toolbar-section">
                  <div className="tool-icon active">
                    <FiMove size={16} />
                  </div>
                  <div className="tool-icon">
                    <FiType size={16} />
                  </div>
                  <div className="tool-icon">
                    <FiSquare size={16} />
                  </div>
                  <div className="tool-icon">
                    <FiImage size={16} />
                  </div>
                </div>
                <div className="toolbar-zoom">100%</div>
              </div>

              {/* Canvas Area with Elements */}
              <div className="canvas-demo-area">
                {/* Design Canvas */}
                <div className="demo-canvas">
                  {/* Background Grid */}
                  <div className="canvas-grid"></div>
                  
                  {/* Design Elements */}
                  <div className="canvas-content">
                    {/* Gradient Background Shape */}
                    <div className="demo-element bg-shape"></div>
                    
                    {/* Text Element - Large Heading */}
                    <div className="demo-element text-heading">
                      <div className="demo-text-content">Create Amazing</div>
                      <div className="element-border selected"></div>
                    </div>
                    
                    {/* Text Element - Subheading */}
                    <div className="demo-element text-sub">
                      <div className="demo-text-content small">Designs in minutes</div>
                    </div>
                    
                    {/* Shape Element - Circle */}
                    <div className="demo-element circle-shape"></div>
                    
                    {/* Shape Element - Rectangle */}
                    <div className="demo-element rect-shape"></div>
                    
                    {/* Icon Elements */}
                    <div className="demo-element icon-element" style={{ top: '60%', left: '15%' }}>
                      <FiStar size={24} />
                    </div>
                    <div className="demo-element icon-element" style={{ top: '65%', left: '80%' }}>
                      <FiHeart size={24} />
                    </div>
                  </div>
                </div>

                {/* Properties Panel */}
                <div className="demo-properties">
                  <div className="properties-header">Properties</div>
                  <div className="property-item">
                    <span className="prop-label">Position</span>
                    <div className="prop-inputs">
                      <input type="text" value="X: 120" readOnly />
                      <input type="text" value="Y: 80" readOnly />
                    </div>
                  </div>
                  <div className="property-item">
                    <span className="prop-label">Size</span>
                    <div className="prop-inputs">
                      <input type="text" value="W: 300" readOnly />
                      <input type="text" value="H: 60" readOnly />
                    </div>
                  </div>
                  <div className="property-item">
                    <span className="prop-label">Fill</span>
                    <div className="prop-color-grid">
                      <div className="color-swatch" style={{ background: '#667eea' }}></div>
                      <div className="color-swatch" style={{ background: '#f093fb' }}></div>
                      <div className="color-swatch" style={{ background: '#4facfe' }}></div>
                      <div className="color-swatch" style={{ background: '#43e97b' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Layers Panel */}
              <div className="canvas-demo-layers">
                <div className="layers-title">Layers</div>
                <div className="layer-items">
                  <div className="layer-row selected">
                    <FiType size={14} />
                    <span>Hero Text</span>
                  </div>
                  <div className="layer-row">
                    <FiSquare size={14} />
                    <span>Background</span>
                  </div>
                  <div className="layer-row">
                    <FiCircle size={14} />
                    <span>Shape 1</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="canvas-features">
              <div className="feature-tag">
                <FiCheck size={12} />
                <span>Drag & Drop</span>
              </div>
              <div className="feature-tag">
                <FiCheck size={12} />
                <span>Real-time Edit</span>
              </div>
              <div className="feature-tag">
                <FiCheck size={12} />
                <span>Export PNG/SVG</span>
              </div>
            </div>
          </MotionCard>
        </Reveal>

        {/* Right: AI Generations */}
        <div className="showcase-right-section">
          {/* AI Generations Showcase */}
          <Reveal delay={0.2}>
            <MotionCard className="ai-showcase-card">
              <div className="showcase-card-header">
                <div className="header-left">
                  <FiZap size={20} className="header-icon" />
                  <h3>AI Generations</h3>
                </div>
                <div className="quality-badge">
                  <FiCheck size={14} />
                  <span>94%+ Quality</span>
                </div>
              </div>

              {/* AI Results Grid */}
              <div className="ai-results-grid">
                {aiGenerations.map((gen, idx) => (
                  <Reveal key={gen.id} delay={0.25 + idx * 0.08}>
                    <div className="ai-result-item">
                      <div className="ai-result-preview">
                        <img src={gen.preview} alt={gen.title} />
                        <div className="ai-result-overlay">
                          <div className="overlay-label">View</div>
                        </div>
                      </div>
                      <div className="ai-result-info">
                        <div className="ai-result-type">{gen.type}</div>
                        <div className="ai-result-meta">
                          <span className="meta-time">
                            <FiZap size={12} />
                            {gen.time}
                          </span>
                          <span className="meta-quality">{gen.quality}</span>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </MotionCard>
          </Reveal>

          {/* Code Generator Preview */}
          <Reveal delay={0.3}>
            <MotionCard className="code-showcase-card">
              <div className="code-header">
                <FiCode size={18} />
                <h4>Code Generator</h4>
                <div className="code-lang-badge">React</div>
              </div>
              <pre className="code-preview">
{`function Hero() {
  return (
    <section className="hero">
      <h1>Amazing Design</h1>
      <p>Built with AI</p>
    </section>
  );
}`}
              </pre>
            </MotionCard>
          </Reveal>

          {/* AI Chat Example */}
          <Reveal delay={0.35}>
            <MotionCard className="ai-chat-card">
              <div className="chat-header">
                <FiMessageSquare size={18} />
                <h4>AI Assistant</h4>
              </div>
              
              <div className="chat-messages">
                <div className="chat-message user">
                  <div className="message-bubble">
                    Create a hero section
                  </div>
                </div>
                <div className="chat-message ai">
                  <div className="message-bubble">
                    <div className="ai-response">
                      ✓ Generated React component
                    </div>
                  </div>
                </div>
              </div>
            </MotionCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default Showcase;
