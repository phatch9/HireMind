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
          top: 0;
          margin: 0;
          border-radius: 0;
          z-index: 100;
          border: none;
          border-bottom: 1px solid var(--surface-border);
          background: var(--bg-primary);
        }

        .landing-nav .logo {
          text-decoration: none;
          display: flex;
          align-items: center;
        }

        .landing-nav h1 {
          margin: 0;
        }

        .nav-links {
          display: flex;
          gap: 2rem;
          align-items: center;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        .nav-link {
          text-decoration: none;
          transition: color var(--transition-fast);
          cursor: pointer;
        }

        .nav-link:hover {
          color: var(--text-primary);
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
          font-size: clamp(1.75rem, 5vw, 2.5rem);
          line-height: 1.3;
          margin-bottom: 1.5rem;
          font-weight: 400;
          font-family: var(--font-heading);
          color: var(--text-primary);
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
        }

        .mock-card {
          background: var(--surface-bg);
          border: 1px solid var(--surface-border);
          border-radius: var(--radius-md);
          padding: 1.5rem;
          position: relative;
          transition: border-color var(--transition-fast);
        }

        .mock-card:hover {
          border-color: var(--surface-border-strong);
        }

        .mock-card h3 {
          margin: 0.5rem 0 0.25rem;
          font-size: 1.1rem;
          font-weight: 600;
          font-family: var(--font-heading);
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
          margin-bottom: 1rem;
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
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .feature-card {
          padding: 2rem;
          border-radius: var(--radius-md);
          transition: border-color var(--transition-fast);
          display: flex;
          flex-direction: column;
          gap: 1rem;
          border: 1px solid var(--surface-border);
          background: var(--surface-bg);
        }

        .feature-card:hover {
          border-color: var(--surface-border-strong);
        }

        .feature-icon {
          font-size: 3rem;
          line-height: 1;
        }

        .feature-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0;
          font-family: var(--font-heading);
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
          border-radius: var(--radius-md);
          text-align: center;
          border: 1px solid var(--surface-border);
          background: var(--surface-bg);
          transition: border-color var(--transition-fast);
        }

        .how-it-works-card:hover {
          border-color: var(--surface-border-strong);
        }

        .step-number {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 3rem;
          height: 3rem;
          border-radius: var(--radius-sm);
          background: var(--surface-bg);
          border: 1px solid var(--surface-border);
          color: var(--text-primary);
          font-weight: 700;
          font-size: 1.25rem;
          flex-shrink: 0;
        }

        .step-content h3 {
          margin: 0 0 0.5rem;
          font-size: 1.125rem;
          font-weight: 600;
          font-family: var(--font-heading);
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
          font-weight: 700;
          font-family: var(--font-heading);
          color: var(--text-primary);
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
          border: 1px solid var(--surface-border);
          background: var(--surface-bg);
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          transition: border-color var(--transition-fast);
        }

        .testimonial-card:hover {
          border-color: var(--surface-border-strong);
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
          border: 1px solid var(--surface-border);
          background: var(--surface-bg);
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          transition: border-color var(--transition-fast);
          position: relative;
        }

        .pricing-card.highlight {
          border-color: var(--accent-primary);
          background: var(--surface-bg);
        }

        .pricing-card:hover {
          border-color: var(--surface-border-strong);
        }

        .pricing-card.highlight:hover {
          border-color: var(--accent-primary);
        }

        .pricing-header {
          border-bottom: 1px solid var(--surface-border);
          padding-bottom: 1.5rem;
        }

        .pricing-name {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0;
          font-family: var(--font-heading);
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
          font-weight: 700;
          font-family: var(--font-heading);
          color: var(--text-primary);
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
        }

        .faq-list {
          max-width: 800px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .faq-item {
          border: 1px solid var(--surface-border);
          border-radius: var(--radius-md);
          background: var(--surface-bg);
          transition: border-color var(--transition-fast);
          overflow: hidden;
        }

        .faq-item.open {
          border-color: var(--accent-primary);
          background: var(--surface-bg);
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
          border: 1px solid var(--surface-border);
          background: var(--surface-bg);
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
          font-family: var(--font-heading);
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
          border-top: 1px solid var(--surface-border);
          background: var(--bg-primary);
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
          font-family: var(--font-heading);
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
          background: var(--surface-border);
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

        .step-card:hover {
          border-color: var(--surface-border-strong);
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
          background: var(--surface-bg);
          border: 1px solid var(--surface-border);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.25rem;
          color: var(--text-primary);
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
          font-weight: 700;
          font-family: var(--font-heading);
          color: var(--text-primary);
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
          border: 1px solid var(--surface-border);
          background: var(--surface-bg);
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          transition: border-color var(--transition-fast);
        }

        .testimonial-card:hover {
          border-color: var(--surface-border-strong);
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
          border: 1px solid var(--surface-border);
          background: var(--surface-bg);
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          transition: border-color var(--transition-fast);
          position: relative;
        }

        .pricing-card.highlight {
          border-color: var(--accent-primary);
          background: var(--surface-bg);
        }

        .pricing-card:hover {
          border-color: var(--surface-border-strong);
        }

        .pricing-card.highlight:hover {
          border-color: var(--accent-primary);
        }

        .pricing-header {
          border-bottom: 1px solid var(--surface-border);
          padding-bottom: 1.5rem;
        }

        .pricing-name {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0;
          font-family: var(--font-heading);
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
          font-weight: 700;
          font-family: var(--font-heading);
          color: var(--text-primary);
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
        }

        .faq-list {
          max-width: 800px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .faq-item {
          border: 1px solid var(--surface-border);
          border-radius: var(--radius-md);
          background: var(--surface-bg);
          transition: border-color var(--transition-fast);
          overflow: hidden;
        }

        .faq-item.open {
          border-color: var(--accent-primary);
          background: var(--surface-bg);
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
          border: 1px solid var(--surface-border);
          background: var(--surface-bg);
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
          font-family: var(--font-heading);
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
          border-top: 1px solid var(--surface-border);
          background: var(--bg-primary);
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
          font-family: var(--font-heading);
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
          background: var(--surface-border);
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

      `}</style>
    </div>
  );
}
