import React, { useEffect } from "react";
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import WhyChoose from '../components/landing/WhyChoose';
import Showcase from '../components/landing/Showcase';
import Testimonials from '../components/landing/Testimonials';
import FAQ from '../components/landing/FAQ';
import CTA from '../components/landing/CTA';
import Footer from '../components/landing/Footer';
import Navbar from '../components/landing/Navbar';
import { initScrollReveal } from '../components/landing/scrollReveal';
import '../components/landing/landing.css';

const LandingPage = () => {
  useEffect(() => {
    initScrollReveal(document);
  }, []);

  return (
    <div className="landing-page">
      <Navbar />
      <Hero />
      <Features />
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
