export default function HowItWorksSection() {
  const steps = [
    {
      number: '1',
      title: 'Upload & Import',
      description: 'Add jobs manually or auto-import from job boards. HireMind syncs with your profile.',
    },
    {
      number: '2',
      title: 'Score & Analyze',
      description: 'AI evaluates each job against your experience. Get instant fit scores and recommendations.',
    },
    {
      number: '3',
      title: 'Track & Optimize',
      description: 'Organize applications on your Kanban board. Track interviews, offers, and follow-ups effortlessly.',
    },
  ];

  return (
    <section className="how-it-works-section">
      <div className="section-container">
        <div className="section-header">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">
            Three simple steps to master your job search
          </p>
        </div>

        <div className="steps-wrapper">
          {steps.map((step, idx) => (
            <div key={idx} className="step-container">
              <div className="step-card glass-card">
                {/* icon removed for cleaner layout */}
                <div className="step-number">{step.number}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
              </div>
              {idx < steps.length - 1 && <div className="step-arrow">→</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
