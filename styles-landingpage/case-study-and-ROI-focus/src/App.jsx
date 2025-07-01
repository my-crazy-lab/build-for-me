import { useState } from 'react'
import { TrendingUp, Download, Users, DollarSign, BarChart3, Award, Mail, Phone, Building2, ArrowRight } from 'lucide-react'

function App() {
  const [email, setEmail] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: ''
  })

  const handleNewsletterSubmit = (e) => {
    e.preventDefault()
    console.log('Newsletter email submitted:', email)
    setEmail('')
  }

  const handleDemoRequest = (e) => {
    e.preventDefault()
    console.log('Demo request submitted:', formData)
    setFormData({ name: '', company: '', email: '', phone: '' })
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-navy-900 text-white">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="text-blue-400" size={28} />
              <span className="text-xl font-bold">ROI Solutions</span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <a href="#home" className="hover:text-blue-400 transition-colors">Home</a>
              <a href="#case-studies" className="hover:text-blue-400 transition-colors">Case Studies</a>
              <a href="#roi" className="hover:text-blue-400 transition-colors">ROI Calculator</a>
              <a href="#contact" className="hover:text-blue-400 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with ROI Focus */}
      <section className="py-20 px-6 bg-gradient-to-r from-navy-900 to-navy-800 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                <span className="text-blue-400">347%</span> Average ROI
              </h1>
              <p className="text-xl mb-8 text-gray-300">
                Fortune 500 companies trust our platform to deliver measurable results. 
                See how we've helped businesses like yours achieve unprecedented growth.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-2">
                  Request Demo
                  <ArrowRight size={20} />
                </button>
                <button className="border border-gray-400 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-navy-900 transition-colors inline-flex items-center gap-2">
                  <Download size={20} />
                  Download Case Study
                </button>
              </div>
            </div>
            <div className="bg-white rounded-xl p-8 text-gray-900">
              <h3 className="text-2xl font-bold mb-6 text-center">ROI Calculator</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-600">Current Annual Revenue</span>
                  <span className="font-bold text-xl">$2.5M</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-600">Projected Increase</span>
                  <span className="font-bold text-xl text-green-600">+23%</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-600">Implementation Cost</span>
                  <span className="font-bold text-xl">$45K</span>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 mt-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-semibold">12-Month ROI</span>
                    <span className="font-bold text-3xl text-blue-600">1,183%</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">Based on average client results</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Client Logos */}
      <section className="py-12 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-gray-600 mb-8">Trusted by industry leaders</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center opacity-60">
            <div className="bg-gray-300 h-12 rounded flex items-center justify-center">
              <span className="font-bold text-gray-600">ACME Corp</span>
            </div>
            <div className="bg-gray-300 h-12 rounded flex items-center justify-center">
              <span className="font-bold text-gray-600">TechFlow</span>
            </div>
            <div className="bg-gray-300 h-12 rounded flex items-center justify-center">
              <span className="font-bold text-gray-600">GlobalTech</span>
            </div>
            <div className="bg-gray-300 h-12 rounded flex items-center justify-center">
              <span className="font-bold text-gray-600">InnovateCo</span>
            </div>
            <div className="bg-gray-300 h-12 rounded flex items-center justify-center">
              <span className="font-bold text-gray-600">FutureSys</span>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section id="case-studies" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Proven Results</h2>
            <p className="text-xl text-gray-600">Real companies, real results, real ROI</p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Case Study 1 */}
            <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-blue-100 p-3 rounded-full">
                  <TrendingUp className="text-blue-600" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">TechFlow Industries</h3>
                  <p className="text-gray-600">Manufacturing • 500+ employees</p>
                </div>
              </div>
              
              <blockquote className="text-lg text-gray-700 mb-6 italic">
                "ROI Solutions transformed our operations. We saw a 340% return on investment 
                within the first year, with productivity increases across all departments."
              </blockquote>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">340%</div>
                  <div className="text-sm text-gray-600">ROI</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">45%</div>
                  <div className="text-sm text-gray-600">Efficiency Gain</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">$2.1M</div>
                  <div className="text-sm text-gray-600">Cost Savings</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src="https://via.placeholder.com/40x40" alt="CEO" className="rounded-full" />
                  <div>
                    <div className="font-semibold text-gray-900">Sarah Johnson</div>
                    <div className="text-sm text-gray-600">CEO, TechFlow</div>
                  </div>
                </div>
                <button className="text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center gap-1">
                  <Download size={16} />
                  Full Case Study
                </button>
              </div>
            </div>

            {/* Case Study 2 */}
            <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-green-100 p-3 rounded-full">
                  <BarChart3 className="text-green-600" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">GlobalTech Solutions</h3>
                  <p className="text-gray-600">Software • 1200+ employees</p>
                </div>
              </div>
              
              <blockquote className="text-lg text-gray-700 mb-6 italic">
                "The implementation was seamless and the results exceeded our expectations. 
                We're now processing 3x more data with the same team size."
              </blockquote>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">425%</div>
                  <div className="text-sm text-gray-600">ROI</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">300%</div>
                  <div className="text-sm text-gray-600">Data Processing</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">$5.2M</div>
                  <div className="text-sm text-gray-600">Revenue Increase</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src="https://via.placeholder.com/40x40" alt="CTO" className="rounded-full" />
                  <div>
                    <div className="font-semibold text-gray-900">Michael Chen</div>
                    <div className="text-sm text-gray-600">CTO, GlobalTech</div>
                  </div>
                </div>
                <button className="text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center gap-1">
                  <Download size={16} />
                  Full Case Study
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data Visualization Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">By the Numbers</h2>
            <p className="text-lg text-gray-600">Our track record speaks for itself</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="bg-white rounded-xl p-6 text-center shadow-lg">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="text-blue-600" size={32} />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">$127M</div>
              <div className="text-gray-600">Total Client Savings</div>
            </div>
            
            <div className="bg-white rounded-xl p-6 text-center shadow-lg">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="text-green-600" size={32} />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">347%</div>
              <div className="text-gray-600">Average ROI</div>
            </div>
            
            <div className="bg-white rounded-xl p-6 text-center shadow-lg">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-purple-600" size={32} />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">250+</div>
              <div className="text-gray-600">Enterprise Clients</div>
            </div>
            
            <div className="bg-white rounded-xl p-6 text-center shadow-lg">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="text-yellow-600" size={32} />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">98%</div>
              <div className="text-gray-600">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Enterprise Solutions</h2>
          <p className="text-xl text-gray-600 mb-12">Custom pricing based on your specific needs and scale</p>
          
          <div className="bg-gradient-to-r from-navy-900 to-navy-800 text-white rounded-2xl p-12">
            <h3 className="text-3xl font-bold mb-6">Ready to see your ROI?</h3>
            <p className="text-xl mb-8 text-gray-300">
              Schedule a consultation with our ROI specialists to discuss your custom implementation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors">
                Schedule Consultation
              </button>
              <button className="border border-gray-400 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-navy-900 transition-colors">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Demo Request */}
      <section id="contact" className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Get Your Custom ROI Analysis</h2>
              <p className="text-gray-600 mb-8">
                Our team will analyze your current operations and provide a detailed ROI projection 
                based on your specific business requirements.
              </p>
              
              <form onSubmit={handleDemoRequest} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Company"
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="email"
                    placeholder="Business Email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Request Demo & ROI Analysis
                </button>
              </form>
            </div>
            
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Mail className="text-blue-600 mt-1" size={20} />
                  <div>
                    <div className="font-semibold text-gray-900">Email</div>
                    <div className="text-gray-600">enterprise@roisolutions.com</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone className="text-blue-600 mt-1" size={20} />
                  <div>
                    <div className="font-semibold text-gray-900">Phone</div>
                    <div className="text-gray-600">+1 (555) 123-4567</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Building2 className="text-blue-600 mt-1" size={20} />
                  <div>
                    <div className="font-semibold text-gray-900">Address</div>
                    <div className="text-gray-600">
                      123 Business District<br />
                      New York, NY 10001
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Stay Updated</h3>
                <form onSubmit={handleNewsletterSubmit} className="flex gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy-900 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Building2 className="text-blue-400" size={28} />
              <span className="text-xl font-bold">ROI Solutions</span>
            </div>
            <div className="text-gray-400">
              © 2024 ROI Solutions. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
