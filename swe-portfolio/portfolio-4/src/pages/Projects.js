import React from 'react';
import { motion } from 'framer-motion';
import { FaExternalLinkAlt, FaGithub, FaBuilding, FaCloud, FaShieldAlt } from 'react-icons/fa';

const Projects = () => {
  const projects = [
    {
      title: 'Enterprise Digital Transformation Platform',
      description: 'Led the architecture and development of a comprehensive digital transformation platform serving 500,000+ users across multiple business units.',
      technologies: ['Java', 'Spring Boot', 'React', 'PostgreSQL', 'AWS', 'Kubernetes'],
      role: 'Chief Architect & Technical Lead - Designed the entire system architecture, led a team of 25 engineers, and delivered the project 20% under budget.',
      metrics: '$15M revenue increase, 40% operational efficiency improvement',
      liveUrl: 'https://enterprise-platform-demo.com',
      githubUrl: 'https://github.com/robert/enterprise-platform',
      image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=400&fit=crop',
      icon: FaBuilding,
    },
    {
      title: 'Cloud Infrastructure Modernization',
      description: 'Spearheaded the migration of legacy systems to cloud-native architecture, reducing operational costs by 60% while improving scalability.',
      technologies: ['AWS', 'Docker', 'Terraform', 'Python', 'Node.js', 'MongoDB'],
      role: 'Solutions Architect - Designed cloud migration strategy, implemented DevOps practices, and managed the transition for 50+ applications.',
      metrics: '$2M annual cost savings, 99.9% uptime achievement',
      liveUrl: 'https://cloud-migration-case-study.com',
      githubUrl: 'https://github.com/robert/cloud-modernization',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop',
      icon: FaCloud,
    },
    {
      title: 'Enterprise Security Framework',
      description: 'Developed a comprehensive security framework and compliance system for financial services, ensuring SOX and PCI DSS compliance.',
      technologies: ['C#', '.NET Core', 'Azure', 'SQL Server', 'Redis', 'OAuth'],
      role: 'Security Architect - Designed security protocols, implemented compliance measures, and established security best practices across the organization.',
      metrics: '100% compliance achievement, 0 security incidents',
      githubUrl: 'https://github.com/robert/security-framework',
      image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop',
      icon: FaShieldAlt,
    },
  ];

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
              Enterprise Portfolio
            </h1>
            <div className="divider"></div>
            <p className="text-xl text-corporate-gray max-w-4xl mx-auto mt-6">
              Strategic technology initiatives that have driven significant business value 
              and operational excellence across Fortune 500 organizations.
            </p>
          </motion.div>

          <div className="space-y-16">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="corporate-card"
              >
                <div className={`grid lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
                }`}>
                  <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                    <img
                      src={project.image}
                      alt={project.title}
                      className="rounded-lg w-full h-64 object-cover shadow-lg"
                    />
                  </div>
                  
                  <div className={index % 2 === 1 ? 'lg:col-start-1' : ''}>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-corporate-navy rounded-lg flex items-center justify-center">
                        <project.icon className="text-white text-2xl" />
                      </div>
                      <h3 className="text-3xl font-serif font-bold text-corporate-navy">
                        {project.title}
                      </h3>
                    </div>
                    
                    <p className="text-corporate-darkgray mb-6 leading-relaxed text-lg">
                      {project.description}
                    </p>
                    
                    <div className="mb-6">
                      <h4 className="font-semibold text-corporate-navy mb-3">Technologies & Platforms:</h4>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="px-3 py-1 bg-corporate-lightgray text-corporate-navy rounded text-sm font-medium border border-corporate-navy/20"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h4 className="font-semibold text-corporate-navy mb-3">Leadership Role:</h4>
                      <p className="text-corporate-darkgray leading-relaxed">
                        {project.role}
                      </p>
                    </div>

                    <div className="mb-8">
                      <h4 className="font-semibold text-corporate-navy mb-3">Business Impact:</h4>
                      <p className="text-corporate-gold font-semibold">
                        {project.metrics}
                      </p>
                    </div>
                    
                    <div className="flex gap-4">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-corporate"
                        >
                          <FaExternalLinkAlt />
                          View Case Study
                        </a>
                      )}
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-outline-corporate"
                      >
                        <FaGithub />
                        Technical Details
                      </a>
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
