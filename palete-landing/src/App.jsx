import { useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import LandingPage from './components/LandingPage';
import { trackWebVitals } from './utils/performance';

/**
 * Main App Component
 *
 * Root component that provides theme context and renders the landing page.
 * Uses the Earthy Neutrals theme as default based on user preferences.
 * Includes performance monitoring and SEO optimizations.
 */

function App() {
  useEffect(() => {
    // Track Web Vitals for performance monitoring
    trackWebVitals();

    // Add smooth scrolling behavior
    document.documentElement.style.scrollBehavior = 'smooth';

    // Preload critical resources
    const criticalImages = [
      '/hero-mockup.jpg',
      '/dashboard-preview.jpg',
    ];

    criticalImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = src;
      link.as = 'image';
      document.head.appendChild(link);
    });

    // Add viewport meta tag for better mobile experience
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes';
    }

    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-theme-primary text-theme-text-primary font-sans antialiased">
        <LandingPage />
      </div>
    </ThemeProvider>
  );
}

export default App;
