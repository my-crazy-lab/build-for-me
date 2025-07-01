import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaDownload, FaArrowRight, FaGithub, FaLinkedin, FaShieldAlt, FaCode, FaBug } from 'react-icons/fa';

const Home = () => {
  const [typedText, setTypedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const roles = [
    'Cybersecurity Engineer',
    'Ethical Hacker',
    'Full-Stack Developer',
    'Penetration Tester',
    'Security Researcher'
  ];

  useEffect(() => {
    const currentRole = roles[currentIndex];
    let charIndex = 0;
    let isDeleting = false;

    const typeInterval = setInterval(() => {
      if (!isDeleting && charIndex < currentRole.length) {
        setTypedText(currentRole.substring(0, charIndex + 1));
        charIndex++;
      } else if (isDeleting && charIndex > 0) {
        setTypedText(currentRole.substring(0, charIndex - 1));
        charIndex--;
      } else if (!isDeleting && charIndex === currentRole.length) {
        setTimeout(() => {
          isDeleting = true;
        }, 2000);
      } else if (isDeleting && charIndex === 0) {
        setCurrentIndex((prev) => (prev + 1) % roles.length);
        isDeleting = false;
      }
    }, isDeleting ? 50 : 100);

    return () => clearInterval(typeInterval);
  }, [currentIndex]);

  return (
    <div className="min-h-screen pt-20 relative">
      {/* Hero Section */}
      <section className="section-padding matrix-bg">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="terminal-window mb-8">
                <div className="terminal-header">
                  <div className="terminal-dot bg-red-500"></div>
                  <div className="terminal-dot bg-yellow-500"></div>
                  <div className="terminal-dot bg-green-500"></div>
                  <span className="text-xs font-mono ml-2">welcome.sh</span>
                </div>
                <div className="terminal-content">
                  <p className="text-neon-green mb-2">$ whoami</p>
                  <p className="mb-4">alex_chen</p>
                  <p className="text-neon-green mb-2">$ cat /etc/role</p>
                  <p className="mb-4 h-6">
                    <span className="neon-text">{typedText}</span>
                    <span className="animate-pulse">|</span>
                  </p>
                  <p className="text-neon-green mb-2">$ echo $MISSION</p>
                  <p className="text-sm leading-relaxed">
                    "Securing the digital world through ethical hacking, 
                    building robust applications, and sharing knowledge 
                    with the cybersecurity community."
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link to="/projects" className="btn-neon">
                  <FaCode />
                  View Projects
                </Link>
                <a 
                  href="/resume.pdf" 
                  download 
                  className="btn-ghost"
                >
                  <FaDownload />
                  Download CV
                </a>
              </div>
              
              <div className="flex space-x-4">
                <a
                  href="https://github.com/alexchen"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyber-text hover:text-neon-blue transition-colors duration-200"
                >
                  <FaGithub size={24} />
                </a>
                <a
                  href="https://linkedin.com/in/alexchen"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyber-text hover:text-neon-blue transition-colors duration-200"
                >
                  <FaLinkedin size={24} />
                </a>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex justify-center"
            >
              <div className="relative">
                <div className="w-80 h-80 rounded-full border-2 border-neon-blue animate-glow flex items-center justify-center">
                  <div className="w-72 h-72 rounded-full bg-cyber-card border border-cyber-border flex items-center justify-center">
                    <img
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face"
                      alt="Alex Chen"
                      className="w-64 h-64 rounded-full object-cover"
                    />
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-neon-blue rounded-full flex items-center justify-center animate-pulse">
                  <FaShieldAlt className="text-cyber-bg text-xl" />
                </div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-neon-green rounded-full flex items-center justify-center animate-pulse delay-1000">
                  <FaBug className="text-cyber-bg text-xl" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-cyber-card/30">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { number: '500+', label: 'Vulnerabilities Found', icon: FaBug },
              { number: '50+', label: 'Security Audits', icon: FaShieldAlt },
              { number: '25+', label: 'Web Applications', icon: FaCode },
              { number: '100%', label: 'Ethical Standards', icon: FaShieldAlt },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center cyber-card">
                  <Icon className="text-3xl text-neon-blue mx-auto mb-3" />
                  <div className="text-2xl lg:text-3xl font-bold font-mono neon-text mb-2">
                    {stat.number}
                  </div>
                  <div className="text-cyber-text text-sm">{stat.label}</div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Quick Access Terminal */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="terminal-window max-w-4xl mx-auto"
          >
            <div className="terminal-header">
              <div className="terminal-dot bg-red-500"></div>
              <div className="terminal-dot bg-yellow-500"></div>
              <div className="terminal-dot bg-green-500"></div>
              <span className="text-xs font-mono ml-2">quick_access.sh</span>
            </div>
            <div className="terminal-content">
              <div className="grid md:grid-cols-3 gap-6">
                <Link to="/about" className="group">
                  <p className="text-neon-green mb-1">$ ./about.sh</p>
                  <p className="text-sm group-hover:text-neon-blue transition-colors duration-200">
                    Learn about my background and expertise
                  </p>
                </Link>
                <Link to="/projects" className="group">
                  <p className="text-neon-green mb-1">$ ./projects.sh</p>
                  <p className="text-sm group-hover:text-neon-blue transition-colors duration-200">
                    Explore my security tools and applications
                  </p>
                </Link>
                <Link to="/contact" className="group">
                  <p className="text-neon-green mb-1">$ ./contact.sh</p>
                  <p className="text-sm group-hover:text-neon-blue transition-colors duration-200">
                    Get in touch for collaborations
                  </p>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
