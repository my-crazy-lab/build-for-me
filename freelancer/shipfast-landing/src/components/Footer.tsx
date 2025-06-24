import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer style={{ 
      background: 'linear-gradient(135deg, var(--color-text) 0%, var(--color-text-secondary) 100%)', 
      color: 'var(--color-text-inverse)', 
      padding: '3rem 0 2rem' 
    }}>
      <div className="container">
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          <div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem' }}>ShipFast</h3>
            <p style={{ color: 'rgba(243, 237, 228, 0.8)', lineHeight: '1.6' }}>
              Professional software solutions to accelerate your business operations and drive growth.
            </p>
          </div>
          <div>
            <h4 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Services</h4>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="#features" style={{ color: 'rgba(243, 237, 228, 0.8)', textDecoration: 'none' }}>
                  Process Automation
                </a>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="#features" style={{ color: 'rgba(243, 237, 228, 0.8)', textDecoration: 'none' }}>
                  System Integration
                </a>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="#features" style={{ color: 'rgba(243, 237, 228, 0.8)', textDecoration: 'none' }}>
                  Analytics & Reporting
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Contact</h4>
            <p style={{ color: 'rgba(243, 237, 228, 0.8)', marginBottom: '0.5rem' }}>
              Email: contact@shipfast.vn
            </p>
            <p style={{ color: 'rgba(243, 237, 228, 0.8)', marginBottom: '0.5rem' }}>
              Phone: 1900 1234
            </p>
            <p style={{ color: 'rgba(243, 237, 228, 0.8)' }}>
              Ho Chi Minh City, Vietnam
            </p>
          </div>
        </div>
        <div style={{ 
          borderTop: '1px solid rgba(243, 237, 228, 0.2)', 
          paddingTop: '2rem', 
          textAlign: 'center',
          color: 'rgba(243, 237, 228, 0.6)'
        }}>
          <p style={{ margin: 0 }}>
            © 2024 ShipFast. All rights reserved. | Professional Software Solutions
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
