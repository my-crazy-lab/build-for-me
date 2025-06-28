import React from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaMapMarkerAlt, FaGraduationCap, FaCertificate, FaBuilding } from 'react-icons/fa';

const Experience = () => {
  const experiences = [
    {
      company: 'Fortune 500 Technology Corporation',
      role: 'Chief Technology Architect',
      duration: 'Jan 2020 - Present',
      location: 'San Francisco, CA',
      description: 'Leading enterprise architecture and digital transformation initiatives across multiple business units.',
      achievements: [
        'Architected cloud-native platform serving 2M+ users with 99.9% uptime',
        'Led digital transformation saving $10M annually in operational costs',
        'Managed technology budget of $50M+ across 15 major initiatives',
        'Built and mentored engineering teams of 100+ professionals',
      ],
    },
    {
      company: 'Global Financial Services',
      role: 'Senior Software Architect',
      duration: 'Mar 2017 - Dec 2019',
      location: 'New York, NY',
      description: 'Designed and implemented mission-critical financial systems and regulatory compliance solutions.',
      achievements: [
        'Delivered SOX-compliant trading platform processing $1B+ daily volume',
        'Reduced system latency by 75% through architectural optimization',
        'Led team of 25 engineers in agile development practices',
        'Achieved 100% regulatory compliance across all delivered systems',
      ],
    },
    {
      company: 'Enterprise Software Solutions',
      role: 'Lead Software Engineer',
      duration: 'Jun 2014 - Feb 2017',
      location: 'Seattle, WA',
      description: 'Developed enterprise software solutions for healthcare and manufacturing industries.',
      achievements: [
        'Built healthcare management system used by 500+ hospitals',
        'Improved application performance by 200% through optimization',
        'Mentored 10+ junior developers in enterprise development practices',
        'Delivered 15+ major releases on time and within budget',
      ],
    },
  ];

  const education = [
    {
      institution: 'Stanford University',
      degree: 'Master of Science in Computer Science',
      duration: '2012 - 2014',
      gpa: '3.9/4.0',
      description: 'Specialized in distributed systems and software architecture. Thesis on scalable microservices patterns.',
    },
    {
      institution: 'University of California, Berkeley',
      degree: 'Bachelor of Science in Computer Engineering',
      duration: '2008 - 2012',
      gpa: '3.8/4.0',
      description: 'Graduated Magna Cum Laude. Focus on software engineering and system design.',
    },
  ];

  const certifications = [
    'AWS Certified Solutions Architect - Professional',
    'Microsoft Azure Solutions Architect Expert',
    'Certified Kubernetes Administrator (CKA)',
    'Project Management Professional (PMP)',
    'TOGAF 9 Certified Enterprise Architect',
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
              Executive Experience
            </h1>
            <div className="divider"></div>
            <p className="text-xl text-corporate-gray max-w-4xl mx-auto mt-6">
              A proven track record of technology leadership and enterprise solution delivery 
              across Fortune 500 organizations and high-growth companies.
            </p>
          </motion.div>

          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="corporate-card"
              >
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-6">
                  <div className="flex items-center gap-4 mb-4 lg:mb-0">
                    <div className="w-16 h-16 bg-corporate-navy rounded-lg flex items-center justify-center">
                      <FaBuilding className="text-white text-2xl" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-serif font-bold text-corporate-navy">{exp.role}</h3>
                      <h4 className="text-xl text-corporate-gold font-semibold">{exp.company}</h4>
                    </div>
                  </div>
                  <div className="flex flex-col lg:text-right text-corporate-gray">
                    <div className="flex items-center mb-1">
                      <FaCalendarAlt className="mr-2 text-corporate-gold" />
                      <span className="font-medium">{exp.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <FaMapMarkerAlt className="mr-2 text-corporate-gold" />
                      <span className="font-medium">{exp.location}</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-corporate-darkgray mb-6 leading-relaxed text-lg">{exp.description}</p>
                
                <div>
                  <h5 className="font-semibold text-corporate-navy mb-4">Key Achievements:</h5>
                  <div className="grid md:grid-cols-2 gap-4">
                    {exp.achievements.map((achievement, achIndex) => (
                      <div key={achIndex} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-corporate-gold rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-corporate-darkgray">{achievement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-corporate-lightgray">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="corporate-card"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-corporate-navy rounded-lg flex items-center justify-center">
                  <FaGraduationCap className="text-white text-2xl" />
                </div>
                <h2 className="text-3xl font-serif font-bold text-corporate-navy">Education</h2>
              </div>
              <div className="space-y-8">
                {education.map((edu, index) => (
                  <div key={index}>
                    <h3 className="text-xl font-semibold text-corporate-navy mb-2">{edu.degree}</h3>
                    <h4 className="text-lg text-corporate-gold font-semibold mb-2">{edu.institution}</h4>
                    <div className="flex items-center text-corporate-gray mb-2">
                      <FaCalendarAlt className="mr-2 text-corporate-gold" />
                      <span>{edu.duration}</span>
                    </div>
                    <div className="text-corporate-gray mb-3">
                      <strong>GPA:</strong> {edu.gpa}
                    </div>
                    <p className="text-corporate-darkgray leading-relaxed">{edu.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="corporate-card"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-corporate-gold rounded-lg flex items-center justify-center">
                  <FaCertificate className="text-white text-2xl" />
                </div>
                <h2 className="text-3xl font-serif font-bold text-corporate-navy">Certifications</h2>
              </div>
              <div className="space-y-4">
                {certifications.map((cert, index) => (
                  <div
                    key={index}
                    className="flex items-center p-4 bg-white rounded-lg border border-corporate-navy/10 hover:border-corporate-navy/30 transition-all duration-300"
                  >
                    <FaCertificate className="text-corporate-gold mr-4 text-xl" />
                    <span className="text-corporate-navy font-medium">{cert}</span>
                  </div>
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
