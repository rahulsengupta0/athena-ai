import React from "react";
import "./Features.css";

const featureList = [
  {title:"AI Design Generator", desc:"Create logos, posters or social images from text prompts.", ico:"🎨"},
  {title:"Image Creator", desc:"Generate product mockups or stylized art instantly.", ico:"🖼️"},
  {title:"Content Writer", desc:"AI-powered blog, caption, and email drafts.", ico:"✍️"},
  {title:"Code Generator", desc:"Scaffold components or backend snippets from prompts.", ico:"💻"},
  {title:"Video Maker", desc:"Turn ideas into short videos with templates.", ico:"🎬"},
  {title:"Brand Builder", desc:"Auto-suggest palettes, fonts and assets for your brand.", ico:"🧭"},
];

const Features = () => {
  return (
    <section className="features section">
      <div className="center">
        <div className="kicker">Core tools</div>
        <h2 className="h2">Built for creators & teams</h2>
        <p className="muted">Everything you need to design, write, code and collaborate — in one workspace.</p>
      </div>

      <div className="features-grid">
        {featureList.map((f,i)=>(
          <div key={i} className="feature card">
            <div className="f-ico">{f.ico}</div>
            <h3 className="f-title">{f.title}</h3>
            <p className="f-desc">{f.desc}</p>
            <div className="f-cta">Open <span>→</span></div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
