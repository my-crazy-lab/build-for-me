/**
 * Header Component for ShipFast Landing Page
 * 
 * Professional navigation header with responsive design and smooth
 * scrolling to sections. Optimized for customer engagement.
 * 
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: ShipFast Development Team
 */

import React, { useState, useEffect } from 'react';
import './Header.css';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={`header ${isScrolled ? 'header-scrolled' : ''}`}>
      <div className="container">
        <div className="header-content">
          {/* Logo */}
          <div className="logo">
            <h1 className="logo-text">ShipFast</h1>
            <span className="logo-tagline">Software Solutions</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="nav-desktop">
            <ul className="nav-list">
              <li><button onClick={() => scrollToSection('about')} className="nav-link">About</button></li>
              <li><button onClick={() => scrollToSection('features')} className="nav-link">Features</button></li>
              <li><button onClick={() => scrollToSection('how-it-works')} className="nav-link">How It Works</button></li>
              <li><button onClick={() => scrollToSection('pricing')} className="nav-link">Pricing</button></li>
              <li><button onClick={() => scrollToSection('contact')} className="nav-link">Contact</button></li>
            </ul>
          </nav>

          {/* CTA Button */}
          <div className="header-cta">
            <button 
              onClick={() => scrollToSection('contact')} 
              className="btn btn-primary"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="mobile-menu-toggle"
            onClick={toggleMenu}
            aria-label="Toggle mobile menu"
          >
            <span className={`hamburger ${isMenuOpen ? 'hamburger-open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav className={`nav-mobile ${isMenuOpen ? 'nav-mobile-open' : ''}`}>
          <ul className="nav-mobile-list">
            <li><button onClick={() => scrollToSection('about')} className="nav-mobile-link">About</button></li>
            <li><button onClick={() => scrollToSection('features')} className="nav-mobile-link">Features</button></li>
            <li><button onClick={() => scrollToSection('how-it-works')} className="nav-mobile-link">How It Works</button></li>
            <li><button onClick={() => scrollToSection('pricing')} className="nav-mobile-link">Pricing</button></li>
            <li><button onClick={() => scrollToSection('contact')} className="nav-mobile-link">Contact</button></li>
          </ul>
          <div className="nav-mobile-cta">
            <button 
              onClick={() => scrollToSection('contact')} 
              className="btn btn-primary btn-large"
            >
              Get Started
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
