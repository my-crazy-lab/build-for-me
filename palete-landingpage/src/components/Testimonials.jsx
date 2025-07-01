import { useState } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, Award } from 'lucide-react';

/**
 * Testimonials Component
 *
 * Customer testimonials carousel featuring:
 * - Customer avatars, names, positions, companies
 * - Authentic quotes and ratings
 * - Interactive carousel navigation
 * - Featured testimonial highlight
 */

export default function Testimonials() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Chen',
      position: 'Head of Design',
      company: 'TechFlow Inc.',
      avatar: 'SC',
      rating: 5,
      quote: "PaletteSaaS has revolutionized our design workflow. What used to take our team weeks now takes hours. The AI-powered theme generation is incredibly intuitive and the results are consistently beautiful.",
      highlight: "Reduced design time by 75%",
      companyLogo: 'TF',
    },
    {
      id: 2,
      name: 'Marcus Rodriguez',
      position: 'CTO',
      company: 'StartupLab',
      avatar: 'MR',
      rating: 5,
      quote: "The developer experience is outstanding. The API integration was seamless, and our entire team was up and running in less than a day. The performance improvements are noticeable across all our applications.",
      highlight: "40% performance improvement",
      companyLogo: 'SL',
    },
    {
      id: 3,
      name: 'Emily Watson',
      position: 'Product Manager',
      company: 'DesignCorp',
      avatar: 'EW',
      rating: 5,
      quote: "Our conversion rates increased by 28% after implementing themes created with PaletteSaaS. The consistency across our platform has significantly improved user experience and brand recognition.",
      highlight: "28% conversion increase",
      companyLogo: 'DC',
    },
    {
      id: 4,
      name: 'David Kim',
      position: 'Creative Director',
      company: 'InnovateLab',
      avatar: 'DK',
      rating: 5,
      quote: "The collaboration features are game-changing. Our distributed design team can now work together seamlessly, and the real-time preview feature has eliminated countless revision cycles.",
      highlight: "Eliminated 60% of revisions",
      companyLogo: 'IL',
    },
    {
      id: 5,
      name: 'Lisa Thompson',
      position: 'VP of Engineering',
      company: 'ScaleUp',
      avatar: 'LT',
      rating: 5,
      quote: "PaletteSaaS scales with our business perfectly. From startup to enterprise, it has supported our growth every step of the way. The enterprise features and security are top-notch.",
      highlight: "Scaled from 10 to 1000+ users",
      companyLogo: 'SU',
    },
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const currentData = testimonials[currentTestimonial];

  return (
    <section className="py-20 bg-theme-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-theme-accent/10 text-theme-accent text-sm font-medium mb-6">
            ⭐ Customer Love
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-theme-text-primary mb-6">
            Trusted by design teams
            <span className="text-theme-accent block">
              around the world
            </span>
          </h2>
          <p className="text-lg text-theme-text-secondary max-w-3xl mx-auto">
            Don't just take our word for it. Here's what our customers have to say
            about their experience with PaletteSaaS.
          </p>
        </div>

        {/* Featured Testimonial */}
        <div className="relative">
          <div className="bg-gradient-to-br from-theme-secondary to-theme-primary rounded-3xl p-8 lg:p-12 shadow-xl border border-theme-border/20">
            {/* Quote Icon */}
            <div className="absolute top-8 left-8 w-12 h-12 bg-theme-accent/10 rounded-full flex items-center justify-center">
              <Quote className="w-6 h-6 text-theme-accent" />
            </div>

            <div className="lg:grid lg:grid-cols-3 lg:gap-12 items-center">
              {/* Testimonial Content */}
              <div className="lg:col-span-2">
                {/* Rating */}
                <div className="flex items-center mb-6 mt-8 lg:mt-0">
                  <div className="flex text-theme-accent mr-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <span className="text-theme-text-primary font-medium">5.0</span>
                </div>

                {/* Quote */}
                <blockquote className="text-xl lg:text-2xl text-theme-text-primary leading-relaxed mb-6 font-medium">
                  "{currentData.quote}"
                </blockquote>

                {/* Highlight */}
                <div className="inline-flex items-center px-4 py-2 bg-theme-accent/10 rounded-full text-theme-accent text-sm font-semibold mb-6">
                  <Award className="w-4 h-4 mr-2" />
                  {currentData.highlight}
                </div>

                {/* Author Info */}
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-theme-accent to-theme-accent rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {currentData.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-theme-text-primary">{currentData.name}</div>
                    <div className="text-theme-text-secondary">{currentData.position}</div>
                    <div className="text-sm text-theme-text-secondary">{currentData.company}</div>
                  </div>
                </div>
              </div>

              {/* Company Logo */}
              <div className="lg:col-span-1 mt-8 lg:mt-0 text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-theme-primary rounded-2xl shadow-lg border border-theme-border/20 text-theme-text-primary font-bold text-2xl">
                  {currentData.companyLogo}
                </div>
                <p className="text-sm text-theme-text-secondary mt-3">
                  {currentData.company}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={prevTestimonial}
              className="flex items-center justify-center w-12 h-12 bg-theme-primary rounded-full shadow-lg border border-theme-border/20 text-theme-text-primary hover:text-theme-accent hover:border-theme-accent/30 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Dots Indicator */}
            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentTestimonial
                      ? 'bg-theme-accent'
                      : 'bg-theme-border hover:bg-theme-accent/50'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextTestimonial}
              className="flex items-center justify-center w-12 h-12 bg-theme-primary rounded-full shadow-lg border border-theme-border/20 text-theme-text-primary hover:text-theme-accent hover:border-theme-accent/30 transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-theme-text-primary mb-2">4.9/5</div>
            <div className="text-theme-text-secondary text-sm">Average Rating</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-theme-text-primary mb-2">2,000+</div>
            <div className="text-theme-text-secondary text-sm">Happy Customers</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-theme-text-primary mb-2">99.9%</div>
            <div className="text-theme-text-secondary text-sm">Customer Satisfaction</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-theme-text-primary mb-2">24/7</div>
            <div className="text-theme-text-secondary text-sm">Support Available</div>
          </div>
        </div>
      </div>
    </section>
  );
}
