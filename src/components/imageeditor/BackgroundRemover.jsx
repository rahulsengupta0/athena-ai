import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

function BackgroundRemover() {
  const location = useLocation();
  const passedImageUrl = location.state?.imageUrl || null;

  const [original, setOriginal] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");

  // If an image URL is passed from Recents, auto-load it as the original preview
  useEffect(() => {
    if (!passedImageUrl || original) return;
    setOriginal(passedImageUrl);
    setFileName("Image from Recents");
    setResult(null);
  }, [passedImageUrl, original]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setOriginal(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    const file = e.target.file.files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:8000/remove-bg/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to process image");

      const blob = await response.blob();
      setResult(URL.createObjectURL(blob));
    } catch (err) {
      alert("Background removal failed. Please try again.");
    }
    setLoading(false);
  };

  const handleReset = () => {
    setOriginal(null);
    setResult(null);
    setFileName("");
  };

  return (
    <div style={{
      maxWidth: 600,
      margin: "2rem auto",
      background: "white",
      borderRadius: 20,
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
      padding: "2.5rem",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
    }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h1 style={{
          margin: "0 0 0.5rem 0",
          fontSize: "2rem",
          fontWeight: "700",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}>
          AI Background Remover
        </h1>
        <p style={{
          color: "#6b7280",
          margin: 0,
          fontSize: "1rem"
        }}>
          Upload an image and remove the background instantly
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
        <div style={{
          border: "2px dashed #d1d5db",
          borderRadius: 12,
          padding: "2rem",
          textAlign: "center",
          marginBottom: "1.5rem",
          backgroundColor: "#fafafa",
          transition: "all 0.3s ease"
        }}>
          <input
            type="file"
            name="file"
            id="file"
            accept="image/*"
            onChange={handleFileChange}
            required
            style={{ display: "none" }}
          />
          <label htmlFor="file" style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            cursor: "pointer",
            color: "#6b7280"
          }}>
            <div style={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              backgroundColor: "#f3f4f6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "1rem"
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="#9ca3af" strokeWidth="2"/>
                <path d="M14 2V8H20" stroke="#9ca3af" strokeWidth="2"/>
                <path d="M16 13H8" stroke="#9ca3af" strokeWidth="2"/>
                <path d="M16 17H8" stroke="#9ca3af" strokeWidth="2"/>
                <path d="M10 9H9H8" stroke="#9ca3af" strokeWidth="2"/>
              </svg>
            </div>
            <span style={{ fontWeight: "600", marginBottom: "0.5rem" }}>
              {fileName ? fileName : "Choose an image"}
            </span>
            <span style={{ fontSize: "0.875rem" }}>
              {fileName ? "Click to change file" : "PNG, JPG, JPEG up to 10MB"}
            </span>
          </label>
        </div>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          <button
            type="submit"
            disabled={loading || !original}
            style={{
              padding: "0.75rem 2rem",
              backgroundColor: loading ? "#9ca3af" : "#4f46e5",
              color: "white",
              border: "none",
              borderRadius: 8,
              fontWeight: "600",
              fontSize: "1rem",
              cursor: loading || !original ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
              opacity: loading || !original ? 0.6 : 1,
              minWidth: 160
            }}
            onMouseOver={(e) => {
              if (!loading && original) {
                e.target.style.backgroundColor = "#4338ca";
              }
            }}
            onMouseOut={(e) => {
              if (!loading && original) {
                e.target.style.backgroundColor = "#4f46e5";
              }
            }}
          >
            {loading ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{
                  width: 16,
                  height: 16,
                  border: "2px solid transparent",
                  borderTop: "2px solid white",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                  marginRight: "0.5rem"
                }}></div>
                Processing...
              </div>
            ) : (
              "Remove Background"
            )}
          </button>

          {original && (
            <button
              type="button"
              onClick={handleReset}
              style={{
                padding: "0.75rem 2rem",
                backgroundColor: "transparent",
                color: "#6b7280",
                border: "1px solid #d1d5db",
                borderRadius: 8,
                fontWeight: "600",
                fontSize: "1rem",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = "#f3f4f6";
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = "transparent";
              }}
            >
              Reset
            </button>
          )}
        </div>
      </form>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        {original && (
          <div style={{
            backgroundColor: "#f8fafc",
            borderRadius: 12,
            padding: "1.5rem",
            border: "1px solid #e2e8f0"
          }}>
            <h3 style={{
              margin: "0 0 1rem 0",
              fontSize: "1rem",
              fontWeight: "600",
              color: "#374151"
            }}>
              Original Image
            </h3>
            <div style={{
              borderRadius: 8,
              overflow: "hidden",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
            }}>
              <img
                src={original}
                alt="original"
                style={{
                  width: "100%",
                  height: "auto",
                  display: "block"
                }}
              />
            </div>
          </div>
        )}

        {result && (
          <div style={{
            backgroundColor: "#f0fdf4",
            borderRadius: 12,
            padding: "1.5rem",
            border: "1px solid #bbf7d0"
          }}>
            <h3 style={{
              margin: "0 0 1rem 0",
              fontSize: "1rem",
              fontWeight: "600",
              color: "#065f46"
            }}>
              Background Removed
            </h3>
            <div style={{
              borderRadius: 8,
              overflow: "hidden",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              marginBottom: "1rem"
            }}>
              <img
                src={result}
                alt="bg-removed"
                style={{
                  width: "100%",
                  height: "auto",
                  display: "block"
                }}
              />
            </div>
            <a
              href={result}
              download="bg-removed.png"
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "0.5rem 1rem",
                backgroundColor: "#10b981",
                color: "white",
                textDecoration: "none",
                borderRadius: 6,
                fontWeight: "500",
                fontSize: "0.875rem",
                transition: "background-color 0.2s ease"
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = "#059669";
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = "#10b981";
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "0.5rem" }}>
                <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="white" strokeWidth="2"/>
                <path d="M7 10L12 15L17 10" stroke="white" strokeWidth="2"/>
                <path d="M12 15V3" stroke="white" strokeWidth="2"/>
              </svg>
              Download Result
            </a>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default BackgroundRemover;