import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <span className="brand-mark">N</span>
          <div>
            <strong>Nyumba</strong>
            <p>One place to run every property, unit, and tenant.</p>
          </div>
        </div>

        <div className="footer-cols">
          <div>
            <h4>Product</h4>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </div>
          <div>
            <h4>Company</h4>
            <span>About</span>
            <span>Contact</span>
          </div>
          <div>
            <h4>Legal</h4>
            <span>Privacy</span>
            <span>Terms</span>
          </div>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} Nyumba Property Management. Built for Kenyan landlords.</span>
      </div>

      <style>{`
        .site-footer { border-top: 1px solid var(--color-border); background: var(--color-surface); margin-top: 64px; }
        .footer-inner { display: flex; flex-wrap: wrap; gap: 40px; justify-content: space-between; padding: 48px 24px 32px 24px; }
        .footer-brand { display: flex; gap: 12px; max-width: 280px; }
        .footer-brand .brand-mark {
          display: inline-flex; align-items: center; justify-content: center; flex: none;
          width: 32px; height: 32px; border-radius: 8px; background: var(--color-brand); color: var(--color-on-brand);
          font-family: var(--font-display); font-size: 15px;
        }
        .footer-brand strong { font-family: var(--font-display); font-size: 17px; }
        .footer-brand p { font-size: 13px; margin: 4px 0 0 0; }
        .footer-cols { display: flex; gap: 48px; flex-wrap: wrap; }
        .footer-cols h4 { font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-text-faint); margin-bottom: 12px; }
        .footer-cols div { display: flex; flex-direction: column; gap: 8px; }
        .footer-cols a, .footer-cols span { font-size: 13.5px; color: var(--color-text-muted); }
        .footer-cols a:hover { color: var(--color-brand); }
        .footer-bottom { padding: 18px 24px; border-top: 1px solid var(--color-border); font-size: 12.5px; color: var(--color-text-faint); }
      `}</style>
    </footer>
  );
}
