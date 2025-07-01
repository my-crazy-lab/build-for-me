import React from 'react';
import { motion } from 'framer-motion';

const Skills = () => {
  const skillCategories = [
    {
      title: 'Design Tools',
      skills: [
        { name: 'Figma', level: 95 },
        { name: 'Adobe Creative Suite', level: 90 },
        { name: 'Sketch', level: 85 },
        { name: 'Framer', level: 80 },
        { name: 'Principle', level: 75 },
      ],
      color: 'from-creative-purple to-creative-pink',
    },
    {
      title: 'Frontend Development',
      skills: [
        { name: 'React', level: 95 },
        { name: 'Vue.js', level: 90 },
        { name: 'JavaScript/TypeScript', level: 90 },
        { name: 'HTML/CSS', level: 95 },
        { name: 'Tailwind CSS', level: 90 },
      ],
      color: 'from-creative-orange to-creative-yellow',
    },
    {
      title: 'Animation & Motion',
      skills: [
        { name: 'Framer Motion', level: 90 },
        { name: 'GSAP', level: 85 },
        { name: 'Lottie', level: 80 },
        { name: 'CSS Animations', level: 95 },
        { name: 'After Effects', level: 75 },
      ],
      color: 'from-creative-green to-creative-blue',
    },
    {
      title: 'Creative Skills',
      skills: [
        { name: 'UI/UX Design', level: 95 },
        { name: 'Prototyping', level: 90 },
        { name: 'Brand Design', level: 85 },
        { name: 'Illustration', level: 80 },
        { name: 'Color Theory', level: 90 },
      ],
      color: 'from-creative-indigo to-creative-red',
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
              Creative Skills
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A blend of design expertise and technical skills that help me create 
              beautiful, functional, and engaging digital experiences.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {skillCategories.map((category, categoryIndex) => (
              <motion.div
                key={categoryIndex}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: categoryIndex * 0.1 }}
                className="creative-card"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-2xl`}></div>
                  <h3 className="text-2xl font-display font-bold text-gray-800">
                    {category.title}
                  </h3>
                </div>
                
                <div className="space-y-6">
                  {category.skills.map((skill, skillIndex) => (
                    <div key={skillIndex}>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-gray-700 font-semibold">{skill.name}</span>
                        <span className="text-creative-purple font-bold">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          transition={{ duration: 1.5, delay: skillIndex * 0.1 }}
                          className={`bg-gradient-to-r ${category.color} h-3 rounded-full relative overflow-hidden`}
                        >
                          <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
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

      {/* Creative Process */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-display font-bold gradient-text mb-6">
              My Creative Process
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Discover',
                description: 'Understanding user needs and project goals through research and empathy.',
                color: 'from-creative-purple to-creative-pink',
              },
              {
                step: '02',
                title: 'Design',
                description: 'Creating wireframes, prototypes, and visual designs that solve problems beautifully.',
                color: 'from-creative-orange to-creative-yellow',
              },
              {
                step: '03',
                title: 'Develop',
                description: 'Bringing designs to life with clean code and smooth animations.',
                color: 'from-creative-green to-creative-blue',
              },
              {
                step: '04',
                title: 'Deliver',
                description: 'Testing, refining, and launching polished experiences that delight users.',
                color: 'from-creative-indigo to-creative-red',
              },
            ].map((process, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                whileHover={{ scale: 1.05 }}
                className="creative-card text-center group"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${process.color} rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl group-hover:animate-bounce-slow`}>
                  {process.step}
                </div>
                <h3 className="text-xl font-display font-bold text-gray-800 mb-4">{process.title}</h3>
                <p className="text-gray-600 leading-relaxed">{process.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools & Technologies */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="creative-card text-center"
          >
            <h2 className="text-3xl font-display font-bold gradient-text mb-8">
              Favorite Tools & Technologies
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {[
                'React', 'Figma', 'Tailwind', 'Framer Motion', 'Vue.js', 'Adobe XD',
                'GSAP', 'TypeScript', 'Sketch', 'Lottie', 'Next.js', 'Principle'
              ].map((tool, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="bg-gradient-to-r from-creative-purple/10 to-creative-pink/10 rounded-2xl p-4 border border-creative-purple/20 hover:border-creative-purple/40 transition-all duration-300"
                >
                  <span className="text-creative-purple font-semibold">{tool}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Skills;
