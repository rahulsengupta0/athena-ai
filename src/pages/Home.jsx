import React from 'react';
import Dashboard from '../components/homepage/Dashboard';
import Creation from '../components/homepage/Creation';
// Import other pages as needed

export const Home = ({ activePage }) => {
  return (
    <>
      { (activePage === 'dashboard' || !activePage) && <Dashboard /> }
      { (activePage === 'dashboard' || !activePage) && <Creation /> }
      {/* Add other pages with conditions here */}
    </>
  );
};

