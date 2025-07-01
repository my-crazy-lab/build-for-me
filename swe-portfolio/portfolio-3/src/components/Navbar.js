import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiMenu, HiX, HiSparkles } from 'react-icons/hi';

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
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Projects', path: '/projects' },
    { name: 'Skills', path: '/skills' },
    { name: 'Experience', path: '/experience' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'glass-effect shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="container-custom">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center gap-2 text-2xl font-display font-bold">
            <HiSparkles className="text-creative-purple animate-spin-slow" />
            <span className="gradient-text">Maya</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`font-semibold px-4 py-2 rounded-full transition-all duration-300 ${
                  location.pathname === item.path
                    ? 'bg-creative-purple text-white shadow-lg'
                    : 'text-gray-700 hover:bg-white/20 hover:text-creative-purple'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-creative-purple transition-colors duration-200"
          >
            {isOpen ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden creative-card mt-4"
          >
            <div className="py-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`block py-3 px-4 font-semibold rounded-lg transition-all duration-200 ${
                    location.pathname === item.path
                      ? 'bg-creative-purple text-white'
                      : 'text-gray-700 hover:bg-creative-purple/10 hover:text-creative-purple'
                  }`}
                >
                  {item.name}
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
