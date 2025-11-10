import React, { useState } from "react";
import { FiSearch, FiGrid, FiList } from "react-icons/fi";

const templateCategories = [
  "All Templates",
  "Social Media",
  "Marketing",
  "Business",
  "Education",
  "Design"
];

const templates = [
  {
    id: 1,
    name: "Instagram Post",
    category: "Social Media",
    thumbnail: "📱",
    description: "Perfect for Instagram posts and stories"
  },
  {
    id: 2,
    name: "Facebook Cover",
    category: "Social Media",
    thumbnail: "📘",
    description: "Eye-catching Facebook cover designs"
  },
  {
    id: 3,
    name: "YouTube Thumbnail",
    category: "Marketing",
    thumbnail: "📺",
    description: "Engaging YouTube thumbnail templates"
  },
  {
    id: 4,
    name: "Business Card",
    category: "Business",
    thumbnail: "💼",
    description: "Professional business card designs"
  },
  {
    id: 5,
    name: "Presentation",
    category: "Business",
    thumbnail: "📊",
    description: "Modern presentation templates"
  },
  {
    id: 6,
    name: "Flyer",
    category: "Marketing",
    thumbnail: "📄",
    description: "Creative flyer templates"
  },
  {
    id: 7,
    name: "Poster",
    category: "Marketing",
    thumbnail: "🖼️",
    description: "Stunning poster designs"
  },
  {
    id: 8,
    name: "Certificate",
    category: "Education",
    thumbnail: "🎓",
    description: "Elegant certificate templates"
  },
  {
    id: 9,
    name: "Logo",
    category: "Design",
    thumbnail: "🎨",
    description: "Professional logo templates"
  }
];

export const Templates = () => {
  const [selectedCategory, setSelectedCategory] = useState("All Templates");
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTemplates = templates.filter(template => {
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
        marginBottom: 30,
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

      {/* Templates Grid/List */}
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
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 24
        }}>
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              onClick={() => {
                // Navigate to template editor or detail page
                console.log("Open template:", template.name);
              }}
              style={{
                background: "linear-gradient(to bottom, #ffffff 0%, #fafbfc 100%)",
                border: "1.5px solid #e2e8f0",
                borderRadius: 20,
                padding: 24,
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: "0 2px 8px rgba(15, 23, 42, 0.04)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 12px 32px rgba(139, 92, 246, 0.15)";
                e.currentTarget.style.borderColor = "#8b5cf6";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(15, 23, 42, 0.04)";
                e.currentTarget.style.borderColor = "#e2e8f0";
              }}
            >
              <div style={{
                fontSize: "4rem",
                textAlign: "center",
                marginBottom: 16,
                height: 120,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)",
                borderRadius: 12,
                border: "1px solid #e2e8f0"
              }}>
                {template.thumbnail}
              </div>
              <div style={{
                fontWeight: 700,
                fontSize: "1.2rem",
                color: "#0f172a",
                marginBottom: 8,
                textAlign: "center"
              }}>
                {template.name}
              </div>
              <div style={{
                color: "#64748b",
                fontSize: "0.95rem",
                marginBottom: 12,
                textAlign: "center",
                minHeight: 40
              }}>
                {template.description}
              </div>
              <div style={{
                display: "flex",
                justifyContent: "center",
                marginTop: 16
              }}>
                <span style={{
                  background: "#f1f5f9",
                  color: "#64748b",
                  fontWeight: 600,
                  borderRadius: 8,
                  fontSize: "0.85rem",
                  padding: "6px 16px"
                }}>
                  {template.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: 16
        }}>
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              onClick={() => {
                console.log("Open template:", template.name);
              }}
              style={{
                background: "#fff",
                border: "1.5px solid #e2e8f0",
                borderRadius: 16,
                padding: 20,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 20,
                transition: "all 0.3s"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateX(4px)";
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(139, 92, 246, 0.1)";
                e.currentTarget.style.borderColor = "#8b5cf6";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateX(0)";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.borderColor = "#e2e8f0";
              }}
            >
              <div style={{
                fontSize: "3rem",
                width: 80,
                height: 80,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)",
                borderRadius: 12,
                border: "1px solid #e2e8f0",
                flexShrink: 0
              }}>
                {template.thumbnail}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontWeight: 700,
                  fontSize: "1.2rem",
                  color: "#0f172a",
                  marginBottom: 6
                }}>
                  {template.name}
                </div>
                <div style={{
                  color: "#64748b",
                  fontSize: "0.95rem",
                  marginBottom: 8
                }}>
                  {template.description}
                </div>
                <span style={{
                  background: "#f1f5f9",
                  color: "#64748b",
                  fontWeight: 600,
                  borderRadius: 8,
                  fontSize: "0.85rem",
                  padding: "4px 12px"
                }}>
                  {template.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Templates;

