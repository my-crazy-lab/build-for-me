import React from 'react';

const About: React.FC = () => {
  return (
    <section id="about" className="section">
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
          <div>
            <h2 className="section-title">About ShipFast</h2>
            <p style={{ fontSize: '1.125rem', color: 'var(--color-text-secondary)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              With over 10 years of experience in software development, ShipFast has been helping businesses 
              streamline their operations and achieve digital transformation.
            </p>
            <p style={{ fontSize: '1.125rem', color: 'var(--color-text-secondary)', lineHeight: '1.6', marginBottom: '2rem' }}>
              Our team of expert developers and consultants work closely with clients to deliver 
              custom solutions that drive real business results.
            </p>
            <button className="btn btn-primary" onClick={() => {
              const element = document.getElementById('contact');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }}>
              Learn More About Us
            </button>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '300px', 
              height: '300px', 
              background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              margin: '0 auto',
              color: 'var(--color-text-inverse)',
              fontSize: '4rem',
              fontWeight: '700'
            }}>
              10+
            </div>
            <p style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--color-text)', marginTop: '1rem' }}>
              Years of Excellence
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
