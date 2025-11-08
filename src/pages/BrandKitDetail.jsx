import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiDownload, FiX } from "react-icons/fi";
import api from "../services/api";

const BrandKitDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [brandKit, setBrandKit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Extract brand name from kitFolder
  const extractBrandName = (kitFolder) => {
    if (!kitFolder) return 'Brand Kit';
    const parts = kitFolder.split('-');
    let nameParts = [];
    for (let i = 0; i < parts.length; i++) {
      if (/^\d+$/.test(parts[i]) && parts[i].length >= 10) break;
      nameParts.push(parts[i]);
    }
    return nameParts
      .join(' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  useEffect(() => {
    // Get brand kit from location state or fetch by kitFolder
    if (location.state?.brandKit) {
      setBrandKit(location.state.brandKit);
      setLoading(false);
    } else if (location.state?.kitFolder) {
      // Fetch brand kit by kitFolder
      const fetchBrandKit = async () => {
        try {
          const folders = await api.getBrandKitFolders();
          const found = folders.find(f => f.kitFolder === location.state.kitFolder);
          if (found) {
            setBrandKit(found);
          }
        } catch (error) {
          console.error('Error fetching brand kit:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchBrandKit();
    } else {
      setLoading(false);
    }
  }, [location.state]);

  const downloadAsset = (url, filename) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openImageModal = (imageSrc, title) => {
    setSelectedImage({ src: imageSrc, title });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedImage(null);
  };

  if (loading) {
    return (
      <div style={{
        width: "100%",
        maxWidth: 1320,
        margin: "0 auto",
        padding: "40px 24px",
        textAlign: "center",
        fontSize: "1.2rem",
        color: "#64748b"
      }}>
        Loading brand kit details...
      </div>
    );
  }

  if (!brandKit) {
    return (
      <div style={{
        width: "100%",
        maxWidth: 1320,
        margin: "0 auto",
        padding: "40px 24px",
        textAlign: "center"
      }}>
        <h2 style={{ color: "#0f172a", marginBottom: 16 }}>Brand Kit Not Found</h2>
        <p style={{ color: "#64748b", marginBottom: 24 }}>The brand kit you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/projects')}
          style={{
            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 50%, #6d28d9 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: 12,
            padding: '12px 24px',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '0.9375rem',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 8px 24px rgba(139, 92, 246, 0.35)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }}
        >
          Go Back to Projects
        </button>
      </div>
    );
  }

  const brandName = extractBrandName(brandKit.kitFolder);

  return (
    <div style={{
      width: "100%",
      maxWidth: 1320,
      margin: "0 auto",
      padding: "32px 24px"
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: 32,
        gap: 16
      }}>
        <button
          onClick={() => navigate('/projects')}
          style={{
            border: '1.5px solid #e2e8f0',
            background: '#ffffff',
            borderRadius: 12,
            padding: '10px 14px',
            cursor: 'pointer',
            color: '#475569',
            fontWeight: 600,
            fontSize: '0.9375rem',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = '#f1f5f9';
            e.target.style.borderColor = '#cbd5e1';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = '#ffffff';
            e.target.style.borderColor = '#e2e8f0';
          }}
        >
          <FiArrowLeft size={18} />
          Back
        </button>
        <div>
          <h1 style={{
            margin: 0,
            fontSize: '2rem',
            fontWeight: 700,
            color: '#0f172a',
            letterSpacing: '-0.02em'
          }}>
            {brandName}
          </h1>
          <p style={{
            margin: '4px 0 0 0',
            color: '#64748b',
            fontSize: '0.9375rem'
          }}>
            Brand Kit Assets
          </p>
        </div>
      </div>

      {/* Compact Image Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 24
      }}>
        {/* Logo */}
        {brandKit.files?.logo?.url && (
          <div style={{
            background: 'linear-gradient(to bottom, #ffffff 0%, #fafbfc 100%)',
            border: '1.5px solid #e2e8f0',
            borderRadius: 20,
            padding: 20,
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
            transition: 'all 0.3s',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 12px 32px rgba(15, 23, 42, 0.08)';
            e.currentTarget.style.borderColor = '#8b5cf6';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(15, 23, 42, 0.04)';
            e.currentTarget.style.borderColor = '#e2e8f0';
          }}
          onClick={() => openImageModal(brandKit.files.logo.url, 'Logo')}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 16
            }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #d946ef 0%, #a855f7 50%, #8b5cf6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem'
              }}>
                🎨
              </div>
              <h3 style={{
                margin: 0,
                fontSize: '1.15rem',
                fontWeight: 600,
                color: '#0f172a'
              }}>
                Logo
              </h3>
            </div>
            <div style={{
              width: '100%',
              height: 200,
              borderRadius: 12,
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              marginBottom: 16
            }}>
              <img
                src={brandKit.files.logo.url}
                alt="Logo"
                style={{
                  maxWidth: '90%',
                  maxHeight: '90%',
                  objectFit: 'contain'
                }}
              />
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                downloadAsset(brandKit.files.logo.url, 'logo.png');
              }}
              style={{
                width: '100%',
                border: '1.5px solid #e2e8f0',
                background: '#ffffff',
                borderRadius: 10,
                padding: '10px 16px',
                cursor: 'pointer',
                color: '#475569',
                fontWeight: 600,
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#f1f5f9';
                e.target.style.borderColor = '#cbd5e1';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#ffffff';
                e.target.style.borderColor = '#e2e8f0';
              }}
            >
              <FiDownload size={16} />
              Download Logo
            </button>
          </div>
        )}

        {/* Banner */}
        {brandKit.files?.banner?.url && (
          <div style={{
            background: 'linear-gradient(to bottom, #ffffff 0%, #fafbfc 100%)',
            border: '1.5px solid #e2e8f0',
            borderRadius: 20,
            padding: 20,
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
            transition: 'all 0.3s',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 12px 32px rgba(15, 23, 42, 0.08)';
            e.currentTarget.style.borderColor = '#3b82f6';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(15, 23, 42, 0.04)';
            e.currentTarget.style.borderColor = '#e2e8f0';
          }}
          onClick={() => openImageModal(brandKit.files.banner.url, 'Banner')}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 16
            }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem'
              }}>
                📐
              </div>
              <h3 style={{
                margin: 0,
                fontSize: '1.15rem',
                fontWeight: 600,
                color: '#0f172a'
              }}>
                Banner
              </h3>
            </div>
            <div style={{
              width: '100%',
              height: 200,
              borderRadius: 12,
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              marginBottom: 16
            }}>
              <img
                src={brandKit.files.banner.url}
                alt="Banner"
                style={{
                  maxWidth: '90%',
                  maxHeight: '90%',
                  objectFit: 'contain'
                }}
              />
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                downloadAsset(brandKit.files.banner.url, 'banner.png');
              }}
              style={{
                width: '100%',
                border: '1.5px solid #e2e8f0',
                background: '#ffffff',
                borderRadius: 10,
                padding: '10px 16px',
                cursor: 'pointer',
                color: '#475569',
                fontWeight: 600,
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#f1f5f9';
                e.target.style.borderColor = '#cbd5e1';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#ffffff';
                e.target.style.borderColor = '#e2e8f0';
              }}
            >
              <FiDownload size={16} />
              Download Banner
            </button>
          </div>
        )}

        {/* Poster */}
        {brandKit.files?.poster?.url && (
          <div style={{
            background: 'linear-gradient(to bottom, #ffffff 0%, #fafbfc 100%)',
            border: '1.5px solid #e2e8f0',
            borderRadius: 20,
            padding: 20,
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
            transition: 'all 0.3s',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 12px 32px rgba(15, 23, 42, 0.08)';
            e.currentTarget.style.borderColor = '#ec4899';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(15, 23, 42, 0.04)';
            e.currentTarget.style.borderColor = '#e2e8f0';
          }}
          onClick={() => openImageModal(brandKit.files.poster.url, 'Poster')}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 16
            }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 50%, #ef4444 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem'
              }}>
                🎴
              </div>
              <h3 style={{
                margin: 0,
                fontSize: '1.15rem',
                fontWeight: 600,
                color: '#0f172a'
              }}>
                Poster
              </h3>
            </div>
            <div style={{
              width: '100%',
              height: 200,
              borderRadius: 12,
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              marginBottom: 16
            }}>
              <img
                src={brandKit.files.poster.url}
                alt="Poster"
                style={{
                  maxWidth: '90%',
                  maxHeight: '90%',
                  objectFit: 'contain'
                }}
              />
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                downloadAsset(brandKit.files.poster.url, 'poster.png');
              }}
              style={{
                width: '100%',
                border: '1.5px solid #e2e8f0',
                background: '#ffffff',
                borderRadius: 10,
                padding: '10px 16px',
                cursor: 'pointer',
                color: '#475569',
                fontWeight: 600,
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#f1f5f9';
                e.target.style.borderColor = '#cbd5e1';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#ffffff';
                e.target.style.borderColor = '#e2e8f0';
              }}
            >
              <FiDownload size={16} />
              Download Poster
            </button>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {modalOpen && selectedImage && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={closeModal}
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
              width: 'min(92vw, 900px)',
              maxWidth: '900px',
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
              padding: '24px 32px',
              borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(99, 102, 241, 0.06) 100%)',
            }}>
              <div style={{
                fontWeight: 700,
                color: '#0f172a',
                fontSize: '1.25rem',
                letterSpacing: '-0.02em',
                flex: 1
              }}>
                {selectedImage.title}
              </div>
              <button
                onClick={closeModal}
                style={{
                  border: 'none',
                  background: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 12,
                  padding: '10px 14px',
                  cursor: 'pointer',
                  color: '#64748b',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
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
                <FiX size={20} />
              </button>
            </div>
            <div style={{
              padding: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#ffffff',
              minHeight: 400
            }}>
              <img
                src={selectedImage.src}
                alt={selectedImage.title}
                style={{
                  maxWidth: '100%',
                  maxHeight: '70vh',
                  objectFit: 'contain'
                }}
              />
            </div>
            <div style={{
              padding: '20px 32px',
              borderTop: '1px solid rgba(226, 232, 240, 0.8)',
              background: '#fafbfc',
              display: 'flex',
              justifyContent: 'center'
            }}>
              <button
                onClick={() => downloadAsset(selectedImage.src, `${selectedImage.title.toLowerCase()}.png`)}
                style={{
                  border: 'none',
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 50%, #6d28d9 100%)',
                  color: '#fff',
                  borderRadius: 12,
                  padding: '12px 24px',
                  fontWeight: 600,
                  fontSize: '0.9375rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 24px rgba(139, 92, 246, 0.35)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <FiDownload size={18} />
                Download {selectedImage.title}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandKitDetail;

