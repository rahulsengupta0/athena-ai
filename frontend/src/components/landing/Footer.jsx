// Footer.jsx
import React from "react";
import "./Footer.css";

const Footer = () => (
  <footer className="footer section">
    <div className="footer-inner" style={{maxWidth: "var(--max-width)", margin:"0 auto", display:"flex", justifyContent:"space-between", gap:20, alignItems:"center"}}>
      <div>
        <div style={{fontWeight:800}}>Athena AI</div>
        <div style={{color:"var(--text-muted)", fontSize:13}}>© {new Date().getFullYear()} Athena — Empowering Creativity</div>
      </div>

      <div style={{display:"flex", gap:22, color:"var(--text-muted)"}}>
        <div>Product</div>
        <div>Tools</div>
        <div>Support</div>
        <div>Company</div>
      </div>
    </div>
  </footer>
);

export default Footer;
