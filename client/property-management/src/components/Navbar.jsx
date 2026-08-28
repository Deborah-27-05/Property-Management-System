import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="public-nav">
      <div className="container public-nav-inner">
        <Link to="/" className="brand">
          <span className="brand-mark">N</span> Nyumba
        </Link>
        <nav className="public-nav-links">
          <Link to="/login" className="btn btn-ghost">Login</Link>
          <Link to="/register" className="btn btn-primary">Register</Link>
        </nav>
      </div>

      <style>{`
        .public-nav {
          position: sticky; top: 0; z-index: 20;
          background: rgba(250, 250, 247, 0.9); backdrop-filter: blur(8px);
          border-bottom: 1px solid var(--color-border);
        }
        .public-nav-inner { display: flex; align-items: center; justify-content: space-between; padding: 16px 24px; }
        .brand { display: flex; align-items: center; gap: 10px; font-family: var(--font-display); font-weight: 600; font-size: 20px; }
        .brand-mark {
          display: inline-flex; align-items: center; justify-content: center;
          width: 32px; height: 32px; border-radius: 8px; background: var(--color-brand); color: var(--color-on-brand);
          font-size: 15px;
        }
        .public-nav-links { display: flex; gap: 10px; }
        @media (max-width: 480px) {
          .brand span:last-child { display: none; }
        }
      `}</style>
    </header>
  );
}