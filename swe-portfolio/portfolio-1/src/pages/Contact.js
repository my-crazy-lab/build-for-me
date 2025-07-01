import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

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
      setSubmitMessage('Thank you for your message! I\'ll get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 2000);
  };

  const contactInfo = [
    {
      icon: FaEnvelope,
      title: 'Email',
      value: 'john@example.com',
      link: 'mailto:john@example.com',
    },
    {
      icon: FaPhone,
      title: 'Phone',
      value: '+1 (555) 123-4567',
      link: 'tel:+15551234567',
    },
    {
      icon: FaMapMarkerAlt,
      title: 'Location',
      value: 'San Francisco, CA',
      link: null,
    },
  ];

  const socialLinks = [
    { icon: FaGithub, href: 'https://github.com/johndoe', label: 'GitHub' },
    { icon: FaLinkedin, href: 'https://linkedin.com/in/johndoe', label: 'LinkedIn' },
    { icon: FaTwitter, href: 'https://twitter.com/johndoe', label: 'Twitter' },
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-gray-50 to-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Get In Touch
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              I'm always interested in new opportunities and exciting projects. 
              Let's discuss how we can work together!
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-white rounded-lg shadow-lg p-8 border border-gray-200"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Me a Message</h2>
              
              {submitMessage && (
                <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                  {submitMessage}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                      placeholder="Your Name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                    placeholder="What's this about?"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200 resize-none"
                    placeholder="Tell me about your project or opportunity..."
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-colors duration-200 ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-primary-600 hover:bg-primary-700'
                  } text-white`}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
                <div className="space-y-4">
                  {contactInfo.map((info, index) => {
                    const Icon = info.icon;
                    const content = (
                      <div className="flex items-center p-4 bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                          <Icon className="text-primary-600 text-xl" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{info.title}</h3>
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

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Follow Me</h2>
                <div className="flex space-x-4">
                  {socialLinks.map((link, index) => {
                    const Icon = link.icon;
                    return (
                      <a
                        key={index}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-primary-600 hover:bg-primary-700 text-white rounded-full flex items-center justify-center transition-colors duration-200"
                        aria-label={link.label}
                      >
                        <Icon size={20} />
                      </a>
                    );
                  })}
                </div>
              </div>

              <div className="bg-primary-50 rounded-lg p-6 border border-primary-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Let's Work Together!</h3>
                <p className="text-gray-600 leading-relaxed">
                  I'm currently available for freelance projects and full-time opportunities. 
                  Whether you have a project in mind or just want to chat about technology, 
                  I'd love to hear from you.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
