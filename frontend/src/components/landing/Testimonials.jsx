import React from "react";
import "./Testimonials.css";

const data = [
  {name:"Anita R", text:"Athena cut our design time in half. Team collaboration is effortless.", role:"Founder, EduStudio"},
  {name:"Rohit S", text:"I generate marketing content and video scripts in minutes.", role:"Content Lead"},
  {name:"Maya K", text:"The brand builder gave us consistent palettes across campaigns.", role:"Designer"},
];

const Testimonials = () => {
  return (
    <section className="testimonials section">
      <div className="center">
        <div className="kicker">Trusted by creators</div>
        <h2 className="h2">Loved by teams & students</h2>
      </div>

      <div className="test-grid">
        {data.map((t,i)=>(
          <div className="test-card card" key={i}>
            <div className="test-quote">“{t.text}”</div>
            <div className="test-author">{t.name} <span className="test-role">— {t.role}</span></div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
