import { useState } from "react";
import "./editor.css";

export default function Toolbar({ onToolChange }) {
  const [activeTool, setActiveTool] = useState("select");

  const handleToolClick = (tool) => {
    try {
      setActiveTool(tool);
      if (onToolChange) {
        onToolChange(tool);
      }
    } catch (error) {
      console.error("Error changing tool:", error);
    }
  };

  return (
    <div className="toolbar">
      <button 
        className={`tool-btn ${activeTool === "select" ? "active" : ""}`}
        onClick={() => handleToolClick("select")}
      >
        Select
      </button>
      <button 
        className={`tool-btn ${activeTool === "text" ? "active" : ""}`}
        onClick={() => handleToolClick("text")}
      >
        Text
      </button>
      <button 
        className={`tool-btn ${activeTool === "shape" ? "active" : ""}`}
        onClick={() => handleToolClick("shape")}
      >
        Shape
      </button>
      <button 
        className={`tool-btn ${activeTool === "image" ? "active" : ""}`}
        onClick={() => handleToolClick("image")}
      >
        Image
      </button>
      <button 
        className={`tool-btn ${activeTool === "pen" ? "active" : ""}`}
        onClick={() => handleToolClick("pen")}
      >
        Pen
      </button>
    </div>
  );
}