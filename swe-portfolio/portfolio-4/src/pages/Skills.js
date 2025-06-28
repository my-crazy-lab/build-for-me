import React from 'react';
import { motion } from 'framer-motion';

const Skills = () => {
  const skillCategories = [
    {
      title: 'Enterprise Architecture',
      skills: [
        { name: 'System Design', level: 95 },
        { name: 'Microservices', level: 90 },
        { name: 'API Design', level: 95 },
        { name: 'Database Architecture', level: 90 },
        { name: 'Security Architecture', level: 85 },
      ],
    },
    {
      title: 'Cloud & DevOps',
      skills: [
        { name: 'AWS/Azure', level: 90 },
        { name: 'Kubernetes', level: 85 },
        { name: 'Docker', level: 90 },
        { name: 'Terraform', level: 80 },
        { name: 'CI/CD', level: 85 },
      ],
    },
    {
      title: 'Programming Languages',
      skills: [
        { name: 'Java', level: 95 },
        { name: 'C#', level: 90 },
        { name: 'Python', level: 85 },
        { name: 'JavaScript/TypeScript', level: 80 },
        { name: 'SQL', level: 95 },
      ],
    },
    {
      title: 'Leadership & Strategy',
      skills: [
        { name: 'Team Leadership', level: 95 },
        { name: 'Strategic Planning', level: 90 },
        { name: 'Project Management', level: 90 },
        { name: 'Stakeholder Management', level: 95 },
        { name: 'Budget Management', level: 85 },
      ],
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
              Executive Competencies
            </h1>
            <div className="divider"></div>
            <p className="text-xl text-corporate-gray max-w-4xl mx-auto mt-6">
              A comprehensive skill set spanning technical architecture, leadership, 
              and strategic business execution developed through 10+ years of enterprise experience.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {skillCategories.map((category, categoryIndex) => (
              <motion.div
                key={categoryIndex}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: categoryIndex * 0.1 }}
                className="corporate-card"
              >
                <h3 className="text-2xl font-serif font-bold text-corporate-navy mb-8 text-center">
                  {category.title}
                </h3>
                
                <div className="space-y-6">
                  {category.skills.map((skill, skillIndex) => (
                    <div key={skillIndex}>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-corporate-darkgray font-semibold">{skill.name}</span>
                        <span className="text-corporate-navy font-bold">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          transition={{ duration: 1.2, delay: skillIndex * 0.1 }}
                          className="bg-corporate-navy h-2 rounded"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-corporate-lightgray">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-serif font-bold professional-heading mb-6">
              Industry Expertise
            </h2>
            <div className="divider"></div>
          </motion.div>

          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              'Financial Services', 'Healthcare', 'E-commerce', 'Manufacturing',
              'Government', 'Education', 'Telecommunications', 'Energy',
              'Retail', 'Insurance', 'Real Estate', 'Transportation'
            ].map((industry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="corporate-card text-center py-6"
              >
                <span className="text-corporate-navy font-semibold">{industry}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Skills;
