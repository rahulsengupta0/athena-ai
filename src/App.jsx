import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import SideBar from './components/SideBar';
import { SidebarProvider, useSidebar } from './contexts/SidebarContext';

import { Home } from './pages/Home';
import { Create } from './pages/Create';
import AISuggestTemp from './components/homepage/AISuggestTemp';
import AIDesign from './components/createpage/CardsPages/AIDesign';
import ImageCreator from './components/createpage/CardsPages/ImageCreator';
import ContentWriter from './components/createpage/CardsPages/ContentWriter';
import CodeGenerator from './components/createpage/CardsPages/CodeGenerator';
import VideoProducer from './components/createpage/CardsPages/VideoProducer';
import BrandBuilder from './components/createpage/CardsPages/BrandBuilder';
import { Project } from './pages/Project';
import AllProjects from './pages/AllProjects';
import Templates from './pages/Templates';
import { Favourites } from './pages/Favorites';
import { AiGenerator } from './pages/AiGenerator';
import { ImageEdit } from './pages/ImageEdit';
import { VideoMaker } from './pages/VideoMaker';
import { Analatics } from './pages/Analatics';
import { Setting } from './pages/Setting';
import Help from './pages/Help';
import { Team } from './pages/Team';
import AcceptInvite from './pages/AcceptInvite';
import ArtisticImageGenerator from './components/imageeditor/ArtisticImageGenerator';
import BackgroundRemover from './components/imageeditor/BackgroundRemover';
import ImageEditor from './components/imageeditor/ImageEditor';
import CanvaClone from './pages/CanvaClone';
import Brandkit from './pages/Brandkit';
import BrandKitDetail from './pages/BrandKitDetail';
import Presentation from './pages/Presentation';

import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import AuthPage from './pages/AuthPage';
import AdminDash from './pages/AdminDash';
import BrandKitResult from './pages/BrandKitResult';
import DocumentGenerator from './components/aigenerator/DocumentGenerator';
import UiPhotoGenerator from './components/aigenerator/UiPhotoGenerator';


const AppContent = () => {
  const { isCollapsed, isMobile } = useSidebar();

  const getContentMargin = () => {
    if (isMobile) return '0';
    return isCollapsed ? '60px' : '260px';
  };

  return (
    <div>
      <SideBar />
      <div
        className="app-content"
        style={{
          marginLeft: getContentMargin(),
          transition: 'margin-left 0.25s ease',
        }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ai-suggest-templates" element={<AISuggestTemp />} />
          <Route path="/create" element={<Create />} />
          <Route path="/create/ai-design" element={<AIDesign />} />
          <Route path="/create/image-creator" element={<ImageCreator />} />
          <Route path="/create/content-writer" element={<ContentWriter />} />
          <Route path="/create/code-generator" element={<CodeGenerator />} />
          <Route path="/create/video-producer" element={<VideoProducer />} />
          <Route path="/create/brand-builder" element={<BrandBuilder />} />
          <Route path="/projects" element={<Project />} />
          <Route path="/projects/all" element={<AllProjects />} />
          <Route path="/projects/templates" element={<Templates />} />
          <Route path="/favorites" element={<Favourites />} />
          <Route path="/ai-generator" element={<AiGenerator />} />
          <Route path="/image-editor" element={<ImageEdit />} />
          <Route path="/video-maker" element={<VideoMaker />} />
          <Route path="/analytics" element={<Analatics />} />
          <Route path="/settings" element={<Setting />} />
          <Route path="/help-support" element={<Help />} />
          <Route path="/team" element={<Team />} />
          <Route path="/team/accept" element={<AcceptInvite />} />
          <Route path="/artisticiamge" element={<ArtisticImageGenerator />} />
          <Route path="/bgremove" element={<BackgroundRemover />} />
          <Route path="/imageeditor" element={<ImageEditor />} />
          <Route path="/canva-clone" element={<CanvaClone />} />
          <Route path="/brand-kit" element={<Brandkit />} />
          <Route path="/brand-kit-result" element={<BrandKitResult/>} />
          <Route path="/brand-kit-detail" element={<BrandKitDetail />} />
          <Route path="/docGenerator" element={<DocumentGenerator/>} />
          <Route path="/uiphoto" element={<UiPhotoGenerator/>} />
          <Route
            path="/admin-dash"
            element={
              <AdminRoute>
                <AdminDash />
              </AdminRoute>
            }
          />
          <Route path="/presentation" element={<Presentation />} />

        </Routes>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <SidebarProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<AuthPage />} />
            <Route path="/signup" element={<AuthPage />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <AppContent />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </SidebarProvider>
    </AuthProvider>
  );
}

export default App;
