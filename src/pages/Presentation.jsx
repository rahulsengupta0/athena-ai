import React, { useState } from 'react';
import { LayoutPicker, PresentationWorkspace } from '../components/presentation';

const Presentation = () => {
  const [selectedLayout, setSelectedLayout] = useState(null);

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)' }}>
      {selectedLayout ? (
        <PresentationWorkspace layout={selectedLayout} onBack={() => setSelectedLayout(null)} />
      ) : (
        <LayoutPicker onSelect={(layout) => setSelectedLayout(layout)} />
      )}
    </div>
  );
};

export default Presentation;










