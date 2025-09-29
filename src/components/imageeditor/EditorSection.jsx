import React, { useEffect, useRef, useState } from 'react';
import { MdUploadFile } from 'react-icons/md';

const styles = {
  editorBox: {
    background: 'white',
    borderRadius: 23,
    boxShadow: '0 2px 24px rgba(217,210,237,0.11)',
    display: 'flex',
    marginTop: 22,
    padding: 40,
    justifyContent: 'space-between',
    gap: 32,
    minHeight: 370,
  },
  canvasWrap: {
    flex: 2.2,
    minHeight: 480,
    background: '#f5f4fb',
    borderRadius: 15,
    border: '2px dashed #dedbf5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  editorControls: {
    flex: 1,
    minWidth: 210,
    padding: '12px 8px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 19,
    background: 'white',
    borderRadius: 12,
    boxShadow: '0 2px 16px #eee',
    marginLeft: 28,
  },
  editorControlsTitle: {
    fontSize: 19,
    fontWeight: 700,
    marginBottom: 2,
    color: '#17142B',
  },
  sliderRow: {
    width: '100%',
    margin: '13px 0 11px 0',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  sliderLabel: { fontSize: 15, fontWeight: 500, color: '#797885', width: 90 },
  slider: {
    flexGrow: 1,
    appearance: 'none',
    height: 5,
    borderRadius: 7,
    background: '#ebe6ff',
    outline: 'none',
    transition: 'background 0.3s',
    accentColor: '#906BFF',
  },
  undoRedoRow: {
    display: 'flex',
    gap: 13,
    margin: '13px 0',
    width: '100%',
  },
  undoRedoBtn: {
    background: '#f5f4fb',
    color: '#7e5aff',
    border: 'none',
    borderRadius: 8,
    padding: '8px 17px',
    fontWeight: 700,
    fontSize: 14,
    cursor: 'pointer',
    transition: 'background 0.18s,color 0.18s',
  },
  exportBtn: {
    background: '#906BFF',
    color: 'white',
    border: 'none',
    borderRadius: 11,
    padding: '12px 34px',
    fontWeight: 700,
    fontSize: 16,
    marginTop: 9,
    cursor: 'pointer',
    width: '100%',
    transition: 'background 0.2s',
  },
  toolbarGroup: { width: '100%', display: 'flex', gap: 8, flexWrap: 'wrap' },
  toolBtn: {
    background: '#f5f4fb',
    color: '#1a144c',
    border: '1px solid #e6e2fb',
    borderRadius: 8,
    padding: '8px 10px',
    fontWeight: 700,
    fontSize: 13,
    cursor: 'pointer',
  },
};

export default function EditorSection({ initialImageURL, onBackToTools }) {
  const displayCanvasRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 500 });
  const [layers, setLayers] = useState([]); // [{canvas, x,y, scale, rotation}]
  const [activeIndex, setActiveIndex] = useState(0); // 0 = base
  const [mode, setMode] = useState('move'); // move | erase | crop | adjust | filter
  const [brushSize, setBrushSize] = useState(30);
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [filter, setFilter] = useState('none'); // none|grayscale|sepia|invert
  const historyRef = useRef([]);
  const redoRef = useRef([]);
  const cropRectRef = useRef(null); // {x,y,w,h} while selecting
  const draggingRef = useRef(null); // {startX,startY, origX,origY}

  useEffect(() => {
    if (!initialImageURL) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const maxW = 900;
      const maxH = 600;
      let w = img.width;
      let h = img.height;
      const scale = Math.min(maxW / w, maxH / h, 1);
      w = Math.max(1, Math.floor(w * scale));
      h = Math.max(1, Math.floor(h * scale));

      const base = document.createElement('canvas');
      base.width = w;
      base.height = h;
      const bctx = base.getContext('2d');
      bctx.drawImage(img, 0, 0, w, h);

      setCanvasSize({ width: w, height: h });
      setLayers([{ canvas: base, x: 0, y: 0, scale: 1, rotation: 0 }]);
      setActiveIndex(0);
      historyRef.current = [];
      redoRef.current = [];
      pushHistory([{ canvas: cloneCanvas(base), x: 0, y: 0, scale: 1, rotation: 0 }]);
      requestAnimationFrame(renderAll);
    };
    img.src = initialImageURL;
  }, [initialImageURL]);

  const cloneCanvas = source => {
    const c = document.createElement('canvas');
    c.width = source.width;
    c.height = source.height;
    c.getContext('2d').drawImage(source, 0, 0);
    return c;
  };

  const pushHistory = stateLayers => {
    const snapshot = stateLayers.map(l => ({
      canvas: cloneCanvas(l.canvas),
      x: l.x,
      y: l.y,
      scale: l.scale,
      rotation: l.rotation,
    }));
    historyRef.current.push(snapshot);
    if (historyRef.current.length > 30) historyRef.current.shift();
    redoRef.current = [];
  };

  const applyFilterToActive = () => {
    const idx = activeIndex;
    if (idx == null || layers[idx] == null) return;
    const layer = layers[idx];
    const ctx = layer.canvas.getContext('2d');
    const imgData = ctx.getImageData(0, 0, layer.canvas.width, layer.canvas.height);
    const data = imgData.data;

    const b = brightness; // -100..100
    const c = contrast; // -100..100
    const cFactor = (259 * (c + 255)) / (255 * (259 - c));

    for (let i = 0; i < data.length; i += 4) {
      let r = data[i];
      let g = data[i + 1];
      let bch = data[i + 2];
      // brightness
      r = r + b;
      g = g + b;
      bch = bch + b;
      // contrast
      r = cFactor * (r - 128) + 128;
      g = cFactor * (g - 128) + 128;
      bch = cFactor * (bch - 128) + 128;

      // preset filter
      if (filter === 'grayscale') {
        const avg = 0.2126 * r + 0.7152 * g + 0.0722 * bch;
        r = g = bch = avg;
      } else if (filter === 'sepia') {
        const nr = 0.393 * r + 0.769 * g + 0.189 * bch;
        const ng = 0.349 * r + 0.686 * g + 0.168 * bch;
        const nb = 0.272 * r + 0.534 * g + 0.131 * bch;
        r = nr; g = ng; bch = nb;
      } else if (filter === 'invert') {
        r = 255 - r; g = 255 - g; bch = 255 - bch;
      }

      data[i] = Math.max(0, Math.min(255, r));
      data[i + 1] = Math.max(0, Math.min(255, g));
      data[i + 2] = Math.max(0, Math.min(255, bch));
    }
    ctx.putImageData(imgData, 0, 0);
    setLayers(prev => {
      const copy = [...prev];
      copy[idx] = { ...layer, canvas: layer.canvas };
      return copy;
    });
    pushHistory(layers);
    requestAnimationFrame(renderAll);
  };

  const addPhoto = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = e => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        const maxDim = Math.min(canvasSize.width, canvasSize.height) * 0.6;
        const scale = Math.min(maxDim / img.width, maxDim / img.height, 1);
        const w = Math.max(1, Math.floor(img.width * scale));
        const h = Math.max(1, Math.floor(img.height * scale));
        const c = document.createElement('canvas');
        c.width = w; c.height = h;
        c.getContext('2d').drawImage(img, 0, 0, w, h);
        setLayers(prev => {
          const next = [...prev, { canvas: c, x: (canvasSize.width - w) / 2, y: (canvasSize.height - h) / 2, scale: 1, rotation: 0 }];
          pushHistory(next);
          requestAnimationFrame(renderAll);
          // select the newly added layer
          setActiveIndex(next.length - 1);
          return next;
        });
        setMode('move');
        URL.revokeObjectURL(url);
      };
      img.src = url;
    };
    input.click();
  };

  const compositeLayersTo = ctx => {
    ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
    layers.forEach(l => {
      ctx.save();
      ctx.translate(l.x + (l.canvas.width * l.scale) / 2, l.y + (l.canvas.height * l.scale) / 2);
      ctx.rotate((l.rotation * Math.PI) / 180);
      ctx.scale(l.scale, l.scale);
      ctx.drawImage(l.canvas, -l.canvas.width / 2, -l.canvas.height / 2);
      ctx.restore();
    });
  };

  const renderAll = () => {
    const canvas = displayCanvasRef.current;
    if (!canvas) return;
    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;
    const ctx = canvas.getContext('2d');
    compositeLayersTo(ctx);
    // selection box
    if (layers[activeIndex]) {
      const l = layers[activeIndex];
      ctx.save();
      ctx.translate(l.x + (l.canvas.width * l.scale) / 2, l.y + (l.canvas.height * l.scale) / 2);
      ctx.rotate((l.rotation * Math.PI) / 180);
      ctx.scale(l.scale, l.scale);
      ctx.strokeStyle = '#906BFF';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 4]);
      ctx.strokeRect(-l.canvas.width / 2, -l.canvas.height / 2, l.canvas.width, l.canvas.height);
      ctx.restore();
    }
  };

  useEffect(() => {
    renderAll();
  }, [layers, canvasSize, activeIndex]);

  const pointInLayer = (x, y, l) => {
    // inverse transform
    const cx = l.x + (l.canvas.width * l.scale) / 2;
    const cy = l.y + (l.canvas.height * l.scale) / 2;
    const dx = x - cx;
    const dy = y - cy;
    const sin = Math.sin((-l.rotation * Math.PI) / 180);
    const cos = Math.cos((-l.rotation * Math.PI) / 180);
    const rx = (dx * cos - dy * sin) / l.scale;
    const ry = (dx * sin + dy * cos) / l.scale;
    return (
      rx >= -l.canvas.width / 2 &&
      rx <= l.canvas.width / 2 &&
      ry >= -l.canvas.height / 2 &&
      ry <= l.canvas.height / 2
    );
  };

  const onMouseDown = e => {
    const rect = displayCanvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (mode === 'move') {
      // select topmost layer under point
      for (let i = layers.length - 1; i >= 0; i--) {
        if (pointInLayer(x, y, layers[i])) {
          setActiveIndex(i);
          draggingRef.current = { startX: x, startY: y, origX: layers[i].x, origY: layers[i].y };
          break;
        }
      }
      // if none selected, default to base layer
      if (!draggingRef.current && layers[0]) setActiveIndex(0);
    } else if (mode === 'erase') {
      eraseAt(x, y);
    } else if (mode === 'crop') {
      cropRectRef.current = { x, y, w: 0, h: 0 };
    }
  };

  const onMouseMove = e => {
    const rect = displayCanvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (mode === 'move' && draggingRef.current && layers[activeIndex]) {
      const { startX, startY, origX, origY } = draggingRef.current;
      const nx = origX + (x - startX);
      const ny = origY + (y - startY);
      setLayers(prev => {
        const copy = [...prev];
        copy[activeIndex] = { ...copy[activeIndex], x: nx, y: ny };
        return copy;
      });
    } else if (mode === 'erase') {
      eraseAt(x, y);
    } else if (mode === 'crop' && cropRectRef.current) {
      cropRectRef.current.w = x - cropRectRef.current.x;
      cropRectRef.current.h = y - cropRectRef.current.y;
      renderAll();
      // draw crop rectangle overlay
      const ctx = displayCanvasRef.current.getContext('2d');
      const { x: cx, y: cy, w, h } = cropRectRef.current;
      ctx.save();
      ctx.setLineDash([6, 4]);
      ctx.strokeStyle = '#ff7d7d';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(cx, cy, w, h);
      ctx.restore();
    }
  };

  const onMouseUp = () => {
    if (draggingRef.current) {
      pushHistory(layers);
      draggingRef.current = null;
    }
    if (mode === 'erase') {
      pushHistory(layers);
    }
  };

  const eraseAt = (x, y) => {
    const idx = activeIndex;
    if (idx == null || !layers[idx]) return;
    const l = layers[idx];
    // convert point into layer local coordinates
    const cx = l.x + (l.canvas.width * l.scale) / 2;
    const cy = l.y + (l.canvas.height * l.scale) / 2;
    const dx = x - cx;
    const dy = y - cy;
    const sin = Math.sin((-l.rotation * Math.PI) / 180);
    const cos = Math.cos((-l.rotation * Math.PI) / 180);
    const rx = (dx * cos - dy * sin) / l.scale + l.canvas.width / 2;
    const ry = (dx * sin + dy * cos) / l.scale + l.canvas.height / 2;
    const ctx = l.canvas.getContext('2d');
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(rx, ry, brushSize, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    requestAnimationFrame(renderAll);
  };

  const applyCrop = () => {
    const rect = cropRectRef.current;
    if (!rect) return;
    const x = Math.round(Math.min(rect.x, rect.x + rect.w));
    const y = Math.round(Math.min(rect.y, rect.y + rect.h));
    const w = Math.round(Math.abs(rect.w));
    const h = Math.round(Math.abs(rect.h));
    if (w < 2 || h < 2) {
      cropRectRef.current = null;
      renderAll();
      return;
    }
    const newLayers = layers.map(l => {
      const nc = document.createElement('canvas');
      nc.width = w; nc.height = h;
      const nctx = nc.getContext('2d');
      nctx.save();
      nctx.translate(-x + l.x, -y + l.y);
      nctx.translate((l.canvas.width * l.scale) / 2, (l.canvas.height * l.scale) / 2);
      nctx.rotate((l.rotation * Math.PI) / 180);
      nctx.scale(l.scale, l.scale);
      nctx.drawImage(l.canvas, -l.canvas.width / 2, -l.canvas.height / 2);
      nctx.restore();
      return { canvas: nc, x: 0, y: 0, scale: 1, rotation: 0 };
    });
    setLayers(newLayers);
    setCanvasSize({ width: w, height: h });
    pushHistory(newLayers);
    cropRectRef.current = null;
    setMode('move');
    requestAnimationFrame(renderAll);
  };

  const rotate = dir => {
    const angle = dir === 'left' ? -90 : 90;
    const newLayers = layers.map(l => {
      const nc = document.createElement('canvas');
      nc.width = l.canvas.height;
      nc.height = l.canvas.width;
      const nctx = nc.getContext('2d');
      nctx.translate(nc.width / 2, nc.height / 2);
      nctx.rotate((angle * Math.PI) / 180);
      nctx.drawImage(l.canvas, -l.canvas.width / 2, -l.canvas.height / 2);
      return { canvas: nc, x: 0, y: 0, scale: 1, rotation: 0 };
    });
    setLayers(newLayers);
    setCanvasSize({ width: canvasSize.height, height: canvasSize.width });
    pushHistory(newLayers);
    requestAnimationFrame(renderAll);
  };

  const flip = axis => {
    const newLayers = layers.map(l => {
      const nc = document.createElement('canvas');
      nc.width = l.canvas.width;
      nc.height = l.canvas.height;
      const nctx = nc.getContext('2d');
      nctx.translate(nc.width / 2, nc.height / 2);
      nctx.scale(axis === 'h' ? -1 : 1, axis === 'v' ? -1 : 1);
      nctx.drawImage(l.canvas, -l.canvas.width / 2, -l.canvas.height / 2);
      return { canvas: nc, x: l.x, y: l.y, scale: l.scale, rotation: l.rotation };
    });
    setLayers(newLayers);
    pushHistory(newLayers);
    requestAnimationFrame(renderAll);
  };

  const scaleActive = factor => {
    if (!layers[activeIndex]) return;
    setLayers(prev => {
      const copy = [...prev];
      const l = copy[activeIndex];
      copy[activeIndex] = { ...l, scale: Math.max(0.1, Math.min(5, l.scale * factor)) };
      return copy;
    });
  };

  const handleUndo = () => {
    if (historyRef.current.length <= 1) return;
    const current = historyRef.current.pop();
    redoRef.current.push(current);
    const prev = historyRef.current[historyRef.current.length - 1];
    const restored = prev.map(l => ({
      canvas: cloneCanvas(l.canvas), x: l.x, y: l.y, scale: l.scale, rotation: l.rotation,
    }));
    setLayers(restored);
    requestAnimationFrame(renderAll);
  };

  const handleRedo = () => {
    if (redoRef.current.length === 0) return;
    const next = redoRef.current.pop();
    historyRef.current.push(next);
    const restored = next.map(l => ({
      canvas: cloneCanvas(l.canvas), x: l.x, y: l.y, scale: l.scale, rotation: l.rotation,
    }));
    setLayers(restored);
    requestAnimationFrame(renderAll);
  };

  const download = () => {
    const out = document.createElement('canvas');
    out.width = canvasSize.width; out.height = canvasSize.height;
    const octx = out.getContext('2d');
    compositeLayersTo(octx);
    const url = out.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url; a.download = 'edited-image.png';
    document.body.appendChild(a); a.click(); a.remove();
  };

  return (
    <div style={styles.editorBox}>
      <div style={styles.canvasWrap}>
        <canvas
          ref={displayCanvasRef}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          style={{ maxWidth: '100%', maxHeight: '100%', cursor: mode === 'move' ? 'move' : mode === 'erase' ? 'crosshair' : mode === 'crop' ? 'crosshair' : 'default' }}
        />
      </div>
      <div style={styles.editorControls}>
        <div style={styles.editorControlsTitle}>Tools</div>
        <div style={styles.toolbarGroup}>
          <button style={styles.toolBtn} onClick={() => setMode('move')}>Move</button>
          <button style={styles.toolBtn} onClick={() => setMode('erase')}>Erase</button>
          <button style={styles.toolBtn} onClick={() => setMode('crop')}>Crop</button>
          <button style={styles.toolBtn} onClick={() => rotate('left')}>Rotate ⟲</button>
          <button style={styles.toolBtn} onClick={() => rotate('right')}>Rotate ⟳</button>
          <button style={styles.toolBtn} onClick={() => flip('h')}>Flip H</button>
          <button style={styles.toolBtn} onClick={() => flip('v')}>Flip V</button>
        </div>
        {mode === 'erase' && (
          <div style={styles.sliderRow}>
            <span style={styles.sliderLabel}>Brush</span>
            <input type="range" min={5} max={120} value={brushSize} style={styles.slider}
              onChange={e => setBrushSize(parseInt(e.target.value))} />
            <span style={{ color: '#8e83b2', fontSize: 14, width: 30 }}>{brushSize}</span>
          </div>
        )}
        <div style={styles.sliderRow}>
          <span style={styles.sliderLabel}>Brightness</span>
          <input type="range" min={-100} max={100} value={brightness} style={styles.slider}
            onChange={e => setBrightness(parseInt(e.target.value))} />
          <button style={{ ...styles.toolBtn, padding: '6px 10px' }} onClick={applyFilterToActive}>Apply</button>
        </div>
        <div style={styles.sliderRow}>
          <span style={styles.sliderLabel}>Contrast</span>
          <input type="range" min={-100} max={100} value={contrast} style={styles.slider}
            onChange={e => setContrast(parseInt(e.target.value))} />
        </div>
        <div style={styles.sliderRow}>
          <span style={styles.sliderLabel}>Filter</span>
          <select value={filter} onChange={e => setFilter(e.target.value)} style={{ flexGrow: 1, padding: '7px 10px', borderRadius: 8, border: '1px solid #e6e2fb' }}>
            <option value="none">None</option>
            <option value="grayscale">Grayscale</option>
            <option value="sepia">Sepia</option>
            <option value="invert">Invert</option>
          </select>
        </div>
        <div style={styles.sliderRow}>
          <span style={styles.sliderLabel}>Layer Scale</span>
          <button style={styles.toolBtn} onClick={() => scaleActive(0.9)}>-</button>
          <button style={styles.toolBtn} onClick={() => scaleActive(1.111)}>+</button>
        </div>
        <div style={styles.undoRedoRow}>
          <button style={styles.undoRedoBtn} onClick={handleUndo} aria-label="Undo">{'↺'}</button>
          <button style={styles.undoRedoBtn} onClick={handleRedo} aria-label="Redo">{'↻'}</button>
        </div>
        <div style={styles.sliderRow}>
          <span style={styles.sliderLabel}>Add Photo</span>
          <button style={{ ...styles.undoRedoBtn, padding: '8px 14px' }} onClick={addPhoto}>Browse</button>
        </div>
        <button style={styles.exportBtn} onClick={download}>
          <MdUploadFile style={{ verticalAlign: 'middle', marginRight: 7 }} /> Download PNG
        </button>
        {onBackToTools && (
          <button
            style={{ ...styles.undoRedoBtn, width: '100%', marginTop: 10, background: '#f0eef9' }}
            onClick={onBackToTools}
          >
            Back to Tools
        </button>
        )}
        {mode === 'crop' && (
          <button style={{ ...styles.exportBtn, marginTop: 12, background: '#ff7d7d' }} onClick={applyCrop}>Apply Crop</button>
        )}
      </div>
    </div>
  );
}
