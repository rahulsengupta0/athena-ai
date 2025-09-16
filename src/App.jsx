import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SideBar from './components/SideBar';
import { Home } from './pages/Home';
import { Create } from './pages/Create';
import AIDesign from './components/createpage/CardsPages/AIDesign';
import ImageCreator from './components/createpage/CardsPages/ImageCreator';
import ContentWriter from './components/createpage/CardsPages/ContentWriter';
import CodeGenerator from './components/createpage/CardsPages/CodeGenerator';
import VideoProducer from './components/createpage/CardsPages/VideoProducer';
import BrandBuilder from './components/createpage/CardsPages/BrandBuilder';
import { Project } from './pages/Project';

function App() {
  return (
    <Router>
      <div>
        <SideBar />
        <div style={{ marginLeft: 260, padding: '0px', minHeight: "100vh" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<Create />} />
            <Route path="/ai-design" element={<AIDesign />} />
            <Route path="/image-creator" element={<ImageCreator />} />
            <Route path="/content-writer" element={<ContentWriter />} />
            <Route path="/code-generator" element={<CodeGenerator />} />
            <Route path="/video-producer" element={<VideoProducer />} />
            <Route path="/brand-builder" element={<BrandBuilder />} />
            
            <Route path="/projects" element={<Project/>} />
            {/* Add more routes here if needed */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
