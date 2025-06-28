import React from 'react';
import { motion } from 'framer-motion';
import { FaExternalLinkAlt, FaGithub, FaShieldAlt, FaBug, FaCode } from 'react-icons/fa';

const Projects = () => {
  const projects = [
    {
      title: 'VulnScanner Pro',
      description: 'Advanced vulnerability scanner with AI-powered threat detection and automated reporting capabilities.',
      technologies: ['Python', 'TensorFlow', 'Flask', 'PostgreSQL', 'Docker'],
      role: 'Lead Security Engineer - Designed the scanning engine, implemented ML algorithms for threat detection.',
      githubUrl: 'https://github.com/alexchen/vulnscanner-pro',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop',
      type: 'Security Tool',
      icon: FaShieldAlt,
    },
    {
      title: 'SecureChat Application',
      description: 'End-to-end encrypted messaging platform with advanced security features and penetration testing.',
      technologies: ['React', 'Node.js', 'WebRTC', 'MongoDB', 'Socket.io'],
      role: 'Full-Stack Security Developer - Built secure communication protocols and conducted security audits.',
      liveUrl: 'https://securechat-demo.com',
      githubUrl: 'https://github.com/alexchen/secure-chat',
      image: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=600&h=400&fit=crop',
      type: 'Web Application',
      icon: FaCode,
    },
    {
      title: 'Bug Bounty Automation',
      description: 'Automated bug bounty hunting platform with reconnaissance tools and vulnerability assessment.',
      technologies: ['Python', 'Bash', 'Docker', 'Redis', 'Elasticsearch'],
      role: 'Security Researcher - Developed automation scripts and vulnerability detection algorithms.',
      githubUrl: 'https://github.com/alexchen/bug-bounty-automation',
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&h=400&fit=crop',
      type: 'Security Framework',
      icon: FaBug,
    },
  ];

  return (
    <div className="min-h-screen pt-20 relative">
      <section className="section-padding matrix-bg">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl lg:text-5xl font-bold font-mono mb-6">
              <span className="neon-text">Projects.Repository</span>
            </h1>
            <p className="text-xl text-cyber-text max-w-3xl mx-auto">
              Security tools, applications, and research projects that demonstrate 
              my expertise in cybersecurity and secure development.
            </p>
          </motion.div>

          <div className="space-y-12">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="terminal-window"
              >
                <div className="terminal-header">
                  <div className="terminal-dot bg-red-500"></div>
                  <div className="terminal-dot bg-yellow-500"></div>
                  <div className="terminal-dot bg-green-500"></div>
                  <span className="text-xs font-mono ml-2">{project.title.toLowerCase().replace(/\s+/g, '_')}.sh</span>
                </div>
                <div className="terminal-content">
                  <div className="grid lg:grid-cols-2 gap-8 items-center">
                    <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                      <img
                        src={project.image}
                        alt={project.title}
                        className="rounded-lg w-full h-48 object-cover border border-cyber-border"
                      />
                    </div>
                    
                    <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                      <div className="flex items-center gap-3 mb-4">
                        <project.icon className="text-neon-blue text-2xl" />
                        <h3 className="text-2xl font-bold font-mono neon-text">
                          {project.title}
                        </h3>
                        <span className="px-2 py-1 bg-cyber-border text-xs font-mono rounded">
                          {project.type}
                        </span>
                      </div>
                      
                      <p className="text-cyber-text mb-4 leading-relaxed">
                        {project.description}
                      </p>
                      
                      <div className="mb-4">
                        <p className="text-neon-green mb-2 font-mono text-sm">$ cat technologies.txt</p>
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech, techIndex) => (
                            <span
                              key={techIndex}
                              className="px-3 py-1 bg-cyber-card border border-neon-blue text-neon-blue rounded text-sm font-mono"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <p className="text-neon-green mb-2 font-mono text-sm">$ cat role.txt</p>
                        <p className="text-cyber-text text-sm leading-relaxed">
                          {project.role}
                        </p>
                      </div>
                      
                      <div className="flex gap-4">
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-neon"
                          >
                            <FaExternalLinkAlt />
                            Live Demo
                          </a>
                        )}
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-ghost"
                        >
                          <FaGithub />
                          Source Code
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Projects;
