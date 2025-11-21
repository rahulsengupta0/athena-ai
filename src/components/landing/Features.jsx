import React from "react";
import Reveal from "./Reveal";
import MotionCard from "./MotionCard";
import "./Features.css";

const featureList = [
  {title:"AI Design Generator", desc:"Create logos, layouts, posters from text prompts.", ico:"🎨"},
  {title:"Image Creator", desc:"Generate stylized art and product mockups instantly.", ico:"🖼️"},
  {title:"Content Writer", desc:"Write SEO-optimized blogs, captions and emails.", ico:"✍️"},
  {title:"Code Generator", desc:"Produce frontend or backend snippets from instructions.", ico:"💻"},
  {title:"Video Producer", desc:"Convert ideas or text into short videos.", ico:"🎬"},
  {title:"Brand Builder", desc:"Define palettes, typography and brand identity assets.", ico:"🧭"},
  {title:"Image Editor", desc:"Remove backgrounds, apply filters and enhance images.", ico:"✂️"},
  {title:"Canva Clone", desc:"Design freely on a full drag-and-drop canvas.", ico:"🧩"},
];


const Features = () => {

  return (
    <section className="features section" id="features">
      <Reveal className="center">
        <div className="kicker">Core tools</div>
        <h2 className="h2">Built for creators & teams</h2>
        <p className="muted">Design, write, code, edit and collaborate — all in Athena.</p>
        <p className="muted">Tip: Open the `Create` section to get started.</p>
      </Reveal>

      <div className="features-grid">
        {featureList.map((f,i)=>(
          <Reveal key={i} delay={i*0.06}>
            <MotionCard className="feature card">
              <div className="f-ico">{f.ico}</div>
              <h3 className="f-title">{f.title}</h3>
              <p className="f-desc">{f.desc}</p>
            </MotionCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
};

export default Features;
