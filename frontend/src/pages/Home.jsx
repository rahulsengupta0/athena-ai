import React from 'react';
import Dashboard from '../components/homepage/Dashboard';
// Import other pages as needed

export const Home = ({ activePage }) => {
  return (
    <>
      { (activePage === 'dashboard' || !activePage) && <Dashboard /> }
      {/* Creation component is now rendered conditionally inside Dashboard when Templates tab is active */}
      {/* Add other pages with conditions here */}
    </>
  );
};

