import { useState } from 'react'
import { motion } from 'framer-motion'
import { Zap, Download, ArrowRight, Star, Check, Mail, Phone, Cpu, Wifi, Power } from 'lucide-react'

function App() {
  const [email, setEmail] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Email submitted:', email)
    setEmail('')
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Cyberpunk Grid Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Glitch Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-0 left-0 w-full h-1 bg-neon-cyan"
          animate={{
            x: ['-100%', '100%'],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3
          }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-full h-1 bg-neon-pink"
          animate={{
            x: ['100%', '-100%'],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatDelay: 4
          }}
        />
      </div>

      {/* Navigation */}
      <motion.nav 
        className="relative z-50 bg-black/80 backdrop-blur-md border-b border-neon-cyan/50"
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
              <div className="w-8 h-8 bg-gradient-to-r from-neon-cyan to-neon-pink rounded-none flex items-center justify-center animate-glow">
                <Cpu className="text-black" size={20} />
              </div>
              <span className="text-xl font-black text-glow tracking-wider">CYBER</span>
            </motion.div>
            <motion.button 
              className="bg-gradient-to-r from-neon-pink to-neon-cyan text-black px-8 py-3 font-black uppercase tracking-wider hover:from-neon-cyan hover:to-neon-pink transition-all neon-border"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              JACK IN
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="py-20 px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <motion.h1 
              className="text-7xl md:text-9xl font-black mb-8 leading-none"
              animate={{ 
                textShadow: [
                  '0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff',
                  '0 0 20px #ff10f0, 0 0 30px #ff10f0, 0 0 40px #ff10f0',
                  '0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="bg-gradient-to-r from-neon-cyan via-neon-pink to-neon-green bg-clip-text text-transparent">
                HACK
              </span>
              <br />
              <span className="text-white animate-glitch">
                THE MATRIX
              </span>
            </motion.h1>
          </motion.div>
          
          <motion.p 
            className="text-2xl md:text-3xl font-bold mb-12 text-neon-cyan"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            BREAK FREE • LEVEL UP • DOMINATE
          </motion.p>
          
          {/* Primary CTA */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <motion.button 
              className="bg-gradient-to-r from-neon-pink to-neon-cyan text-black text-3xl md:text-4xl font-black px-16 py-8 mb-8 uppercase tracking-wider hover:from-neon-cyan hover:to-neon-pink transition-all inline-flex items-center gap-6 group neon-border"
              whileHover={{ 
                scale: 1.05, 
                y: -10,
                boxShadow: '0 0 50px rgba(0, 255, 255, 0.8)'
              }}
              whileTap={{ scale: 0.95 }}
              animate={{
                boxShadow: [
                  '0 0 20px rgba(0, 255, 255, 0.5)',
                  '0 0 40px rgba(255, 16, 240, 0.5)',
                  '0 0 20px rgba(0, 255, 255, 0.5)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Download size={40} />
              DOWNLOAD NOW
              <ArrowRight size={40} className="group-hover:translate-x-2 transition-transform" />
            </motion.button>
            
            <div className="text-xl font-bold text-neon-green">
              ⚡ INSTANT ACCESS • 🚀 ZERO SETUP • 💀 100% LETHAL
            </div>
          </motion.div>
        </div>
      </section>

      {/* Glitch Benefits */}
      <section className="py-12 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: "⚡", title: "INSTANT", desc: "ZERO LATENCY", color: "from-neon-cyan to-blue-500" },
              { icon: "🔥", title: "LETHAL", desc: "MAXIMUM DAMAGE", color: "from-neon-pink to-red-500" },
              { icon: "💀", title: "UNSTOPPABLE", desc: "INFINITE POWER", color: "from-neon-green to-green-500" }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                className="bg-black/80 backdrop-blur-md border border-neon-cyan/50 p-8 text-center hover:border-neon-pink/80 transition-all neon-border"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                whileHover={{ scale: 1.05, y: -10 }}
              >
                <motion.div 
                  className="text-6xl mb-4"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                >
                  {benefit.icon}
                </motion.div>
                <h3 className="text-2xl font-black text-neon-cyan mb-2 text-glow">{benefit.title}</h3>
                <p className="text-lg font-bold text-white">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Secondary CTA Section */}
      <section className="py-16 px-6 bg-gradient-to-r from-black via-gray-900 to-black relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            className="text-5xl md:text-7xl font-black mb-8 text-neon-pink text-glow"
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            READY TO ASCEND?
          </motion.h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <motion.button 
              className="bg-gradient-to-r from-neon-green to-green-500 text-black text-2xl font-black px-12 py-6 uppercase tracking-wider hover:from-green-500 hover:to-neon-green transition-all inline-flex items-center justify-center gap-4 neon-border"
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              initial={{ x: -100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Power size={32} />
              ACTIVATE NOW
            </motion.button>
            
            <motion.button 
              className="bg-gradient-to-r from-purple-600 to-neon-pink text-white text-2xl font-black px-12 py-6 uppercase tracking-wider hover:from-neon-pink hover:to-purple-600 transition-all inline-flex items-center justify-center gap-4 neon-border"
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              initial={{ x: 100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Wifi size={32} />
              CONNECT
            </motion.button>
          </div>
          
          <motion.div 
            className="text-2xl font-bold text-neon-cyan"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🔥 LIMITED TIME: DOUBLE XP BOOST!
          </motion.div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div 
            className="text-3xl font-black mb-8 text-neon-green text-glow"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            ⭐⭐⭐⭐⭐ 100,000+ CYBER WARRIORS
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { rating: "★★★★★", quote: "MIND = BLOWN!", user: "GHOST_RIDER_99" },
              { rating: "★★★★★", quote: "PURE DIGITAL FIRE!", user: "NEON_SAMURAI" },
              { rating: "★★★★★", quote: "NEXT LEVEL POWER!", user: "CYBER_QUEEN" }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-black/60 backdrop-blur-md border border-neon-cyan/30 p-6 neon-border"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-2xl font-black text-neon-pink mb-2">{testimonial.rating}</div>
                <div className="text-lg font-bold mb-2 text-white">"{testimonial.quote}"</div>
                <div className="text-sm text-neon-cyan">- {testimonial.user}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 px-6 bg-black/80 backdrop-blur-md relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <motion.h2 
            className="text-5xl font-black mb-8 text-white text-glow"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            ONE PRICE. INFINITE POWER.
          </motion.h2>
          
          <motion.div 
            className="bg-gradient-to-br from-neon-cyan/20 to-neon-pink/20 border-2 border-neon-cyan p-12 mb-8 neon-border relative overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div 
              className="absolute top-4 right-4 text-4xl"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              ⚡
            </motion.div>
            
            <h3 className="text-4xl font-black mb-4 text-neon-cyan text-glow">CYBER ELITE</h3>
            <div className="text-7xl font-black mb-4 text-white">$29</div>
            <div className="text-xl text-neon-pink mb-8">/MONTH</div>
            
            <div className="space-y-3 mb-8 text-left max-w-sm mx-auto">
              {[
                "UNLIMITED POWER",
                "ZERO RESTRICTIONS", 
                "24/7 NEURAL LINK",
                "IMMORTALITY MODE"
              ].map((feature, index) => (
                <motion.div 
                  key={index}
                  className="flex items-center gap-3"
                  initial={{ x: -20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Check size={20} className="text-neon-green" />
                  <span className="font-bold text-white">{feature}</span>
                </motion.div>
              ))}
            </div>
            
            <motion.button 
              className="bg-gradient-to-r from-neon-pink to-neon-cyan text-black px-12 py-4 text-2xl font-black uppercase tracking-wider hover:from-neon-cyan hover:to-neon-pink transition-all inline-flex items-center gap-4 neon-border"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Zap size={32} />
              JACK IN NOW
            </motion.button>
            <p className="text-sm text-neon-cyan mt-3">💳 NO LIMITS • 🔒 CANCEL ANYTIME</p>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            className="text-6xl md:text-8xl font-black mb-8 text-neon-pink text-glow"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            animate={{ 
              textShadow: [
                '0 0 20px #ff10f0',
                '0 0 40px #ff10f0, 0 0 60px #ff10f0',
                '0 0 20px #ff10f0'
              ]
            }}
          >
            THE MATRIX
            <br />
            AWAITS
          </motion.h2>
          
          <motion.button 
            className="bg-gradient-to-r from-neon-cyan via-neon-pink to-neon-green text-black text-4xl md:text-5xl font-black px-20 py-10 mb-8 uppercase tracking-wider hover:scale-105 transition-all inline-flex items-center gap-6 neon-border"
            whileHover={{ 
              y: -10,
              boxShadow: '0 0 100px rgba(0, 255, 255, 1)'
            }}
            whileTap={{ scale: 0.95 }}
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 1, type: "spring" }}
            viewport={{ once: true }}
          >
            <Download size={48} />
            ENTER NOW!
          </motion.button>
          
          <motion.div 
            className="text-2xl font-bold text-neon-green"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            ⏰ JOIN 100,000+ CYBER WARRIORS!
          </motion.div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-12 px-6 bg-black/90 backdrop-blur-md relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="text-center">
              <h3 className="text-2xl font-black text-neon-cyan mb-4 text-glow">NEED BACKUP?</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-3">
                  <Mail className="text-neon-pink" size={20} />
                  <span className="font-bold text-white">support@cyber.net</span>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <Phone className="text-neon-green" size={20} />
                  <span className="font-bold text-white">1-800-CYBER</span>
                </div>
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-black text-neon-pink mb-4 text-glow">STAY CONNECTED</h3>
              <form onSubmit={handleSubmit} className="flex gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="YOUR.EMAIL@CYBER.NET"
                  className="flex-1 px-4 py-3 bg-black/50 border border-neon-cyan/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-cyan uppercase font-bold"
                  required
                />
                <motion.button
                  type="submit"
                  className="bg-gradient-to-r from-neon-pink to-neon-cyan text-black px-6 py-3 font-black hover:from-neon-cyan hover:to-neon-pink transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  LINK!
                </motion.button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-8 px-6 border-t border-neon-cyan/50 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div 
            className="flex items-center justify-center gap-2 mb-4"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-8 h-8 bg-gradient-to-r from-neon-cyan to-neon-pink rounded-none flex items-center justify-center animate-glow">
              <Cpu className="text-black" size={20} />
            </div>
            <span className="text-xl font-black text-glow tracking-wider">CYBER</span>
          </motion.div>
          <div className="text-neon-cyan font-bold">
            © 2024 CYBER. HACK THE PLANET.
          </div>
        </div>
      </footer>

      {/* Sticky Bottom CTA for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-neon-pink to-neon-cyan p-4 md:hidden z-50 neon-border">
        <motion.button 
          className="w-full text-2xl font-black py-4 bg-black text-neon-cyan border-2 border-neon-cyan uppercase tracking-wider"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Download className="inline mr-2" size={24} />
          JACK IN NOW!
        </motion.button>
      </div>
    </div>
  )
}

export default App
