import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaGithub, FaLinkedin, FaTwitter, FaCalendarAlt } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
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
      setSubmitMessage('Thank you for your inquiry. I will respond within 24 hours to discuss your technology needs.');
      setFormData({ name: '', email: '', company: '', subject: '', message: '' });
    }, 2000);
  };

  const contactInfo = [
    {
      icon: FaEnvelope,
      title: 'Email',
      value: 'robert@enterprise.com',
      link: 'mailto:robert@enterprise.com',
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
    { icon: FaGithub, href: 'https://github.com/robertjohnson', label: 'GitHub' },
    { icon: FaLinkedin, href: 'https://linkedin.com/in/robertjohnson', label: 'LinkedIn' },
    { icon: FaTwitter, href: 'https://twitter.com/robertjohnson', label: 'Twitter' },
  ];

  return (
    <div className="min-h-screen pt-20">
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl font-serif font-bold professional-heading mb-6">
              Executive Consultation
            </h1>
            <div className="divider"></div>
            <p className="text-xl text-corporate-gray max-w-4xl mx-auto mt-6">
              Ready to discuss your technology strategy and digital transformation needs? 
              Let's explore how my expertise can drive your organization's success.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="corporate-card"
            >
              <h2 className="text-3xl font-serif font-bold text-corporate-navy mb-6">Schedule a Consultation</h2>
              
              {submitMessage && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                  {submitMessage}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-corporate-navy mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded focus:border-corporate-navy focus:outline-none transition-colors duration-200"
                      placeholder="John Smith"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-corporate-navy mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded focus:border-corporate-navy focus:outline-none transition-colors duration-200"
                      placeholder="john@company.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="company" className="block text-sm font-semibold text-corporate-navy mb-2">
                    Company/Organization *
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:border-corporate-navy focus:outline-none transition-colors duration-200"
                    placeholder="Enterprise Corporation"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-corporate-navy mb-2">
                    Consultation Topic *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:border-corporate-navy focus:outline-none transition-colors duration-200"
                  >
                    <option value="">Select a topic</option>
                    <option value="Digital Transformation">Digital Transformation Strategy</option>
                    <option value="Enterprise Architecture">Enterprise Architecture Review</option>
                    <option value="Cloud Migration">Cloud Migration Planning</option>
                    <option value="Team Leadership">Technology Team Leadership</option>
                    <option value="Other">Other Technology Consultation</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-corporate-navy mb-2">
                    Project Details *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:border-corporate-navy focus:outline-none transition-colors duration-200 resize-none"
                    placeholder="Please describe your technology challenges, goals, and how I can help your organization..."
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 px-6 rounded font-semibold transition-all duration-200 flex items-center justify-center gap-3 ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed text-white'
                      : 'btn-corporate'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FaCalendarAlt />
                      Request Consultation
                    </>
                  )}
                </button>
              </form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8"
            >
              <div className="corporate-card">
                <h2 className="text-3xl font-serif font-bold text-corporate-navy mb-6">Contact Information</h2>
                <div className="space-y-6">
                  {contactInfo.map((info, index) => {
                    const Icon = info.icon;
                    const content = (
                      <div className="flex items-center p-4 bg-corporate-lightgray rounded-lg hover:bg-gray-100 transition-colors duration-300">
                        <div className="w-12 h-12 bg-corporate-navy rounded-lg flex items-center justify-center mr-4">
                          <Icon className="text-white text-xl" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-corporate-navy">{info.title}</h3>
                          <p className="text-corporate-gray">{info.value}</p>
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

              <div className="corporate-card">
                <h2 className="text-3xl font-serif font-bold text-corporate-navy mb-6">Professional Network</h2>
                <div className="flex space-x-4 mb-6">
                  {socialLinks.map((link, index) => {
                    const Icon = link.icon;
                    return (
                      <a
                        key={index}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-corporate-navy hover:bg-corporate-gold text-white rounded-lg flex items-center justify-center transition-colors duration-300"
                        aria-label={link.label}
                      >
                        <Icon size={20} />
                      </a>
                    );
                  })}
                </div>
                <p className="text-corporate-gray">
                  Connect with me on professional networks to stay updated on technology trends and insights.
                </p>
              </div>

              <div className="corporate-card bg-corporate-navy text-white">
                <h3 className="text-2xl font-serif font-bold mb-4">Executive Availability</h3>
                <p className="text-blue-100 mb-4">
                  I'm currently available for strategic consulting engagements and 
                  executive advisory roles. Response time is typically within 24 hours 
                  for qualified opportunities.
                </p>
                <div className="text-corporate-gold font-semibold">
                  📅 Accepting new consulting engagements
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
