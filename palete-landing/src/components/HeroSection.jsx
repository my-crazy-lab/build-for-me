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
    <section className="pt-20 pb-16 lg:pt-28 lg:pb-24 bg-gradient-to-br from-theme-primary via-theme-secondary to-theme-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
          {/* Content */}
          <div className="lg:col-span-6">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-theme-accent/10 text-theme-accent text-sm font-medium mb-6">
              <Star className="w-4 h-4 mr-2 fill-current" />
              #1 Theme Management Platform
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl lg:text-6xl font-bold text-theme-text-primary leading-tight mb-6">
              Transform Your
              <span className="text-theme-accent block">
                Design Workflow
              </span>
              with Smart Themes
            </h1>

            {/* Supporting Description */}
            <p className="text-lg lg:text-xl text-theme-text-secondary leading-relaxed mb-8 max-w-2xl">
              Create, manage, and deploy beautiful themes across your applications with our
              intelligent palette system. Save time, ensure consistency, and delight your users
              with professional designs.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button className="inline-flex items-center justify-center px-8 py-4 bg-theme-accent text-white font-semibold rounded-lg hover:opacity-90 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>

              <button className="inline-flex items-center justify-center px-8 py-4 bg-theme-primary/80 text-theme-text-primary font-semibold rounded-lg border border-theme-border hover:bg-theme-primary transition-all duration-200 backdrop-blur-sm">
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center space-x-6 text-sm text-theme-text-secondary">
              <div className="flex items-center">
                <div className="flex -space-x-2 mr-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-theme-accent to-theme-accent border-2 border-theme-primary"
                    />
                  ))}
                </div>
                <span>10,000+ happy users</span>
              </div>

              <div className="flex items-center">
                <div className="flex text-theme-accent mr-2">
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
              <div className="bg-theme-primary rounded-2xl shadow-2xl p-6 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-theme-accent rounded-full"></div>
                    <div className="w-3 h-3 bg-theme-accent/70 rounded-full"></div>
                    <div className="w-3 h-3 bg-theme-accent/40 rounded-full"></div>
                  </div>
                  <div className="text-xs text-theme-text-secondary">Theme Dashboard</div>
                </div>

                {/* Mock Dashboard Content */}
                <div className="space-y-4">
                  <div className="h-8 bg-gradient-to-r from-theme-accent to-theme-accent rounded"></div>

                  <div className="grid grid-cols-3 gap-3">
                    {['Earthy', 'Pastel', 'Vibrant'].map((theme, i) => (
                      <div key={theme} className="p-3 border border-theme-border/30 rounded-lg">
                        <div className="text-xs font-medium text-theme-text-primary mb-2">{theme}</div>
                        <div className="flex space-x-1">
                          <div className="w-4 h-4 rounded bg-theme-accent"></div>
                          <div className="w-4 h-4 rounded bg-theme-accent/70"></div>
                          <div className="w-4 h-4 rounded bg-theme-accent/40"></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="h-20 bg-gradient-to-br from-theme-secondary to-theme-primary rounded-lg flex items-center justify-center">
                    <div className="text-theme-text-primary text-sm font-medium">Live Preview</div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-theme-accent rounded-full flex items-center justify-center text-white font-bold animate-bounce-gentle">
                AI
              </div>

              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-theme-accent/80 rounded-full flex items-center justify-center text-white text-xs animate-pulse">
                <Star className="w-6 h-6 fill-current" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
