import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SideBar from './components/SideBar';
import { Home } from './pages/Home';
import { Create } from './pages/Create';

function App() {
  return (
    <Router>
      <div>
        <SideBar />
        <div style={{ marginLeft: 260, padding: '0px', minHeight: "100vh" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<Create />} />
            {/* Add more routes here if needed */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
