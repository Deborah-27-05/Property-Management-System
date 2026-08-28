import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="not-found-page">
      <span className="eyebrow">404</span>
      <h1>Page not found</h1>
      <p>The page you're looking for doesn't exist or may have moved.</p>
      <Link to="/" className="btn btn-primary">Back to Home</Link>

      <style>{`
        .not-found-page {
          min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center;
          text-align: center; padding: 24px; gap: 6px; background: var(--color-bg);
        }
        .not-found-page h1 { font-size: 30px; }
        .not-found-page p { max-width: 360px; margin-bottom: 18px; }
      `}</style>
    </div>
  );
}