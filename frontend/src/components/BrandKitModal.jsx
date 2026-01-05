import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const BrandKitModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [creatingBrandKit, setCreatingBrandKit] = useState(false);
  const [brandForm, setBrandForm] = useState({
    name: '',
    primaryColor: '#6b8cff',
    secondaryColor: '#16a34a',
    tagline: '',
    logoDescription: '',
    bannerDescription: '',
    posterDescription: ''
  });

const handleCreate = async () => {
  if (creatingBrandKit) return;

  if (
    !brandForm.name ||
    !brandForm.logoDescription ||
    !brandForm.bannerDescription ||
    !brandForm.posterDescription
  ) {
    alert('Please fill in all required fields');
    return;
  }

  setCreatingBrandKit(true);

  try {
    const payload = {
      name: brandForm.name,
      tagline: brandForm.tagline,
      primaryColor: brandForm.primaryColor,
      secondaryColor: brandForm.secondaryColor,
      logoDescription: brandForm.logoDescription,
      bannerDescription: brandForm.bannerDescription,
      posterDescription: brandForm.posterDescription,
    };

    const data = await api.request('/api/generate-brandkit', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    navigate("/brand-kit-result", { state: data });
    onClose();

  } catch (e) {
    console.error(e);
    alert("Failed to create brand kit: " + (e.message || "Unknown error"));
  } finally {
    setCreatingBrandKit(false);
  }
};


  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1200,
        padding: 16,
        animation: 'fadeIn 0.3s ease-out',
      }}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 'min(92vw, 920px)',
          maxWidth: '920px',
          background: 'linear-gradient(to bottom, #ffffff 0%, #fafbfc 100%)',
          borderRadius: 24,
          boxShadow: '0 25px 80px rgba(15, 23, 42, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh',
          animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          padding: '28px 32px', 
          borderBottom: '1px solid rgba(226, 232, 240, 0.8)', 
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(99, 102, 241, 0.06) 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            background: 'radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)',
            pointerEvents: 'none'
          }} />
          <div style={{ 
            fontWeight: 700, 
            color: '#0f172a', 
            fontSize: '1.5rem', 
            letterSpacing: '-0.02em',
            position: 'relative',
            zIndex: 1
          }}>
            Create Brand Kit
          </div>
          <button 
            onClick={onClose} 
            style={{ 
              marginLeft: 'auto', 
              border: 'none', 
              background: 'rgba(255, 255, 255, 0.8)', 
              backdropFilter: 'blur(10px)',
              borderRadius: 12, 
              padding: '10px 14px', 
              cursor: 'pointer', 
              color: '#64748b', 
              fontWeight: 600,
              fontSize: '1.1rem',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative',
              zIndex: 1,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
            }}
            onMouseEnter={(e) => { 
              e.target.style.background = 'rgba(241, 245, 249, 0.95)'; 
              e.target.style.color = '#1e293b';
              e.target.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => { 
              e.target.style.background = 'rgba(255, 255, 255, 0.8)'; 
              e.target.style.color = '#64748b';
              e.target.style.transform = 'scale(1)';
            }}
          >
            ✕
          </button>
        </div>
        
        <div style={{ 
          padding: '32px', 
          maxHeight: '80vh', 
          overflowY: 'auto',
          background: 'linear-gradient(to bottom, #ffffff 0%, #fafbfc 100%)'
        }}>
          {/* Brand Information Section */}
          <div style={{ marginBottom: 32 }}>
            <h3 style={{ 
              fontWeight: 600, 
              color: '#0f172a', 
              marginBottom: 20, 
              fontSize: '1.15rem', 
              display: 'flex', 
              alignItems: 'center', 
              gap: 12,
              letterSpacing: '-0.01em'
            }}>
              <span style={{ 
                fontSize: '1.5rem', 
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
              }}></span> 
              <span>Brand Information</span>
            </h3>
            <div style={{ 
              background: 'linear-gradient(to bottom, #ffffff 0%, #f8fafc 100%)', 
              border: '1px solid rgba(226, 232, 240, 0.8)', 
              borderRadius: 16, 
              padding: 24,
              boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    fontWeight: 600, 
                    marginBottom: 10, 
                    color: '#1e293b', 
                    fontSize: '0.875rem',
                    letterSpacing: '0.01em'
                  }}>
                    Brand Name <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input 
                    value={brandForm.name} 
                    onChange={(e)=>setBrandForm({ ...brandForm, name: e.target.value })} 
                    placeholder="Acme Inc" 
                    style={{ 
                      width:'100%', 
                      border:'1.5px solid #e2e8f0', 
                      borderRadius:12, 
                      padding:'14px 16px', 
                      outline:'none', 
                      fontSize: '0.95rem', 
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      background: '#ffffff',
                      color: '#0f172a',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
                    }} 
                    onFocus={(e) => {
                      e.target.style.borderColor = '#8b5cf6';
                      e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1), 0 2px 8px rgba(139, 92, 246, 0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.04)';
                    }}
                  />
                </div>
                <div>
                  <label style={{ 
                    display: 'block', 
                    fontWeight: 600, 
                    marginBottom: 10, 
                    color: '#1e293b', 
                    fontSize: '0.875rem',
                    letterSpacing: '0.01em'
                  }}>
                    Tagline
                  </label>
                  <input 
                    value={brandForm.tagline} 
                    onChange={(e)=>setBrandForm({ ...brandForm, tagline: e.target.value })} 
                    placeholder="Build something great" 
                    style={{ 
                      width:'100%', 
                      border:'1.5px solid #e2e8f0', 
                      borderRadius:12, 
                      padding:'14px 16px', 
                      outline:'none', 
                      fontSize: '0.95rem', 
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      background: '#ffffff',
                      color: '#0f172a',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
                    }} 
                    onFocus={(e) => {
                      e.target.style.borderColor = '#8b5cf6';
                      e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1), 0 2px 8px rgba(139, 92, 246, 0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.04)';
                    }}
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    fontWeight: 600, 
                    marginBottom: 10, 
                    color: '#1e293b', 
                    fontSize: '0.875rem',
                    letterSpacing: '0.01em'
                  }}>
                    Primary Color
                  </label>
                  <input 
                    type="color" 
                    value={brandForm.primaryColor} 
                    onChange={(e)=>setBrandForm({ ...brandForm, primaryColor: e.target.value })} 
                    style={{ 
                      width:'100%', 
                      height:52, 
                      border:'1.5px solid #e2e8f0', 
                      borderRadius:12, 
                      padding:0, 
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
                    }} 
                    onFocus={(e) => {
                      e.target.style.borderColor = '#8b5cf6';
                      e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1), 0 2px 8px rgba(139, 92, 246, 0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.04)';
                    }}
                  />
                </div>
                <div>
                  <label style={{ 
                    display: 'block', 
                    fontWeight: 600, 
                    marginBottom: 10, 
                    color: '#1e293b', 
                    fontSize: '0.875rem',
                    letterSpacing: '0.01em'
                  }}>
                    Secondary Color
                  </label>
                  <input 
                    type="color" 
                    value={brandForm.secondaryColor} 
                    onChange={(e)=>setBrandForm({ ...brandForm, secondaryColor: e.target.value })} 
                    style={{ 
                      width:'100%', 
                      height:52, 
                      border:'1.5px solid #e2e8f0', 
                      borderRadius:12, 
                      padding:0, 
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
                    }} 
                    onFocus={(e) => {
                      e.target.style.borderColor = '#8b5cf6';
                      e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1), 0 2px 8px rgba(139, 92, 246, 0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.04)';
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Logo Section */}
          <div style={{ marginBottom: 32 }}>
            <h3 style={{ 
              fontWeight: 600, 
              color: '#0f172a', 
              marginBottom: 20, 
              fontSize: '1.15rem', 
              display: 'flex', 
              alignItems: 'center', 
              gap: 12,
              letterSpacing: '-0.01em'
            }}>
              <span style={{ 
                fontSize: '1.5rem', 
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
              }}></span> 
              <span>Logo Design</span>
            </h3>
            <div style={{ 
              background: 'linear-gradient(to bottom, #ffffff 0%, #fef3ff 100%)', 
              border: '1.5px solid rgba(217, 70, 239, 0.2)', 
              borderRadius: 16, 
              padding: 24, 
              boxShadow: '0 4px 16px rgba(217, 70, 239, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: 'linear-gradient(90deg, #d946ef 0%, #a855f7 50%, #8b5cf6 100%)',
                opacity: 0.6
              }} />
              <label style={{ 
                display: 'block', 
                fontWeight: 600, 
                marginBottom: 10, 
                color: '#1e293b', 
                fontSize: '0.875rem',
                letterSpacing: '0.01em',
                marginTop: 4
              }}>
                Logo Description <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <textarea 
                value={brandForm.logoDescription} 
                onChange={(e)=>setBrandForm({ ...brandForm, logoDescription: e.target.value })} 
                placeholder="Describe your logo: style, elements, symbols, typography (e.g., 'Modern minimalist logo with geometric shapes, sans-serif font, clean and professional')"
                style={{ 
                  width:'100%', 
                  minHeight: 110, 
                  border:'1.5px solid #e2e8f0', 
                  borderRadius:12, 
                  padding:'14px 16px', 
                  outline:'none', 
                  fontSize: '0.95rem', 
                  resize: 'vertical', 
                  fontFamily: 'inherit', 
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  background: '#ffffff',
                  color: '#0f172a',
                  lineHeight: '1.6',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
                }} 
                onFocus={(e) => {
                  e.target.style.borderColor = '#d946ef';
                  e.target.style.boxShadow = '0 0 0 3px rgba(217, 70, 239, 0.1), 0 2px 8px rgba(217, 70, 239, 0.15)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.04)';
                }}
              />
              <p style={{ 
                marginTop: 10, 
                fontSize: '0.8125rem', 
                color: '#64748b',
                lineHeight: '1.5'
              }}>
                Be specific about the design style, colors, and elements you want in your logo.
              </p>
            </div>
          </div>

          {/* Banner Section */}
          <div style={{ marginBottom: 32 }}>
            <h3 style={{ 
              fontWeight: 600, 
              color: '#0f172a', 
              marginBottom: 20, 
              fontSize: '1.15rem', 
              display: 'flex', 
              alignItems: 'center', 
              gap: 12,
              letterSpacing: '-0.01em'
            }}>
              <span style={{ 
                fontSize: '1.5rem', 
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
              }}></span> 
              <span>Banner Design</span>
            </h3>
            <div style={{ 
              background: 'linear-gradient(to bottom, #ffffff 0%, #eff6ff 100%)', 
              border: '1.5px solid rgba(59, 130, 246, 0.2)', 
              borderRadius: 16, 
              padding: 24, 
              boxShadow: '0 4px 16px rgba(59, 130, 246, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%)',
                opacity: 0.6
              }} />
              <label style={{ 
                display: 'block', 
                fontWeight: 600, 
                marginBottom: 10, 
                color: '#1e293b', 
                fontSize: '0.875rem',
                letterSpacing: '0.01em',
                marginTop: 4
              }}>
                Banner Description <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <textarea 
                value={brandForm.bannerDescription} 
                onChange={(e)=>setBrandForm({ ...brandForm, bannerDescription: e.target.value })} 
                placeholder="Describe your banner: layout, content, style (e.g., 'Wide horizontal banner with brand name prominently displayed, gradient background, modern and eye-catching design')"
                style={{ 
                  width:'100%', 
                  minHeight: 110, 
                  border:'1.5px solid #e2e8f0', 
                  borderRadius:12, 
                  padding:'14px 16px', 
                  outline:'none', 
                  fontSize: '0.95rem', 
                  resize: 'vertical', 
                  fontFamily: 'inherit', 
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  background: '#ffffff',
                  color: '#0f172a',
                  lineHeight: '1.6',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
                }} 
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1), 0 2px 8px rgba(59, 130, 246, 0.15)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.04)';
                }}
              />
              <p style={{ 
                marginTop: 10, 
                fontSize: '0.8125rem', 
                color: '#64748b',
                lineHeight: '1.5'
              }}>
                Describe the banner layout, dimensions, and visual style you prefer.
              </p>
            </div>
          </div>

          {/* Poster Section */}
          <div style={{ marginBottom: 32 }}>
            <h3 style={{ 
              fontWeight: 600, 
              color: '#0f172a', 
              marginBottom: 20, 
              fontSize: '1.15rem', 
              display: 'flex', 
              alignItems: 'center', 
              gap: 12,
              letterSpacing: '-0.01em'
            }}>
              <span style={{ 
                fontSize: '1.5rem', 
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
              }}></span> 
              <span>Poster Design</span>
            </h3>
            <div style={{ 
              background: 'linear-gradient(to bottom, #ffffff 0%, #fef2f2 100%)', 
              border: '1.5px solid rgba(236, 72, 153, 0.2)', 
              borderRadius: 16, 
              padding: 24, 
              boxShadow: '0 4px 16px rgba(236, 72, 153, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: 'linear-gradient(90deg, #ec4899 0%, #f43f5e 50%, #ef4444 100%)',
                opacity: 0.6
              }} />
              <label style={{ 
                display: 'block', 
                fontWeight: 600, 
                marginBottom: 10, 
                color: '#1e293b', 
                fontSize: '0.875rem',
                letterSpacing: '0.01em',
                marginTop: 4
              }}>
                Poster Description <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <textarea 
                value={brandForm.posterDescription} 
                onChange={(e)=>setBrandForm({ ...brandForm, posterDescription: e.target.value })} 
                placeholder="Describe your poster: theme, layout, message (e.g., 'Promotional poster with bold typography, vibrant colors, call-to-action, professional marketing design')"
                style={{ 
                  width:'100%', 
                  minHeight: 110, 
                  border:'1.5px solid #e2e8f0', 
                  borderRadius:12, 
                  padding:'14px 16px', 
                  outline:'none', 
                  fontSize: '0.95rem', 
                  resize: 'vertical', 
                  fontFamily: 'inherit', 
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  background: '#ffffff',
                  color: '#0f172a',
                  lineHeight: '1.6',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
                }} 
                onFocus={(e) => {
                  e.target.style.borderColor = '#ec4899';
                  e.target.style.boxShadow = '0 0 0 3px rgba(236, 72, 153, 0.1), 0 2px 8px rgba(236, 72, 153, 0.15)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.04)';
                }}
              />
              <p style={{ 
                marginTop: 10, 
                fontSize: '0.8125rem', 
                color: '#64748b',
                lineHeight: '1.5'
              }}>
                Specify the poster's purpose, style, and key visual elements.
              </p>
            </div>
          </div>
        </div>
        
        <div style={{ 
          display:'flex', 
          justifyContent:'space-between', 
          alignItems: 'center', 
          gap:16, 
          padding:'24px 32px', 
          borderTop:'1px solid rgba(226, 232, 240, 0.8)', 
          background: 'linear-gradient(to bottom, #fafbfc 0%, #ffffff 100%)',
          boxShadow: '0 -4px 16px rgba(15, 23, 42, 0.02)'
        }}>
          <div style={{ 
            fontSize: '0.875rem', 
            color: '#64748b',
            fontWeight: 500,
            letterSpacing: '0.01em'
          }}>
            {!brandForm.name || !brandForm.logoDescription || !brandForm.bannerDescription || !brandForm.posterDescription 
              ? 'Please fill in all required fields' 
              : '✨ Ready to generate your brand kit'}
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button 
              onClick={onClose} 
              style={{ 
                border:'1.5px solid #e2e8f0', 
                background:'#ffffff', 
                color:'#475569', 
                borderRadius:12, 
                padding:'12px 24px', 
                cursor:'pointer',
                fontWeight: 600,
                fontSize: '0.9375rem',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                letterSpacing: '0.01em',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
              }}
              onMouseEnter={(e) => { 
                e.target.style.background = '#f1f5f9'; 
                e.target.style.borderColor = '#cbd5e1'; 
                e.target.style.color = '#334155';
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
              }}
              onMouseLeave={(e) => { 
                e.target.style.background = '#ffffff'; 
                e.target.style.borderColor = '#e2e8f0'; 
                e.target.style.color = '#475569';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.04)';
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={creatingBrandKit || !brandForm.name || !brandForm.logoDescription || !brandForm.bannerDescription || !brandForm.posterDescription}
              style={{ 
                border: 'none',
                background: creatingBrandKit || !brandForm.name || !brandForm.logoDescription || !brandForm.bannerDescription || !brandForm.posterDescription
                  ? 'linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%)' 
                  : 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 50%, #6d28d9 100%)', 
                color: '#fff',
                borderRadius: 12, 
                padding: '12px 28px',
                fontWeight: 600,
                fontSize: '0.9375rem',
                cursor: creatingBrandKit || !brandForm.name || !brandForm.logoDescription || !brandForm.bannerDescription || !brandForm.posterDescription ? 'not-allowed' : 'pointer',
                opacity: creatingBrandKit ? 0.8 : 1,
                boxShadow: creatingBrandKit || !brandForm.name || !brandForm.logoDescription || !brandForm.bannerDescription || !brandForm.posterDescription
                  ? '0 2px 8px rgba(0, 0, 0, 0.1)'
                  : '0 4px 16px rgba(139, 92, 246, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                letterSpacing: '0.01em',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                if (!creatingBrandKit && brandForm.name && brandForm.logoDescription && brandForm.bannerDescription && brandForm.posterDescription) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 24px rgba(139, 92, 246, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (!creatingBrandKit && brandForm.name && brandForm.logoDescription && brandForm.bannerDescription && brandForm.posterDescription) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 16px rgba(139, 92, 246, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.1)';
                }
              }}
            >
              {creatingBrandKit ? "Creating..." : "Create Brand Kit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandKitModal;

