import React, { useState } from 'react';
import { Layers, Eye, EyeOff, Trash2, Copy, ChevronDown, ChevronRight, GripVertical } from 'lucide-react';

const LayerManager = ({ layers, selectedLayerId, onSelectLayer, onDeleteLayer, onToggleVisibility, onDuplicateLayer, onReorderLayers, onUpdateLayer }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [draggedLayerId, setDraggedLayerId] = useState(null);
  const [dragOverLayerId, setDragOverLayerId] = useState(null);
  const [renamingLayerId, setRenamingLayerId] = useState(null);
  const [renameValue, setRenameValue] = useState('');

  const handleDragStart = (layerId) => {
    setDraggedLayerId(layerId);
  };

  const handleDragOver = (e, layerId) => {
    e.preventDefault();
    if (draggedLayerId && draggedLayerId !== layerId) {
      setDragOverLayerId(layerId);
    }
  };

  const handleDragEnd = () => {
    if (draggedLayerId && dragOverLayerId && draggedLayerId !== dragOverLayerId) {
      const draggedIndex = layers.findIndex(l => l.id === draggedLayerId);
      const targetIndex = layers.findIndex(l => l.id === dragOverLayerId);
      
      if (draggedIndex !== -1 && targetIndex !== -1) {
        const newLayers = [...layers];
        const [removed] = newLayers.splice(draggedIndex, 1);
        // Calculate correct insertion index (accounting for reversed display)
        // If dragging from higher index to lower (moving up visually), insert before target
        // If dragging from lower index to higher (moving down visually), insert after target
        let insertIndex = targetIndex;
        if (draggedIndex > targetIndex) {
          insertIndex = targetIndex;
        } else {
          insertIndex = targetIndex + 1;
        }
        // Adjust for the removed item
        if (draggedIndex < insertIndex) {
          insertIndex--;
        }
        newLayers.splice(insertIndex, 0, removed);
        onReorderLayers(newLayers);
      }
    }
    setDraggedLayerId(null);
    setDragOverLayerId(null);
  };

  const getLayerIcon = (layer) => {
    if (layer.type === 'text') {
      return 'T';
    } else if (layer.type === 'shape') {
      return '□';
    } else if (layer.type === 'image') {
      return '🖼';
    }
    return '•';
  };

  const startRenameLayer = (layer, e) => {
    if (e) e.stopPropagation();
    setRenamingLayerId(layer.id);
    setRenameValue(layer.name || '');
  };

  const commitRenameLayer = () => {
    if (!renamingLayerId || !onUpdateLayer) return;
    const trimmed = renameValue.trim();
    if (trimmed) {
      onUpdateLayer(renamingLayerId, { name: trimmed });
    }
    setRenamingLayerId(null);
    setRenameValue('');
  };

  const cancelRenameLayer = () => {
    setRenamingLayerId(null);
    setRenameValue('');
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: '4px 0',
        }}
      >
        <span
          style={{
            fontSize: '0.78rem',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: '#94a3b8',
            fontWeight: 700,
          }}
        >
          Layers ({layers.length})
        </span>
        {isOpen ? <ChevronDown size={16} color="#94a3b8" /> : <ChevronRight size={16} color="#94a3b8" />}
      </button>
      {isOpen && (
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {layers.length === 0 ? (
            <div
              style={{
                padding: '16px',
                textAlign: 'center',
                color: '#94a3b8',
                fontSize: '0.85rem',
              }}
            >
              No layers yet
            </div>
          ) : (
            [...layers].reverse().map((layer, index) => {
              const originalIndex = layers.length - 1 - index;
              const isSelected = layer.id === selectedLayerId;
              const isDragging = draggedLayerId === layer.id;
              const isDragOver = dragOverLayerId === layer.id;

              return (
                <div
                  key={layer.id}
                  draggable
                  onDragStart={() => handleDragStart(layer.id)}
                  onDragOver={(e) => handleDragOver(e, layer.id)}
                  onDragEnd={handleDragEnd}
                  onClick={() => onSelectLayer(layer.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 10px',
                    borderRadius: 12,
                    background: isSelected
                      ? 'rgba(79, 70, 229, 0.12)'
                      : isDragOver
                      ? 'rgba(79, 70, 229, 0.06)'
                      : 'transparent',
                    border: isSelected
                      ? '1px solid rgba(79, 70, 229, 0.3)'
                      : '1px solid transparent',
                    cursor: 'pointer',
                    opacity: isDragging ? 0.5 : 1,
                    transition: 'all 0.15s ease',
                  }}
                >
                  <GripVertical size={14} color="#94a3b8" style={{ cursor: 'grab' }} />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleVisibility(layer.id);
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      padding: 2,
                    }}
                  >
                    {layer.visible ? (
                      <Eye size={14} color="#64748b" />
                    ) : (
                      <EyeOff size={14} color="#94a3b8" />
                    )}
                  </button>
                  <span
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 6,
                      background: layer.type === 'text'
                        ? 'rgba(99, 102, 241, 0.1)'
                        : layer.type === 'shape'
                        ? 'rgba(236, 72, 153, 0.1)'
                        : 'rgba(148, 163, 184, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color:
                        layer.type === 'text'
                          ? '#6366f1'
                          : layer.type === 'shape'
                          ? '#ec4899'
                          : '#64748b',
                      flexShrink: 0,
                    }}
                  >
                    {getLayerIcon(layer)}
                  </span>
                  {renamingLayerId === layer.id ? (
                    <input
                      autoFocus
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onBlur={commitRenameLayer}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          commitRenameLayer();
                        }
                        if (e.key === 'Escape') {
                          e.preventDefault();
                          cancelRenameLayer();
                        }
                      }}
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        flex: 1,
                        padding: '4px 6px',
                        border: '1px solid rgba(79, 70, 229, 0.5)',
                        borderRadius: '6px',
                        fontSize: '0.85rem',
                        fontWeight: isSelected ? 600 : 500,
                        outline: 'none',
                        backgroundColor: 'white',
                        minWidth: 0,
                      }}
                    />
                  ) : (
                    <span
                      style={{
                        flex: 1,
                        fontSize: '0.85rem',
                        fontWeight: isSelected ? 600 : 500,
                        color: layer.visible ? '#0f172a' : '#94a3b8',
                        textDecoration: layer.visible ? 'none' : 'line-through',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        cursor: 'text',
                      }}
                      onDoubleClick={(e) => startRenameLayer(layer, e)}
                      title="Double-click to rename"
                    >
                      {layer.name || `Layer ${originalIndex + 1}`}
                    </span>
                  )}
                  <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDuplicateLayer(layer.id);
                      }}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        padding: 4,
                        borderRadius: 6,
                      }}
                      title="Duplicate"
                    >
                      <Copy size={12} color="#64748b" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteLayer(layer.id);
                      }}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        padding: 4,
                        borderRadius: 6,
                      }}
                      title="Delete"
                    >
                      <Trash2 size={12} color="#ef4444" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default LayerManager;

