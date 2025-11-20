import React, { useEffect } from "react";
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import WhyChoose from '../components/landing/WhyChoose';
import Showcase from '../components/landing/Showcase';
import CreateSection from '../components/landing/CreateSection';
import ProjectsSection from '../components/landing/ProjectsSection';
import FavoritesSection from '../components/landing/FavoritesSection';
import TeamSection from '../components/landing/TeamSection';
import AnalyticsSection from '../components/landing/AnalyticsSection';
import Testimonials from '../components/landing/Testimonials';
import FAQ from '../components/landing/FAQ';
import CTA from '../components/landing/CTA';
import Footer from '../components/landing/Footer';
import Navbar from '../components/landing/Navbar';
import { initScrollReveal } from '../components/landing/ScrollReveal';
import '../components/landing/landing.css';

const LandingPage = () => {
  useEffect(() => {
    initScrollReveal(document);
    const root = document.querySelector('.landing-page');
    const savedTheme = localStorage.getItem('landingTheme');
    if (root && savedTheme === 'dark') root.classList.add('dark');
  }, []);

  return (
    <div className="landing-page">
      <Navbar />
      <Hero />
      <Features />
      <CreateSection />
      <ProjectsSection />
      <FavoritesSection />
      <TeamSection />
      <AnalyticsSection />
      <WhyChoose />
      <Showcase />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
};

export default LandingPage;
