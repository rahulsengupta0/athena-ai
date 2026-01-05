import React, { useMemo, useState } from 'react'

const wrapper = { background: '#fff', border: '1.6px solid #efeefa', borderRadius: 16, boxShadow: '0 3px 16px #e9e4f33d' }

const EXAMPLE_BRANDS = [
  { name: 'EcoTech Solutions', industry: 'Technology', desc: 'Sustainable technology solutions for modern businesses' },
  { name: 'Urban Wellness', industry: 'Healthcare', desc: 'Modern wellness center focusing on mental and physical health' },
  { name: 'Craft Coffee Co.', industry: 'Food & Beverage', desc: 'Artisanal coffee roaster with focus on fair trade' },
]

const PACKAGE_INCLUDES = [
  'Logo design variations', 'Color palette', 'Typography system', 'Brand guidelines',
  'Business card templates', 'Letterhead templates', 'Social media templates', 'Brand voice & tone guide'
]

const TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'colors', label: 'Colors' },
  { key: 'typography', label: 'Typography' },
  { key: 'assets', label: 'Assets' },
]

const pill = (active) => ({ padding: '9px 16px', borderRadius: 999, fontWeight: 800, fontSize: '.96rem', color: active ? '#fff' : '#6169a5', background: active ? '#7f5bff' : '#f1effd', border: active ? '1px solid #7f5bff' : '1px solid #ebe9fb', cursor: 'pointer' })

const BrandBuilder = () => {
  const [brandName, setBrandName] = useState('EcoTech Solutions')
  const [industry, setIndustry] = useState('Technology')
  const [description, setDescription] = useState('Sustainable technology solutions for modern businesses')
  const [audience, setAudience] = useState('Young professionals, Small business owners')
  const [pkg, setPkg] = useState(null)
  const [tab, setTab] = useState('overview')

  const guidelines = useMemo(() => ({
    voice: 'Professional yet approachable',
    tone: 'Confident and innovative',
    values: ['Innovation', 'Reliability', 'Sustainability']
  }), [])

  const onGenerate = () => {
    setPkg({
      name: brandName,
      description,
      industry,
      audience,
      logoConcept: 'Modern geometric logo with clean typography',
      colors: ['#6C63FF', '#2AB8ED', '#1A1F47', '#F5F4FE'],
      typography: { heading: 'Inter', body: 'Inter' },
      guidelines,
    })
  }

  const onDownload = () => {
    if (!pkg) return
    const content = `Brand Package: ${pkg.name}\nIndustry: ${pkg.industry}\nAudience: ${pkg.audience}\nDescription: ${pkg.description}\nColors: ${pkg.colors.join(', ')}\nTypography: H ${pkg.typography.heading} / B ${pkg.typography.body}\nGuidelines: Voice ${pkg.guidelines.voice}; Tone ${pkg.guidelines.tone}; Values ${pkg.guidelines.values.join(', ')}`
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${pkg.name.replace(/\s+/g,'_')}_brand_package.txt`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <div style={{ width: 38, height: 38, borderRadius: 12, background: '#fae6f2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fa8bb5', fontWeight: 800, fontSize: 20 }}>🏷️</div>
        <div>
          <div style={{ fontSize: '1.55rem', fontWeight: 800, color: '#1a1f47' }}>AI Brand Builder</div>
          <div style={{ color: '#858ab0' }}>Complete brand identity packages</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Brand Information */}
          <div style={{ ...wrapper, padding: 16 }}>
            <div style={{ fontWeight: 800, color: '#1b1f4b', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>✨</span> Brand Information
            </div>
            <div style={{ color: '#8a8fb0', marginBottom: 10 }}>Tell us about your brand and we'll create a complete identity package</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <div style={{ color: '#6a6fa1', fontWeight: 700, marginBottom: 6 }}>Brand Name *</div>
                <input value={brandName} onChange={(e) => setBrandName(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #ebe9fb', color: '#3b3f70', fontWeight: 600 }} />
              </div>
              <div>
                <div style={{ color: '#6a6fa1', fontWeight: 700, marginBottom: 6 }}>Industry</div>
                <input value={industry} onChange={(e) => setIndustry(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #ebe9fb', color: '#3b3f70', fontWeight: 600 }} />
              </div>
            </div>
            <div style={{ marginTop: 12 }}>
              <div style={{ color: '#6a6fa1', fontWeight: 700, marginBottom: 6 }}>Brand Description *</div>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: '100%', minHeight: 100, borderRadius: 12, border: '1.4px solid #ebe9fb', padding: 14, outline: 'none', fontSize: '1rem', color: '#2a2f60' }} />
            </div>
            <div style={{ marginTop: 12 }}>
              <div style={{ color: '#6a6fa1', fontWeight: 700, marginBottom: 6 }}>Target Audience</div>
              <input value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="e.g., Young professionals, Small business owners" style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #ebe9fb', color: '#3b3f70', fontWeight: 600 }} />
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
              <button onClick={onGenerate} style={{ background: 'linear-gradient(90deg,#fa8bb5 18%,#ff7188 98%)', color: '#fff', fontWeight: 800, fontSize: '1rem', padding: '10px 16px', borderRadius: 12, border: 'none', cursor: 'pointer' }}>Generate Brand Package</button>
              <button onClick={() => { setBrandName(''); setIndustry(''); setDescription(''); setAudience(''); setPkg(null); }} style={{ background: '#f5f4fe', color: '#5b61a3', fontWeight: 800, fontSize: '1rem', padding: '10px 16px', borderRadius: 12, border: '1px solid #ebe9fb', cursor: 'pointer' }}>Clear</button>
            </div>
          </div>

          {/* Brand Package */}
          {pkg && (
            <div style={{ ...wrapper, padding: 16 }}>
              <div style={{ fontWeight: 800, color: '#1b1f4b', marginBottom: 4 }}>Brand Package: {pkg.name}</div>
              <div style={{ color: '#8a8fb0', marginBottom: 12 }}>Complete brand identity generated by AI</div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                {TABS.map(t => (
                  <button key={t.key} onClick={() => setTab(t.key)} style={pill(tab === t.key)}>{t.label}</button>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                {/* Left: Logo/Preview */}
                <div>
                  <div style={{ color: '#1b1f4b', fontWeight: 800, marginBottom: 8 }}>Logo Concept</div>
                  <div style={{ width: '100%', aspectRatio: '1 / 1', borderRadius: 12, background: 'linear-gradient(135deg,#f6f4ff,#efeffa)', border: '1px solid #ebe9fb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9096bb' }}>Logo Preview</div>
                  <div style={{ color: '#8a8fb0', marginTop: 10 }}>{pkg.logoConcept}</div>
                </div>

                {/* Right: Guidelines */}
                <div>
                  <div style={{ color: '#1b1f4b', fontWeight: 800, marginBottom: 8 }}>Brand Guidelines</div>
                  <div style={{ color: '#3b3f70', marginBottom: 6 }}><strong>Voice:</strong> {pkg.guidelines.voice}</div>
                  <div style={{ color: '#3b3f70', marginBottom: 8 }}><strong>Tone:</strong> {pkg.guidelines.tone}</div>
                  <div style={{ color: '#3b3f70', marginBottom: 6 }}><strong>Values:</strong></div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                    {pkg.guidelines.values.map(v => (
                      <span key={v} style={{ padding: '6px 10px', borderRadius: 999, background: '#f1effd', border: '1px solid #ebe9fb', color: '#6169a5', fontWeight: 800 }}>{v}</span>
                    ))}
                  </div>

                  {/* Colors / Typography quick view depending on tab for realism */}
                  {tab === 'colors' && (
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      {pkg.colors.map(c => (
                        <div key={c} style={{ width: 72, height: 72, borderRadius: 12, border: '1px solid #ebe9fb', background: c }} title={c} />
                      ))}
                    </div>
                  )}
                  {tab === 'typography' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, color: '#2a2f60' }}>
                      <div style={{ fontFamily: pkg.typography.heading, fontWeight: 800, fontSize: 24 }}>Heading – {pkg.typography.heading}</div>
                      <div style={{ fontFamily: pkg.typography.body }}>Body – {pkg.typography.body}</div>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ marginTop: 18 }}>
                <button onClick={onDownload} style={{ width: '100%', background: '#ff4d7f', color: '#fff', border: 'none', padding: '14px 18px', borderRadius: 12, fontWeight: 800, boxShadow: '0 3px 10px #ff6a9a33', cursor: 'pointer' }}>⬇  Download Complete Brand Package</button>
              </div>
            </div>
          )}
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Example Brands */}
          <div style={{ ...wrapper, padding: 16 }}>
            <div style={{ fontWeight: 800, color: '#1b1f4b', marginBottom: 8 }}>Example Brands</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {EXAMPLE_BRANDS.map((b, i) => (
                <div key={i} style={{ border: '1px solid #ebe9fb', borderRadius: 12, padding: 12 }}>
                  <div style={{ fontWeight: 800, color: '#1b1f4b' }}>{b.name}</div>
                  <div style={{ color: '#8a8fb0' }}>{b.industry}</div>
                  <div style={{ color: '#6a6fa1' }}>{b.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Package Includes */}
          <div style={{ ...wrapper, padding: 16 }}>
            <div style={{ fontWeight: 800, color: '#1b1f4b', marginBottom: 8 }}>Package Includes</div>
            <ul style={{ margin: 0, paddingLeft: 18, color: '#6a6fa1', lineHeight: 1.7 }}>
              {PACKAGE_INCLUDES.map((i) => (<li key={i}> {i} </li>))}
            </ul>
          </div>

          {/* Branding Tips */}
          <div style={{ ...wrapper, padding: 16 }}>
            <div style={{ fontWeight: 800, color: '#1b1f4b', marginBottom: 8 }}>Branding Tips</div>
            <ul style={{ margin: 0, paddingLeft: 18, color: '#6a6fa1', lineHeight: 1.7 }}>
              <li>Be clear about your brand's mission</li>
              <li>Define your unique value proposition</li>
              <li>Consider your target audience's preferences</li>
              <li>Think about brand personality traits</li>
              <li>Include competitive differentiation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BrandBuilder



