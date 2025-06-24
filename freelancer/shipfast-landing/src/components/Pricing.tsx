import React from 'react';

const Pricing: React.FC = () => {
  return (
    <section id="pricing" className="section" style={{ background: 'var(--color-surface)' }}>
      <div className="container">
        <div className="section-header text-center">
          <h2 className="section-title">Flexible Pricing Plans</h2>
          <p className="section-description">
            Choose the perfect plan for your business needs
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <div style={{ background: 'var(--color-background)', border: '2px solid var(--color-border)', borderRadius: 'var(--border-radius-lg)', padding: '2rem', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--color-text)', marginBottom: '1rem' }}>Starter</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--color-primary)', marginBottom: '1rem' }}>$999</div>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>Perfect for small businesses</p>
            <button className="btn btn-secondary" onClick={() => {
              const element = document.getElementById('contact');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }}>Get Started</button>
          </div>
          <div style={{ background: 'var(--color-background)', border: '2px solid var(--color-primary)', borderRadius: 'var(--border-radius-lg)', padding: '2rem', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--color-text)', marginBottom: '1rem' }}>Professional</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--color-primary)', marginBottom: '1rem' }}>$2,999</div>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>Ideal for growing companies</p>
            <button className="btn btn-primary" onClick={() => {
              const element = document.getElementById('contact');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }}>Get Started</button>
          </div>
          <div style={{ background: 'var(--color-background)', border: '2px solid var(--color-border)', borderRadius: 'var(--border-radius-lg)', padding: '2rem', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--color-text)', marginBottom: '1rem' }}>Enterprise</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--color-primary)', marginBottom: '1rem' }}>Custom</div>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>Tailored for large enterprises</p>
            <button className="btn btn-secondary" onClick={() => {
              const element = document.getElementById('contact');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }}>Contact Us</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
