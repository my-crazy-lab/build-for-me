import React from 'react';
import { motion } from 'framer-motion';
import { FaDownload, FaCog, FaUsers, FaChartLine, FaAward } from 'react-icons/fa';

const About = () => {
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
              About Robert Johnson
            </h1>
            <div className="divider"></div>
            <p className="text-xl text-corporate-gray max-w-4xl mx-auto mt-6">
              A seasoned technology executive with over 10 years of experience leading 
              digital transformation initiatives and building scalable enterprise solutions.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="corporate-card"
            >
              <h2 className="text-3xl font-serif font-bold professional-heading mb-6">Executive Summary</h2>
              <p className="text-corporate-darkgray mb-6 leading-relaxed">
                As a Senior Software Architect and Technology Leader, I have successfully guided 
                organizations through complex digital transformations, delivering solutions that 
                drive business growth and operational efficiency. My expertise spans enterprise 
                architecture, team leadership, and strategic technology planning.
              </p>
              <p className="text-corporate-darkgray mb-6 leading-relaxed">
                Throughout my career, I have led cross-functional teams of 50+ engineers, 
                architected systems serving millions of users, and generated over $50M in 
                revenue through innovative technology solutions. I specialize in building 
                scalable, secure, and maintainable enterprise applications.
              </p>
              <p className="text-corporate-darkgray mb-8 leading-relaxed">
                My leadership philosophy centers on empowering teams, fostering innovation, 
                and aligning technology initiatives with business objectives to create 
                sustainable competitive advantages.
              </p>
              
              <a 
                href="/resume.pdf" 
                download 
                className="btn-corporate"
              >
                <FaDownload />
                Download Executive Resume
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="corporate-card">
                <img
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&h=600&fit=crop&crop=face"
                  alt="Robert Johnson"
                  className="rounded-lg w-full"
                />
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-corporate-gold rounded-lg flex items-center justify-center">
                  <FaAward className="text-white text-3xl" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-corporate-lightgray">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-serif font-bold professional-heading mb-6">
              Leadership Excellence
            </h2>
            <div className="divider"></div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: FaCog,
                title: 'Technical Leadership',
                description: 'Architecting enterprise-scale solutions and leading technical strategy for Fortune 500 companies.',
              },
              {
                icon: FaUsers,
                title: 'Team Development',
                description: 'Building and mentoring high-performing engineering teams, fostering innovation and professional growth.',
              },
              {
                icon: FaChartLine,
                title: 'Business Impact',
                description: 'Delivering measurable business results through strategic technology initiatives and process optimization.',
              },
            ].map((strength, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="corporate-card text-center"
              >
                <div className="w-16 h-16 bg-corporate-navy rounded-full flex items-center justify-center mx-auto mb-6">
                  <strength.icon className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-corporate-navy mb-4">{strength.title}</h3>
                <p className="text-corporate-gray leading-relaxed">{strength.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
