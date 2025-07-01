import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiMenu, HiX, HiTerminal } from 'react-icons/hi';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', path: '/', command: './home.sh' },
    { name: 'About', path: '/about', command: './about.sh' },
    { name: 'Projects', path: '/projects', command: './projects.sh' },
    { name: 'Skills', path: '/skills', command: './skills.sh' },
    { name: 'Experience', path: '/experience', command: './experience.sh' },
    { name: 'Contact', path: '/contact', command: './contact.sh' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-cyber-bg/95 backdrop-blur-sm border-b border-cyber-border' 
          : 'bg-transparent'
      }`}
    >
      <div className="container-custom">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center gap-2 text-2xl font-mono font-bold">
            <HiTerminal className="text-neon-blue" />
            <span className="neon-text">alex@cyber:~$</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`font-mono px-4 py-2 rounded transition-all duration-200 group ${
                  location.pathname === item.path
                    ? 'bg-cyber-card border border-neon-blue text-neon-blue'
                    : 'text-cyber-text hover:text-neon-blue hover:bg-cyber-card/50'
                }`}
              >
                <span className="text-xs opacity-60 group-hover:opacity-100">
                  {item.command}
                </span>
                <br />
                <span className="text-sm">{item.name}</span>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-cyber-text hover:text-neon-blue transition-colors duration-200"
          >
            {isOpen ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden terminal-window mb-4"
          >
            <div className="terminal-header">
              <div className="terminal-dot bg-red-500"></div>
              <div className="terminal-dot bg-yellow-500"></div>
              <div className="terminal-dot bg-green-500"></div>
              <span className="text-xs font-mono ml-2">Navigation Menu</span>
            </div>
            <div className="terminal-content space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`block py-2 px-4 font-mono transition-colors duration-200 rounded ${
                    location.pathname === item.path
                      ? 'text-neon-blue bg-cyber-border'
                      : 'text-cyber-text hover:text-neon-blue hover:bg-cyber-border/50'
                  }`}
                >
                  <span className="text-xs opacity-60">$ {item.command}</span>
                  <br />
                  <span className="text-sm">{item.name}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
