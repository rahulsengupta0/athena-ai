import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Cropper from 'react-easy-crop';
import { Slider, Button, Upload, message, Row, Col, Card, Space, Collapse } from 'antd';
import { 
  UploadOutlined, 
  RotateLeftOutlined, 
  RotateRightOutlined, 
  SwapOutlined,
  VerticalAlignTopOutlined,
  SaveOutlined,
  UndoOutlined,
  CaretRightOutlined
} from '@ant-design/icons';

const { Panel } = Collapse;

const ImageEditor = () => {
  const location = useLocation();
  const passedImageUrl = location.state?.imageUrl || null;

  // State management
  const [image, setImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [flipHorizontal, setFlipHorizontal] = useState(1);
  const [flipVertical, setFlipVertical] = useState(1);
  
  // Filter states
  const [filters, setFilters] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    hue: 0,
    exposure: 0,
    highlight: 0,
    shadow: 0,
    temperature: 0,
    tint: 0,
    vibrance: 0,
    clarity: 0,
    grain: 0,
    sharpness: 0
  });

  const fileInputRef = useRef();
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  // If an image URL is passed from Recents, auto-load it into the editor
  useEffect(() => {
    if (passedImageUrl && !image) {
      setImage(passedImageUrl);
      resetAll();
    }
  }, [passedImageUrl, image]);

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.match('image.*')) {
        message.error('Please upload an image file');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
        // Reset all adjustments when new image is uploaded
        resetAll();
      };
      reader.readAsDataURL(file);
    }
  };

  // Crop functions
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Transform functions
  const rotateLeft = () => setRotation(prev => (prev - 90) % 360);
  const rotateRight = () => setRotation(prev => (prev + 90) % 360);
  const flipHorizontalToggle = () => setFlipHorizontal(prev => prev === 1 ? -1 : 1);
  const flipVerticalToggle = () => setFlipVertical(prev => prev === 1 ? -1 : 1);

  // Update filter values
  const updateFilter = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  // Reset all adjustments
  const resetAll = () => {
    setFilters({
      brightness: 100,
      contrast: 100,
      saturation: 100,
      hue: 0,
      exposure: 0,
      highlight: 0,
      shadow: 0,
      temperature: 0,
      tint: 0,
      vibrance: 0,
      clarity: 0,
      grain: 0,
      sharpness: 0
    });
    setRotation(0);
    setFlipHorizontal(1);
    setFlipVertical(1);
    setZoom(1);
    setCrop({ x: 0, y: 0 });
  };

  // Generate CSS filter string for preview
  const getFilterStyle = () => {
    // Calculate combined brightness (exposure affects brightness)
    const combinedBrightness = filters.brightness + filters.exposure;
    
    // Calculate combined saturation (vibrance affects saturation)
    const combinedSaturation = filters.saturation + filters.vibrance;
    
    // Temperature adjustment (simulated with hue and saturation)
    const temperatureAdjustment = filters.temperature * 0.3;
    
    return {
      filter: `
        brightness(${Math.max(0, combinedBrightness)}%)
        contrast(${filters.contrast}%)
        saturate(${Math.max(0, combinedSaturation)}%)
        hue-rotate(${filters.hue + temperatureAdjustment}deg)
        sepia(${Math.abs(filters.temperature) * 0.1}%)
      `,
      transform: `scaleX(${flipHorizontal}) scaleY(${flipVertical})`
    };
  };

  // Apply all filters and transformations to image for download
  const applyFiltersToImage = async () => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        if (croppedAreaPixels) {
          canvas.width = croppedAreaPixels.width;
          canvas.height = croppedAreaPixels.height;
        } else {
          canvas.width = img.width;
          canvas.height = img.height;
        }

        // Apply transformations
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.scale(flipHorizontal, flipVertical);
        ctx.rotate(rotation * Math.PI / 180);
        ctx.translate(-canvas.width / 2, -canvas.height / 2);

        // Calculate combined filters
        const combinedBrightness = filters.brightness + filters.exposure;
        const combinedSaturation = filters.saturation + filters.vibrance;
        const temperatureAdjustment = filters.temperature * 0.3;

        // Apply CSS filters
        ctx.filter = `
          brightness(${Math.max(0, combinedBrightness)}%)
          contrast(${filters.contrast}%)
          saturate(${Math.max(0, combinedSaturation)}%)
          hue-rotate(${filters.hue + temperatureAdjustment}deg)
          sepia(${Math.abs(filters.temperature) * 0.1}%)
        `;

        // Draw image with or without crop
        if (croppedAreaPixels) {
          ctx.drawImage(
            img,
            croppedAreaPixels.x,
            croppedAreaPixels.y,
            croppedAreaPixels.width,
            croppedAreaPixels.height,
            0,
            0,
            canvas.width,
            canvas.height
          );
        } else {
          ctx.drawImage(img, 0, 0);
        }

        resolve(canvas.toDataURL('image/png'));
      };
      
      img.src = image;
    });
  };

  // Download image with all filters applied
  const downloadImage = async () => {
    if (!image) {
      message.error('Please upload an image first');
      return;
    }

    try {
      message.loading({ content: 'Processing image...', key: 'download', duration: 0 });
      const dataURL = await applyFiltersToImage();
      const link = document.createElement('a');
      link.download = `edited-image-${Date.now()}.png`;
      link.href = dataURL;
      link.click();
      message.success({ content: 'Image downloaded successfully!', key: 'download' });
    } catch (error) {
      message.error({ content: 'Error processing image', key: 'download' });
      console.error(error);
    }
  };

  // Custom cropper media component to show filters and transformations
  const MediaComponent = ({ image, style }) => {
    const filterStyle = getFilterStyle();
    return (
      <img
        src={image}
        alt="Crop me"
        style={{
          ...style,
          ...filterStyle,
          transform: `${style.transform} ${filterStyle.transform}`,
          transition: 'filter 0.3s ease'
        }}
      />
    );
  };

  // Render adjustment slider component
  const AdjustmentSlider = ({ 
    label, 
    value, 
    onChange, 
    min = 0, 
    max = 200, 
    step = 1,
    unit = '',
    defaultValue = 100
  }) => (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontWeight: 500, fontSize: 14 }}>{label}</span>
        <span style={{ fontSize: 14, color: '#666' }}>{value}{unit}</span>
      </div>
      <Slider
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        tooltip={{ formatter: (val) => `${val}${unit}` }}
      />
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        fontSize: 12, 
        color: '#999',
        marginTop: 4
      }}>
        <span>{min}{unit}</span>
        <span>Default: {defaultValue}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );

  return (
    <div style={{ padding: 20, minHeight: '100vh', background: '#f5f5f5' }}>
      <Card 
        style={{ 
          maxWidth: 1400, 
          margin: '0 auto', 
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          borderRadius: 12
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: 24, textAlign: 'center' }}>
          <h1 style={{ margin: 0, color: '#1890ff', fontSize: 32, fontWeight: 600 }}>
            Advanced Image Editor
          </h1>
          <p style={{ color: '#666', marginTop: 8 }}>
            Upload and edit your images with professional tools - See changes in real-time!
          </p>
        </div>

        {/* Upload Section */}
        {!image && (
          <div style={{ 
            textAlign: 'center', 
            padding: 60, 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: 12,
            color: 'white'
          }}>
            <UploadOutlined style={{ fontSize: 64, marginBottom: 20, opacity: 0.9 }} />
            <h2 style={{ color: 'white', marginBottom: 16 }}>Ready to Edit Your Images?</h2>
            <p style={{ color: 'rgba(255,255,255,0.9)', marginBottom: 24, fontSize: 16 }}>
              Upload an image to access powerful editing tools with real-time preview
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              ref={fileInputRef}
              style={{ display: 'none' }}
            />
            <Button
              type="primary"
              size="large"
              icon={<UploadOutlined />}
              onClick={() => fileInputRef.current.click()}
              style={{ 
                background: 'rgba(255,255,255,0.2)',
                border: '2px solid rgba(255,255,255,0.3)',
                height: 50,
                padding: '0 32px',
                fontSize: 16,
                fontWeight: 600
              }}
            >
              Choose Image to Upload
            </Button>
          </div>
        )}

        {image && (
          <Row gutter={[24, 24]}>
            {/* Tools Panel */}
            <Col xs={24} lg={8}>
              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                
                {/* Transform Tools */}
                <Card 
                  title="🔄 Transform" 
                  size="small"
                  style={{ borderRadius: 8 }}
                >
                  <Space direction="vertical" style={{ width: '100%' }} size="small">
                    <Row gutter={8}>
                      <Col span={12}>
                        <Button 
                          icon={<RotateLeftOutlined />} 
                          onClick={rotateLeft}
                          block
                          size="large"
                        >
                          Rotate Left
                        </Button>
                      </Col>
                      <Col span={12}>
                        <Button 
                          icon={<RotateRightOutlined />} 
                          onClick={rotateRight}
                          block
                          size="large"
                        >
                          Rotate Right
                        </Button>
                      </Col>
                    </Row>
                    <Row gutter={8}>
                      <Col span={12}>
                        <Button 
                          icon={<SwapOutlined />} 
                          onClick={flipHorizontalToggle}
                          block
                          size="large"
                          type={flipHorizontal === -1 ? "primary" : "default"}
                        >
                          Flip H
                        </Button>
                      </Col>
                      <Col span={12}>
                        <Button 
                          icon={<VerticalAlignTopOutlined />} 
                          onClick={flipVerticalToggle}
                          block
                          size="large"
                          type={flipVertical === -1 ? "primary" : "default"}
                        >
                          Flip V
                        </Button>
                      </Col>
                    </Row>
                    <AdjustmentSlider 
                      label="Rotation Angle" 
                      value={rotation} 
                      onChange={setRotation}
                      min={-180}
                      max={180}
                      unit="°"
                      defaultValue={0}
                    />
                    <AdjustmentSlider 
                      label="Zoom Level" 
                      value={zoom} 
                      onChange={setZoom}
                      min={1}
                      max={3}
                      step={0.1}
                      defaultValue={1}
                    />
                  </Space>
                </Card>

                {/* Editing Tools Collapse */}
                <Collapse 
                  defaultActiveKey={['1', '2', '3', '4']}
                  expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                  style={{ background: 'transparent' }}
                >
                  {/* Light Adjustments */}
                  <Panel header="💡 Light Adjustments" key="1" style={{ fontSize: 16, fontWeight: 600 }}>
                    <AdjustmentSlider 
                      label="Brightness" 
                      value={filters.brightness} 
                      onChange={(val) => updateFilter('brightness', val)}
                      min={0}
                      max={200}
                      unit="%"
                    />
                    <AdjustmentSlider 
                      label="Contrast" 
                      value={filters.contrast} 
                      onChange={(val) => updateFilter('contrast', val)}
                      min={0}
                      max={200}
                      unit="%"
                    />
                    <AdjustmentSlider 
                      label="Exposure" 
                      value={filters.exposure} 
                      onChange={(val) => updateFilter('exposure', val)}
                      min={-100}
                      max={100}
                      unit="%"
                      defaultValue={0}
                    />
                    <AdjustmentSlider 
                      label="Highlights" 
                      value={filters.highlight} 
                      onChange={(val) => updateFilter('highlight', val)}
                      min={-100}
                      max={100}
                      unit="%"
                      defaultValue={0}
                    />
                    <AdjustmentSlider 
                      label="Shadows" 
                      value={filters.shadow} 
                      onChange={(val) => updateFilter('shadow', val)}
                      min={-100}
                      max={100}
                      unit="%"
                      defaultValue={0}
                    />
                  </Panel>

                  {/* Color Adjustments */}
                  <Panel header="🎨 Color Adjustments" key="2" style={{ fontSize: 16, fontWeight: 600 }}>
                    <AdjustmentSlider 
                      label="Saturation" 
                      value={filters.saturation} 
                      onChange={(val) => updateFilter('saturation', val)}
                      min={0}
                      max={200}
                      unit="%"
                    />
                    <AdjustmentSlider 
                      label="Hue" 
                      value={filters.hue} 
                      onChange={(val) => updateFilter('hue', val)}
                      min={-180}
                      max={180}
                      unit="°"
                      defaultValue={0}
                    />
                    <AdjustmentSlider 
                      label="Temperature" 
                      value={filters.temperature} 
                      onChange={(val) => updateFilter('temperature', val)}
                      min={-100}
                      max={100}
                      unit="%"
                      defaultValue={0}
                    />
                    <AdjustmentSlider 
                      label="Tint" 
                      value={filters.tint} 
                      onChange={(val) => updateFilter('tint', val)}
                      min={-100}
                      max={100}
                      unit="%"
                      defaultValue={0}
                    />
                    <AdjustmentSlider 
                      label="Vibrance" 
                      value={filters.vibrance} 
                      onChange={(val) => updateFilter('vibrance', val)}
                      min={-100}
                      max={100}
                      unit="%"
                      defaultValue={0}
                    />
                  </Panel>

                  {/* Effects */}
                  <Panel header="✨ Effects" key="3" style={{ fontSize: 16, fontWeight: 600 }}>
                    <AdjustmentSlider 
                      label="Clarity" 
                      value={filters.clarity} 
                      onChange={(val) => updateFilter('clarity', val)}
                      min={0}
                      max={100}
                      unit="%"
                    />
                    <AdjustmentSlider 
                      label="Grain" 
                      value={filters.grain} 
                      onChange={(val) => updateFilter('grain', val)}
                      min={0}
                      max={100}
                      unit="%"
                    />
                  </Panel>

                  {/* Details */}
                  <Panel header="🔍 Details" key="4" style={{ fontSize: 16, fontWeight: 600 }}>
                    <AdjustmentSlider 
                      label="Sharpness" 
                      value={filters.sharpness} 
                      onChange={(val) => updateFilter('sharpness', val)}
                      min={0}
                      max={100}
                      unit="%"
                    />
                  </Panel>
                </Collapse>

                {/* Action Buttons */}
                <Card size="small" style={{ borderRadius: 8 }}>
                  <Space direction="vertical" style={{ width: '100%' }} size="middle">
                    <Button 
                      icon={<UndoOutlined />} 
                      onClick={resetAll}
                      block
                      size="large"
                      style={{ height: 45 }}
                    >
                      Reset All Adjustments
                    </Button>
                    <Button 
                      type="primary" 
                      icon={<SaveOutlined />} 
                      onClick={downloadImage}
                      block
                      size="large"
                      style={{ height: 50, fontSize: 16, fontWeight: 600 }}
                    >
                      Download Edited Image
                    </Button>
                  </Space>
                </Card>
              </Space>
            </Col>

            {/* Preview Area */}
            <Col xs={24} lg={16}>
              <Card 
                title={`Live Preview - Rotation: ${rotation}° | Flip: ${flipHorizontal === -1 ? 'H' : ''}${flipVertical === -1 ? 'V' : 'None'}`} 
                style={{ height: '100%', borderRadius: 8 }}
                bodyStyle={{ padding: 0 }}
              >
                <div style={{ 
                  position: 'relative', 
                  height: '70vh', 
                  background: '#1a1a1a',
                  borderRadius: '0 0 8px 8px',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div style={{ 
                    position: 'relative', 
                    width: '100%', 
                    height: '100%',
                    maxWidth: '100%',
                    maxHeight: '100%'
                  }}>
                    <Cropper
                      image={image}
                      crop={crop}
                      zoom={zoom}
                      rotation={rotation} // Let cropper handle rotation
                      aspect={4 / 3}
                      onCropChange={setCrop}
                      onCropComplete={onCropComplete}
                      onZoomChange={setZoom}
                      style={{
                        containerStyle: {
                          position: 'relative',
                          width: '100%',
                          height: '100%',
                          background: '#1a1a1a'
                        },
                        cropAreaStyle: {
                          border: '2px solid #1890ff',
                          background: 'rgba(24, 144, 255, 0.1)'
                        },
                        mediaStyle: getFilterStyle() // Apply filters to the media
                      }}
                    />
                  </div>
                </div>
                <div style={{ 
                  padding: 16, 
                  background: '#fafafa',
                  borderTop: '1px solid #f0f0f0'
                }}>
                  <p style={{ 
                    color: '#666', 
                    textAlign: 'center', 
                    margin: 0,
                    fontSize: 14
                  }}>
                    ⚡ Real-time preview • Drag to move • Use handles to crop • Rotation: {rotation}°
                  </p>
                </div>
              </Card>
            </Col>
          </Row>
        )}
      </Card>
    </div>
  );
};

export default ImageEditor;