import React from 'react';
import { motion } from 'framer-motion';

const Skills = () => {
  const skillCategories = [
    {
      title: 'Security Tools',
      skills: [
        { name: 'Burp Suite', level: 95 },
        { name: 'Metasploit', level: 90 },
        { name: 'Nmap', level: 95 },
        { name: 'Wireshark', level: 85 },
        { name: 'OWASP ZAP', level: 90 },
      ],
    },
    {
      title: 'Programming',
      skills: [
        { name: 'Python', level: 95 },
        { name: 'JavaScript', level: 90 },
        { name: 'Bash/Shell', level: 90 },
        { name: 'C/C++', level: 80 },
        { name: 'Go', level: 75 },
      ],
    },
    {
      title: 'Web Technologies',
      skills: [
        { name: 'React', level: 90 },
        { name: 'Node.js', level: 85 },
        { name: 'Express.js', level: 85 },
        { name: 'MongoDB', level: 80 },
        { name: 'PostgreSQL', level: 85 },
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
              <span className="neon-text">Skills.Matrix</span>
            </h1>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {skillCategories.map((category, categoryIndex) => (
              <motion.div
                key={categoryIndex}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: categoryIndex * 0.1 }}
                className="terminal-window"
              >
                <div className="terminal-header">
                  <div className="terminal-dot bg-red-500"></div>
                  <div className="terminal-dot bg-yellow-500"></div>
                  <div className="terminal-dot bg-green-500"></div>
                  <span className="text-xs font-mono ml-2">{category.title.toLowerCase()}.sh</span>
                </div>
                <div className="terminal-content">
                  <h3 className="text-xl font-bold font-mono neon-text mb-6 text-center">
                    {category.title}
                  </h3>
                  
                  <div className="space-y-4">
                    {category.skills.map((skill, skillIndex) => (
                      <div key={skillIndex}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-cyber-text font-mono">{skill.name}</span>
                          <span className="text-neon-blue font-mono">{skill.level}%</span>
                        </div>
                        <div className="w-full bg-cyber-border rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.level}%` }}
                            transition={{ duration: 1, delay: skillIndex * 0.1 }}
                            className="bg-gradient-to-r from-neon-blue to-neon-green h-2 rounded-full"
                            style={{
                              boxShadow: '0 0 10px rgba(0, 212, 255, 0.5)',
                            }}
                          />
                        </div>
                      </div>
                    ))}
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

export default Skills;
