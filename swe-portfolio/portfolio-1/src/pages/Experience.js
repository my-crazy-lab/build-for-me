import React from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaMapMarkerAlt, FaGraduationCap, FaCertificate } from 'react-icons/fa';

const Experience = () => {
  const experiences = [
    {
      company: 'TechCorp Solutions',
      role: 'Senior Full-Stack Developer',
      duration: 'Jan 2022 - Present',
      location: 'San Francisco, CA',
      description: 'Lead development of scalable web applications using React and Node.js. Mentor junior developers and collaborate with cross-functional teams.',
      achievements: [
        'Reduced application load time by 40% through code optimization and lazy loading',
        'Led a team of 4 developers in building a customer portal serving 10,000+ users',
        'Implemented CI/CD pipeline reducing deployment time by 60%',
        'Architected microservices infrastructure handling 1M+ requests daily',
      ],
    },
    {
      company: 'StartupXYZ',
      role: 'Full-Stack Developer',
      duration: 'Jun 2020 - Dec 2021',
      location: 'Remote',
      description: 'Developed and maintained multiple web applications for various clients. Worked closely with designers and product managers to deliver high-quality solutions.',
      achievements: [
        'Built 5+ client projects from concept to deployment',
        'Improved code quality by implementing automated testing (95% coverage)',
        'Collaborated with UI/UX team to create responsive designs',
        'Integrated third-party APIs and payment systems',
      ],
    },
    {
      company: 'WebDev Agency',
      role: 'Junior Frontend Developer',
      duration: 'Aug 2019 - May 2020',
      location: 'New York, NY',
      description: 'Focused on frontend development using React and modern JavaScript. Contributed to various client projects and learned best practices in web development.',
      achievements: [
        'Developed responsive websites for 10+ clients',
        'Learned and implemented modern frontend frameworks',
        'Collaborated with senior developers on complex projects',
        'Improved website performance and accessibility scores',
      ],
    },
  ];

  const education = [
    {
      institution: 'University of California, Berkeley',
      degree: 'Bachelor of Science in Computer Science',
      duration: '2015 - 2019',
      gpa: '3.8/4.0',
      description: 'Focused on software engineering, algorithms, and data structures. Participated in hackathons and coding competitions.',
    },
  ];

  const certifications = [
    'AWS Certified Developer - Associate',
    'Google Cloud Professional Developer',
    'MongoDB Certified Developer',
    'Scrum Master Certification',
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
              Experience & Education
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              My professional journey and educational background that shaped my expertise 
              in software development and engineering.
            </p>
          </motion.div>

          {/* Experience Timeline */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Professional Experience</h2>
            <div className="space-y-8">
              {experiences.map((exp, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-primary-600"
                >
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{exp.role}</h3>
                      <h4 className="text-xl text-primary-600 font-semibold mb-2">{exp.company}</h4>
                    </div>
                    <div className="flex flex-col lg:text-right text-gray-600">
                      <div className="flex items-center mb-1">
                        <FaCalendarAlt className="mr-2" />
                        <span>{exp.duration}</span>
                      </div>
                      <div className="flex items-center">
                        <FaMapMarkerAlt className="mr-2" />
                        <span>{exp.location}</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">{exp.description}</p>
                  
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">Key Achievements:</h5>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      {exp.achievements.map((achievement, achIndex) => (
                        <li key={achIndex}>{achievement}</li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="grid lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <FaGraduationCap className="mr-3 text-primary-600" />
                Education
              </h2>
              {education.map((edu, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{edu.degree}</h3>
                  <h4 className="text-lg text-primary-600 font-semibold mb-2">{edu.institution}</h4>
                  <div className="flex items-center text-gray-600 mb-2">
                    <FaCalendarAlt className="mr-2" />
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
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <FaCertificate className="mr-3 text-primary-600" />
                Certifications
              </h2>
              <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
                <div className="space-y-3">
                  {certifications.map((cert, index) => (
                    <div
                      key={index}
                      className="flex items-center p-3 bg-primary-50 rounded-lg border border-primary-200"
                    >
                      <FaCertificate className="text-primary-600 mr-3" />
                      <span className="text-gray-800 font-medium">{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Experience;
