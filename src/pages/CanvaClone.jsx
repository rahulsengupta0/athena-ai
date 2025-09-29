import React from 'react';
import CanvaEditor from '../components/canva/CanvaEditor';

const CanvaClone = () => {
  return (
    <div style={{ 
      height: '100vh', 
      width: '100%',
      overflow: 'hidden',
      backgroundColor: '#f8f9fa',
      padding: '0',
      margin: '0',
      position: 'relative'
    }}>
      <CanvaEditor />
    </div>
  );
};

export default CanvaClone;