import {
  Palette,
  Zap,
  Shield,
  Code,
  Smartphone,
  BarChart3
} from 'lucide-react';

/**
 * KeyFeatures Component
 *
 * Showcases 6 main features of the SaaS platform:
 * - Smart Theme Generation
 * - Real-time Preview
 * - Enterprise Security
 * - Developer-Friendly API
 * - Mobile Responsive
 * - Analytics & Insights
 */

export default function KeyFeatures() {
  const features = [
    {
      icon: Palette,
      title: 'Smart Theme Generation',
      description: 'AI-powered theme creation that generates beautiful, cohesive color palettes based on your brand guidelines and preferences.',
      benefits: ['AI-driven color harmony', 'Brand consistency', 'Instant generation'],
    },
    {
      icon: Zap,
      title: 'Real-time Preview',
      description: 'See your themes come to life instantly with live previews across different components and layouts before deployment.',
      benefits: ['Instant feedback', 'Live editing', 'Component testing'],
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-grade security with SOC 2 compliance, encrypted data storage, and advanced access controls for team collaboration.',
      benefits: ['SOC 2 compliant', 'Data encryption', 'Role-based access'],
    },
    {
      icon: Code,
      title: 'Developer-Friendly API',
      description: 'Comprehensive REST API and SDKs for seamless integration with your existing workflow and development tools.',
      benefits: ['RESTful API', 'Multiple SDKs', 'Easy integration'],
    },
    {
      icon: Smartphone,
      title: 'Mobile Responsive',
      description: 'Themes automatically adapt to all screen sizes and devices, ensuring consistent user experience across platforms.',
      benefits: ['Auto-responsive', 'Cross-platform', 'Mobile-first'],
    },
    {
      icon: BarChart3,
      title: 'Analytics & Insights',
      description: 'Track theme performance, user engagement, and conversion metrics to optimize your design decisions.',
      benefits: ['Performance tracking', 'User insights', 'A/B testing'],
    },
  ];

  return (
    <section id="features" className="py-20 bg-earthy-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-earthy-terracotta/10 text-earthy-terracotta text-sm font-medium mb-6">
            ✨ Powerful Features
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-earthy-brown mb-6">
            Everything you need to create
            <span className="text-earthy-terracotta block">
              stunning themes
            </span>
          </h2>
          <p className="text-lg text-earthy-olive max-w-3xl mx-auto">
            Our comprehensive suite of tools empowers designers and developers to create,
            manage, and deploy beautiful themes with unprecedented ease and efficiency.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-earthy-sand/20 hover:border-earthy-terracotta/30"
            >
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-earthy-terracotta to-earthy-olive rounded-xl text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-7 h-7" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-earthy-brown mb-4 group-hover:text-earthy-terracotta transition-colors">
                {feature.title}
              </h3>

              <p className="text-earthy-olive leading-relaxed mb-6">
                {feature.description}
              </p>

              {/* Benefits */}
              <ul className="space-y-2">
                {feature.benefits.map((benefit, benefitIndex) => (
                  <li key={benefitIndex} className="flex items-center text-sm text-earthy-brown">
                    <div className="w-1.5 h-1.5 bg-earthy-terracotta rounded-full mr-3"></div>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-earthy-olive mb-6">
            Ready to experience these features yourself?
          </p>
          <button className="inline-flex items-center px-8 py-4 bg-earthy-terracotta text-white font-semibold rounded-lg hover:bg-earthy-brown transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
            Start Free Trial
            <Zap className="ml-2 w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
