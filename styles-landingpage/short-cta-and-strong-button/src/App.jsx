import { useState } from 'react'
import { Download, ArrowRight, Zap, Star, Check, Mail, Phone } from 'lucide-react'

function App() {
  const [email, setEmail] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Email submitted:', email)
    setEmail('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500 to-orange-500">
      {/* Navigation */}
      <nav className="bg-black/20 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="text-yellow-300" size={28} />
              <span className="text-xl font-bold text-white">QuickApp</span>
            </div>
            <button className="bg-yellow-400 text-black px-6 py-2 rounded-full font-bold hover:bg-yellow-300 transition-colors">
              GET STARTED
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section - Above the fold */}
      <section className="py-16 px-6 text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight">
            GET RESULTS
            <br />
            <span className="text-yellow-300">NOW!</span>
          </h1>
          
          <p className="text-2xl md:text-3xl font-bold mb-12">
            Stop waiting. Start winning.
          </p>
          
          {/* Primary CTA */}
          <div className="space-y-6">
            <button className="bg-yellow-400 text-black text-2xl md:text-3xl font-black px-12 py-6 rounded-2xl hover:bg-yellow-300 transition-all transform hover:scale-105 shadow-2xl w-full md:w-auto">
              <Download className="inline mr-4" size={32} />
              DOWNLOAD NOW
            </button>
            
            <div className="text-xl font-semibold">
              ⚡ Instant setup • 🚀 Works immediately • 💯 100% free
            </div>
          </div>
        </div>
      </section>

      {/* Quick Benefits */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 text-center text-white">
              <div className="text-4xl font-black mb-3">⚡</div>
              <div className="text-xl font-bold">INSTANT</div>
              <div className="text-lg">Setup in 30 seconds</div>
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 text-center text-white">
              <div className="text-4xl font-black mb-3">🎯</div>
              <div className="text-xl font-bold">SIMPLE</div>
              <div className="text-lg">No learning required</div>
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 text-center text-white">
              <div className="text-4xl font-black mb-3">💪</div>
              <div className="text-xl font-bold">POWERFUL</div>
              <div className="text-lg">Pro-level results</div>
            </div>
          </div>
        </div>
      </section>

      {/* Secondary CTA Section */}
      <section className="py-16 px-6 bg-black/30 backdrop-blur-md">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl md:text-6xl font-black mb-8">
            READY TO WIN?
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <button className="bg-green-500 text-white text-xl font-black px-8 py-6 rounded-xl hover:bg-green-400 transition-all transform hover:scale-105 shadow-xl">
              <ArrowRight className="inline mr-3" size={24} />
              START FREE TRIAL
            </button>
            <button className="bg-blue-500 text-white text-xl font-black px-8 py-6 rounded-xl hover:bg-blue-400 transition-all transform hover:scale-105 shadow-xl">
              <Star className="inline mr-3" size={24} />
              SEE DEMO
            </button>
          </div>
          
          <div className="text-lg font-semibold">
            🔥 Limited time: Get 50% off your first month!
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto text-center text-white">
          <div className="text-2xl font-bold mb-8">
            ⭐⭐⭐⭐⭐ 50,000+ HAPPY USERS
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
              <div className="text-3xl font-black text-yellow-300 mb-2">★★★★★</div>
              <div className="text-lg font-semibold mb-2">"AMAZING!"</div>
              <div className="text-sm">- Sarah K.</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
              <div className="text-3xl font-black text-yellow-300 mb-2">★★★★★</div>
              <div className="text-lg font-semibold mb-2">"GAME CHANGER!"</div>
              <div className="text-sm">- Mike R.</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
              <div className="text-3xl font-black text-yellow-300 mb-2">★★★★★</div>
              <div className="text-lg font-semibold mb-2">"LOVE IT!"</div>
              <div className="text-sm">- Lisa M.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing - Simple */}
      <section className="py-16 px-6 bg-white/10 backdrop-blur-md">
        <div className="max-w-2xl mx-auto text-center text-white">
          <h2 className="text-4xl font-black mb-8">ONE PRICE. ALL FEATURES.</h2>
          
          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black rounded-3xl p-8 mb-8">
            <div className="text-6xl font-black mb-4">$19</div>
            <div className="text-2xl font-bold mb-6">/month</div>
            
            <div className="space-y-3 text-left text-lg font-semibold mb-8">
              <div className="flex items-center gap-3">
                <Check className="text-green-600" size={24} />
                <span>Everything included</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="text-green-600" size={24} />
                <span>No limits</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="text-green-600" size={24} />
                <span>24/7 support</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="text-green-600" size={24} />
                <span>Cancel anytime</span>
              </div>
            </div>
            
            <button className="bg-black text-white text-2xl font-black px-12 py-4 rounded-xl hover:bg-gray-800 transition-all transform hover:scale-105 w-full">
              GET STARTED NOW
            </button>
          </div>
          
          <div className="text-lg font-semibold">
            💳 No credit card required • 🔒 Cancel anytime
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-5xl md:text-7xl font-black mb-8">
            WHAT ARE YOU
            <br />
            WAITING FOR?
          </h2>
          
          <button className="bg-gradient-to-r from-yellow-400 to-red-400 text-black text-3xl md:text-4xl font-black px-16 py-8 rounded-3xl hover:from-yellow-300 hover:to-red-300 transition-all transform hover:scale-105 shadow-2xl mb-8">
            <Download className="inline mr-4" size={40} />
            GET IT NOW!
          </button>
          
          <div className="text-xl font-bold">
            ⏰ Join 50,000+ users who are already winning!
          </div>
        </div>
      </section>

      {/* Contact - Minimal */}
      <section className="py-12 px-6 bg-black/40 backdrop-blur-md">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="text-white">
              <h3 className="text-2xl font-black mb-4">NEED HELP?</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="text-yellow-400" size={20} />
                  <span className="font-semibold">help@quickapp.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="text-yellow-400" size={20} />
                  <span className="font-semibold">1-800-QUICK</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-black text-white mb-4">GET UPDATES</h3>
              <form onSubmit={handleSubmit} className="flex gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="flex-1 px-4 py-3 rounded-lg text-black font-semibold focus:outline-none focus:ring-4 focus:ring-yellow-400"
                  required
                />
                <button
                  type="submit"
                  className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-black hover:bg-yellow-300 transition-colors"
                >
                  GO!
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-8 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="text-yellow-400" size={28} />
            <span className="text-xl font-black">QuickApp</span>
          </div>
          <div className="text-gray-400 font-semibold">
            © 2024 QuickApp. GET RESULTS NOW!
          </div>
        </div>
      </footer>

      {/* Sticky Bottom CTA for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-yellow-400 text-black p-4 md:hidden z-50">
        <button className="w-full text-xl font-black py-3 bg-black text-yellow-400 rounded-lg">
          <Download className="inline mr-2" size={20} />
          GET APP NOW!
        </button>
      </div>
    </div>
  )
}

export default App
