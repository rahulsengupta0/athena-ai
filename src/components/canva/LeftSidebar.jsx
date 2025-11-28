import React from 'react';
import { FiType, FiImage, FiSquare, FiUpload, FiTriangle, FiEdit3, FiMove, FiGrid, FiChevronDown, FiChevronRight, FiStar, FiHeart, FiArrowUp, FiArrowDown, FiArrowLeft, FiArrowRight, FiCloud, FiZap, FiCrop, FiFilter, FiX } from 'react-icons/fi';

const LeftSidebar = ({
  styles,
  toggleSection,
  openSections,
  hoveredOption,
  setHoveredOption,
  selectedTool,
  setSelectedTool,
  handleToolSelect,
  handleAddElement,
  fileInputRef,
  handleImageUpload,
  uploadedImages,
  handleLayerDuplicate,
  templates,
  handleTemplateSelect,
  drawingSettings,
  handleDrawingSettingsChange,
  canvasSize,
  setCanvasSize,
  showGrid,
  setShowGrid
}) => {
  // New custom styles for the redesigned sidebar
  const customStyles = {
    sidebar: {
      ...styles.leftSidebar,
      background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
      borderRight: '2px solid #374151',
    },
    sectionHeader: {
      color: '#f1f5f9',
      fontSize: '16px',
      fontWeight: '700',
      marginBottom: '16px',
      padding: '8px 0',
      borderBottom: '2px solid #374151',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    buttonContainer: {
      backgroundColor: '#1e293b',
      border: '1px solid #374151',
      borderRadius: '12px',
      padding: '12px',
      marginBottom: '12px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
    },
    shapeButton: {
      padding: '12px 16px',
      border: '1px solid #475569',
      borderRadius: '10px',
      backgroundColor: '#334155',
      cursor: 'pointer',
      margin: '6px 0',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      fontSize: '14px',
      fontWeight: '500',
      width: '100%',
      justifyContent: 'flex-start',
      transition: 'all 0.2s ease',
      color: '#f8fafc',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      '&:hover': {
        backgroundColor: '#475569',
        borderColor: '#60a5fa',
        color: '#ffffff',
        transform: 'translateY(-1px)',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)'
      }
    },
    uploadButton: {
      padding: '20px 16px',
      border: '2px dashed #8b5cf6',
      borderRadius: '12px',
      background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
      cursor: 'pointer',
      margin: '8px 0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px',
      fontWeight: '600',
      width: '100%',
      justifyContent: 'center',
      transition: 'all 0.3s ease',
      color: '#ffffff',
      boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
      minHeight: '80px',
      '&:hover': {
        background: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)',
        borderColor: '#a855f7',
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 16px rgba(139, 92, 246, 0.4)'
      }
    } 
  };

  // Function to get button style based on hover state
  const getButtonStyle = (buttonName) => ({
    ...customStyles.shapeButton,
    backgroundColor: hoveredOption === buttonName ? '#475569' : '#334155',
    borderColor: hoveredOption === buttonName ? '#60a5fa' : '#475569',
    color: '#f8fafc'
  });

  return (
  <></>
  );
};

export default LeftSidebar;


