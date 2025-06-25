import { ArrowRight, Play, Star } from 'lucide-react';

/**
 * HeroSection Component
 * 
 * Main hero section with value proposition, CTA buttons, and hero illustration.
 * Features:
 * - Clear value proposition headline
 * - Supporting description
 * - Primary and secondary CTAs
 * - Hero mockup/illustration
 * - Social proof indicators
 */

export default function HeroSection() {
  return (
    <section className="pt-20 pb-16 lg:pt-28 lg:pb-24 bg-gradient-to-br from-earthy-light via-earthy-cream to-earthy-beige">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
          {/* Content */}
          <div className="lg:col-span-6">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-earthy-terracotta/10 text-earthy-terracotta text-sm font-medium mb-6">
              <Star className="w-4 h-4 mr-2 fill-current" />
              #1 Theme Management Platform
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl lg:text-6xl font-bold text-earthy-brown leading-tight mb-6">
              Transform Your
              <span className="text-earthy-terracotta block">
                Design Workflow
              </span>
              with Smart Themes
            </h1>

            {/* Supporting Description */}
            <p className="text-lg lg:text-xl text-earthy-olive leading-relaxed mb-8 max-w-2xl">
              Create, manage, and deploy beautiful themes across your applications with our 
              intelligent palette system. Save time, ensure consistency, and delight your users 
              with professional designs.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button className="inline-flex items-center justify-center px-8 py-4 bg-earthy-terracotta text-white font-semibold rounded-lg hover:bg-earthy-brown transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
              
              <button className="inline-flex items-center justify-center px-8 py-4 bg-white/80 text-earthy-brown font-semibold rounded-lg border border-earthy-sand hover:bg-white transition-all duration-200 backdrop-blur-sm">
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center space-x-6 text-sm text-earthy-olive">
              <div className="flex items-center">
                <div className="flex -space-x-2 mr-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-earthy-terracotta to-earthy-olive border-2 border-white"
                    />
                  ))}
                </div>
                <span>10,000+ happy users</span>
              </div>
              
              <div className="flex items-center">
                <div className="flex text-yellow-400 mr-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span>4.9/5 rating</span>
              </div>
            </div>
          </div>

          {/* Hero Illustration */}
          <div className="lg:col-span-6 mt-12 lg:mt-0">
            <div className="relative">
              {/* Main Dashboard Mockup */}
              <div className="bg-white rounded-2xl shadow-2xl p-6 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="text-xs text-gray-500">Theme Dashboard</div>
                </div>
                
                {/* Mock Dashboard Content */}
                <div className="space-y-4">
                  <div className="h-8 bg-gradient-to-r from-earthy-terracotta to-earthy-olive rounded"></div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    {['Earthy', 'Pastel', 'Vibrant'].map((theme, i) => (
                      <div key={theme} className="p-3 border border-earthy-sand/30 rounded-lg">
                        <div className="text-xs font-medium text-earthy-brown mb-2">{theme}</div>
                        <div className="flex space-x-1">
                          <div className={`w-4 h-4 rounded ${i === 0 ? 'bg-earthy-terracotta' : i === 1 ? 'bg-pastel-lavender' : 'bg-accent-tomato'}`}></div>
                          <div className={`w-4 h-4 rounded ${i === 0 ? 'bg-earthy-olive' : i === 1 ? 'bg-pastel-mint' : 'bg-butter-medium'}`}></div>
                          <div className={`w-4 h-4 rounded ${i === 0 ? 'bg-earthy-cream' : i === 1 ? 'bg-pastel-peach' : 'bg-dill-light'}`}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="h-20 bg-gradient-to-br from-earthy-light to-earthy-cream rounded-lg flex items-center justify-center">
                    <div className="text-earthy-brown text-sm font-medium">Live Preview</div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-earthy-terracotta rounded-full flex items-center justify-center text-white font-bold animate-bounce-gentle">
                AI
              </div>
              
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-earthy-olive rounded-full flex items-center justify-center text-white text-xs animate-pulse">
                <Star className="w-6 h-6 fill-current" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
