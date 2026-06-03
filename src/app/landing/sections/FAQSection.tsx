import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: 'How does the AI job scoring work?',
      answer: 'Our AI algorithm analyzes the job description, company info, and your profile to create a compatibility score from 1-10. It considers factors like required skills, experience level, location, salary, and career growth potential.',
    },
    {
      question: 'Can I use HireMind for free?',
      answer: 'Yes! Our Starter plan is completely free and includes up to 25 applications, basic job scoring, and a Kanban board. Upgrade to Pro for unlimited applications and advanced features.',
    },
    {
      question: 'How does the tailored CV feature work?',
      answer: 'Simply upload your resume and HireMind will analyze each job description you save. When you request a tailored CV, our AI regenerates your resume to highlight relevant skills and experience for that specific job.',
    },
    {
      question: 'Is my data secure?',
      answer: 'Absolutely. We use enterprise-grade encryption, secure authentication via Supabase, and strict data privacy practices. Your resume and personal information are never shared with third parties.',
    },
    {
      question: 'Can I export my data?',
      answer: 'Yes! You can export all your applications and data as CSV or JSON at any time. Your data always belongs to you.',
    },
    {
      question: 'Do you offer team collaboration?',
      answer: 'Team features are available in our Enterprise plan. Contact our sales team for custom team setup and API access.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers for Enterprise plans.',
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="faq-section">
      <div className="section-container">
        <div className="section-header">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-subtitle">
            Everything you need to know about HireMind
          </p>
        </div>

        <div className="faq-list">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className={`faq-item ${openIndex === idx ? 'open' : ''}`}
            >
              <button
                className="faq-question"
                onClick={() => toggleFAQ(idx)}
              >
                <span>{faq.question}</span>
                <span className="faq-icon">
                  {openIndex === idx ? '−' : '+'}
                </span>
              </button>
              {openIndex === idx && (
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
