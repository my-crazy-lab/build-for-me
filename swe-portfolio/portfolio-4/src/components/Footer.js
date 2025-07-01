import React from 'react';
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope, FaBriefcase } from 'react-icons/fa';

const Footer = () => {
  const socialLinks = [
    { icon: FaGithub, href: 'https://github.com/robertjohnson', label: 'GitHub' },
    { icon: FaLinkedin, href: 'https://linkedin.com/in/robertjohnson', label: 'LinkedIn' },
    { icon: FaTwitter, href: 'https://twitter.com/robertjohnson', label: 'Twitter' },
    { icon: FaEnvelope, href: 'mailto:robert@enterprise.com', label: 'Email' },
  ];

  return (
    <footer className="bg-corporate-navy text-white">
      <div className="container-custom py-16">
        <div className="corporate-card bg-white/10 border-white/20">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-8 md:mb-0 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                <FaBriefcase className="text-corporate-gold text-2xl" />
                <h3 className="text-3xl font-serif font-bold">Robert Johnson</h3>
              </div>
              <p className="text-blue-100 text-lg">Senior Software Architect & Technology Leader</p>
              <p className="text-blue-200 text-sm mt-2">
                Driving digital transformation through innovative technology solutions
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
                    className="w-12 h-12 bg-white/10 hover:bg-corporate-gold text-white hover:text-corporate-navy rounded transition-all duration-300 flex items-center justify-center border border-white/20 hover:border-corporate-gold"
                    aria-label={link.label}
                  >
                    <Icon size={20} />
                  </a>
                );
              })}
            </div>
          </div>
          
          <div className="border-t border-white/20 mt-8 pt-8 text-center">
            <div className="flex flex-col md:flex-row justify-between items-center text-blue-200">
              <p>&copy; {new Date().getFullYear()} Robert Johnson. All rights reserved.</p>
              <p className="mt-2 md:mt-0">Built for enterprise excellence and innovation</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
