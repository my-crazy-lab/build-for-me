import React from 'react';
import { motion } from 'framer-motion';
import { FaDownload, FaAtom, FaCube, FaRocket, FaEye } from 'react-icons/fa';

const About = () => {
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
              ABOUT.ZARA
            </h1>
            <p className="text-2xl text-interactive-accent max-w-4xl mx-auto font-modern">
              Interactive Frontend Developer pushing the boundaries of web technology 
              with 3D experiences and cutting-edge animations.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="interactive-card"
            >
              <h2 className="text-4xl font-futuristic font-bold text-interactive-neon mb-8">
                SYSTEM.PROFILE
              </h2>
              <p className="text-gray-300 mb-6 leading-relaxed font-modern">
                I'm a passionate frontend developer specializing in creating immersive 
                3D web experiences and interactive user interfaces. With expertise in 
                WebGL, Three.js, and advanced animation libraries, I transform static 
                websites into dynamic, engaging digital environments.
              </p>
              <p className="text-gray-300 mb-6 leading-relaxed font-modern">
                My journey began with traditional web development, but I quickly became 
                fascinated by the possibilities of 3D graphics on the web. I've spent 
                the last 4 years mastering technologies like React Three Fiber, GSAP, 
                and custom shader programming to create experiences that blur the line 
                between web and game development.
              </p>
              <p className="text-gray-300 mb-8 leading-relaxed font-modern">
                When I'm not coding, I'm exploring new technologies, contributing to 
                open-source 3D libraries, and experimenting with AR/VR web experiences.
              </p>
              
              <a 
                href="/resume.pdf" 
                download 
                className="btn-interactive"
              >
                <FaDownload />
                DOWNLOAD.PROFILE
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="perspective-container"
            >
              <div className="relative floating-3d">
                <div className="w-96 h-96 morphing-shape rounded-3xl flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-4 bg-dark-bg/80 backdrop-blur-lg rounded-2xl flex items-center justify-center">
                    <img
                      src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face"
                      alt="Zara Kim"
                      className="w-80 h-80 rounded-2xl object-cover"
                    />
                  </div>
                  
                  <motion.div
                    className="absolute -top-6 -right-6 w-16 h-16 bg-interactive-primary rounded-full flex items-center justify-center"
                    animate={{ 
                      y: [-10, 10, -10],
                      rotate: [0, 180, 360]
                    }}
                    transition={{ 
                      duration: 4, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <FaAtom className="text-white text-2xl" />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-futuristic font-bold holographic-text mb-8">
              CORE.SYSTEMS
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: FaCube,
                title: '3D Development',
                description: 'Creating immersive 3D web experiences using Three.js, WebGL, and React Three Fiber.',
                color: 'from-interactive-primary to-interactive-secondary',
              },
              {
                icon: FaRocket,
                title: 'Performance',
                description: 'Optimizing complex animations and 3D scenes for smooth 60fps performance across devices.',
                color: 'from-interactive-secondary to-interactive-accent',
              },
              {
                icon: FaEye,
                title: 'UX Innovation',
                description: 'Designing intuitive interfaces that seamlessly blend 2D and 3D interaction patterns.',
                color: 'from-interactive-accent to-interactive-primary',
              },
              {
                icon: FaAtom,
                title: 'Future Tech',
                description: 'Exploring AR/VR web technologies and next-generation interaction paradigms.',
                color: 'from-interactive-purple to-interactive-pink',
              },
            ].map((system, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                whileHover={{ 
                  scale: 1.05,
                  rotateY: 15
                }}
                className="interactive-card text-center group perspective-container"
              >
                <div className={`w-20 h-20 bg-gradient-to-r ${system.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:animate-rotate-3d`}>
                  <system.icon className="text-white text-3xl" />
                </div>
                <h3 className="text-xl font-futuristic font-bold text-interactive-neon mb-4">
                  {system.title}
                </h3>
                <p className="text-gray-300 leading-relaxed font-modern">{system.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
