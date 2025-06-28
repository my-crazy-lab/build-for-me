import React from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaMapMarkerAlt, FaGraduationCap, FaCertificate } from 'react-icons/fa';

const Experience = () => {
  const experiences = [
    {
      company: 'CyberDefense Corp',
      role: 'Senior Security Engineer',
      duration: 'Jan 2022 - Present',
      location: 'Remote',
      description: 'Lead security assessments and penetration testing for enterprise clients.',
      achievements: [
        'Discovered 200+ critical vulnerabilities across client applications',
        'Led security team of 6 engineers in comprehensive security audits',
        'Developed automated security testing framework reducing assessment time by 50%',
      ],
    },
    {
      company: 'SecureTech Solutions',
      role: 'Cybersecurity Analyst',
      duration: 'Jun 2020 - Dec 2021',
      location: 'San Francisco, CA',
      description: 'Conducted vulnerability assessments and security code reviews.',
      achievements: [
        'Performed security assessments for 50+ web applications',
        'Implemented secure coding practices reducing vulnerabilities by 70%',
        'Mentored junior security analysts in ethical hacking techniques',
      ],
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
              <span className="neon-text">Experience.Log</span>
            </h1>
          </motion.div>

          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="terminal-window"
              >
                <div className="terminal-header">
                  <div className="terminal-dot bg-red-500"></div>
                  <div className="terminal-dot bg-yellow-500"></div>
                  <div className="terminal-dot bg-green-500"></div>
                  <span className="text-xs font-mono ml-2">{exp.company.toLowerCase().replace(/\s+/g, '_')}.log</span>
                </div>
                <div className="terminal-content">
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold font-mono neon-text mb-2">{exp.role}</h3>
                      <h4 className="text-xl text-neon-blue font-mono mb-2">{exp.company}</h4>
                    </div>
                    <div className="flex flex-col lg:text-right text-cyber-text font-mono text-sm">
                      <div className="flex items-center mb-1">
                        <FaCalendarAlt className="mr-2 text-neon-green" />
                        <span>{exp.duration}</span>
                      </div>
                      <div className="flex items-center">
                        <FaMapMarkerAlt className="mr-2 text-neon-green" />
                        <span>{exp.location}</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-cyber-text mb-4 leading-relaxed">{exp.description}</p>
                  
                  <div>
                    <p className="text-neon-green font-mono text-sm mb-2">$ cat achievements.txt</p>
                    <ul className="list-none space-y-1 text-cyber-text text-sm">
                      {exp.achievements.map((achievement, achIndex) => (
                        <li key={achIndex} className="flex items-start">
                          <span className="text-neon-blue mr-2">></span>
                          {achievement}
                        </li>
                      ))}
                    </ul>
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

export default Experience;
