import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, DollarSign, Users, Target, Download, Mail, Phone, Building2, ArrowUp, ArrowDown, Activity } from 'lucide-react'

function App() {
  const [email, setEmail] = useState('')
  const [metrics, setMetrics] = useState({
    revenue: 2847000,
    users: 15420,
    conversion: 23.4,
    growth: 47.2
  })

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        revenue: prev.revenue + Math.floor(Math.random() * 1000),
        users: prev.users + Math.floor(Math.random() * 10),
        conversion: prev.conversion + (Math.random() - 0.5) * 0.1,
        growth: prev.growth + (Math.random() - 0.5) * 0.2
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Email submitted:', email)
    setEmail('')
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation */}
      <nav className="bg-gray-800/50 backdrop-blur-md border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <BarChart3 className="text-white" size={20} />
              </div>
              <span className="text-xl font-bold">DataDash Pro</span>
            </motion.div>
            <div className="hidden md:flex items-center space-x-6">
              <a href="#dashboard" className="text-gray-300 hover:text-white transition-colors">Dashboard</a>
              <a href="#analytics" className="text-gray-300 hover:text-white transition-colors">Analytics</a>
              <a href="#reports" className="text-gray-300 hover:text-white transition-colors">Reports</a>
              <a href="#contact" className="text-gray-300 hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Dashboard */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                892% ROI
              </span>
              <br />
              in 12 Months
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Real-time analytics platform that Fortune 500 companies trust to drive data-driven decisions and maximize returns.
            </p>
          </motion.div>

          {/* Live Metrics Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { 
                title: "Revenue", 
                value: `$${(metrics.revenue / 1000000).toFixed(2)}M`, 
                change: "+12.5%", 
                icon: DollarSign, 
                color: "from-green-500 to-emerald-500",
                trend: "up"
              },
              { 
                title: "Active Users", 
                value: metrics.users.toLocaleString(), 
                change: "+8.3%", 
                icon: Users, 
                color: "from-blue-500 to-cyan-500",
                trend: "up"
              },
              { 
                title: "Conversion Rate", 
                value: `${metrics.conversion.toFixed(1)}%`, 
                change: "+15.7%", 
                icon: Target, 
                color: "from-purple-500 to-pink-500",
                trend: "up"
              },
              { 
                title: "Growth Rate", 
                value: `${metrics.growth.toFixed(1)}%`, 
                change: "+23.1%", 
                icon: TrendingUp, 
                color: "from-orange-500 to-red-500",
                trend: "up"
              }
            ].map((metric, index) => (
              <motion.div
                key={index}
                className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-2xl p-6 hover:bg-gray-800/70 transition-all"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${metric.color} rounded-xl flex items-center justify-center`}>
                    <metric.icon size={24} className="text-white" />
                  </div>
                  <div className="flex items-center gap-1 text-green-400">
                    <ArrowUp size={16} />
                    <span className="text-sm font-semibold">{metric.change}</span>
                  </div>
                </div>
                <div className="text-2xl font-bold mb-1">{metric.value}</div>
                <div className="text-gray-400 text-sm">{metric.title}</div>
                
                {/* Mini Chart */}
                <div className="mt-4 h-8 flex items-end justify-between">
                  {[...Array(7)].map((_, i) => (
                    <motion.div
                      key={i}
                      className={`bg-gradient-to-t ${metric.color} rounded-t`}
                      style={{ width: '8px' }}
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.random() * 100 + 20}%` }}
                      transition={{ duration: 1, delay: index * 0.1 + i * 0.1 }}
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Main Chart */}
          <motion.div 
            className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-2xl p-8 mb-12"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Revenue Growth Analytics</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-400">Revenue</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-400">Profit</span>
                </div>
              </div>
            </div>
            
            <div className="h-64 flex items-end justify-between gap-2">
              {[...Array(12)].map((_, i) => {
                const height1 = Math.random() * 80 + 20
                const height2 = Math.random() * 60 + 15
                return (
                  <div key={i} className="flex flex-col items-center gap-1 flex-1">
                    <motion.div
                      className="bg-gradient-to-t from-blue-600 to-blue-400 rounded-t w-full"
                      initial={{ height: 0 }}
                      animate={{ height: `${height1}%` }}
                      transition={{ duration: 1.5, delay: i * 0.1 }}
                    />
                    <motion.div
                      className="bg-gradient-to-t from-green-600 to-green-400 rounded-t w-full"
                      initial={{ height: 0 }}
                      animate={{ height: `${height2}%` }}
                      transition={{ duration: 1.5, delay: i * 0.1 + 0.2 }}
                    />
                    <span className="text-xs text-gray-500 mt-2">
                      {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]}
                    </span>
                  </div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Case Studies Dashboard */}
      <section id="analytics" className="py-16 px-6 bg-gray-800/30">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4">Client Success Analytics</h2>
            <p className="text-xl text-gray-300">Real data from real implementations</p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {[
              {
                company: "TechCorp Industries",
                industry: "Manufacturing",
                metrics: { roi: "847%", revenue: "$12.4M", efficiency: "67%" },
                chart: [45, 62, 78, 85, 92, 88]
              },
              {
                company: "Global Dynamics",
                industry: "Finance",
                metrics: { roi: "1,240%", revenue: "$8.7M", efficiency: "84%" },
                chart: [32, 48, 65, 79, 91, 95]
              }
            ].map((study, index) => (
              <motion.div
                key={index}
                className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-2xl p-8"
                initial={{ y: 100, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <Building2 size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{study.company}</h3>
                    <p className="text-gray-400">{study.industry}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{study.metrics.roi}</div>
                    <div className="text-sm text-gray-400">ROI</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">{study.metrics.revenue}</div>
                    <div className="text-sm text-gray-400">Revenue Increase</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">{study.metrics.efficiency}</div>
                    <div className="text-sm text-gray-400">Efficiency Gain</div>
                  </div>
                </div>

                <div className="h-24 flex items-end justify-between gap-1 mb-4">
                  {study.chart.map((value, i) => (
                    <motion.div
                      key={i}
                      className="bg-gradient-to-t from-blue-600 to-blue-400 rounded-t flex-1"
                      initial={{ height: 0 }}
                      whileInView={{ height: `${value}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      viewport={{ once: true }}
                    />
                  ))}
                </div>

                <motion.button 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all inline-flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Download size={20} />
                  Download Full Report
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Real-time Performance Metrics */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4">Live Performance Dashboard</h2>
            <p className="text-xl text-gray-300">Real-time insights across all metrics</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-2xl p-6"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">System Performance</h3>
                <Activity className="text-green-400" size={20} />
              </div>
              <div className="space-y-4">
                {[
                  { label: "CPU Usage", value: 67, color: "bg-blue-500" },
                  { label: "Memory", value: 45, color: "bg-green-500" },
                  { label: "Network", value: 89, color: "bg-purple-500" }
                ].map((metric, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">{metric.label}</span>
                      <span>{metric.value}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <motion.div
                        className={`${metric.color} h-2 rounded-full`}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${metric.value}%` }}
                        transition={{ duration: 1, delay: i * 0.2 }}
                        viewport={{ once: true }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-2xl p-6"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-semibold mb-4">Revenue Streams</h3>
              <div className="space-y-3">
                {[
                  { source: "Enterprise", amount: "$1.2M", percentage: 45 },
                  { source: "SMB", amount: "$890K", percentage: 33 },
                  { source: "Startup", amount: "$567K", percentage: 22 }
                ].map((stream, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{stream.source}</div>
                      <div className="text-sm text-gray-400">{stream.amount}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{stream.percentage}%</div>
                      <div className="w-16 bg-gray-700 rounded-full h-1">
                        <motion.div
                          className="bg-gradient-to-r from-blue-500 to-cyan-500 h-1 rounded-full"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${stream.percentage}%` }}
                          transition={{ duration: 1, delay: i * 0.2 }}
                          viewport={{ once: true }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-2xl p-6"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-semibold mb-4">Key Metrics</h3>
              <div className="space-y-4">
                {[
                  { label: "Customer Satisfaction", value: "98.7%", trend: "up" },
                  { label: "Churn Rate", value: "2.1%", trend: "down" },
                  { label: "NPS Score", value: "87", trend: "up" }
                ].map((metric, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-gray-400">{metric.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{metric.value}</span>
                      {metric.trend === "up" ? (
                        <ArrowUp className="text-green-400" size={16} />
                      ) : (
                        <ArrowDown className="text-red-400" size={16} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact & Demo Request */}
      <section id="contact" className="py-16 px-6 bg-gray-800/30">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-6">Ready to See Your Data Transform?</h2>
              <p className="text-gray-300 mb-8">
                Schedule a personalized demo and see how our analytics platform can drive your ROI to new heights.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <Mail size={20} />
                  </div>
                  <span>enterprise@datadash.pro</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                    <Phone size={20} />
                  </div>
                  <span>+1 (555) 123-4567</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-2xl p-8">
                <h3 className="text-2xl font-bold mb-6">Request Analytics Demo</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Business email address"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Company name"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <motion.button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-semibold"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Schedule Demo
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <motion.div 
              className="flex items-center gap-2 mb-4 md:mb-0"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <BarChart3 className="text-white" size={20} />
              </div>
              <span className="text-xl font-bold">DataDash Pro</span>
            </motion.div>
            <div className="text-gray-400">
              © 2024 DataDash Pro. Powering data-driven decisions.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
