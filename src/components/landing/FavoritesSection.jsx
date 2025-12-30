import React from "react";
import Reveal from "./Reveal";
import MotionCard from "./MotionCard";
import { FiStar, FiHeart, FiBookmark } from "react-icons/fi";
import { FaPalette, FaCamera, FaVideo, FaFileAlt } from "react-icons/fa";
import "./FavoritesSection.css";

const FavoritesSection = () => {
  // Sample favorite items with visual variety
  const favoriteItems = [
    { id: 1, type: 'design', color: '#667eea', icon: FaPalette, title: 'Brand Kit' },
    { id: 2, type: 'photo', color: '#f093fb', icon: FaCamera, title: 'Product Photos' },
    { id: 3, type: 'video', color: '#4facfe', icon: FaVideo, title: 'Intro Video' },
    { id: 4, type: 'doc', color: '#fa709a', icon: FaFileAlt, title: 'Template' },
    { id: 5, type: 'design', color: '#43e97b', icon: FaPalette, title: 'UI Design' },
    { id: 6, type: 'photo', color: '#ffd452', icon: FaCamera, title: 'Lifestyle' },
  ];

  return (
    <section className="favorites section" id="favorites">
      <Reveal className="center">
        <div className="kicker">Favorites</div>
        <h2 className="h2">Save What Inspires You</h2>
        <p className="muted">
          Star your best work and inspiration. Access them instantly whenever you need.
        </p>
      </Reveal>

      <div className="favorites-modern-layout">
        {/* Left: Featured Favorite with Large Preview */}
        <Reveal>
          <MotionCard className="featured-favorite">
            <div className="featured-badge">
              <FiStar size={16} />
              <span>Most Viewed</span>
            </div>
            
            <div className="featured-preview">
              <div className="preview-gradient"></div>
              <div className="preview-content">
                <div className="preview-icon">
                  <FaPalette size={40} />
                </div>
              </div>
            </div>
            
            <div className="featured-info">
              <div className="featured-category">Brand Design</div>
              <h3 className="featured-title">Minimalist Brand Identity</h3>
              <p className="featured-desc">Complete branding system with logo variations</p>
              
              <div className="featured-meta">
                <div className="meta-item">
                  <FiHeart size={16} />
                  <span>156</span>
                </div>
                <div className="meta-item">
                  <FiBookmark size={16} />
                  <span>23</span>
                </div>
              </div>
            </div>
          </MotionCard>
        </Reveal>

        {/* Right: Grid of Favorite Items */}
        <div className="favorites-grid-wrapper">
          <Reveal delay={0.1}>
            <div className="favorites-grid-header">
              <h4>Recent Favorites</h4>
              <button className="btn-view-all">View All →</button>
            </div>
          </Reveal>

          <div className="favorites-masonry-grid">
            {favoriteItems.map((item, idx) => (
              <Reveal key={item.id} delay={0.15 + idx * 0.05}>
                <MotionCard className="favorite-tile">
                  <div className="tile-star-icon">
                    <FiStar size={14} fill="currentColor" />
                  </div>
                  
                  <div 
                    className="tile-visual"
                    style={{ 
                      background: `linear-gradient(135deg, ${item.color}20, ${item.color}40)`,
                    }}
                  >
                    <item.icon size={28} style={{ color: item.color }} />
                  </div>
                  
                  <div className="tile-title">{item.title}</div>
                </MotionCard>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Stats Bar */}
      <Reveal delay={0.2}>
        <div className="favorites-stats-bar">
          <div className="stat-item-inline">
            <div className="stat-number">156</div>
            <div className="stat-text">Total Saved</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item-inline">
            <div className="stat-number">12</div>
            <div className="stat-text">Collections</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item-inline">
            <div className="stat-number">89</div>
            <div className="stat-text">This Month</div>
          </div>
        </div>
      </Reveal>
    </section>
  );
};

export default FavoritesSection;