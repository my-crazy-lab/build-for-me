import React, { useState } from 'react';

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "How long does implementation take?",
      answer: "Implementation typically takes 2-8 weeks depending on the complexity of your requirements."
    },
    {
      question: "Do you provide training?",
      answer: "Yes, we provide comprehensive training for your team to ensure smooth adoption of the new system."
    },
    {
      question: "What kind of support do you offer?",
      answer: "We offer 24/7 technical support, regular updates, and ongoing maintenance for all our solutions."
    },
    {
      question: "Can you integrate with our existing systems?",
      answer: "Absolutely! We specialize in seamless integration with ERP, CRM, and other existing business systems."
    }
  ];

  return (
    <section id="faq" className="section" style={{ background: 'var(--color-surface)' }}>
      <div className="container">
        <div className="section-header text-center">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-description">
            Get answers to common questions about our services
          </p>
        </div>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {faqs.map((faq, index) => (
            <div key={index} style={{ 
              background: 'var(--color-background)', 
              border: '2px solid var(--color-border)', 
              borderRadius: 'var(--border-radius-lg)', 
              marginBottom: '1rem',
              overflow: 'hidden'
            }}>
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                style={{
                  width: '100%',
                  padding: '1.5rem',
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: 'var(--color-text)',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                {faq.question}
                <span style={{ fontSize: '1.5rem', color: 'var(--color-primary)' }}>
                  {openIndex === index ? '−' : '+'}
                </span>
              </button>
              {openIndex === index && (
                <div style={{ 
                  padding: '0 1.5rem 1.5rem', 
                  color: 'var(--color-text-secondary)',
                  lineHeight: '1.6'
                }}>
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
