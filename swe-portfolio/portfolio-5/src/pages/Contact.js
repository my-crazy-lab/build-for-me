import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaGithub, FaLinkedin, FaTwitter, FaAtom, FaPaperPlane } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitMessage('MESSAGE.TRANSMITTED.SUCCESSFULLY > Quantum entanglement established. Response incoming...');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 2000);
  };

  const contactInfo = [
    {
      icon: FaEnvelope,
      title: 'EMAIL.PROTOCOL',
      value: 'zara@interactive.dev',
      link: 'mailto:zara@interactive.dev',
      color: 'from-interactive-primary to-interactive-secondary',
    },
    {
      icon: FaAtom,
      title: 'QUANTUM.LOCATION',
      value: 'San Francisco, CA / Metaverse',
      link: null,
      color: 'from-interactive-secondary to-interactive-accent',
    },
  ];

  const socialLinks = [
    { icon: FaGithub, href: 'https://github.com/zarakim', label: 'GitHub' },
    { icon: FaLinkedin, href: 'https://linkedin.com/in/zarakim', label: 'LinkedIn' },
    { icon: FaTwitter, href: 'https://twitter.com/zarakim', label: 'Twitter' },
  ];

  return (
    <div className="min-h-screen pt-20 relative">
      <section className="section-padding neural-bg">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-6xl lg:text-7xl font-futuristic font-black holographic-text mb-6">
              CONTACT.INTERFACE
            </h1>
            <p className="text-2xl text-interactive-accent max-w-4xl mx-auto font-modern">
              Ready to create the next generation of web experiences? 
              Let's establish a quantum connection and build something extraordinary.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="interactive-card"
            >
              <h2 className="text-3xl font-futuristic font-bold holographic-text mb-8">
                TRANSMISSION.FORM
              </h2>
              
              {submitMessage && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-6 p-4 bg-gradient-to-r from-interactive-primary/20 to-interactive-secondary/20 border border-interactive-neon/50 text-interactive-neon rounded-2xl font-mono text-sm"
                >
                  {submitMessage}
                </motion.div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-interactive-neon mb-2 font-futuristic">
                      USER.NAME *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-dark-card border-2 border-dark-border rounded-2xl focus:border-interactive-neon focus:outline-none transition-colors duration-200 text-gray-300 font-modern"
                      placeholder="Enter your designation"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-interactive-neon mb-2 font-futuristic">
                      EMAIL.ADDRESS *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-dark-card border-2 border-dark-border rounded-2xl focus:border-interactive-neon focus:outline-none transition-colors duration-200 text-gray-300 font-modern"
                      placeholder="your@email.protocol"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-interactive-neon mb-2 font-futuristic">
                    PROJECT.TYPE *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-dark-card border-2 border-dark-border rounded-2xl focus:border-interactive-neon focus:outline-none transition-colors duration-200 text-gray-300 font-modern"
                  >
                    <option value="">Select mission type</option>
                    <option value="3D Website">3D Interactive Website</option>
                    <option value="WebXR Experience">WebXR/AR Experience</option>
                    <option value="Game Development">Web Game Development</option>
                    <option value="Animation Project">Advanced Animation Project</option>
                    <option value="Consultation">Technical Consultation</option>
                    <option value="Other">Other Quantum Project</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-interactive-neon mb-2 font-futuristic">
                    PROJECT.DETAILS *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-dark-card border-2 border-dark-border rounded-2xl focus:border-interactive-neon focus:outline-none transition-colors duration-200 resize-none text-gray-300 font-modern"
                    placeholder="Describe your vision for the next-generation web experience..."
                  />
                </div>
                
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-4 px-6 rounded-2xl font-futuristic font-semibold transition-all duration-200 flex items-center justify-center gap-3 ${
                    isSubmitting
                      ? 'bg-gray-600 cursor-not-allowed text-gray-400'
                      : 'btn-interactive'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      TRANSMITTING...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane />
                      SEND.TRANSMISSION
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8"
            >
              <div className="interactive-card">
                <h2 className="text-3xl font-futuristic font-bold holographic-text mb-8">
                  CONNECTION.PROTOCOLS
                </h2>
                <div className="space-y-6">
                  {contactInfo.map((info, index) => {
                    const Icon = info.icon;
                    const content = (
                      <motion.div 
                        whileHover={{ scale: 1.02, x: 10 }}
                        className="flex items-center p-4 bg-dark-card rounded-2xl border border-interactive-primary/30 hover:border-interactive-neon transition-all duration-300 group"
                      >
                        <div className={`w-14 h-14 bg-gradient-to-r ${info.color} rounded-2xl flex items-center justify-center mr-4 group-hover:animate-pulse-glow`}>
                          <Icon className="text-white text-xl" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-interactive-neon font-futuristic">{info.title}</h3>
                          <p className="text-gray-300 font-modern">{info.value}</p>
                        </div>
                      </motion.div>
                    );

                    return info.link ? (
                      <a key={index} href={info.link} className="block">
                        {content}
                      </a>
                    ) : (
                      <div key={index}>{content}</div>
                    );
                  })}
                </div>
              </div>

              <div className="interactive-card">
                <h2 className="text-3xl font-futuristic font-bold holographic-text mb-8">
                  SOCIAL.NETWORKS
                </h2>
                <div className="flex space-x-4 mb-6">
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
                        whileTap={{ scale: 0.95 }}
                        className="w-14 h-14 bg-gradient-to-r from-interactive-primary to-interactive-secondary text-white rounded-2xl flex items-center justify-center transition-all duration-300"
                        aria-label={link.label}
                      >
                        <Icon size={20} />
                      </motion.a>
                    );
                  })}
                </div>
                <p className="text-gray-300 font-modern">
                  Follow my journey through the digital frontier and stay updated 
                  on the latest in interactive web development.
                </p>
              </div>

              <div className="interactive-card bg-gradient-to-r from-interactive-primary/10 to-interactive-secondary/10 border-interactive-neon/30">
                <h3 className="text-2xl font-futuristic font-bold holographic-text mb-4">
                  QUANTUM.STATUS
                </h3>
                <p className="text-gray-300 mb-4 font-modern">
                  Currently accepting new projects for 2024. Specializing in 
                  cutting-edge 3D web experiences, WebXR applications, and 
                  next-generation interactive interfaces.
                </p>
                <div className="text-interactive-neon font-futuristic font-semibold">
                  🚀 AVAILABLE FOR QUANTUM COLLABORATION
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
