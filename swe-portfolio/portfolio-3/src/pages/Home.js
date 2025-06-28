import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaRocket, FaHeart, FaCode, FaPalette, FaMagic, FaStar } from 'react-icons/fa';

const Home = () => {
  return (
    <div className="min-h-screen pt-20 relative">
      {/* Hero Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <motion.h1 
                className="text-6xl lg:text-7xl font-display font-bold mb-6"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Hi, I'm{' '}
                <span className="gradient-text">Maya</span>
                <motion.span
                  animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  className="inline-block ml-2"
                >
                  👋
                </motion.span>
              </motion.h1>
              
              <motion.h2 
                className="text-2xl lg:text-3xl text-gray-700 mb-6 font-display"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Creative Developer & UI/UX Designer
              </motion.h2>
              
              <motion.p 
                className="text-lg text-gray-600 mb-8 leading-relaxed max-w-lg"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                I craft beautiful, interactive experiences that bring ideas to life. 
                Passionate about creating delightful user interfaces and solving 
                complex problems with creative solutions.
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 mb-8"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <Link to="/projects" className="btn-creative">
                  <FaRocket />
                  View My Work
                </Link>
                <Link to="/contact" className="btn-outline-creative">
                  <FaHeart />
                  Let's Collaborate
                </Link>
              </motion.div>
              
              <motion.div 
                className="flex justify-center lg:justify-start space-x-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1 }}
              >
                {[
                  { icon: FaCode, color: 'text-creative-purple' },
                  { icon: FaPalette, color: 'text-creative-pink' },
                  { icon: FaMagic, color: 'text-creative-orange' },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    className={`text-3xl ${item.color} cursor-pointer`}
                  >
                    <item.icon />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex justify-center"
            >
              <div className="relative">
                <motion.div 
                  className="w-80 h-80 rounded-full bg-gradient-to-br from-creative-purple via-creative-pink to-creative-orange p-2"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                    <img
                      src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face"
                      alt="Maya Rodriguez"
                      className="w-72 h-72 rounded-full object-cover"
                    />
                  </div>
                </motion.div>
                
                {/* Floating icons around the image */}
                <motion.div
                  className="absolute -top-4 -right-4 w-16 h-16 bg-creative-yellow rounded-full flex items-center justify-center text-white text-xl"
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <FaStar />
                </motion.div>
                <motion.div
                  className="absolute -bottom-4 -left-4 w-16 h-16 bg-creative-green rounded-full flex items-center justify-center text-white text-xl"
                  animate={{ y: [10, -10, 10] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                >
                  <FaHeart />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { number: '100+', label: 'Projects Created', color: 'from-creative-purple to-creative-pink' },
              { number: '50+', label: 'Happy Clients', color: 'from-creative-orange to-creative-yellow' },
              { number: '3+', label: 'Years Experience', color: 'from-creative-green to-creative-blue' },
              { number: '∞', label: 'Creative Ideas', color: 'from-creative-indigo to-creative-red' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="creative-card text-center"
              >
                <div className={`text-4xl lg:text-5xl font-bold font-display mb-2 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Quick Preview */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-display font-bold mb-6 gradient-text">
              What I Do Best
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Combining creativity with technology to build amazing digital experiences
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: FaCode,
                title: 'Frontend Development',
                description: 'Building responsive, interactive web applications with modern frameworks',
                color: 'from-creative-purple to-creative-pink',
              },
              {
                icon: FaPalette,
                title: 'UI/UX Design',
                description: 'Creating beautiful, user-centered designs that tell a story',
                color: 'from-creative-orange to-creative-yellow',
              },
              {
                icon: FaMagic,
                title: 'Creative Solutions',
                description: 'Turning complex problems into simple, elegant solutions',
                color: 'from-creative-green to-creative-blue',
              },
            ].map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                whileHover={{ scale: 1.05 }}
                className="creative-card text-center group"
              >
                <div className={`w-20 h-20 bg-gradient-to-r ${service.color} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <service.icon className="text-white text-3xl" />
                </div>
                <h3 className="text-2xl font-display font-semibold mb-4 text-gray-800">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
