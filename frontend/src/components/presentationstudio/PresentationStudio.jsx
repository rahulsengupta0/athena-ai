import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import PromptSection from './PromptSection';
import OutlineEditor from './OutlineEditor';
import { PresentationWorkspace } from '../presentation';
import './styles/PresentationStudio.css';

const PresentationStudio = () => {
  const navigate = useNavigate();
  
  // Form data (Step 1: Input)
  const [prompt, setPrompt] = useState('');
  const [tone, setTone] = useState('Professional');
  const [length, setLength] = useState('5');
  const [mediaStyle, setMediaStyle] = useState('AI Images');
  const [useBrandStyle, setUseBrandStyle] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [outlineText, setOutlineText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  
  // Step 2: Outline data
  const [outlineData, setOutlineData] = useState(null);
  
  // Step 3: Final presentation data
  const [finalPresentationData, setFinalPresentationData] = useState(null);

  // Generate mock outline data for testing
  const generateMockOutline = () => {
    const slideCount = parseInt(length) || 5;
    return {
      topic: prompt,
      tone: tone,
      length: length,
      mediaStyle: mediaStyle,
      slides: Array.from({ length: slideCount }, (_, index) => ({
        slideId: `slide-${index + 1}`,
        source: 'ai',
        title: `Slide ${index + 1}: ${prompt.substring(0, 30)}${prompt.length > 30 ? '...' : ''}`,
        content: {
          mode: 'raw',
          rawText: `This is the content for slide ${index + 1} about ${prompt}.\n\nKey points:\n• Point 1\n• Point 2\n• Point 3`
        }
      }))
    };
  };

  // Step 1: Generate Outline
  const handleGenerateOutline = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setGenerationStep(0);

    try {
      // Call /api/presentation/outline
      const response = await fetch('/api/presentation/outline', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: prompt,
          tone: tone,
          length: length,
          mediaStyle: mediaStyle,
          useBrandStyle: useBrandStyle,
          outlineText: outlineText
        })
      });

      if (!response.ok) {
        // If API fails, use mock data for testing
        console.warn('API not available, using mock outline data');
        const mockOutline = generateMockOutline();
        setOutlineData(mockOutline);
        setIsGenerating(false);
        return;
      }

      const outline = await response.json();
      setOutlineData(outline);
    } catch (error) {
      console.error('Error generating outline:', error);
      // Use mock data when API is not available
      console.warn('API not available, using mock outline data');
      const mockOutline = generateMockOutline();
      setOutlineData(mockOutline);
    } finally {
      setIsGenerating(false);
    }
  };

  // Step 3: Handle final presentation from OutlineEditor
  const handleFinalize = (finalPresentation) => {
    setFinalPresentationData(finalPresentation);
  };

  // Reset to start over
  const handleReset = () => {
    setOutlineData(null);
    setFinalPresentationData(null);
    setPrompt('');
    setTone('Professional');
    setLength('5');
    setMediaStyle('AI Images');
    setUseBrandStyle(false);
    setOutlineText('');
  };


  // Determine which step to show
  const renderCurrentStep = () => {
    // Step 3: Final Presentation Workspace
    if (finalPresentationData) {
      // Convert final PPT JSON to PresentationWorkspace format
      // Assuming finalPresentationData has slides array with proper structure
      const layout = finalPresentationData.layout || { width: 1920, height: 1080 };
      return (
        <PresentationWorkspace 
          layout={layout}
          initialData={finalPresentationData}
          onBack={handleReset}
        />
      );
    }
    
    // Step 2: Outline Editor
    if (outlineData) {
      return (
        <OutlineEditor 
          outlineData={outlineData}
          onFinalize={handleFinalize}
        />
      );
    }
    
    // Step 1: Presentation Studio (Input)
    return (
      <>
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
          handleGenerate={handleGenerateOutline}
          isGenerating={isGenerating}
          generationStep={generationStep}
        />
        {/* Test button to view OutlineEditor directly with mock data */}
        <div style={{ textAlign: 'center', marginTop: '1rem', padding: '0 2rem' }}>
          <button
            onClick={() => {
              // Set a default prompt if empty
              if (!prompt.trim()) {
                setPrompt('Sample Presentation Topic');
              }
              const mockOutline = generateMockOutline();
              setOutlineData(mockOutline);
            }}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#e2e8f0',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              color: '#475569',
              fontWeight: '500',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#cbd5e1';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#e2e8f0';
            }}
          >
            🧪 Test: View Outline Editor (Mock Data)
          </button>
          <p style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#64748b' }}>
            Click to see OutlineEditor with sample data (works without API)
          </p>
        </div>
      </>
    );
  };

  return (
    <div className="presentation-studio">
      <div className="presentation-studio-container">
        {!finalPresentationData && (
          <Header 
            handleSavePresentation={() => {}}
            handleExport={() => {}}
            handleSharePresentation={() => {}}
            isExporting={false}
          />
        )}
        
        {renderCurrentStep()}
      </div>
    </div>
  );
};

export default PresentationStudio;