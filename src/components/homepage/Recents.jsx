import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { FiImage, FiFileText, FiVideo, FiPenTool, FiEye, FiDownload, FiTrash } from "react-icons/fi";

const Recents = () => {
  const navigate = useNavigate();
  const [recentProjects, setRecentProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [isPhone, setIsPhone] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);
  const [preview, setPreview] = useState(null); // { list: filesOnly[], index: number }
  const [isSmallMobile, setIsSmallMobile] = useState(false);

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

  // Close on Esc and navigate with arrow keys when preview is open
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

  useEffect(() => {
    const fetchRecent = async () => {
      setLoadingProjects(true);
      try {
        const [projects, files] = await Promise.all([
          api.getProjects().catch(() => []),
          api.getUserFiles().catch(() => []),
        ]);

        const normalizedProjects = (projects || []).map((p) => ({
          type: 'project',
          id: p._id,
          title: p.title,
          desc: p.desc,
          date: p.createdAt || p.date,
          iconKey: p.icon || p.category,
        }));

        const normalizedFiles = (files || []).map((f) => ({
          type: 'file',
          id: f._id,
          title: f.key?.split('/').pop() || 'Uploaded Asset',
          desc: f.url,
          date: f.uploadedAt,
          url: f.url,
          iconKey: 'image',
        }));

        const combined = [...normalizedProjects, ...normalizedFiles]
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 6);

        setRecentProjects(combined);
      } catch (error) {
        console.error('Error fetching recents:', error);
        setRecentProjects([]);
      } finally {
        setLoadingProjects(false);
      }
    };
    fetchRecent();
  }, []);

  return (
    <div
      style={{
        width: "100%",
        padding: isSmallMobile ? "16px 0" : isPhone ? "24px 0" : "32px 0",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: isSmallMobile ? "0 14px" : isPhone ? "0 22px" : "0 24px",
        }}
      >
        <h2
          style={{
            fontSize: isSmallMobile ? "1.3rem" : isPhone ? "1.5rem" : "1.8rem",
            fontWeight: 700,
            color: "#24243b",
            margin: 0,
            marginBottom: isSmallMobile ? 16 : isPhone ? 18 : 20,
          }}
        >
          Recents
        </h2>
        {loadingProjects ? (
          <div
            style={{
              background: "#fff",
              borderRadius: isSmallMobile ? "20px" : "24px",
              padding: isSmallMobile ? "40px 20px" : isPhone ? "50px 24px" : "60px 28px",
              textAlign: "center",
              color: "#757891",
              fontSize: "1.1rem",
            }}
          >
            Loading...
          </div>
        ) : recentProjects.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isSmallMobile ? "repeat(2, 1fr)" : isPhone ? "repeat(3, 1fr)" : "repeat(6, 1fr)",
              gap: isSmallMobile ? 10 : isPhone ? 12 : 14,
            }}
          >
            {recentProjects.map((project, index) => (
              <div
                key={project._id || index}
                onClick={() => {
                  if (project.type === 'file' && project.url) {
                    window.open(project.url, '_blank');
                  } else {
                    navigate(`/projects`);
                  }
                }}
                style={{
                  background: (project.type === 'file' && /\.(png|jpe?g|webp|gif|bmp|svg)(\?.*)?$/i.test(project.url || '')) ? 'transparent' : "#fff",
                  borderRadius: isSmallMobile ? "12px" : "14px",
                  padding: (project.type === 'file' && /\.(png|jpe?g|webp|gif|bmp|svg)(\?.*)?$/i.test(project.url || '')) ? 0 : (isSmallMobile ? "16px" : isPhone ? "20px" : "24px"),
                  border: "none",
                  cursor: "pointer",
                  transition: "transform 0.15s, box-shadow 0.15s",
                  boxShadow: (project.type === 'file' && /\.(png|jpe?g|webp|gif|bmp|svg)(\?.*)?$/i.test(project.url || '')) ? 'none' : "0 2px 12px #c9c6f211",
                }}
                onMouseEnter={(e) => {
                  if (!isSmallMobile && !isPhone) {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 4px 20px #c9c6f233";
                  }
                  setHoveredId(project.id || project._id || index);
                }}
                onMouseLeave={(e) => {
                  if (!isSmallMobile && !isPhone) {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 2px 12px #c9c6f211";
                  }
                  setHoveredId(null);
                }}
              >
                {project.type === 'file' && project.url && /\.(png|jpe?g|webp|gif|bmp|svg)(\?.*)?$/i.test(project.url) ? (
                  <div
                    style={{
                      width: '100%',
                      aspectRatio: '1 / 1',
                      borderRadius: isSmallMobile ? 12 : 12,
                      overflow: 'hidden',
                      marginBottom: 0,
                      background: 'transparent',
                      position: 'relative',
                      border: 'none',
                    }}
                  >
                    <img
                      src={project.url}
                      alt={project.title}
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
                        opacity: (hoveredId === (project.id || project._id || index)) ? 1 : 0,
                        transition: 'opacity 0.15s',
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        title="View"
                        onClick={() => {
                          const filesOnly = recentProjects.filter((p) => p.type === 'file' && /\.(png|jpe?g|webp|gif|bmp|svg)(\?.*)?$/i.test(p.url || ''));
                          const currentId = project._id || project.id || project.url;
                          const startIndex = filesOnly.findIndex((p) => (p._id || p.id || p.url) === currentId);
                          setPreview({ list: filesOnly, index: Math.max(0, startIndex) });
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
                        onClick={() => downloadImage(project.url, (project.title || 'image').replace(/\.[^/.]+$/, '') )}
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
                        onClick={async () => {
                          try {
                            const proceed = window.confirm('Are you sure you want to delete this image? This action cannot be undone.');
                            if (!proceed) return;
                            const fileId = project._id || project.id;
                            if (fileId) {
                              await api.deleteUserFile(fileId);
                              setRecentProjects((prev) => prev.filter((p) => (p._id || p.id || '') !== fileId));
                              // If deleting the currently previewed image, move or close preview
                              setPreview((prevState) => {
                                if (!prevState) return prevState;
                                const newList = prevState.list.filter((p) => (p._id || p.id || '') !== fileId);
                                if (newList.length === 0) return null;
                                const newIndex = Math.min(prevState.index, newList.length - 1);
                                return { list: newList, index: newIndex };
                              });
                            }
                          } catch (err) {
                            console.error('Delete failed', err);
                            alert('Failed to delete image');
                          }
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
                        <FiTrash color="#111827" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      fontSize: isSmallMobile ? "1.8rem" : "2rem",
                      marginBottom: isSmallMobile ? 8 : 12,
                      color: "#0f172a",
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {(() => {
                      const key = (project.iconKey || '').toLowerCase();
                      if (key.includes('image')) return <FiImage />;
                      if (key.includes('video')) return <FiVideo />;
                      if (key.includes('text') || key.includes('document') || key.includes('content')) return <FiFileText />;
                      return <FiPenTool />;
                    })()}
                  </div>
                )}
                {project.type !== 'file' && (
                  <>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: isSmallMobile ? "0.95rem" : "1.05rem",
                        color: "#181d3a",
                        marginBottom: 6,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {project.title}
                    </div>
                    <div
                      style={{
                        color: "#757891",
                        fontSize: isSmallMobile ? "0.85rem" : "0.95rem",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        lineHeight: 1.4,
                        marginBottom: 8,
                      }}
                    >
                      {project.desc}
                    </div>
                  </>
                )}
                {/* Date removed per request */}
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              background: "#fff",
              borderRadius: isSmallMobile ? "20px" : "24px",
              padding: isSmallMobile ? "40px 20px" : isPhone ? "50px 24px" : "60px 28px",
              textAlign: "center",
              color: "#757891",
              fontSize: "1.1rem",
              border: "1.5px solid #f1eeff",
            }}
          >
            No recent designs yet. Start creating to see them here!
          </div>
        )}
      </div>
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
              position: 'relative',
              maxWidth: '90vw',
              maxHeight: '90vh',
              borderRadius: 12,
              overflow: 'hidden',
              background: '#000',
            }}
          >
            <img
              src={preview.list[preview.index]?.url}
              alt="Preview"
              style={{ display: 'block', maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain' }}
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
                fontSize: 20, fontWeight: 700
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
                fontSize: 20, fontWeight: 700
              }}
            >
              ›
            </button>
            <button
              onClick={() => setPreview(null)}
              aria-label="Close"
              style={{
                position: 'absolute',
                top: 8,
                right: 8,
                width: 36,
                height: 36,
                borderRadius: 18,
                border: 'none',
                background: 'rgba(255,255,255,0.9)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recents;

