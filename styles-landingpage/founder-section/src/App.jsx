import { useState } from 'react'
import { Heart, Users, Calendar, Award, Mail, Phone, Linkedin, Twitter, Instagram, MapPin } from 'lucide-react'

function App() {
  const [email, setEmail] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Email submitted:', email)
    setEmail('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="text-orange-500" size={28} />
              <span className="text-xl font-bold text-gray-900">StoryApp</span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <a href="#story" className="text-gray-600 hover:text-orange-600 transition-colors">Our Story</a>
              <a href="#team" className="text-gray-600 hover:text-orange-600 transition-colors">Team</a>
              <a href="#journey" className="text-gray-600 hover:text-orange-600 transition-colors">Journey</a>
              <a href="#community" className="text-gray-600 hover:text-orange-600 transition-colors">Community</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Founder's Message */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Built with <span className="text-orange-500">passion</span>, 
                driven by <span className="text-pink-500">purpose</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                "I started StoryApp because I believe everyone deserves tools that understand their journey. 
                This isn't just software - it's a movement to make technology more human."
              </p>
              <div className="flex items-center gap-4 mb-8">
                <img 
                  src="https://via.placeholder.com/80x80" 
                  alt="Sarah Chen, Founder" 
                  className="w-20 h-20 rounded-full border-4 border-orange-200"
                />
                <div>
                  <div className="text-lg font-semibold text-gray-900">Sarah Chen</div>
                  <div className="text-orange-600">Founder & CEO</div>
                  <div className="text-sm text-gray-500">Former Google PM, Stanford MBA</div>
                </div>
              </div>
              <button className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-orange-600 hover:to-pink-600 transition-all transform hover:scale-105">
                Connect with Us
              </button>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-xl">
                <div className="text-center mb-6">
                  <img 
                    src="https://via.placeholder.com/200x200" 
                    alt="Founder working" 
                    className="w-48 h-48 rounded-xl mx-auto object-cover"
                  />
                </div>
                <blockquote className="text-lg text-gray-700 italic text-center">
                  "Every line of code, every design decision, every feature - 
                  they all come from real conversations with real people facing real challenges."
                </blockquote>
                <div className="text-center mt-4">
                  <div className="font-semibold text-gray-900">- Sarah Chen</div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-orange-100 rounded-full p-4">
                <Heart className="text-orange-500" size={32} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section id="story" className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why We Started This</h2>
            <p className="text-xl text-gray-600">The story behind StoryApp</p>
          </div>
          
          <div className="prose prose-lg mx-auto text-gray-700">
            <p className="text-xl leading-relaxed mb-8">
              It was 2 AM, and I was staring at my laptop screen, frustrated by yet another 
              complicated software tool that promised to make my life easier but only made it more complex.
            </p>
            
            <div className="bg-orange-50 rounded-xl p-8 my-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">The Problem</h3>
              <p className="text-lg">
                As a product manager at Google, I saw how even the smartest people struggled with 
                tools that were built for engineers, not for humans. I watched talented colleagues 
                waste hours on tasks that should take minutes.
              </p>
            </div>
            
            <p className="text-lg leading-relaxed mb-8">
              That night, I made a decision. I would build something different. Something that 
              puts people first, not features. Something that grows with you, not against you.
            </p>
            
            <div className="bg-pink-50 rounded-xl p-8 my-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">The Vision</h3>
              <p className="text-lg">
                StoryApp isn't just about productivity - it's about empowering people to tell their 
                stories, achieve their goals, and connect with others in meaningful ways.
              </p>
            </div>
            
            <p className="text-lg leading-relaxed">
              Today, three years later, we're a team of 12 passionate individuals who wake up 
              every day thinking about how to make technology more human. And we're just getting started.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600">The humans behind the magic</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Founder */}
            <div className="bg-white rounded-xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow">
              <img 
                src="https://via.placeholder.com/120x120" 
                alt="Sarah Chen" 
                className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-orange-200"
              />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sarah Chen</h3>
              <p className="text-orange-600 mb-3">Founder & CEO</p>
              <p className="text-gray-600 text-sm mb-4">
                Former Google PM with a passion for human-centered design. 
                Loves hiking and terrible dad jokes.
              </p>
              <div className="flex justify-center gap-3">
                <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                  <Linkedin size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                  <Twitter size={20} />
                </a>
              </div>
            </div>
            
            {/* CTO */}
            <div className="bg-white rounded-xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow">
              <img 
                src="https://via.placeholder.com/120x120" 
                alt="Alex Rodriguez" 
                className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-pink-200"
              />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Alex Rodriguez</h3>
              <p className="text-pink-600 mb-3">Co-founder & CTO</p>
              <p className="text-gray-600 text-sm mb-4">
                Full-stack wizard who can make any idea come to life. 
                Coffee enthusiast and weekend rock climber.
              </p>
              <div className="flex justify-center gap-3">
                <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">
                  <Linkedin size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">
                  <Twitter size={20} />
                </a>
              </div>
            </div>
            
            {/* Designer */}
            <div className="bg-white rounded-xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow">
              <img 
                src="https://via.placeholder.com/120x120" 
                alt="Maya Patel" 
                className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-purple-200"
              />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Maya Patel</h3>
              <p className="text-purple-600 mb-3">Head of Design</p>
              <p className="text-gray-600 text-sm mb-4">
                Design thinking expert who makes complex things simple. 
                Yoga instructor and plant parent to 47 succulents.
              </p>
              <div className="flex justify-center gap-3">
                <a href="#" className="text-gray-400 hover:text-purple-500 transition-colors">
                  <Linkedin size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-purple-500 transition-colors">
                  <Instagram size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section id="journey" className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-xl text-gray-600">Key milestones that shaped us</p>
          </div>
          
          <div className="space-y-8">
            <div className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className="bg-orange-500 text-white rounded-full p-3 mb-2">
                  <Calendar size={24} />
                </div>
                <div className="w-px bg-gray-300 h-16"></div>
              </div>
              <div className="flex-1">
                <div className="text-lg font-semibold text-gray-900 mb-2">January 2021</div>
                <div className="text-gray-600">
                  Sarah leaves Google to start StoryApp. First lines of code written in a coffee shop in Palo Alto.
                </div>
              </div>
            </div>
            
            <div className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className="bg-pink-500 text-white rounded-full p-3 mb-2">
                  <Users size={24} />
                </div>
                <div className="w-px bg-gray-300 h-16"></div>
              </div>
              <div className="flex-1">
                <div className="text-lg font-semibold text-gray-900 mb-2">June 2021</div>
                <div className="text-gray-600">
                  Alex joins as co-founder. First beta version launched with 50 early users.
                </div>
              </div>
            </div>
            
            <div className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className="bg-purple-500 text-white rounded-full p-3 mb-2">
                  <Award size={24} />
                </div>
                <div className="w-px bg-gray-300 h-16"></div>
              </div>
              <div className="flex-1">
                <div className="text-lg font-semibold text-gray-900 mb-2">December 2021</div>
                <div className="text-gray-600">
                  Reached 1,000 users. Won "Best New Product" at TechCrunch Disrupt.
                </div>
              </div>
            </div>
            
            <div className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className="bg-green-500 text-white rounded-full p-3">
                  <Heart size={24} />
                </div>
              </div>
              <div className="flex-1">
                <div className="text-lg font-semibold text-gray-900 mb-2">Today</div>
                <div className="text-gray-600">
                  Over 50,000 happy users and growing. Building the future of human-centered software.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section id="community" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Join Our Community</h2>
            <p className="text-xl text-gray-600">Be part of something bigger</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Connect with Sarah</h3>
              <p className="text-gray-600 mb-6">
                I love hearing from our users. Whether you have feedback, ideas, or just want to chat 
                about the future of technology, I'm always here to listen.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="text-orange-500" size={20} />
                  <span className="text-gray-600">sarah@storyapp.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="text-orange-500" size={20} />
                  <span className="text-gray-600">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="text-orange-500" size={20} />
                  <span className="text-gray-600">San Francisco, CA</span>
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <a href="#" className="bg-orange-500 text-white p-3 rounded-full hover:bg-orange-600 transition-colors">
                  <Linkedin size={20} />
                </a>
                <a href="#" className="bg-pink-500 text-white p-3 rounded-full hover:bg-pink-600 transition-colors">
                  <Twitter size={20} />
                </a>
                <a href="#" className="bg-purple-500 text-white p-3 rounded-full hover:bg-purple-600 transition-colors">
                  <Instagram size={20} />
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Join Our Newsletter</h3>
              <p className="text-gray-600 mb-6">
                Get personal updates from me about our journey, new features, and behind-the-scenes stories.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-pink-600 transition-all"
                >
                  Join Our Community
                </button>
              </form>
              <p className="text-sm text-gray-500 mt-3">
                No spam, just authentic updates from our journey. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Heart className="text-orange-400" size={28} />
              <span className="text-xl font-bold">StoryApp</span>
            </div>
            <div className="text-gray-400 text-center">
              <p>Built with ❤️ by humans, for humans</p>
              <p className="text-sm mt-2">© 2024 StoryApp. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
