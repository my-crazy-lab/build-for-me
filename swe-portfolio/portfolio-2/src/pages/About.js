import React from 'react';
import { motion } from 'framer-motion';
import { FaDownload, FaShieldAlt, FaCode, FaBrain, FaUsers } from 'react-icons/fa';

const About = () => {
  return (
    <div className="min-h-screen pt-20 relative">
      {/* Hero Section */}
      <section className="section-padding matrix-bg">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl lg:text-5xl font-bold font-mono mb-6">
              <span className="neon-text">About.exe</span>
            </h1>
            <p className="text-xl text-cyber-text max-w-3xl mx-auto">
              Cybersecurity engineer with a passion for ethical hacking and secure development. 
              Protecting digital assets through code and security research.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="terminal-window"
            >
              <div className="terminal-header">
                <div className="terminal-dot bg-red-500"></div>
                <div className="terminal-dot bg-yellow-500"></div>
                <div className="terminal-dot bg-green-500"></div>
                <span className="text-xs font-mono ml-2">bio.sh</span>
              </div>
              <div className="terminal-content">
                <p className="text-neon-green mb-2">$ cat personal_story.txt</p>
                <div className="text-sm leading-relaxed mb-4">
                  <p className="mb-4">
                    My journey into cybersecurity began during my Computer Science studies 
                    when I discovered the fascinating world of ethical hacking. What started 
                    as curiosity about system vulnerabilities evolved into a career dedicated 
                    to protecting digital infrastructure.
                  </p>
                  <p className="mb-4">
                    Over the past 4 years, I've specialized in penetration testing, 
                    vulnerability assessment, and secure application development. I believe 
                    in the principle of "security by design" and work to integrate security 
                    practices into every stage of the development lifecycle.
                  </p>
                  <p className="mb-4">
                    When I'm not hunting for vulnerabilities or building secure applications, 
                    I contribute to open-source security tools and share knowledge through 
                    technical blogs and security conferences.
                  </p>
                </div>
                <p className="text-neon-green mb-2">$ ./download_resume.sh</p>
                <a 
                  href="/resume.pdf" 
                  download 
                  className="btn-neon inline-flex items-center gap-2"
                >
                  <FaDownload />
                  Security_Resume.pdf
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="cyber-card">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&h=600&fit=crop&crop=face"
                  alt="Alex Chen"
                  className="rounded-lg w-full"
                />
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-neon-blue rounded-lg flex items-center justify-center animate-glow">
                  <FaShieldAlt className="text-cyber-bg text-3xl" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Competencies */}
      <section className="section-padding bg-cyber-card/30">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold font-mono mb-6">
              <span className="neon-text">Core.Competencies</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: FaShieldAlt,
                title: 'Security Engineering',
                description: 'Designing and implementing robust security architectures, threat modeling, and security code reviews.',
              },
              {
                icon: FaCode,
                title: 'Secure Development',
                description: 'Building applications with security-first mindset using secure coding practices and frameworks.',
              },
              {
                icon: FaBrain,
                title: 'Threat Analysis',
                description: 'Advanced threat hunting, vulnerability research, and security incident response capabilities.',
              },
              {
                icon: FaUsers,
                title: 'Team Leadership',
                description: 'Leading security teams, conducting training sessions, and mentoring junior security professionals.',
              },
            ].map((competency, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="cyber-card text-center"
              >
                <div className="w-16 h-16 bg-cyber-border rounded-full flex items-center justify-center mx-auto mb-4 border border-neon-blue">
                  <competency.icon className="text-neon-blue text-2xl" />
                </div>
                <h3 className="text-xl font-semibold font-mono text-neon-blue mb-4">{competency.title}</h3>
                <p className="text-cyber-text text-sm leading-relaxed">{competency.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Philosophy */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="terminal-window max-w-4xl mx-auto"
          >
            <div className="terminal-header">
              <div className="terminal-dot bg-red-500"></div>
              <div className="terminal-dot bg-yellow-500"></div>
              <div className="terminal-dot bg-green-500"></div>
              <span className="text-xs font-mono ml-2">philosophy.sh</span>
            </div>
            <div className="terminal-content">
              <p className="text-neon-green mb-2">$ cat security_philosophy.txt</p>
              <div className="space-y-4 text-sm">
                <div>
                  <span className="text-neon-blue">[PRINCIPLE_1]</span>
                  <span className="ml-2">Security is not a feature, it's a foundation</span>
                </div>
                <div>
                  <span className="text-neon-blue">[PRINCIPLE_2]</span>
                  <span className="ml-2">Assume breach, design for resilience</span>
                </div>
                <div>
                  <span className="text-neon-blue">[PRINCIPLE_3]</span>
                  <span className="ml-2">Continuous learning in an evolving threat landscape</span>
                </div>
                <div>
                  <span className="text-neon-blue">[PRINCIPLE_4]</span>
                  <span className="ml-2">Ethical hacking for the greater good</span>
                </div>
                <div>
                  <span className="text-neon-blue">[PRINCIPLE_5]</span>
                  <span className="ml-2">Knowledge sharing strengthens the community</span>
                </div>
              </div>
              <p className="text-neon-green mt-6 mb-2">$ echo "Mission Statement"</p>
              <p className="text-sm italic">
                "To build a more secure digital world through ethical hacking, 
                secure development practices, and knowledge sharing with the 
                cybersecurity community."
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
