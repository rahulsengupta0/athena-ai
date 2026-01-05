import React, { useMemo, useState } from 'react'

const wrapper = { background: '#fff', border: '1.6px solid #efeefa', borderRadius: 16, boxShadow: '0 3px 16px #e9e4f33d' }

const VIDEO_TYPES = ['Explainer Video', 'Promo Video', 'Tutorial', 'Logo Reveal']
const VISUAL_STYLES = ['Modern', 'Minimal', 'Playful', 'Corporate']
const CONCEPTS = [
  'Create a product launch video for a new mobile app',
  'Generate an explainer video about sustainable energy',
  'Make an animated logo reveal with modern transitions',
  'Create a social media video promoting a flash sale',
  'Generate a tutorial video for using a software tool',
  'Create a company introduction video with professional tone',
]

const VideoProducer = () => {
  const [videoType, setVideoType] = useState(VIDEO_TYPES[0])
  const [visualStyle, setVisualStyle] = useState(VISUAL_STYLES[0])
  const [duration, setDuration] = useState(30)
  const [concept, setConcept] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [generated, setGenerated] = useState(null)
  const [showPreview, setShowPreview] = useState(false)

  const durationLabel = useMemo(() => `${duration}s`, [duration])

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
        <div style={{ width: 38, height: 38, borderRadius: 12, background: '#f2e8fd', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a365ec', fontWeight: 800, fontSize: 20 }}>🎬</div>
        <div>
          <div style={{ fontSize: '1.55rem', fontWeight: 800, color: '#1a1f47' }}>AI Video Producer</div>
          <div style={{ color: '#858ab0' }}>Create animated videos and presentations</div>
        </div>
      </div>
      <div style={{ marginBottom: 12 }}>
        <span style={{ background: '#fff3bd', color: '#7a5a00', padding: '4px 10px', borderRadius: 999, fontWeight: 800, fontSize: '.9rem', border: '1px solid #ffe8a3' }}>Pro Feature</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Video Setup */}
          <div style={{ ...wrapper, padding: 16 }}>
            <div style={{ fontWeight: 800, color: '#1b1f4b', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>🎛️</span> Video Setup
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <div style={{ color: '#6a6fa1', fontWeight: 700, marginBottom: 6 }}>Video Type</div>
                <select value={videoType} onChange={(e) => setVideoType(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #ebe9fb', color: '#3b3f70', fontWeight: 700 }}>
                  {VIDEO_TYPES.map((v) => (<option key={v} value={v}>{v}</option>))}
                </select>
                <div style={{ color: '#9aa0c5', marginTop: 6, fontSize: '.92rem' }}>Educational and informative videos</div>
              </div>
              <div>
                <div style={{ color: '#6a6fa1', fontWeight: 700, marginBottom: 6 }}>Visual Style</div>
                <select value={visualStyle} onChange={(e) => setVisualStyle(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #ebe9fb', color: '#3b3f70', fontWeight: 700 }}>
                  {VISUAL_STYLES.map((s) => (<option key={s} value={s}>{s}</option>))}
                </select>
              </div>
            </div>
            <div style={{ marginTop: 16 }}>
              <div style={{ color: '#6a6fa1', fontWeight: 700, marginBottom: 8 }}>Duration: {durationLabel}</div>
              <input type="range" min={10} max={120} step={5} value={duration} onChange={(e) => setDuration(parseInt(e.target.value))} style={{ width: '100%' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#9aa0c5', fontSize: '.88rem', marginTop: 4 }}>
                <span>10s</span><span>30s</span><span>60s</span><span>120s</span>
              </div>
            </div>
          </div>

          {/* Video Script & Concept */}
          <div style={{ ...wrapper, padding: 16 }}>
            <div style={{ fontWeight: 800, color: '#1b1f4b', marginBottom: 8 }}>Video Script & Concept</div>
            <textarea value={concept} onChange={(e) => setConcept(e.target.value)} placeholder="Describe your video concept, script, or key messages..." style={{ width: '100%', minHeight: 160, borderRadius: 12, border: '1.4px solid #ebe9fb', padding: 14, outline: 'none', fontSize: '1rem', color: '#2a2f60' }} />
            <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
              <button
                onClick={() => {
                  if (!concept.trim()) return
                  setIsLoading(true)
                  setTimeout(() => {
                    // Demo generated video (replace src with your API result later)
                    setGenerated({
                      title: concept,
                      type: videoType,
                      style: visualStyle.toLowerCase(),
                      duration,
                      src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'
                    })
                    setIsLoading(false)
                  }, 900)
                }}
                disabled={isLoading || !concept.trim()}
                style={{ background: 'linear-gradient(90deg,#a365ec 18%,#4baaff 98%)', color: '#fff', fontWeight: 800, fontSize: '1rem', padding: '10px 16px', borderRadius: 12, border: 'none', opacity: isLoading || !concept.trim() ? 0.7 : 1, cursor: isLoading || !concept.trim() ? 'not-allowed' : 'pointer' }}
              >
                {isLoading ? 'Creating...' : 'Create Video'}
              </button>
              <button onClick={() => setConcept('')} style={{ background: '#f5f4fe', color: '#5b61a3', fontWeight: 800, fontSize: '1rem', padding: '10px 16px', borderRadius: 12, border: '1px solid #ebe9fb', cursor: 'pointer' }}>Clear</button>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Example Concepts */}
          <div style={{ ...wrapper, padding: 16 }}>
            <div style={{ fontWeight: 800, color: '#1b1f4b', marginBottom: 8 }}>Example Concepts</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {CONCEPTS.map((c, i) => (
                <button key={i} onClick={() => setConcept(c)} style={{ textAlign: 'left', padding: 12, borderRadius: 12, border: '1px solid #ebe9fb', background: '#fff', color: '#414781', cursor: 'pointer' }}>{c}</button>
              ))}
            </div>
          </div>

          {/* Video Guidelines */}
          <div style={{ ...wrapper, padding: 16 }}>
            <div style={{ fontWeight: 800, color: '#1b1f4b', marginBottom: 8 }}>Video Guidelines</div>
            <div style={{ color: '#6a6fa1', lineHeight: 1.6 }}>
              <div><strong>Current Settings:</strong></div>
              <div>Type: {videoType}</div>
              <div>Style: {visualStyle.toLowerCase()}</div>
              <div>Duration: {durationLabel}</div>
              <div style={{ marginTop: 8 }}><strong>Tips:</strong></div>
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                <li>Keep scripts clear and concise</li>
                <li>Specify key visual elements</li>
                <li>Include brand colors if needed</li>
                <li>Mention target audience</li>
                <li>Define the main message</li>
              </ul>
            </div>
          </div>

          {/* Pro Banner */}
          <div style={{ background: '#fff8db', border: '1px solid #ffe59a', borderRadius: 16, padding: 16 }}>
            <div style={{ fontWeight: 800, color: '#7a5a00', marginBottom: 6 }}>Pro Feature</div>
            <div style={{ color: '#8a6c00', marginBottom: 12 }}>Video generation requires a Pro subscription.</div>
            <button style={{ background: '#d39b00', color: '#fff', padding: '10px 14px', borderRadius: 10, border: 'none', fontWeight: 800, cursor: 'pointer' }}>Upgrade to Pro</button>
          </div>
        </div>
      </div>

      {/* Generated Videos section */}
      {generated && (
        <div style={{ marginTop: 16 }}>
          <div style={{ fontWeight: 800, color: '#1b1f4b', marginBottom: 8 }}>Generated Videos</div>
          <div style={{ ...wrapper, padding: 16 }}>
            <div style={{ display: 'flex', gap: 16 }}>
              <div style={{ position: 'relative', width: 360 }}>
                <div onClick={() => setShowPreview(true)} style={{ width: '100%', aspectRatio: '16 / 9', borderRadius: 12, background: 'linear-gradient(135deg,#f6f4ff,#efeffa)', border: '1px solid #ebe9fb', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#ffffff', border: '1px solid #e6e4f7', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 10px #00000014' }}>
                    ▶
                  </div>
                </div>
                <div style={{ position: 'absolute', right: 10, bottom: 10, background: '#3b3f70', color: '#fff', fontWeight: 800, fontSize: 12, padding: '4px 8px', borderRadius: 8 }}>{generated.duration}s</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: '#3b3f70', fontWeight: 700, marginBottom: 6 }}>{generated.title}</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
                  <span style={{ padding: '6px 10px', borderRadius: 999, background: '#f1effd', border: '1px solid #ebe9fb', color: '#6169a5', fontWeight: 800 }}>{generated.type.split(' ')[0].toLowerCase()}</span>
                  <span style={{ padding: '6px 10px', borderRadius: 999, background: '#f1effd', border: '1px solid #ebe9fb', color: '#6169a5', fontWeight: 800 }}>{generated.style}</span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => setShowPreview(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', borderRadius: 10, border: '1px solid #ebe9fb', background: '#fff', color: '#414781', cursor: 'pointer' }}>▶ Preview</button>
                  <a href={generated.src} download="generated-video.mp4" style={{ textDecoration: 'none' }}>
                    <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', borderRadius: 10, border: '1px solid #ebe9fb', background: '#fff', color: '#414781', cursor: 'pointer' }}>⬇ Download</button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && generated && (
        <div onClick={() => setShowPreview(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: 'min(900px, 92vw)', background: '#0b0e12', borderRadius: 14, overflow: 'hidden', boxShadow: '0 10px 40px #00000055' }}>
            <video src={generated.src} controls autoPlay style={{ width: '100%', height: 'auto' }} />
          </div>
        </div>
      )}
    </div>
  )
}

export default VideoProducer


