import { Link } from 'react-router-dom';

export default function PricingSection() {
  const plans = [
    {
      name: 'Starter',
      price: 'Free',
      period: '',
      description: 'Get started with the essentials',
      features: [
        'Up to 25 applications',
        'Basic job scoring',
        'Kanban board',
        'Email support',
      ],
      highlight: false,
      cta: 'Start Free',
    },
    {
      name: 'Professional',
      price: '$29',
      period: '/month',
      description: 'For serious job seekers',
      features: [
        'Unlimited applications',
        'Advanced AI scoring',
        'Tailored CV generation',
        'Analytics dashboard',
        'Smart reminders',
        'Priority support',
      ],
      highlight: true,
      cta: 'Get Pro',
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'For teams and recruiters',
      features: [
        'Everything in Pro',
        'Team collaboration',
        'Advanced analytics',
        'API access',
        'Dedicated support',
        'Custom integrations',
      ],
      highlight: false,
      cta: 'Contact Sales',
    },
  ];

  return (
    <section id="pricing" className="pricing-section">
      <div className="section-container">
        <div className="section-header">
          <h2 className="section-title">Simple, Transparent Pricing</h2>
          <p className="section-subtitle">
            Choose the plan that works for you. Always transparent, no hidden fees.
          </p>
        </div>

        <div className="pricing-grid">
          {plans.map((plan, idx) => (
            <div key={idx} className={`pricing-card glass-card ${plan.highlight ? 'highlight' : ''}`}>
              <div className="pricing-header">
                <h3 className="pricing-name">{plan.name}</h3>
                <p className="pricing-description">{plan.description}</p>
              </div>

              <div className="pricing-price">
                <span className="price-amount">{plan.price}</span>
                {plan.period && <span className="price-period">{plan.period}</span>}
              </div>

              <ul className="pricing-features">
                {plan.features.map((feature, fidx) => (
                  <li key={fidx} className="pricing-feature">
                    <span className="feature-check">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link to="/auth/register" className={`btn ${plan.highlight ? 'btn-primary' : 'btn-secondary'} btn-full`}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
