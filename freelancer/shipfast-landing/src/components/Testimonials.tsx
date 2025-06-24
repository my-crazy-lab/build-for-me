import React from 'react';

const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="section">
      <div className="container">
        <div className="section-header text-center">
          <h2 className="section-title">What Our Clients Say</h2>
          <p className="section-description">
            Trusted by 500+ companies worldwide
          </p>
        </div>
        <div style={{ textAlign: 'center', padding: '2rem', background: 'var(--color-surface)', borderRadius: 'var(--border-radius-lg)' }}>
          <p style={{ fontSize: '1.125rem', color: 'var(--color-text-secondary)' }}>
            "ShipFast transformed our business operations completely. We've seen 40% cost reduction and improved efficiency across all departments."
          </p>
          <p style={{ fontWeight: '600', color: 'var(--color-primary)', marginTop: '1rem' }}>
            - CEO, Tech Company
          </p>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
