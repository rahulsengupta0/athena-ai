import React from 'react'
import ProjectHero from '../components/projectpage/ProjectHero'
import ProjectCards from '../components/projectpage/ProjectCards'
import AllProjects from './AllProjects'

export const Project = () => {
  return (
    <>
      <ProjectHero />
      <section style={{ marginBottom: 40 }}>
        <AllProjects />
      </section>
      <ProjectCards />
    </>
  )
}
