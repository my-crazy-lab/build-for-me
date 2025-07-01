import Header from './Header';
import HeroSection from './HeroSection';
import SocialProof from './SocialProof';
import KeyFeatures from './KeyFeatures';
import Benefits from './Benefits';
import ProductShowcase from './ProductShowcase';
import Testimonials from './Testimonials';
import Pricing from './Pricing';
import FAQ from './FAQ';
import FinalCTA from './FinalCTA';
import Footer from './Footer';

/**
 * LandingPage Component
 * 
 * Main landing page component that orchestrates all sections according to
 * the SaaS landing page requirements. Follows the structure:
 * 
 * 1. Header with navigation and theme switcher
 * 2. Hero Section - Core value proposition
 * 3. Social Proof - Trusted logos and ratings
 * 4. Key Features - 3-6 main features
 * 5. Benefits - Value proposition details
 * 6. Product Showcase - Demo/screenshots
 * 7. Testimonials - Customer feedback
 * 8. Pricing - Plans comparison
 * 9. FAQ - Common questions
 * 10. Final CTA - Last conversion opportunity
 * 11. Footer - Links and legal info
 */

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Header with Navigation */}
      <Header />
      
      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <HeroSection />
        
        {/* Social Proof */}
        <SocialProof />
        
        {/* Key Features */}
        <KeyFeatures />
        
        {/* Benefits & Value Proposition */}
        <Benefits />
        
        {/* Product Showcase */}
        <ProductShowcase />
        
        {/* Testimonials */}
        <Testimonials />
        
        {/* Pricing */}
        <Pricing />
        
        {/* FAQ */}
        <FAQ />
        
        {/* Final CTA */}
        <FinalCTA />
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
