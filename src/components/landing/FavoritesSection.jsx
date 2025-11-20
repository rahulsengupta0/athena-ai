import React from "react";
import "./FavoritesSection.css";

const FavoritesSection = () => {
  return (
    <section className="favorites section" id="favorites">
      <div className="center">
        <div className="kicker">Favorites</div>
        <h2 className="h2">Quick access to saved items</h2>
        <p className="muted">Pin templates, projects and assets you revisit often.</p>
      </div>

      <div className="fav-grid">
        {["Landing Template A","Poster Set B","Brand Kit C"].map((t,i)=> (
          <div key={i} className="fav-card card">
            <div className="fav-title">{t}</div>
            <div className="fav-meta">Saved • Open</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FavoritesSection;