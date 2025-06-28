import React from 'react';
import { motion } from 'framer-motion';
import { FaDownload, FaCode, FaLightbulb, FaUsers } from 'react-icons/fa';

const About = () => {
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
              About Me
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              I'm a passionate software engineer with a love for creating innovative solutions 
              and building scalable applications that make a difference.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">My Journey</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                With over 3 years of experience in software development, I've had the privilege 
                of working on diverse projects ranging from e-commerce platforms to data analytics 
                tools. My journey began with a Computer Science degree, and I've been continuously 
                learning and adapting to new technologies ever since.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                I specialize in full-stack development with a strong focus on React, Node.js, 
                and Python. I'm passionate about writing clean, maintainable code and following 
                best practices in software development.
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                When I'm not coding, you can find me contributing to open-source projects, 
                reading tech blogs, or exploring new frameworks and tools.
              </p>
              
              <a 
                href="/resume.pdf" 
                download 
                className="btn-primary"
              >
                Download Resume <FaDownload />
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=600&fit=crop&crop=face"
                alt="John Doe"
                className="rounded-lg shadow-2xl w-full"
              />
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary-600 rounded-lg flex items-center justify-center">
                <FaCode className="text-white text-3xl" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Skills & Traits */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              What I Bring to the Table
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: FaCode,
                title: 'Technical Excellence',
                description: 'Strong foundation in multiple programming languages and frameworks, with a focus on writing clean, efficient, and maintainable code.',
              },
              {
                icon: FaLightbulb,
                title: 'Problem Solving',
                description: 'Analytical mindset with the ability to break down complex problems into manageable solutions and think outside the box.',
              },
              {
                icon: FaUsers,
                title: 'Team Collaboration',
                description: 'Excellent communication skills and experience working in agile environments with cross-functional teams.',
              },
            ].map((trait, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <trait.icon className="text-primary-600 text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{trait.title}</h3>
                <p className="text-gray-600 leading-relaxed">{trait.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
