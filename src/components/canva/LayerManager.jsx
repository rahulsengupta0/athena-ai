import React, { useState } from 'react';
import { 
  FiEye, FiEyeOff, FiLock, FiUnlock, FiCopy, FiTrash2, 
  FiMove, FiLayers, FiMoreHorizontal, FiChevronDown, FiChevronRight 
} from 'react-icons/fi';

const LayerManager = ({ layers, selectedLayer, onLayerSelect, onLayerUpdate, onLayerDelete, onLayerDuplicate }) => {
  const [expandedGroups, setExpandedGroups] = useState(new Set());

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 16px',
      borderBottom: '1px solid #e1e5e9',
      backgroundColor: '#f8f9fa'
    },
    headerTitle: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#2d3748',
      margin: 0
    },
    layerList: {
      flex: 1,
      overflow: 'auto'
    },
    layerItem: {
      display: 'flex',
      alignItems: 'center',
      padding: '8px 12px',
      borderBottom: '1px solid #f1f5f9',
      cursor: 'pointer',
      transition: 'all 0.2s',
      backgroundColor: 'white'
    },
    selectedLayer: {
      backgroundColor: '#e6f3ff',
      borderLeft: '3px solid #3182ce'
    },
    layerThumbnail: {
      width: '32px',
      height: '32px',
      backgroundColor: '#e2e8f0',
      borderRadius: '4px',
      marginRight: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '14px',
      position: 'relative'
    },
    layerInfo: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      minWidth: 0
    },
    layerName: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#2d3748',
      margin: 0,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    layerType: {
      fontSize: '12px',
      color: '#718096',
      margin: 0
    },
    layerActions: {
      display: 'flex',
      gap: '4px',
      opacity: 0,
      transition: 'opacity 0.2s'
    },
    layerItemHover: {
      opacity: 1
    },
    actionButton: {
      padding: '4px',
      border: 'none',
      backgroundColor: 'transparent',
      cursor: 'pointer',
      borderRadius: '4px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#4a5568',
      transition: 'all 0.2s'
    },
    actionButtonHover: {
      backgroundColor: '#f1f5f9',
      color: '#2d3748'
    },
    groupHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: '8px 12px',
      backgroundColor: '#f8f9fa',
      borderBottom: '1px solid #e1e5e9',
      cursor: 'pointer',
      fontWeight: '500',
      fontSize: '13px',
      color: '#4a5568'
    },
    groupContent: {
      paddingLeft: '20px'
    },
    emptyState: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      color: '#718096',
      textAlign: 'center'
    },
    emptyIcon: {
      fontSize: '32px',
      marginBottom: '12px',
      opacity: 0.5
    },
    emptyText: {
      fontSize: '14px',
      margin: 0
    },
    layerControls: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '12px 16px',
      borderTop: '1px solid #e1e5e9',
      backgroundColor: '#f8f9fa'
    },
    controlButton: {
      padding: '6px 12px',
      border: '1px solid #e1e5e9',
      backgroundColor: 'white',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '12px',
      fontWeight: '500',
      color: '#4a5568',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    },
    controlButtonHover: {
      backgroundColor: '#f1f5f9',
      borderColor: '#cbd5e0'
    }
  };

  const getLayerIcon = (layer) => {
    switch (layer.type) {
      case 'text': return '📝';
      case 'image': return '🖼️';
      case 'shape': return '🔷';
      case 'group': return '📁';
      default: return '📄';
    }
  };

  const handleLayerClick = (layer) => {
    onLayerSelect(layer);
  };

  const handleVisibilityToggle = (layer, e) => {
    e.stopPropagation();
    onLayerUpdate(layer.id, { visible: !layer.visible });
  };

  const handleLockToggle = (layer, e) => {
    e.stopPropagation();
    onLayerUpdate(layer.id, { locked: !layer.locked });
  };

  const handleDuplicate = (layer, e) => {
    e.stopPropagation();
    onLayerDuplicate(layer);
  };

  const handleDelete = (layer, e) => {
    e.stopPropagation();
    onLayerDelete(layer.id);
  };

  const handleGroupToggle = (groupId) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  };

  const renderLayerItem = (layer, depth = 0) => {
    const isSelected = selectedLayer?.id === layer.id;
    const isGroup = layer.type === 'group';
    const isExpanded = expandedGroups.has(layer.id);

    return (
      <div key={layer.id}>
        <div
          style={{
            ...styles.layerItem,
            ...(isSelected ? styles.selectedLayer : {}),
            paddingLeft: `${12 + depth * 20}px`
          }}
          onClick={() => handleLayerClick(layer)}
          onMouseEnter={(e) => {
            e.currentTarget.querySelector('.layer-actions').style.opacity = '1';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.querySelector('.layer-actions').style.opacity = '0';
          }}
        >
          {isGroup && (
            <button
              style={styles.actionButton}
              onClick={(e) => {
                e.stopPropagation();
                handleGroupToggle(layer.id);
              }}
            >
              {isExpanded ? <FiChevronDown size={14} /> : <FiChevronRight size={14} />}
            </button>
          )}
          
          <div style={styles.layerThumbnail}>
            {getLayerIcon(layer)}
            {!layer.visible && (
              <div style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                width: '8px',
                height: '8px',
                backgroundColor: '#e53e3e',
                borderRadius: '50%'
              }} />
            )}
            {layer.locked && (
              <div style={{
                position: 'absolute',
                bottom: '-2px',
                right: '-2px',
                width: '8px',
                height: '8px',
                backgroundColor: '#f6ad55',
                borderRadius: '50%'
              }} />
            )}
          </div>
          
          <div style={styles.layerInfo}>
            <p style={styles.layerName}>{layer.name}</p>
            <p style={styles.layerType}>
              {layer.type} • {layer.width}×{layer.height}
            </p>
          </div>
          
          <div 
            className="layer-actions"
            style={styles.layerActions}
          >
            <button
              style={styles.actionButton}
              onClick={(e) => handleVisibilityToggle(layer, e)}
              title={layer.visible ? 'Hide layer' : 'Show layer'}
            >
              {layer.visible ? <FiEye size={14} /> : <FiEyeOff size={14} />}
            </button>
            
            <button
              style={styles.actionButton}
              onClick={(e) => handleLockToggle(layer, e)}
              title={layer.locked ? 'Unlock layer' : 'Lock layer'}
            >
              {layer.locked ? <FiLock size={14} /> : <FiUnlock size={14} />}
            </button>
            
            <button
              style={styles.actionButton}
              onClick={(e) => handleDuplicate(layer, e)}
              title="Duplicate layer"
            >
              <FiCopy size={14} />
            </button>
            
            <button
              style={styles.actionButton}
              onClick={(e) => handleDelete(layer, e)}
              title="Delete layer"
            >
              <FiTrash2 size={14} />
            </button>
          </div>
        </div>
        
        {isGroup && isExpanded && layer.children && (
          <div style={styles.groupContent}>
            {layer.children.map(child => renderLayerItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.headerTitle}>Layers</h3>
        <button style={styles.actionButton}>
          <FiMoreHorizontal size={16} />
        </button>
      </div>
      
      <div style={styles.layerList} className="custom-scrollbar">
        {layers.length === 0 ? (
          <div style={styles.emptyState}>
            <FiLayers style={styles.emptyIcon} />
            <p style={styles.emptyText}>No layers yet</p>
            <p style={{ ...styles.emptyText, fontSize: '12px', marginTop: '4px' }}>
              Add elements to see them here
            </p>
          </div>
        ) : (
          layers.map(layer => renderLayerItem(layer))
        )}
      </div>
      
      <div style={styles.layerControls}>
        <button style={styles.controlButton}>
          <FiLayers size={14} />
          Group
        </button>
        <button style={styles.controlButton}>
          <FiMove size={14} />
          Arrange
        </button>
      </div>
    </div>
  );
};

export default LayerManager;
