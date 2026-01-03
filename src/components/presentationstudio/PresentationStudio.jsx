import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import PromptSection from './PromptSection';
import EditorSection from './EditorSection';
import { generatePresentation, exportPresentation } from './presentationService';
import './styles/PresentationStudio.css';

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
      // Simulate API call to Gamma with progress steps
      const steps = [
        'Structuring story...',
        'Visualizing content...',
        'Designing slides...',
        'Finalizing presentation...'
      ];

      for (let i = 0; i < steps.length; i++) {
        setGenerationStep(i);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Call Gamma API to generate presentation
      const params = {
        prompt,
        tone,
        length,
        mediaStyle,
        useBrandStyle,
        outlineText
      };

      // Uncomment the following line when you have a valid Gamma API key
      // const gammaResponse = await generatePresentation(params);

      // For now, we'll use mock data
      const mockSlides = [
        { id: 1, title: 'Introduction', content: 'Welcome to our presentation on the future of AI technology. Today we will explore how artificial intelligence is transforming industries and reshaping our daily lives.', image: null },
        { id: 2, title: 'Main Topic', content: 'AI Applications:\n• Healthcare diagnostics\n• Autonomous vehicles\n• Financial trading\n• Customer service automation', image: null },
        { id: 3, title: 'Technology Overview', content: 'Machine Learning:\nDeep learning neural networks\nNatural language processing\nComputer vision systems\nReinforcement learning algorithms', image: null },
        { id: 4, title: 'Market Insights', content: 'Global AI Market:\n• Projected to reach $1.8 trillion by 2030\n• 37% annual growth rate\n• Major investments from tech giants\n• Increasing adoption across sectors', image: null },
        { id: 5, title: 'Conclusion', content: 'Key Takeaways:\n• AI is revolutionizing industries\n• Ethical considerations are crucial\n• Investment opportunities are growing\n• Continuous learning is essential', image: null }
      ];

      setGeneratedSlides(mockSlides);
      setIsGenerating(false);
      setSelectedSlide(0);
    } catch (error) {
      console.error('Error generating presentation:', error);
      // Show error to user
      setIsGenerating(false);
      // For demo purposes, we'll still show mock data even if API fails
      const mockSlides = [
        { id: 1, title: 'Introduction', content: 'Welcome to our presentation on the future of AI technology. Today we will explore how artificial intelligence is transforming industries and reshaping our daily lives.', image: null },
        { id: 2, title: 'Main Topic', content: 'AI Applications:\n• Healthcare diagnostics\n• Autonomous vehicles\n• Financial trading\n• Customer service automation', image: null },
        { id: 3, title: 'Technology Overview', content: 'Machine Learning:\nDeep learning neural networks\nNatural language processing\nComputer vision systems\nReinforcement learning algorithms', image: null },
        { id: 4, title: 'Market Insights', content: 'Global AI Market:\n• Projected to reach $1.8 trillion by 2030\n• 37% annual growth rate\n• Major investments from tech giants\n• Increasing adoption across sectors', image: null },
        { id: 5, title: 'Conclusion', content: 'Key Takeaways:\n• AI is revolutionizing industries\n• Ethical considerations are crucial\n• Investment opportunities are growing\n• Continuous learning is essential', image: null }
      ];

      setGeneratedSlides(mockSlides);
      setIsGenerating(false);
      setSelectedSlide(0);
    }
  };

  const handleEditSlide = (index, field, value) => {
    const updatedSlides = [...generatedSlides];
    updatedSlides[index][field] = value;
    setGeneratedSlides(updatedSlides);
  };

  const handleAiRewrite = (instruction) => {
    // Simulate AI rewrite
    const updatedSlides = [...generatedSlides];
    const currentSlide = updatedSlides[selectedSlide];

    // Mock AI transformations
    if (instruction === 'simplify') {
      currentSlide.content = currentSlide.content
        .split('\n')
        .filter(line => line.trim() !== '')
        .map(line => `• ${line}`)
        .join('\n');
    } else if (instruction === 'expand') {
      currentSlide.content = `${currentSlide.content}

Key Insights:
• Additional insight 1
• Additional insight 2
• Additional insight 3`;
    } else if (instruction === 'persuasive') {
      currentSlide.content = ` compelling ${currentSlide.content.toLowerCase()} that drives action and engagement`;
    }

    setGeneratedSlides(updatedSlides);
  };

  const handleAddImage = () => {
    // Simulate adding an image
    const updatedSlides = [...generatedSlides];
    updatedSlides[selectedSlide].image = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80';
    setGeneratedSlides(updatedSlides);
  };

  const handleExport = async (format) => {
    if (generatedSlides.length === 0) return;

    setIsExporting(true);

    try {
      // In a real implementation, you would call the Gamma API to export
      // For now, we'll simulate the export process
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Uncomment the following lines when you have a valid Gamma API key
      // const presentationId = 'mock-presentation-id'; // This would come from the generated presentation
      // const exportResult = await exportPresentation(presentationId, format);

      // Simulate download
      alert(`Presentation exported as ${format.toUpperCase()} successfully!`);
    } catch (error) {
      console.error('Error exporting presentation:', error);
      alert('Failed to export presentation. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleSavePresentation = async () => {
    if (generatedSlides.length === 0) return;

    try {
      // In a real implementation, you would save the presentation to your backend
      // For now, we'll just show a success message
      alert('Presentation saved successfully!');
    } catch (error) {
      console.error('Error saving presentation:', error);
      alert('Failed to save presentation. Please try again.');
    }
  };

  const handleSharePresentation = async () => {
    if (generatedSlides.length === 0) return;

    try {
      // In a real implementation, you would generate a shareable link
      // For now, we'll just copy a mock link to the clipboard
      const mockLink = 'https://athena-ai.presentation/demo';
      navigator.clipboard.writeText(mockLink);
      alert('Presentation link copied to clipboard!');
    } catch (error) {
      console.error('Error sharing presentation:', error);
      alert('Failed to generate share link. Please try again.');
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