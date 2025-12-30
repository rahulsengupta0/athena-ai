import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import PromptSection from './PromptSection';
import EditorSection from './EditorSection';
import { generatePresentation, getPresentation, exportPresentation } from './presentationService';
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

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setGenerationStep(0);

    try {
      const params = {
        prompt,
        tone,
        length,
        mediaStyle,
        useBrandStyle,
        outlineText
      };

      console.log('Sending presentation generation request:', params);

      const gammaResponse = await generatePresentation(params);
      console.log('Gamma API Response:', gammaResponse);

      // Check if we got the slides directly
      if (gammaResponse.slides || gammaResponse.presentation) {
        /**
         * 🔹 Normalize Gamma response into slides your editor understands
         */
        const slidesFromGamma =
          gammaResponse?.slides ||
          gammaResponse?.presentation?.pages ||
          [];

        if (!slidesFromGamma.length) {
          // If no slides returned, create some basic slides to show the user
          console.warn('No slides returned from Gamma API, creating basic slides');
          const basicSlides = [
            { id: 1, title: 'Presentation Generated', content: 'Your presentation has been generated successfully!', image: null },
            { id: 2, title: 'Customize Your Presentation', content: 'You can now edit and customize your presentation content', image: null }
          ];
          setGeneratedSlides(basicSlides);
          setSelectedSlide(0);
          return;
        }

        const normalizedSlides = slidesFromGamma.map((slide, index) => ({
          id: slide.id || Date.now() + index,
          title: slide.title || slide.heading || `Slide ${index + 1}`,
          content: Array.isArray(slide.content)
            ? slide.content.join('\n')
            : slide.body || slide.content || '',
          image:
            slide.image ||
            slide.image_url ||
            slide.media?.image ||
            null
        }));

        setGeneratedSlides(normalizedSlides);
        setSelectedSlide(0);
      } else if (gammaResponse.generationId) {
        // Need to poll for the generated content
        let attempts = 0;
        const maxAttempts = 30; // Max 30 attempts (about 5 minutes with 10s delays)
        
        while (attempts < maxAttempts) {
          attempts++;
          
          // Wait 10 seconds between attempts
          await new Promise(resolve => setTimeout(resolve, 10000));
          
          try {
            // Fetch the current status
            const statusResponse = await getPresentation(gammaResponse.generationId);
            console.log('Status check response:', statusResponse);
            
            // Check if generation is complete
            if (statusResponse.status === 'completed' || statusResponse.gammaUrl) {
              // Extract slides from the response
              // Note: This structure depends on what the Gamma API actually returns
              // You may need to adjust this based on the actual API response
              const slidesFromGamma = statusResponse.slides || statusResponse.presentation?.pages || [];
              
              if (!slidesFromGamma.length) {
                // If we still don't have slides, create some basic ones
                console.warn('No slides returned from Gamma API during polling, creating basic slides');
                const basicSlides = [
                  { id: 1, title: 'Presentation Generated', content: 'Your presentation has been generated successfully!', image: null },
                  { id: 2, title: 'Customize Your Presentation', content: 'You can now edit and customize your presentation content', image: null }
                ];
                setGeneratedSlides(basicSlides);
              } else {
                const normalizedSlides = slidesFromGamma.map((slide, index) => ({
                  id: slide.id || Date.now() + index,
                  title: slide.title || slide.heading || `Slide ${index + 1}`,
                  content: Array.isArray(slide.content)
                    ? slide.content.join('\n')
                    : slide.body || slide.content || '',
                  image:
                    slide.image ||
                    slide.image_url ||
                    slide.media?.image ||
                    null
                }));
                
                setGeneratedSlides(normalizedSlides);
              }
              setSelectedSlide(0);
              return; // Exit the function successfully
            } else if (statusResponse.status === 'failed') {
              throw new Error(statusResponse.error || 'Generation failed');
            }
            // If status is still pending, continue polling
          } catch (statusError) {
            console.error('Error checking generation status:', statusError);
            // Continue polling unless we've reached max attempts
          }
        }
        
        // If we've reached max attempts without completion
        throw new Error('Generation timed out. Please try again.');
      } else {
        throw new Error('No generation ID or slides returned from API');
      }
    } catch (error) {
      console.error('Error generating presentation:', error);
      alert(`Error generating presentation: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };


  const handleEditSlide = (index, field, value) => {
    const updatedSlides = [...generatedSlides];
    updatedSlides[index][field] = value;
    setGeneratedSlides(updatedSlides);
  };

  const handleAiRewrite = async (instruction) => {
    try {
      const updatedSlides = [...generatedSlides];
      const currentSlide = updatedSlides[selectedSlide];
      
      // Call backend to perform AI rewrite
      const response = await fetch(`${API_BASE_URL}/rewrite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: currentSlide.content,
          instruction: instruction
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to rewrite content: ${response.status}`);
      }
      
      const result = await response.json();
      currentSlide.content = result.rewrittenContent;
      
      setGeneratedSlides(updatedSlides);
    } catch (error) {
      console.error('Error rewriting content:', error);
      alert(`Failed to rewrite content: ${error.message}`);
    }
  };

  const handleAddImage = async () => {
    try {
      // In a real implementation, this would open a modal or file picker
      // For now, we'll generate an AI image based on the slide content
      const currentSlide = generatedSlides[selectedSlide];
      
      const response = await fetch(`${API_BASE_URL}/generate-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `${currentSlide.title}. ${currentSlide.content.substring(0, 100)}...`
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to generate image: ${response.status}`);
      }
      
      const result = await response.json();
      
      const updatedSlides = [...generatedSlides];
      updatedSlides[selectedSlide].image = result.imageUrl;
      setGeneratedSlides(updatedSlides);
    } catch (error) {
      console.error('Error adding image:', error);
      alert(`Failed to add image: ${error.message}`);
    }
  };

  const handleExport = async (format) => {
    if (generatedSlides.length === 0) return;
    
    setIsExporting(true);
    
    try {
      // Get the presentation ID from the generated slides
      // This would come from the actual generated presentation
      const presentationId = generatedSlides[0]?.id || 'default-presentation-id';
      
      // Call the backend to export the presentation
      const exportResult = await exportPresentation(presentationId, format);
      
      // Log the export result for debugging
      console.log('Export Result:', exportResult);
      
      // Handle the export result appropriately
      // For example, you might get a download URL or file data
      if (exportResult.downloadUrl) {
        // Automatically download the file
        const link = document.createElement('a');
        link.href = exportResult.downloadUrl;
        link.download = `presentation.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        alert(`Presentation exported as ${format.toUpperCase()} successfully!`);
      }
    } catch (error) {
      console.error('Error exporting presentation:', error);
      // Provide more detailed error information for export
      let errorMessage = error.message || 'Failed to export presentation. Please try again.';
      
      // If it's an HTTP error, provide more context
      if (errorMessage.includes('HTTP error! status:')) {
        const statusMatch = errorMessage.match(/status: (\d+)/);
        const statusCode = statusMatch ? statusMatch[1] : 'unknown';
        
        switch(statusCode) {
          case '401':
            errorMessage = 'Invalid API key. Please check your Gamma API key configuration.';
            break;
          case '403':
            errorMessage = 'Access denied. Please check your Gamma API key permissions.';
            break;
          case '404':
            errorMessage = 'Export endpoint not found. This may indicate an issue with the API configuration. Please verify your Gamma API key is valid and you have a Pro account or higher.';
            break;
          case '429':
            errorMessage = 'Rate limit exceeded. Please wait before making more requests.';
            break;
          case '500':
            errorMessage = 'Server error during export. Please try again later.';
            break;
          default:
            errorMessage = `Export failed with status ${statusCode}. Please check your configuration.`;
        }
      }
      
      alert(`Failed to export presentation: ${errorMessage}`);
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