import React, { useState } from 'react';
import { FiZap } from 'react-icons/fi';

const AIImageGenerator = ({ 
  onImageGenerated, 
  hoveredOption, 
  setHoveredOption,
  imageSettings 
}) => {
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');

  const handleAIGenerateImage = async () => {
    if (!aiPrompt.trim()) {
      alert('Please enter a prompt to generate an image');
      return;
    }

    setIsGeneratingAI(true);
    try {
      const response = await fetch("http://localhost:5000/api/image/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPrompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const data = await response.json();
      const imageB64 = data.data?.[0]?.b64_json || "";

      if (imageB64 && imageB64.length > 50) {
        const imgSrc = `data:image/png;base64,${imageB64}`;
        
        // Create a new image object
        const newImage = {
          id: Date.now(),
          type: 'image',
          name: `AI Generated: ${aiPrompt.substring(0, 20)}...`,
          src: imgSrc,
          x: 100,
          y: 100,
          width: 200,
          height: 200,
          visible: true,
          locked: false,
          rotation: 0,
          ...imageSettings
        };
        
        // Call the callback to add image to canvas
        if (onImageGenerated) {
          onImageGenerated(newImage);
        }
        
        // Clear the prompt after successful generation
        setAiPrompt('');
      } else {
        alert('Failed to generate image. Please try again.');
      }
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Error generating image: ' + error.message);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  return (
    <div style={{ marginTop: '12px', width: '100%' }}>
      <input
        type="text"
        placeholder="Enter prompt for AI image..."
        value={aiPrompt}
        onChange={(e) => setAiPrompt(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter' && !isGeneratingAI) {
            handleAIGenerateImage();
          }
        }}
        style={{
          width: '100%',
          padding: '10px 12px',
          borderRadius: '8px',
          border: '1px solid #475569',
          backgroundColor: '#1e293b',
          color: '#ffffff',
          fontSize: '13px',
          marginBottom: '8px',
          outline: 'none',
          boxSizing: 'border-box'
        }}
        disabled={isGeneratingAI}
      />
      <button
        style={{ 
          padding: '20px 16px',
          border: '2px dashed #8b5cf6',
          borderRadius: '12px',
          background: hoveredOption === 'generate-ai' 
            ? 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)' 
            : 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
          cursor: isGeneratingAI ? 'not-allowed' : 'pointer',
          margin: '0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px',
          fontSize: '14px',
          fontWeight: '600',
          width: '100%',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          color: '#ffffff',
          boxShadow: hoveredOption === 'generate-ai' 
            ? '0 6px 16px rgba(139, 92, 246, 0.4)' 
            : '0 4px 12px rgba(139, 92, 246, 0.3)',
          minHeight: '90px',
          borderColor: hoveredOption === 'generate-ai' ? '#a855f7' : '#8b5cf6',
          transform: hoveredOption === 'generate-ai' ? 'translateY(-2px)' : 'translateY(0)',
          opacity: isGeneratingAI ? 0.6 : 1
        }}
        onMouseEnter={() => !isGeneratingAI && setHoveredOption('generate-ai')}
        onMouseLeave={() => setHoveredOption(null)}
        onClick={handleAIGenerateImage}
        disabled={isGeneratingAI}
      >
        <FiZap size={20} color="#ffffff" />
        <span style={{ 
          color: '#ffffff',
          fontSize: '13px',
          fontWeight: '600',
          textAlign: 'center',
          lineHeight: '1.2'
        }}>
          {isGeneratingAI ? 'Generating...' : 'Generate with AI'}
        </span>
      </button>
    </div>
  );
};

export default AIImageGenerator;




