import { Star, Users, Award, TrendingUp } from 'lucide-react';

/**
 * SocialProof Component
 *
 * Displays social proof elements including:
 * - Trusted company logos
 * - User statistics
 * - Ratings and reviews
 * - Achievement badges
 */

export default function SocialProof() {
  const companies = [
    { name: 'TechCorp', logo: 'TC' },
    { name: 'DesignStudio', logo: 'DS' },
    { name: 'StartupHub', logo: 'SH' },
    { name: 'CreativeAgency', logo: 'CA' },
    { name: 'InnovateLab', logo: 'IL' },
    { name: 'DigitalWorks', logo: 'DW' },
  ];

  const stats = [
    { icon: Users, value: '10,000+', label: 'Active Users' },
    { icon: Star, value: '4.9/5', label: 'User Rating' },
    { icon: Award, value: '50+', label: 'Awards Won' },
    { icon: TrendingUp, value: '99.9%', label: 'Uptime' },
  ];

  const reviews = [
    { platform: 'G2', rating: 4.8, reviews: '500+' },
    { platform: 'Capterra', rating: 4.9, reviews: '300+' },
    { platform: 'Trustpilot', rating: 4.7, reviews: '1,200+' },
  ];

  return (
    <section className="py-16 bg-theme-primary border-b border-theme-border/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-theme-text-secondary text-sm font-medium mb-4">
            TRUSTED BY INDUSTRY LEADERS
          </p>
          <h2 className="text-2xl lg:text-3xl font-bold text-theme-text-primary">
            Join thousands of companies already using PaletteSaaS
          </h2>
        </div>

        {/* Company Logos */}
        <div className="mb-16">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-8 items-center justify-items-center">
            {companies.map((company, index) => (
              <div
                key={company.name}
                className="group cursor-pointer"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-theme-secondary to-theme-border rounded-xl flex items-center justify-center text-theme-text-primary font-bold text-lg group-hover:from-theme-accent group-hover:to-theme-accent group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-lg">
                  {company.logo}
                </div>
                <p className="text-xs text-theme-text-secondary mt-2 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                  {company.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Statistics */}
        <div className="mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-theme-accent/10 rounded-lg mb-4">
                  <stat.icon className="w-6 h-6 text-theme-accent" />
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-theme-text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-theme-text-secondary">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Review Platforms */}
        <div className="text-center">
          <p className="text-theme-text-secondary text-sm font-medium mb-6">
            HIGHLY RATED ON LEADING PLATFORMS
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            {reviews.map((review, index) => (
              <div key={review.platform} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-theme-secondary rounded-lg flex items-center justify-center text-theme-text-primary font-bold text-sm">
                  {review.platform.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <span className="font-semibold text-theme-text-primary">{review.rating}</span>
                    <div className="flex text-theme-accent">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= Math.floor(review.rating) ? 'fill-current' : ''
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="text-xs text-theme-text-secondary">
                    {review.reviews} reviews on {review.platform}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
