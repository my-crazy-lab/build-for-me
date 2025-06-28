import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaDownload, FaLinkedin, FaGithub, FaEnvelope, FaChartLine, FaUsers, FaCog, FaAward } from 'react-icons/fa';

const Home = () => {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl lg:text-6xl font-serif font-bold text-corporate-navy mb-6">
                Robert Johnson
              </h1>
              <h2 className="text-2xl lg:text-3xl text-corporate-gray mb-6 font-light">
                Senior Software Architect & Technology Leader
              </h2>
              <p className="text-lg text-corporate-darkgray mb-8 leading-relaxed">
                Experienced technology executive with 10+ years of expertise in enterprise 
                software development, team leadership, and digital transformation. 
                Proven track record of delivering scalable solutions for Fortune 500 companies.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link to="/projects" className="btn-corporate">
                  View Portfolio
                </Link>
                <a 
                  href="/resume.pdf" 
                  download 
                  className="btn-outline-corporate"
                >
                  <FaDownload />
                  Download Resume
                </a>
              </div>
              
              <div className="flex space-x-4">
                <a
                  href="https://linkedin.com/in/robertjohnson"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-corporate-gray hover:text-corporate-navy transition-colors duration-200"
                >
                  <FaLinkedin size={24} />
                </a>
                <a
                  href="https://github.com/robertjohnson"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-corporate-gray hover:text-corporate-navy transition-colors duration-200"
                >
                  <FaGithub size={24} />
                </a>
                <a
                  href="mailto:robert@enterprise.com"
                  className="text-corporate-gray hover:text-corporate-navy transition-colors duration-200"
                >
                  <FaEnvelope size={24} />
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
                <div className="w-80 h-80 bg-gradient-to-br from-corporate-navy to-corporate-blue rounded-lg p-2">
                  <div className="w-full h-full bg-white rounded-lg flex items-center justify-center">
                    <img
                      src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop&crop=face"
                      alt="Robert Johnson"
                      className="w-72 h-72 rounded-lg object-cover"
                    />
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-corporate-gold rounded-lg flex items-center justify-center">
                  <FaAward className="text-white text-2xl" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="section-padding bg-corporate-lightgray">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-serif font-bold professional-heading mb-4">
              Proven Track Record
            </h2>
            <div className="divider"></div>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '10+', label: 'Years Experience', icon: FaChartLine },
              { number: '50+', label: 'Projects Delivered', icon: FaCog },
              { number: '100+', label: 'Team Members Led', icon: FaUsers },
              { number: '$50M+', label: 'Revenue Generated', icon: FaAward },
            ].map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="corporate-card text-center"
              >
                <metric.icon className="text-4xl text-corporate-navy mx-auto mb-4" />
                <div className="text-3xl font-bold text-corporate-navy mb-2">
                  {metric.number}
                </div>
                <div className="text-corporate-gray font-medium">{metric.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Competencies */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-serif font-bold professional-heading mb-4">
              Core Competencies
            </h2>
            <div className="divider"></div>
            <p className="text-xl text-corporate-gray max-w-3xl mx-auto mt-6">
              Strategic technology leadership with deep expertise in enterprise architecture and team management
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Enterprise Architecture',
                description: 'Designing scalable, secure, and maintainable enterprise software solutions that align with business objectives.',
                icon: FaCog,
              },
              {
                title: 'Team Leadership',
                description: 'Leading cross-functional teams of 20+ engineers, fostering innovation and delivering results on time and budget.',
                icon: FaUsers,
              },
              {
                title: 'Strategic Planning',
                description: 'Developing technology roadmaps and digital transformation strategies for large-scale enterprise initiatives.',
                icon: FaChartLine,
              },
            ].map((competency, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="corporate-card text-center"
              >
                <div className="w-16 h-16 bg-corporate-navy rounded-full flex items-center justify-center mx-auto mb-6">
                  <competency.icon className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-corporate-navy mb-4">{competency.title}</h3>
                <p className="text-corporate-gray leading-relaxed">{competency.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding bg-corporate-navy">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-serif font-bold text-white mb-6">
              Ready to Drive Innovation Together?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Let's discuss how my expertise in enterprise architecture and technology leadership 
              can help your organization achieve its digital transformation goals.
            </p>
            <Link 
              to="/contact" 
              className="bg-corporate-gold hover:bg-yellow-500 text-corporate-navy font-semibold py-4 px-8 rounded transition-colors duration-200 inline-flex items-center gap-2"
            >
              Schedule a Consultation
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
