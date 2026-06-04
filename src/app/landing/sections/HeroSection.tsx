import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <section className="hero-section">
      <div className="hero-wrapper">
        <div className="hero-content">
          <h1 className="hero-title">
            Track your job search <br />
            <span className="text-gradient">with AI-powered clarity</span>
          </h1>
          <p className="hero-subtitle">
            Stop using spreadsheets. Get intelligent job scoring, AI-tailored CVs, and a beautiful Kanban board 
            to manage your entire job search workflow in one place.
          </p>
          <div className="hero-cta">
            <Link to="/auth/register" className="btn btn-primary btn-xl">
              Start Free Today
            </Link>
            <Link to="/auth/login" className="btn btn-secondary btn-xl">
              View Demo
            </Link>
          </div>
        </div>

        <div className="hero-visual glass-card">
          <div className="mock-card applied">
            <div className="badge">Applied</div>
            <h3>Senior Frontend Engineer</h3>
            <p>Tech Corp Inc.</p>
            <div className="score-badge">Score: 8.5/10</div>
          </div>
          <div className="mock-card interview">
            <div className="badge">Interview</div>
            <h3>Product Designer</h3>
            <p>Creative Studio</p>
            <div className="score-badge">Score: 9.2/10</div>
          </div>
          <div className="mock-card offer">
            <div className="badge">Offer</div>
            <h3>Full Stack Developer</h3>
            <p>StartupAI</p>
            <div className="score-badge">Score: 8.9/10</div>
          </div>
        </div>
      </div>
    </section>
  );
}
