import React from 'react';
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope, FaAtom } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Footer = () => {
  const socialLinks = [
    { icon: FaGithub, href: 'https://github.com/zarakim', label: 'GitHub' },
    { icon: FaLinkedin, href: 'https://linkedin.com/in/zarakim', label: 'LinkedIn' },
    { icon: FaTwitter, href: 'https://twitter.com/zarakim', label: 'Twitter' },
    { icon: FaEnvelope, href: 'mailto:zara@interactive.dev', label: 'Email' },
  ];

  return (
    <footer className="relative z-10 bg-dark-card/50 backdrop-blur-lg border-t border-dark-border">
      <div className="container-custom py-16">
        <div className="interactive-card">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-8 md:mb-0 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                <FaAtom className="text-interactive-neon text-3xl animate-spin-slow" />
                <h3 className="text-3xl font-futuristic font-bold holographic-text">ZARA.EXE</h3>
              </div>
              <p className="text-interactive-accent text-lg font-modern">Interactive Frontend Developer</p>
              <p className="text-dark-text text-sm mt-2 font-modern">
                Crafting the future of web experiences with 3D and interactive technologies
              </p>
            </div>
            
            <div className="flex space-x-4">
              {socialLinks.map((link, index) => {
                const Icon = link.icon;
                return (
                  <motion.a
                    key={index}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ 
                      scale: 1.1, 
                      rotate: 360,
                      boxShadow: '0 0 20px rgba(99, 102, 241, 0.6)'
                    }}
                    className="w-12 h-12 bg-dark-border hover:bg-interactive-primary text-dark-text hover:text-white rounded-lg flex items-center justify-center transition-all duration-300 border border-dark-border hover:border-interactive-neon"
                    aria-label={link.label}
                  >
                    <Icon size={20} />
                  </motion.a>
                );
              })}
            </div>
          </div>
          
          <div className="border-t border-dark-border mt-8 pt-8 text-center">
            <div className="flex flex-col md:flex-row justify-between items-center text-dark-text font-modern">
              <p>&copy; {new Date().getFullYear()} Zara Kim. All rights reserved.</p>
              <p className="mt-2 md:mt-0 text-interactive-accent">
                Built with React, Three.js & Future Technologies
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
