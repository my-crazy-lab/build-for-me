import { useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Quote, Camera, Award, Mail, Phone, Linkedin, Twitter, Instagram, MapPin, Calendar, Users } from 'lucide-react'

function App() {
  const [email, setEmail] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Email submitted:', email)
    setEmail('')
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Magazine Header */}
      <header className="border-b-4 border-black py-6 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center gap-4"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-12 h-12 bg-black text-white rounded-none flex items-center justify-center">
                <BookOpen size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight">VISIONARY</h1>
                <p className="text-sm uppercase tracking-widest text-gray-600">MAGAZINE</p>
              </div>
            </motion.div>
            <div className="hidden md:flex items-center space-x-8 text-sm uppercase tracking-wide font-semibold">
              <a href="#story" className="hover:text-red-600 transition-colors">Story</a>
              <a href="#founder" className="hover:text-red-600 transition-colors">Founder</a>
              <a href="#team" className="hover:text-red-600 transition-colors">Team</a>
              <a href="#contact" className="hover:text-red-600 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Magazine Cover */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <div className="text-sm uppercase tracking-widest text-red-600 font-bold mb-4">
                COVER STORY
              </div>
              <h1 className="text-6xl md:text-7xl font-black leading-none mb-6">
                THE MIND
                <br />
                BEHIND THE
                <br />
                <span className="text-red-600">REVOLUTION</span>
              </h1>
              <div className="w-24 h-1 bg-black mb-6"></div>
              <p className="text-xl leading-relaxed text-gray-700 mb-8">
                An exclusive interview with Elena Rodriguez, the visionary entrepreneur 
                who's reshaping how we think about technology, humanity, and the future.
              </p>
              <div className="flex items-center gap-6 text-sm uppercase tracking-wide font-semibold">
                <span>Issue #47</span>
                <span>•</span>
                <span>December 2024</span>
                <span>•</span>
                <span>12 min read</span>
              </div>
            </motion.div>
            
            {/* Magazine Cover */}
            <motion.div 
              className="relative"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-8 shadow-2xl">
                <div className="bg-white p-8 shadow-lg">
                  <div className="text-center mb-6">
                    <div className="text-xs uppercase tracking-widest font-bold text-red-600 mb-2">
                      VISIONARY MAGAZINE
                    </div>
                    <div className="text-2xl font-black mb-4">DECEMBER 2024</div>
                  </div>
                  
                  <div className="relative mb-6">
                    <img 
                      src="https://via.placeholder.com/300x400" 
                      alt="Elena Rodriguez" 
                      className="w-full h-64 object-cover grayscale"
                    />
                    <div className="absolute bottom-4 left-4 bg-white/90 p-3">
                      <div className="text-lg font-black">ELENA</div>
                      <div className="text-lg font-black">RODRIGUEZ</div>
                      <div className="text-xs uppercase tracking-wide">CEO & FOUNDER</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-xs">
                    <div className="font-bold uppercase tracking-wide">INSIDE THIS ISSUE:</div>
                    <div>• The $50M Journey</div>
                    <div>• Building Remote Teams</div>
                    <div>• Future of Work</div>
                    <div>• Exclusive Photos</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-16 px-6 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Quote size={48} className="mx-auto mb-8 text-red-600" />
            <blockquote className="text-3xl md:text-4xl font-light leading-relaxed mb-8 italic">
              "I didn't set out to change the world. I just wanted to solve a problem 
              that kept me awake at night. The world-changing part was a beautiful accident."
            </blockquote>
            <div className="text-lg uppercase tracking-widest font-semibold">
              — Elena Rodriguez, Founder & CEO
            </div>
          </motion.div>
        </div>
      </section>

      {/* Story Grid */}
      <section id="story" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="text-sm uppercase tracking-widest text-red-600 font-bold mb-4">
              THE ORIGIN STORY
            </div>
            <h2 className="text-4xl font-black mb-6">FROM GARAGE TO GLOBAL</h2>
            <div className="w-24 h-1 bg-black mx-auto"></div>
          </motion.div>
          
          {/* Magazine Grid Layout */}
          <div className="grid grid-cols-12 gap-8">
            {/* Main Article */}
            <motion.div 
              className="col-span-12 lg:col-span-8"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="prose prose-lg max-w-none">
                <div className="text-6xl font-black float-left mr-4 mt-2 leading-none text-red-600">I</div>
                <p className="text-lg leading-relaxed mb-6">
                  t was 3 AM on a Tuesday when Elena Rodriguez had her eureka moment. 
                  Sitting in her cramped San Francisco apartment, surrounded by empty coffee cups 
                  and sticky notes, she realized that the solution everyone was looking for 
                  was hiding in plain sight.
                </p>
                
                <p className="text-lg leading-relaxed mb-6">
                  "I was working 80-hour weeks at a tech giant, watching brilliant minds 
                  burn out because the tools we were using were fighting against us, not for us," 
                  Elena recalls. "That night, I decided to quit my six-figure job and bet 
                  everything on an idea that most people thought was crazy."
                </p>
                
                <div className="bg-gray-100 p-6 my-8 border-l-4 border-red-600">
                  <h3 className="text-xl font-bold mb-3">THE TURNING POINT</h3>
                  <p className="text-gray-700">
                    The moment that changed everything happened during a team meeting where 
                    Elena watched a colleague break down from frustration with their workflow tools. 
                    "I knew I had to do something," she says.
                  </p>
                </div>
                
                <p className="text-lg leading-relaxed">
                  What started as a weekend project in her garage has now grown into a company 
                  valued at over $500 million, with offices in 12 countries and a team of 
                  over 2,000 passionate individuals who share Elena's vision of making 
                  technology more human.
                </p>
              </div>
            </motion.div>
            
            {/* Sidebar */}
            <motion.div 
              className="col-span-12 lg:col-span-4"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="space-y-8">
                {/* Timeline */}
                <div className="bg-gray-50 p-6">
                  <h3 className="text-lg font-black uppercase tracking-wide mb-4">TIMELINE</h3>
                  <div className="space-y-4">
                    {[
                      { year: "2019", event: "Founded in garage" },
                      { year: "2020", event: "First 1,000 users" },
                      { year: "2021", event: "Series A funding" },
                      { year: "2022", event: "Global expansion" },
                      { year: "2023", event: "IPO announcement" },
                      { year: "2024", event: "500M valuation" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {item.year.slice(-2)}
                        </div>
                        <div className="text-sm font-semibold">{item.event}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Stats */}
                <div className="bg-black text-white p-6">
                  <h3 className="text-lg font-black uppercase tracking-wide mb-4">BY THE NUMBERS</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-2xl font-black">2,000+</div>
                      <div className="text-sm uppercase tracking-wide">Employees</div>
                    </div>
                    <div>
                      <div className="text-2xl font-black">12</div>
                      <div className="text-sm uppercase tracking-wide">Countries</div>
                    </div>
                    <div>
                      <div className="text-2xl font-black">$500M</div>
                      <div className="text-sm uppercase tracking-wide">Valuation</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Profiles */}
      <section id="team" className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="text-sm uppercase tracking-widest text-red-600 font-bold mb-4">
              MEET THE VISIONARIES
            </div>
            <h2 className="text-4xl font-black mb-6">THE DREAM TEAM</h2>
            <div className="w-24 h-1 bg-black mx-auto"></div>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                name: "Elena Rodriguez",
                role: "Founder & CEO",
                bio: "Former Google PM turned entrepreneur. Stanford MBA. Believes technology should amplify human potential.",
                image: "https://via.placeholder.com/300x400"
              },
              {
                name: "Marcus Chen",
                role: "Co-founder & CTO",
                bio: "Ex-Tesla engineer. MIT graduate. Passionate about building scalable systems that change lives.",
                image: "https://via.placeholder.com/300x400"
              },
              {
                name: "Sarah Williams",
                role: "Head of Design",
                bio: "Former Apple designer. RISD alumna. Obsessed with creating beautiful, intuitive experiences.",
                image: "https://via.placeholder.com/300x400"
              }
            ].map((member, index) => (
              <motion.div
                key={index}
                className="bg-white shadow-lg overflow-hidden"
                initial={{ y: 100, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <div className="relative">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-80 object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                    <h3 className="text-xl font-black text-white mb-1">{member.name}</h3>
                    <p className="text-sm uppercase tracking-wide text-red-400">{member.role}</p>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-700 leading-relaxed">{member.bio}</p>
                  <div className="flex items-center gap-4 mt-4">
                    <Linkedin size={20} className="text-gray-400 hover:text-blue-600 cursor-pointer transition-colors" />
                    <Twitter size={20} className="text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
                    <Instagram size={20} className="text-gray-400 hover:text-pink-600 cursor-pointer transition-colors" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards & Recognition */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="text-sm uppercase tracking-widest text-red-600 font-bold mb-4">
              RECOGNITION
            </div>
            <h2 className="text-4xl font-black mb-6">AWARDS & HONORS</h2>
            <div className="w-24 h-1 bg-black mx-auto"></div>
          </motion.div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { award: "Forbes 30 Under 30", year: "2023", org: "Forbes" },
              { award: "Tech Innovator", year: "2023", org: "TechCrunch" },
              { award: "CEO of the Year", year: "2024", org: "Inc. Magazine" },
              { award: "Visionary Leader", year: "2024", org: "Fast Company" }
            ].map((award, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-16 h-16 bg-red-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award size={24} />
                </div>
                <h3 className="font-bold text-lg mb-2">{award.award}</h3>
                <p className="text-gray-600 text-sm">{award.org} • {award.year}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 px-6 bg-black text-white">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="text-sm uppercase tracking-widest text-red-600 font-bold mb-4">
                GET IN TOUCH
              </div>
              <h2 className="text-4xl font-black mb-6">LET'S CONNECT</h2>
              <p className="text-gray-300 mb-8 leading-relaxed">
                Interested in featuring our story? Want to collaborate? 
                Or just curious about our journey? We'd love to hear from you.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Mail size={20} className="text-red-600" />
                  <span>press@visionarymagazine.com</span>
                </div>
                <div className="flex items-center gap-4">
                  <Phone size={20} className="text-red-600" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-4">
                  <MapPin size={20} className="text-red-600" />
                  <span>San Francisco, CA</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="bg-white text-black p-8">
                <h3 className="text-2xl font-black mb-6">SUBSCRIBE TO VISIONARY</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="w-full px-4 py-3 border-2 border-gray-200 focus:border-red-600 focus:outline-none transition-colors"
                    required
                  />
                  <motion.button
                    type="submit"
                    className="w-full bg-red-600 text-white py-3 font-bold uppercase tracking-wide hover:bg-red-700 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Subscribe Now
                  </motion.button>
                </form>
                <p className="text-sm text-gray-600 mt-4">
                  Get exclusive interviews, behind-the-scenes content, and early access to new issues.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <motion.div 
              className="flex items-center gap-4 mb-4 md:mb-0"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-12 h-12 bg-white text-black rounded-none flex items-center justify-center">
                <BookOpen size={24} />
              </div>
              <div>
                <div className="text-xl font-black tracking-tight">VISIONARY</div>
                <div className="text-xs uppercase tracking-widest text-gray-400">MAGAZINE</div>
              </div>
            </motion.div>
            <div className="text-gray-400 text-center">
              <p>© 2024 Visionary Magazine. All rights reserved.</p>
              <p className="text-sm mt-1">Telling the stories that shape tomorrow.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
