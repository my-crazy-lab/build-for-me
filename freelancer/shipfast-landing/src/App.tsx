/**
 * ShipFast Landing Page - Main App Component
 *
 * Professional software solutions landing page designed for maximum
 * customer engagement and conversion. Features modern design with
 * Earthy Neutrals color palette and optimized contact forms.
 *
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: ShipFast Development Team
 */

import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Testimonials from './components/Testimonials';
import Pricing from './components/Pricing';
import About from './components/About';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Testimonials />
        <Pricing />
        <About />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
