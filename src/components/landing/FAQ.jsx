import React, { useState } from "react";
import "./FAQ.css";

const faqs = [
  {q:"How do I start a new design?", a:"Open the Create section or click Start Creating to begin with templates or blank canvas."},
  {q:"Where are my saved templates?", a:"Visit /favorites to find your saved templates and collections."},
  {q:"Can I collaborate with my team?", a:"Yes — invite teammates, share projects and leave comments in real-time."},
  {q:"How do I contact support?", a:"Open Help & Support or email support@athena.example.com for account help."},
];

const FAQ = () => {
  const [open, setOpen] = useState(null);
  return (
    <section className="faq section">
      <div className="center">
        <div className="kicker">Need help?</div>
        <h2 className="h2">Frequently asked questions</h2>
      </div>

      <div className="faq-grid">
        {faqs.map((f,i)=>(
          <div className={`faq-item card ${open===i?'open':''}`} key={i} onClick={()=>setOpen(open===i?null:i)}>
            <div className="faq-q">{f.q}</div>
            <div className="faq-a">{f.a}</div>
            <div className="faq-icon">{open===i? '−' : '+'}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;
