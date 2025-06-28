import React from 'react';
import { motion } from 'framer-motion';

const Skills = () => {
  const skillCategories = [
    {
      title: '3D.GRAPHICS',
      skills: [
        { name: 'Three.js', level: 95 },
        { name: 'WebGL/GLSL', level: 90 },
        { name: 'React Three Fiber', level: 95 },
        { name: 'Blender', level: 80 },
        { name: 'Unity WebGL', level: 75 },
      ],
      color: 'from-interactive-primary to-interactive-secondary',
    },
    {
      title: 'FRONTEND.CORE',
      skills: [
        { name: 'React/TypeScript', level: 95 },
        { name: 'Next.js', level: 90 },
        { name: 'Vue.js', level: 85 },
        { name: 'Svelte', level: 80 },
        { name: 'WebAssembly', level: 75 },
      ],
      color: 'from-interactive-secondary to-interactive-accent',
    },
    {
      title: 'ANIMATION.LIBS',
      skills: [
        { name: 'Framer Motion', level: 95 },
        { name: 'GSAP', level: 90 },
        { name: 'Lottie', level: 85 },
        { name: 'React Spring', level: 90 },
        { name: 'Anime.js', level: 80 },
      ],
      color: 'from-interactive-accent to-interactive-primary',
    },
    {
      title: 'FUTURE.TECH',
      skills: [
        { name: 'WebXR/AR', level: 85 },
        { name: 'Web Audio API', level: 80 },
        { name: 'Canvas API', level: 90 },
        { name: 'WebRTC', level: 75 },
        { name: 'PWA', level: 85 },
      ],
      color: 'from-interactive-purple to-interactive-pink',
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
              SKILL.MATRIX
            </h1>
            <p className="text-2xl text-interactive-accent max-w-4xl mx-auto font-modern">
              Advanced technical capabilities spanning 3D graphics, interactive development, 
              and next-generation web technologies.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {skillCategories.map((category, categoryIndex) => (
              <motion.div
                key={categoryIndex}
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: categoryIndex * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="interactive-card perspective-container"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-2xl animate-pulse-glow`}></div>
                  <h3 className="text-2xl font-futuristic font-bold holographic-text">
                    {category.title}
                  </h3>
                </div>
                
                <div className="space-y-6">
                  {category.skills.map((skill, skillIndex) => (
                    <div key={skillIndex}>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-gray-300 font-modern font-semibold">{skill.name}</span>
                        <span className="text-interactive-neon font-futuristic font-bold">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-dark-border rounded-full h-3 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          transition={{ duration: 1.5, delay: skillIndex * 0.1 }}
                          className={`bg-gradient-to-r ${category.color} h-3 rounded-full relative`}
                          style={{
                            boxShadow: '0 0 10px rgba(99, 102, 241, 0.5)',
                          }}
                        >
                          <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                        </motion.div>
                      </div>
                    </div>
                  ))}
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
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-futuristic font-bold holographic-text mb-8">
              DEVELOPMENT.ARSENAL
            </h2>
          </motion.div>

          <div className="interactive-card">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {[
                'React', 'Three.js', 'TypeScript', 'WebGL', 'GSAP', 'Blender',
                'Next.js', 'Framer Motion', 'WebXR', 'GLSL', 'Canvas', 'WebAssembly'
              ].map((tool, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  whileHover={{ 
                    scale: 1.1, 
                    rotate: 10,
                    boxShadow: '0 0 20px rgba(99, 102, 241, 0.6)'
                  }}
                  className="bg-dark-card border border-interactive-primary/30 rounded-2xl p-4 text-center hover:border-interactive-neon transition-all duration-300"
                >
                  <span className="text-interactive-neon font-futuristic font-semibold">{tool}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Skills;
