import { useState } from 'react'
import { Play, Pause, RotateCcw, Maximize2, Code, Smartphone, Monitor, Tablet, Mail, Phone, Github, Twitter } from 'lucide-react'

function App() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentDevice, setCurrentDevice] = useState('desktop')
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Navigation */}
      <nav className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-blue-400 rounded-lg"></div>
              <span className="text-xl font-bold text-white">DemoApp</span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <a href="#demo" className="text-white/80 hover:text-white transition-colors">Live Demo</a>
              <a href="#features" className="text-white/80 hover:text-white transition-colors">Features</a>
              <a href="#pricing" className="text-white/80 hover:text-white transition-colors">Pricing</a>
              <a href="#contact" className="text-white/80 hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-6 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            See It in Action
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-white/80 max-w-3xl mx-auto">
            Don't just read about it - experience our platform live. 
            Interactive demos that show exactly how our solution works.
          </p>
          <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 inline-flex items-center gap-2">
            <Play size={20} />
            Try It Now
          </button>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section id="demo" className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Interactive Demo</h2>
            <p className="text-xl text-white/80">Experience our platform across all devices</p>
          </div>
          
          {/* Device Selector */}
          <div className="flex justify-center mb-8">
            <div className="bg-black/30 backdrop-blur-md rounded-lg p-2 flex gap-2">
              <button
                onClick={() => setCurrentDevice('desktop')}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                  currentDevice === 'desktop' 
                    ? 'bg-purple-600 text-white' 
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                <Monitor size={20} />
                Desktop
              </button>
              <button
                onClick={() => setCurrentDevice('tablet')}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                  currentDevice === 'tablet' 
                    ? 'bg-purple-600 text-white' 
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                <Tablet size={20} />
                Tablet
              </button>
              <button
                onClick={() => setCurrentDevice('mobile')}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                  currentDevice === 'mobile' 
                    ? 'bg-purple-600 text-white' 
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                <Smartphone size={20} />
                Mobile
              </button>
            </div>
          </div>

          {/* Demo Frame */}
          <div className="bg-black/40 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={togglePlay}
                  className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full transition-colors"
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>
                <button className="bg-gray-600 hover:bg-gray-700 text-white p-3 rounded-full transition-colors">
                  <RotateCcw size={20} />
                </button>
                <span className="text-white/80">
                  {isPlaying ? 'Demo Running...' : 'Demo Paused'}
                </span>
              </div>
              <button className="bg-gray-600 hover:bg-gray-700 text-white p-3 rounded-full transition-colors">
                <Maximize2 size={20} />
              </button>
            </div>
            
            {/* Demo Content */}
            <div className={`bg-white rounded-lg overflow-hidden transition-all duration-500 ${
              currentDevice === 'desktop' ? 'aspect-video' :
              currentDevice === 'tablet' ? 'aspect-[4/3] max-w-2xl mx-auto' :
              'aspect-[9/16] max-w-sm mx-auto'
            }`}>
              <div className="h-full bg-gradient-to-br from-blue-50 to-purple-50 p-6 flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <div className="text-2xl font-bold text-gray-900">Dashboard</div>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Total Users</div>
                    <div className="text-2xl font-bold text-gray-900">12,847</div>
                    <div className="text-sm text-green-600">+12% this month</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Revenue</div>
                    <div className="text-2xl font-bold text-gray-900">$45,231</div>
                    <div className="text-sm text-green-600">+8% this month</div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4 shadow-sm flex-1">
                  <div className="text-lg font-semibold text-gray-900 mb-4">Analytics Chart</div>
                  <div className="h-32 bg-gradient-to-r from-purple-200 to-blue-200 rounded-lg flex items-end justify-around p-4">
                    {[40, 65, 45, 80, 55, 90, 70].map((height, i) => (
                      <div
                        key={i}
                        className="bg-purple-500 rounded-t transition-all duration-1000"
                        style={{ 
                          height: `${isPlaying ? height : 20}%`,
                          width: '12px'
                        }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Demo Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Watch It Work</h2>
            <p className="text-lg text-white/80">2-minute overview of key features</p>
          </div>
          
          <div className="bg-black/40 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="aspect-video bg-black rounded-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 to-blue-900/50 flex items-center justify-center">
                <button className="bg-white/20 backdrop-blur-md border border-white/30 text-white p-6 rounded-full hover:bg-white/30 transition-all transform hover:scale-110">
                  <Play size={32} />
                </button>
              </div>
              <div className="absolute bottom-4 left-4 text-white">
                <div className="text-sm opacity-80">Product Demo Video</div>
                <div className="text-lg font-semibold">2:34 minutes</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Powerful Features</h2>
            <p className="text-xl text-white/80">Everything you need in one platform</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:border-purple-400/50 transition-all">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Code className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Live Code Editor</h3>
              <p className="text-white/70">Real-time code editing with syntax highlighting and auto-completion.</p>
            </div>
            
            <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:border-purple-400/50 transition-all">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Smartphone className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Responsive Preview</h3>
              <p className="text-white/70">See how your work looks on desktop, tablet, and mobile devices.</p>
            </div>
            
            <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:border-purple-400/50 transition-all">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Play className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Instant Preview</h3>
              <p className="text-white/70">Changes appear instantly without any refresh or compilation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Simple Pricing</h2>
            <p className="text-xl text-white/80">Start free, upgrade when you're ready</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-black/30 backdrop-blur-md rounded-xl p-8 border border-white/20">
              <h3 className="text-2xl font-semibold text-white mb-4">Free</h3>
              <div className="text-4xl font-bold text-white mb-6">$0<span className="text-lg text-white/60">/month</span></div>
              <ul className="space-y-3 mb-8 text-white/80">
                <li>• 3 demo projects</li>
                <li>• Basic templates</li>
                <li>• Community support</li>
                <li>• Public sharing</li>
              </ul>
              <button className="w-full border border-purple-400 text-purple-400 py-3 rounded-lg hover:bg-purple-400 hover:text-white transition-colors">
                Start Free
              </button>
            </div>
            
            <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 backdrop-blur-md rounded-xl p-8 border border-purple-400/50 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 rounded-full text-sm">
                Popular
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">Pro</h3>
              <div className="text-4xl font-bold text-white mb-6">$29<span className="text-lg text-white/60">/month</span></div>
              <ul className="space-y-3 mb-8 text-white/80">
                <li>• Unlimited projects</li>
                <li>• Premium templates</li>
                <li>• Priority support</li>
                <li>• Private sharing</li>
                <li>• Advanced analytics</li>
                <li>• Custom domains</li>
              </ul>
              <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all">
                Try It Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Get in Touch</h2>
              <p className="text-white/80 mb-8">
                Have questions about our demo platform? We're here to help you get started.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="text-purple-400" size={20} />
                  <span className="text-white/80">demo@demoapp.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="text-purple-400" size={20} />
                  <span className="text-white/80">+1 (555) 123-4567</span>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Stay Updated</h2>
              <p className="text-white/80 mb-6">
                Get notified about new features and demo templates.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-black/30 backdrop-blur-md border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 backdrop-blur-md border-t border-white/10 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-blue-400 rounded-lg"></div>
              <span className="text-xl font-bold text-white">DemoApp</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="#" className="text-white/60 hover:text-white transition-colors">
                <Github size={20} />
              </a>
              <a href="#" className="text-white/60 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/10 text-center text-white/60">
            © 2024 DemoApp. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
