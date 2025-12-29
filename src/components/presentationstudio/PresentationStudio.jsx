import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import PromptSection from './PromptSection';
import EditorSection from './EditorSection';
import { generatePresentation, exportPresentation, rewriteContent, generateImage } from './PresentationService';
import './styles/PresentationStudio.css';

const API_BASE_URL = '/api/pp';

const PresentationStudio = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [tone, setTone] = useState('Professional');
  const [length, setLength] = useState('10');
  const [mediaStyle, setMediaStyle] = useState('AI Graphics');
  const [useBrandStyle, setUseBrandStyle] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [outlineText, setOutlineText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [generatedSlides, setGeneratedSlides] = useState([]);
  const [selectedSlide, setSelectedSlide] = useState(0);

// ----------------- handleGenerate -----------------
  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setGenerationStep(0);

    try {
      const data = await generatePresentation({ prompt });

      const normalizedSlides = data.slides.map((slide, index) => ({
        id: Date.now() + index,
        title: slide.title || `Slide ${index + 1}`,
        content: Array.isArray(slide.bullets) ? slide.bullets.join('\n') : slide.bullets || '',
        image: slide.image || null
      }));

      setGeneratedSlides(normalizedSlides);
      setSelectedSlide(0);
    } catch (error) {
      console.error('Error generating presentation:', error);
      alert(`Error generating presentation: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // ----------------- handleAiRewrite -----------------
  const handleAiRewrite = async (instruction) => {
    try {
      const updatedSlides = [...generatedSlides];
      const currentSlide = updatedSlides[selectedSlide];

      const result = await rewriteContent(currentSlide.content, instruction);
      currentSlide.content = result.rewrittenContent;

      setGeneratedSlides(updatedSlides);
    } catch (error) {
      console.error('Error rewriting content:', error);
      alert(`Failed to rewrite content: ${error.message}`);
    }
  };

  // ----------------- handleAddImage -----------------
  const handleAddImage = async () => {
    try {
      const currentSlide = generatedSlides[selectedSlide];
      const result = await generateImage(`${currentSlide.title}. ${currentSlide.content.substring(0, 100)}...`);

      const updatedSlides = [...generatedSlides];
      updatedSlides[selectedSlide].image = result.imageUrl;
      setGeneratedSlides(updatedSlides);
    } catch (error) {
      console.error('Error adding image:', error);
      alert(`Failed to add image: ${error.message}`);
    }
  };

  // ----------------- handleExport -----------------
  const handleExport = async (format) => {
    if (generatedSlides.length === 0) return;
    setIsExporting(true);

    try {
      const blob = await exportPresentation(generatedSlides, format);
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `presentation.${format}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting presentation:', error);
      alert(`Failed to export presentation: ${error.message}`);
    } finally {
      setIsExporting(false);
    }
  };



  const handleSavePresentation = async () => {
    if (generatedSlides.length === 0) return;
    
    try {
      // Save the presentation to the backend
      const response = await fetch(`${API_BASE_URL}/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slides: generatedSlides
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to save presentation: ${response.status}`);
      }
      
      const result = await response.json();
      alert(`Presentation saved successfully with ID: ${result.id}!`);
    } catch (error) {
      console.error('Error saving presentation:', error);
      alert(`Failed to save presentation: ${error.message}`);
    }
  };

  const handleSharePresentation = async () => {
    if (generatedSlides.length === 0) return;
    
    try {
      // Generate a shareable link through the backend
      const response = await fetch(`${API_BASE_URL}/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slides: generatedSlides
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to generate share link: ${response.status}`);
      }
      
      const result = await response.json();
      const shareLink = result.shareUrl;
      
      navigator.clipboard.writeText(shareLink);
      alert('Presentation link copied to clipboard!');
    } catch (error) {
      console.error('Error sharing presentation:', error);
      alert(`Failed to generate share link: ${error.message}`);
    }
  };

  const handleAddSlide = (template = null) => {
    const newSlide = template ? 
      { ...template, id: Date.now() + Math.random() } : // Ensure unique ID
      {
        id: Date.now() + Math.random(), // Ensure unique ID
        title: 'New Slide',
        content: '',
        image: null
      };
    setGeneratedSlides([...generatedSlides, newSlide]);
    setSelectedSlide(generatedSlides.length);
  };

  const handleDeleteSlide = (index) => {
    if (generatedSlides.length <= 1) return;
    const updatedSlides = generatedSlides.filter((_, i) => i !== index);
    setGeneratedSlides(updatedSlides);
    // Update selected slide index if needed
    if (selectedSlide >= updatedSlides.length) {
      setSelectedSlide(updatedSlides.length - 1);
    } else if (selectedSlide > index) {
      // If we deleted a slide before the selected slide, adjust the index
      setSelectedSlide(selectedSlide - 1);
    } else if (selectedSlide === index) {
      // If we deleted the selected slide, select the previous one or first one
      setSelectedSlide(Math.max(0, index - 1));
    }
  };

  const handleDuplicateSlide = (index) => {
    const slideToDuplicate = generatedSlides[index];
    const duplicatedSlide = {
      ...slideToDuplicate,
      id: Date.now() + Math.random(), // Ensure unique ID
      title: `${slideToDuplicate.title} (Copy)`
    };
    const updatedSlides = [...generatedSlides];
    updatedSlides.splice(index + 1, 0, duplicatedSlide);
    setGeneratedSlides(updatedSlides);
  };

  const handleEditSlide = (index, updatedSlideData) => {
    const updatedSlides = [...generatedSlides];
    updatedSlides[index] = { ...updatedSlides[index], ...updatedSlideData };
    setGeneratedSlides(updatedSlides);
  };

  return (
    <div className="presentation-studio">
      <div className="presentation-studio-container">
        <Header 
          handleSavePresentation={handleSavePresentation}
          handleExport={handleExport}
          handleSharePresentation={handleSharePresentation}
          isExporting={isExporting}
        />
        
        {generatedSlides.length === 0 ? (
          <PromptSection 
            prompt={prompt}
            setPrompt={setPrompt}
            tone={tone}
            setTone={setTone}
            length={length}
            setLength={setLength}
            mediaStyle={mediaStyle}
            setMediaStyle={setMediaStyle}
            useBrandStyle={useBrandStyle}
            setUseBrandStyle={setUseBrandStyle}
            showAdvanced={showAdvanced}
            setShowAdvanced={setShowAdvanced}
            outlineText={outlineText}
            setOutlineText={setOutlineText}
            handleGenerate={handleGenerate}
            isGenerating={isGenerating}
            generationStep={generationStep}
          />
        ) : (
          <EditorSection
            generatedSlides={generatedSlides}
            selectedSlide={selectedSlide}
            handleEditSlide={handleEditSlide}
            handleDuplicateSlide={handleDuplicateSlide}
            handleDeleteSlide={handleDeleteSlide}
            handleAiRewrite={handleAiRewrite}
            handleAddImage={handleAddImage}
            handleAddChart={() => alert('Chart added to slide!')}
            handleAddSlide={handleAddSlide}
            setSelectedSlide={setSelectedSlide}
          />
        )}
      </div>
    </div>
  );
};

export default PresentationStudio;