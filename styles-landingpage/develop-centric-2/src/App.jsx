import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Terminal, Code, Download, Mail, Phone, Github, Star, Copy, Check } from 'lucide-react'

function App() {
  const [currentCommand, setCurrentCommand] = useState('')
  const [terminalOutput, setTerminalOutput] = useState([])
  const [email, setEmail] = useState('')
  const [copiedCode, setCopiedCode] = useState('')

  const commands = [
    'npm install hackapi',
    'hackapi --init',
    'hackapi deploy --production',
    'hackapi status --all'
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      const randomCommand = commands[Math.floor(Math.random() * commands.length)]
      setCurrentCommand(randomCommand)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

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
    <div className="min-h-screen bg-black text-neon-green font-mono relative overflow-hidden">
      {/* Matrix Rain Effect */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-neon-green text-xs"
            style={{ left: `${i * 5}%` }}
            animate={{
              y: ['-100vh', '100vh'],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 2
            }}
          >
            {Array.from({ length: 50 }, () => 
              String.fromCharCode(Math.random() * (126 - 33) + 33)
            ).join('')}
          </motion.div>
        ))}
      </div>

      {/* Terminal Header */}
      <motion.header 
        className="bg-gray-900 border-b border-neon-green/30 p-4 relative z-10"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-neon-green rounded-full"></div>
              </div>
              <Terminal className="text-neon-green" size={20} />
              <span className="text-lg font-bold">root@hackapi:~$</span>
            </motion.div>
            <div className="hidden md:flex items-center space-x-6 text-sm">
              <a href="#docs" className="text-neon-green/80 hover:text-neon-green transition-colors">./docs</a>
              <a href="#api" className="text-neon-green/80 hover:text-neon-green transition-colors">./api</a>
              <a href="#examples" className="text-neon-green/80 hover:text-neon-green transition-colors">./examples</a>
              <a href="#github" className="text-neon-green/80 hover:text-neon-green transition-colors">./github</a>
            </div>
          </div>
        </div>
      </motion.header>

      {/* ASCII Art Hero */}
      <section className="py-12 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <pre className="text-neon-green text-xs md:text-sm leading-tight mb-8 overflow-x-auto">
{`
██╗  ██╗ █████╗  ██████╗██╗  ██╗ █████╗ ██████╗ ██╗
██║  ██║██╔══██╗██╔════╝██║ ██╔╝██╔══██╗██╔══██╗██║
███████║███████║██║     █████╔╝ ███████║██████╔╝██║
██╔══██║██╔══██║██║     ██╔═██╗ ██╔══██║██╔═══╝ ██║
██║  ██║██║  ██║╚██████╗██║  ██╗██║  ██║██║     ██║
╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝
`}
            </pre>
            
            <motion.div 
              className="text-lg mb-8"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-neon-green">></span> THE ULTIMATE HACKER'S API TOOLKIT
            </motion.div>
            
            <motion.p 
              className="text-neon-green/80 text-lg max-w-3xl mx-auto mb-8"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              [CLASSIFIED] Military-grade API framework for elite developers. 
              Penetrate any system. Extract any data. Leave no trace.
            </motion.p>
          </motion.div>

          {/* Live Terminal */}
          <motion.div 
            className="bg-gray-900 border border-neon-green/50 rounded-lg overflow-hidden max-w-4xl mx-auto"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <div className="bg-gray-800 px-4 py-2 border-b border-neon-green/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal size={16} className="text-neon-green" />
                <span className="text-sm">hackapi-terminal</span>
              </div>
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-neon-green rounded-full"></div>
              </div>
            </div>
            
            <div className="p-6 h-64 overflow-y-auto">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-neon-green">root@hackapi:~$</span>
                  <motion.span
                    key={currentCommand}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-white"
                  >
                    {currentCommand}
                  </motion.span>
                  <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="text-neon-green"
                  >
                    █
                  </motion.span>
                </div>
                
                <div className="text-neon-green/80 text-sm">
                  <div>[INFO] Initializing secure connection...</div>
                  <div>[SUCCESS] Authentication bypassed</div>
                  <div>[INFO] Injecting payload...</div>
                  <div>[SUCCESS] System compromised</div>
                  <div>[INFO] Data extraction complete</div>
                  <div className="text-neon-green">[READY] Awaiting next command...</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Code Examples */}
      <section className="py-16 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-neon-green mb-4">
              <span className="text-neon-green">></span> EXPLOIT EXAMPLES
            </h2>
            <p className="text-neon-green/80">Real code. Real results. Real dangerous.</p>
          </motion.div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* SQL Injection Example */}
            <motion.div 
              className="bg-gray-900 border border-neon-green/50 rounded-lg overflow-hidden"
              initial={{ x: -100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="bg-gray-800 px-4 py-2 border-b border-neon-green/30 flex items-center justify-between">
                <span className="text-sm text-neon-green">sql_injection.js</span>
                <button
                  onClick={() => handleCopy(`const hackapi = require('hackapi');

// SQL Injection payload
const payload = "'; DROP TABLE users; --";

hackapi.inject({
  target: 'vulnerable-site.com',
  payload: payload,
  method: 'POST'
}).then(result => {
  console.log('[PWNED]', result);
});`, 'sql')}
                  className="text-neon-green/60 hover:text-neon-green transition-colors"
                >
                  {copiedCode === 'sql' ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
              <div className="p-4 text-sm">
                <div className="text-purple-400">const</div>
                <div className="text-white ml-2">hackapi = </div>
                <div className="text-blue-400">require</div>
                <div className="text-white">(</div>
                <div className="text-green-400">'hackapi'</div>
                <div className="text-white">);</div>
                <br />
                <div className="text-gray-500">// SQL Injection payload</div>
                <div className="text-purple-400">const</div>
                <div className="text-white ml-2">payload = </div>
                <div className="text-green-400">"'; DROP TABLE users; --"</div>
                <div className="text-white">;</div>
                <br />
                <div className="text-white">hackapi.</div>
                <div className="text-yellow-400">inject</div>
                <div className="text-white">({</div>
                <div className="text-white ml-2">target: </div>
                <div className="text-green-400">'vulnerable-site.com'</div>
                <div className="text-white">,</div>
                <div className="text-white ml-2">payload: payload,</div>
                <div className="text-white ml-2">method: </div>
                <div className="text-green-400">'POST'</div>
                <div className="text-white">}).</div>
                <div className="text-yellow-400">then</div>
                <div className="text-white">(result => {</div>
                <div className="text-white ml-2">console.</div>
                <div className="text-yellow-400">log</div>
                <div className="text-white">(</div>
                <div className="text-green-400">'[PWNED]'</div>
                <div className="text-white">, result);</div>
                <div className="text-white">});</div>
              </div>
            </motion.div>

            {/* XSS Example */}
            <motion.div 
              className="bg-gray-900 border border-neon-green/50 rounded-lg overflow-hidden"
              initial={{ x: 100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="bg-gray-800 px-4 py-2 border-b border-neon-green/30 flex items-center justify-between">
                <span className="text-sm text-neon-green">xss_exploit.js</span>
                <button
                  onClick={() => handleCopy(`// XSS payload injection
hackapi.xss({
  target: 'victim-site.com',
  payload: '<script>alert("HACKED")</script>',
  stealth: true
}).execute();

// Cookie harvesting
hackapi.harvest.cookies({
  domain: '.target.com',
  output: './stolen_cookies.txt'
});`, 'xss')}
                  className="text-neon-green/60 hover:text-neon-green transition-colors"
                >
                  {copiedCode === 'xss' ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
              <div className="p-4 text-sm">
                <div className="text-gray-500">// XSS payload injection</div>
                <div className="text-white">hackapi.</div>
                <div className="text-yellow-400">xss</div>
                <div className="text-white">({</div>
                <div className="text-white ml-2">target: </div>
                <div className="text-green-400">'victim-site.com'</div>
                <div className="text-white">,</div>
                <div className="text-white ml-2">payload: </div>
                <div className="text-green-400">'&lt;script&gt;alert("HACKED")&lt;/script&gt;'</div>
                <div className="text-white">,</div>
                <div className="text-white ml-2">stealth: </div>
                <div className="text-blue-400">true</div>
                <div className="text-white">}).</div>
                <div className="text-yellow-400">execute</div>
                <div className="text-white">();</div>
                <br />
                <div className="text-gray-500">// Cookie harvesting</div>
                <div className="text-white">hackapi.harvest.</div>
                <div className="text-yellow-400">cookies</div>
                <div className="text-white">({</div>
                <div className="text-white ml-2">domain: </div>
                <div className="text-green-400">'.target.com'</div>
                <div className="text-white">,</div>
                <div className="text-white ml-2">output: </div>
                <div className="text-green-400">'./stolen_cookies.txt'</div>
                <div className="text-white">});</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Matrix */}
      <section className="py-16 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-neon-green mb-4">
              <span className="text-neon-green">></span> ARSENAL OVERVIEW
            </h2>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "SQL INJECTION", desc: "Bypass authentication", icon: "💉" },
              { title: "XSS EXPLOITS", desc: "Client-side attacks", icon: "🔥" },
              { title: "DDOS TOOLS", desc: "Traffic amplification", icon: "💥" },
              { title: "STEGANOGRAPHY", desc: "Hidden data channels", icon: "👁️" }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-gray-900 border border-neon-green/30 p-6 text-center hover:border-neon-green/60 transition-all"
                initial={{ y: 100, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-bold text-neon-green mb-2">{feature.title}</h3>
                <p className="text-neon-green/70 text-sm">{feature.desc}</p>
                <div className="mt-4 text-xs text-neon-green/50">
                  [STATUS: OPERATIONAL]
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Installation */}
      <section className="py-16 px-6 bg-gray-900/50 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-neon-green mb-4">
              <span className="text-neon-green">></span> INSTALLATION PROTOCOL
            </h2>
            <p className="text-neon-green/80">WARNING: Use at your own risk</p>
          </motion.div>
          
          <motion.div 
            className="bg-black border border-neon-green/50 rounded-lg overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="bg-gray-800 px-4 py-2 border-b border-neon-green/30 flex items-center justify-between">
              <span className="text-sm text-neon-green">install.sh</span>
              <button
                onClick={() => handleCopy(`# WARNING: CLASSIFIED INSTALLATION
curl -fsSL https://hackapi.dev/install.sh | sudo bash

# Initialize stealth mode
hackapi --init --stealth

# Verify installation
hackapi --version --verify-integrity`, 'install')}
                className="text-neon-green/60 hover:text-neon-green transition-colors"
              >
                {copiedCode === 'install' ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
            <div className="p-6">
              <div className="text-gray-500 mb-2"># WARNING: CLASSIFIED INSTALLATION</div>
              <div className="text-white mb-4">
                <span className="text-yellow-400">curl</span> -fsSL https://hackapi.dev/install.sh | 
                <span className="text-red-400"> sudo bash</span>
              </div>
              
              <div className="text-gray-500 mb-2"># Initialize stealth mode</div>
              <div className="text-white mb-4">
                <span className="text-neon-green">hackapi</span> --init --stealth
              </div>
              
              <div className="text-gray-500 mb-2"># Verify installation</div>
              <div className="text-white">
                <span className="text-neon-green">hackapi</span> --version --verify-integrity
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-neon-green mb-8">
              <span className="text-neon-green">></span> ACCESS LEVELS
            </h2>
            
            <div className="bg-gray-900 border border-neon-green/50 rounded-lg p-8 max-w-md mx-auto">
              <div className="text-center mb-6">
                <div className="text-4xl mb-2">💀</div>
                <h3 className="text-xl font-bold text-neon-green mb-2">ELITE HACKER</h3>
                <div className="text-3xl font-bold text-white mb-2">$99</div>
                <div className="text-neon-green/70">/month</div>
              </div>
              
              <div className="space-y-3 mb-8 text-left">
                {[
                  "Unlimited exploits",
                  "Zero-day access", 
                  "Stealth mode",
                  "24/7 dark web support",
                  "Custom payloads",
                  "Encrypted channels"
                ].map((feature, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-center gap-3"
                    initial={{ x: -20, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <span className="text-neon-green">></span>
                    <span className="text-white">{feature}</span>
                  </motion.div>
                ))}
              </div>
              
              <motion.button 
                className="w-full bg-neon-green text-black py-3 font-bold hover:bg-neon-green/80 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                [INITIATE ACCESS]
              </motion.button>
              <p className="text-xs text-neon-green/50 mt-3">
                ⚠️ DISCLAIMER: For educational purposes only
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-xl font-bold text-neon-green mb-6">
                <span className="text-neon-green">></span> SECURE CHANNELS
              </h2>
              <p className="text-neon-green/80 mb-8">
                Need to establish contact? Use encrypted channels only. 
                We monitor all communications for security breaches.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="text-neon-green" size={20} />
                  <span className="text-white">encrypted@hackapi.dev</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="text-neon-green" size={20} />
                  <span className="text-white">+1-800-HACK-API</span>
                </div>
                <div className="flex items-center gap-3">
                  <Github className="text-neon-green" size={20} />
                  <span className="text-white">github.com/hackapi</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="bg-gray-900 border border-neon-green/50 rounded-lg p-6">
                <h3 className="text-lg font-bold text-neon-green mb-6">
                  [ENCRYPTED TRANSMISSION]
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.encrypted@email.com"
                    className="w-full px-4 py-3 bg-black border border-neon-green/50 text-neon-green placeholder-neon-green/50 focus:outline-none focus:ring-2 focus:ring-neon-green"
                    required
                  />
                  <motion.button
                    type="submit"
                    className="w-full bg-neon-green text-black py-3 font-bold hover:bg-neon-green/80 transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    [TRANSMIT]
                  </motion.button>
                </form>
                <p className="text-xs text-neon-green/50 mt-4">
                  🔒 All transmissions are encrypted with military-grade AES-256
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-neon-green/30 py-8 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <motion.div 
              className="flex items-center gap-3 mb-4 md:mb-0"
              whileHover={{ scale: 1.05 }}
            >
              <Terminal className="text-neon-green" size={20} />
              <span className="text-lg font-bold">root@hackapi:~$</span>
            </motion.div>
            <div className="text-neon-green/60 text-center">
              <p>© 2024 HACKAPI. ALL SYSTEMS COMPROMISED.</p>
              <p className="text-xs mt-1">⚠️ FOR EDUCATIONAL PURPOSES ONLY</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
