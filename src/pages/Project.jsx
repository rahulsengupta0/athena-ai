import React from 'react'
import ProjectHero from '../components/projectpage/ProjectHero'
import ProjectCards from '../components/projectpage/ProjectCards'
import { useParams } from 'react-router-dom';

export const Project = () => {
  const { folder } = useParams();
  const folderType = folder || "recent"; // default to "recent"
  
  return (
    <>
      <ProjectHero />
      <ProjectCards folderType={folderType} />
    </>
  );
};
