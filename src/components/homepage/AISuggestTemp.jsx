import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiChevronLeft,
  FiChevronRight,
  FiInstagram,
  FiVideo,
  FiBriefcase,
  FiImage,
  FiFileText,
  FiGlobe,
  FiMail,
  FiMaximize2,
} from "react-icons/fi";
import { FaLinkedin, FaFacebook, FaTwitter, FaPinterest } from "react-icons/fa";
import BussinessCard from "../../assets/bussiness.PNG";
import Facebook from "../../assets/facebook.PNG";
import Instagram from "../../assets/insta.PNG";
import Social from "../../assets/socialMedia.PNG";
import Poster from "../../assets/poster.PNG";
import Youtube from "../../assets/youtube.PNG";
import api from "../../services/api";

const TEMPLATES = [
  { 
    id: 1, 
    name: 'Social Media Post', 
    width: 1080, 
    height: 1080, 
    category: 'Social',
    thumbnail: Social,
    description: 'Perfect for engaging social content'
  },
  { 
    id: 2, 
    name: 'Instagram Story', 
    width: 1080, 
    height: 1920, 
    category: 'Social',
    thumbnail: Instagram,
    description: 'Full-screen stories that captivate'
  },
  { 
    id: 3, 
    name: 'Facebook Cover', 
    width: 1200, 
    height: 630, 
    category: 'Social',
    thumbnail: Facebook,
    description: 'Professional cover photos'
  },
  { 
    id: 4, 
    name: 'YouTube Thumbnail', 
    width: 1280, 
    height: 720, 
    category: 'Video',
    thumbnail: Youtube,
    description: 'Click-worthy video thumbnails'
  },
  { 
    id: 5, 
    name: 'Business Card', 
    width: 1050, 
    height: 600, 
    category: 'Business',
    thumbnail: BussinessCard,
    description: 'Professional networking cards'
  },
  { 
    id: 8, 
    name: 'Poster', 
    width: 1080, 
    height: 1350, 
    category: 'Print',
    thumbnail: Poster,
    description: 'Eye-catching promotional posters'
  },
];

const AISuggestTemp = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [suggestedTemplates, setSuggestedTemplates] = useState([]);
  const [isPhone, setIsPhone] = useState(false);
  const [isSmallMobile, setIsSmallMobile] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const handle = () => {
      const width = window.innerWidth;
      setIsSmallMobile(width <= 360);
      setIsPhone(width <= 768);
    };
    handle();
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, []);

  useEffect(() => {
    const fetchProjectsAndSuggest = async () => {
      setLoading(true);
      try {
        const userProjects = await api.getProjects();

        // Analyze user activity to suggest templates
        const categoryCount = {};
        userProjects.forEach(project => {
          const category = project.category || 'General';
          categoryCount[category] = (categoryCount[category] || 0) + 1;
        });

        const categoryMapping = {
          'Social Media': 'Social',
          'Video': 'Video',
          'Business': 'Business',
          'Branding': 'Branding',
          'Print': 'Print',
          'Web': 'Web',
          'Email': 'Email',
        };

        // Find most used categories
        const sortedCategories = Object.entries(categoryCount)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 2);

        // Get suggested templates based on activity
        let suggested = [];
        if (sortedCategories.length > 0) {
          sortedCategories.forEach(([category]) => {
            const templateCategory = categoryMapping[category] || category;
            const templates = TEMPLATES.filter(t => t.category === templateCategory);
            suggested.push(...templates.slice(0, 2));
          });
        }

        // If no specific suggestions, show popular templates
        if (suggested.length === 0) {
          suggested = TEMPLATES.slice(0, 6);
        } else {
          // Ensure we have exactly 6 templates
          const additionalNeeded = 6 - suggested.length;
          if (additionalNeeded > 0) {
            const additionalTemplates = TEMPLATES
              .filter(t => !suggested.find(s => s.id === t.id))
              .slice(0, additionalNeeded);
            suggested.push(...additionalTemplates);
          }
        }

        // Limit to exactly 6 templates
        setSuggestedTemplates(suggested.slice(0, 6));
      } catch (error) {
        console.error('Error fetching projects:', error);
        // Fallback to first 6 templates
        setSuggestedTemplates(TEMPLATES.slice(0, 6));
      } finally {
        setLoading(false);
      }
    };

    fetchProjectsAndSuggest();
  }, []);

  const handleTemplateClick = (template) => {
    navigate('/canva-clone', { state: { selectedTemplate: template } });
  };

  const cardsPerView = isSmallMobile ? 1 : isPhone ? 2 : 3;
  const maxIndex = Math.max(0, suggestedTemplates.length - cardsPerView);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  // Get icon for template category
  const getCategoryIcon = (category, name) => {
    const iconSize = isSmallMobile ? 16 : isPhone ? 18 : 20;
    const iconStyle = { color: "#7049f7" };

    if (category === 'Social') {
      if (name.includes('Instagram')) return <FiInstagram size={iconSize} style={iconStyle} />;
      if (name.includes('Facebook')) return <FaFacebook size={iconSize} style={iconStyle} />;
      if (name.includes('LinkedIn')) return <FaLinkedin size={iconSize} style={iconStyle} />;
      if (name.includes('Twitter')) return <FaTwitter size={iconSize} style={iconStyle} />;
      if (name.includes('Pinterest')) return <FaPinterest size={iconSize} style={iconStyle} />;
      return <FiInstagram size={iconSize} style={iconStyle} />;
    }
    if (category === 'Video') return <FiVideo size={iconSize} style={iconStyle} />;
    if (category === 'Business') return <FiBriefcase size={iconSize} style={iconStyle} />;
    if (category === 'Branding') return <FiImage size={iconSize} style={iconStyle} />;
    if (category === 'Print') return <FiFileText size={iconSize} style={iconStyle} />;
    if (category === 'Web') return <FiGlobe size={iconSize} style={iconStyle} />;
    if (category === 'Email') return <FiMail size={iconSize} style={iconStyle} />;
    return <FiMaximize2 size={iconSize} style={iconStyle} />;
  };

  return (
    <div
      style={{
        width: "100%",
        padding: isSmallMobile ? "16px 0" : isPhone ? "24px 0" : "32px 0",
        background: "linear-gradient(135deg, #f8f9ff 0%, #f0f2ff 100%)",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: isSmallMobile ? "0 14px" : isPhone ? "0 22px" : "0 24px",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: isSmallMobile ? 24 : isPhone ? 28 : 32,
            flexWrap: isSmallMobile || isPhone ? "wrap" : "nowrap",
            gap: isSmallMobile ? 12 : 16,
          }}
        >
          <div style={{ flex: 1 }}>
            <h2
              style={{
                fontSize: isSmallMobile ? "1.3rem" : isPhone ? "1.5rem" : "1.8rem",
                fontWeight: 700,
                color: "#24243b",
                margin: 0,
                marginBottom: isSmallMobile ? 8 : 12,
              }}
            >
              Suggested For You
            </h2>
            <p
              style={{
                color: "#757891",
                fontSize: isSmallMobile ? "0.95rem" : isPhone ? "1.05rem" : "1.15rem",
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              Templates tailored to your design preferences and activity
            </p>
          </div>
          <div
            onClick={() => navigate("/ai-suggest-templates")}
            style={{
              color: "#7049f7",
              fontSize: isSmallMobile ? "0.95rem" : isPhone ? "1.05rem" : "1.1rem",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              whiteSpace: "nowrap",
              transition: "color 0.2s",
              padding: "8px 16px",
              borderRadius: "8px",
              background: "rgba(112, 73, 247, 0.1)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#9267fa";
              e.currentTarget.style.background = "rgba(112, 73, 247, 0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#7049f7";
              e.currentTarget.style.background = "rgba(112, 73, 247, 0.1)";
            }}
          >
            View All <FiChevronRight size={18} />
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              color: "#757891",
              fontSize: "1.2rem",
            }}
          >
            Loading templates...
          </div>
        ) : (
          /* Templates Carousel */
          <div
            style={{
              position: "relative",
              width: "100%",
            }}
          >
            {/* Left Arrow */}
            {currentIndex > 0 && (
              <button
                onClick={handlePrev}
                style={{
                  position: "absolute",
                  left: -isSmallMobile ? 10 : isPhone ? -15 : -20,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "#fff",
                  border: "1.5px solid #f1eeff",
                  borderRadius: "50%",
                  width: isSmallMobile ? 36 : isPhone ? 40 : 44,
                  height: isSmallMobile ? 36 : isPhone ? 40 : 44,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: "0 4px 20px rgba(112, 73, 247, 0.15)",
                  zIndex: 10,
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#7049f7";
                  e.currentTarget.style.borderColor = "#7049f7";
                  e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
                  e.currentTarget.style.boxShadow = "0 6px 25px rgba(112, 73, 247, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#fff";
                  e.currentTarget.style.borderColor = "#f1eeff";
                  e.currentTarget.style.transform = "translateY(-50%) scale(1)";
                  e.currentTarget.style.boxShadow = "0 4px 20px rgba(112, 73, 247, 0.15)";
                }}
              >
                <FiChevronLeft
                  size={isSmallMobile ? 18 : isPhone ? 20 : 22}
                  color="currentColor"
                  style={{ 
                    transition: "color 0.3s",
                    color: "#7049f7" 
                  }}
                />
              </button>
            )}

            {/* Templates Carousel Container */}
            <div
              style={{
                overflow: "hidden",
                width: "100%",
                position: "relative",
              }}
            >
              <div
                style={{
                  display: "flex",
                  transform: `translateX(-${currentIndex * (100 / cardsPerView)}%)`,
                  transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                  gap: isSmallMobile ? 16 : isPhone ? 20 : 24,
                  willChange: "transform",
                }}
              >
                {suggestedTemplates.map((template, idx) => {
                  // Soft pastel palette per request
                  // 1: soft green, 2: soft pink (perfect), 3: very light white+green,
                  // 4: pink, 5: soft blue, 6: soft brown
                  const footerColors = [
                    { bg: "#AEE9D1", text: "#0f172a", rgba: "rgba(174, 233, 209, 1)" }, // soft mint green
                    { bg: "#ffffff", text: "#000000", rgba: "rgb(243, 158, 158)" }, // soft pink
                    { bg: "#E8F5EF", text: "#0f172a", rgba: "rgba(232, 245, 239, 1)" }, // white + green
                    { bg: "#FAD1E6", text: "#ffffff", rgba: "rgba(250, 209, 230, 1)" }, // pink
                    { bg: "#A6C8FF", text: "#ffffff", rgba: "rgba(166, 200, 255, 1)" }, // soft blue
                    { bg: "#C4A484", text: "#ffffff", rgba: "rgba(196, 164, 132, 1)" }, // soft brown
                  ];
                  const footerColor = footerColors[idx % footerColors.length];
                  
                  // Helper to convert rgba string to rgba with opacity
                  const rgbaWithOpacity = (opacity) => {
                    const match = footerColor.rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
                    if (match) {
                      return `rgba(${match[1]}, ${match[2]}, ${match[3]}, ${opacity})`;
                    }
                    return footerColor.rgba;
                  };
                  
                  return (
                  <div
                    key={template.id}
                    onClick={() => handleTemplateClick(template)}
                    style={{
                      background: "#fff",
                      borderRadius: isSmallMobile ? "18px" : "22px",
                      border: "none",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                      width: `calc(${100 / cardsPerView}% - ${((cardsPerView - 1) * (isSmallMobile ? 16 : isPhone ? 20 : 24)) / cardsPerView}px)`,
                      flexShrink: 0,
                      overflow: "hidden",
                      position: "relative",
                      display: "flex",
                      flexDirection: "column",
                      minHeight: isSmallMobile ? "320px" : isPhone ? "360px" : "400px",
                    }}
                    onMouseEnter={(e) => {
                      if (!isSmallMobile && !isPhone) {
                        e.currentTarget.style.transform = "translateY(-8px)";
                        e.currentTarget.style.boxShadow = "0 12px 40px rgba(0, 0, 0, 0.15)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSmallMobile && !isPhone) {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.08)";
                      }
                    }}
                  >
                    {/* Full Card Image */}
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        overflow: "hidden",
                        zIndex: 1,
                      }}
                    >
                      <img
                        src={template.thumbnail}
                        alt={template.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          transition: "transform 0.4s ease",
                        }}
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.parentElement.style.background = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
                        }}
                        onMouseEnter={(e) => {
                          if (!isSmallMobile && !isPhone) {
                            e.currentTarget.style.transform = "scale(1.08)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isSmallMobile && !isPhone) {
                            e.currentTarget.style.transform = "scale(1)";
                          }
                        }}
                      />
                      
                      {/* Gradient Overlay at Bottom */}
                      <div
                        style={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: "55%",
                          background: `linear-gradient(to top, ${rgbaWithOpacity(1)} 0%, ${rgbaWithOpacity(0.94)} 25%, ${rgbaWithOpacity(0.8)} 50%, ${rgbaWithOpacity(0.6)} 75%, ${rgbaWithOpacity(0.4)} 85%, transparent 100%)`,
                          zIndex: 2,
                          pointerEvents: "none",
                        }}
                      />
                      
                      {/* Top Gradient Overlay for better text readability */}
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          height: "30%",
                          background: "linear-gradient(to bottom, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.1) 50%, transparent 100%)",
                          zIndex: 2,
                        }}
                      />
                    </div>

                    {/* Category Badge - Top */}
                    <div
                      style={{
                        position: "absolute",
                        top: 16,
                        left: 16,
                        background: "rgba(255, 255, 255, 0.95)",
                        backdropFilter: "blur(10px)",
                        padding: "8px 14px",
                        borderRadius: "20px",
                        fontSize: isSmallMobile ? "0.75rem" : "0.8rem",
                        fontWeight: 600,
                        color: "#7049f7",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        boxShadow: "0 2px 12px rgba(0, 0, 0, 0.15)",
                        zIndex: 3,
                      }}
                    >
                      {getCategoryIcon(template.category, template.name)}
                      {template.category}
                    </div>

                    {/* Text Overlay at Bottom */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: isSmallMobile ? "20px 16px" : isPhone ? "24px 20px" : "28px 24px",
                        zIndex: 3,
                        display: "flex",
                        flexDirection: "column",
                        gap: 12,
                      }}
                    >
                      {/* Title Overlay */}
                      <div
                        style={{
                          color: "#fff",
                          fontSize: isSmallMobile ? "1.2rem" : isPhone ? "1.4rem" : "1.6rem",
                          fontWeight: 700,
                          lineHeight: 1.2,
                          textShadow: "0 2px 12px rgba(0, 0, 0, 0.4)",
                          marginBottom: 4,
                        }}
                      >
                        {template.name}
                      </div>
                      
                      {/* Description */}
                      <div
                        style={{
                          color: "rgba(255, 255, 255, 0.95)",
                          fontSize: isSmallMobile ? "0.85rem" : isPhone ? "0.9rem" : "0.95rem",
                          lineHeight: 1.4,
                          textShadow: "0 1px 6px rgba(0, 0, 0, 0.3)",
                          marginBottom: 8,
                        }}
                      >
                        {template.description}
                      </div>

                      {/* Footer Section with Colored Background */}
                      <div
                        style={{
                          background: footerColor.bg,
                          color: footerColor.text,
                          padding: isSmallMobile ? "14px 16px" : isPhone ? "16px 18px" : "18px 20px",
                          borderRadius: isSmallMobile ? "12px" : "14px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginTop: "auto",
                          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
                        }}
                      >
                        <div
                          style={{
                            fontSize: isSmallMobile ? "0.75rem" : "0.8rem",
                            fontWeight: 600,
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            opacity: 0.95,
                          }}
                        >
                          {getCategoryIcon(template.category, template.name)}
                          <span>{template.width} × {template.height}</span>
                        </div>
                        
                        <div
                          style={{
                            fontSize: isSmallMobile ? "0.8rem" : "0.85rem",
                            fontWeight: 600,
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            cursor: "pointer",
                            transition: "opacity 0.2s",
                            opacity: 0.95,
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.opacity = "1";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.opacity = "0.95";
                          }}
                        >
                          Use Template
                          <FiChevronRight size={16} />
                        </div>
                      </div>
                    </div>
                  </div>
                )})}
              </div>
            </div>

            {/* Right Arrow */}
            {currentIndex < maxIndex && (
              <button
                onClick={handleNext}
                style={{
                  position: "absolute",
                  right: -isSmallMobile ? 10 : isPhone ? -15 : -20,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "#fff",
                  border: "1.5px solid #f1eeff",
                  borderRadius: "50%",
                  width: isSmallMobile ? 36 : isPhone ? 40 : 44,
                  height: isSmallMobile ? 36 : isPhone ? 40 : 44,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: "0 4px 20px rgba(112, 73, 247, 0.15)",
                  zIndex: 10,
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#7049f7";
                  e.currentTarget.style.borderColor = "#7049f7";
                  e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
                  e.currentTarget.style.boxShadow = "0 6px 25px rgba(112, 73, 247, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#fff";
                  e.currentTarget.style.borderColor = "#f1eeff";
                  e.currentTarget.style.transform = "translateY(-50%) scale(1)";
                  e.currentTarget.style.boxShadow = "0 4px 20px rgba(112, 73, 247, 0.15)";
                }}
              >
                <FiChevronRight
                  size={isSmallMobile ? 18 : isPhone ? 20 : 22}
                  color="currentColor"
                  style={{ 
                    transition: "color 0.3s",
                    color: "#7049f7" 
                  }}
                />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AISuggestTemp;