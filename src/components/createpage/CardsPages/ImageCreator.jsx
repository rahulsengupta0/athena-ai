import React, { useMemo, useState } from 'react'

const EXAMPLES = [
  'A serene mountain landscape at sunset with reflective lake',
  'Futuristic city skyline with flying cars and neon lights',
  'Cute cartoon character mascot for a tech company',
  'Abstract geometric pattern in vibrant colors',
  'Professional headshot of a business person in modern office',
]

const styles = ['Realistic', 'Illustration', '3D Render', 'Anime', 'Watercolor']
const ratios = [
  { key: '1:1', label: '1:1 Square', aspect: '1 / 1' },
  { key: '3:4', label: '3:4 Portrait', aspect: '3 / 4' },
  { key: '4:3', label: '4:3 Landscape', aspect: '4 / 3' },
  { key: '16:9', label: '16:9 Wide', aspect: '16 / 9' },
]

const wrapper = { background: '#fff', border: '1.6px solid #efeefa', borderRadius: 16, boxShadow: '0 3px 16px #e9e4f33d' }

const ImageCreator = () => {
  const [prompt, setPrompt] = useState('')
  const [style, setStyle] = useState(styles[0])
  const [ratio, setRatio] = useState(ratios[0].key)
  const [quality, setQuality] = useState(80)
  const [isLoading, setIsLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState('')

  const activeAspect = useMemo(() => ratios.find(r => r.key === ratio)?.aspect || '1 / 1', [ratio])

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    setIsLoading(true)
    setTimeout(() => {
      setImageUrl('https://via.placeholder.com/1024x1024.png?text=AI+Image')
      setIsLoading(false)
    }, 900)
  }

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <div style={{
          width: 38,
          height: 38,
          borderRadius: 12,
          background: '#e6fbf8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#10b9a5',
          fontWeight: 800,
          fontSize: 20,
        }}>🖼</div>
        <div>
          <div style={{ fontSize: '1.55rem', fontWeight: 800, color: '#1a1f47' }}>AI Image Creator</div>
          <div style={{ color: '#858ab0' }}>Generate high-quality images and artwork</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        {/* Left column */}
        <div style={{ ...wrapper, padding: 16 }}>
          <div style={{ fontWeight: 800, marginBottom: 8, color: '#1b1f4b', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: '#7d83b1' }}>⚙️</span> Describe Your Image
          </div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the image you want to create in detail..."
            style={{ width: '100%', minHeight: 160, borderRadius: 12, border: '1.4px solid #ebe9fb', padding: 14, outline: 'none', fontSize: '1rem', color: '#2a2f60' }}
          />

          {/* Controls row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginTop: 14, alignItems: 'center' }}>
            {/* Style */}
            <div>
              <div style={{ color: '#6a6fa1', fontWeight: 700, marginBottom: 6 }}>Style</div>
              <select value={style} onChange={(e) => setStyle(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #ebe9fb', color: '#3b3f70', fontWeight: 700 }}>
                {styles.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            {/* Aspect Ratio */}
            <div>
              <div style={{ color: '#6a6fa1', fontWeight: 700, marginBottom: 6 }}>Aspect Ratio</div>
              <select value={ratio} onChange={(e) => setRatio(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #ebe9fb', color: '#3b3f70', fontWeight: 700 }}>
                {ratios.map((r) => (
                  <option key={r.key} value={r.key}>{r.label}</option>
                ))}
              </select>
            </div>
            {/* Quality */}
            <div>
              <div style={{ color: '#6a6fa1', fontWeight: 700, marginBottom: 6 }}>Quality: {quality}%</div>
              <input type="range" min={20} max={100} step={5} value={quality} onChange={(e) => setQuality(parseInt(e.target.value))} style={{ width: '100%' }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button
              onClick={handleGenerate}
              disabled={isLoading || !prompt.trim()}
              style={{ background: 'linear-gradient(90deg,#14cbbe 18%,#4baaff 98%)', color: '#fff', fontWeight: 800, fontSize: '1rem', padding: '10px 16px', borderRadius: 12, border: 'none', opacity: isLoading || !prompt.trim() ? 0.7 : 1, cursor: isLoading || !prompt.trim() ? 'not-allowed' : 'pointer' }}
            >
              {isLoading ? 'Generating...' : 'Generate Image'}
            </button>
            <button onClick={() => { setPrompt(''); setImageUrl('') }} style={{ background: '#f5f4fe', color: '#5b61a3', fontWeight: 800, fontSize: '1rem', padding: '10px 16px', borderRadius: 12, border: '1px solid #ebe9fb', cursor: 'pointer' }}>Clear</button>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ ...wrapper, padding: 16 }}>
            <div style={{ fontWeight: 800, marginBottom: 8, color: '#1b1f4b' }}>Example Prompts</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {EXAMPLES.map((ex, idx) => (
                <button key={idx} onClick={() => setPrompt(ex)} style={{ textAlign: 'left', padding: 12, borderRadius: 12, border: '1px solid #ebe9fb', background: '#fff', color: '#414781', cursor: 'pointer' }}>
                  {ex}
                </button>
              ))}
            </div>
          </div>

          <div style={{ ...wrapper, padding: 16 }}>
            <div style={{ fontWeight: 800, marginBottom: 8, color: '#1b1f4b', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>🔧</span> Advanced Settings
            </div>
            <div style={{ color: '#6a6fa1', lineHeight: 1.6 }}>
              <div><strong>Current Settings:</strong></div>
              <div>Style: {style}</div>
              <div>Ratio: {ratios.find(r => r.key === ratio)?.label}</div>
              <div>Quality: {quality}%</div>
            </div>
          </div>

          <div style={{ ...wrapper, padding: 16 }}>
            <div style={{ fontWeight: 800, marginBottom: 8, color: '#1b1f4b' }}>Preview</div>
            <div style={{ width: '100%', aspectRatio: activeAspect, border: '2px dashed #cfcaf5', borderRadius: 16, background: '#faf9ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {imageUrl ? (
                <img src={imageUrl} alt="result" style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: 12 }} />
              ) : (
                <div style={{ color: '#6a6fa1', textAlign: 'center', padding: 16 }}>No image yet. Enter a prompt and generate.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImageCreator


