import NavigationBar from './sections/NavigationBar';
import HeroSection from './sections/HeroSection';
import FeaturesSection from './sections/FeaturesSection';
import HowItWorksSection from './sections/HowItWorksSection';
import SocialProofSection from './sections/SocialProofSection';
import PricingSection from './sections/PricingSection';
import FAQSection from './sections/FAQSection';
import CTASection from './sections/CTASection';
import FooterSection from './sections/FooterSection';

export default function LandingPage() {
  return (
    <div className="landing-container">
      <NavigationBar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <SocialProofSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
      <FooterSection />

      <style>{`
        /* ========================================
          LANDING PAGE - GLOBAL STYLES
        ======================================== */

        .landing-container {
          min-height: 100vh;
          color: var(--text-primary);
          overflow-x: hidden;
          position: relative;
          display: flex;
          flex-direction: column;
        }

        /* ========================================
          NAVIGATION BAR
        ======================================== */

        .landing-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          position: sticky;
          top: 1rem;
          margin: 0 1rem;
          border-radius: 0.5rem;
          z-index: 100;
          border: 1px solid rgba(200, 90, 58, 0.15);
          background: rgba(250, 248, 245, 0.9);
        }

        .landing-nav .logo {
          text-decoration: none;
          display: flex;
          align-items: center;
        }

        .landing-nav h1 {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0;
          font-family: 'Georgia', serif;
          color: var(--accent-primary);
        }

        .nav-links {
          display: flex;
          gap: 2rem;
          align-items: center;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        .nav-link {
          color: var(--text-secondary);
          text-decoration: none;
          font-weight: 500;
          transition: color var(--transition-base);
          cursor: pointer;
        }

        .nav-link:hover {
          color: var(--accent-primary);
        }

        @media (max-width: 768px) {
          .landing-nav {
            flex-direction: column;
            gap: 1rem;
          }

          .nav-links {
            gap: 1rem;
            width: 100%;
          }

          .nav-link {
            display: none;
          }
        }

        /* ========================================
           HERO SECTION
           ======================================== */

        .hero-section {
          padding: 6rem 2rem;
          position: relative;
          overflow: hidden;
        }

        .hero-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 4rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        @media (min-width: 1024px) {
          .hero-wrapper {
            flex-direction: row;
            text-align: left;
            justify-content: space-between;
            align-items: center;
          }
        }

        .hero-content {
          flex: 1;
          max-width: 600px;
        }

        .hero-title {
          font-size: clamp(2rem, 5vw, 3.5rem);
          line-height: 1.2;
          margin-bottom: 1.5rem;
          font-weight: 800;
          letter-spacing: -0.02em;
        }

        .hero-subtitle {
          font-size: 1.125rem;
          color: var(--text-secondary);
          margin-bottom: 2.5rem;
          line-height: 1.6;
        }

        .hero-cta {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        @media (min-width: 1024px) {
          .hero-cta {
            justify-content: flex-start;
          }
        }

        .btn-xl {
          padding: 1rem 2rem;
          font-size: 1.1rem;
          border-radius: var(--radius-lg);
        }

        .hero-visual {
          flex: 1;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          max-width: 400px;
          transform: rotate(-3deg);
          transition: transform var(--transition-base);
        }

        .hero-visual:hover {
          transform: rotate(0deg) scale(1.02);
        }

        .mock-card {
          background: rgba(250, 248, 245, 0.7);
          border: 1px solid rgba(200, 90, 58, 0.2);
          border-radius: var(--radius-md);
          padding: 1.5rem;
          position: relative;
          transition: all var(--transition-base);
        }

        .mock-card:hover {
          border-color: var(--accent-primary);
          background: rgba(250, 248, 245, 0.9);
          transform: translateY(-2px);
        }

        .mock-card h3 {
          margin: 0.5rem 0 0.25rem;
          font-size: 1.1rem;
          font-weight: 600;
          font-family: 'Georgia', serif;
        }

        .mock-card p {
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .mock-card .badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          font-size: 0.75rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .mock-card.applied .badge { background: rgba(212, 117, 80, 0.15); color: var(--accent-secondary); }
        .mock-card.interview .badge { background: rgba(212, 165, 116, 0.15); color: var(--accent-warning); }
        .mock-card.offer .badge { background: rgba(139, 158, 77, 0.15); color: var(--accent-success); }

        .score-badge {
          display: inline-block;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--accent-success);
          background: rgba(139, 158, 77, 0.08);
          padding: 0.25rem 0.5rem;
          border-radius: 0.5rem;
          margin-top: 0.5rem;
        }

        /* ========================================
           SECTION CONTAINER & HEADERS
           ======================================== */

        .section-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .section-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .section-title {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 800;
          margin-bottom: 1rem;
          letter-spacing: -0.02em;
        }

        .section-subtitle {
          font-size: 1.125rem;
          color: var(--text-secondary);
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }

        /* ========================================
           FEATURES SECTION
           ======================================== */

        .features-section {
          padding: 6rem 2rem;
          background: linear-gradient(180deg, transparent, rgba(99, 102, 241, 0.05));
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .feature-card {
          padding: 2rem;
          border-radius: var(--radius-md);
          transition: all var(--transition-base);
          display: flex;
          flex-direction: column;
          gap: 1rem;
          border: 1px solid rgba(200, 90, 58, 0.2);
          background: rgba(250, 248, 245, 0.7);
        }

        .feature-card:hover {
          border-color: var(--accent-primary);
          transform: translateY(-4px);
          background: rgba(250, 248, 245, 0.9);
        }

        .feature-icon {
          font-size: 3rem;
          line-height: 1;
        }

        .feature-title {
          font-size: 1.25rem;
          font-weight: 600;
          font-family: 'Georgia', serif;
        }
          margin: 0;
        }

        .feature-description {
          color: var(--text-secondary);
          line-height: 1.6;
          margin: 0;
        }

        /* ========================================
           HOW IT WORKS SECTION
           ======================================== */

        .how-it-works-section {
          padding: 6rem 2rem;
        }

        .steps-wrapper {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          max-width: 1000px;
          margin: 0 auto;
        }

        @media (min-width: 768px) {
          .steps-wrapper {
            flex-direction: row;
            align-items: flex-start;
            justify-content: space-around;
          }
        }

        .step-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
          position: relative;
        }

        .step-card {
          width: 100%;
          padding: 2rem;
          border-radius: var(--radius-xl);
          text-align: center;
          border: 1px solid rgba(200, 90, 58, 0.2);
          background: rgba(250, 248, 245, 0.7);
          transition: all var(--transition-base);
        }

        .how-it-works-card:hover {
          border-color: var(--accent-primary);
          background: rgba(250, 248, 245, 0.9);
          transform: translateY(-2px);
        }

        .step-number {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 3rem;
          height: 3rem;
          border-radius: 0.5rem;
          background: var(--accent-primary);
          color: white;
          font-weight: 700;
          font-size: 1.25rem;
          flex-shrink: 0;
        }

        .step-content h3 {
          margin: 0 0 0.5rem;
          font-size: 1.125rem;
          font-weight: 600;
          font-family: 'Georgia', serif;
        }

        .step-content p {
          margin: 0;
          color: var(--text-secondary);
          line-height: 1.6;
          font-size: 0.95rem;
        }

        .step-arrow {
          font-size: 2rem;
          color: var(--accent-primary);
          display: none;
        }

        @media (min-width: 768px) {
          .step-arrow {
            display: block;
          }
        }

        /* ========================================
           SOCIAL PROOF SECTION
           ======================================== */

        .social-proof-section {
          padding: 6rem 2rem;
          background: linear-gradient(180deg, transparent, rgba(200, 90, 58, 0.02));
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
          margin-bottom: 4rem;
          max-width: 1000px;
          margin-left: auto;
          margin-right: auto;
        }

        .stat-card {
          text-align: center;
          padding: 2rem;
        }

        .stat-number {
          font-size: clamp(2rem, 5vw, 3rem);
          font-weight: 800;
          color: var(--accent-primary);
        }

        .stat-label {
          font-size: 1rem;
          color: var(--text-secondary);
          margin-top: 0.5rem;
          font-weight: 500;
        }

        .testimonials-wrapper {
          max-width: 1000px;
          margin: 0 auto;
        }

        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-top: 3rem;
        }

        .testimonial-card {
          padding: 2rem;
          border-radius: var(--radius-md);
          border: 1px solid rgba(200, 90, 58, 0.2);
          background: rgba(250, 248, 245, 0.7);
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          transition: all var(--transition-base);
        }

        .testimonial-card:hover {
          border-color: var(--accent-primary);
          transform: translateY(-2px);
        }

        .testimonial-quote {
          font-style: italic;
          line-height: 1.6;
          color: var(--text-secondary);
          font-size: 1rem;
        }

        .testimonial-author {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .author-avatar {
          font-size: 2.5rem;
          line-height: 1;
        }

        .author-name {
          font-weight: 600;
          font-size: 1rem;
        }

        .author-role {
          color: var(--text-secondary);
          font-size: 0.875rem;
        }

        /* ========================================
           PRICING SECTION
           ======================================== */

        .pricing-section {
          padding: 6rem 2rem;
        }

        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          max-width: 1100px;
          margin: 0 auto;
        }

        .pricing-card {
          padding: 2.5rem;
          border-radius: var(--radius-md);
          border: 1px solid rgba(200, 90, 58, 0.2);
          background: rgba(250, 248, 245, 0.7);
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          transition: all var(--transition-base);
          position: relative;
        }

        .pricing-card.highlight {
          border-color: var(--accent-primary);
          background: rgba(200, 90, 58, 0.08);
          transform: scale(1.02);
        }

        .pricing-card:hover {
          transform: translateY(-4px);
        }

        .pricing-card.highlight:hover {
          transform: scale(1.04) translateY(-4px);
        }

        .pricing-header {
          border-bottom: 1px solid rgba(200, 90, 58, 0.2);
          padding-bottom: 1.5rem;
        }

        .pricing-name {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0;
          font-family: 'Georgia', serif;
        }

        .pricing-description {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin: 0.5rem 0 0;
        }

        .pricing-price {
          display: flex;
          align-items: baseline;
          gap: 0.5rem;
        }

        .price-amount {
          font-size: 2.5rem;
          font-weight: 800;
          color: var(--accent-primary);
        }

        .price-period {
          color: var(--text-secondary);
          font-size: 1rem;
        }

        .pricing-features {
          flex: 1;
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .pricing-feature {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.95rem;
          color: var(--text-secondary);
        }

        .feature-check {
          color: var(--accent-success);
          font-weight: 700;
          flex-shrink: 0;
        }

        .btn-full {
          width: 100%;
        }

        /* ========================================
           FAQ SECTION
           ======================================== */

        .faq-section {
          padding: 6rem 2rem;
          background: linear-gradient(180deg, transparent, rgba(200, 90, 58, 0.02));
        }

        .faq-list {
          max-width: 800px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .faq-item {
          border: 1px solid rgba(200, 90, 58, 0.2);
          border-radius: var(--radius-sm);
          background: rgba(250, 248, 245, 0.6);
          transition: all var(--transition-base);
          overflow: hidden;
        }

        .faq-item.open {
          border-color: var(--accent-primary);
          background: rgba(200, 90, 58, 0.08);
        }

        .faq-question {
          width: 100%;
          padding: 1.5rem;
          background: none;
          border: none;
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          transition: color var(--transition-base);
        }

        .faq-question:hover {
          color: var(--accent-primary);
        }

        .faq-icon {
          font-size: 1.5rem;
          line-height: 1;
          flex-shrink: 0;
        }

        .faq-answer {
          padding: 0 1.5rem 1.5rem;
          animation: slideDown var(--transition-base) ease-out;
        }

        .faq-answer p {
          color: var(--text-secondary);
          line-height: 1.6;
          margin: 0;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* ========================================
           CTA SECTION
           ======================================== */

        .cta-section {
          padding: 6rem 2rem;
        }

        .cta-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 3rem;
          border-radius: var(--radius-md);
          border: 1px solid rgba(200, 90, 58, 0.2);
          background: linear-gradient(135deg, rgba(200, 90, 58, 0.08), rgba(212, 165, 116, 0.05));
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .cta-title {
          font-size: clamp(1.75rem, 4vw, 2.5rem);
          font-weight: 800;
          margin: 0;
          letter-spacing: -0.02em;
          font-family: 'Georgia', serif;
        }

        .cta-subtitle {
          font-size: 1.125rem;
          color: var(--text-secondary);
          margin: 0;
          line-height: 1.6;
        }

        .cta-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .cta-note {
          color: var(--text-tertiary);
          font-size: 0.875rem;
          margin: 0;
        }

        /* ========================================
           FOOTER SECTION
           ======================================== */

        .footer-section {
          padding: 4rem 2rem 2rem;
          border-top: 1px solid rgba(200, 90, 58, 0.15);
          background: rgba(200, 90, 58, 0.04);
          color: var(--text-secondary);
        }

        .footer-content {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto 2rem;
        }

        .footer-column {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .footer-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--accent-primary);
          margin: 0;
          font-family: 'Georgia', serif;
        }

        .footer-description {
          font-size: 0.95rem;
          line-height: 1.6;
          margin: 0;
        }

        .footer-heading {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
        }

        .footer-links {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .footer-links a,
        .footer-links li a {
          color: var(--text-secondary);
          text-decoration: none;
          transition: color var(--transition-base);
          font-size: 0.95rem;
        }

        .footer-links a:hover,
        .footer-links li a:hover {
          color: var(--accent-primary);
        }

        .footer-socials {
          display: flex;
          gap: 1rem;
          font-size: 1.25rem;
          margin-top: 0.5rem;
        }

        .social-link {
          color: var(--text-secondary);
          transition: color var(--transition-base);
          text-decoration: none;
          font-weight: 600;
        }

        .social-link:hover {
          color: var(--accent-primary);
        }

        .footer-divider {
          height: 1px;
          background: rgba(200, 90, 58, 0.15);
          margin: 2rem auto;
          max-width: 1200px;
        }

        .footer-bottom {
          text-align: center;
        }

        .footer-copyright {
          color: var(--text-tertiary);
          font-size: 0.875rem;
          margin: 0;
        }

        /* ========================================
           RESPONSIVE DESIGN
           ======================================== */

        @media (max-width: 768px) {
          .hero-section {
            padding: 4rem 1rem;
          }

          .features-section,
          .how-it-works-section,
          .social-proof-section,
          .pricing-section,
          .faq-section,
          .cta-section,
          .footer-section {
            padding: 4rem 1rem;
          }

          .features-grid,
          .testimonials-grid,
          .pricing-grid {
            grid-template-columns: 1fr;
          }

          .pricing-card.highlight {
            transform: scale(1);
          }

          .section-title {
            font-size: 1.75rem;
          }

          .cta-container {
            padding: 2rem;
          }

          .steps-wrapper {
            gap: 1rem;
          }

          .step-arrow {
            transform: rotate(90deg);
            margin: 0.5rem 0;
          }
        }

        /* ========================================
           LIGHT THEME OVERRIDES
           ======================================== */

        .light .landing-nav {
          background: rgba(245, 241, 237, 0.9);
          backdrop-filter: blur(10px);
          transition: all var(--transition-base);
          position: relative;
        }

        .step-card:hover {
          border-color: var(--accent-primary);
          transform: scale(1.05);
        }

        .step-icon {
          font-size: 2.5rem;
          line-height: 1;
          margin-bottom: 1rem;
        }

        .step-number {
          position: absolute;
          top: -1rem;
          left: 50%;
          transform: translateX(-50%);
          width: 2.5rem;
          height: 2.5rem;
          background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 1.25rem;
          color: white;
        }

        .step-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 1rem 0 0.5rem;
        }

        .step-description {
          color: var(--text-secondary);
          line-height: 1.6;
          margin: 0;
        }

        .step-arrow {
          font-size: 2rem;
          color: var(--accent-primary);
          display: none;
        }

        @media (min-width: 768px) {
          .step-arrow {
            display: block;
          }
        }

        /* ========================================
           SOCIAL PROOF SECTION
           ======================================== */

        .social-proof-section {
          padding: 6rem 2rem;
          background: linear-gradient(180deg, transparent, rgba(200, 90, 58, 0.02));
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
          margin-bottom: 4rem;
          max-width: 1000px;
          margin-left: auto;
          margin-right: auto;
        }

        .stat-card {
          text-align: center;
          padding: 2rem;
        }

        .stat-number {
          font-size: clamp(2rem, 5vw, 3rem);
          font-weight: 800;
          color: var(--accent-primary);
        }

        .stat-label {
          font-size: 1rem;
          color: var(--text-secondary);
          margin-top: 0.5rem;
          font-weight: 500;
        }

        .testimonials-wrapper {
          max-width: 1000px;
          margin: 0 auto;
        }

        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-top: 3rem;
        }

        .testimonial-card {
          padding: 2rem;
          border-radius: var(--radius-md);
          border: 1px solid rgba(200, 90, 58, 0.2);
          background: rgba(250, 248, 245, 0.7);
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          transition: all var(--transition-base);
        }

        .testimonial-card:hover {
          border-color: var(--accent-primary);
          transform: translateY(-2px);
        }

        .testimonial-quote {
          font-style: italic;
          line-height: 1.6;
          color: var(--text-secondary);
          font-size: 1rem;
        }

        .testimonial-author {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .author-avatar {
          font-size: 2.5rem;
          line-height: 1;
        }

        .author-name {
          font-weight: 600;
          font-size: 1rem;
        }

        .author-role {
          color: var(--text-secondary);
          font-size: 0.875rem;
        }

        /* ========================================
           PRICING SECTION
           ======================================== */

        .pricing-section {
          padding: 6rem 2rem;
        }

        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          max-width: 1100px;
          margin: 0 auto;
        }

        .pricing-card {
          padding: 2.5rem;
          border-radius: var(--radius-md);
          border: 1px solid rgba(200, 90, 58, 0.2);
          background: rgba(250, 248, 245, 0.7);
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          transition: all var(--transition-base);
          position: relative;
        }

        .pricing-card.highlight {
          border-color: var(--accent-primary);
          background: rgba(200, 90, 58, 0.08);
          transform: scale(1.02);
        }

        .pricing-card:hover {
          transform: translateY(-4px);
        }

        .pricing-card.highlight:hover {
          transform: scale(1.04) translateY(-4px);
        }

        .pricing-header {
          border-bottom: 1px solid rgba(200, 90, 58, 0.2);
          padding-bottom: 1.5rem;
        }

        .pricing-name {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0;
          font-family: 'Georgia', serif;
        }

        .pricing-description {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin: 0.5rem 0 0;
        }

        .pricing-price {
          display: flex;
          align-items: baseline;
          gap: 0.5rem;
        }

        .price-amount {
          font-size: 2.5rem;
          font-weight: 800;
          color: var(--accent-primary);
        }

        .price-period {
          color: var(--text-secondary);
          font-size: 1rem;
        }

        .pricing-features {
          flex: 1;
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .pricing-feature {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.95rem;
          color: var(--text-secondary);
        }

        .feature-check {
          color: var(--accent-success);
          font-weight: 700;
          flex-shrink: 0;
        }

        .btn-full {
          width: 100%;
        }

        /* ========================================
           FAQ SECTION
           ======================================== */

        .faq-section {
          padding: 6rem 2rem;
          background: linear-gradient(180deg, transparent, rgba(200, 90, 58, 0.02));
        }

        .faq-list {
          max-width: 800px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .faq-item {
          border: 1px solid rgba(200, 90, 58, 0.2);
          border-radius: var(--radius-sm);
          background: rgba(250, 248, 245, 0.6);
          transition: all var(--transition-base);
          overflow: hidden;
        }

        .faq-item.open {
          border-color: var(--accent-primary);
          background: rgba(200, 90, 58, 0.08);
        }

        .faq-question {
          width: 100%;
          padding: 1.5rem;
          background: none;
          border: none;
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          transition: color var(--transition-base);
        }

        .faq-question:hover {
          color: var(--accent-primary);
        }

        .faq-icon {
          font-size: 1.5rem;
          line-height: 1;
          flex-shrink: 0;
        }

        .faq-answer {
          padding: 0 1.5rem 1.5rem;
          animation: slideDown var(--transition-base) ease-out;
        }

        .faq-answer p {
          color: var(--text-secondary);
          line-height: 1.6;
          margin: 0;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* ========================================
           CTA SECTION
           ======================================== */

        .cta-section {
          padding: 6rem 2rem;
        }

        .cta-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 3rem;
          border-radius: var(--radius-md);
          border: 1px solid rgba(200, 90, 58, 0.2);
          background: linear-gradient(135deg, rgba(200, 90, 58, 0.08), rgba(212, 165, 116, 0.05));
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .cta-title {
          font-size: clamp(1.75rem, 4vw, 2.5rem);
          font-weight: 800;
          margin: 0;
          letter-spacing: -0.02em;
          font-family: 'Georgia', serif;
        }

        .cta-subtitle {
          font-size: 1.125rem;
          color: var(--text-secondary);
          margin: 0;
          line-height: 1.6;
        }

        .cta-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .cta-note {
          color: var(--text-tertiary);
          font-size: 0.875rem;
          margin: 0;
        }

        /* ========================================
           FOOTER SECTION
           ======================================== */

        .footer-section {
          padding: 4rem 2rem 2rem;
          border-top: 1px solid rgba(200, 90, 58, 0.15);
          background: rgba(200, 90, 58, 0.04);
          color: var(--text-secondary);
        }

        .footer-content {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto 2rem;
        }

        .footer-column {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .footer-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--accent-primary);
          margin: 0;
          font-family: 'Georgia', serif;
        }

        .footer-description {
          font-size: 0.95rem;
          line-height: 1.6;
          margin: 0;
        }

        .footer-heading {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
        }

        .footer-links {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .footer-links a,
        .footer-links li a {
          color: var(--text-secondary);
          text-decoration: none;
          transition: color var(--transition-base);
          font-size: 0.95rem;
        }

        .footer-links a:hover,
        .footer-links li a:hover {
          color: var(--accent-primary);
        }

        .footer-socials {
          display: flex;
          gap: 1rem;
          font-size: 1.25rem;
          margin-top: 0.5rem;
        }

        .social-link {
          color: var(--text-secondary);
          transition: color var(--transition-base);
          text-decoration: none;
          font-weight: 600;
        }

        .social-link:hover {
          color: var(--accent-primary);
        }

        .footer-divider {
          height: 1px;
          background: rgba(200, 90, 58, 0.15);
          margin: 2rem auto;
          max-width: 1200px;
        }

        .footer-bottom {
          text-align: center;
        }

        .footer-copyright {
          color: var(--text-tertiary);
          font-size: 0.875rem;
          margin: 0;
        }

        /* ========================================
           RESPONSIVE DESIGN
           ======================================== */

        @media (max-width: 768px) {
          .hero-section {
            padding: 4rem 1rem;
          }

          .features-section,
          .how-it-works-section,
          .social-proof-section,
          .pricing-section,
          .faq-section,
          .cta-section,
          .footer-section {
            padding: 4rem 1rem;
          }

          .features-grid,
          .testimonials-grid,
          .pricing-grid {
            grid-template-columns: 1fr;
          }

          .pricing-card.highlight {
            transform: scale(1);
          }

          .section-title {
            font-size: 1.75rem;
          }

          .cta-container {
            padding: 2rem;
          }

          .steps-wrapper {
            gap: 1rem;
          }

          .step-arrow {
            transform: rotate(90deg);
            margin: 0.5rem 0;
          }
        }

        /* ========================================
           LIGHT THEME OVERRIDES
           ======================================== */

        .light .landing-nav {
          background: rgba(245, 241, 237, 0.9);
          border-color: rgba(0, 0, 0, 0.1);
        }

        .light .feature-card,
        .light .testimonial-card,
        .light .step-card,
        .light .faq-item,
        .light .mock-card {
          background: rgba(245, 241, 237, 0.9);
          border-color: rgba(0, 0, 0, 0.1);
        }

        .light .pricing-card {
          background: rgba(245, 241, 237, 0.95);
        }

        .light .pricing-card.highlight {
          background: rgba(99, 102, 241, 0.1);
        }

        .light .cta-container {
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(168, 85, 247, 0.05));
        }
      `}</style>
    </div>
  );
}
