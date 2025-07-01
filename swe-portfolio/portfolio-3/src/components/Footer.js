import React from 'react';
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope, FaHeart } from 'react-icons/fa';

const Footer = () => {
  const socialLinks = [
    { icon: FaGithub, href: 'https://github.com/mayarodriguez', label: 'GitHub' },
    { icon: FaLinkedin, href: 'https://linkedin.com/in/mayarodriguez', label: 'LinkedIn' },
    { icon: FaTwitter, href: 'https://twitter.com/mayarodriguez', label: 'Twitter' },
    { icon: FaEnvelope, href: 'mailto:maya@creative.dev', label: 'Email' },
  ];

  return (
    <footer className="relative z-10 section-padding">
      <div className="container-custom">
        <div className="creative-card">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0 text-center md:text-left">
              <h3 className="text-3xl font-display font-bold gradient-text mb-2">Maya Rodriguez</h3>
              <p className="text-gray-600">Creative Developer & UI/UX Designer</p>
              <p className="text-sm text-gray-500 mt-2">
                Crafting beautiful experiences with love and creativity
              </p>
            </div>
            
            <div className="flex space-x-4">
              {socialLinks.map((link, index) => {
                const Icon = link.icon;
                return (
                  <a
                    key={index}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-gradient-to-r from-creative-purple to-creative-pink text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
                    aria-label={link.label}
                  >
                    <Icon size={20} />
                  </a>
                );
              })}
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 pt-8 text-center">
            <p className="text-gray-600 flex items-center justify-center gap-2">
              © {new Date().getFullYear()} Maya Rodriguez. Made with 
              <FaHeart className="text-creative-pink animate-pulse" /> 
              and lots of creativity
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
