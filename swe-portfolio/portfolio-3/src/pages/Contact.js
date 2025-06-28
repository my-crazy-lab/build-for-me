import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaGithub, FaLinkedin, FaTwitter, FaPaperPlane } from 'react-icons/fa';

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
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitMessage('Thank you for your message! I\'ll get back to you soon with creative ideas! 🎨');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 2000);
  };

  const contactInfo = [
    {
      icon: FaEnvelope,
      title: 'Email',
      value: 'maya@creative.dev',
      link: 'mailto:maya@creative.dev',
      color: 'from-creative-purple to-creative-pink',
    },
    {
      icon: FaPhone,
      title: 'Phone',
      value: '+1 (555) 123-4567',
      link: 'tel:+15551234567',
      color: 'from-creative-orange to-creative-yellow',
    },
    {
      icon: FaMapMarkerAlt,
      title: 'Location',
      value: 'San Francisco, CA',
      link: null,
      color: 'from-creative-green to-creative-blue',
    },
  ];

  const socialLinks = [
    { icon: FaGithub, href: 'https://github.com/mayarodriguez', label: 'GitHub' },
    { icon: FaLinkedin, href: 'https://linkedin.com/in/mayarodriguez', label: 'LinkedIn' },
    { icon: FaTwitter, href: 'https://twitter.com/mayarodriguez', label: 'Twitter' },
  ];

  return (
    <div className="min-h-screen pt-20 relative">
      {/* Hero Section */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl lg:text-6xl font-display font-bold gradient-text mb-6">
              Let's Create Together!
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Have a creative project in mind? I'd love to hear about it! 
              Let's collaborate and bring your vision to life with beautiful design and innovative technology.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="creative-card"
            >
              <h2 className="text-3xl font-display font-bold gradient-text mb-6">Send Me a Message</h2>
              
              {submitMessage && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-6 p-4 bg-gradient-to-r from-creative-green/10 to-creative-blue/10 border border-creative-green/20 text-creative-green rounded-2xl"
                >
                  {submitMessage}
                </motion.div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-creative-purple focus:outline-none transition-colors duration-200"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-creative-purple focus:outline-none transition-colors duration-200"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                    Project Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-creative-purple focus:outline-none transition-colors duration-200"
                    placeholder="Website Redesign Project"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                    Tell me about your project *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-creative-purple focus:outline-none transition-colors duration-200 resize-none"
                    placeholder="I'd love to hear about your creative vision and how we can bring it to life together..."
                  />
                </div>
                
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-4 px-6 rounded-2xl font-semibold transition-all duration-200 flex items-center justify-center gap-3 ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'btn-creative'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane />
                      Send Message
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8"
            >
              <div className="creative-card">
                <h2 className="text-3xl font-display font-bold gradient-text mb-6">Get In Touch</h2>
                <div className="space-y-6">
                  {contactInfo.map((info, index) => {
                    const Icon = info.icon;
                    const content = (
                      <div className="flex items-center p-4 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100 hover:border-creative-purple/30 transition-all duration-300 group">
                        <div className={`w-14 h-14 bg-gradient-to-r ${info.color} rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className="text-white text-xl" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">{info.title}</h3>
                          <p className="text-gray-600">{info.value}</p>
                        </div>
                      </div>
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

              <div className="creative-card">
                <h2 className="text-3xl font-display font-bold gradient-text mb-6">Follow My Work</h2>
                <div className="flex space-x-4">
                  {socialLinks.map((link, index) => {
                    const Icon = link.icon;
                    return (
                      <motion.a
                        key={index}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-14 h-14 bg-gradient-to-r from-creative-purple to-creative-pink text-white rounded-2xl flex items-center justify-center transition-all duration-300 hover:shadow-lg"
                        aria-label={link.label}
                      >
                        <Icon size={20} />
                      </motion.a>
                    );
                  })}
                </div>
              </div>

              <div className="creative-card text-center">
                <h3 className="text-2xl font-display font-bold gradient-text mb-4">
                  Ready to Start Something Amazing?
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Whether you need a complete brand identity, a stunning website, 
                  or an innovative mobile app, I'm here to help bring your creative 
                  vision to life with passion and expertise.
                </p>
                <div className="flex justify-center space-x-4">
                  <span className="text-2xl">🎨</span>
                  <span className="text-2xl">💻</span>
                  <span className="text-2xl">✨</span>
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
