import { Link } from 'react-router-dom';

export default function FooterSection() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-section">
      <div className="section-container">
        <div className="footer-content">
          <div className="footer-column">
            <h3 className="footer-title">HireMind</h3>
            <p className="footer-description">
              AI-powered job search and application tracking for serious professionals.
            </p>
            <div className="footer-socials">
              <a href="#" className="social-link" title="Twitter">𝕏</a>
              <a href="#" className="social-link" title="LinkedIn">in</a>
              <a href="#" className="social-link" title="GitHub">⚙️</a>
            </div>
          </div>

          <div className="footer-column">
            <h4 className="footer-heading">Product</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><a href="#features">Features</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4 className="footer-heading">Company</h4>
            <ul className="footer-links">
              <li><a href="#">About Us</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4 className="footer-heading">Legal</h4>
            <ul className="footer-links">
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Cookie Policy</a></li>
              <li><a href="#">Security</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © {currentYear} HireMind. All rights reserved. | Made with 💜 by the HireMind team.
          </p>
        </div>
      </div>
    </footer>
  );
}
