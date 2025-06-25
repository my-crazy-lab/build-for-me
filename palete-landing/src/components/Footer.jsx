import {
  Twitter,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Palette,
  Heart
} from 'lucide-react';

/**
 * Footer Component
 *
 * Comprehensive footer with:
 * - Company information and logo
 * - Quick navigation links
 * - Social media links
 * - Contact information
 * - Legal links and copyright
 */

export default function Footer() {
  const footerSections = [
    {
      title: 'Product',
      links: [
        { name: 'Features', href: '#features' },
        { name: 'Pricing', href: '#pricing' },
        { name: 'API Documentation', href: '#' },
        { name: 'Integrations', href: '#' },
        { name: 'Changelog', href: '#' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '#' },
        { name: 'Blog', href: '#' },
        { name: 'Careers', href: '#' },
        { name: 'Press Kit', href: '#' },
        { name: 'Contact', href: '#' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { name: 'Help Center', href: '#' },
        { name: 'Community', href: '#' },
        { name: 'Tutorials', href: '#' },
        { name: 'Templates', href: '#' },
        { name: 'Design System', href: '#' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', href: '#' },
        { name: 'Terms of Service', href: '#' },
        { name: 'Cookie Policy', href: '#' },
        { name: 'GDPR', href: '#' },
        { name: 'Security', href: '#' },
      ],
    },
  ];

  const socialLinks = [
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'GitHub', icon: Github, href: '#' },
    { name: 'LinkedIn', icon: Linkedin, href: '#' },
    { name: 'Email', icon: Mail, href: 'mailto:hello@palettesaas.com' },
  ];

  return (
    <footer className="bg-earthy-brown text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-earthy-terracotta to-earthy-olive rounded-lg flex items-center justify-center mr-3">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold">PaletteSaaS</h3>
            </div>

            <p className="text-earthy-light mb-6 leading-relaxed">
              Transform your design workflow with intelligent theme creation.
              Trusted by 10,000+ designers and developers worldwide.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-earthy-light">
                <MapPin className="w-4 h-4 mr-3 flex-shrink-0" />
                <span className="text-sm">San Francisco, CA</span>
              </div>
              <div className="flex items-center text-earthy-light">
                <Phone className="w-4 h-4 mr-3 flex-shrink-0" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center text-earthy-light">
                <Mail className="w-4 h-4 mr-3 flex-shrink-0" />
                <span className="text-sm">hello@palettesaas.com</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 bg-earthy-olive/20 rounded-lg flex items-center justify-center text-earthy-light hover:bg-earthy-terracotta hover:text-white transition-all duration-200"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title} className="lg:col-span-1">
              <h4 className="text-lg font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-earthy-light hover:text-white transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-earthy-olive/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center text-earthy-light text-sm mb-4 md:mb-0">
              <span>© 2024 PaletteSaaS. All rights reserved.</span>
            </div>

            <div className="flex items-center text-earthy-light text-sm">
              <span>Made with</span>
              <Heart className="w-4 h-4 mx-1 text-red-400 fill-current" />
              <span>for designers everywhere</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
