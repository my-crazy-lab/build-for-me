import { useState } from 'react'
import { Menu, X, Smartphone, Heart, Star, Download, ArrowRight, Mail, MessageCircle, Share2 } from 'lucide-react'

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [email, setEmail] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Email submitted:', email)
    setEmail('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-400 via-purple-500 to-indigo-600">
      {/* Mobile Navigation */}
      <nav className="bg-white/10 backdrop-blur-md sticky top-0 z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="text-white" size={24} />
              <span className="text-lg font-bold text-white">MobileApp</span>
            </div>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white p-2"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          
          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="mt-4 pb-4 space-y-3">
              <a href="#features" className="block text-white/90 py-2 text-lg">Features</a>
              <a href="#reviews" className="block text-white/90 py-2 text-lg">Reviews</a>
              <a href="#download" className="block text-white/90 py-2 text-lg">Download</a>
              <a href="#contact" className="block text-white/90 py-2 text-lg">Contact</a>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section - Mobile Optimized */}
      <section className="px-4 py-12 text-white text-center">
        <div className="max-w-sm mx-auto">
          <h1 className="text-4xl font-black mb-6 leading-tight">
            The App You'll
            <br />
            <span className="text-yellow-300">Actually Use</span>
          </h1>
          
          <p className="text-lg mb-8 leading-relaxed">
            Simple, beautiful, and designed for your phone. 
            Get things done with just a few taps.
          </p>
          
          {/* App Store Buttons */}
          <div className="space-y-4 mb-8">
            <button className="w-full bg-black text-white py-4 px-6 rounded-2xl text-lg font-semibold flex items-center justify-center gap-3 hover:bg-gray-800 transition-colors">
              <Download size={24} />
              Download for iOS
            </button>
            <button className="w-full bg-green-600 text-white py-4 px-6 rounded-2xl text-lg font-semibold flex items-center justify-center gap-3 hover:bg-green-700 transition-colors">
              <Download size={24} />
              Get on Android
            </button>
          </div>
          
          <div className="text-sm opacity-90">
            ⭐ 4.9/5 stars • 100K+ downloads
          </div>
        </div>
      </section>

      {/* Phone Mockup */}
      <section className="px-4 py-8">
        <div className="max-w-xs mx-auto">
          <div className="bg-black rounded-[3rem] p-2 shadow-2xl">
            <div className="bg-white rounded-[2.5rem] overflow-hidden">
              {/* Phone Screen */}
              <div className="bg-gradient-to-b from-pink-100 to-purple-100 aspect-[9/16] p-6 flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <div className="text-lg font-bold text-gray-900">MobileApp</div>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white rounded-2xl p-4 shadow-sm">
                    <div className="w-8 h-8 bg-pink-400 rounded-full mb-3"></div>
                    <div className="text-sm font-semibold text-gray-900">Tasks</div>
                    <div className="text-xs text-gray-600">12 pending</div>
                  </div>
                  <div className="bg-white rounded-2xl p-4 shadow-sm">
                    <div className="w-8 h-8 bg-purple-400 rounded-full mb-3"></div>
                    <div className="text-sm font-semibold text-gray-900">Notes</div>
                    <div className="text-xs text-gray-600">8 saved</div>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl p-4 shadow-sm flex-1">
                  <div className="text-sm font-semibold text-gray-900 mb-3">Recent Activity</div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <div className="text-xs text-gray-600">Task completed</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <div className="text-xs text-gray-600">Note added</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <div className="text-xs text-gray-600">Goal achieved</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features - Card Grid */}
      <section id="features" className="px-4 py-12">
        <div className="max-w-sm mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Why You'll Love It
          </h2>
          
          <div className="space-y-6">
            <div className="bg-white/20 backdrop-blur-md rounded-3xl p-6 text-white">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
              <p className="text-white/90">Opens instantly, works offline, never slows you down.</p>
            </div>
            
            <div className="bg-white/20 backdrop-blur-md rounded-3xl p-6 text-white">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-bold mb-2">Beautiful Design</h3>
              <p className="text-white/90">Clean, modern interface that's a joy to use every day.</p>
            </div>
            
            <div className="bg-white/20 backdrop-blur-md rounded-3xl p-6 text-white">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-bold mb-2">Super Secure</h3>
              <p className="text-white/90">Your data is encrypted and stays private. Always.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews - Swipeable Cards */}
      <section id="reviews" className="px-4 py-12">
        <div className="max-w-sm mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            What People Say
          </h2>
          
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <img src="https://via.placeholder.com/40x40" alt="User" className="w-10 h-10 rounded-full" />
                <div>
                  <div className="font-semibold text-gray-900">Sarah M.</div>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-700">
                "This app changed my life! So simple to use and actually helps me stay organized."
              </p>
            </div>
            
            <div className="bg-white rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <img src="https://via.placeholder.com/40x40" alt="User" className="w-10 h-10 rounded-full" />
                <div>
                  <div className="font-semibold text-gray-900">Mike R.</div>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-700">
                "Finally, an app that doesn't try to do everything. It just works perfectly."
              </p>
            </div>
            
            <div className="bg-white rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <img src="https://via.placeholder.com/40x40" alt="User" className="w-10 h-10 rounded-full" />
                <div>
                  <div className="font-semibold text-gray-900">Lisa K.</div>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-700">
                "Love the design! It's so pretty and makes me want to use it every day."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Download CTA */}
      <section id="download" className="px-4 py-12">
        <div className="max-w-sm mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          
          <p className="text-lg text-white/90 mb-8">
            Join 100,000+ happy users today
          </p>
          
          <div className="space-y-4">
            <button className="w-full bg-white text-purple-600 py-4 px-6 rounded-2xl text-lg font-bold flex items-center justify-center gap-3 hover:bg-gray-100 transition-colors">
              <Download size={24} />
              Download Free
            </button>
            
            <button className="w-full border-2 border-white text-white py-4 px-6 rounded-2xl text-lg font-bold flex items-center justify-center gap-3 hover:bg-white hover:text-purple-600 transition-colors">
              <Share2 size={24} />
              Share with Friends
            </button>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="px-4 py-12">
        <div className="max-w-sm mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Stay Connected
          </h2>
          
          <div className="bg-white/20 backdrop-blur-md rounded-3xl p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full px-4 py-4 rounded-2xl text-gray-900 text-lg focus:outline-none focus:ring-4 focus:ring-white/50"
                required
              />
              <button
                type="submit"
                className="w-full bg-white text-purple-600 py-4 rounded-2xl text-lg font-bold hover:bg-gray-100 transition-colors"
              >
                Get Updates
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <div className="flex items-center gap-3 text-white/90 mb-3">
                <Mail size={20} />
                <span>hello@mobileapp.com</span>
              </div>
              <div className="flex items-center gap-3 text-white/90">
                <MessageCircle size={20} />
                <span>Live chat in app</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-8 bg-black/30 backdrop-blur-md">
        <div className="max-w-sm mx-auto text-center text-white">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Smartphone className="text-white" size={24} />
            <span className="text-lg font-bold">MobileApp</span>
          </div>
          <p className="text-white/70 text-sm mb-4">
            Made with <Heart className="inline text-red-400" size={16} /> for mobile users
          </p>
          <div className="text-white/60 text-xs">
            © 2024 MobileApp. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Sticky Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-2xl z-50">
        <div className="max-w-sm mx-auto">
          <button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 rounded-2xl text-lg font-bold flex items-center justify-center gap-3 hover:from-pink-600 hover:to-purple-700 transition-all">
            <Download size={24} />
            Download Now - Free
          </button>
        </div>
      </div>

      {/* Bottom padding to account for sticky CTA */}
      <div className="h-20"></div>
    </div>
  )
}

export default App
