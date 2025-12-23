import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiDownload, FiPlus, FiTrash2, FiImage, FiLayout, FiLayers, FiGrid, FiShare2 } from "react-icons/fi";
import api from "../services/api";
import AddImageModal from "./AddImageModal";
import ShareModal from "../components/ShareModal";

const BrandKitDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [brandKit, setBrandKit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [allBrandKits, setAllBrandKits] = useState([]);
  const [userFiles, setUserFiles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('logo');
  const [selectedImages, setSelectedImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedCollaborators, setSelectedCollaborators] = useState([]);
  const [savingShare, setSavingShare] = useState(false);
  const [brandKitDb, setBrandKitDb] = useState(null);
  const [collaboratorsInfo, setCollaboratorsInfo] = useState([]);

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
    let initialKitFolder = null;

    if (location.state?.brandKit) {
      setBrandKit(location.state.brandKit);
      initialKitFolder = location.state.brandKit.kitFolder;
      setLoading(false);
    } else if (location.state?.kitFolder) {
      initialKitFolder = location.state.kitFolder;
    }

    const kitFolderToLoad = initialKitFolder;
    if (!kitFolderToLoad) {
      if (!location.state?.brandKit) {
        setLoading(false);
      }
      return;
    }

    const fetchBrandKit = async () => {
      try {
        if (!location.state?.brandKit) {
          setLoading(true);
        }
        const [folders, dbKits] = await Promise.all([
          api.getBrandKitFolders(),
          api.getBrandKits()
        ]);
        const found = folders.find(f => f.kitFolder === kitFolderToLoad);
        if (found) {
          setBrandKit(found);
        }

        // Find matching database brand kit
        const thisName = extractBrandName(kitFolderToLoad);
        const normalized = (thisName || "").toLowerCase().replace(/ /g, "-");
        const matched = (dbKits || []).find(
          (k) => (k.name || "").toLowerCase().replace(/ /g, "-") === normalized
        );
        if (matched) {
          setBrandKitDb(matched);

          // Fetch collaborators info if there are any
          if (matched.collaborators && matched.collaborators.length > 0) {
            const members = await api.getTeamMembers();
            const collabInfo = matched.collaborators.map(collabId => {
              const member = members.find(m =>
                String(m.userId?._id || m.userId || m._id) === String(collabId)
              );
              if (member) {
                const userId = member.userId || member;
                return {
                  id: collabId,
                  name: `${userId.firstName || ''} ${userId.lastName || ''}`.trim() || userId.email || 'Unknown',
                  email: userId.email || '',
                  avatar: userId.avatar
                };
              }
              return { id: collabId, name: 'Unknown', email: '', avatar: null };
            });
            setCollaboratorsInfo(collabInfo);
          } else {
            setCollaboratorsInfo([]);
          }
        }
      } catch (error) {
        console.error('Error fetching brand kit:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrandKit();
  }, [location.state]);

  // Fetch all brand kits and user files when upload modal opens
  useEffect(() => {
    if (uploadModalOpen) {
      const fetchData = async () => {
        try {
          const [folders, files] = await Promise.all([
            api.getBrandKitFolders(),
            api.getUserFiles()
          ]);
          setAllBrandKits(folders || []);
          setUserFiles(files || []);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      fetchData();
    }
  }, [uploadModalOpen]);

  const downloadAsset = (url, filename) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openUploadModal = () => {
    setUploadModalOpen(true);
    setSelectedImages([]);
    setSelectedCategory('logo');
  };

  const closeUploadModal = () => {
    setUploadModalOpen(false);
    setSelectedImages([]);
  };

  // Open Share modal: fetch team members and pre-select current collaborators (by matching DB brand kit)
  const openShare = async () => {
    try {
      const members = await api.getTeamMembers();
      setTeamMembers(members || []);
      // Use brandKitDb if available, otherwise try to find matching DB brand kit by normalized name
      let matched = brandKitDb;
      if (!matched) {
        const kits = await api.getBrandKits();
        const thisName = extractBrandName(brandKit?.kitFolder || "");
        const normalized = (thisName || "").toLowerCase().replace(/ /g, "-");
        matched = (kits || []).find(
          (k) => (k.name || "").toLowerCase().replace(/ /g, "-") === normalized
        );
      }
      const existing = (matched && matched.collaborators) ? matched.collaborators.map((id) => String(id)) : [];
      setSelectedCollaborators(existing);
      setShareOpen(true);
    } catch (e) {
      console.error("Error opening share:", e);
      alert("Failed to open share dialog.");
    }
  };

  const closeShare = () => setShareOpen(false);

  const saveShare = async () => {
    try {
      setSavingShare(true);

      // First, try to use the brandKitDb if it exists
      let brandKitId = brandKitDb?._id;

      // If not found, try to find it in the database
      if (!brandKitId) {
        const kits = await api.getBrandKits();
        const thisName = extractBrandName(brandKit?.kitFolder || "");
        const normalized = (thisName || "").toLowerCase().replace(/ /g, "-");
        const matched = (kits || []).find(
          (k) => (k.name || "").toLowerCase().replace(/ /g, "-") === normalized
        );

        if (matched?._id) {
          brandKitId = matched._id;
          setBrandKitDb(matched);
        }
      }

      // If still not found, create a new brand kit entry in the database
      if (!brandKitId) {
        const thisName = extractBrandName(brandKit?.kitFolder || "");
        if (!thisName) {
          alert("Could not determine brand kit name. Please try again.");
          return;
        }

        // Create the brand kit in the database
        const newBrandKit = await api.createBrandKit({
          name: thisName,
          tagline: '',
          primaryColor: '',
          secondaryColor: '',
          logoUrl: brandKit?.files?.logo?.url || ''
        });

        brandKitId = newBrandKit._id;
        setBrandKitDb(newBrandKit);
      }

      // Get current collaborators - fetch fresh to ensure we have the latest state
      const allKits = await api.getBrandKits();
      const currentKit = allKits.find(k => String(k._id) === String(brandKitId));
      const currentIds = (currentKit?.collaborators || []).map((x) => String(x));
      const toAdd = selectedCollaborators.filter((id) => !currentIds.includes(id));
      const toRemove = currentIds.filter((id) => !selectedCollaborators.includes(id));

      for (const addId of toAdd) {
        await api.addBrandKitCollaborator(brandKitId, addId);
      }
      for (const remId of toRemove) {
        await api.removeBrandKitCollaborator(brandKitId, remId);
      }

      // Refresh collaborators info
      const updatedKits = await api.getBrandKits();
      const thisName = extractBrandName(brandKit?.kitFolder || "");
      const normalized = (thisName || "").toLowerCase().replace(/ /g, "-");
      const updated = updatedKits.find(
        (k) => (k.name || "").toLowerCase().replace(/ /g, "-") === normalized
      );
      if (updated) {
        setBrandKitDb(updated);
        if (updated.collaborators && updated.collaborators.length > 0) {
          const members = await api.getTeamMembers();
          const collabInfo = updated.collaborators.map(collabId => {
            const member = members.find(m =>
              String(m.userId?._id || m.userId || m._id) === String(collabId)
            );
            if (member) {
              const userId = member.userId || member;
              return {
                id: collabId,
                name: `${userId.firstName || ''} ${userId.lastName || ''}`.trim() || userId.email || 'Unknown',
                email: userId.email || '',
                avatar: userId.avatar
              };
            }
            return { id: collabId, name: 'Unknown', email: '', avatar: null };
          });
          setCollaboratorsInfo(collabInfo);
        } else {
          setCollaboratorsInfo([]);
        }
      }

      alert("Share settings updated.");
      setShareOpen(false);
    } catch (e) {
      console.error("Save share error:", e);
      alert("Failed to save share settings: " + (e.message || "Unknown error"));
    } finally {
      setSavingShare(false);
    }
  };

  const toggleImageSelection = (imageUrl, source, identifier = "") => {
    const keyParts = [source];
    if (identifier) keyParts.push(identifier);
    keyParts.push(imageUrl);
    const imageKey = keyParts.join("-");
    setSelectedImages((prev) => {
      if (prev.find((img) => img.key === imageKey)) {
        return prev.filter((img) => img.key !== imageKey);
      } else {
        return [
          ...prev,
          { key: imageKey, url: imageUrl, source, identifier },
        ];
      }
    });
  };

  const handleAddImages = async () => {
    if (selectedImages.length === 0) {
      alert('Please select at least one image');
      return;
    }

    setUploading(true);
    try {
      for (const image of selectedImages) {
        // Generate a cleaner filename: category-timestamp.png
        const timestamp = Date.now();
        const fileName = `${selectedCategory}-${timestamp}.png`;
        await api.addImageToBrandKit(brandKit.kitFolder, image.url, selectedCategory, fileName);
      }

      // Refresh brand kit data
      const folders = await api.getBrandKitFolders();
      const updated = folders.find(f => f.kitFolder === brandKit.kitFolder);
      if (updated) {
        setBrandKit(updated);
      }

      alert(`Successfully added ${selectedImages.length} image(s) to ${selectedCategory} category!`);
      closeUploadModal();
    } catch (error) {
      console.error('Error adding images:', error);
      alert('Failed to add images: ' + (error.message || 'Unknown error'));
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (fileName) => {
    const confirmed = window.confirm('Are you sure you want to delete this image? This action cannot be undone.');
    if (!confirmed) return;

    const kitFolder = brandKit?.kitFolder;
    if (!kitFolder) {
      console.warn('No kit folder available for deletion.');
      return;
    }

    setBrandKit((prev) => {
      if (!prev?.files) return prev;
      const updatedFiles = { ...prev.files };

      if (updatedFiles.logo?.fileName === fileName) {
        delete updatedFiles.logo;
      }

      if (updatedFiles.banner?.fileName === fileName) {
        delete updatedFiles.banner;
      }

      if (updatedFiles.poster?.fileName === fileName) {
        delete updatedFiles.poster;
      }

      if (Array.isArray(updatedFiles.custom)) {
        updatedFiles.custom = updatedFiles.custom.filter((item) => item.fileName !== fileName);
        if (updatedFiles.custom.length === 0) {
          delete updatedFiles.custom;
        }
      }

      return { ...prev, files: updatedFiles };
    });

    try {
      await api.deleteImageFromBrandKit(kitFolder, fileName);

      // Refresh brand kit data
      const folders = await api.getBrandKitFolders();
      const updated = folders.find(f => f.kitFolder === kitFolder);
      if (updated) {
        setBrandKit(updated);
      }

      alert('Image deleted successfully!');
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Failed to delete image: ' + (error.message || 'Unknown error'));
    }
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
        justifyContent: 'space-between',
        marginBottom: 24,
        gap: 12
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
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
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
                <h1 style={{
                  margin: 0,
                  fontSize: '2rem',
                  fontWeight: 700,
                  color: '#0f172a',
                  letterSpacing: '-0.02em'
                }}>
                  {brandName}
                </h1>
                {brandKitDb?.isShared && brandKitDb?.sharedBy && (
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#7c3aed',
                    background: '#f3f4f6',
                    padding: '6px 12px',
                    borderRadius: 12,
                    border: '1px solid #e5e7eb'
                  }}>
                    Shared by {brandKitDb.sharedBy.name}
                  </span>
                )}
              </div>
              <p style={{
                margin: '4px 0 0 0',
                color: '#64748b',
                fontSize: '0.9375rem'
              }}>
                Brand Kit Assets
              </p>
              {collaboratorsInfo.length > 0 && (
                <div style={{
                  marginTop: 8,
                  fontSize: '0.875rem',
                  color: '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}>
                  <span>Also shared with:</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    {collaboratorsInfo.slice(0, 3).map((collab, idx) => (
                      <span key={collab.id} style={{
                        color: '#7c3aed',
                        fontWeight: 600
                      }}>
                        {collab.name}{idx < Math.min(collaboratorsInfo.length, 3) - 1 ? ',' : ''}
                      </span>
                    ))}
                    {collaboratorsInfo.length > 3 && (
                      <span style={{ color: '#64748b' }}>
                        +{collaboratorsInfo.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={openUploadModal}
            style={{
              border: 'none',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 50%, #6d28d9 100%)',
              borderRadius: 12,
              padding: '10px 16px',
              cursor: 'pointer',
              color: '#ffffff',
              fontWeight: 600,
              fontSize: '0.9375rem',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'all 0.2s',
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 24px rgba(139, 92, 246, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.3)';
            }}
          >
            <FiPlus size={18} />
            Add Image
          </button>
          <button
            onClick={openShare}
            style={{
              border: '1.5px solid #e2e8f0',
              background: '#ffffff',
              borderRadius: 12,
              padding: '10px 16px',
              cursor: 'pointer',
              color: '#0f172a',
              fontWeight: 600,
              fontSize: '0.9375rem',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#f8fafc';
              e.target.style.borderColor = '#cbd5e1';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#ffffff';
              e.target.style.borderColor = '#e2e8f0';
            }}
          >
            <FiShare2 size={18} />
            Share
          </button>
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
            position: 'relative'
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
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#475569'
              }}>
                <FiImage size={20} />
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
              marginBottom: 16,
              position: 'relative'
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
              {/* Action buttons overlay */}
              <div style={{
                position: 'absolute',
                top: 8,
                right: 8,
                display: 'flex',
                gap: 8
              }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    downloadAsset(brandKit.files.logo.url, brandKit.files.logo.fileName || 'logo.png');
                  }}
                  style={{
                    border: '1px solid #dde3ea',
                    background: '#ffffff',
                    borderRadius: 8,
                    padding: '6px',
                    cursor: 'pointer',
                    color: '#475569',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 1px 4px rgba(15, 23, 42, 0.08)',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#f8fafc';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = '#ffffff';
                  }}
                  title="Download"
                >
                  <FiDownload size={16} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteImage(brandKit.files.logo.fileName || 'logo.png');
                  }}
                  style={{
                    border: '1px solid #dde3ea',
                    background: '#ffffff',
                    borderRadius: 8,
                    padding: '6px',
                    cursor: 'pointer',
                    color: '#ef4444',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 1px 4px rgba(15, 23, 42, 0.08)',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#fef2f2';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = '#ffffff';
                  }}
                  title="Delete"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
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
            position: 'relative'
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
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#475569'
              }}>
                <FiLayout size={20} />
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
              marginBottom: 16,
              position: 'relative'
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
              {/* Action buttons overlay */}
              <div style={{
                position: 'absolute',
                top: 8,
                right: 8,
                display: 'flex',
                gap: 8
              }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    downloadAsset(brandKit.files.banner.url, brandKit.files.banner.fileName || 'banner.png');
                  }}
                  style={{
                    border: '1px solid #dde3ea',
                    background: '#ffffff',
                    borderRadius: 8,
                    padding: '6px',
                    cursor: 'pointer',
                    color: '#475569',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 1px 4px rgba(15, 23, 42, 0.08)',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#f8fafc';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = '#ffffff';
                  }}
                  title="Download"
                >
                  <FiDownload size={16} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteImage(brandKit.files.banner.fileName || 'banner.png');
                  }}
                  style={{
                    border: '1px solid #dde3ea',
                    background: '#ffffff',
                    borderRadius: 8,
                    padding: '6px',
                    cursor: 'pointer',
                    color: '#ef4444',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 1px 4px rgba(15, 23, 42, 0.08)',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#fef2f2';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = '#ffffff';
                  }}
                  title="Delete"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
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
            position: 'relative'
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
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#475569'
              }}>
                <FiLayers size={20} />
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
              marginBottom: 16,
              position: 'relative'
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
              {/* Action buttons overlay */}
              <div style={{
                position: 'absolute',
                top: 8,
                right: 8,
                display: 'flex',
                gap: 8
              }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    downloadAsset(brandKit.files.poster.url, brandKit.files.poster.fileName || 'poster.png');
                  }}
                  style={{
                    border: '1px solid #dde3ea',
                    background: '#ffffff',
                    borderRadius: 8,
                    padding: '6px',
                    cursor: 'pointer',
                    color: '#475569',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 1px 4px rgba(15, 23, 42, 0.08)',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#f8fafc';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = '#ffffff';
                  }}
                  title="Download"
                >
                  <FiDownload size={16} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteImage(brandKit.files.poster.fileName || 'poster.png');
                  }}
                  style={{
                    border: '1px solid #dde3ea',
                    background: '#ffffff',
                    borderRadius: 8,
                    padding: '6px',
                    cursor: 'pointer',
                    color: '#ef4444',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 1px 4px rgba(15, 23, 42, 0.08)',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#fef2f2';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = '#ffffff';
                  }}
                  title="Delete"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Custom Images */}
        {brandKit.files?.custom && brandKit.files.custom.length > 0 && (
          <div style={{ gridColumn: '1 / -1', marginTop: 24 }}>
            <h3 style={{
              margin: '0 0 20px 0',
              fontSize: '1.25rem',
              fontWeight: 600,
              color: '#0f172a'
            }}>
              Additional Images
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: 24
            }}>
              {brandKit.files.custom.map((customFile, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'linear-gradient(to bottom, #ffffff 0%, #fafbfc 100%)',
                    border: '1.5px solid #e2e8f0',
                    borderRadius: 20,
                    padding: 20,
                    boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
                    transition: 'all 0.3s',
                    position: 'relative'
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
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#475569'
                    }}>
                      <FiGrid size={20} />
                    </div>
                    <h3 style={{
                      margin: 0,
                      fontSize: '1.15rem',
                      fontWeight: 600,
                      color: '#0f172a'
                    }}>
                      {customFile.type || 'Custom Image'}
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
                    marginBottom: 16,
                    position: 'relative'
                  }}>
                    <img
                      src={customFile.url}
                      alt={customFile.type || 'Custom'}
                      style={{
                        maxWidth: '90%',
                        maxHeight: '90%',
                        objectFit: 'contain'
                      }}
                    />
                    {/* Action buttons overlay */}
                    <div style={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      display: 'flex',
                      gap: 8
                    }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadAsset(customFile.url, customFile.fileName || 'custom-image.png');
                        }}
                        style={{
                          border: '1px solid #dde3ea',
                          background: '#ffffff',
                          borderRadius: 8,
                          padding: '6px',
                          cursor: 'pointer',
                          color: '#475569',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 1px 4px rgba(15, 23, 42, 0.08)',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = '#f8fafc';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = '#ffffff';
                        }}
                        title="Download"
                      >
                        <FiDownload size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteImage(customFile.fileName);
                        }}
                        style={{
                          border: '1px solid #dde3ea',
                          background: '#ffffff',
                          borderRadius: 8,
                          padding: '6px',
                          cursor: 'pointer',
                          color: '#ef4444',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 1px 4px rgba(15, 23, 42, 0.08)',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = '#fef2f2';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = '#ffffff';
                        }}
                        title="Delete"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <AddImageModal
        isOpen={uploadModalOpen}
        onClose={closeUploadModal}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        selectedImages={selectedImages}
        onToggleImageSelection={toggleImageSelection}
        allBrandKits={allBrandKits}
        userFiles={userFiles}
        onAddImages={handleAddImages}
        uploading={uploading}
        currentKitFolder={brandKit?.kitFolder}
      />

      <ShareModal
        isOpen={shareOpen}
        onClose={closeShare}
        title="Share Brand Kit"
        members={teamMembers}
        selectedIds={selectedCollaborators}
        setSelectedIds={setSelectedCollaborators}
        onSave={saveShare}
        saving={savingShare}
      />
    </div>
  );
};

export default BrandKitDetail;

