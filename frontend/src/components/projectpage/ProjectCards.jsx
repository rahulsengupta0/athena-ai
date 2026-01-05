import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiTrash2 } from "react-icons/fi";
import api from "../../services/api";

export const ProjectCards = () => {
  const navigate = useNavigate();
  const [brandKits, setBrandKits] = useState([]);
  const [brandKitFolders, setBrandKitFolders] = useState([]);
  const [loadingBrandKitFolders, setLoadingBrandKitFolders] = useState(true);
  const [hoveredBrandKit, setHoveredBrandKit] = useState(null);
  const [deletingKit, setDeletingKit] = useState(null);

  // Helper function to extract brand name from kitFolder
  const extractBrandName = (kitFolder) => {
    // kitFolder format: "name-lowercase-timestamp"
    // Remove the last part (timestamp) and convert back to readable format
    const parts = kitFolder.split('-');
    // Find where the timestamp starts (last part that's all digits and long enough to be a timestamp)
    let nameParts = [];
    for (let i = 0; i < parts.length; i++) {
      // Check if this part is a timestamp (all digits and at least 10 digits long)
      if (/^\d+$/.test(parts[i]) && parts[i].length >= 10) {
        // This is the timestamp, stop here
        break;
      }
      nameParts.push(parts[i]);
    }
    // Join and capitalize first letter of each word
    return nameParts
      .join(' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Match brand kit folders with brand kits from database
  const getBrandKitInfo = (kitFolder) => {
    const extractedName = extractBrandName(kitFolder);
    // Try to find matching brand kit in database
    const matchedKit = brandKits.find(kit => 
      kit.name.toLowerCase().replace(/ /g, '-') === extractedName.toLowerCase().replace(/ /g, '-')
    );
    return matchedKit || { name: extractedName, isShared: false, sharedBy: null };
  };

  // Handle delete brand kit
  const handleDeleteBrandKit = async (e, kitFolder) => {
    e.stopPropagation(); // Prevent card click navigation
    
    const brandKitInfo = getBrandKitInfo(kitFolder);
    const confirmed = window.confirm(
      `Are you sure you want to delete "${brandKitInfo.name}"? This action cannot be undone.`
    );
    
    if (!confirmed) return;

    setDeletingKit(kitFolder);
    try {
      // Delete from S3 using kitFolder
      await api.deleteBrandKitFolder(kitFolder);
      
      // If there's a matching database record, delete it too
      if (brandKitInfo._id) {
        try {
          await api.deleteBrandKit(brandKitInfo._id);
        } catch (dbError) {
          console.error('Error deleting from database:', dbError);
          // Continue even if database deletion fails
        }
      }
      
      // Refresh the lists
      const folders = await api.getBrandKitFolders();
      setBrandKitFolders(folders || []);
      
      const kits = await api.getBrandKits();
      setBrandKits(kits || []);
    } catch (error) {
      console.error('Error deleting brand kit:', error);
      alert('Failed to delete brand kit: ' + (error.message || 'Unknown error'));
    } finally {
      setDeletingKit(null);
    }
  };

  // Fetch brand kits from backend
  useEffect(() => {
    const fetchBrandKits = async () => {
      try {
        const kits = await api.getBrandKits();
        setBrandKits(kits || []);
      } catch (error) {
        console.error('Error fetching brand kits:', error);
        setBrandKits([]);
      }
    };
    const fetchBrandKitFolders = async () => {
      try {
        setLoadingBrandKitFolders(true);
        const folders = await api.getBrandKitFolders();
        setBrandKitFolders(folders || []);
      } catch (error) {
        console.error('Error fetching brand kit folders:', error);
        setBrandKitFolders([]);
      } finally {
        setLoadingBrandKitFolders(false);
      }
    };
    fetchBrandKits();
    fetchBrandKitFolders();
  }, []);

  return (
    <div style={{
      width: "100%",
      maxWidth: 1320,
      margin: "0 auto", 
      padding: "28px 24px 20px 24px"
    }}>
      {/* Templates Section */}
      <div style={{ marginBottom: 40 }}>
        <div 
          onClick={() => navigate('/projects/templates')}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            marginBottom: 20,
            cursor: 'pointer',
            padding: '12px',
            borderRadius: 12,
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9fa'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <h2 style={{ 
            margin: 0, 
            fontSize: '1.5rem', 
            fontWeight: 700, 
            color: '#0f172a',
            letterSpacing: '-0.02em'
          }}>
            Templates
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ 
              color: '#64748b', 
              fontWeight: 600,
              fontSize: '0.9375rem',
              background: '#f1f5f9',
              padding: '6px 12px',
              borderRadius: 12
            }}>
              Browse templates
            </span>
            <span style={{ color: '#8b5cf6', fontSize: '0.875rem', fontWeight: 600 }}>
              View all →
            </span>
          </div>
        </div>
        <div style={{ 
          background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
          border: '1.5px solid #e2e8f0',
          borderRadius: 20,
          padding: 40,
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s',
        }}
        onClick={() => navigate('/projects/templates')}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 12px 32px rgba(139, 92, 246, 0.15)';
          e.currentTarget.style.borderColor = '#8b5cf6';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
          e.currentTarget.style.borderColor = '#e2e8f0';
        }}
        >
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>📄</div>
          <div style={{ fontWeight: 600, fontSize: '1.1rem', color: '#0f172a', marginBottom: 8 }}>
            Explore Templates
          </div>
          <div style={{ color: '#64748b', fontSize: '0.95rem' }}>
            Browse and use pre-designed templates for your projects
          </div>
        </div>
      </div>

      {/* Brand Kit Folders (from S3) */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ 
            margin: 0, 
            fontSize: '1.5rem', 
            fontWeight: 700, 
            color: '#0f172a',
            letterSpacing: '-0.02em'
          }}>
            Brand Kits
          </h2>
          {!loadingBrandKitFolders && (
            <span style={{ 
              color: '#64748b', 
              fontWeight: 600,
              fontSize: '0.9375rem',
              background: '#f1f5f9',
              padding: '6px 12px',
              borderRadius: 12
            }}>
              {brandKitFolders.length} {brandKitFolders.length === 1 ? 'kit' : 'kits'}
            </span>
          )}
        </div>
        {loadingBrandKitFolders ? (
          <div style={{ 
            color: '#94a3b8', 
            textAlign: 'center', 
            padding: '40px 20px',
            fontSize: '1.07rem',
            background: '#fafbfc',
            borderRadius: 16,
            border: '1px solid #e2e8f0'
          }}>
            Loading brand kits...
          </div>
        ) : brandKitFolders.length === 0 ? (
          <div style={{ 
            color: '#94a3b8', 
            textAlign: 'center',
            padding: '40px 20px',
            background: '#fafbfc',
            borderRadius: 16,
            border: '1px solid #e2e8f0'
          }}>
            No brand kits found.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
            {brandKitFolders.map((f) => {
              const brandKitInfo = getBrandKitInfo(f.kitFolder);
              const isHovered = hoveredBrandKit === f.kitFolder;
              return (
                <div
                  key={f.kitFolder}
                  onClick={() => navigate('/brand-kit-detail', { state: { brandKit: f } })}
                  onMouseEnter={() => setHoveredBrandKit(f.kitFolder)}
                  onMouseLeave={() => setHoveredBrandKit(null)}
                  style={{
                    background: 'linear-gradient(to bottom, #ffffff 0%, #fafbfc 100%)',
                    border: isHovered ? '2px solid #8b5cf6' : '1.5px solid #e2e8f0',
                    borderRadius: 20,
                    padding: 24,
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: isHovered 
                      ? '0 12px 32px rgba(139, 92, 246, 0.15), 0 0 0 1px rgba(139, 92, 246, 0.1)' 
                      : '0 2px 8px rgba(15, 23, 42, 0.04)',
                    transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                    position: 'relative',
                    overflow: 'hidden',
                    opacity: deletingKit === f.kitFolder ? 0.6 : 1
                  }}
                >
                  {/* Delete button */}
                  <button
                    onClick={(e) => handleDeleteBrandKit(e, f.kitFolder)}
                    disabled={deletingKit === f.kitFolder}
                    style={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      background: deletingKit === f.kitFolder 
                        ? '#cbd5e1' 
                        : isHovered 
                          ? '#ef4444' 
                          : 'rgba(239, 68, 68, 0.1)',
                      border: 'none',
                      borderRadius: 10,
                      width: 36,
                      height: 36,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: deletingKit === f.kitFolder ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s',
                      zIndex: 10,
                      color: isHovered || deletingKit === f.kitFolder ? '#ffffff' : '#ef4444',
                      boxShadow: isHovered ? '0 4px 12px rgba(239, 68, 68, 0.3)' : 'none'
                    }}
                    onMouseEnter={(e) => {
                      if (deletingKit !== f.kitFolder) {
                        e.currentTarget.style.background = '#dc2626';
                        e.currentTarget.style.transform = 'scale(1.1)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (deletingKit !== f.kitFolder) {
                        e.currentTarget.style.background = isHovered ? '#ef4444' : 'rgba(239, 68, 68, 0.1)';
                        e.currentTarget.style.transform = 'scale(1)';
                      }
                    }}
                    title="Delete brand kit"
                  >
                    <FiTrash2 size={16} />
                  </button>

                  {/* Gradient accent */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(90deg, #8b5cf6 0%, #7c3aed 50%, #6d28d9 100%)',
                    opacity: isHovered ? 1 : 0.6
                  }} />
                  
                  {/* Logo preview */}
                  {f.files.logo?.url && (
                    <div style={{
                      width: '100%',
                      height: 180,
                      borderRadius: 12,
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      marginBottom: 16,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
                    }}>
                      <img 
                        src={f.files.logo.url} 
                        alt="Logo" 
                        style={{ 
                          maxWidth: '90%',
                          maxHeight: '90%',
                          objectFit: 'contain'
                        }} 
                      />
                    </div>
                  )}
                  
                  {/* Brand name and shared tag */}
                  <div style={{ marginBottom: 8 }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      marginBottom: 4
                    }}>
                      <div style={{
                        fontWeight: 700,
                        color: '#0f172a',
                        fontSize: '1.25rem',
                        letterSpacing: '-0.01em',
                        lineHeight: 1.3
                      }}>
                        {brandKitInfo.name}
                      </div>
                      {brandKitInfo.isShared && brandKitInfo.sharedBy && (
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: '#7c3aed',
                          background: '#f3f4f6',
                          padding: '4px 10px',
                          borderRadius: 12,
                          border: '1px solid #e5e7eb'
                        }}>
                          Shared by {brandKitInfo.sharedBy.name}
                        </span>
                      )}
                    </div>
                    {/* Tagline if available */}
                    {brandKitInfo.tagline && (
                      <div style={{
                        color: '#64748b',
                        fontSize: '0.9375rem',
                        marginTop: 4,
                        lineHeight: 1.5
                      }}>
                        {brandKitInfo.tagline}
                      </div>
                    )}
                  </div>
                  
                  {/* Preview thumbnails */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 8,
                    marginTop: 16
                  }}>
                    {f.files.logo?.url && (
                      <div style={{
                        aspectRatio: '1',
                        borderRadius: 8,
                        overflow: 'hidden',
                        border: '1px solid #e2e8f0',
                        background: '#ffffff'
                      }}>
                        <img 
                          src={f.files.logo.url} 
                          alt="Logo" 
                          style={{ 
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }} 
                        />
                      </div>
                    )}
                    {f.files.banner?.url && (
                      <div style={{
                        aspectRatio: '1',
                        borderRadius: 8,
                        overflow: 'hidden',
                        border: '1px solid #e2e8f0',
                        background: '#ffffff'
                      }}>
                        <img 
                          src={f.files.banner.url} 
                          alt="Banner" 
                          style={{ 
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }} 
                        />
                      </div>
                    )}
                    {f.files.poster?.url && (
                      <div style={{
                        aspectRatio: '1',
                        borderRadius: 8,
                        overflow: 'hidden',
                        border: '1px solid #e2e8f0',
                        background: '#ffffff'
                      }}>
                        <img 
                          src={f.files.poster.url} 
                          alt="Poster" 
                          style={{ 
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }} 
                        />
                      </div>
                    )}
                  </div>
                  
                  {/* View details hint */}
                  <div style={{
                    marginTop: 16,
                    paddingTop: 16,
                    borderTop: '1px solid #e2e8f0',
                    color: '#8b5cf6',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    opacity: isHovered ? 1 : 0.7,
                    transition: 'opacity 0.2s'
                  }}>
                    <FiEye size={16} />
                    <span>Click to view details</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};

export default ProjectCards;
