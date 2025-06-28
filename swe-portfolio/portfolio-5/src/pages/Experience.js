import React from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaMapMarkerAlt, FaGraduationCap, FaCertificate, FaAtom } from 'react-icons/fa';

const Experience = () => {
  const experiences = [
    {
      company: 'FUTURE.LABS',
      role: 'Senior 3D Frontend Developer',
      duration: 'Jan 2022 - Present',
      location: 'Remote / Metaverse',
      description: 'Leading development of next-generation web experiences using cutting-edge 3D technologies and interactive frameworks.',
      achievements: [
        'Built immersive 3D product configurators increasing conversion rates by 300%',
        'Developed WebXR experiences for virtual showrooms serving 100K+ users',
        'Optimized 3D rendering performance achieving 60fps on mobile devices',
        'Led team of 8 developers in advanced frontend technologies',
      ],
      color: 'from-interactive-primary to-interactive-secondary',
    },
    {
      company: 'INTERACTIVE.STUDIO',
      role: 'Creative Frontend Developer',
      duration: 'Jun 2020 - Dec 2021',
      location: 'San Francisco, CA',
      description: 'Specialized in creating award-winning interactive websites and digital experiences for creative agencies and tech startups.',
      achievements: [
        'Developed 25+ interactive websites with advanced animations and 3D elements',
        'Won "Best Interactive Experience" at Digital Design Awards 2021',
        'Implemented WebGL shaders and particle systems for brand campaigns',
        'Mentored junior developers in 3D web development techniques',
      ],
      color: 'from-interactive-secondary to-interactive-accent',
    },
    {
      company: 'TECH.STARTUP',
      role: 'Frontend Developer',
      duration: 'Aug 2019 - May 2020',
      location: 'Los Angeles, CA',
      description: 'Focused on building responsive web applications and learning advanced animation techniques for modern user interfaces.',
      achievements: [
        'Built React applications with complex animations and micro-interactions',
        'Learned Three.js and WebGL fundamentals through personal projects',
        'Contributed to open-source animation libraries',
        'Achieved 98% performance scores on all delivered applications',
      ],
      color: 'from-interactive-accent to-interactive-primary',
    },
  ];

  const education = [
    {
      institution: 'MIT - Massachusetts Institute of Technology',
      degree: 'Bachelor of Science in Computer Graphics',
      duration: '2015 - 2019',
      gpa: '3.9/4.0',
      description: 'Specialized in computer graphics, 3D rendering, and interactive media. Thesis on real-time ray tracing in web browsers.',
    },
  ];

  const certifications = [
    'Three.js Journey - Advanced Certification',
    'WebGL Fundamentals - Google Developers',
    'React Three Fiber Mastery',
    'Blender 3D Artist Certification',
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
              EXPERIENCE.LOG
            </h1>
            <p className="text-2xl text-interactive-accent max-w-4xl mx-auto font-modern">
              Professional journey through the evolution of interactive web development 
              and 3D graphics programming.
            </p>
          </motion.div>

          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="interactive-card"
              >
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-6">
                  <div className="flex items-center gap-4 mb-4 lg:mb-0">
                    <div className={`w-16 h-16 bg-gradient-to-r ${exp.color} rounded-2xl flex items-center justify-center animate-pulse-glow`}>
                      <FaAtom className="text-white text-2xl" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-futuristic font-bold holographic-text">{exp.role}</h3>
                      <h4 className="text-xl text-interactive-accent font-modern font-semibold">{exp.company}</h4>
                    </div>
                  </div>
                  <div className="flex flex-col lg:text-right text-gray-300 font-modern">
                    <div className="flex items-center mb-1">
                      <FaCalendarAlt className="mr-2 text-interactive-neon" />
                      <span>{exp.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <FaMapMarkerAlt className="mr-2 text-interactive-neon" />
                      <span>{exp.location}</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-300 mb-6 leading-relaxed text-lg font-modern">{exp.description}</p>
                
                <div>
                  <h5 className="font-semibold text-interactive-neon mb-4 font-futuristic">KEY.ACHIEVEMENTS:</h5>
                  <div className="grid md:grid-cols-2 gap-3">
                    {exp.achievements.map((achievement, achIndex) => (
                      <div key={achIndex} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-interactive-neon rounded-full mt-2 flex-shrink-0 animate-pulse"></div>
                        <span className="text-gray-300 font-modern">{achievement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="interactive-card"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-interactive-primary to-interactive-secondary rounded-2xl flex items-center justify-center animate-pulse-glow">
                  <FaGraduationCap className="text-white text-2xl" />
                </div>
                <h2 className="text-3xl font-futuristic font-bold holographic-text">EDUCATION.SYS</h2>
              </div>
              {education.map((edu, index) => (
                <div key={index}>
                  <h3 className="text-xl font-semibold text-interactive-neon mb-2 font-modern">{edu.degree}</h3>
                  <h4 className="text-lg text-interactive-accent font-semibold mb-2 font-futuristic">{edu.institution}</h4>
                  <div className="flex items-center text-gray-300 mb-2 font-modern">
                    <FaCalendarAlt className="mr-2 text-interactive-neon" />
                    <span>{edu.duration}</span>
                  </div>
                  <div className="text-gray-300 mb-3 font-modern">
                    <strong>GPA:</strong> {edu.gpa}
                  </div>
                  <p className="text-gray-300 leading-relaxed font-modern">{edu.description}</p>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="interactive-card"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-interactive-accent to-interactive-primary rounded-2xl flex items-center justify-center animate-pulse-glow">
                  <FaCertificate className="text-white text-2xl" />
                </div>
                <h2 className="text-3xl font-futuristic font-bold holographic-text">CERT.ARCHIVE</h2>
              </div>
              <div className="space-y-4">
                {certifications.map((cert, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 10 }}
                    className="flex items-center p-4 bg-dark-card rounded-2xl border border-interactive-primary/30 hover:border-interactive-neon transition-all duration-300"
                  >
                    <FaCertificate className="text-interactive-neon mr-4 text-xl" />
                    <span className="text-gray-300 font-medium font-modern">{cert}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Experience;
