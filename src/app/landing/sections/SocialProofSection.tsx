export default function SocialProofSection() {
  const testimonials = [
    {
      quote: "HireMind saved me hours every week. The AI scoring helped me focus on jobs I'm actually qualified for.",
      author: 'Sarah Chen',
      role: 'Product Manager',
    },
    {
      quote: "The tailored CVs feature increased my interview rate by 40%. Game changer for my job search.",
      author: 'Marcus Johnson',
      role: 'Senior Engineer',
    },
    {
      quote: "Finally, a tool that understands job hunting. No more spreadsheet chaos.",
      author: 'Emily Rodriguez',
      role: 'UX Designer',
    },
  ];

  function NoPhotoIcon() {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z" fill="currentColor" opacity="0.95" />
        <path d="M4 20c0-3.314 2.686-6 6-6h4c3.314 0 6 2.686 6 6v0H4z" fill="currentColor" opacity="0.95" />
      </svg>
    );
  }

  const stats = [
    { number: '10K+', label: 'Active Users' },
    { number: '500K+', label: 'Jobs Analyzed' },
    { number: '92%', label: 'Success Rate' },
    { number: '4.8/5', label: 'User Rating' },
  ];

  return (
    <section className="social-proof-section">
      <div className="section-container">
        <div className="stats-grid">
          {stats.map((stat, idx) => (
            <div key={idx} className="stat-card">
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="testimonials-wrapper">
          <h2 className="section-title">Loved by Job Seekers Everywhere</h2>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="testimonial-card glass-card">
                <div className="testimonial-quote">"{testimonial.quote}"</div>
                <div className="testimonial-author">
                  <span className="author-avatar" aria-hidden>
                    <NoPhotoIcon />
                  </span>
                  <div>
                    <div className="author-name">{testimonial.author}</div>
                    <div className="author-role">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
