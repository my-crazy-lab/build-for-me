import {
  Clock,
  TrendingUp,
  DollarSign,
  Users,
  Target,
  Rocket,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

/**
 * Benefits Component
 *
 * Highlights the key benefits and value propositions:
 * - Time savings
 * - Performance improvements
 * - Revenue increases
 * - Team productivity
 * - User satisfaction
 */

export default function Benefits() {
  const mainBenefits = [
    {
      icon: Clock,
      title: 'Save 80% of Design Time',
      description: 'Reduce theme creation from weeks to hours with our AI-powered generation and smart templates.',
      metric: '80%',
      metricLabel: 'Time Saved',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: TrendingUp,
      title: 'Boost Performance by 40%',
      description: 'Optimized themes load faster and provide better user experience, improving your core web vitals.',
      metric: '40%',
      metricLabel: 'Performance Boost',
      color: 'from-green-500 to-green-600',
    },
    {
      icon: DollarSign,
      title: 'Increase Revenue by 25%',
      description: 'Better-designed interfaces lead to higher conversion rates and improved customer satisfaction.',
      metric: '25%',
      metricLabel: 'Revenue Increase',
      color: 'from-earthy-terracotta to-earthy-olive',
    },
  ];

  const additionalBenefits = [
    {
      icon: Users,
      title: 'Enhanced Team Collaboration',
      description: 'Centralized theme management with role-based access and real-time collaboration features.',
    },
    {
      icon: Target,
      title: 'Consistent Brand Identity',
      description: 'Maintain brand consistency across all touchpoints with automated brand guideline enforcement.',
    },
    {
      icon: Rocket,
      title: 'Faster Time to Market',
      description: 'Launch new products and features faster with pre-built, customizable theme components.',
    },
  ];

  const outcomes = [
    'Reduce design iteration cycles by 60%',
    'Improve user satisfaction scores by 35%',
    'Decrease development costs by 50%',
    'Accelerate product launches by 3x',
    'Achieve 99.9% brand consistency',
    'Scale design operations efficiently',
  ];

  return (
    <section id="benefits" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-medium mb-6">
            📈 Proven Results
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-earthy-brown mb-6">
            Transform your business with
            <span className="text-earthy-terracotta block">
              measurable results
            </span>
          </h2>
          <p className="text-lg text-earthy-olive max-w-3xl mx-auto">
            Join thousands of companies that have already transformed their design workflow
            and achieved remarkable business outcomes with PaletteSaaS.
          </p>
        </div>

        {/* Main Benefits */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {mainBenefits.map((benefit, index) => (
            <div
              key={index}
              className="relative bg-gradient-to-br from-earthy-light to-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-earthy-sand/20"
            >
              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${benefit.color} rounded-xl text-white mb-6`}>
                <benefit.icon className="w-8 h-8" />
              </div>

              {/* Metric */}
              <div className="text-4xl font-bold text-earthy-brown mb-2">
                {benefit.metric}
              </div>
              <div className="text-sm text-earthy-olive font-medium mb-4">
                {benefit.metricLabel}
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-earthy-brown mb-4">
                {benefit.title}
              </h3>
              <p className="text-earthy-olive leading-relaxed">
                {benefit.description}
              </p>

              {/* Decorative element */}
              <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-earthy-terracotta/10 to-earthy-olive/10 rounded-full -z-10"></div>
            </div>
          ))}
        </div>

        {/* Additional Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {additionalBenefits.map((benefit, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-earthy-terracotta/10 rounded-lg mb-4">
                <benefit.icon className="w-6 h-6 text-earthy-terracotta" />
              </div>
              <h3 className="text-lg font-semibold text-earthy-brown mb-3">
                {benefit.title}
              </h3>
              <p className="text-earthy-olive">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        {/* Outcomes List */}
        <div className="bg-gradient-to-br from-earthy-light to-earthy-cream rounded-2xl p-8 lg:p-12">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            <div>
              <h3 className="text-2xl lg:text-3xl font-bold text-earthy-brown mb-6">
                What our customers achieve
              </h3>
              <p className="text-earthy-olive mb-8">
                Real results from real companies using PaletteSaaS to transform
                their design operations and business outcomes.
              </p>
              <button className="inline-flex items-center px-6 py-3 bg-earthy-terracotta text-white font-semibold rounded-lg hover:bg-earthy-brown transition-colors">
                See Case Studies
                <ArrowRight className="ml-2 w-4 h-4" />
              </button>
            </div>

            <div className="mt-8 lg:mt-0">
              <div className="grid grid-cols-1 gap-4">
                {outcomes.map((outcome, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-earthy-brown">{outcome}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
