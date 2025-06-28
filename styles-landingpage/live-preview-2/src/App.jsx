import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, Zap, Gamepad2, Cpu, Wifi, Mail, Phone, Github, Twitter, Power, Target, Rocket } from 'lucide-react'

function App() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedLevel, setSelectedLevel] = useState(1)
  const [email, setEmail] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Email submitted:', email)
    setEmail('')
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Floating Neon Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-20 left-20 w-4 h-4 bg-neon-cyan rounded-full"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ boxShadow: '0 0 20px #00ffff' }}
        />
        <motion.div
          className="absolute top-40 right-32 w-6 h-6 bg-neon-pink rounded-full"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 0.5, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ boxShadow: '0 0 25px #ff10f0' }}
        />
        <motion.div
          className="absolute bottom-32 left-1/3 w-3 h-3 bg-neon-green rounded-full"
          animate={{
            x: [0, 120, 0],
            y: [0, -80, 0],
            scale: [1, 2, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ boxShadow: '0 0 15px #39ff14' }}
        />
      </div>

      {/* Navigation */}
      <motion.nav 
        className="relative z-50 bg-black/50 backdrop-blur-md border-b border-neon-cyan/30"
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
              <div className="w-8 h-8 bg-gradient-to-r from-neon-cyan to-neon-pink rounded-lg flex items-center justify-center animate-glow">
                <Gamepad2 className="text-white" size={20} />
              </div>
              <span className="text-xl font-bold text-glow">NEXUS GAME</span>
            </motion.div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#demo" className="text-neon-cyan hover:text-white transition-colors text-glow">DEMO</a>
              <a href="#features" className="text-neon-cyan hover:text-white transition-colors text-glow">FEATURES</a>
              <a href="#levels" className="text-neon-cyan hover:text-white transition-colors text-glow">LEVELS</a>
              <motion.button 
                className="bg-gradient-to-r from-neon-pink to-neon-cyan px-6 py-2 rounded-full font-bold hover:scale-105 transition-all neon-border"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                PLAY NOW
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="py-20 px-6 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h1 
            className="text-6xl md:text-8xl font-black mb-8 leading-tight"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <span className="bg-gradient-to-r from-neon-cyan via-neon-pink to-neon-green bg-clip-text text-transparent text-glow">
              ENTER THE
            </span>
            <br />
            <span className="text-white text-glow animate-glitch">
              NEXUS
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-neon-cyan mb-12 max-w-3xl mx-auto leading-relaxed"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Experience the future of interactive gaming. Real-time 3D environments, 
            immersive gameplay, and cutting-edge technology that pushes boundaries.
          </motion.p>
          
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.button 
              className="bg-gradient-to-r from-neon-pink to-neon-cyan text-black px-12 py-6 rounded-2xl text-2xl font-black hover:from-neon-cyan hover:to-neon-pink transition-all inline-flex items-center gap-4 group neon-border"
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              style={{ boxShadow: '0 0 30px rgba(0, 255, 255, 0.5)' }}
            >
              <Power size={32} />
              INITIALIZE DEMO
              <Rocket size={32} className="group-hover:translate-x-2 transition-transform" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Interactive 3D Demo */}
      <section id="demo" className="py-16 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-black text-neon-cyan mb-4 text-glow">LIVE DEMO ARENA</h2>
            <p className="text-xl text-white/80">Experience the power in real-time</p>
          </motion.div>
          
          {/* Demo Control Panel */}
          <motion.div 
            className="bg-black/80 backdrop-blur-md border border-neon-cyan/50 rounded-3xl p-8 mb-8 neon-border"
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <motion.button
                  onClick={togglePlay}
                  className="bg-gradient-to-r from-neon-green to-neon-cyan p-4 rounded-full hover:scale-110 transition-all"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  {isPlaying ? <Pause size={32} /> : <Play size={32} />}
                </motion.button>
                <div>
                  <div className="text-neon-cyan font-bold text-lg">DEMO STATUS</div>
                  <div className="text-white">
                    {isPlaying ? 'RUNNING...' : 'STANDBY'}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-neon-pink font-bold">FPS</div>
                  <div className="text-2xl font-black text-white">144</div>
                </div>
                <div className="text-center">
                  <div className="text-neon-green font-bold">PING</div>
                  <div className="text-2xl font-black text-white">12ms</div>
                </div>
              </div>
            </div>
            
            {/* 3D Demo Viewport */}
            <div className="bg-gradient-to-br from-neon-blue/20 to-purple-900/20 rounded-2xl p-8 border border-neon-cyan/30 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neon-cyan/10 to-transparent animate-pulse" />
              
              <div className="relative z-10 h-64 flex items-center justify-center">
                <motion.div 
                  className="w-32 h-32 bg-gradient-to-r from-neon-pink to-neon-cyan rounded-full flex items-center justify-center"
                  animate={isPlaying ? {
                    rotate: 360,
                    scale: [1, 1.2, 1],
                  } : {}}
                  transition={{
                    rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                    scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
                  }}
                  style={{ boxShadow: '0 0 50px rgba(0, 255, 255, 0.8)' }}
                >
                  <Target size={48} className="text-black" />
                </motion.div>
              </div>
              
              {/* Floating UI Elements */}
              <motion.div 
                className="absolute top-4 left-4 bg-black/80 border border-neon-green/50 rounded-lg p-3"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <div className="text-neon-green text-sm font-bold">HEALTH: 100%</div>
              </motion.div>
              
              <motion.div 
                className="absolute top-4 right-4 bg-black/80 border border-neon-pink/50 rounded-lg p-3"
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
              >
                <div className="text-neon-pink text-sm font-bold">ENERGY: 87%</div>
              </motion.div>
              
              <motion.div 
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/80 border border-neon-cyan/50 rounded-lg p-3"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="text-neon-cyan text-sm font-bold">SCORE: 15,420</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Level Selection */}
      <section id="levels" className="py-16 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-black text-neon-pink mb-4 text-glow">CHOOSE YOUR LEVEL</h2>
            <p className="text-xl text-white/80">Each level unlocks new dimensions</p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                level: 1, 
                name: "NEON CITY", 
                difficulty: "EASY", 
                color: "from-neon-green to-neon-cyan",
                icon: Zap
              },
              { 
                level: 2, 
                name: "CYBER MATRIX", 
                difficulty: "MEDIUM", 
                color: "from-neon-cyan to-neon-pink",
                icon: Cpu
              },
              { 
                level: 3, 
                name: "QUANTUM REALM", 
                difficulty: "HARD", 
                color: "from-neon-pink to-purple-500",
                icon: Wifi
              }
            ].map((level, index) => (
              <motion.div
                key={index}
                className={`bg-black/80 backdrop-blur-md border rounded-3xl p-8 cursor-pointer transition-all ${
                  selectedLevel === level.level 
                    ? 'border-neon-cyan neon-border' 
                    : 'border-gray-700 hover:border-neon-cyan/50'
                }`}
                initial={{ y: 100, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -10 }}
                onClick={() => setSelectedLevel(level.level)}
              >
                <motion.div 
                  className={`bg-gradient-to-r ${level.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  style={{ boxShadow: '0 0 30px rgba(0, 255, 255, 0.5)' }}
                >
                  <level.icon size={32} className="text-black" />
                </motion.div>
                
                <div className="text-center">
                  <h3 className="text-2xl font-black text-white mb-2">{level.name}</h3>
                  <div className="text-neon-cyan font-bold mb-4">LEVEL {level.level}</div>
                  <div className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
                    level.difficulty === 'EASY' ? 'bg-green-500/20 text-neon-green' :
                    level.difficulty === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {level.difficulty}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gaming Features */}
      <section id="features" className="py-20 px-6 bg-gradient-to-r from-black via-gray-900 to-black relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-black text-white mb-4 text-glow">GAME FEATURES</h2>
            <p className="text-xl text-neon-cyan">Next-generation gaming technology</p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Real-time 3D", desc: "Immersive 3D environments with ray tracing", icon: "🎮" },
              { title: "Multiplayer", desc: "Connect with players worldwide", icon: "🌐" },
              { title: "AI Opponents", desc: "Advanced AI that learns your style", icon: "🤖" },
              { title: "VR Ready", desc: "Full virtual reality support", icon: "🥽" }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-black/60 backdrop-blur-md border border-neon-cyan/30 rounded-2xl p-6 text-center hover:border-neon-pink/50 transition-all"
                initial={{ y: 100, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-neon-cyan mb-3">{feature.title}</h3>
                <p className="text-white/80">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-black text-neon-cyan mb-6 text-glow">JOIN THE NEXUS</h2>
              <p className="text-white/80 mb-8">
                Ready to enter the future of gaming? Connect with our development team 
                and be part of the revolution.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-neon-cyan to-neon-pink rounded-full flex items-center justify-center">
                    <Mail size={20} />
                  </div>
                  <span className="text-neon-cyan">nexus@gamedev.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-neon-pink to-neon-green rounded-full flex items-center justify-center">
                    <Phone size={20} />
                  </div>
                  <span className="text-neon-cyan">1-800-NEXUS-GAME</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="bg-black/80 backdrop-blur-md border border-neon-cyan/50 rounded-3xl p-8 neon-border">
                <h3 className="text-2xl font-black text-white mb-6">GET EARLY ACCESS</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 bg-black/50 border border-neon-cyan/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-cyan"
                    required
                  />
                  <motion.button
                    type="submit"
                    className="w-full bg-gradient-to-r from-neon-pink to-neon-cyan text-black py-3 rounded-xl font-black hover:from-neon-cyan hover:to-neon-pink transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    ENTER THE NEXUS
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/90 border-t border-neon-cyan/30 py-12 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <motion.div 
              className="flex items-center gap-2 mb-4 md:mb-0"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-neon-cyan to-neon-pink rounded-lg flex items-center justify-center animate-glow">
                <Gamepad2 className="text-white" size={20} />
              </div>
              <span className="text-xl font-bold text-glow">NEXUS GAME</span>
            </motion.div>
            <div className="flex items-center gap-6">
              {[Github, Twitter].map((Icon, index) => (
                <motion.a 
                  key={index}
                  href="#" 
                  className="text-neon-cyan hover:text-white transition-colors"
                  whileHover={{ scale: 1.2, y: -2 }}
                >
                  <Icon size={20} />
                </motion.a>
              ))}
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-neon-cyan/30 text-center text-neon-cyan">
            © 2024 NEXUS GAME. ENTER THE FUTURE.
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
