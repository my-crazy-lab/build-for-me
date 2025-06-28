import { useState } from 'react'
import { Terminal, Code, Github, Book, Moon, Sun, Copy, Check, ExternalLink, Star, Mail, MessageSquare } from 'lucide-react'

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [copiedCode, setCopiedCode] = useState('')
  const [email, setEmail] = useState('')

  const handleCopy = (code, id) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(''), 2000)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Email submitted:', email)
    setEmail('')
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'
    }`}>
      {/* Navigation */}
      <nav className={`border-b transition-colors ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="text-blue-500" size={28} />
              <span className="text-xl font-mono font-bold">DevAPI</span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <a href="#docs" className={`hover:text-blue-500 transition-colors ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>Documentation</a>
              <a href="#api" className={`hover:text-blue-500 transition-colors ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>API Reference</a>
              <a href="#examples" className={`hover:text-blue-500 transition-colors ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>Examples</a>
              <a href="#github" className={`hover:text-blue-500 transition-colors ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>GitHub</a>
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                }`}
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-mono font-bold mb-6 leading-tight">
                <span className="text-blue-500">API</span> for
                <br />
                Developers
              </h1>
              <p className="text-xl mb-8 leading-relaxed opacity-90">
                Clean, fast, and reliable API that developers actually want to use. 
                Get started in minutes with our comprehensive documentation and SDKs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-2">
                  <Book size={20} />
                  View Documentation
                </button>
                <button className={`border px-8 py-4 rounded-lg text-lg font-semibold transition-colors inline-flex items-center gap-2 ${
                  isDarkMode 
                    ? 'border-gray-600 hover:bg-gray-800' 
                    : 'border-gray-300 hover:bg-gray-100'
                }`}>
                  <Github size={20} />
                  View on GitHub
                </button>
              </div>
            </div>
            
            {/* Code Example */}
            <div className={`rounded-lg overflow-hidden border ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <div className={`px-4 py-3 border-b flex items-center justify-between ${
                isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-200'
              }`}>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="ml-2 text-sm font-mono">quick-start.js</span>
                </div>
                <button
                  onClick={() => handleCopy(`import { DevAPI } from '@devapi/sdk';

const api = new DevAPI('your-api-key');

// Get user data
const user = await api.users.get('123');
console.log(user.name);`, 'hero')}
                  className={`p-1 rounded transition-colors ${
                    isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                  }`}
                >
                  {copiedCode === 'hero' ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                </button>
              </div>
              <div className="p-4 font-mono text-sm">
                <div className="text-purple-400">import</div>
                <div className="text-gray-300">{'{'} DevAPI {'}'}</div>
                <div className="text-purple-400">from</div>
                <div className="text-green-400">'@devapi/sdk'</div>
                <div className="text-gray-500">;</div>
                <br />
                <div className="text-blue-400">const</div>
                <div className="text-gray-300">api =</div>
                <div className="text-blue-400">new</div>
                <div className="text-yellow-400">DevAPI</div>
                <div className="text-gray-300">(</div>
                <div className="text-green-400">'your-api-key'</div>
                <div className="text-gray-300">);</div>
                <br />
                <div className="text-gray-500">// Get user data</div>
                <div className="text-blue-400">const</div>
                <div className="text-gray-300">user =</div>
                <div className="text-blue-400">await</div>
                <div className="text-gray-300">api.users.</div>
                <div className="text-yellow-400">get</div>
                <div className="text-gray-300">(</div>
                <div className="text-green-400">'123'</div>
                <div className="text-gray-300">);</div>
                <br />
                <div className="text-gray-300">console.</div>
                <div className="text-yellow-400">log</div>
                <div className="text-gray-300">(user.name);</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Start CLI */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-mono font-bold text-center mb-12">Get Started in Seconds</h2>
          
          <div className={`rounded-lg overflow-hidden border ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className={`px-4 py-3 border-b flex items-center justify-between ${
              isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-200'
            }`}>
              <div className="flex items-center gap-2">
                <Terminal size={16} />
                <span className="text-sm font-mono">Terminal</span>
              </div>
              <button
                onClick={() => handleCopy('npm install @devapi/sdk', 'cli')}
                className={`p-1 rounded transition-colors ${
                  isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                }`}
              >
                {copiedCode === 'cli' ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
              </button>
            </div>
            <div className="p-4 font-mono text-sm">
              <div className="text-green-400">$ npm install @devapi/sdk</div>
              <div className="text-gray-500 mt-2">✓ Package installed successfully</div>
              <div className="text-gray-500">✓ Ready to use in your project</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features for Developers */}
      <section id="docs" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-mono font-bold mb-4">Built for Developers</h2>
            <p className="text-xl opacity-90">Everything you need to build amazing applications</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className={`rounded-lg p-6 border ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Code className="text-blue-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Clean SDKs</h3>
              <p className="opacity-80 mb-4">
                TypeScript-first SDKs for JavaScript, Python, Go, and more. 
                Full type safety and excellent IntelliSense support.
              </p>
              <a href="#" className="text-blue-500 hover:text-blue-400 inline-flex items-center gap-1">
                View SDKs <ExternalLink size={16} />
              </a>
            </div>
            
            <div className={`rounded-lg p-6 border ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Book className="text-green-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Comprehensive Docs</h3>
              <p className="opacity-80 mb-4">
                Interactive API reference, code examples, and step-by-step guides. 
                Everything is searchable and up-to-date.
              </p>
              <a href="#" className="text-blue-500 hover:text-blue-400 inline-flex items-center gap-1">
                Read Docs <ExternalLink size={16} />
              </a>
            </div>
            
            <div className={`rounded-lg p-6 border ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Github className="text-purple-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Open Source</h3>
              <p className="opacity-80 mb-4">
                All our SDKs and tools are open source. Contribute, report issues, 
                or fork for your own projects.
              </p>
              <a href="#" className="text-blue-500 hover:text-blue-400 inline-flex items-center gap-1">
                GitHub <ExternalLink size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* API Reference Preview */}
      <section id="api" className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-mono font-bold text-center mb-12">API Reference</h2>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Sidebar */}
            <div className={`rounded-lg border p-6 ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <h3 className="font-semibold mb-4">Endpoints</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 p-2 rounded bg-blue-500/10 text-blue-500">
                  <span className="font-mono text-xs bg-green-500 text-white px-2 py-1 rounded">GET</span>
                  <span>/api/users</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                  <span className="font-mono text-xs bg-blue-500 text-white px-2 py-1 rounded">POST</span>
                  <span>/api/users</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                  <span className="font-mono text-xs bg-yellow-500 text-white px-2 py-1 rounded">PUT</span>
                  <span>/api/users/:id</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                  <span className="font-mono text-xs bg-red-500 text-white px-2 py-1 rounded">DEL</span>
                  <span>/api/users/:id</span>
                </div>
              </div>
            </div>
            
            {/* API Details */}
            <div className={`rounded-lg border p-6 ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <div className="flex items-center gap-2 mb-4">
                <span className="font-mono text-xs bg-green-500 text-white px-2 py-1 rounded">GET</span>
                <span className="font-mono">/api/users</span>
              </div>
              <p className="opacity-80 mb-4">Retrieve a list of users with optional filtering and pagination.</p>
              
              <h4 className="font-semibold mb-2">Parameters</h4>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="font-mono">limit</span>
                  <span className="opacity-60">integer (optional)</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-mono">offset</span>
                  <span className="opacity-60">integer (optional)</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-mono">filter</span>
                  <span className="opacity-60">string (optional)</span>
                </div>
              </div>
              
              <h4 className="font-semibold mb-2">Response</h4>
              <div className={`rounded p-3 font-mono text-xs ${
                isDarkMode ? 'bg-gray-900' : 'bg-gray-100'
              }`}>
                <div className="text-gray-500">{'{'}</div>
                <div className="ml-2">
                  <span className="text-blue-400">"users"</span>: [
                  <div className="ml-2">
                    <div className="text-gray-500">{'{'}</div>
                    <div className="ml-2">
                      <span className="text-blue-400">"id"</span>: <span className="text-green-400">"123"</span>,<br />
                      <span className="text-blue-400">"name"</span>: <span className="text-green-400">"John Doe"</span>,<br />
                      <span className="text-blue-400">"email"</span>: <span className="text-green-400">"john@example.com"</span>
                    </div>
                    <div className="text-gray-500">{'}'}</div>
                  </div>
                  ],<br />
                  <span className="text-blue-400">"total"</span>: <span className="text-yellow-400">1</span>
                </div>
                <div className="text-gray-500">{'}'}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing for Developers */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-mono font-bold mb-4">Developer-Friendly Pricing</h2>
            <p className="text-xl opacity-90">Start free, scale as you grow</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className={`rounded-lg border p-8 ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <h3 className="text-2xl font-semibold mb-4">Free Tier</h3>
              <div className="text-4xl font-bold mb-6">$0<span className="text-lg opacity-60">/month</span></div>
              <ul className="space-y-3 mb-8 opacity-80">
                <li>• 10,000 API calls/month</li>
                <li>• All endpoints included</li>
                <li>• Community support</li>
                <li>• Rate limiting: 100/min</li>
              </ul>
              <button className={`w-full border py-3 rounded-lg font-semibold transition-colors ${
                isDarkMode 
                  ? 'border-gray-600 hover:bg-gray-700' 
                  : 'border-gray-300 hover:bg-gray-100'
              }`}>
                Get API Key
              </button>
            </div>
            
            <div className={`rounded-lg border-2 border-blue-500 p-8 relative ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm">
                Popular
              </div>
              <h3 className="text-2xl font-semibold mb-4">Pro</h3>
              <div className="text-4xl font-bold mb-6">$49<span className="text-lg opacity-60">/month</span></div>
              <ul className="space-y-3 mb-8 opacity-80">
                <li>• 1M API calls/month</li>
                <li>• Priority support</li>
                <li>• Advanced analytics</li>
                <li>• Rate limiting: 1000/min</li>
                <li>• Webhook support</li>
                <li>• Custom integrations</li>
              </ul>
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Start Free Trial
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Support */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-mono font-bold mb-6">Developer Support</h2>
              <p className="opacity-80 mb-8">
                Get help from our team of developers who understand your challenges.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="text-blue-500" size={20} />
                  <span>developers@devapi.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <MessageSquare className="text-blue-500" size={20} />
                  <span>Discord Community</span>
                </div>
                <div className="flex items-center gap-3">
                  <Github className="text-blue-500" size={20} />
                  <span>GitHub Issues</span>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-mono font-bold mb-6">Stay Updated</h2>
              <p className="opacity-80 mb-6">
                Get notified about API updates, new features, and developer resources.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@company.com"
                  className={`w-full px-4 py-3 rounded-lg border font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDarkMode 
                      ? 'bg-gray-800 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Subscribe to Updates
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`border-t py-12 px-6 ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Terminal className="text-blue-500" size={28} />
              <span className="text-xl font-mono font-bold">DevAPI</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="#" className="opacity-60 hover:opacity-100 transition-opacity">
                <Github size={20} />
              </a>
              <a href="#" className="opacity-60 hover:opacity-100 transition-opacity">
                <Star size={20} />
              </a>
            </div>
          </div>
          <div className={`mt-8 pt-8 border-t text-center text-sm ${
            isDarkMode ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-600'
          }`}>
            © 2024 DevAPI. Built by developers, for developers.
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
