import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiMoreHorizontal,
  FiStar,
  FiEye,
  FiEdit2,
  FiDownload,
  FiShare2,
  FiTrash2,
  FiSearch,
  FiChevronDown
} from "react-icons/fi";
import { FaPalette, FaCamera, FaGlobe, FaRegFileAlt, FaRegStar, FaRegStar as FaStarSolid, FaThLarge } from "react-icons/fa";
import api from "../../services/api";

// Helper function to render icon based on icon type string
const renderIcon = (iconType, color) => {
  const size = 32;
  const style = { color };
  switch(iconType) {
    case "palette": return <FaPalette size={size} style={style} />;
    case "thlarge": return <FaThLarge size={size} style={style} />;
    case "globe": return <FaGlobe size={size} style={style} />;
    case "camera": return <FaCamera size={size} style={style} />;
    case "file": return <FaRegFileAlt size={size} style={style} />;
    default: return <FaPalette size={size} style={style} />;
  }
};

const statusBg = {
  "Completed": "#eafbf3",
  "In Progress": "#e7f0fd",
  "Draft": "#fff9e7",
  "Review": "#f7edfa"
};

const statusColor = {
  "Completed": "#4db97f",
  "In Progress": "#387df6",
  "Draft": "#b68d00",
  "Review": "#ac50d9"
};

const projectFilters = [
  "All Projects",
  "Favorites",
  "Completed",
  "In Progress",
  "Draft",
  "Review"
];

export const ProjectCards = () => {
  const navigate = useNavigate();
  const [dropdown, setDropdown] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(projectFilters[0]);
  const [hovered, setHovered] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [brandKits, setBrandKits] = useState([]);
  const [brandKitFolders, setBrandKitFolders] = useState([]);
  const [loadingBrandKitFolders, setLoadingBrandKitFolders] = useState(true);
  const [hoveredBrandKit, setHoveredBrandKit] = useState(null);

  // Helper function to extract brand name from kitFolder
  const extractBrandName = (kitFolder) => {
    // kitFolder format: "name-lowercase-timestamp"
    // Remove the last part (timestamp) and convert back to readable format
    const parts = kitFolder.split('-');
    // Find where the timestamp starts (last part that's all digits and long enough to be a timestamp)
    let nameParts = [];
    for (let i = 0; i < parts.length; i++) {
      // Check if this part is a timestamp (all digits and at least 10 digits long)
      if (/^\d+$/.test(parts[i]) && parts[i].length >= 10) {
        // This is the timestamp, stop here
        break;
      }
      nameParts.push(parts[i]);
    }
    // Join and capitalize first letter of each word
    return nameParts
      .join(' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Match brand kit folders with brand kits from database
  const getBrandKitInfo = (kitFolder) => {
    const extractedName = extractBrandName(kitFolder);
    // Try to find matching brand kit in database
    const matchedKit = brandKits.find(kit => 
      kit.name.toLowerCase().replace(/ /g, '-') === extractedName.toLowerCase().replace(/ /g, '-')
    );
    return matchedKit || { name: extractedName };
  };

  // Fetch projects from backend
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await api.getProjects();
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };
    const fetchBrandKits = async () => {
      try {
        const kits = await api.getBrandKits();
        setBrandKits(kits || []);
      } catch (error) {
        console.error('Error fetching brand kits:', error);
        setBrandKits([]);
      }
    };
    const fetchBrandKitFolders = async () => {
      try {
        setLoadingBrandKitFolders(true);
        const folders = await api.getBrandKitFolders();
        setBrandKitFolders(folders || []);
      } catch (error) {
        console.error('Error fetching brand kit folders:', error);
        setBrandKitFolders([]);
      } finally {
        setLoadingBrandKitFolders(false);
      }
    };
    fetchProjects();
    fetchBrandKits();
    fetchBrandKitFolders();
  }, []);

  if (loading) {
    return (
      <div style={{
        width: "100%",
        maxWidth: 1320,
        margin: "0 auto", 
        padding: "28px 24px 20px 24px",
        textAlign: "center",
        fontSize: "1.2rem",
        color: "#888"
      }}>
        Loading projects...
      </div>
    );
  }

  return (
    <div style={{
      width: "100%",
      maxWidth: 1320,
      margin: "0 auto", 
      padding: "28px 24px 20px 24px"
    }}>
      

      {/* Brand Kit Folders (from S3) */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ 
            margin: 0, 
            fontSize: '1.5rem', 
            fontWeight: 700, 
            color: '#0f172a',
            letterSpacing: '-0.02em'
          }}>
            Brand Kits
          </h2>
          {!loadingBrandKitFolders && (
            <span style={{ 
              color: '#64748b', 
              fontWeight: 600,
              fontSize: '0.9375rem',
              background: '#f1f5f9',
              padding: '6px 12px',
              borderRadius: 12
            }}>
              {brandKitFolders.length} {brandKitFolders.length === 1 ? 'kit' : 'kits'}
            </span>
          )}
        </div>
        {loadingBrandKitFolders ? (
          <div style={{ 
            color: '#94a3b8', 
            textAlign: 'center', 
            padding: '40px 20px',
            fontSize: '1.07rem',
            background: '#fafbfc',
            borderRadius: 16,
            border: '1px solid #e2e8f0'
          }}>
            Loading brand kits...
          </div>
        ) : brandKitFolders.length === 0 ? (
          <div style={{ 
            color: '#94a3b8', 
            textAlign: 'center',
            padding: '40px 20px',
            background: '#fafbfc',
            borderRadius: 16,
            border: '1px solid #e2e8f0'
          }}>
            No brand kits found.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
            {brandKitFolders.map((f) => {
              const brandKitInfo = getBrandKitInfo(f.kitFolder);
              const isHovered = hoveredBrandKit === f.kitFolder;
              return (
                <div
                  key={f.kitFolder}
                  onClick={() => navigate('/brand-kit-detail', { state: { brandKit: f } })}
                  onMouseEnter={() => setHoveredBrandKit(f.kitFolder)}
                  onMouseLeave={() => setHoveredBrandKit(null)}
                  style={{
                    background: 'linear-gradient(to bottom, #ffffff 0%, #fafbfc 100%)',
                    border: isHovered ? '2px solid #8b5cf6' : '1.5px solid #e2e8f0',
                    borderRadius: 20,
                    padding: 24,
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: isHovered 
                      ? '0 12px 32px rgba(139, 92, 246, 0.15), 0 0 0 1px rgba(139, 92, 246, 0.1)' 
                      : '0 2px 8px rgba(15, 23, 42, 0.04)',
                    transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Gradient accent */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(90deg, #8b5cf6 0%, #7c3aed 50%, #6d28d9 100%)',
                    opacity: isHovered ? 1 : 0.6
                  }} />
                  
                  {/* Logo preview */}
                  {f.files.logo?.url && (
                    <div style={{
                      width: '100%',
                      height: 180,
                      borderRadius: 12,
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      marginBottom: 16,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
                    }}>
                      <img 
                        src={f.files.logo.url} 
                        alt="Logo" 
                        style={{ 
                          maxWidth: '90%',
                          maxHeight: '90%',
                          objectFit: 'contain'
                        }} 
                      />
                    </div>
                  )}
                  
                  {/* Brand name */}
                  <div style={{
                    fontWeight: 700,
                    color: '#0f172a',
                    fontSize: '1.25rem',
                    marginBottom: 8,
                    letterSpacing: '-0.01em',
                    lineHeight: 1.3
                  }}>
                    {brandKitInfo.name}
                  </div>
                  
                  {/* Tagline if available */}
                  {brandKitInfo.tagline && (
                    <div style={{
                      color: '#64748b',
                      fontSize: '0.9375rem',
                      marginBottom: 16,
                      lineHeight: 1.5
                    }}>
                      {brandKitInfo.tagline}
                    </div>
                  )}
                  
                  {/* Preview thumbnails */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 8,
                    marginTop: 16
                  }}>
                    {f.files.logo?.url && (
                      <div style={{
                        aspectRatio: '1',
                        borderRadius: 8,
                        overflow: 'hidden',
                        border: '1px solid #e2e8f0',
                        background: '#ffffff'
                      }}>
                        <img 
                          src={f.files.logo.url} 
                          alt="Logo" 
                          style={{ 
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }} 
                        />
                      </div>
                    )}
                    {f.files.banner?.url && (
                      <div style={{
                        aspectRatio: '1',
                        borderRadius: 8,
                        overflow: 'hidden',
                        border: '1px solid #e2e8f0',
                        background: '#ffffff'
                      }}>
                        <img 
                          src={f.files.banner.url} 
                          alt="Banner" 
                          style={{ 
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }} 
                        />
                      </div>
                    )}
                    {f.files.poster?.url && (
                      <div style={{
                        aspectRatio: '1',
                        borderRadius: 8,
                        overflow: 'hidden',
                        border: '1px solid #e2e8f0',
                        background: '#ffffff'
                      }}>
                        <img 
                          src={f.files.poster.url} 
                          alt="Poster" 
                          style={{ 
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }} 
                        />
                      </div>
                    )}
                  </div>
                  
                  {/* View details hint */}
                  <div style={{
                    marginTop: 16,
                    paddingTop: 16,
                    borderTop: '1px solid #e2e8f0',
                    color: '#8b5cf6',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    opacity: isHovered ? 1 : 0.7,
                    transition: 'opacity 0.2s'
                  }}>
                    <FiEye size={16} />
                    <span>Click to view details</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Top bar */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 30,
        flexWrap: "wrap"
      }}>
        <div style={{
          position: "relative",
          width: 340,
          maxWidth: "90%"
        }}>
          <FiSearch style={{ position: "absolute", top: 14, left: 18, color: "#b3b7cd", fontSize: 20 }} />
          <input
            type="text"
            placeholder="Search projects..."
            style={{
              width: "100%",
              borderRadius: "16px",
              background: "#fafbff",
              border: "1.5px solid #eeeff7",
              outline: "none",
              padding: "11px 16px 11px 44px",
              fontSize: "1.11rem",
              color: "#24243b",
              fontWeight: 500,
            }}
          />
        </div>
        {/* Filter dropdown */}
        <div style={{ position: "relative", minWidth: 175 }}>
          <button
            onClick={() => setDropdown(d => !d)}
            style={{
              background: "#fff",
              border: "1.5px solid #eeeff7",
              color: "#6d6f80",
              padding: "8px 30px 8px 16px",
              borderRadius: "16px",
              fontSize: "1.07rem",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              minWidth: 148,
              boxShadow: dropdown ? "0 3px 28px #a889ff13" : "none"
            }}
          >
            {selectedFilter}
            <FiChevronDown style={{ marginLeft: 12, fontSize: 20, transition: "all 0.18s", transform: dropdown ? "rotate(-180deg)" : "" }} />
          </button>
          {dropdown &&
            <div style={{
              position: "absolute",
              right: 0,
              top: "102%",
              marginTop: 6,
              background: "#fff",
              borderRadius: 17,
              boxShadow: "0 6px 32px #aba7ed35",
              zIndex: 40,
              minWidth: 182,
              padding: "7px 0",
              border: "1.5px solid #edecfa"
            }}>
              {projectFilters.map((v) =>
                <div
                  key={v}
                  onClick={() => {
                    setSelectedFilter(v);
                    setDropdown(false);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "10px 18px",
                    fontWeight: v === selectedFilter ? 700 : 500,
                    color: v === selectedFilter ? "#7049f7" : "#37344a",
                    background: v === selectedFilter ? "#ece7fc" : "none",
                    fontSize: "1.08rem",
                    cursor: "pointer"
                  }}
                >
                  {v === selectedFilter && <span style={{
                    width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                    <span style={{
                      display: "inline-block",
                      width: 13,
                      height: 13,
                      borderRadius: "50%",
                      background: "#9267fa",
                      marginRight: 10,
                      verticalAlign: "middle"
                    }}></span>
                  </span>}
                  {v}
                </div>
              )}
            </div>}
        </div>
      </div>
      {/* Card grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "28px"
      }}>
        {projects.map((card, i) => (
          <div
            key={i}
            style={{
              background: "#fff",
              borderRadius: 22,
              boxShadow: "0 3px 17px #eaeaf93d",
              border: "1.7px solid #edeefa",
              padding: "30px 24px 22px 24px",
              minHeight: 212,
              display: "flex",
              flexDirection: "column",
              position: "relative",
              transition: "transform 0.15s, box-shadow 0.15s, border 0.15s",
              cursor: "pointer"
            }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => {
              setHovered(null);
              setMenuOpen(null);
            }}
          >
            {/* Three dots hover menu */}
            <div
              style={{
                position: "absolute",
                top: 20,
                right: 24,
                zIndex: 2
              }}
            >
              {(hovered === i || menuOpen === i) && (
                <button
                  onClick={e => {
                    e.stopPropagation();
                    setMenuOpen(menuOpen === i ? null : i);
                  }}
                  style={{
                    background: "#f5f6ff",
                    border: "none",
                    borderRadius: "50%",
                    width: 36,
                    height: 36,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <FiMoreHorizontal size={22} color="#7268a3" />
                </button>
              )}
              {menuOpen === i && (
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: 36,
                    background: "#fff",
                    borderRadius: 15,
                    boxShadow: "0 10px 30px #7f7ee111",
                    border: "1.3px solid #ece9ff",
                    zIndex: 99,
                    minWidth: 151
                  }}
                >
                  <MenuItem icon={<FiEye />} text="View" />
                  <MenuItem icon={<FiEdit2 />} text="Edit" />
                  <MenuItem icon={<FiDownload />} text="Download" />
                  <MenuItem icon={<FiShare2 />} text="Share" />
                  <MenuItem icon={<FiTrash2 color="#ed5972" />} text="Delete" danger />
                </div>
              )}
            </div>
            {/* Star icon */}
            <div
              style={{
                position: "absolute",
                top: 20,
                left: 24,
                zIndex: 1
              }}
            >
              {card.favorite
                ? <FiStar size={22} color="#fdd835" title="Favorite" style={{fill: "#fdd835"}} />
                : <FaRegStar size={22} color="#e4e4e6" title="Not Favorite" />}
            </div>
            {/* Project icon */}
            <div style={{ marginBottom: 16 }}>
              {renderIcon(card.iconType || "palette", card.iconColor || card.statusColor || "#f79ebb")}
            </div>
            <div style={{ fontWeight: 700, fontSize: "1.16rem", color: "#181d3a", marginBottom: 5 }}>
              {card.title}
            </div>
            <div style={{ color: "#757891", fontSize: "1.07rem", marginBottom: 16, minHeight: 38 }}>
              {card.desc}
            </div>
            <div style={{ marginBottom: 13, display: "flex", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
              <span style={{
                background: "#f7f8fb",
                color: "#322d4c",
                fontWeight: 600,
                borderRadius: 9,
                fontSize: "0.99rem",
                padding: "5px 16px"
              }}>
                {card.category}
              </span>
              <span style={{
                background: statusBg[card.status],
                color: statusColor[card.status],
                fontWeight: 700,
                borderRadius: 10,
                fontSize: "1.01rem",
                padding: "5px 15px"
              }}>
                {card.status}
              </span>
            </div>
            <div style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              marginBottom: 16
            }}>
              {card.hashtags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    background: "#f5f6fc",
                    color: "#888ca9",
                    fontWeight: 600,
                    borderRadius: 8,
                    fontSize: "0.99rem",
                    padding: "4px 11px"
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontWeight: 500,
              color: "#adb2c0",
              fontSize: "1.07rem"
            }}>
              <span>{card.date}</span>
              <span>{card.size}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const MenuItem = ({ icon, text, danger }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "9px 20px",
      cursor: "pointer",
      color: danger ? "#ed5972" : "#35345e",
      fontWeight: 600,
      fontSize: "1.04rem",
      borderTop: "1px solid #f2f0ff",
      background: danger ? "#fff6f7" : "#fff",
      transition: "background 0.11s"
    }}
    onMouseEnter={e => e.currentTarget.style.background = danger ? "#ffe8ea" : "#f6f4fd"}
    onMouseLeave={e => e.currentTarget.style.background = danger ? "#fff6f7" : "#fff"}
  >
    {icon}
    {text}
  </div>
);

export default ProjectCards;
