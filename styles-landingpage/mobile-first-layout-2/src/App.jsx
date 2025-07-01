import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, Share2, Bookmark, MessageCircle, Download, Star, Mail, Phone, Instagram, TikTok, Youtube, Plus } from 'lucide-react'

function App() {
  const [email, setEmail] = useState('')
  const [likedCards, setLikedCards] = useState(new Set())

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Email submitted:', email)
    setEmail('')
  }

  const toggleLike = (cardId) => {
    const newLiked = new Set(likedCards)
    if (newLiked.has(cardId)) {
      newLiked.delete(cardId)
    } else {
      newLiked.add(cardId)
    }
    setLikedCards(newLiked)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                <Heart className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">CardApp</h1>
                <p className="text-xs text-gray-500">Social • Creative • Fun</p>
              </div>
            </motion.div>
            <motion.button 
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-2 rounded-full text-sm font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Join Now
            </motion.button>
          </div>
        </div>
      </header>

      {/* Hero Card */}
      <section className="px-4 py-6">
        <motion.div 
          className="bg-white rounded-3xl shadow-lg overflow-hidden"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative">
            <div className="h-64 bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 flex items-center justify-center">
              <motion.div 
                className="text-center text-white"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <h2 className="text-3xl font-bold mb-2">Welcome to CardApp</h2>
                <p className="text-lg opacity-90">Where stories come alive</p>
              </motion.div>
            </div>
            <div className="absolute top-4 right-4 flex gap-2">
              <motion.button 
                className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Share2 className="text-white" size={18} />
              </motion.button>
              <motion.button 
                className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Bookmark className="text-white" size={18} />
              </motion.button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <img src="https://via.placeholder.com/40x40" alt="User" className="w-10 h-10 rounded-full" />
                <div>
                  <p className="font-semibold text-gray-900">@cardapp_official</p>
                  <p className="text-sm text-gray-500">2 hours ago</p>
                </div>
              </div>
              <motion.button 
                className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Follow
              </motion.button>
            </div>
            
            <p className="text-gray-700 mb-4 leading-relaxed">
              Create beautiful cards, share your moments, and connect with friends in a whole new way. 
              Join millions of users who are already sharing their stories! ✨
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <motion.button 
                  className="flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleLike('hero')}
                >
                  <Heart 
                    className={`${likedCards.has('hero') ? 'text-red-500 fill-current' : 'text-gray-400'}`} 
                    size={20} 
                  />
                  <span className="text-sm font-semibold text-gray-600">1.2k</span>
                </motion.button>
                <motion.button 
                  className="flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <MessageCircle className="text-gray-400" size={20} />
                  <span className="text-sm font-semibold text-gray-600">89</span>
                </motion.button>
              </div>
              <motion.button 
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-2 rounded-full text-sm font-semibold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Try Now
              </motion.button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Feature Cards */}
      <section className="px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Why You'll Love It</h3>
          <motion.button 
            className="text-purple-600 text-sm font-semibold"
            whileHover={{ scale: 1.05 }}
          >
            See All
          </motion.button>
        </div>
        
        <div className="space-y-4">
          {[
            {
              id: 'feature1',
              emoji: '🎨',
              title: 'Beautiful Templates',
              desc: 'Choose from hundreds of stunning card templates',
              likes: '2.1k',
              comments: '156'
            },
            {
              id: 'feature2',
              emoji: '📱',
              title: 'Mobile First',
              desc: 'Designed specifically for your phone experience',
              likes: '1.8k',
              comments: '203'
            },
            {
              id: 'feature3',
              emoji: '⚡',
              title: 'Instant Sharing',
              desc: 'Share your cards instantly across all platforms',
              likes: '3.2k',
              comments: '89'
            }
          ].map((feature, index) => (
            <motion.div
              key={feature.id}
              className="bg-white rounded-2xl shadow-sm p-6"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl flex items-center justify-center text-2xl">
                  {feature.emoji}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                  <p className="text-gray-600 text-sm mb-3">{feature.desc}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <motion.button 
                        className="flex items-center gap-1"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleLike(feature.id)}
                      >
                        <Heart 
                          className={`${likedCards.has(feature.id) ? 'text-red-500 fill-current' : 'text-gray-400'}`} 
                          size={16} 
                        />
                        <span className="text-xs text-gray-500">{feature.likes}</span>
                      </motion.button>
                      <motion.button 
                        className="flex items-center gap-1"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <MessageCircle className="text-gray-400" size={16} />
                        <span className="text-xs text-gray-500">{feature.comments}</span>
                      </motion.button>
                    </div>
                    <motion.button 
                      className="text-purple-600 text-sm font-semibold"
                      whileHover={{ scale: 1.05 }}
                    >
                      Try It
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stories Section */}
      <section className="px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">User Stories</h3>
          <motion.button 
            className="text-purple-600 text-sm font-semibold"
            whileHover={{ scale: 1.05 }}
          >
            View All
          </motion.button>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-4">
          {[
            { name: 'Sarah', avatar: 'https://via.placeholder.com/60x60', story: 'Amazing app! Love the templates 💕' },
            { name: 'Mike', avatar: 'https://via.placeholder.com/60x60', story: 'So easy to use and share!' },
            { name: 'Lisa', avatar: 'https://via.placeholder.com/60x60', story: 'Perfect for my business cards ✨' },
            { name: 'Alex', avatar: 'https://via.placeholder.com/60x60', story: 'Best card app ever! 🔥' }
          ].map((user, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl p-4 min-w-[200px] shadow-sm"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{user.name}</p>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} fill="currentColor" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-700 text-sm">{user.story}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Download CTA Card */}
      <section className="px-4 py-6">
        <motion.div 
          className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-3xl p-8 text-white text-center"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div 
            className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Download className="text-white" size={32} />
          </motion.div>
          <h3 className="text-2xl font-bold mb-2">Ready to Get Started?</h3>
          <p className="text-lg opacity-90 mb-6">Join 2M+ users creating amazing cards</p>
          <motion.button 
            className="bg-white text-purple-600 px-8 py-4 rounded-full text-lg font-bold w-full mb-4"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Download Free App
          </motion.button>
          <p className="text-sm opacity-75">⭐ 4.9/5 stars • 100K+ downloads</p>
        </motion.div>
      </section>

      {/* Social Proof Cards */}
      <section className="px-4 py-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">What People Are Saying</h3>
        
        <div className="space-y-4">
          {[
            {
              id: 'review1',
              user: 'Emma Johnson',
              handle: '@emmaj',
              avatar: 'https://via.placeholder.com/40x40',
              content: 'This app changed how I create content! The templates are gorgeous and so easy to customize. Highly recommend! 🌟',
              likes: '847',
              time: '2h'
            },
            {
              id: 'review2',
              user: 'David Chen',
              handle: '@davidc',
              avatar: 'https://via.placeholder.com/40x40',
              content: 'Perfect for my small business. I can create professional cards in minutes. The sharing feature is amazing!',
              likes: '1.2k',
              time: '5h'
            }
          ].map((review, index) => (
            <motion.div
              key={review.id}
              className="bg-white rounded-2xl p-6 shadow-sm"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-start gap-3 mb-3">
                <img src={review.avatar} alt={review.user} className="w-10 h-10 rounded-full" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-gray-900 text-sm">{review.user}</p>
                    <p className="text-gray-500 text-sm">{review.handle}</p>
                    <span className="text-gray-400 text-sm">•</span>
                    <p className="text-gray-500 text-sm">{review.time}</p>
                  </div>
                  <div className="flex text-yellow-400 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">{review.content}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <motion.button 
                    className="flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleLike(review.id)}
                  >
                    <Heart 
                      className={`${likedCards.has(review.id) ? 'text-red-500 fill-current' : 'text-gray-400'}`} 
                      size={18} 
                    />
                    <span className="text-sm text-gray-500">{review.likes}</span>
                  </motion.button>
                  <motion.button 
                    className="flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <MessageCircle className="text-gray-400" size={18} />
                    <span className="text-sm text-gray-500">Reply</span>
                  </motion.button>
                </div>
                <motion.button 
                  className="text-gray-400"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Share2 size={18} />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact Card */}
      <section className="px-4 py-6">
        <motion.div 
          className="bg-white rounded-3xl p-6 shadow-lg"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Stay Connected</h3>
            <p className="text-gray-600">Get updates and exclusive content</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg"
              required
            />
            <motion.button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-4 rounded-2xl text-lg font-semibold"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Subscribe
            </motion.button>
          </form>
          
          <div className="flex items-center justify-center gap-6">
            <div className="text-center">
              <Mail className="text-purple-500 mx-auto mb-1" size={20} />
              <p className="text-xs text-gray-500">Email</p>
            </div>
            <div className="text-center">
              <Phone className="text-purple-500 mx-auto mb-1" size={20} />
              <p className="text-xs text-gray-500">Support</p>
            </div>
            <div className="text-center">
              <Instagram className="text-purple-500 mx-auto mb-1" size={20} />
              <p className="text-xs text-gray-500">Follow</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Social Media Cards */}
      <section className="px-4 py-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Follow Us</h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { platform: 'Instagram', icon: Instagram, color: 'from-pink-500 to-purple-500', followers: '2.1M' },
            { platform: 'TikTok', icon: TikTok, color: 'from-black to-gray-800', followers: '1.8M' },
            { platform: 'YouTube', icon: Youtube, color: 'from-red-500 to-red-600', followers: '890K' }
          ].map((social, index) => (
            <motion.div
              key={index}
              className={`bg-gradient-to-r ${social.color} rounded-2xl p-4 text-white text-center`}
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
            >
              <social.icon className="mx-auto mb-2" size={24} />
              <p className="text-sm font-semibold">{social.followers}</p>
              <p className="text-xs opacity-80">{social.platform}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-8 px-4 mt-8">
        <div className="text-center">
          <motion.div 
            className="flex items-center justify-center gap-3 mb-4"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
              <Heart className="text-white" size={20} />
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-900">CardApp</h4>
              <p className="text-xs text-gray-500">Create • Share • Connect</p>
            </div>
          </motion.div>
          <p className="text-gray-500 text-sm">
            © 2024 CardApp. Made with ❤️ for creators
          </p>
        </div>
      </footer>

      {/* Floating Action Button */}
      <motion.button 
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Plus className="text-white" size={24} />
      </motion.button>

      {/* Bottom padding for FAB */}
      <div className="h-20"></div>
    </div>
  )
}

export default App
