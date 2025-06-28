import React from 'react';
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope, FaTerminal } from 'react-icons/fa';

const Footer = () => {
  const socialLinks = [
    { icon: FaGithub, href: 'https://github.com/alexchen', label: 'GitHub' },
    { icon: FaLinkedin, href: 'https://linkedin.com/in/alexchen', label: 'LinkedIn' },
    { icon: FaTwitter, href: 'https://twitter.com/alexchen', label: 'Twitter' },
    { icon: FaEnvelope, href: 'mailto:alex@cybersec.dev', label: 'Email' },
  ];

  return (
    <footer className="relative z-10 bg-cyber-card border-t border-cyber-border">
      <div className="container-custom py-12">
        <div className="terminal-window">
          <div className="terminal-header">
            <div className="terminal-dot bg-red-500"></div>
            <div className="terminal-dot bg-yellow-500"></div>
            <div className="terminal-dot bg-green-500"></div>
            <span className="text-xs font-mono ml-2">footer.sh</span>
          </div>
          <div className="terminal-content">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-6 md:mb-0">
                <div className="flex items-center gap-2 mb-2">
                  <FaTerminal className="text-neon-blue" />
                  <span className="font-mono text-lg neon-text">alex@cybersec:~$</span>
                </div>
                <p className="font-mono text-sm text-cyber-text opacity-80">
                  Cybersecurity Engineer | Ethical Hacker | Full-Stack Developer
                </p>
                <p className="font-mono text-xs text-neon-green mt-1">
                  > System status: Online and secure
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
                      className="w-10 h-10 bg-cyber-border hover:bg-neon-blue text-cyber-text hover:text-cyber-bg rounded border border-cyber-border hover:border-neon-blue flex items-center justify-center transition-all duration-300 hover:shadow-lg"
                      style={{
                        boxShadow: '0 0 10px rgba(0, 212, 255, 0.2)',
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.boxShadow = '0 0 20px rgba(0, 212, 255, 0.6)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.boxShadow = '0 0 10px rgba(0, 212, 255, 0.2)';
                      }}
                      aria-label={link.label}
                    >
                      <Icon size={16} />
                    </a>
                  );
                })}
              </div>
            </div>
            
            <div className="border-t border-cyber-border mt-8 pt-6">
              <div className="flex flex-col md:flex-row justify-between items-center text-xs font-mono">
                <p className="text-cyber-text opacity-60 mb-2 md:mb-0">
                  <span className="text-neon-blue">$</span> echo "© {new Date().getFullYear()} Alex Chen. All rights reserved."
                </p>
                <p className="text-cyber-text opacity-60">
                  <span className="text-neon-green">></span> Built with React & Tailwind CSS
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
