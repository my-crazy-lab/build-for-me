import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen pt-20 relative">
      <section className="section-padding matrix-bg">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl lg:text-5xl font-bold font-mono mb-6">
              <span className="neon-text">Contact.Interface</span>
            </h1>
            <p className="text-xl text-cyber-text max-w-3xl mx-auto">
              Ready to secure your digital assets? Let's discuss your cybersecurity needs.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="terminal-window"
            >
              <div className="terminal-header">
                <div className="terminal-dot bg-red-500"></div>
                <div className="terminal-dot bg-yellow-500"></div>
                <div className="terminal-dot bg-green-500"></div>
                <span className="text-xs font-mono ml-2">contact_form.sh</span>
              </div>
              <div className="terminal-content">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-mono text-neon-green mb-2">
                      $ enter_name:
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-cyber-card border border-cyber-border rounded font-mono text-cyber-text focus:border-neon-blue focus:outline-none transition-colors duration-200"
                      placeholder="Your Name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-mono text-neon-green mb-2">
                      $ enter_email:
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-cyber-card border border-cyber-border rounded font-mono text-cyber-text focus:border-neon-blue focus:outline-none transition-colors duration-200"
                      placeholder="your@email.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-mono text-neon-green mb-2">
                      $ enter_subject:
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-cyber-card border border-cyber-border rounded font-mono text-cyber-text focus:border-neon-blue focus:outline-none transition-colors duration-200"
                      placeholder="Security Consultation"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-mono text-neon-green mb-2">
                      $ enter_message:
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 bg-cyber-card border border-cyber-border rounded font-mono text-cyber-text focus:border-neon-blue focus:outline-none transition-colors duration-200 resize-none"
                      placeholder="Describe your security requirements..."
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full btn-neon"
                  >
                    $ ./send_message.sh
                  </button>
                </form>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8"
            >
              <div className="terminal-window">
                <div className="terminal-header">
                  <div className="terminal-dot bg-red-500"></div>
                  <div className="terminal-dot bg-yellow-500"></div>
                  <div className="terminal-dot bg-green-500"></div>
                  <span className="text-xs font-mono ml-2">contact_info.sh</span>
                </div>
                <div className="terminal-content">
                  <p className="text-neon-green font-mono mb-2">$ cat contact_details.txt</p>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <FaEnvelope className="text-neon-blue mr-3" />
                      <span className="font-mono">alex@cybersec.dev</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-neon-blue mr-3">📍</span>
                      <span className="font-mono">San Francisco, CA</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="terminal-window">
                <div className="terminal-header">
                  <div className="terminal-dot bg-red-500"></div>
                  <div className="terminal-dot bg-yellow-500"></div>
                  <div className="terminal-dot bg-green-500"></div>
                  <span className="text-xs font-mono ml-2">social_links.sh</span>
                </div>
                <div className="terminal-content">
                  <p className="text-neon-green font-mono mb-4">$ ls social_profiles/</p>
                  <div className="flex space-x-4">
                    {[
                      { icon: FaGithub, href: 'https://github.com/alexchen', label: 'GitHub' },
                      { icon: FaLinkedin, href: 'https://linkedin.com/in/alexchen', label: 'LinkedIn' },
                      { icon: FaTwitter, href: 'https://twitter.com/alexchen', label: 'Twitter' },
                    ].map((link, index) => {
                      const Icon = link.icon;
                      return (
                        <a
                          key={index}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-12 h-12 bg-cyber-border hover:bg-neon-blue text-cyber-text hover:text-cyber-bg rounded border border-cyber-border hover:border-neon-blue flex items-center justify-center transition-all duration-300"
                          aria-label={link.label}
                        >
                          <Icon size={20} />
                        </a>
                      );
                    })}
                  </div>
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
