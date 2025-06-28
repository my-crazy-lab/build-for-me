import React from 'react';
import { motion } from 'framer-motion';

const Skills = () => {
  const skillCategories = [
    {
      title: 'Programming Languages',
      skills: [
        { name: 'JavaScript', level: 95 },
        { name: 'Python', level: 90 },
        { name: 'TypeScript', level: 85 },
        { name: 'Java', level: 80 },
        { name: 'C++', level: 75 },
      ],
    },
    {
      title: 'Frontend Technologies',
      skills: [
        { name: 'React', level: 95 },
        { name: 'HTML/CSS', level: 95 },
        { name: 'Tailwind CSS', level: 90 },
        { name: 'Vue.js', level: 80 },
        { name: 'Angular', level: 75 },
      ],
    },
    {
      title: 'Backend Technologies',
      skills: [
        { name: 'Node.js', level: 90 },
        { name: 'Express.js', level: 90 },
        { name: 'Django', level: 85 },
        { name: 'FastAPI', level: 80 },
        { name: 'Spring Boot', level: 75 },
      ],
    },
    {
      title: 'Databases',
      skills: [
        { name: 'PostgreSQL', level: 90 },
        { name: 'MongoDB', level: 85 },
        { name: 'MySQL', level: 85 },
        { name: 'Redis', level: 80 },
        { name: 'SQLite', level: 80 },
      ],
    },
    {
      title: 'Tools & Platforms',
      skills: [
        { name: 'Git', level: 95 },
        { name: 'Docker', level: 85 },
        { name: 'AWS', level: 80 },
        { name: 'Postman', level: 90 },
        { name: 'Figma', level: 75 },
      ],
    },
    {
      title: 'DevOps & Cloud',
      skills: [
        { name: 'CI/CD', level: 80 },
        { name: 'GitHub Actions', level: 85 },
        { name: 'Vercel', level: 90 },
        { name: 'Netlify', level: 85 },
        { name: 'Heroku', level: 80 },
      ],
    },
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-gray-50 to-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Skills & Technologies
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Here's an overview of my technical skills and proficiency levels 
              across various programming languages, frameworks, and tools.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {skillCategories.map((category, categoryIndex) => (
              <motion.div
                key={categoryIndex}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: categoryIndex * 0.1 }}
                className="bg-white rounded-lg shadow-lg p-6 border border-gray-200"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
                  {category.title}
                </h3>
                
                <div className="space-y-4">
                  {category.skills.map((skill, skillIndex) => (
                    <div key={skillIndex}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-700 font-medium">{skill.name}</span>
                        <span className="text-primary-600 font-semibold">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          transition={{ duration: 1, delay: skillIndex * 0.1 }}
                          className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full"
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

      {/* Additional Skills */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Additional Competencies
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              'Agile/Scrum',
              'Test-Driven Development',
              'RESTful APIs',
              'GraphQL',
              'Microservices',
              'Responsive Design',
              'Performance Optimization',
              'Code Review',
              'Technical Documentation',
              'Problem Solving',
              'Team Leadership',
              'Mentoring',
            ].map((skill, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-4 text-center border border-primary-200 hover:shadow-md transition-shadow duration-300"
              >
                <span className="text-primary-700 font-medium">{skill}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Skills;
