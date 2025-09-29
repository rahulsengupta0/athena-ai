import React, { useState, useRef, useEffect } from 'react';
import { 
  FiBold, FiItalic, FiUnderline, FiAlignLeft, FiAlignCenter, 
  FiAlignRight, FiAlignJustify, FiType, FiPalette, FiSize,
  FiMove, FiRotateCw, FiTrash2, FiCopy, FiSave
} from 'react-icons/fi';

const TextEditor = ({ textElement, onUpdate, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(textElement?.text || 'Double click to edit');
  const [fontSize, setFontSize] = useState(textElement?.fontSize || 24);
  const [fontFamily, setFontFamily] = useState(textElement?.fontFamily || 'Arial');
  const [fontWeight, setFontWeight] = useState(textElement?.fontWeight || 'normal');
  const [fontStyle, setFontStyle] = useState(textElement?.fontStyle || 'normal');
  const [textDecoration, setTextDecoration] = useState(textElement?.textDecoration || 'none');
  const [textAlign, setTextAlign] = useState(textElement?.textAlign || 'left');
  const [color, setColor] = useState(textElement?.color || '#000000');
  const [backgroundColor, setBackgroundColor] = useState(textElement?.backgroundColor || 'transparent');
  const [opacity, setOpacity] = useState(textElement?.opacity || 1);
  const [rotation, setRotation] = useState(textElement?.rotation || 0);
  const [x, setX] = useState(textElement?.x || 100);
  const [y, setY] = useState(textElement?.y || 100);
  const [width, setWidth] = useState(textElement?.width || 200);
  const [height, setHeight] = useState(textElement?.height || 50);

  const textAreaRef = useRef(null);

  const fonts = [
    'Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Verdana',
    'Trebuchet MS', 'Impact', 'Comic Sans MS', 'Courier New', 'Palatino'
  ];

  const styles = {
    container: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'white',
      border: '2px solid #3182ce',
      borderRadius: '8px',
      padding: '20px',
      minWidth: '400px',
      maxWidth: '600px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
      zIndex: 1000
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '20px',
      paddingBottom: '12px',
      borderBottom: '1px solid #e1e5e9'
    },
    title: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#2d3748',
      margin: 0
    },
    closeButton: {
      padding: '4px',
      border: 'none',
      backgroundColor: 'transparent',
      cursor: 'pointer',
      borderRadius: '4px',
      color: '#718096',
      transition: 'all 0.2s'
    },
    content: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    },
    row: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    label: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#4a5568',
      minWidth: '80px'
    },
    input: {
      padding: '8px 12px',
      border: '1px solid #e1e5e9',
      borderRadius: '6px',
      fontSize: '14px',
      flex: 1
    },
    select: {
      padding: '8px 12px',
      border: '1px solid #e1e5e9',
      borderRadius: '6px',
      fontSize: '14px',
      backgroundColor: 'white',
      flex: 1
    },
    buttonGroup: {
      display: 'flex',
      gap: '8px'
    },
    button: {
      padding: '8px 12px',
      border: '1px solid #e1e5e9',
      backgroundColor: 'white',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      color: '#4a5568',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    activeButton: {
      backgroundColor: '#3182ce',
      color: 'white',
      borderColor: '#3182ce'
    },
    textArea: {
      width: '100%',
      minHeight: '100px',
      padding: '12px',
      border: '1px solid #e1e5e9',
      borderRadius: '6px',
      fontSize: '16px',
      fontFamily: fontFamily,
      fontWeight: fontWeight,
      fontStyle: fontStyle,
      textDecoration: textDecoration,
      textAlign: textAlign,
      color: color,
      backgroundColor: backgroundColor === 'transparent' ? 'white' : backgroundColor,
      opacity: opacity,
      resize: 'vertical'
    },
    colorInput: {
      width: '40px',
      height: '40px',
      border: '1px solid #e1e5e9',
      borderRadius: '6px',
      cursor: 'pointer'
    },
    slider: {
      flex: 1,
      height: '6px',
      borderRadius: '3px',
      background: '#e1e5e9',
      outline: 'none',
      appearance: 'none'
    },
    sliderThumb: {
      appearance: 'none',
      width: '20px',
      height: '20px',
      borderRadius: '50%',
      background: '#3182ce',
      cursor: 'pointer'
    },
    actions: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '12px',
      marginTop: '20px',
      paddingTop: '16px',
      borderTop: '1px solid #e1e5e9'
    },
    actionButton: {
      padding: '10px 20px',
      border: '1px solid #e1e5e9',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    primaryButton: {
      backgroundColor: '#3182ce',
      color: 'white',
      borderColor: '#3182ce'
    },
    secondaryButton: {
      backgroundColor: 'white',
      color: '#4a5568',
      borderColor: '#e1e5e9'
    }
  };

  useEffect(() => {
    if (isEditing && textAreaRef.current) {
      textAreaRef.current.focus();
      textAreaRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    const updatedElement = {
      ...textElement,
      text,
      fontSize,
      fontFamily,
      fontWeight,
      fontStyle,
      textDecoration,
      textAlign,
      color,
      backgroundColor,
      opacity,
      rotation,
      x,
      y,
      width,
      height
    };
    onUpdate(updatedElement);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  const toggleFormat = (format) => {
    switch (format) {
      case 'bold':
        setFontWeight(fontWeight === 'bold' ? 'normal' : 'bold');
        break;
      case 'italic':
        setFontStyle(fontStyle === 'italic' ? 'normal' : 'italic');
        break;
      case 'underline':
        setTextDecoration(textDecoration === 'underline' ? 'none' : 'underline');
        break;
    }
  };

  const handleAlign = (align) => {
    setTextAlign(align);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>Text Editor</h3>
        <button style={styles.closeButton} onClick={handleCancel}>
          ✕
        </button>
      </div>

      <div style={styles.content}>
        {/* Text Content */}
        <div>
          <label style={styles.label}>Text:</label>
          <textarea
            ref={textAreaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={styles.textArea}
            placeholder="Enter your text here..."
          />
        </div>

        {/* Font Settings */}
        <div style={styles.row}>
          <label style={styles.label}>Font:</label>
          <select
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
            style={styles.select}
          >
            {fonts.map(font => (
              <option key={font} value={font}>{font}</option>
            ))}
          </select>
        </div>

        <div style={styles.row}>
          <label style={styles.label}>Size:</label>
          <input
            type="number"
            value={fontSize}
            onChange={(e) => setFontSize(parseInt(e.target.value))}
            style={styles.input}
            min="8"
            max="200"
          />
        </div>

        {/* Formatting Buttons */}
        <div style={styles.row}>
          <label style={styles.label}>Format:</label>
          <div style={styles.buttonGroup}>
            <button
              style={{
                ...styles.button,
                ...(fontWeight === 'bold' ? styles.activeButton : {})
              }}
              onClick={() => toggleFormat('bold')}
            >
              <FiBold size={16} />
            </button>
            <button
              style={{
                ...styles.button,
                ...(fontStyle === 'italic' ? styles.activeButton : {})
              }}
              onClick={() => toggleFormat('italic')}
            >
              <FiItalic size={16} />
            </button>
            <button
              style={{
                ...styles.button,
                ...(textDecoration === 'underline' ? styles.activeButton : {})
              }}
              onClick={() => toggleFormat('underline')}
            >
              <FiUnderline size={16} />
            </button>
          </div>
        </div>

        {/* Alignment */}
        <div style={styles.row}>
          <label style={styles.label}>Align:</label>
          <div style={styles.buttonGroup}>
            <button
              style={{
                ...styles.button,
                ...(textAlign === 'left' ? styles.activeButton : {})
              }}
              onClick={() => handleAlign('left')}
            >
              <FiAlignLeft size={16} />
            </button>
            <button
              style={{
                ...styles.button,
                ...(textAlign === 'center' ? styles.activeButton : {})
              }}
              onClick={() => handleAlign('center')}
            >
              <FiAlignCenter size={16} />
            </button>
            <button
              style={{
                ...styles.button,
                ...(textAlign === 'right' ? styles.activeButton : {})
              }}
              onClick={() => handleAlign('right')}
            >
              <FiAlignRight size={16} />
            </button>
            <button
              style={{
                ...styles.button,
                ...(textAlign === 'justify' ? styles.activeButton : {})
              }}
              onClick={() => handleAlign('justify')}
            >
              <FiAlignJustify size={16} />
            </button>
          </div>
        </div>

        {/* Colors */}
        <div style={styles.row}>
          <label style={styles.label}>Color:</label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            style={styles.colorInput}
          />
          <label style={styles.label}>Background:</label>
          <input
            type="color"
            value={backgroundColor === 'transparent' ? '#ffffff' : backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
            style={styles.colorInput}
          />
        </div>

        {/* Position & Size */}
        <div style={styles.row}>
          <label style={styles.label}>X:</label>
          <input
            type="number"
            value={x}
            onChange={(e) => setX(parseInt(e.target.value))}
            style={styles.input}
          />
          <label style={styles.label}>Y:</label>
          <input
            type="number"
            value={y}
            onChange={(e) => setY(parseInt(e.target.value))}
            style={styles.input}
          />
        </div>

        <div style={styles.row}>
          <label style={styles.label}>Width:</label>
          <input
            type="number"
            value={width}
            onChange={(e) => setWidth(parseInt(e.target.value))}
            style={styles.input}
          />
          <label style={styles.label}>Height:</label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(parseInt(e.target.value))}
            style={styles.input}
          />
        </div>

        {/* Opacity & Rotation */}
        <div style={styles.row}>
          <label style={styles.label}>Opacity:</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={opacity}
            onChange={(e) => setOpacity(parseFloat(e.target.value))}
            style={styles.slider}
          />
          <span style={{ fontSize: '12px', color: '#718096', minWidth: '30px' }}>
            {Math.round(opacity * 100)}%
          </span>
        </div>

        <div style={styles.row}>
          <label style={styles.label}>Rotation:</label>
          <input
            type="range"
            min="0"
            max="360"
            value={rotation}
            onChange={(e) => setRotation(parseInt(e.target.value))}
            style={styles.slider}
          />
          <span style={{ fontSize: '12px', color: '#718096', minWidth: '30px' }}>
            {rotation}°
          </span>
        </div>
      </div>

      <div style={styles.actions}>
        <button
          style={{ ...styles.actionButton, ...styles.secondaryButton }}
          onClick={handleCancel}
        >
          Cancel
        </button>
        <button
          style={{ ...styles.actionButton, ...styles.primaryButton }}
          onClick={handleSave}
        >
          <FiSave size={16} />
          Save
        </button>
      </div>
    </div>
  );
};

export default TextEditor;
