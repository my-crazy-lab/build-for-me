import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Zap, Shield, ArrowRight, Mail, Phone, Github, Twitter, Linkedin, Star } from 'lucide-react'

function App() {
  const [email, setEmail] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Email submitted:', email)
    setEmail('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-20 left-1/3 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, 120, 0],
            y: [0, -80, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Navigation */}
      <motion.nav 
        className="glass backdrop-blur-md border-white/10 relative z-10"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles className="text-white" size={28} />
              <span className="text-xl font-bold text-white">GlassApp</span>
            </motion.div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-white/80 hover:text-white transition-colors">Home</a>
              <a href="#features" className="text-white/80 hover:text-white transition-colors">Features</a>
              <a href="#pricing" className="text-white/80 hover:text-white transition-colors">Pricing</a>
              <motion.a 
                href="#contact" 
                className="text-white/80 hover:text-white transition-colors"
                whileHover={{ scale: 1.1 }}
              >
                Contact
              </motion.a>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="py-20 px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1 
            className="text-6xl md:text-8xl font-bold text-white mb-8 leading-tight"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            Beautiful.
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Transparent.
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Experience the future of design with glassmorphism. Clean, elegant, and impossibly smooth.
          </motion.p>
          
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.button 
              className="glass text-white px-12 py-4 rounded-2xl text-lg font-semibold hover:bg-white/20 transition-all inline-flex items-center gap-3 group"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Experience
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Floating Glass Cards */}
      <section id="features" className="py-16 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">Ethereal Features</h2>
            <p className="text-xl text-white/70">Floating in perfect harmony</p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: "Lightning Fast", desc: "Blazing performance with zero compromise on beauty." },
              { icon: Shield, title: "Ultra Secure", desc: "Military-grade security wrapped in elegant design." },
              { icon: Sparkles, title: "Magical UX", desc: "Every interaction feels like pure magic." }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="glass rounded-3xl p-8 text-white hover:bg-white/15 transition-all group"
                initial={{ y: 100, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <motion.div 
                  className="bg-gradient-to-r from-purple-500 to-blue-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <feature.icon size={28} />
                </motion.div>
                <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-white/80 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Glass Panel */}
      <section id="pricing" className="py-20 px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">Transparent Pricing</h2>
            <p className="text-xl text-white/70">No hidden layers, just pure value</p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div 
              className="glass rounded-3xl p-8 text-white"
              initial={{ x: -100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <h3 className="text-2xl font-semibold mb-4">Starter</h3>
              <div className="text-5xl font-bold mb-6">Free</div>
              <ul className="space-y-3 mb-8 text-white/80">
                <li className="flex items-center gap-3">
                  <Star className="text-yellow-400" size={20} />
                  <span>Basic glass effects</span>
                </li>
                <li className="flex items-center gap-3">
                  <Star className="text-yellow-400" size={20} />
                  <span>Community support</span>
                </li>
                <li className="flex items-center gap-3">
                  <Star className="text-yellow-400" size={20} />
                  <span>Standard animations</span>
                </li>
              </ul>
              <motion.button 
                className="w-full glass border border-white/30 text-white py-3 rounded-xl hover:bg-white/20 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Get Started
              </motion.button>
            </motion.div>
            
            <motion.div 
              className="glass rounded-3xl p-8 text-white relative overflow-hidden"
              initial={{ x: 100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2 rounded-full text-sm font-semibold">
                Popular
              </div>
              <h3 className="text-2xl font-semibold mb-4 mt-4">Pro</h3>
              <div className="text-5xl font-bold mb-6">
                $29<span className="text-lg text-white/60">/month</span>
              </div>
              <ul className="space-y-3 mb-8 text-white/80">
                <li className="flex items-center gap-3">
                  <Star className="text-yellow-400" size={20} />
                  <span>Advanced glass effects</span>
                </li>
                <li className="flex items-center gap-3">
                  <Star className="text-yellow-400" size={20} />
                  <span>Priority support</span>
                </li>
                <li className="flex items-center gap-3">
                  <Star className="text-yellow-400" size={20} />
                  <span>Custom animations</span>
                </li>
                <li className="flex items-center gap-3">
                  <Star className="text-yellow-400" size={20} />
                  <span>Advanced blur effects</span>
                </li>
              </ul>
              <motion.button 
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Start Free Trial
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Glass Form */}
      <section id="contact" className="py-16 px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-white mb-6">Let's Connect</h2>
              <p className="text-white/80 mb-8 leading-relaxed">
                Ready to experience the future? Reach out and let's create something beautiful together.
              </p>
              <div className="space-y-4">
                <motion.div 
                  className="flex items-center gap-3 text-white/80"
                  whileHover={{ x: 10 }}
                >
                  <Mail className="text-purple-400" size={20} />
                  <span>hello@glassapp.com</span>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-3 text-white/80"
                  whileHover={{ x: 10 }}
                >
                  <Phone className="text-purple-400" size={20} />
                  <span>+1 (555) 123-4567</span>
                </motion.div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="glass rounded-3xl p-8">
                <h3 className="text-2xl font-semibold text-white mb-6">Stay in the Loop</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <motion.input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 glass rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                    required
                    whileFocus={{ scale: 1.02 }}
                  />
                  <motion.button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all font-semibold"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Subscribe
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="glass border-t border-white/10 py-12 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <motion.div 
              className="flex items-center gap-2 mb-4 md:mb-0"
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles className="text-white" size={28} />
              <span className="text-xl font-bold text-white">GlassApp</span>
            </motion.div>
            <div className="flex items-center gap-6">
              {[Github, Twitter, Linkedin].map((Icon, index) => (
                <motion.a 
                  key={index}
                  href="#" 
                  className="text-white/60 hover:text-white transition-colors"
                  whileHover={{ scale: 1.2, y: -2 }}
                >
                  <Icon size={20} />
                </motion.a>
              ))}
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/10 text-center text-white/60">
            © 2024 GlassApp. Crafted with transparency.
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
