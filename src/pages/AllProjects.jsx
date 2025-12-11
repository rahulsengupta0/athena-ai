import React, { useState, useEffect, useMemo } from "react";
import {
  FiMoreHorizontal,
  FiStar,
  FiEye,
  FiEdit2,
  FiDownload,
  FiShare2,
  FiTrash2,
  FiSearch,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiImage,
  FiVideo,
  FiFileText,
  FiPenTool
} from "react-icons/fi";
import { FaPalette, FaCamera, FaGlobe, FaRegFileAlt, FaRegStar, FaThLarge } from "react-icons/fa";
import api from "../services/api";

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
  "In Progress": "#e7f0fd"
};

const statusColor = {
  "Completed": "#4db97f",
  "In Progress": "#387df6"
};

const projectFilters = [
  "All Projects",
  "Favorites",
  "Completed",
  "In Progress"
];

export const AllProjects = () => {
  const [dropdown, setDropdown] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(projectFilters[0]);
  const [hovered, setHovered] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);
  const [mediaMenuOpen, setMediaMenuOpen] = useState(null);
  const [projects, setProjects] = useState([]);
  const [generatedFiles, setGeneratedFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState(null); // { list: filesOnly[], index: number }
  const [currentPage, setCurrentPage] = useState(0);
  const [favoritePending, setFavoritePending] = useState({});
  const itemsPerPage = 4;

  // Fetch projects and generated files from backend
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [projectsData, filesData] = await Promise.all([
          api.getProjects().catch(() => []),
          api.getUserFiles().catch(() => [])
        ]);
        setProjects(projectsData || []);
        setGeneratedFiles(filesData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setProjects([]);
        setGeneratedFiles([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Close preview on Esc and navigate with arrow keys
  useEffect(() => {
    if (!preview) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setPreview(null);
      if (e.key === 'ArrowRight') setPreview((p) => ({ ...p, index: (p.index + 1) % p.list.length }));
      if (e.key === 'ArrowLeft') setPreview((p) => ({ ...p, index: (p.index - 1 + p.list.length) % p.list.length }));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [preview]);

  const downloadImage = (url, filename = 'image') => {
    try {
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error('Download failed', e);
    }
  };

  const handleDeleteFile = async (fileId) => {
    try {
      const proceed = window.confirm('Are you sure you want to delete this file? This action cannot be undone.');
      if (!proceed) return;
      await api.deleteUserFile(fileId);
      setGeneratedFiles((prev) => prev.filter((f) => f._id !== fileId));
      setMediaMenuOpen(null);
      // If deleting the currently previewed image, move or close preview
      setPreview((prevState) => {
        if (!prevState) return prevState;
        const newList = prevState.list.filter((f) => f._id !== fileId);
        if (newList.length === 0) return null;
        const newIndex = Math.min(prevState.index, newList.length - 1);
        return { list: newList, index: newIndex };
      });
    } catch (err) {
      console.error('Delete failed', err);
      alert('Failed to delete file');
    }
  };

  // Normalize files for display
  const normalizedFiles = (generatedFiles || []).map((f) => ({
    type: 'file',
    id: f._id,
    title: f.key?.split('/').pop() || 'Generated Asset',
    desc: f.url,
    date: f.uploadedAt,
    url: f.url,
    iconKey: 'image',
    favorite: !!f.favorite,
    _id: f._id
  }));

  // Normalize projects for display
  const normalizedProjects = (projects || []).map((p) => ({
    type: 'project',
    id: p._id,
    title: p.title,
    desc: p.desc,
    date: p.createdAt || p.date,
    iconKey: p.icon || p.category,
    iconType: p.iconType,
    iconColor: p.iconColor || p.statusColor,
    status: p.status,
    category: p.category,
    hashtags: p.hashtags || [],
    favorite: p.favorite,
    size: p.size,
    _id: p._id
  }));

  // Combine and sort by date
  const allItems = [...normalizedProjects, ...normalizedFiles]
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const handleToggleFavorite = async (item) => {
    const id = item._id || item.id;
    if (!id) return;
    const type = item.type === 'project' ? 'project' : 'file';
    setFavoritePending((prev) => ({ ...prev, [id]: true }));
    try {
      const response = await api.toggleFavorite({ itemId: id, type });
      if (response?.type === 'project') {
        setProjects((prev) => prev.map((proj) => proj._id === response.item._id ? response.item : proj));
      } else if (response?.type === 'file') {
        setGeneratedFiles((prev) => prev.map((file) => file._id === response.item._id ? response.item : file));
      } else {
        // Fallback: optimistically toggle when backend response is missing
        if (type === 'project') {
          setProjects((prev) => prev.map((proj) =>
            proj._id === id ? { ...proj, favorite: !proj.favorite } : proj
          ));
        } else {
          setGeneratedFiles((prev) => prev.map((file) =>
            file._id === id ? { ...file, favorite: !file.favorite } : file
          ));
        }
      }
    } catch (error) {
      console.error('Favorite toggle failed', error);
      alert('Unable to update favorite right now.');
    } finally {
      setFavoritePending((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  };

  const handleToggleStatus = async (project) => {
    if (!project?._id) return;
    const nextStatus = project.status === "Completed" ? "In Progress" : "Completed";
    try {
      const updated = await api.updateProject(project._id, { status: nextStatus });
      setProjects((prev) => prev.map((p) => p._id === project._id ? updated : p));
    } catch (error) {
      console.error('Status update failed', error);
      alert('Unable to update project status right now.');
    }
  };

  const filteredItems = useMemo(() => {
    switch (selectedFilter) {
      case "Favorites":
        return allItems.filter((item) => !!item.favorite);
      case "Completed":
      case "In Progress":
        return allItems.filter(
          (item) => item.type === "project" && item.status === selectedFilter
        );
      default:
        return allItems;
    }
  }, [allItems, selectedFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages - 1);
  const pagedItems = filteredItems.slice(
    safePage * itemsPerPage,
    safePage * itemsPerPage + itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(0);
  }, [selectedFilter, projects.length, generatedFiles.length]);

  useEffect(() => {
    if (safePage !== currentPage) {
      setCurrentPage(safePage);
    }
  }, [safePage, currentPage]);

  // Filter image files for preview
  const imageFiles = normalizedFiles.filter((f) => 
    f.url && /\.(png|jpe?g|webp|gif|bmp|svg)(\?.*)?$/i.test(f.url)
  );

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
        Loading...
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
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: "1.85rem", fontWeight: 800, color: "#21222b", marginBottom: 6, letterSpacing: "-0.02em" }}>
          All Projects
        </h2>
        <p style={{ fontSize: "1.07rem", fontWeight: 500, color: "#898a98", marginTop: 0 }}>
          {filteredItems.length} {filteredItems.length === 1 ? "item" : "items"} • {projects.length} {projects.length === 1 ? "project" : "projects"} • {generatedFiles.length} {generatedFiles.length === 1 ? "generated file" : "generated files"}
        </p>
      </div>

      {/* Top bar */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 30,
        flexWrap: "wrap",
        gap: 16
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
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
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
          {/* Pagination arrows */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
              disabled={safePage === 0 || filteredItems.length === 0}
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                border: "1.5px solid #eeeff7",
                background: safePage === 0 || filteredItems.length === 0 ? "#f4f5fb" : "#fff",
                color: safePage === 0 || filteredItems.length === 0 ? "#c5c8d6" : "#6d6f80",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: safePage === 0 || filteredItems.length === 0 ? "not-allowed" : "pointer",
                transition: "all 0.18s"
              }}
              title="Previous"
            >
              <FiChevronLeft size={18} />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={safePage >= totalPages - 1 || filteredItems.length === 0}
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                border: "1.5px solid #eeeff7",
                background: safePage >= totalPages - 1 || filteredItems.length === 0 ? "#f4f5fb" : "#fff",
                color: safePage >= totalPages - 1 || filteredItems.length === 0 ? "#c5c8d6" : "#6d6f80",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: safePage >= totalPages - 1 || filteredItems.length === 0 ? "not-allowed" : "pointer",
                transition: "all 0.18s"
              }}
              title="Next"
            >
              <FiChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
      {/* Items grid */}
      {filteredItems.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "40px 20px",
          background: "#fafbfc",
          borderRadius: 18,
          border: "1.5px solid #edeefa",
          color: "#7c8097",
          fontWeight: 600
        }}>
          No items found for this filter.
        </div>
      ) : (
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
        gap: "20px"
      }}>
        {pagedItems.map((item, i) => {
          const globalIndex = safePage * itemsPerPage + i;
          const isImageFile = item.type === 'file' && item.url && /\.(png|jpe?g|webp|gif|bmp|svg)(\?.*)?$/i.test(item.url);
          const isProject = item.type === 'project';
          const itemId = item._id || item.id || item.url || globalIndex;
          const isFavorite = !!item.favorite;
          const favoriteBusyForItem = !!favoritePending[itemId];
          const canFavorite = isProject || item.type === 'file';
          
          return (
          <div
            key={item.id || item._id || globalIndex}
            style={{
              background: isImageFile ? 'transparent' : "#fff",
              borderRadius: isImageFile ? 18 : 20,
              boxShadow: isImageFile ? 'none' : "0 2px 12px #e6e7f633",
              border: isImageFile ? 'none' : "1.5px solid #edeefa",
              padding: isImageFile ? 0 : "24px 20px 20px 20px",
              minHeight: isImageFile ? 'auto' : 196,
              display: "flex",
              flexDirection: "column",
              position: "relative",
              transition: "transform 0.15s, box-shadow 0.15s, border 0.15s",
              cursor: "pointer"
            }}
            onMouseEnter={() => {
              if (isProject) setHovered(globalIndex);
            }}
            onMouseLeave={() => {
              if (isProject) {
                setHovered(null);
                setMenuOpen(null);
              }
            }}
          >
            {canFavorite && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleFavorite(item);
                }}
                disabled={favoriteBusyForItem}
                style={{
                  position: "absolute",
                  top: isImageFile ? 16 : 20,
                  left: isImageFile ? 16 : 24,
                  zIndex: 3,
                  border: "none",
                  background: "rgba(255,255,255,0.9)",
                  borderRadius: "50%",
                  width: 36,
                  height: 36,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  opacity: favoriteBusyForItem ? 0.5 : 1,
                  boxShadow: "0 6px 14px rgba(31,29,43,0.12)"
                }}
                title={isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                {isFavorite
                  ? <FiStar size={18} color="#f2a516" style={{ fill: "#f2a516" }} />
                  : <FaRegStar size={18} color="#b2b4c3" />
                }
              </button>
            )}
            {/* Image file display */}
            {isImageFile ? (
              <div
                style={{
                  width: '100%',
                  aspectRatio: '1 / 1',
                  borderRadius: 20,
                  overflow: 'hidden',
                  marginBottom: 0,
                  background: 'transparent',
                  position: 'relative',
                  border: 'none',
                }}
              >
                <img
                  src={item.url}
                  alt={item.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  loading="lazy"
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 12,
                    background: 'rgba(0,0,0,0.4)',
                    opacity: (hovered === globalIndex || mediaMenuOpen === item._id) ? 1 : 0,
                    transition: 'opacity 0.15s',
                  }}
                  onClick={(e) => e.stopPropagation()}
                  onMouseEnter={() => setMediaMenuOpen(item._id)}
                  onMouseLeave={() => setMediaMenuOpen(null)}
                >
                  <button
                    title="View"
                    onClick={() => {
                      const currentId = item._id || item.id || item.url;
                      const startIndex = imageFiles.findIndex((f) => (f._id || f.id || f.url) === currentId);
                      setPreview({ list: imageFiles, index: Math.max(0, startIndex) });
                    }}
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 10,
                      border: 'none',
                      background: 'rgba(255,255,255,0.9)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <FiEye color="#111827" />
                  </button>
                  <button
                    title="Download"
                    onClick={() => downloadImage(item.url, (item.title || 'image').replace(/\.[^/.]+$/, ''))}
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 10,
                      border: 'none',
                      background: 'rgba(255,255,255,0.9)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <FiDownload color="#111827" />
                  </button>
                  <button
                    title="Delete"
                    onClick={() => handleDeleteFile(item._id)}
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 10,
                      border: 'none',
                      background: 'rgba(255,255,255,0.9)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <FiTrash2 color="#111827" />
                  </button>
                </div>
              </div>
            ) : isProject ? (
              <>
                {/* Three dots hover menu */}
                <div
                  style={{
                    position: "absolute",
                    top: 20,
                    right: 24,
                    zIndex: 2
                  }}
                >
                  {(hovered === globalIndex || menuOpen === globalIndex) && (
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        setMenuOpen(menuOpen === globalIndex ? null : globalIndex);
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
                  {menuOpen === globalIndex && (
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
                {/* Project icon */}
                <div style={{ marginBottom: 16 }}>
                  {renderIcon(item.iconType || "palette", item.iconColor || "#f79ebb")}
                </div>
                <div style={{ fontWeight: 700, fontSize: "1.16rem", color: "#181d3a", marginBottom: 5 }}>
                  {item.title}
                </div>
                <div style={{ color: "#757891", fontSize: "1.07rem", marginBottom: 16, minHeight: 38 }}>
                  {item.desc}
                </div>
                <div style={{ marginBottom: 13, display: "flex", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                  {item.category && (
                    <span style={{
                      background: "#f7f8fb",
                      color: "#322d4c",
                      fontWeight: 600,
                      borderRadius: 9,
                      fontSize: "0.99rem",
                      padding: "5px 16px"
                    }}>
                      {item.category}
                    </span>
                  )}
                  {item.status && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleStatus(item);
                      }}
                      style={{
                        background: statusBg[item.status] || "#eceaf6",
                        color: statusColor[item.status] || "#4f4b6b",
                        fontWeight: 700,
                        borderRadius: 10,
                        fontSize: "1.01rem",
                        padding: "5px 15px",
                        border: "none",
                        cursor: "pointer"
                      }}
                      title={`Mark as ${item.status === "Completed" ? "In Progress" : "Completed"}`}
                    >
                      {item.status}
                    </button>
                  )}
                </div>
                {item.hashtags && item.hashtags.length > 0 && (
                  <div style={{
                    display: "flex",
                    gap: 8,
                    flexWrap: "wrap",
                    marginBottom: 16
                  }}>
                    {item.hashtags.map((tag) => (
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
                )}
                {item.size && (
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontWeight: 500,
                    color: "#adb2c0",
                    fontSize: "1.01rem"
                  }}>
                    <span>{new Date(item.date).toLocaleDateString()}</span>
                    <span>{item.size}</span>
                  </div>
                )}
              </>
            ) : (
              // Non-image file display
              <div>
                <div style={{ fontSize: "2rem", marginBottom: 12, color: "#0f172a", display: 'flex', alignItems: 'center' }}>
                  {(() => {
                    const key = (item.iconKey || '').toLowerCase();
                    if (key.includes('image')) return <FiImage />;
                    if (key.includes('video')) return <FiVideo />;
                    if (key.includes('text') || key.includes('document') || key.includes('content')) return <FiFileText />;
                    return <FiPenTool />;
                  })()}
                </div>
                <div style={{ fontWeight: 600, fontSize: "1.05rem", color: "#181d3a", marginBottom: 6 }}>
                  {item.title}
                </div>
                <div style={{ color: "#757891", fontSize: "0.95rem" }}>
                  Generated file
                </div>
              </div>
            )}
          </div>
        );
        })}
      </div>
      )}

      {/* Image Preview Modal */}
      {preview && preview.list && preview.list.length > 0 && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setPreview(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 16,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              display: 'flex',
              maxWidth: '95vw',
              maxHeight: '90vh',
              borderRadius: 12,
              overflow: 'hidden',
              background: '#fff',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            }}
          >
            {/* Left side - Image */}
            <div
              style={{
                position: 'relative',
                flex: '1 1 60%',
                background: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                minWidth: 0,
                padding: 0,
                margin: 0,
              }}
            >
              <img
                src={preview.list[preview.index]?.url}
                alt="Preview"
                style={{ 
                  display: 'block', 
                  maxWidth: '100%', 
                  maxHeight: '90vh', 
                  objectFit: 'contain',
                  width: 'auto',
                  height: 'auto',
                  margin: 0,
                  padding: 0,
                }}
                onWheel={(e) => {
                  if (e.deltaY > 0) {
                    setPreview((p) => ({ ...p, index: (p.index + 1) % p.list.length }));
                  } else if (e.deltaY < 0) {
                    setPreview((p) => ({ ...p, index: (p.index - 1 + p.list.length) % p.list.length }));
                  }
                }}
              />
              <button
                onClick={() => setPreview((p) => ({ ...p, index: (p.index - 1 + p.list.length) % p.list.length }))}
                aria-label="Previous"
                style={{
                  position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)',
                  width: 40, height: 40, borderRadius: 20, border: 'none', background: 'rgba(255,255,255,0.9)', cursor: 'pointer',
                  fontSize: 20, fontWeight: 700, zIndex: 10
                }}
              >
                ‹
              </button>
              <button
                onClick={() => setPreview((p) => ({ ...p, index: (p.index + 1) % p.list.length }))}
                aria-label="Next"
                style={{
                  position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                  width: 40, height: 40, borderRadius: 20, border: 'none', background: 'rgba(255,255,255,0.9)', cursor: 'pointer',
                  fontSize: 20, fontWeight: 700, zIndex: 10
                }}
              >
                ›
              </button>
            </div>

            {/* Right side - AI Editing Options */}
            <div
              style={{
                flex: '1 1 40%',
                background: '#fff',
                padding: '24px',
                overflowY: 'auto',
                maxHeight: '90vh',
                minWidth: '320px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
              className="custom-scrollbar"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: '#1f1b2d' }}>AI Editing Tools</h3>
                <button
                  onClick={() => setPreview(null)}
                  aria-label="Close"
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    border: 'none',
                    background: '#f5f5f5',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '18px',
                    color: '#666',
                  }}
                >
                  ×
                </button>
              </div>

              {/* AI Background Removal */}
              <div
                style={{
                  border: '1px solid #e0e0e0',
                  borderRadius: '12px',
                  padding: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#8a5bff';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(138, 91, 255, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e0e0e0';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#1f1b2d' }}>AI Background Removal</h4>
                      <span style={{ 
                        padding: '2px 8px', 
                        borderRadius: '12px', 
                        fontSize: '0.75rem', 
                        fontWeight: 600, 
                        background: '#10b981',
                        color: '#fff'
                      }}>Popular</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#6f6b80', lineHeight: 1.5 }}>
                      Remove backgrounds instantly with AI precision
                    </p>
                  </div>
                </div>
                <button
                  style={{
                    marginTop: '12px',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: '1px solid #8a5bff',
                    background: 'transparent',
                    color: '#8a5bff',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#8a5bff';
                    e.currentTarget.style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#8a5bff';
                  }}
                >
                  Try Now
                </button>
              </div>

              {/* Smart Enhance */}
              <div
                style={{
                  border: '1px solid #e0e0e0',
                  borderRadius: '12px',
                  padding: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#8a5bff';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(138, 91, 255, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e0e0e0';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#1f1b2d' }}>Smart Enhance</h4>
                      <span style={{ 
                        padding: '2px 8px', 
                        borderRadius: '12px', 
                        fontSize: '0.75rem', 
                        fontWeight: 600, 
                        background: '#3b82f6',
                        color: '#fff'
                      }}>New</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#6f6b80', lineHeight: 1.5 }}>
                      Automatically improve image quality and lighting
                    </p>
                  </div>
                </div>
                <button
                  style={{
                    marginTop: '12px',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: '1px solid #8a5bff',
                    background: 'transparent',
                    color: '#8a5bff',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#8a5bff';
                    e.currentTarget.style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#8a5bff';
                  }}
                >
                  Try Now
                </button>
              </div>

              {/* Color Grading */}
              <div
                style={{
                  border: '1px solid #e0e0e0',
                  borderRadius: '12px',
                  padding: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#8a5bff';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(138, 91, 255, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e0e0e0';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#1f1b2d' }}>Color Grading</h4>
                      <span style={{ 
                        padding: '2px 8px', 
                        borderRadius: '12px', 
                        fontSize: '0.75rem', 
                        fontWeight: 600, 
                        background: '#f59e0b',
                        color: '#fff'
                      }}>Beta</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#6f6b80', lineHeight: 1.5 }}>
                      Professional color correction and styling
                    </p>
                  </div>
                </div>
                <button
                  style={{
                    marginTop: '12px',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: '1px solid #8a5bff',
                    background: 'transparent',
                    color: '#8a5bff',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#8a5bff';
                    e.currentTarget.style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#8a5bff';
                  }}
                >
                  Try Now
                </button>
              </div>

              {/* Smart Crop */}
              <div
                style={{
                  border: '1px solid #e0e0e0',
                  borderRadius: '12px',
                  padding: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#8a5bff';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(138, 91, 255, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e0e0e0';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#1f1b2d' }}>Smart Crop</h4>
                      <span style={{ 
                        padding: '2px 8px', 
                        borderRadius: '12px', 
                        fontSize: '0.75rem', 
                        fontWeight: 600, 
                        background: '#8a5bff',
                        color: '#fff'
                      }}>Pro</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#6f6b80', lineHeight: 1.5 }}>
                      AI-powered cropping for perfect composition
                    </p>
                  </div>
                </div>
                <button
                  style={{
                    marginTop: '12px',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: '1px solid #8a5bff',
                    background: 'transparent',
                    color: '#8a5bff',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#8a5bff';
                    e.currentTarget.style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#8a5bff';
                  }}
                >
                  Try Now
                </button>
              </div>

              {/* Style Transfer */}
              <div
                style={{
                  border: '1px solid #e0e0e0',
                  borderRadius: '12px',
                  padding: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#8a5bff';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(138, 91, 255, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e0e0e0';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#1f1b2d' }}>Style Transfer</h4>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#6f6b80', lineHeight: 1.5 }}>
                      Apply artistic styles using AI
                    </p>
                  </div>
                </div>
                <button
                  style={{
                    marginTop: '12px',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: '1px solid #8a5bff',
                    background: 'transparent',
                    color: '#8a5bff',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#8a5bff';
                    e.currentTarget.style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#8a5bff';
                  }}
                >
                  Try Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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

export default AllProjects;

