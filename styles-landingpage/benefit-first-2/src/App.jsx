import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, Smile, Zap, Users, Star, Mail, Phone, CheckCircle, ArrowRight, Gift } from 'lucide-react'

function App() {
  const [email, setEmail] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Email submitted:', email)
    setEmail('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                <Heart className="text-white" size={20} />
              </div>
              <span className="text-xl font-bold text-gray-900">JoyfulApp</span>
            </motion.div>
            <div className="hidden md:flex items-center space-x-6">
              <a href="#story" className="text-gray-600 hover:text-pink-600 transition-colors">Our Story</a>
              <a href="#benefits" className="text-gray-600 hover:text-pink-600 transition-colors">Benefits</a>
              <a href="#pricing" className="text-gray-600 hover:text-pink-600 transition-colors">Pricing</a>
              <motion.button 
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-2 rounded-full hover:from-pink-600 hover:to-purple-600 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Try Free!
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Illustration */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <motion.h1 
                className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Life's too short for
                <br />
                <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                  complicated apps!
                </span>
              </motion.h1>
              
              <motion.p 
                className="text-xl text-gray-600 mb-8 leading-relaxed"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Finally, an app that makes you smile instead of stress. 
                Simple, delightful, and designed for real humans like you.
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <motion.button 
                  className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:from-pink-600 hover:to-purple-600 transition-all inline-flex items-center gap-3 group"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Smile size={24} />
                  Start Smiling Today
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
                <motion.button 
                  className="border-2 border-pink-300 text-pink-600 px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-pink-50 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Watch Demo
                </motion.button>
              </motion.div>
            </motion.div>
            
            {/* Illustration Area */}
            <motion.div 
              className="relative"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="relative bg-gradient-to-br from-pink-200 to-purple-200 rounded-3xl p-8 overflow-hidden">
                {/* Floating Elements */}
                <motion.div 
                  className="absolute top-4 right-4 w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Smile className="text-yellow-800" size={32} />
                </motion.div>
                
                <motion.div 
                  className="absolute top-20 left-4 w-12 h-12 bg-pink-400 rounded-full flex items-center justify-center"
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                >
                  <Heart className="text-white" size={20} />
                </motion.div>
                
                <motion.div 
                  className="absolute bottom-4 right-8 w-14 h-14 bg-purple-400 rounded-full flex items-center justify-center"
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
                >
                  <Zap className="text-white" size={24} />
                </motion.div>
                
                {/* Main Illustration */}
                <div className="text-center py-12">
                  <motion.div 
                    className="w-48 h-48 bg-white rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 6, repeat: Infinity }}
                  >
                    <div className="text-6xl">😊</div>
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Happy Users</h3>
                  <p className="text-gray-600">Join 50,000+ people who love our app</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Problem Story Section */}
      <section id="story" className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-8">
              Remember when apps used to be... 
              <span className="text-red-500">frustrating?</span>
            </h2>
            
            <div className="bg-red-50 rounded-3xl p-8 mb-12">
              <div className="text-6xl mb-4">😤</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">The Old Way Was Painful</h3>
              <div className="grid md:grid-cols-3 gap-6 text-left">
                <div className="flex items-start gap-3">
                  <span className="text-red-500 text-2xl">😵</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">Confusing Menus</h4>
                    <p className="text-gray-600 text-sm">Endless buttons that lead nowhere</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-red-500 text-2xl">⏰</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">Wasted Time</h4>
                    <p className="text-gray-600 text-sm">Hours learning instead of doing</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-red-500 text-2xl">😰</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">Constant Stress</h4>
                    <p className="text-gray-600 text-sm">Fear of breaking something</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-3xl p-8">
              <div className="text-6xl mb-4">✨</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">But What If It Could Be Different?</h3>
              <p className="text-lg text-gray-700">
                What if using an app felt like chatting with your best friend? 
                What if every tap brought a little spark of joy? That's exactly what we built.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits with Illustrations */}
      <section id="benefits" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why People Fall in Love with JoyfulApp
            </h2>
            <p className="text-xl text-gray-600">Real benefits that make a real difference</p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                emoji: "⚡", 
                title: "Instant Joy", 
                desc: "Feel happy the moment you open the app. Every interaction is designed to delight.",
                color: "from-yellow-400 to-orange-400"
              },
              { 
                emoji: "🎯", 
                title: "Zero Learning", 
                desc: "So intuitive, your grandma could use it. No tutorials, no confusion, just pure simplicity.",
                color: "from-green-400 to-blue-400"
              },
              { 
                emoji: "💝", 
                title: "Made with Love", 
                desc: "Every pixel crafted with care. You'll feel the difference in every detail.",
                color: "from-pink-400 to-purple-400"
              },
              { 
                emoji: "🚀", 
                title: "Lightning Fast", 
                desc: "Faster than your thoughts. No waiting, no loading, just instant results.",
                color: "from-purple-400 to-indigo-400"
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all group"
                initial={{ y: 100, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <motion.div 
                  className={`bg-gradient-to-r ${benefit.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <span className="text-2xl">{benefit.emoji}</span>
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Happy Testimonials */}
      <section className="py-16 px-6 bg-gradient-to-r from-pink-50 to-purple-50">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Happy Stories from Happy People</h2>
            <div className="text-4xl mb-4">😍</div>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Sarah M.", emoji: "🥰", quote: "This app literally makes me smile every time I use it!" },
              { name: "Mike R.", emoji: "🤩", quote: "Finally! An app that doesn't make me want to throw my phone!" },
              { name: "Lisa K.", emoji: "😊", quote: "My kids can use it, my parents can use it. It just works!" }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-3xl p-6 shadow-lg"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-4xl mb-4 text-center">{testimonial.emoji}</div>
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="text-yellow-400 fill-current" size={20} />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.quote}"</p>
                <div className="font-semibold text-gray-900">- {testimonial.name}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Simple Pricing */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">One Price, Endless Smiles</h2>
            <p className="text-xl text-gray-600 mb-12">No tricks, no hidden fees, just pure value</p>
            
            <div className="bg-gradient-to-br from-pink-500 to-purple-500 text-white rounded-3xl p-8 mb-8 relative overflow-hidden">
              <motion.div 
                className="absolute top-4 right-4 text-4xl"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🎉
              </motion.div>
              
              <h3 className="text-3xl font-bold mb-4">Everything Included</h3>
              <div className="text-6xl font-bold mb-2">$12</div>
              <div className="text-xl opacity-90 mb-6">per month</div>
              
              <div className="space-y-3 mb-8 text-left max-w-sm mx-auto">
                {[
                  "All features unlocked",
                  "Unlimited happiness",
                  "24/7 friendly support",
                  "30-day smile guarantee"
                ].map((feature, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-center gap-3"
                    initial={{ x: -20, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <CheckCircle size={20} />
                    <span>{feature}</span>
                  </motion.div>
                ))}
              </div>
              
              <motion.button 
                className="bg-white text-purple-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all inline-flex items-center gap-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Gift size={24} />
                Start Your Joy Journey
              </motion.button>
              <p className="text-sm opacity-75 mt-3">7-day free trial • No credit card needed</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">We're Here to Help You Smile</h2>
              <p className="text-gray-600 mb-6">
                Questions? Concerns? Just want to say hi? We love hearing from our users!
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                    <Mail className="text-pink-600" size={20} />
                  </div>
                  <span className="text-gray-600">hello@joyfulapp.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Phone className="text-purple-600" size={20} />
                  </div>
                  <span className="text-gray-600">1-800-JOY-HELP</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-3xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Get Happy Updates</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full px-4 py-3 rounded-2xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none transition-colors"
                    required
                  />
                  <motion.button
                    type="submit"
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-2xl font-semibold hover:from-pink-600 hover:to-purple-600 transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Spread the Joy!
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div 
            className="flex items-center justify-center gap-2 mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
              <Heart className="text-white" size={20} />
            </div>
            <span className="text-xl font-bold">JoyfulApp</span>
          </motion.div>
          <p className="text-gray-400 mb-6">
            Spreading joy, one user at a time 😊
          </p>
          <div className="text-gray-500 text-sm">
            © 2024 JoyfulApp. Made with lots of ❤️ and ☕
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
