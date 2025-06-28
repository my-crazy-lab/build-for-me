import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaRocket, FaCode, FaMagic, FaEye, FaCube, FaAtom } from 'react-icons/fa';

const Home = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen pt-20 relative">
      {/* Interactive cursor follower */}
      <div
        className="fixed w-6 h-6 bg-interactive-neon rounded-full pointer-events-none z-50 mix-blend-difference"
        style={{
          left: mousePosition.x - 12,
          top: mousePosition.y - 12,
          transition: 'all 0.1s ease-out',
        }}
      />

      {/* Hero Section */}
      <section className="section-padding neural-bg">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, type: "spring", stiffness: 100 }}
              className="text-center lg:text-left"
            >
              <motion.h1 
                className="text-7xl lg:text-8xl font-futuristic font-black mb-8 glitch-effect holographic-text"
                data-text="ZARA.EXE"
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.3 }}
              >
                ZARA.EXE
              </motion.h1>
              
              <motion.h2 
                className="text-3xl lg:text-4xl text-interactive-accent mb-8 font-modern font-light"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.6 }}
              >
                Interactive Frontend Developer
              </motion.h2>
              
              <motion.p 
                className="text-xl text-gray-300 mb-12 leading-relaxed max-w-2xl"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.9 }}
              >
                Crafting immersive digital experiences with cutting-edge technologies. 
                Specializing in 3D web development, interactive animations, and 
                next-generation user interfaces that push the boundaries of what's possible.
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-6 mb-12"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.2 }}
              >
                <Link to="/projects" className="btn-interactive">
                  <FaRocket />
                  Explore Universe
                </Link>
                <Link to="/contact" className="btn-holographic">
                  <FaAtom />
                  Initialize Contact
                </Link>
              </motion.div>
              
              <motion.div 
                className="flex justify-center lg:justify-start space-x-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.5 }}
              >
                {[
                  { icon: FaCode, color: 'text-interactive-primary' },
                  { icon: FaCube, color: 'text-interactive-secondary' },
                  { icon: FaMagic, color: 'text-interactive-accent' },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ 
                      scale: 1.5, 
                      rotate: 360,
                      filter: 'drop-shadow(0 0 20px currentColor)'
                    }}
                    className={`text-4xl ${item.color} cursor-pointer transition-all duration-300`}
                  >
                    <item.icon />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, delay: 0.5 }}
              className="flex justify-center perspective-container"
            >
              <div className="relative floating-3d">
                <motion.div 
                  className="w-96 h-96 morphing-shape rounded-3xl flex items-center justify-center relative overflow-hidden"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="absolute inset-4 bg-dark-bg/80 backdrop-blur-lg rounded-2xl flex items-center justify-center">
                    <img
                      src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face"
                      alt="Zara Kim"
                      className="w-80 h-80 rounded-2xl object-cover"
                    />
                  </div>
                  
                  {/* Floating tech icons */}
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
                    <FaEye className="text-white text-2xl" />
                  </motion.div>
                  
                  <motion.div
                    className="absolute -bottom-6 -left-6 w-16 h-16 bg-interactive-accent rounded-full flex items-center justify-center"
                    animate={{ 
                      y: [10, -10, 10],
                      rotate: [360, 180, 0]
                    }}
                    transition={{ 
                      duration: 4, 
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 2
                    }}
                  >
                    <FaCube className="text-white text-2xl" />
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Interactive Stats */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { number: '200+', label: 'Interactive Projects', icon: FaCube },
              { number: '50+', label: '3D Experiences', icon: FaAtom },
              { number: '∞', label: 'Creative Possibilities', icon: FaMagic },
              { number: '100%', label: 'Innovation Focus', icon: FaRocket },
            ].map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ 
                  scale: 1.1,
                  rotateY: 15,
                  z: 50
                }}
                className="interactive-card text-center group cursor-pointer"
              >
                <stat.icon className="text-5xl text-interactive-primary mx-auto mb-4 group-hover:animate-pulse-glow transition-all duration-300" />
                <div className="text-4xl font-futuristic font-bold holographic-text mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400 font-modern">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Interactive Showcase Preview */}
      <section className="section-padding neural-bg">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center mb-20"
          >
            <h2 className="text-6xl font-futuristic font-bold holographic-text mb-8">
              NEXT.LEVEL.EXPERIENCES
            </h2>
            <p className="text-2xl text-gray-300 max-w-4xl mx-auto font-modern">
              Pushing the boundaries of web development with immersive 3D environments, 
              real-time interactions, and cutting-edge visual effects
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                title: '3D Web Experiences',
                description: 'Creating immersive three-dimensional interfaces using WebGL, Three.js, and React Three Fiber',
                icon: FaCube,
                color: 'from-interactive-primary to-interactive-secondary',
              },
              {
                title: 'Interactive Animations',
                description: 'Crafting fluid, responsive animations that react to user input and create engaging experiences',
                icon: FaMagic,
                color: 'from-interactive-secondary to-interactive-accent',
              },
              {
                title: 'Future Interfaces',
                description: 'Designing next-generation user interfaces with AR/VR elements and advanced interaction patterns',
                icon: FaEye,
                color: 'from-interactive-accent to-interactive-primary',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: index * 0.3 }}
                whileHover={{ 
                  scale: 1.05,
                  rotateX: 10,
                  rotateY: 10
                }}
                className="interactive-card text-center group perspective-container"
              >
                <div className={`w-24 h-24 bg-gradient-to-r ${feature.color} rounded-full flex items-center justify-center mx-auto mb-8 group-hover:animate-rotate-3d transition-all duration-500`}>
                  <feature.icon className="text-white text-4xl" />
                </div>
                <h3 className="text-2xl font-futuristic font-bold text-interactive-neon mb-6">
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed font-modern">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
