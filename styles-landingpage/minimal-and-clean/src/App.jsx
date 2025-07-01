import { useState } from 'react'
import { Check, ArrowRight, Mail, Phone, Github, Twitter, Linkedin } from 'lucide-react'

function App() {
  const [email, setEmail] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Email submitted:', email)
    setEmail('')
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-xl font-semibold text-gray-900">
              CleanApp
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-gray-600 hover:text-gray-900 transition-colors">Home</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
              <a href="#docs" className="text-gray-600 hover:text-gray-900 transition-colors">Docs</a>
              <a href="#login" className="text-gray-600 hover:text-gray-900 transition-colors">Login</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Simple. Clean. Powerful.
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            The developer-first platform that eliminates complexity and focuses on what matters most - building great software.
          </p>
          <button className="bg-primary-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-primary-700 transition-colors inline-flex items-center gap-2">
            Start Free Trial
            <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Check className="text-primary-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Zero Configuration</h3>
              <p className="text-gray-600">Get started in seconds with our pre-configured setup. No complex configuration files or setup wizards.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Check className="text-primary-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Developer Focused</h3>
              <p className="text-gray-600">Built by developers, for developers. Clean APIs, comprehensive docs, and excellent developer experience.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Check className="text-primary-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Scale Effortlessly</h3>
              <p className="text-gray-600">From prototype to production, our platform grows with you. Handle millions of requests without breaking a sweat.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple Pricing</h2>
            <p className="text-xl text-gray-600">Choose the plan that works for you</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="border border-gray-200 rounded-lg p-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Starter</h3>
              <div className="text-4xl font-bold text-gray-900 mb-6">Free</div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <Check className="text-green-500" size={20} />
                  <span className="text-gray-600">Up to 1,000 requests/month</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="text-green-500" size={20} />
                  <span className="text-gray-600">Community support</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="text-green-500" size={20} />
                  <span className="text-gray-600">Basic analytics</span>
                </li>
              </ul>
              <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors">
                Get Started
              </button>
            </div>
            <div className="border-2 border-primary-600 rounded-lg p-8 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary-600 text-white px-4 py-1 rounded-full text-sm">
                Popular
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Pro</h3>
              <div className="text-4xl font-bold text-gray-900 mb-6">$29<span className="text-lg text-gray-600">/month</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <Check className="text-green-500" size={20} />
                  <span className="text-gray-600">Unlimited requests</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="text-green-500" size={20} />
                  <span className="text-gray-600">Priority support</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="text-green-500" size={20} />
                  <span className="text-gray-600">Advanced analytics</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="text-green-500" size={20} />
                  <span className="text-gray-600">Custom integrations</span>
                </li>
              </ul>
              <button className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors">
                Start Free Trial
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* About Product Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">About CleanApp</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            CleanApp was born from the frustration of dealing with overly complex development tools. 
            We believe that great software should be simple to build, deploy, and maintain. Our platform 
            removes the unnecessary complexity while providing all the power you need to create amazing applications.
          </p>
        </div>
      </section>

      {/* Contact & Email Capture Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Get in Touch</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="text-primary-600" size={20} />
                  <span className="text-gray-600">support@cleanapp.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="text-primary-600" size={20} />
                  <span className="text-gray-600">+1 (555) 123-4567</span>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Stay Updated</h2>
              <p className="text-gray-600 mb-6">Subscribe to our newsletter for the latest updates and features.</p>
              <form onSubmit={handleSubmit} className="flex gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
                <button
                  type="submit"
                  className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-xl font-semibold text-gray-900 mb-4 md:mb-0">
              CleanApp
            </div>
            <div className="flex items-center gap-6">
              <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                <Github size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-500">
            © 2024 CleanApp. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
