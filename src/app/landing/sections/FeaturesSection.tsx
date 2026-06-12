export default function FeaturesSection() {
  const features = [
    {
      title: 'AI Job Scoring',
      description: 'Intelligent algorithm analyzes job descriptions and scores fit based on your profile. Know which jobs are worth applying to.',
    },
    {
      title: 'Tailored CVs',
      description: 'Auto-generate custom CVs tailored to each job description. Increase your chances of getting past ATS systems.',
    },
    {
      title: 'Kanban Board',
      description: 'Beautiful drag-and-drop interface to organize applications from wishlist to offer. Perfect visibility of your pipeline.',
    },
    {
      title: 'Analytics',
      description: 'Track your success rate, pipeline health, and application trends. Data-driven insights for better decision making.',
    },
    {
      title: 'Smart Reminders',
      description: 'Never miss a follow-up. Automatic reminders for interviews, follow-ups, and application deadlines.',
    },
    {

      title: 'Lightning Fast',
      description: 'Real-time sync across all your devices. Add, update, and track applications instantly from anywhere.',
    },
  ];

  return (
    <section id="features" className="features-section">
      <div className="section-container">
        <div className="section-header">
          <h2 className="section-title">Powerful Features for Serious Job Seekers</h2>
          <p className="section-subtitle">
            Everything you need to manage, optimize, and succeed in your job search
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, idx) => (
            <div key={idx} className="feature-card glass-card">
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
