import React, { useMemo, useState } from 'react'
import api from '../../../services/api'

const wrapper = { background: '#fff', border: '1.6px solid #efeefa', borderRadius: 16, boxShadow: '0 3px 16px #e9e4f33d' }

const CONTENT_TYPES = ['Blog Post', 'How-to Guide', 'Listicle', 'Case Study']
const TONES = ['Professional', 'Friendly', 'Persuasive', 'Casual']
const TEMPLATE_TABS = [
  { key: 'blog', label: 'Blog' },
  { key: 'social', label: 'Social' },
  { key: 'email', label: 'Email' },
]

const BLOG_TEMPLATES = [
  'Write a comprehensive guide about [topic] for beginners',
  "Create a listicle: '10 Best Practices for [topic]'",
  'Write a case study about successful [topic] implementation',
]
const SOCIAL_TEMPLATES = [
  'Create a series of 3 tweets promoting [product]',
  'Write an engaging LinkedIn post about [topic]',
  'Craft an Instagram caption with relevant hashtags for [topic]'
]
const EMAIL_TEMPLATES = [
  'Write a welcome email for new subscribers',
  'Draft a promotional email announcing a discount',
  'Create a follow-up email for webinar attendees'
]

const getTemplatesForTab = (tab) => {
  if (tab === 'social') return SOCIAL_TEMPLATES
  if (tab === 'email') return EMAIL_TEMPLATES
  return BLOG_TEMPLATES
}

const ContentWriter = () => {
  const [contentType, setContentType] = useState(CONTENT_TYPES[0])
  const [tone, setTone] = useState(TONES[0])
  const [audience, setAudience] = useState('')
  const [brief, setBrief] = useState('')
  const [tab, setTab] = useState('blog')
  const [isLoading, setIsLoading] = useState(false)
  const [output, setOutput] = useState('')

  const countWords = (text) => text.trim().split(/\s+/).filter(Boolean).length
  const copyOutput = async () => {
    try {
      await navigator.clipboard.writeText(output)
    } catch (_) {}
  }

  const templates = useMemo(() => getTemplatesForTab(tab), [tab])

const handleGenerate = async () => {
  if (!brief.trim()) return;
  setIsLoading(true);
  setOutput('');

  try {
    const data = await api.generateContent(brief);

    setOutput(data.result || 'No content received');
  } catch (error) {
    setOutput('Error: ' + error.message);
  } finally {
    setIsLoading(false);
  }
};



  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <div style={{ width: 38, height: 38, borderRadius: 12, background: '#e0f5ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#409cff', fontWeight: 800, fontSize: 20 }}>✍️</div>
        <div>
          <div style={{ fontSize: '1.55rem', fontWeight: 800, color: '#1a1f47' }}>AI Content Writer</div>
          <div style={{ color: '#858ab0' }}>AI-powered content and copywriting</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Content Setup */}
          <div style={{ ...wrapper, padding: 16 }}>
            <div style={{ fontWeight: 800, color: '#1b1f4b', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>🧩</span> Content Setup
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <div>
                <div style={{ color: '#6a6fa1', fontWeight: 700, marginBottom: 6 }}>Content Type</div>
                <select value={contentType} onChange={(e) => setContentType(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #ebe9fb', color: '#3b3f70', fontWeight: 700 }}>
                  {CONTENT_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <div style={{ color: '#6a6fa1', fontWeight: 700, marginBottom: 6 }}>Tone</div>
                <select value={tone} onChange={(e) => setTone(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #ebe9fb', color: '#3b3f70', fontWeight: 700 }}>
                  {TONES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <div style={{ color: '#6a6fa1', fontWeight: 700, marginBottom: 6 }}>Target Audience</div>
                <input value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="e.g., small business owners" style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #ebe9fb', color: '#3b3f70', fontWeight: 600 }} />
              </div>
            </div>
          </div>

          {/* Content Brief */}
          <div style={{ ...wrapper, padding: 16 }}>
            <div style={{ fontWeight: 800, color: '#1b1f4b', marginBottom: 8 }}>Content Brief</div>
            <div style={{ color: '#8a8fb0', marginBottom: 8 }}>Long-form articles and posts</div>
            <textarea value={brief} onChange={(e) => setBrief(e.target.value)} placeholder="Describe what content you want to create..." style={{ width: '100%', minHeight: 180, borderRadius: 12, border: '1.4px solid #ebe9fb', padding: 14, outline: 'none', fontSize: '1rem', color: '#2a2f60' }} />
            <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
              <button onClick={handleGenerate} disabled={isLoading || !brief.trim()} style={{ background: 'linear-gradient(90deg,#87b6ff 18%,#9ad8ff 98%)', color: '#fff', fontWeight: 800, fontSize: '1rem', padding: '10px 16px', borderRadius: 12, border: 'none', opacity: isLoading || !brief.trim() ? 0.7 : 1, cursor: isLoading || !brief.trim() ? 'not-allowed' : 'pointer' }}> {isLoading ? 'Generating...' : 'Generate Content'} </button>
              <button onClick={() => { setBrief(''); setOutput('') }} style={{ background: '#f5f4fe', color: '#5b61a3', fontWeight: 800, fontSize: '1rem', padding: '10px 16px', borderRadius: 12, border: '1px solid #ebe9fb', cursor: 'pointer' }}>Clear</button>
            </div>
          </div>

          {/* Generated Content */}
          {output && (
            <>
              <div style={{ fontWeight: 800, color: '#1b1f4b' }}>Generated Content</div>
              <div style={{ ...wrapper, padding: 16, marginTop: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ padding: '6px 10px', borderRadius: 999, background: '#f1effd', border: '1px solid #ebe9fb', color: '#6169a5', fontWeight: 800 }}>{tab === 'social' ? 'Social Media' : tab === 'email' ? 'Email' : 'Blog'}</span>
                    <span style={{ padding: '6px 10px', borderRadius: 999, background: '#f1effd', border: '1px solid #ebe9fb', color: '#6169a5', fontWeight: 800 }}>{tone.toLowerCase()}</span>
                    <span style={{ padding: '6px 10px', borderRadius: 999, background: '#f1effd', border: '1px solid #ebe9fb', color: '#6169a5', fontWeight: 800 }}>{countWords(output)} words</span>
                  </div>
                  <button onClick={copyOutput} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', borderRadius: 10, border: '1px solid #ebe9fb', background: '#fff', color: '#414781', cursor: 'pointer' }}>
                    📋 Copy
                  </button>
                </div>
                <div style={{ color: '#6a6fa1', marginBottom: 10 }}>Prompt: {brief}</div>
                <div style={{ border: '1px solid #ebe9fb', borderRadius: 12, background: '#fafaff', padding: 12 }}>
                  <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace', color: '#2f3569' }}>{output}</pre>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Templates */}
          <div style={{ ...wrapper, padding: 16 }}>
            <div style={{ fontWeight: 800, color: '#1b1f4b', marginBottom: 10 }}>Templates</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              {TEMPLATE_TABS.map(t => (
                <button key={t.key} onClick={() => setTab(t.key)} style={{ padding: '8px 12px', borderRadius: 999, fontWeight: 800, border: tab === t.key ? '1px solid #7f5bff' : '1px solid #ebe9fb', color: tab === t.key ? '#fff' : '#6169a5', background: tab === t.key ? '#7f5bff' : '#f1effd', cursor: 'pointer' }}>{t.label}</button>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {templates.map((tpl, i) => (
                <button key={i} onClick={() => setBrief(tpl)} style={{ textAlign: 'left', padding: 12, borderRadius: 12, border: '1px solid #ebe9fb', background: '#fff', color: '#414781', cursor: 'pointer' }}>{tpl}</button>
              ))}
            </div>
          </div>

          {/* Writing Tips */}
          <div style={{ ...wrapper, padding: 16 }}>
            <div style={{ fontWeight: 800, color: '#1b1f4b', marginBottom: 8 }}>Writing Tips</div>
            <ul style={{ margin: 0, paddingLeft: 18, color: '#6a6fa1', lineHeight: 1.6 }}>
              <li>Be specific about your requirements</li>
              <li>Include target keywords if needed</li>
              <li>Specify desired length or word count</li>
              <li>Mention any specific points to cover</li>
              <li>Include call-to-action requirements</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContentWriter


