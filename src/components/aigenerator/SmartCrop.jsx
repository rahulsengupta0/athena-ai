import React, { useRef, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  convertToPixelCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const RATIOS = [
  { label: "Freeform", value: undefined, icon: "⭕" },
  { label: "Square", value: 1, icon: "⬜" },
  { label: "16:9", value: 16 / 9, icon: "📺" },
  { label: "9:16", value: 9 / 16, icon: "📱" },
  { label: "4:5", value: 4 / 5, icon: "📷" },
  { label: "5:4", value: 5 / 4, icon: "🖼️" },
  { label: "3:2", value: 3 / 2, icon: "🎞️" },
  { label: "2:3", value: 2 / 3, icon: "📐" },
];

// CSS-in-JS styles object
const styles = {
  smartPage: {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    left: 'var(--app-sidebar-width, 48px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'stretch',
    width: 'auto',
    height: '100%',
    margin: 0,
    padding: '20px 24px',
    background:
      'radial-gradient(1400px 900px at 20% 15%, #0a0e1a 0%, #1a1f2e 40%, #0f1419 100%), ' +
      'radial-gradient(1000px 700px at 80% 85%, rgba(16,185,129,0.12) 0%, transparent 50%), ' +
      'radial-gradient(900px 600px at 20% 80%, rgba(236,72,153,0.1) 0%, transparent 50%)',
    boxSizing: 'border-box',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    overflow: 'hidden',
  },

  pageInner: {
    width: '100%',
    maxWidth: '1600px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    height: '100%',
  },

  bottomToolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '18px',
    padding: '18px 28px',
    background: 'linear-gradient(180deg, rgba(26,32,44,0.96) 0%, rgba(15,23,42,0.98) 100%)',
    borderRadius: '20px',
    border: '1px solid rgba(16,185,129,0.25)',
    boxShadow: '0 -8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(16,185,129,0.15) inset',
    backdropFilter: 'saturate(150%) blur(20px)',
    flexWrap: 'wrap',
    marginTop: 'auto',
  },

  uploadSection: {
    background:
      'radial-gradient(circle at top left, rgba(16,185,129,0.15), transparent 55%), ' +
      'linear-gradient(180deg, rgba(26,32,44,0.5) 0%, rgba(15,23,42,0.9) 100%)',
    borderRadius: '14px',
    padding: '12px 18px',
    border: '1.5px dashed rgba(16,185,129,0.4)',
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    minWidth: '220px',
  },

  uploadSectionHover: {
    borderColor: '#10b981',
    background: 'rgba(16,185,129,0.2)',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 16px rgba(16,185,129,0.3)',
  },

  uploadContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    flex: 1,
    minWidth: 0,
  },

  uploadIcon: {
    width: '36px',
    height: '36px',
    flexShrink: 0,
    background:
      'linear-gradient(135deg, rgba(16,185,129,0.6), rgba(34,211,238,0.7))',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    boxShadow: '0 2px 10px rgba(16,185,129,0.4)',
  },

  uploadTitle: {
    margin: 0,
    color: 'white',
    fontSize: '14px',
    fontWeight: 600,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    lineHeight: '1.3',
  },

  uploadSubtitle: {
    margin: 0,
    fontSize: '12px',
    opacity: 0.75,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    lineHeight: '1.3',
  },

  fileInput: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    opacity: 0,
    cursor: 'pointer'
  },

  toolbarDivider: {
    width: '1px',
    height: '32px',
    background: 'rgba(16,185,129,0.25)',
    margin: '0 6px',
  },

  ratioSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flex: 1,
    minWidth: 0,
  },

  sectionTitle: {
    color: 'rgba(209,213,219,0.95)',
    fontSize: '12px',
    fontWeight: 600,
    margin: '0 10px 0 0',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    whiteSpace: 'nowrap',
  },

  ratioGrid: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },

  ratioBtn: {
    padding: '9px 14px',
    borderRadius: '11px',
    border: '1.5px solid rgba(16,185,129,0.3)',
    background:
      'radial-gradient(circle at top, rgba(30,41,59,0.8), rgba(15,23,42,0.95))',
    color: '#e5e7eb',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
    whiteSpace: 'nowrap',
  },

  ratioBtnHover: {
    background: 'linear-gradient(180deg, rgba(16,185,129,0.25) 0%, rgba(34,211,238,0.25) 100%)',
    color: 'white',
    borderColor: 'rgba(16,185,129,0.5)',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(16,185,129,0.25)',
  },

  ratioBtnActive: {
    background: 'linear-gradient(135deg, #10b981 0%, #22d3ee 50%, #ec4899 100%)',
    color: 'white',
    borderColor: 'transparent',
    boxShadow: '0 8px 20px rgba(16,185,129,0.5), 0 0 0 1px rgba(16,185,129,0.3) inset',
    transform: 'translateY(-1px)',
  },

  smartCropBtn: {
    padding: '11px 20px',
    borderRadius: '13px',
    border: 'none',
    background: 'linear-gradient(135deg, #10b981 0%, #22d3ee 50%, #ec4899 100%)',
    color: 'white',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '9px',
    boxShadow: '0 8px 20px rgba(16,185,129,0.35), 0 0 0 1px rgba(16,185,129,0.2) inset',
    whiteSpace: 'nowrap',
  },

  smartCropBtnHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 28px rgba(16,185,129,0.45), 0 0 0 1px rgba(16,185,129,0.3) inset',
  },

  smartCropBtnDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
    transform: 'none !important'
  },

  smartCropBtnIcon: {
    fontSize: '20px'
  },

  editorToolbar: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    display: 'flex',
    gap: '10px',
    zIndex: 10,
  },

  iconBtn: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    padding: 0,
  },

  primaryBtn: {
    background: 'linear-gradient(135deg, #10b981 0%, #22d3ee 100%)',
    color: 'white',
    boxShadow: '0 8px 20px rgba(16,185,129,0.4), 0 0 0 1px rgba(16,185,129,0.2) inset',
  },

  primaryBtnHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 24px rgba(16,185,129,0.5), 0 0 0 1px rgba(16,185,129,0.3) inset',
  },

  primaryBtnDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
    transform: 'none !important'
  },

  secondaryBtn: {
    background:
      'linear-gradient(180deg, rgba(26,32,44,0.9) 0%, rgba(15,23,42,0.75) 100%)',
    color: '#d1d5db',
    border: '1.5px solid rgba(16,185,129,0.3)',
  },

  secondaryBtnHover: {
    background:
      'linear-gradient(180deg, rgba(16,185,129,0.25) 0%, rgba(34,211,238,0.35) 100%)',
    color: 'white',
    borderColor: 'rgba(16,185,129,0.5)',
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 16px rgba(16,185,129,0.25)',
  },

  editorCard: {
    position: 'relative',
    borderRadius: '20px',
    padding: '20px',
    background:
      'radial-gradient(circle at top left, rgba(16,185,129,0.15), transparent 55%), ' +
      'linear-gradient(145deg, rgba(26,32,44,0.96), rgba(15,23,42,0.98))',
    border: '1px solid rgba(16,185,129,0.3)',
    boxShadow: '0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(16,185,129,0.1) inset',
    overflow: 'hidden',
    flex: 1,
    minHeight: 0,
  },

  smartEditor: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },

  cropContainer: {
    maxWidth: '100%',
    maxHeight: '100%',
    padding: '16px',
    background:
      'radial-gradient(circle at top, rgba(26,32,44,0.96), rgba(15,23,42,0.98))',
    borderRadius: '16px',
    border: '1px solid rgba(16,185,129,0.25)',
    backdropFilter: 'blur(12px)',
  },

  cropArea: {
    maxWidth: '100%',
    maxHeight: '80vh'
  },

  cropImage: {
    maxWidth: '100%',
    maxHeight: '75vh',
    objectFit: 'contain',
    borderRadius: '12px',
    boxShadow: '0 28px 70px rgba(0, 0, 0, 0.38)'
  },

  placeholder: {
    textAlign: 'center',
    color: '#e5e7eb',
    fontSize: '16px',
    padding: '60px 40px',
    border: '1px dashed rgba(16,185,129, 0.4)',
    borderRadius: '16px',
    background:
      'radial-gradient(circle at top left, rgba(16,185,129,0.15), transparent 55%), ' +
      'linear-gradient(180deg, rgba(26,32,44,0.92) 0%, rgba(15,23,42,0.98) 100%)',
    maxWidth: '500px',
    margin: 'auto'
  },

  placeholderIcon: {
    fontSize: '48px',
    marginBottom: '16px',
    opacity: 0.5
  },

  previewSection: {
    position: 'absolute',
    bottom: '20px',
    right: '20px',
    background: 'linear-gradient(180deg, rgba(26,32,44,0.95) 0%, rgba(15,23,42,0.98) 100%)',
    backdropFilter: 'blur(12px)',
    borderRadius: '16px',
    padding: '14px',
    border: '1px solid rgba(16,185,129, 0.3)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
  },

  previewCanvas: {
    width: '120px',
    height: '120px',
    borderRadius: '10px',
    objectFit: 'cover',
    display: 'block',
    boxShadow: '0 10px 28px rgba(0,0,0,0.38)'
  }
};

function SmartCrop() {
  const location = useLocation();
  const passedImageUrl = location.state?.imageUrl || null;

  const [imgSrc, setImgSrc] = useState();
  const [aspect, setAspect] = useState();
  const [crop, setCrop] = useState();
  const [fileName, setFileName] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [hoveredUpload, setHoveredUpload] = useState(false);
  const [hoveredSmartBtn, setHoveredSmartBtn] = useState(false);
  const [hoveredPrimary, setHoveredPrimary] = useState(false);
  const [hoveredSecondary, setHoveredSecondary] = useState(false);
  const [hoveredRatio, setHoveredRatio] = useState(null);
  const [isPreviewHovered, setIsPreviewHovered] = useState(false);

  const imgRef = useRef(null);
  const canvasRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const overlayCanvasRef = useRef(null);

  // If an image URL is passed from Recents, use it as the crop source
  useEffect(() => {
    if (passedImageUrl && !imgSrc) {
      setImgSrc(passedImageUrl);
      setFileName("Image from Recents");
    }
  }, [passedImageUrl, imgSrc]);

  const onSelectFile = (e) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    setFileName(file.name);
    const reader = new FileReader();
    reader.addEventListener("load", () => setImgSrc(reader.result));
    reader.readAsDataURL(file);
  };

  const onImageLoad = (e) => {
    if (!aspect) return;
    const { naturalWidth: width, naturalHeight: height } = e.currentTarget;
    const nextCrop = centerCrop(
      makeAspectCrop({ unit: "%", width: 80 }, aspect, width, height),
      width,
      height
    );
    setCrop(nextCrop);
  };

  const handleAspectChange = (nextAspect) => {
    setAspect(nextAspect);
    const img = imgRef.current;
    if (!img || !nextAspect) {
      setCrop(undefined);
      return;
    }
    const { naturalWidth: width, naturalHeight: height } = img;
    const nextCrop = centerCrop(
      makeAspectCrop({ unit: "%", width: 80 }, nextAspect, width, height),
      width,
      height
    );
    setCrop(nextCrop);
  };

  const getPixelCrop = (img, currentCrop) => {
    if (!currentCrop) return null;
    if (currentCrop.unit === 'px') return currentCrop;
    const rect = img.getBoundingClientRect();
    return convertToPixelCrop(currentCrop, rect.width, rect.height);
  };

  const updateCanvas = () => {
    if (!imgRef.current || !canvasRef.current || !crop) return;

    const img = imgRef.current;
    const canvas = canvasRef.current;
    const pixelCrop = getPixelCrop(img, crop);
    if (!pixelCrop) return;
    const rect = img.getBoundingClientRect();
    const scaleX = img.naturalWidth / rect.width;
    const scaleY = img.naturalHeight / rect.height;

    canvas.width = Math.round(pixelCrop.width * scaleX);
    canvas.height = Math.round(pixelCrop.height * scaleY);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
      img,
      Math.round(pixelCrop.x * scaleX),
      Math.round(pixelCrop.y * scaleY),
      Math.round(pixelCrop.width * scaleX),
      Math.round(pixelCrop.height * scaleY),
      0,
      0,
      canvas.width,
      canvas.height
    );
  };

  const updatePreview = () => {
    if (!imgRef.current || !previewCanvasRef.current || !crop) return;

    const img = imgRef.current;
    const canvas = previewCanvasRef.current;

    const pixelCrop = getPixelCrop(img, crop);
    if (!pixelCrop) return;
    const rect = img.getBoundingClientRect();
    const scaleX = img.naturalWidth / rect.width;
    const scaleY = img.naturalHeight / rect.height;

    canvas.width = 120;
    canvas.height = 120;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
      img,
      Math.round(pixelCrop.x * scaleX),
      Math.round(pixelCrop.y * scaleY),
      Math.round(pixelCrop.width * scaleX),
      Math.round(pixelCrop.height * scaleY),
      0,
      0,
      120,
      120
    );

    if (overlayCanvasRef.current) {
      const overlay = overlayCanvasRef.current;
      const overlaySize = 240;
      overlay.width = overlaySize;
      overlay.height = overlaySize;
      const octx = overlay.getContext('2d');
      if (octx) {
        octx.imageSmoothingEnabled = true;
        octx.imageSmoothingQuality = 'high';
        octx.clearRect(0, 0, overlaySize, overlaySize);
        octx.drawImage(
          img,
          Math.round(pixelCrop.x * scaleX),
          Math.round(pixelCrop.y * scaleY),
          Math.round(pixelCrop.width * scaleX),
          Math.round(pixelCrop.height * scaleY),
          0,
          0,
          overlaySize,
          overlaySize
        );
      }
    }
  };

  useEffect(() => {
    if (imgSrc) {
      setShowPreview(true);
      updatePreview();
    } else {
      setShowPreview(false);
    }
  }, [crop, imgSrc]);

  useEffect(() => {
    if (isPreviewHovered) {
      updatePreview();
    }
  }, [isPreviewHovered]);

  const downloadCropped = () => {
    updateCanvas();
    const canvas = canvasRef.current;
    if (!canvas || !crop || canvas.width === 0 || canvas.height === 0) return;

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `cropped-${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      },
      "image/png",
      1
    );
  };

  const smartCrop = () => {
    if (aspect) {
      handleAspectChange(aspect);
    }
  };

  const getRatioBtnStyle = (ratio) => {
    const isActive = ratio === aspect;
    const isHovered = hoveredRatio === ratio && !isActive;

    let style = { ...styles.ratioBtn };

    if (isActive) {
      Object.assign(style, styles.ratioBtnActive);
    } else if (isHovered) {
      Object.assign(style, styles.ratioBtnHover);
    }

    return style;
  };

  return (
    <div style={styles.smartPage}>
      <div style={styles.pageInner}>
        <main style={styles.editorCard}>
          <div style={styles.editorToolbar}>
            <button
              style={{
                ...styles.iconBtn,
                ...styles.secondaryBtn,
                ...(hoveredSecondary && styles.secondaryBtnHover),
              }}
              onClick={() => {
                setImgSrc(undefined);
                setFileName('');
                setAspect(undefined);
                setCrop(undefined);
              }}
              onMouseEnter={() => setHoveredSecondary(true)}
              onMouseLeave={() => setHoveredSecondary(false)}
              title="Clear"
            >
              🗑️
            </button>
            <button
              style={{
                ...styles.iconBtn,
                ...styles.primaryBtn,
                ...(hoveredPrimary && styles.primaryBtnHover),
                ...((!imgSrc || !crop) && styles.primaryBtnDisabled),
              }}
              onClick={downloadCropped}
              disabled={!imgSrc || !crop}
              onMouseEnter={() => setHoveredPrimary(true)}
              onMouseLeave={() => setHoveredPrimary(false)}
              title="Download"
            >
              ⬇️
            </button>
          </div>
            <div style={styles.smartEditor}>
              {imgSrc ? (
                <div style={styles.cropContainer}>
                  <ReactCrop
                    crop={crop}
                    onChange={(c) => setCrop(c)}
                    onComplete={updatePreview}
                    aspect={aspect}
                    keepSelection
                    className="crop-area"
                    ruleOfThirds
                  >
                    <img
                      ref={imgRef}
                      src={imgSrc}
                      alt="Crop source"
                      onLoad={onImageLoad}
                      style={styles.cropImage}
                    />
                  </ReactCrop>
                </div>
              ) : (
                <div style={styles.placeholder}>
                  <div style={styles.placeholderIcon}>🖼️</div>
                  <p>Upload an image to start cropping</p>
                  <p style={{ fontSize: '14px', opacity: 0.7 }}>
                    Supports JPG, PNG, WebP
                  </p>
                </div>
              )}

              {showPreview && (
                <div style={styles.previewSection}>
                  <div
                    onMouseEnter={() => setIsPreviewHovered(true)}
                    onMouseLeave={() => setIsPreviewHovered(false)}
                    style={{ position: 'relative' }}
                  >
                    <canvas
                      ref={previewCanvasRef}
                      style={styles.previewCanvas}
                    />
                    {isPreviewHovered && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '-260px',
                          right: '0',
                          background: 'rgba(0,0,0,0.6)',
                          padding: '10px',
                          borderRadius: '12px',
                          boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
                          border: '1px solid rgba(255,255,255,0.2)',
                          zIndex: 5,
                        }}
                      >
                        <canvas
                          ref={overlayCanvasRef}
                          style={{
                            width: '240px',
                            height: '240px',
                            display: 'block',
                            borderRadius: '10px',
                            objectFit: 'cover',
                            pointerEvents: 'none',
                          }}
                        />
                      </div>
                    )}
                  </div>
                  <p
                    style={{
                      color: 'white',
                      fontSize: '12px',
                      textAlign: 'center',
                      marginTop: '8px',
                      opacity: 0.8,
                    }}
                  >
                    Preview
                  </p>
                </div>
              )}

              <canvas ref={canvasRef} style={{ display: 'none' }} />
            </div>
          </main>

        <div style={styles.bottomToolbar}>
          <div
            style={{
              ...styles.uploadSection,
              ...(hoveredUpload && styles.uploadSectionHover),
            }}
            onMouseEnter={() => setHoveredUpload(true)}
            onMouseLeave={() => setHoveredUpload(false)}
          >
            <input
              type="file"
              accept="image/*"
              onChange={onSelectFile}
              style={styles.fileInput}
            />
            <div style={styles.uploadIcon}>📁</div>
            <div style={styles.uploadContent}>
              <h4 style={styles.uploadTitle}>
                {fileName || 'Upload image'}
              </h4>
              <p style={styles.uploadSubtitle}>
                {fileName ? 'Click to change' : 'Click or drag & drop'}
              </p>
            </div>
          </div>

          <div style={styles.toolbarDivider}></div>
          <div style={styles.ratioSection}>
            <h4 style={styles.sectionTitle}>Ratio:</h4>
            <div style={styles.ratioGrid}>
              {RATIOS.map((r) => (
                <button
                  key={r.label}
                  style={getRatioBtnStyle(r.value)}
                  onClick={() => handleAspectChange(r.value)}
                  title={r.label}
                  onMouseEnter={() => setHoveredRatio(r.value)}
                  onMouseLeave={() => setHoveredRatio(null)}
                >
                  <span>{r.icon}</span>
                  <span>{r.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div style={styles.toolbarDivider}></div>

          <button
            style={{
              ...styles.smartCropBtn,
              ...(hoveredSmartBtn && styles.smartCropBtnHover),
              ...((!imgSrc || !aspect) && styles.smartCropBtnDisabled),
            }}
            onClick={smartCrop}
            disabled={!imgSrc || !aspect}
            onMouseEnter={() => setHoveredSmartBtn(true)}
            onMouseLeave={() => setHoveredSmartBtn(false)}
          >
            <span style={styles.smartCropBtnIcon}>✨</span>
            Smart Crop
          </button>
        </div>
      </div>
    </div>
  );
}

export default SmartCrop;