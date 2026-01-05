import React, { useRef, useEffect, useState } from "react";
import Toolbar from "./Toolbar.jsx";
import { CanvasManager } from "./CanvasManager.jsx";
import "./editor.css";

export default function Editor() {
  const canvasRef = useRef(null);
  const [currentTool, setCurrentTool] = useState("select");
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Editor component mounted");
    
    const initializeCanvas = () => {
      try {
        if (canvasRef.current) {
          console.log("Initializing CanvasManager with canvas element");
          CanvasManager.init(canvasRef.current);
        } else {
          console.error("Canvas ref is not available");
          setError("Failed to initialize canvas - element not available");
        }
      } catch (err) {
        console.error("Error initializing canvas:", err);
        setError(`Failed to initialize canvas: ${err.message}`);
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(initializeCanvas, 100);
    
    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleToolChange = (tool) => {
    setCurrentTool(tool);
    console.log("Tool changed to:", tool);
  };

  return (
    <div className="editor-container">
      <Toolbar onToolChange={handleToolChange} />
      
      {error && (
        <div className="error-message" style={{ color: 'red', padding: '10px', textAlign: 'center' }}>
          Error: {error}
        </div>
      )}

      <div className="canvas-holder">
        <canvas 
          ref={canvasRef} 
          id="athena-editor-canvas" 
          style={{ border: error ? '2px solid red' : '1px dashed #a59ad1' }}
        />
      </div>
    </div>
  );
}