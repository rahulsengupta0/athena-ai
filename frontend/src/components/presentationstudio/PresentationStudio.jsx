import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import PromptSection from './PromptSection';
import EditorSection from './EditorSection';
import { generatePresentation, exportPresentation, rewriteContent, generateImage } from './presentationService.js';
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
  const [presentationTheme, setPresentationTheme] = useState({ backgroundColor: '#ffffff', textColor: '#000000', font: 'inherit' });

// ----------------- handleGenerate -----------------
  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setGenerationStep(0);

    try {
      const data = await generatePresentation({
        prompt,
        tone,
        length,
        mediaStyle,
        useBrandStyle,
        outlineText
      });

      // Update the theme with the one from the backend
      setPresentationTheme(data.theme || { backgroundColor: '#ffffff', textColor: '#000000', font: 'inherit' });

      const normalizedSlides = data.slides.map((slide, index) => ({
        id: Date.now() + index,
        title: slide.title || `Slide ${index + 1}`,
        bullets: Array.isArray(slide.bullets) ? slide.bullets : (slide.bullets ? [slide.bullets] : []),
        content: Array.isArray(slide.bullets) ? slide.bullets.join('\n') : slide.bullets || '',
        type: slide.type || 'bullet',
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

      // Convert bullets array to string for AI processing if needed
      const contentToProcess = Array.isArray(currentSlide.bullets) ?
        currentSlide.bullets.join('\n') : currentSlide.content || '';

      const result = await rewriteContent(contentToProcess, instruction);

      // If the slide has bullets array, update it as array, otherwise update content
      if (Array.isArray(currentSlide.bullets)) {
        currentSlide.bullets = result.rewrittenContent.split('\n');
      } else {
        currentSlide.content = result.rewrittenContent;
      }

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

      // Use content or bullets for image generation
      const contentForImage = Array.isArray(currentSlide.bullets) ?
        currentSlide.bullets.join(' ') : currentSlide.content || '';

      const result = await generateImage(`${currentSlide.title}. ${contentForImage.substring(0, 100)}...`);

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
      console.log(generatedSlides);

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
        bullets: [],
        content: '',
        type: 'bullet',
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

  const handleEditSlide = (index, field, value) => {
    const updated = [...generatedSlides];

    // Handle updating a specific index in an array (for bullets)
    if (typeof value === 'object' && value.index !== undefined && value.value !== undefined) {
      if (Array.isArray(updated[index][field])) {
        const newArray = [...updated[index][field]];
        newArray[value.index] = value.value;
        updated[index][field] = newArray;
      } else {
        // If the field is not an array, initialize it as one with the value at the given index
        const newArray = [];
        newArray[value.index] = value.value;
        updated[index][field] = newArray;
      }
    } else if (Array.isArray(updated[index][field]) && Array.isArray(value)) {
      updated[index][field] = value;
    } else {
      updated[index][field] = value;
    }
    setGeneratedSlides(updated);
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
            presentationTheme={presentationTheme}
          />
        )}
      </div>
    </div>
  );
};

export default PresentationStudio;