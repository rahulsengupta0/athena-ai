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
    display: 'grid',
    gridTemplateColumns: '320px 1fr',
    height: '100vh',
    maxWidth: '1400px',
    margin: '0 auto',
    background: 'white',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  },
  
  smartSidebar: {
    background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
    padding: '32px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    overflowY: 'auto'
  },
  
  sidebarHeader: {
    textAlign: 'center',
    paddingBottom: '16px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
  },
  
  sidebarTitle: {
    margin: 0,
    fontSize: '24px',
    fontWeight: 700,
    color: 'white',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  
  uploadSection: {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '16px',
    padding: '24px',
    border: '2px dashed rgba(255, 255, 255, 0.1)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    position: 'relative'
  },
  
  uploadSectionHover: {
    borderColor: '#667eea',
    background: 'rgba(102, 126, 234, 0.1)'
  },
  
  uploadContent: {
    textAlign: 'center',
    color: '#94a3b8'
  },
  
  uploadIcon: {
    width: '48px',
    height: '48px',
    margin: '0 auto 12px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px'
  },
  
  uploadTitle: {
    margin: '0 0 8px 0',
    color: 'white',
    fontSize: '16px',
    fontWeight: 600
  },
  
  uploadSubtitle: {
    margin: 0,
    fontSize: '14px',
    opacity: 0.8
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
  
  ratioSection: {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '16px',
    padding: '20px'
  },
  
  sectionTitle: {
    color: 'white',
    fontSize: '14px',
    fontWeight: 600,
    margin: '0 0 16px 0',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    opacity: 0.9
  },
  
  ratioGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '10px'
  },
  
  ratioBtn: {
    padding: '12px 8px',
    borderRadius: '12px',
    border: '2px solid transparent',
    background: 'rgba(255, 255, 255, 0.1)',
    color: '#cbd5e1',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textAlign: 'center'
  },
  
  ratioBtnHover: {
    background: 'rgba(255, 255, 255, 0.15)',
    color: 'white',
    borderColor: 'rgba(255, 255, 255, 0.2)'
  },
  
  ratioBtnActive: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    borderColor: 'transparent',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
    transform: 'translateY(-1px)'
  },
  
  smartCropBtn: {
    padding: '16px',
    borderRadius: '16px',
    border: 'none',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
  },
  
  smartCropBtnHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)'
  },
  
  smartCropBtnDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
    transform: 'none !important'
  },
  
  smartCropBtnIcon: {
    fontSize: '20px'
  },
  
  actionsRow: {
    marginTop: 'auto',
    display: 'flex',
    gap: '12px',
    paddingTop: '24px',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)'
  },
  
  primaryBtn: {
    flex: 1,
    padding: '14px',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: 600,
    cursor: 'pointer',
    border: 'none',
    transition: 'all 0.3s ease',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: 'white',
    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
  },
  
  primaryBtnHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 16px rgba(16, 185, 129, 0.4)'
  },
  
  primaryBtnDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
    transform: 'none !important'
  },
  
  secondaryBtn: {
    flex: 1,
    padding: '14px',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: 600,
    cursor: 'pointer',
    border: '2px solid rgba(255, 255, 255, 0.1)',
    transition: 'all 0.3s ease',
    background: 'rgba(255, 255, 255, 0.1)',
    color: '#94a3b8'
  },
  
  secondaryBtnHover: {
    background: 'rgba(255, 255, 255, 0.15)',
    color: 'white',
    borderColor: 'rgba(255, 255, 255, 0.2)'
  },
  
  smartEditor: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(45deg, #0f172a 0%, #1e293b 100%)',
    overflow: 'hidden'
  },
  
  cropContainer: {
    maxWidth: '90%',
    maxHeight: '90%',
    padding: '20px',
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)'
  },
  
  cropArea: {
    maxWidth: '100%',
    maxHeight: '80vh'
  },
  
  cropImage: {
    maxWidth: '100%',
    maxHeight: '75vh',
    objectFit: 'contain',
    borderRadius: '8px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
  },
  
  placeholder: {
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: '18px',
    padding: '48px',
    border: '2px dashed rgba(255, 255, 255, 0.1)',
    borderRadius: '20px',
    background: 'rgba(255, 255, 255, 0.02)',
    maxWidth: '400px',
    margin: 'auto'
  },
  
  placeholderIcon: {
    fontSize: '48px',
    marginBottom: '16px',
    opacity: 0.5
  },
  
  previewSection: {
    position: 'absolute',
    bottom: '24px',
    right: '24px',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '12px',
    padding: '12px',
    border: '1px solid rgba(255, 255, 255, 0.2)'
  },
  
  previewCanvas: {
    width: '120px',
    height: '120px',
    borderRadius: '8px',
    objectFit: 'cover',
    display: 'block'
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
  
  const imgRef = useRef(null);
  const canvasRef = useRef(null);
  const previewCanvasRef = useRef(null);

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

  useEffect(() => {
    if (imgSrc) {
      setShowPreview(true);
      updatePreview();
    } else {
      setShowPreview(false);
    }
  }, [crop, imgSrc]);

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

  const updateCanvas = () => {
    if (!imgRef.current || !canvasRef.current || !crop) return;

    const img = imgRef.current;
    const canvas = canvasRef.current;

    const pixelCrop = convertToPixelCrop(
      crop,
      img.naturalWidth,
      img.naturalHeight
    );

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
      img,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );
  };

  const updatePreview = () => {
    if (!imgRef.current || !previewCanvasRef.current || !crop) return;

    const img = imgRef.current;
    const canvas = previewCanvasRef.current;

    const pixelCrop = convertToPixelCrop(
      crop,
      img.naturalWidth,
      img.naturalHeight
    );

    canvas.width = 120;
    canvas.height = 120;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
      img,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      120,
      120
    );
  };

  const downloadCropped = () => {
    updateCanvas();
    const canvas = canvasRef.current;
    if (!canvas) return;

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
      <aside style={styles.smartSidebar}>
        <div style={styles.sidebarHeader}>
          <h3 style={styles.sidebarTitle}>Image Cropper</h3>
        </div>

        <div 
          style={{
            ...styles.uploadSection,
            ...(hoveredUpload && styles.uploadSectionHover)
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
          <div style={styles.uploadContent}>
            <div style={styles.uploadIcon}>📁</div>
            <h4 style={styles.uploadTitle}>Upload Image</h4>
            <p style={styles.uploadSubtitle}>Click or drag & drop</p>
            {fileName && (
              <p style={{ fontSize: '12px', marginTop: '8px', opacity: 0.7 }}>
                {fileName}
              </p>
            )}
          </div>
        </div>

        <div style={styles.ratioSection}>
          <h4 style={styles.sectionTitle}>Aspect Ratio</h4>
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
                {r.icon}<br/>
                <span style={{ fontSize: '11px' }}>{r.label}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          style={{
            ...styles.smartCropBtn,
            ...(hoveredSmartBtn && styles.smartCropBtnHover),
            ...((!imgSrc || !aspect) && styles.smartCropBtnDisabled)
          }}
          onClick={smartCrop}
          disabled={!imgSrc || !aspect}
          onMouseEnter={() => setHoveredSmartBtn(true)}
          onMouseLeave={() => setHoveredSmartBtn(false)}
        >
          <span style={styles.smartCropBtnIcon}>✨</span>
          Smart Crop
        </button>

        <div style={styles.actionsRow}>
          <button 
            style={{
              ...styles.secondaryBtn,
              ...(hoveredSecondary && styles.secondaryBtnHover)
            }}
            onClick={() => {
              setImgSrc(undefined);
              setFileName("");
              setAspect(undefined);
              setCrop(undefined);
            }}
            onMouseEnter={() => setHoveredSecondary(true)}
            onMouseLeave={() => setHoveredSecondary(false)}
          >
            Clear
          </button>
          <button
            style={{
              ...styles.primaryBtn,
              ...(hoveredPrimary && styles.primaryBtnHover),
              ...(!imgSrc && styles.primaryBtnDisabled)
            }}
            onClick={downloadCropped}
            disabled={!imgSrc}
            onMouseEnter={() => setHoveredPrimary(true)}
            onMouseLeave={() => setHoveredPrimary(false)}
          >
            <span style={{ marginRight: '8px' }}>⬇️</span>
            Download
          </button>
        </div>
      </aside>

      <main style={styles.smartEditor}>
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
            <canvas 
              ref={previewCanvasRef} 
              style={styles.previewCanvas}
            />
            <p style={{ 
              color: 'white', 
              fontSize: '12px', 
              textAlign: 'center',
              marginTop: '8px',
              opacity: 0.8 
            }}>
              Preview
            </p>
          </div>
        )}
        
        <canvas ref={canvasRef} style={{ display: "none" }} />
      </main>
    </div>
  );
}

export default SmartCrop;