import { Link } from 'react-router-dom';

export default function CTASection() {
  return (
    <section className="cta-section">
      <div className="cta-container glass-card">
        <h2 className="cta-title">Ready to Transform Your Job Search?</h2>
        <p className="cta-subtitle">
          Join thousands of job seekers using HireMind to land their dream roles.
        </p>
        <div className="cta-buttons">
          <Link to="/auth/register" className="btn btn-primary btn-xl">
            Start Free Today
          </Link>
          <Link to="/auth/login" className="btn btn-secondary btn-xl">
            Sign In
          </Link>
        </div>
        <p className="cta-note">No credit card required. Free forever plan available.</p>
      </div>
    </section>
  );
}
