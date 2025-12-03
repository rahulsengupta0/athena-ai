import React, { useState, useEffect } from "react";
import { FiSearch, FiGrid, FiList } from "react-icons/fi";
import api from "../services/api";

const templateCategories = [
  "All Templates",
  "Social Media",
  "Marketing",
  "Business",
  "Education",
  "Design"
];

export const Templates = () => {
  const [selectedCategory, setSelectedCategory] = useState("All Templates");
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"
  const [searchQuery, setSearchQuery] = useState("");
  const [remoteTemplates, setRemoteTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [selectedTemplateData, setSelectedTemplateData] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState("");

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await api.getTemplates();
        const mapped = (Array.isArray(data) ? data : []).map((t, index) => ({
          id: t.id || `remote-${index}`,
          name: t.name || "Custom Template",
          category: t.category || "Business",
          description:
            t.description ||
            "Custom business promotional template created in Template Creator.",
          thumbnailUrl: t.thumbnailUrl || t.thumbnail || "",
          jsonUrl: t.jsonUrl || "",
        }));
        setRemoteTemplates(mapped);
        if (mapped.length > 0) {
          setSelectedTemplateId(mapped[0].id);
        }
      } catch (err) {
        console.error("Failed to load templates", err);
        setError("Could not load created templates. They will be hidden for now.");
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  // Load full template JSON for preview when selection changes
  useEffect(() => {
    const selected = remoteTemplates.find((t) => t.id === selectedTemplateId);
    if (!selected || !selected.jsonUrl) {
      setSelectedTemplateData(null);
      return;
    }

    const loadTemplate = async () => {
      try {
        setPreviewLoading(true);
        setPreviewError("");
        const res = await fetch(selected.jsonUrl);
        const json = await res.json();
        setSelectedTemplateData(json);
      } catch (err) {
        console.error("Failed to load template JSON", err);
        setPreviewError("Could not load full template preview.");
        setSelectedTemplateData(null);
      } finally {
        setPreviewLoading(false);
      }
    };

    loadTemplate();
  }, [selectedTemplateId, remoteTemplates]);

  const filteredTemplates = remoteTemplates.filter(template => {
    const matchesCategory = selectedCategory === "All Templates" || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{
      width: "100%",
      maxWidth: 1320,
      margin: "0 auto", 
      padding: "28px 24px 20px 24px"
    }}>
      {/* Header */}
      <div style={{ marginBottom: 30 }}>
        <h1 style={{ fontSize: "2.08rem", fontWeight: 800, color: "#21222b", marginBottom: 8, letterSpacing: "-0.02em" }}>
          Templates
        </h1>
        <p style={{ fontSize: "1.14rem", fontWeight: 500, color: "#898a98", marginTop: 0 }}>
          Browse and use pre-designed templates for your projects
        </p>
      </div>

      {/* Search and View Toggle */}
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
          maxWidth: "90%",
          flex: 1
        }}>
          <FiSearch style={{ position: "absolute", top: 14, left: 18, color: "#b3b7cd", fontSize: 20 }} />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => setViewMode("grid")}
            style={{
              background: viewMode === "grid" ? "#8b5cf6" : "#fff",
              color: viewMode === "grid" ? "#fff" : "#6d6f80",
              border: "1.5px solid #eeeff7",
              padding: "8px 16px",
              borderRadius: "12px",
              fontSize: "1rem",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            <FiGrid size={18} />
            Grid
          </button>
          <button
            onClick={() => setViewMode("list")}
            style={{
              background: viewMode === "list" ? "#8b5cf6" : "#fff",
              color: viewMode === "list" ? "#fff" : "#6d6f80",
              border: "1.5px solid #eeeff7",
              padding: "8px 16px",
              borderRadius: "12px",
              fontSize: "1rem",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            <FiList size={18} />
            List
          </button>
        </div>
      </div>

      {/* Category Filters */}
      <div style={{
        display: "flex",
        gap: 12,
        marginBottom: 24,
        flexWrap: "wrap",
        overflowX: "auto",
        paddingBottom: 8
      }}>
        {templateCategories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            style={{
              background: selectedCategory === category ? "#8b5cf6" : "#fff",
              color: selectedCategory === category ? "#fff" : "#6d6f80",
              border: "1.5px solid #eeeff7",
              padding: "8px 20px",
              borderRadius: "12px",
              fontSize: "0.95rem",
              fontWeight: selectedCategory === category ? 700 : 600,
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "all 0.2s",
              boxShadow: selectedCategory === category ? "0 2px 8px rgba(139, 92, 246, 0.3)" : "none"
            }}
          >
            {category}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
        {/* Templates list / thumbnails */}
        <div style={{ flex: 2 }}>
          {loading && (
            <div style={{ marginBottom: 16, color: "#64748b", fontSize: "0.95rem" }}>
              Loading created templates...
            </div>
          )}
          {error && (
            <div style={{ marginBottom: 16, color: "#ef4444", fontSize: "0.95rem" }}>
              {error}
            </div>
          )}
          {filteredTemplates.length === 0 ? (
            <div style={{
              textAlign: "center",
              padding: "60px 20px",
              background: "#fafbfc",
              borderRadius: 20,
              border: "1px solid #e2e8f0"
            }}>
              <div style={{ fontSize: "3rem", marginBottom: 16 }}>🔍</div>
              <div style={{ fontSize: "1.2rem", fontWeight: 600, color: "#0f172a", marginBottom: 8 }}>
                No templates found
              </div>
              <div style={{ color: "#64748b", fontSize: "0.95rem" }}>
                Try adjusting your search or filter criteria
              </div>
            </div>
          ) : viewMode === "grid" ? (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 20
            }}>
              {filteredTemplates.map((template) => {
                const isSelected = template.id === selectedTemplateId;
                return (
                  <div
                    key={template.id}
                    onClick={() => setSelectedTemplateId(template.id)}
                    style={{
                      background: "linear-gradient(to bottom, #ffffff 0%, #fafbfc 100%)",
                      border: "1.5px solid " + (isSelected ? "#8b5cf6" : "#e2e8f0"),
                      borderRadius: 20,
                      padding: 18,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      boxShadow: isSelected
                        ? "0 8px 24px rgba(139, 92, 246, 0.25)"
                        : "0 2px 8px rgba(15, 23, 42, 0.04)",
                    }}
                  >
                    <div style={{
                      marginBottom: 12,
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)",
                      borderRadius: 12,
                      border: "1px solid #e2e8f0",
                      overflow: "hidden"
                    }}>
                      {template.thumbnailUrl ? (
                        <img
                          src={template.thumbnailUrl}
                          alt={template.name}
                          style={{
                            maxWidth: "100%",
                            maxHeight: 120,
                            objectFit: "contain",
                            display: "block"
                          }}
                        />
                      ) : (
                        <span style={{ fontSize: "3rem" }}>🎨</span>
                      )}
                    </div>
                    <div style={{
                      fontWeight: 700,
                      fontSize: "1.02rem",
                      color: "#0f172a",
                      marginBottom: 4,
                      textAlign: "left"
                    }}>
                      {template.name}
                    </div>
                    <div style={{
                      color: "#64748b",
                      fontSize: "0.9rem",
                      marginBottom: 8,
                      minHeight: 32
                    }}>
                      {template.description}
                    </div>
                    <span style={{
                      background: "#f1f5f9",
                      color: "#64748b",
                      fontWeight: 600,
                      borderRadius: 8,
                      fontSize: "0.8rem",
                      padding: "4px 10px"
                    }}>
                      {template.category}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: 12
            }}>
              {filteredTemplates.map((template) => {
                const isSelected = template.id === selectedTemplateId;
                return (
                  <div
                    key={template.id}
                    onClick={() => setSelectedTemplateId(template.id)}
                    style={{
                      background: "#fff",
                      border: "1.5px solid " + (isSelected ? "#8b5cf6" : "#e2e8f0"),
                      borderRadius: 16,
                      padding: 16,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      transition: "all 0.2s"
                    }}
                  >
                    <div style={{
                      width: 80,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)",
                      borderRadius: 12,
                      border: "1px solid #e2e8f0",
                      flexShrink: 0,
                      overflow: "hidden"
                    }}>
                      {template.thumbnailUrl ? (
                        <img
                          src={template.thumbnailUrl}
                          alt={template.name}
                          style={{
                            maxWidth: "100%",
                            maxHeight: 80,
                            objectFit: "contain",
                            display: "block"
                          }}
                        />
                      ) : (
                        <span style={{ fontSize: "2.2rem" }}>🎨</span>
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontWeight: 700,
                        fontSize: "1.02rem",
                        color: "#0f172a",
                        marginBottom: 4
                      }}>
                        {template.name}
                      </div>
                      <div style={{
                        color: "#64748b",
                        fontSize: "0.9rem",
                        marginBottom: 4
                      }}>
                        {template.description}
                      </div>
                      <span style={{
                        background: "#f1f5f9",
                        color: "#64748b",
                        fontWeight: 600,
                        borderRadius: 8,
                        fontSize: "0.8rem",
                        padding: "3px 9px"
                      }}>
                        {template.category}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Full template preview */}
        <div style={{
          flex: 1.3,
          minWidth: 320,
          background: "#ffffff",
          borderRadius: 18,
          border: "1px solid #e2e8f0",
          padding: 18,
          boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
          position: "sticky",
          top: 80
        }}>
          <h3 style={{
            fontSize: "1.06rem",
            fontWeight: 700,
            color: "#0f172a",
            margin: "0 0 8px 0"
          }}>
            Template preview
          </h3>
          <p style={{
            fontSize: "0.86rem",
            color: "#6b7280",
            margin: "0 0 12px 0"
          }}>
            Thumbnail on top, full created template below.
          </p>

          {previewLoading && (
            <div style={{ fontSize: "0.9rem", color: "#64748b", marginBottom: 8 }}>
              Loading full template...
            </div>
          )}
          {previewError && (
            <div style={{ fontSize: "0.9rem", color: "#ef4444", marginBottom: 8 }}>
              {previewError}
            </div>
          )}

          {selectedTemplateId && (
            <>
              {/* Small thumbnail */}
              <div style={{
                marginBottom: 12,
                display: "flex",
                flexDirection: "column",
                gap: 6
              }}>
                <span style={{ fontSize: "0.8rem", color: "#6b7280", fontWeight: 600 }}>
                  Thumbnail
                </span>
                <div style={{
                  width: "100%",
                  maxHeight: 120,
                  borderRadius: 10,
                  overflow: "hidden",
                  border: "1px solid #e5e7eb",
                  background: "#f9fafb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  {(() => {
                    const t = remoteTemplates.find(rt => rt.id === selectedTemplateId);
                    if (!t || !t.thumbnailUrl) return <span style={{ fontSize: "2rem" }}>🎨</span>;
                    return (
                      <img
                        src={t.thumbnailUrl}
                        alt={t.name}
                        style={{
                          maxWidth: "100%",
                          maxHeight: 120,
                          objectFit: "contain"
                        }}
                      />
                    );
                  })()}
                </div>
              </div>

              {/* Full created template canvas preview */}
              <div>
                <span style={{ fontSize: "0.8rem", color: "#6b7280", fontWeight: 600 }}>
                  Created template
                </span>
                <div style={{
                  marginTop: 8,
                  padding: 10,
                  borderRadius: 12,
                  background: "#f9fafb",
                  border: "1px solid #e5e7eb",
                  display: "flex",
                  justifyContent: "center"
                }}>
                  {selectedTemplateData && selectedTemplateData.canvas ? (() => {
                    const { width, height, backgroundColor } = selectedTemplateData.canvas;
                    const elements = Array.isArray(selectedTemplateData.elements)
                      ? selectedTemplateData.elements
                      : [];
                    const maxPreview = 320;
                    const scale = Math.min(
                      maxPreview / width || 1,
                      maxPreview / height || 1
                    );
                    const scaledWidth = width * scale;
                    const scaledHeight = height * scale;

                    return (
                      <div
                        style={{
                          position: "relative",
                          width: scaledWidth,
                          height: scaledHeight,
                          backgroundColor: backgroundColor || "#ffffff",
                          overflow: "hidden",
                          borderRadius: 10,
                          boxShadow: "0 4px 12px rgba(15, 23, 42, 0.18)"
                        }}
                      >
                        {elements.map((el, idx) => {
                          // Background image element
                          if (el.type === "image" && el.name === "Background") {
                            return (
                              <img
                                key={`bg-${idx}`}
                                src={el.src}
                                alt="Background"
                                style={{
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover"
                                }}
                              />
                            );
                          }

                          const leftPercent = (el.x / width) * 100;
                          const topPercent = (el.y / height) * 100;

                          if (el.type === "text") {
                            return (
                              <div
                                key={`text-${idx}`}
                                style={{
                                  position: "absolute",
                                  left: `${leftPercent}%`,
                                  top: `${topPercent}%`,
                                  transform: "translate(-50%, -50%)",
                                  color: el.color,
                                  fontSize: `${(el.fontSize || 16) * scale}px`,
                                  fontWeight: el.fontWeight || 400,
                                  textAlign: el.textAlign || "center",
                                  opacity: el.opacity ?? 1,
                                  whiteSpace: "pre-wrap"
                                }}
                              >
                                {el.content}
                              </div>
                            );
                          }

                          if (el.type === "image") {
                            const imgWidth = (el.width || 100) * scale;
                            const imgHeight = (el.height || 100) * scale;
                            return (
                              <div
                                key={`img-${idx}`}
                                style={{
                                  position: "absolute",
                                  left: `${leftPercent}%`,
                                  top: `${topPercent}%`,
                                  width: imgWidth,
                                  height: imgHeight,
                                  transform: "translate(-50%, -50%)",
                                  opacity: el.opacity ?? 1
                                }}
                              >
                                <img
                                  src={el.src}
                                  alt={el.name || "Layer"}
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover"
                                  }}
                                />
                              </div>
                            );
                          }

                          return null;
                        })}
                      </div>
                    );
                  })() : (
                    <div style={{ fontSize: "0.9rem", color: "#9ca3af" }}>
                      Select a template to see its full design preview.
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {!selectedTemplateId && (
            <div style={{ fontSize: "0.9rem", color: "#9ca3af", marginTop: 8 }}>
              Select a template on the left to see its thumbnail and full design.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Templates;

