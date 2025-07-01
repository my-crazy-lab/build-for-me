import { useState } from 'react'
import { Heart, Shield, Clock, Users, Star, Mail, Phone, CheckCircle } from 'lucide-react'

function App() {
  const [email, setEmail] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Email submitted:', email)
    setEmail('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="text-purple-600" size={28} />
              <span className="text-xl font-bold text-gray-900">HelpfulApp</span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <a href="#home" className="text-gray-600 hover:text-purple-600 transition-colors">Home</a>
              <a href="#benefits" className="text-gray-600 hover:text-purple-600 transition-colors">Benefits</a>
              <a href="#pricing" className="text-gray-600 hover:text-purple-600 transition-colors">Pricing</a>
              <a href="#contact" className="text-gray-600 hover:text-purple-600 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Problem Statement Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Tired of complicated software that wastes your time?
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            You're not alone. 73% of people struggle with overly complex tools that make simple tasks feel impossible.
          </p>
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-red-100 p-3 rounded-full">
                <Clock className="text-red-600" size={32} />
              </div>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Does this sound familiar?
            </h3>
            <ul className="text-left space-y-3 text-gray-600">
              <li className="flex items-start gap-3">
                <span className="text-red-500 mt-1">•</span>
                <span>Spending hours learning software instead of getting work done</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 mt-1">•</span>
                <span>Feeling frustrated with confusing interfaces and hidden features</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 mt-1">•</span>
                <span>Wishing there was a simpler way to accomplish your goals</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Solution Statement */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-12">
            <h2 className="text-4xl font-bold mb-6">
              What if there was a better way?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              HelpfulApp is designed for real people, not tech experts. We believe software should work for you, not against you.
            </p>
            <button className="bg-white text-purple-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors">
              Try Now - It's Free!
            </button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why people love HelpfulApp
            </h2>
            <p className="text-xl text-gray-600">
              Simple benefits that make a real difference in your daily life
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Save Time</h3>
              <p className="text-gray-600">Get things done 3x faster with our intuitive design. No learning curve required.</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-green-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Feel Confident</h3>
              <p className="text-gray-600">Clear instructions and helpful hints guide you every step of the way.</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="text-purple-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Reduce Stress</h3>
              <p className="text-gray-600">No more frustration. Everything works exactly as you'd expect it to.</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-yellow-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Get Support</h3>
              <p className="text-gray-600">Friendly human support when you need it. We're here to help, not hide.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What our users say</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-blue-50 rounded-xl p-6">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="text-yellow-400 fill-current" size={20} />
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">
                "Finally, software that doesn't make me feel stupid! I was able to get everything set up in just 5 minutes."
              </p>
              <div className="font-semibold text-gray-900">- Sarah M., Small Business Owner</div>
            </div>
            <div className="bg-purple-50 rounded-xl p-6">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="text-yellow-400 fill-current" size={20} />
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">
                "My team loves how easy this is to use. No more training sessions or confused employees!"
              </p>
              <div className="font-semibold text-gray-900">- Mike R., Team Manager</div>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Features */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything you need, nothing you don't</h2>
            <p className="text-lg text-gray-600">We focus on the features that actually matter to you</p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-4 bg-white rounded-lg p-4 shadow-sm">
              <CheckCircle className="text-green-500" size={24} />
              <span className="text-gray-700">One-click setup - no technical knowledge required</span>
            </div>
            <div className="flex items-center gap-4 bg-white rounded-lg p-4 shadow-sm">
              <CheckCircle className="text-green-500" size={24} />
              <span className="text-gray-700">Works on any device - phone, tablet, or computer</span>
            </div>
            <div className="flex items-center gap-4 bg-white rounded-lg p-4 shadow-sm">
              <CheckCircle className="text-green-500" size={24} />
              <span className="text-gray-700">Automatic backups - never lose your work again</span>
            </div>
            <div className="flex items-center gap-4 bg-white rounded-lg p-4 shadow-sm">
              <CheckCircle className="text-green-500" size={24} />
              <span className="text-gray-700">24/7 friendly support - real humans, not bots</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple, honest pricing</h2>
          <p className="text-xl text-gray-600 mb-12">No hidden fees, no surprises. Just great value.</p>
          
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8 max-w-md mx-auto">
            <h3 className="text-2xl font-bold mb-4">Everything Included</h3>
            <div className="text-5xl font-bold mb-2">$19</div>
            <div className="text-lg opacity-90 mb-6">per month</div>
            <ul className="text-left space-y-3 mb-8">
              <li className="flex items-center gap-3">
                <CheckCircle size={20} />
                <span>All features included</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle size={20} />
                <span>Unlimited usage</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle size={20} />
                <span>Priority support</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle size={20} />
                <span>30-day money-back guarantee</span>
              </li>
            </ul>
            <button className="w-full bg-white text-purple-600 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
              Start Your Free Trial
            </button>
            <p className="text-sm opacity-75 mt-3">No credit card required</p>
          </div>
        </div>
      </section>

      {/* Contact & Email Capture */}
      <section id="contact" className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Need help? We're here for you</h2>
              <p className="text-gray-600 mb-6">
                Have questions? Our friendly support team is ready to help you succeed.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="text-purple-600" size={20} />
                  <span className="text-gray-600">hello@helpfulapp.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="text-purple-600" size={20} />
                  <span className="text-gray-600">1-800-HELPFUL</span>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Get helpful tips</h2>
              <p className="text-gray-600 mb-6">
                Join thousands of users getting weekly tips to make their work easier.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                >
                  Get Updates
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Heart className="text-purple-400" size={28} />
            <span className="text-xl font-bold">HelpfulApp</span>
          </div>
          <p className="text-gray-400 mb-6">
            Making software simple and helpful for everyone.
          </p>
          <div className="text-gray-500 text-sm">
            © 2024 HelpfulApp. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
