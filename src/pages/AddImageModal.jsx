import React from "react";
import { FiX, FiUpload } from "react-icons/fi";

const AddImageModal = ({
  isOpen,
  onClose,
  selectedCategory,
  onSelectCategory,
  selectedImages,
  onToggleImageSelection,
  allBrandKits,
  userFiles,
  onAddImages,
  uploading,
  currentKitFolder,
}) => {
  if (!isOpen) return null;

  const otherBrandKits = (allBrandKits || []).filter(
    (kit) => kit.kitFolder && kit.kitFolder !== currentKitFolder
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15, 23, 42, 0.6)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1200,
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(95vw, 1000px)",
          maxWidth: "1000px",
          maxHeight: "90vh",
          background: "linear-gradient(to bottom, #ffffff 0%, #fafbfc 100%)",
          borderRadius: 24,
          boxShadow: "0 25px 80px rgba(15, 23, 42, 0.3)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "24px 32px",
            borderBottom: "1px solid rgba(226, 232, 240, 0.8)",
            background:
              "linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(99, 102, 241, 0.06) 100%)",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontWeight: 700,
                color: "#0f172a",
                fontSize: "1.5rem",
                letterSpacing: "-0.02em",
              }}
            >
              Add Images to Brand Kit
            </h2>
            <p
              style={{
                margin: "4px 0 0 0",
                color: "#64748b",
                fontSize: "0.875rem",
              }}
            >
              Select images from other brand kits or your uploaded files
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "rgba(255, 255, 255, 0.8)",
              borderRadius: 12,
              padding: "10px 14px",
              cursor: "pointer",
              color: "#64748b",
              fontWeight: 600,
              fontSize: "1.1rem",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "rgba(241, 245, 249, 0.95)";
              e.target.style.color = "#1e293b";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "rgba(255, 255, 255, 0.8)";
              e.target.style.color = "#64748b";
            }}
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Category Selection */}
        <div
          style={{
            padding: "20px 32px",
            borderBottom: "1px solid rgba(226, 232, 240, 0.8)",
            background: "#ffffff",
          }}
        >
          <label
            style={{
              display: "block",
              marginBottom: 12,
              fontWeight: 600,
              color: "#0f172a",
              fontSize: "0.9375rem",
            }}
          >
            Select Category:
          </label>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {["logo", "banner", "poster", "custom"].map((category) => (
              <button
                key={category}
                onClick={() => onSelectCategory(category)}
                style={{
                  border:
                    selectedCategory === category
                      ? "2px solid #8b5cf6"
                      : "1.5px solid #e2e8f0",
                  background:
                    selectedCategory === category ? "#f4f3ff" : "#ffffff",
                  color: selectedCategory === category ? "#4c1d95" : "#475569",
                  borderRadius: 10,
                  padding: "10px 20px",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  textTransform: "capitalize",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (selectedCategory !== category) {
                    e.target.style.borderColor = "#cbd5e1";
                    e.target.style.background = "#f8fafc";
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedCategory !== category) {
                    e.target.style.borderColor = "#e2e8f0";
                    e.target.style.background = "#ffffff";
                  }
                }}
              >
                {category}
              </button>
            ))}
          </div>
          <p
            style={{
              margin: "12px 0 0 0",
              color: "#64748b",
              fontSize: "0.8125rem",
            }}
          >
            {selectedImages.length} image(s) selected
          </p>
        </div>

        {/* Content Area - Scrollable */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "24px 32px",
            background: "#fafbfc",
          }}
        >
          {/* Brand Kits Section */}
          <div style={{ marginBottom: 32 }}>
            <h3
              style={{
                margin: "0 0 16px 0",
                fontWeight: 600,
                color: "#0f172a",
                fontSize: "1.1rem",
              }}
            >
              Images from Brand Kits
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                gap: 16,
              }}
            >
              {otherBrandKits.length > 0 &&
                otherBrandKits
                  .map((kit) => {
                    const allImages = [
                      kit.files?.logo && {
                        url: kit.files.logo.url,
                        type: "logo",
                      },
                      kit.files?.banner && {
                        url: kit.files.banner.url,
                        type: "banner",
                      },
                      kit.files?.poster && {
                        url: kit.files.poster.url,
                        type: "poster",
                      },
                    ].filter(Boolean);

                    return allImages.map((img, idx) => {
                      const imageKey = `brandkit-${kit.kitFolder}-${img.url}`;
                      const isSelected = selectedImages.some(
                        (s) => s.key === imageKey
                      );
                      return (
                        <div
                          key={`${kit.kitFolder}-${idx}`}
                          onClick={() =>
                            onToggleImageSelection(
                              img.url,
                              "brandkit",
                              kit.kitFolder
                            )
                          }
                          style={{
                            aspectRatio: "1",
                            borderRadius: 12,
                            overflow: "hidden",
                            border: isSelected
                              ? "3px solid #8b5cf6"
                              : "2px solid #e2e8f0",
                            cursor: "pointer",
                            position: "relative",
                            background: "#ffffff",
                            transition: "all 0.2s",
                          }}
                          onMouseEnter={(e) => {
                            if (!isSelected) {
                              e.currentTarget.style.borderColor = "#cbd5e1";
                              e.currentTarget.style.transform = "scale(1.02)";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isSelected) {
                              e.currentTarget.style.borderColor = "#e2e8f0";
                              e.currentTarget.style.transform = "scale(1)";
                            }
                          }}
                        >
                          <img
                            src={img.url}
                            alt={img.type}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                          {isSelected && (
                            <div
                              style={{
                                position: "absolute",
                                top: 8,
                                right: 8,
                                background: "#8b5cf6",
                                borderRadius: "50%",
                                width: 24,
                                height: 24,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#ffffff",
                                fontWeight: 700,
                                fontSize: "0.75rem",
                              }}
                            >
                              ✓
                            </div>
                          )}
                          <div
                            style={{
                              position: "absolute",
                              bottom: 0,
                              left: 0,
                              right: 0,
                              background:
                                "linear-gradient(to top, rgba(0,0,0,0.6), transparent)",
                              padding: "8px",
                              color: "#ffffff",
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              textTransform: "capitalize",
                            }}
                          >
                            {img.type}
                          </div>
                        </div>
                      );
                    });
                  })
                  .flat()}
              {otherBrandKits.length === 0 && (
                <div
                  style={{
                    gridColumn: "1 / -1",
                    textAlign: "center",
                    padding: "40px 20px",
                    color: "#94a3b8",
                    fontSize: "0.9375rem",
                  }}
                >
                  No other brand kits found
                </div>
              )}
            </div>
          </div>

          {/* User Files Section */}
          <div>
            <h3
              style={{
                margin: "0 0 16px 0",
                fontWeight: 600,
                color: "#0f172a",
                fontSize: "1.1rem",
              }}
            >
              Your Uploaded Files
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                gap: 16,
              }}
            >
              {userFiles
                .filter((file) => file.url && /\.(jpg|jpeg|png|gif|webp)/i.test(file.url))
                .map((file) => {
                  const imageKey = `userfile-${file._id}-${file.url}`;
                  const isSelected = selectedImages.some((s) => s.key === imageKey);
                  return (
                    <div
                      key={file._id}
                      onClick={() => onToggleImageSelection(file.url, "userfile", file._id)}
                      style={{
                        aspectRatio: "1",
                        borderRadius: 12,
                        overflow: "hidden",
                        border: isSelected ? "3px solid #8b5cf6" : "2px solid #e2e8f0",
                        cursor: "pointer",
                        position: "relative",
                        background: "#ffffff",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = "#cbd5e1";
                          e.currentTarget.style.transform = "scale(1.02)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = "#e2e8f0";
                          e.currentTarget.style.transform = "scale(1)";
                        }
                      }}
                    >
                      <img
                        src={file.url}
                        alt="Uploaded file"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      {isSelected && (
                        <div
                          style={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            background: "#8b5cf6",
                            borderRadius: "50%",
                            width: 24,
                            height: 24,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#ffffff",
                            fontWeight: 700,
                            fontSize: "0.75rem",
                          }}
                        >
                          ✓
                        </div>
                      )}
                    </div>
                  );
                })}
              {userFiles.filter((file) => file.url && /\.(jpg|jpeg|png|gif|webp)/i.test(file.url)).length === 0 && (
                <div
                  style={{
                    gridColumn: "1 / -1",
                    textAlign: "center",
                    padding: "40px 20px",
                    color: "#94a3b8",
                    fontSize: "0.9375rem",
                  }}
                >
                  No uploaded files found
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: "20px 32px",
            borderTop: "1px solid rgba(226, 232, 240, 0.8)",
            background: "#ffffff",
            display: "flex",
            justifyContent: "flex-end",
            gap: 12,
          }}
        >
          <button
            onClick={onClose}
            disabled={uploading}
            style={{
              border: "1.5px solid #e2e8f0",
              background: "#ffffff",
              borderRadius: 12,
              padding: "12px 24px",
              cursor: uploading ? "not-allowed" : "pointer",
              color: "#475569",
              fontWeight: 600,
              fontSize: "0.9375rem",
              opacity: uploading ? 0.6 : 1,
            }}
          >
            Cancel
          </button>
          <button
            onClick={onAddImages}
            disabled={uploading || selectedImages.length === 0}
            style={{
              border: "none",
              background:
                uploading || selectedImages.length === 0
                  ? "#cbd5e1"
                  : "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 50%, #6d28d9 100%)",
              color: "#fff",
              borderRadius: 12,
              padding: "12px 24px",
              fontWeight: 600,
              fontSize: "0.9375rem",
              cursor: uploading || selectedImages.length === 0 ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              if (!uploading && selectedImages.length > 0) {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 8px 24px rgba(139, 92, 246, 0.35)";
              }
            }}
            onMouseLeave={(e) => {
              if (!uploading && selectedImages.length > 0) {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "none";
              }
            }}
          >
            {uploading ? (
              <>Uploading...</>
            ) : (
              <>
                <FiUpload size={18} />
                Add {selectedImages.length > 0 ? `${selectedImages.length} ` : ""}Image
                {selectedImages.length !== 1 ? "s" : ""}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddImageModal;

