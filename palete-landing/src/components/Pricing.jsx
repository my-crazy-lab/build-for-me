import { useState } from 'react';
import { Check, X, Star, Zap, Crown, Users } from 'lucide-react';

/**
 * Pricing Component
 *
 * Pricing table with three tiers:
 * - Free: Basic features for individuals
 * - Pro: Advanced features for teams
 * - Enterprise: Full features for organizations
 *
 * Features billing toggle, feature comparison, and clear CTAs
 */

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      name: 'Free',
      description: 'Perfect for individuals getting started',
      icon: Star,
      price: { monthly: 0, annual: 0 },
      badge: null,
      features: [
        { name: '3 themes per month', included: true },
        { name: 'Basic color palettes', included: true },
        { name: 'Standard templates', included: true },
        { name: 'Export to CSS/JSON', included: true },
        { name: 'Community support', included: true },
        { name: 'Advanced AI generation', included: false },
        { name: 'Team collaboration', included: false },
        { name: 'Custom branding', included: false },
        { name: 'Priority support', included: false },
        { name: 'API access', included: false },
      ],
      cta: 'Get Started Free',
      popular: false,
    },
    {
      name: 'Pro',
      description: 'Best for growing teams and businesses',
      icon: Zap,
      price: { monthly: 29, annual: 24 },
      badge: 'Most Popular',
      features: [
        { name: 'Unlimited themes', included: true },
        { name: 'Advanced AI generation', included: true },
        { name: 'Premium templates', included: true },
        { name: 'Team collaboration (5 users)', included: true },
        { name: 'Custom branding', included: true },
        { name: 'Export to all formats', included: true },
        { name: 'Priority email support', included: true },
        { name: 'Version history', included: true },
        { name: 'API access', included: true },
        { name: 'Advanced analytics', included: false },
      ],
      cta: 'Start Pro Trial',
      popular: true,
    },
    {
      name: 'Enterprise',
      description: 'For large organizations with advanced needs',
      icon: Crown,
      price: { monthly: 99, annual: 79 },
      badge: 'Best Value',
      features: [
        { name: 'Everything in Pro', included: true },
        { name: 'Unlimited team members', included: true },
        { name: 'Advanced analytics', included: true },
        { name: 'Custom integrations', included: true },
        { name: 'Dedicated account manager', included: true },
        { name: 'SLA guarantee', included: true },
        { name: 'On-premise deployment', included: true },
        { name: 'Custom training', included: true },
        { name: 'White-label options', included: true },
        { name: '24/7 phone support', included: true },
      ],
      cta: 'Contact Sales',
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-20 bg-earthy-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-medium mb-6">
            💰 Simple Pricing
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-earthy-brown mb-6">
            Choose the perfect plan
            <span className="text-earthy-terracotta block">
              for your needs
            </span>
          </h2>
          <p className="text-lg text-earthy-olive max-w-3xl mx-auto mb-8">
            Start free and scale as you grow. All plans include our core features
            with no hidden fees or surprise charges.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-white rounded-lg p-1 shadow-sm border border-earthy-sand/20">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                !isAnnual
                  ? 'bg-earthy-terracotta text-white shadow-sm'
                  : 'text-earthy-brown hover:text-earthy-terracotta'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                isAnnual
                  ? 'bg-earthy-terracotta text-white shadow-sm'
                  : 'text-earthy-brown hover:text-earthy-terracotta'
              }`}
            >
              Annual
              <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
                plan.popular
                  ? 'border-earthy-terracotta scale-105'
                  : 'border-earthy-sand/20 hover:border-earthy-terracotta/30'
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-earthy-terracotta text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                    {plan.badge}
                  </div>
                </div>
              )}

              <div className="p-8">
                {/* Header */}
                <div className="text-center mb-8">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl mb-4 ${
                    plan.popular
                      ? 'bg-earthy-terracotta text-white'
                      : 'bg-earthy-terracotta/10 text-earthy-terracotta'
                  }`}>
                    <plan.icon className="w-8 h-8" />
                  </div>

                  <h3 className="text-2xl font-bold text-earthy-brown mb-2">
                    {plan.name}
                  </h3>

                  <p className="text-earthy-olive mb-6">
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold text-earthy-brown">
                        ${isAnnual ? plan.price.annual : plan.price.monthly}
                      </span>
                      {plan.price.monthly > 0 && (
                        <span className="text-earthy-olive ml-2">
                          /{isAnnual ? 'month' : 'month'}
                        </span>
                      )}
                    </div>
                    {isAnnual && plan.price.monthly > 0 && (
                      <div className="text-sm text-earthy-olive mt-1">
                        Billed annually (${plan.price.annual * 12}/year)
                      </div>
                    )}
                  </div>

                  {/* CTA Button */}
                  <button
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                      plan.popular
                        ? 'bg-earthy-terracotta text-white hover:bg-earthy-brown shadow-lg hover:shadow-xl'
                        : 'bg-earthy-terracotta/10 text-earthy-terracotta hover:bg-earthy-terracotta hover:text-white border border-earthy-terracotta/20'
                    }`}
                  >
                    {plan.cta}
                  </button>
                </div>

                {/* Features */}
                <div className="space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      ) : (
                        <X className="w-5 h-5 text-gray-300 mr-3 flex-shrink-0" />
                      )}
                      <span className={`text-sm ${
                        feature.included ? 'text-earthy-brown' : 'text-gray-400'
                      }`}>
                        {feature.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-earthy-sand/20 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              <div className="text-center">
                <Users className="w-8 h-8 text-earthy-terracotta mx-auto mb-3" />
                <h4 className="font-semibold text-earthy-brown mb-2">14-Day Free Trial</h4>
                <p className="text-sm text-earthy-olive">No credit card required</p>
              </div>

              <div className="text-center">
                <Star className="w-8 h-8 text-earthy-terracotta mx-auto mb-3" />
                <h4 className="font-semibold text-earthy-brown mb-2">Money-Back Guarantee</h4>
                <p className="text-sm text-earthy-olive">30-day refund policy</p>
              </div>

              <div className="text-center">
                <Zap className="w-8 h-8 text-earthy-terracotta mx-auto mb-3" />
                <h4 className="font-semibold text-earthy-brown mb-2">Cancel Anytime</h4>
                <p className="text-sm text-earthy-olive">No long-term contracts</p>
              </div>
            </div>
          </div>

          <p className="text-earthy-olive mt-8">
            Questions about pricing?
            <a href="#" className="text-earthy-terracotta hover:underline ml-1">
              Contact our sales team
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
