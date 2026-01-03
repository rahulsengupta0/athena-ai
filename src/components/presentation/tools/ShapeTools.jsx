import React, { useState } from 'react';
import {
  Square,
  Circle,
  Triangle,
  Star,
  Heart,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  ChevronDown,
  ChevronRight,
  Minus,
} from 'lucide-react';

const SHAPE_PRESETS = [
  {
    id: 'rectangle',
    label: 'Rectangle',
    description: 'Filled block',
    icon: <Square size={16} />,
    preset: {
      type: 'shape',
      shape: 'rectangle',
      width: 480,
      height: 260,
      fillColor: '#6366f1',
      borderRadius: 18,
    },
  },
  {
    id: 'circle',
    label: 'Circle',
    description: 'Perfect circle',
    icon: <Circle size={16} />,
    preset: {
      type: 'shape',
      shape: 'circle',
      width: 320,
      height: 320,
      fillColor: '#ec4899',
    },
  },
  {
    id: 'ellipse',
    label: 'Ellipse',
    description: 'Oval shape',
    icon: <Circle size={16} />,
    preset: {
      type: 'shape',
      shape: 'ellipse',
      width: 400,
      height: 240,
      fillColor: '#10b981',
    },
  },
  {
    id: 'triangle',
    label: 'Triangle',
    description: 'Equilateral triangle',
    icon: <Triangle size={16} />,
    preset: {
      type: 'shape',
      shape: 'triangle',
      width: 300,
      height: 300,
      fillColor: '#f59e0b',
    },
  },
  {
    id: 'right-triangle',
    label: 'Right Triangle',
    description: 'Right-angled triangle',
    icon: <Triangle size={16} />,
    preset: {
      type: 'shape',
      shape: 'right-triangle',
      width: 300,
      height: 300,
      fillColor: '#8b5cf6',
    },
  },
  {
    id: 'star',
    label: 'Star',
    description: 'Five-pointed star',
    icon: <Star size={16} />,
    preset: {
      type: 'shape',
      shape: 'star',
      width: 300,
      height: 300,
      fillColor: '#fbbf24',
    },
  },
  {
    id: 'heart',
    label: 'Heart',
    description: 'Heart shape',
    icon: <Heart size={16} />,
    preset: {
      type: 'shape',
      shape: 'heart',
      width: 280,
      height: 280,
      fillColor: '#ef4444',
    },
  },
  {
    id: 'diamond',
    label: 'Diamond',
    description: 'Diamond shape',
    icon: <Square size={16} style={{ transform: 'rotate(45deg)' }} />,
    preset: {
      type: 'shape',
      shape: 'diamond',
      width: 300,
      height: 300,
      fillColor: '#06b6d4',
    },
  },
  {
    id: 'pentagon',
    label: 'Pentagon',
    description: 'Five-sided shape',
    icon: <Square size={16} />,
    preset: {
      type: 'shape',
      shape: 'pentagon',
      width: 300,
      height: 300,
      fillColor: '#14b8a6',
    },
  },
  {
    id: 'hexagon',
    label: 'Hexagon',
    description: 'Six-sided shape',
    icon: <Square size={16} />,
    preset: {
      type: 'shape',
      shape: 'hexagon',
      width: 300,
      height: 300,
      fillColor: '#3b82f6',
    },
  },
  {
    id: 'arrow-right',
    label: 'Arrow Right',
    description: 'Right arrow',
    icon: <ArrowRight size={16} />,
    preset: {
      type: 'shape',
      shape: 'arrow-right',
      width: 200,
      height: 100,
      fillColor: '#6366f1',
    },
  },
  {
    id: 'arrow-left',
    label: 'Arrow Left',
    description: 'Left arrow',
    icon: <ArrowLeft size={16} />,
    preset: {
      type: 'shape',
      shape: 'arrow-left',
      width: 200,
      height: 100,
      fillColor: '#6366f1',
    },
  },
  {
    id: 'arrow-up',
    label: 'Arrow Up',
    description: 'Up arrow',
    icon: <ArrowUp size={16} />,
    preset: {
      type: 'shape',
      shape: 'arrow-up',
      width: 100,
      height: 200,
      fillColor: '#6366f1',
    },
  },
  {
    id: 'arrow-down',
    label: 'Arrow Down',
    description: 'Down arrow',
    icon: <ArrowDown size={16} />,
    preset: {
      type: 'shape',
      shape: 'arrow-down',
      width: 100,
      height: 200,
      fillColor: '#6366f1',
    },
  },
  {
    id: 'line',
    label: 'Line',
    description: 'Straight line',
    icon: <Minus size={16} />,
    preset: {
      type: 'shape',
      shape: 'line',
      width: 400,
      height: 4,
      fillColor: '#0f172a',
    },
  },
];

const ShapeTools = ({ selectedPreset, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

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
          Shapes
        </span>
        {isOpen ? <ChevronDown size={16} color="#94a3b8" /> : <ChevronRight size={16} color="#94a3b8" />}
      </button>
      {isOpen && (
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {SHAPE_PRESETS.map((preset) => {
          const isActive = selectedPreset?.id === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => onSelect(preset)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 14px',
                borderRadius: 16,
                border: isActive ? '1px solid rgba(79, 70, 229, 0.75)' : '1px solid rgba(15, 23, 42, 0.08)',
                background: isActive ? 'rgba(79, 70, 229, 0.08)' : '#ffffff',
                cursor: 'pointer',
                textAlign: 'left',
                fontWeight: 600,
                color: '#0f172a',
              }}
            >
              <span
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 14,
                  background: 'rgba(15, 23, 42, 0.06)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isActive ? '#4338ca' : '#0f172a',
                }}
              >
                {preset.icon}
              </span>
              <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span>{preset.label}</span>
                <span style={{ color: '#64748b', fontSize: '0.82rem', fontWeight: 500 }}>
                  {preset.description}
                </span>
              </span>
            </button>
          );
        })}
        </div>
      )}
    </div>
  );
};

export default ShapeTools;

