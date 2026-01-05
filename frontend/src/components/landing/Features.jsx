import React, { useRef } from "react";
import { motion } from "framer-motion";
import "./Features.css";

const features = [
  { 
    title: "AI Design Generator",
    desc: "Create logos, layouts, posters from text prompts.",
    img: "https://plus.unsplash.com/premium_photo-1727009856408-0ed31ef1e28d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8QUklMjBkZXNpZ24lMjBnZW5lcmF0aW9ufGVufDB8fDB8fHww"
  },
  { 
    title: "Image Creator",
    desc: "Generate stylized art and product mockups instantly.",
    img: "https://plus.unsplash.com/premium_photo-1661720325684-5475dd284cb4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8SW1hZ2UlMjBDcmVhdG9yfGVufDB8fDB8fHww"
  },
  { 
    title: "Content Writer",
    desc: "Write SEO-optimized blogs, captions and emails.",
    img: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Q29udGVudCUyMFdyaXRlcnxlbnwwfHwwfHx8MA%3D%3D"
  },
  { 
    title: "Code Generator",
    desc: "Produce frontend or backend snippets from instructions.",
    img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&w=1280&q=80"
  },
  { 
    title: "Video Producer",
    desc: "Convert ideas or text into short videos.",
    img: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?ixlib=rb-4.0.3&w=1280&q=80"
  },
  { 
    title: "Brand Builder",
    desc: "Define palettes, typography and brand identity assets.",
    img: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8QnJhbmRpbmd8ZW58MHx8MHx8fDA%3D"
  },
  { 
    title: "Image Editor",
    desc: "Remove backgrounds, apply filters and enhance images.",
    img: "https://images.unsplash.com/photo-1604345982373-7b0f0241b5b8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzJ8fEltYWdlJTIwRWRpdG9yfGVufDB8fDB8fHww"
  },
  { 
    title: "Canvas for Designing",
    desc: "Design freely on a full drag-and-drop canvas.",
    img: "https://media.istockphoto.com/id/2198117853/photo/concept-of-business-ideas-and-startups-strategic-thinking-in-marketing.webp?a=1&b=1&s=612x612&w=0&k=20&c=dJsDlccdC-tliLQ5EIA10iho4GEFTYgwyxp0Bm1galM="
  },
];

const Features = () => {
  const trackRef = useRef(null);

  const scroll = (delta) => {
    if (trackRef.current) {
      trackRef.current.scrollBy({ left: delta, behavior: "smooth" });
    }
  };

  return (
    <section className="features section" id="features">
      <div className="center">
        <div className="kicker">Core Tools</div>
        <h2 className="h2">Built for creators & teams</h2>
        <p className="muted">Design, write, code, edit and collaborate — all in Athena.</p>
      </div>

      <div className="slider-wrapper">
        <button className="arrow left" onClick={() => scroll(-300)}>
        </button>

        <motion.div className="features-slider" ref={trackRef}>
          <motion.div className="features-track" drag="x" dragConstraints={{ left: -2000, right: 0 }}>
            {features.map((f, i) => {
              return (
                <motion.div
                  key={i}
                  className="feature-card"
                  style={{ backgroundImage: `url(${f.img})` }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="feature-overlay">
                    <h3>{f.title}</h3>
                    <p>{f.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>

        <button className="arrow right" onClick={() => scroll(300)}>
        </button>
      </div>
    </section>
  );
};

export default Features;
