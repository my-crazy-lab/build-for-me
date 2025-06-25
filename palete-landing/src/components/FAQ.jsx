import { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, MessageCircle } from 'lucide-react';

/**
 * FAQ Component
 *
 * Expandable FAQ section covering common questions:
 * - Billing and pricing
 * - Features and functionality
 * - Technical support
 * - Account management
 */

export default function FAQ() {
  const [openFAQ, setOpenFAQ] = useState(0);

  const faqs = [
    {
      category: 'Getting Started',
      question: 'Do I need a credit card to start the free trial?',
      answer: 'No, you can start using PaletteSaaS immediately without providing any payment information. Our free plan includes 3 themes per month and basic features. You only need to add payment details when you decide to upgrade to Pro or Enterprise.',
    },
    {
      category: 'Billing',
      question: 'Can I cancel my subscription at any time?',
      answer: 'Absolutely! You can cancel your subscription at any time from your account settings. There are no cancellation fees or long-term contracts. If you cancel, you\'ll continue to have access to your paid features until the end of your current billing period.',
    },
    {
      category: 'Features',
      question: 'Does PaletteSaaS support API integrations?',
      answer: 'Yes! Our Pro and Enterprise plans include full API access with comprehensive documentation. You can integrate PaletteSaaS with your existing tools and workflows. We provide SDKs for popular programming languages and frameworks.',
    },
    {
      category: 'Technical',
      question: 'What export formats are supported?',
      answer: 'PaletteSaaS supports multiple export formats including CSS variables, JSON, SCSS, Tailwind config, Figma tokens, and more. You can also export themes as design system documentation or share them directly with your team.',
    },
    {
      category: 'Collaboration',
      question: 'How does team collaboration work?',
      answer: 'Team collaboration is available on Pro and Enterprise plans. You can invite team members, set role-based permissions, share themes in real-time, leave comments, and track version history. Enterprise plans support unlimited team members.',
    },
    {
      category: 'Security',
      question: 'Is my data secure with PaletteSaaS?',
      answer: 'Security is our top priority. We use bank-grade encryption, are SOC 2 compliant, and follow industry best practices. Your themes and data are stored securely with regular backups. Enterprise customers can also opt for on-premise deployment.',
    },
    {
      category: 'Support',
      question: 'What kind of support do you provide?',
      answer: 'We offer different support levels based on your plan: Free users get community support, Pro users receive priority email support, and Enterprise customers get dedicated account management plus 24/7 phone support.',
    },
    {
      category: 'Pricing',
      question: 'Do you offer discounts for annual billing?',
      answer: 'Yes! Annual billing saves you 20% compared to monthly billing. We also offer special discounts for students, non-profits, and startups. Contact our sales team to learn about volume discounts for large teams.',
    },
  ];

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? -1 : index);
  };

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
            ❓ Got Questions?
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-earthy-brown mb-6">
            Frequently Asked
            <span className="text-earthy-terracotta block">
              Questions
            </span>
          </h2>
          <p className="text-lg text-earthy-olive max-w-2xl mx-auto">
            Find answers to common questions about PaletteSaaS. Can't find what you're
            looking for? Our support team is here to help.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4 mb-12">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-earthy-light/50 rounded-xl border border-earthy-sand/20 overflow-hidden transition-all duration-200 hover:shadow-md"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-earthy-light/70 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    <span className="text-xs font-medium text-earthy-terracotta bg-earthy-terracotta/10 px-2 py-1 rounded-full mr-3">
                      {faq.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-earthy-brown pr-4">
                    {faq.question}
                  </h3>
                </div>
                <div className="flex-shrink-0">
                  {openFAQ === index ? (
                    <ChevronUp className="w-5 h-5 text-earthy-terracotta" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-earthy-olive" />
                  )}
                </div>
              </button>

              {openFAQ === index && (
                <div className="px-6 pb-5">
                  <div className="pt-2 border-t border-earthy-sand/20">
                    <p className="text-earthy-olive leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Support */}
        <div className="bg-gradient-to-br from-earthy-terracotta to-earthy-olive rounded-2xl p-8 text-center text-white">
          <HelpCircle className="w-12 h-12 mx-auto mb-4 opacity-90" />
          <h3 className="text-2xl font-bold mb-4">
            Still have questions?
          </h3>
          <p className="text-earthy-light mb-6 max-w-md mx-auto">
            Our friendly support team is here to help you get the most out of PaletteSaaS.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="inline-flex items-center justify-center px-6 py-3 bg-white text-earthy-terracotta font-semibold rounded-lg hover:bg-earthy-light transition-colors">
              <MessageCircle className="w-4 h-4 mr-2" />
              Contact Support
            </button>
            <button className="inline-flex items-center justify-center px-6 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-earthy-terracotta transition-colors">
              Schedule Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
