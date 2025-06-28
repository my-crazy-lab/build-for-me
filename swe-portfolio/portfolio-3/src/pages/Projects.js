import React from 'react';
import { motion } from 'framer-motion';
import { FaExternalLinkAlt, FaGithub, FaPalette, FaMobile, FaShoppingCart } from 'react-icons/fa';

const Projects = () => {
  const projects = [
    {
      title: 'Creative Portfolio Platform',
      description: 'A vibrant portfolio platform for creative professionals with interactive galleries, smooth animations, and customizable themes.',
      technologies: ['React', 'Framer Motion', 'Tailwind CSS', 'Node.js', 'MongoDB'],
      role: 'UI/UX Designer & Frontend Developer - Designed the entire user experience and implemented all frontend interactions.',
      liveUrl: 'https://creative-portfolio-demo.com',
      githubUrl: 'https://github.com/maya/creative-portfolio',
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop',
      icon: FaPalette,
      color: 'from-creative-purple to-creative-pink',
    },
    {
      title: 'Mindful Mobile App',
      description: 'A meditation and wellness mobile app with beautiful animations, progress tracking, and personalized content recommendations.',
      technologies: ['React Native', 'Expo', 'Firebase', 'Lottie', 'Redux'],
      role: 'Lead Designer & Developer - Created the visual design system and developed the entire mobile application.',
      liveUrl: 'https://mindful-app-demo.com',
      githubUrl: 'https://github.com/maya/mindful-app',
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop',
      icon: FaMobile,
      color: 'from-creative-green to-creative-blue',
    },
    {
      title: 'Artisan Marketplace',
      description: 'An e-commerce platform for local artisans featuring beautiful product showcases, interactive shopping experiences, and artist profiles.',
      technologies: ['Vue.js', 'Nuxt.js', 'Stripe', 'Contentful', 'GSAP'],
      role: 'Creative Director & Frontend Lead - Designed the brand identity and led the frontend development team.',
      liveUrl: 'https://artisan-marketplace-demo.com',
      githubUrl: 'https://github.com/maya/artisan-marketplace',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop',
      icon: FaShoppingCart,
      color: 'from-creative-orange to-creative-yellow',
    },
  ];

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
              Creative Projects
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A showcase of my most exciting creative projects that blend beautiful design 
              with innovative technology to create memorable user experiences.
            </p>
          </motion.div>

          <div className="space-y-20">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="creative-card"
              >
                <div className={`grid lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
                }`}>
                  <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                    <div className="relative group">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="rounded-2xl w-full h-80 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </div>
                  
                  <div className={index % 2 === 1 ? 'lg:col-start-1' : ''}>
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`w-16 h-16 bg-gradient-to-r ${project.color} rounded-2xl flex items-center justify-center`}>
                        <project.icon className="text-white text-2xl" />
                      </div>
                      <h3 className="text-3xl font-display font-bold text-gray-800">
                        {project.title}
                      </h3>
                    </div>
                    
                    <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                      {project.description}
                    </p>
                    
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-800 mb-3 font-display">Technologies Used:</h4>
                      <div className="flex flex-wrap gap-3">
                        {project.technologies.map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="px-4 py-2 bg-gradient-to-r from-creative-purple/10 to-creative-pink/10 text-creative-purple border border-creative-purple/20 rounded-full text-sm font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-8">
                      <h4 className="font-semibold text-gray-800 mb-3 font-display">My Role:</h4>
                      <p className="text-gray-600 leading-relaxed">
                        {project.role}
                      </p>
                    </div>
                    
                    <div className="flex gap-4">
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-creative"
                      >
                        <FaExternalLinkAlt />
                        View Live
                      </a>
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-outline-creative"
                      >
                        <FaGithub />
                        View Code
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="creative-card text-center"
          >
            <h2 className="text-4xl font-display font-bold gradient-text mb-6">
              Let's Create Something Amazing Together!
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Have a creative project in mind? I'd love to help bring your vision to life 
              with beautiful design and innovative technology.
            </p>
            <motion.a
              href="/contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-creative text-xl px-8 py-4"
            >
              Start a Project
            </motion.a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Projects;
