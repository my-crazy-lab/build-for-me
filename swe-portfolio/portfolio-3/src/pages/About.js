import React from 'react';
import { motion } from 'framer-motion';
import { FaDownload, FaPalette, FaCode, FaLightbulb, FaUsers } from 'react-icons/fa';

const About = () => {
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
              About Me
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              I'm a passionate creative developer who loves bringing ideas to life 
              through beautiful design and innovative technology.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="creative-card"
            >
              <h2 className="text-3xl font-display font-bold gradient-text mb-6">My Creative Journey</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                My journey into the world of creative development began with a simple fascination 
                for how design and technology could work together to create magical experiences. 
                With over 3 years of experience, I've had the privilege of working on diverse 
                projects that challenge the boundaries of traditional web development.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                I specialize in creating user interfaces that not only look stunning but also 
                provide intuitive and delightful user experiences. My approach combines artistic 
                vision with technical expertise to deliver solutions that truly resonate with users.
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                When I'm not coding or designing, you can find me exploring new creative tools, 
                attending design conferences, or experimenting with the latest frontend technologies.
              </p>
              
              <a 
                href="/resume.pdf" 
                download 
                className="btn-creative"
              >
                <FaDownload />
                Download Resume
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="creative-card">
                <img
                  src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=500&h=600&fit=crop&crop=face"
                  alt="Maya Rodriguez"
                  className="rounded-2xl w-full"
                />
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-r from-creative-orange to-creative-yellow rounded-2xl flex items-center justify-center animate-bounce-slow">
                  <FaPalette className="text-white text-3xl" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Creative Strengths */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-display font-bold gradient-text mb-6">
              Creative Superpowers
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: FaPalette,
                title: 'Design Thinking',
                description: 'Creating user-centered designs that solve real problems with creative flair.',
                color: 'from-creative-purple to-creative-pink',
              },
              {
                icon: FaCode,
                title: 'Creative Coding',
                description: 'Bringing designs to life with clean, efficient, and innovative code solutions.',
                color: 'from-creative-orange to-creative-yellow',
              },
              {
                icon: FaLightbulb,
                title: 'Innovation',
                description: 'Always exploring new technologies and pushing creative boundaries.',
                color: 'from-creative-green to-creative-blue',
              },
              {
                icon: FaUsers,
                title: 'Collaboration',
                description: 'Working seamlessly with teams to bring collective visions to reality.',
                color: 'from-creative-indigo to-creative-red',
              },
            ].map((strength, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                whileHover={{ scale: 1.05 }}
                className="creative-card text-center group"
              >
                <div className={`w-20 h-20 bg-gradient-to-r ${strength.color} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:animate-wiggle`}>
                  <strength.icon className="text-white text-3xl" />
                </div>
                <h3 className="text-xl font-display font-semibold text-gray-800 mb-4">{strength.title}</h3>
                <p className="text-gray-600 leading-relaxed">{strength.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Fun Facts */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="creative-card text-center"
          >
            <h2 className="text-3xl font-display font-bold gradient-text mb-8">
              Fun Facts About Me
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="text-4xl mb-4">🎨</div>
                <h3 className="font-semibold text-gray-800 mb-2">Design Enthusiast</h3>
                <p className="text-gray-600">I collect vintage design books and love studying color theory</p>
              </div>
              <div>
                <div className="text-4xl mb-4">☕</div>
                <h3 className="font-semibold text-gray-800 mb-2">Coffee Addict</h3>
                <p className="text-gray-600">My best ideas come with a perfect cup of artisan coffee</p>
              </div>
              <div>
                <div className="text-4xl mb-4">🌱</div>
                <h3 className="font-semibold text-gray-800 mb-2">Plant Parent</h3>
                <p className="text-gray-600">My workspace is filled with plants that inspire creativity</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
