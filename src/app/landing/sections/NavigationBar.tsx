import { Link } from 'react-router-dom';

export default function NavigationBar() {
  return (
    <nav className="landing-nav">
      <Link to="/" className="logo">
        <h1>HireMind</h1>
      </Link>
      <div className="nav-links">
        <a href="#features" className="nav-link">Features</a>
        <a href="#pricing" className="nav-link">Pricing</a>
        <a href="#faq" className="nav-link">FAQ</a>
        <Link to="/auth/login" className="btn btn-ghost">Login</Link>
        <Link to="/auth/register" className="btn btn-primary">Get Started</Link>
      </div>
    </nav>
  );
}
