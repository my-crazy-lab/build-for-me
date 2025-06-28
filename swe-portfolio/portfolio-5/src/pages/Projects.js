import React from 'react';
import { motion } from 'framer-motion';
import { FaExternalLinkAlt, FaGithub, FaCube, FaGamepad } from 'react-icons/fa';
import { MdHeadset } from 'react-icons/md';

const Projects = () => {
  const projects = [
    {
      title: 'NEURAL.INTERFACE',
      description: 'An immersive 3D data visualization platform that transforms complex datasets into interactive neural network representations using WebGL shaders.',
      technologies: ['Three.js', 'React Three Fiber', 'WebGL', 'GLSL', 'D3.js'],
      role: 'Lead 3D Developer - Designed and implemented the entire 3D visualization engine, custom shaders, and interactive particle systems.',
      liveUrl: 'https://neural-interface-demo.com',
      githubUrl: 'https://github.com/zara/neural-interface',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=400&fit=crop',
      icon: FaCube,
      color: 'from-interactive-primary to-interactive-secondary',
    },
    {
      title: 'QUANTUM.PORTFOLIO',
      description: 'A physics-based portfolio website featuring quantum particle simulations, morphing geometries, and real-time ray tracing effects.',
      technologies: ['React', 'Three.js', 'Cannon.js', 'GSAP', 'WebXR'],
      role: 'Creative Developer - Built advanced physics simulations, implemented WebXR support, and created custom post-processing effects.',
      liveUrl: 'https://quantum-portfolio-demo.com',
      githubUrl: 'https://github.com/zara/quantum-portfolio',
      image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&h=400&fit=crop',
      icon: MdHeadset,
      color: 'from-interactive-secondary to-interactive-accent',
    },
    {
      title: 'CYBER.GAME',
      description: 'A browser-based cyberpunk adventure game with procedural environments, dynamic lighting, and immersive audio-reactive visuals.',
      technologies: ['TypeScript', 'Three.js', 'Web Audio API', 'WebAssembly', 'Blender'],
      role: 'Game Developer - Architected the game engine, implemented procedural generation algorithms, and optimized performance for web deployment.',
      liveUrl: 'https://cyber-game-demo.com',
      githubUrl: 'https://github.com/zara/cyber-game',
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=400&fit=crop',
      icon: FaGamepad,
      color: 'from-interactive-accent to-interactive-primary',
    },
  ];

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
              PROJECT.ARCHIVE
            </h1>
            <p className="text-2xl text-interactive-accent max-w-4xl mx-auto font-modern">
              Cutting-edge interactive experiences that push the boundaries of 
              web technology and redefine user engagement.
            </p>
          </motion.div>

          <div className="space-y-20">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="interactive-card"
              >
                <div className={`grid lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
                }`}>
                  <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                    <div className="relative group perspective-container">
                      <motion.img
                        src={project.image}
                        alt={project.title}
                        className="rounded-2xl w-full h-80 object-cover"
                        whileHover={{ 
                          scale: 1.05,
                          rotateY: 10,
                          rotateX: 5
                        }}
                        transition={{ type: "spring", stiffness: 300 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-interactive-primary/50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </div>
                  
                  <div className={index % 2 === 1 ? 'lg:col-start-1' : ''}>
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`w-16 h-16 bg-gradient-to-r ${project.color} rounded-2xl flex items-center justify-center animate-pulse-glow`}>
                        <project.icon className="text-white text-2xl" />
                      </div>
                      <h3 className="text-3xl font-futuristic font-bold holographic-text">
                        {project.title}
                      </h3>
                    </div>
                    
                    <p className="text-gray-300 mb-6 leading-relaxed text-lg font-modern">
                      {project.description}
                    </p>
                    
                    <div className="mb-6">
                      <h4 className="font-semibold text-interactive-neon mb-3 font-futuristic">TECH.STACK:</h4>
                      <div className="flex flex-wrap gap-3">
                        {project.technologies.map((tech, techIndex) => (
                          <motion.span
                            key={techIndex}
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            className="px-4 py-2 bg-dark-card border border-interactive-primary text-interactive-neon rounded-lg text-sm font-mono"
                          >
                            {tech}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-8">
                      <h4 className="font-semibold text-interactive-neon mb-3 font-futuristic">ROLE.DESCRIPTION:</h4>
                      <p className="text-gray-300 leading-relaxed font-modern">
                        {project.role}
                      </p>
                    </div>
                    
                    <div className="flex gap-4">
                      <motion.a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn-interactive"
                      >
                        <FaExternalLinkAlt />
                        LAUNCH.DEMO
                      </motion.a>
                      <motion.a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn-holographic"
                      >
                        <FaGithub />
                        VIEW.CODE
                      </motion.a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="interactive-card text-center"
          >
            <h2 className="text-5xl font-futuristic font-bold holographic-text mb-8">
              NEXT.LEVEL.COLLABORATION
            </h2>
            <p className="text-2xl text-gray-300 mb-8 max-w-3xl mx-auto font-modern">
              Ready to create something extraordinary? Let's push the boundaries 
              of what's possible on the web together.
            </p>
            <motion.a
              href="/contact"
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 0 30px rgba(99, 102, 241, 0.6)'
              }}
              whileTap={{ scale: 0.95 }}
              className="btn-interactive text-xl px-8 py-4"
            >
              INITIALIZE.CONTACT
            </motion.a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Projects;
