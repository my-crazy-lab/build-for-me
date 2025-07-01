import React from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaMapMarkerAlt, FaGraduationCap, FaCertificate, FaStar } from 'react-icons/fa';

const Experience = () => {
  const experiences = [
    {
      company: 'Creative Digital Agency',
      role: 'Senior UI/UX Designer & Frontend Developer',
      duration: 'Jan 2022 - Present',
      location: 'San Francisco, CA',
      description: 'Leading design and development of innovative digital experiences for creative brands and startups.',
      achievements: [
        'Increased user engagement by 150% through redesigned user interfaces',
        'Led a team of 5 designers and developers on 20+ creative projects',
        'Implemented design system that reduced development time by 40%',
        'Won "Best Creative Website" award at Digital Design Awards 2023',
      ],
      color: 'from-creative-purple to-creative-pink',
    },
    {
      company: 'Startup Incubator',
      role: 'Creative Developer',
      duration: 'Jun 2020 - Dec 2021',
      location: 'Remote',
      description: 'Designed and developed creative web solutions for early-stage startups across various industries.',
      achievements: [
        'Built 15+ creative websites and mobile apps from concept to launch',
        'Collaborated with 30+ startups to establish their digital presence',
        'Mentored junior designers in creative development techniques',
        'Achieved 95% client satisfaction rate with creative deliverables',
      ],
      color: 'from-creative-orange to-creative-yellow',
    },
    {
      company: 'Design Studio',
      role: 'Junior Designer & Developer',
      duration: 'Aug 2019 - May 2020',
      location: 'Los Angeles, CA',
      description: 'Focused on creating beautiful user interfaces and learning advanced design and development techniques.',
      achievements: [
        'Designed UI/UX for 10+ client projects with creative focus',
        'Learned advanced animation and interaction design techniques',
        'Contributed to award-winning creative campaigns',
        'Developed proficiency in modern frontend frameworks',
      ],
      color: 'from-creative-green to-creative-blue',
    },
  ];

  const education = [
    {
      institution: 'Art Institute of California',
      degree: 'Bachelor of Fine Arts in Digital Design',
      duration: '2015 - 2019',
      gpa: '3.9/4.0',
      description: 'Focused on digital design, user experience, and creative technology. Graduated Summa Cum Laude.',
    },
  ];

  const certifications = [
    'Google UX Design Professional Certificate',
    'Adobe Certified Expert (ACE) - Creative Suite',
    'Figma Advanced Certification',
    'React Developer Certification',
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
              Creative Journey
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              My professional journey through the world of creative design and development, 
              building beautiful experiences and growing as a creative professional.
            </p>
          </motion.div>

          {/* Experience Timeline */}
          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="creative-card"
              >
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-6">
                  <div className="flex items-center gap-4 mb-4 lg:mb-0">
                    <div className={`w-16 h-16 bg-gradient-to-r ${exp.color} rounded-2xl flex items-center justify-center`}>
                      <FaStar className="text-white text-2xl" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-display font-bold text-gray-800">{exp.role}</h3>
                      <h4 className="text-xl text-creative-purple font-semibold">{exp.company}</h4>
                    </div>
                  </div>
                  <div className="flex flex-col lg:text-right text-gray-600">
                    <div className="flex items-center mb-1">
                      <FaCalendarAlt className="mr-2 text-creative-purple" />
                      <span>{exp.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <FaMapMarkerAlt className="mr-2 text-creative-purple" />
                      <span>{exp.location}</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-6 leading-relaxed text-lg">{exp.description}</p>
                
                <div>
                  <h5 className="font-semibold text-gray-800 mb-4 font-display">Key Achievements:</h5>
                  <div className="grid md:grid-cols-2 gap-3">
                    {exp.achievements.map((achievement, achIndex) => (
                      <div key={achIndex} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-creative-purple rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-600">{achievement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Education & Certifications */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="creative-card"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-creative-purple to-creative-pink rounded-2xl flex items-center justify-center">
                  <FaGraduationCap className="text-white text-2xl" />
                </div>
                <h2 className="text-3xl font-display font-bold text-gray-800">Education</h2>
              </div>
              {education.map((edu, index) => (
                <div key={index}>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{edu.degree}</h3>
                  <h4 className="text-lg text-creative-purple font-semibold mb-2">{edu.institution}</h4>
                  <div className="flex items-center text-gray-600 mb-2">
                    <FaCalendarAlt className="mr-2 text-creative-purple" />
                    <span>{edu.duration}</span>
                  </div>
                  <div className="text-gray-600 mb-3">
                    <strong>GPA:</strong> {edu.gpa}
                  </div>
                  <p className="text-gray-600 leading-relaxed">{edu.description}</p>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="creative-card"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-creative-orange to-creative-yellow rounded-2xl flex items-center justify-center">
                  <FaCertificate className="text-white text-2xl" />
                </div>
                <h2 className="text-3xl font-display font-bold text-gray-800">Certifications</h2>
              </div>
              <div className="space-y-4">
                {certifications.map((cert, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-center p-4 bg-gradient-to-r from-creative-purple/5 to-creative-pink/5 rounded-2xl border border-creative-purple/10 hover:border-creative-purple/30 transition-all duration-300"
                  >
                    <FaCertificate className="text-creative-purple mr-4 text-xl" />
                    <span className="text-gray-800 font-medium">{cert}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Creative Philosophy */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="creative-card text-center"
          >
            <h2 className="text-4xl font-display font-bold gradient-text mb-8">
              My Creative Philosophy
            </h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                "Great design is not just about making things look beautiful—it's about creating 
                meaningful connections between people and technology. Every pixel, every interaction, 
                and every animation should serve a purpose and tell a story."
              </p>
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <div className="text-4xl mb-4">💡</div>
                  <h3 className="font-semibold text-gray-800 mb-2">Innovation</h3>
                  <p className="text-gray-600">Always pushing creative boundaries</p>
                </div>
                <div>
                  <div className="text-4xl mb-4">❤️</div>
                  <h3 className="font-semibold text-gray-800 mb-2">Empathy</h3>
                  <p className="text-gray-600">Understanding user needs deeply</p>
                </div>
                <div>
                  <div className="text-4xl mb-4">✨</div>
                  <h3 className="font-semibold text-gray-800 mb-2">Excellence</h3>
                  <p className="text-gray-600">Crafting every detail with care</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Experience;
