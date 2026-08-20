import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const FEATURES = [
  { icon: '🏢', tone: 'brand', title: 'Properties & units', text: 'Track every building, block, and unit with occupancy at a glance.' },
  { icon: '👤', tone: 'info', title: 'Tenant records', text: 'Keep contact details, leases, and payment status in one profile.' },
  { icon: '💳', tone: 'accent', title: 'Rent & payments', text: 'See who has paid, who is overdue, and how much is outstanding.' },
  { icon: '🛠', tone: 'plum', title: 'Maintenance requests', text: 'Log issues, set priority, and track them through to resolved.' },
];

const BENEFITS = [
  'Replace notebooks and scattered spreadsheets with one dashboard',
  'Spot unpaid rent and vacant units before they cost you money',
  'Give every property, tenant, and repair a clear paper trail',
  'Built to grow into a full accounts and tenant portal system',
];

export default function Home() {
  return (
    <div className="home-page">
      <Navbar />

      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-copy">
            <span className="eyebrow">Property management, organized</span>
            <h1>Run every property from one calm, clear dashboard.</h1>
            <p className="hero-lede">
              Nyumba brings your properties, units, tenants, rent, and maintenance requests
              out of notebooks and scattered spreadsheets and into a single system built for
              landlords and property managers.
            </p>
            <div className="hero-actions">
              <Link to="/register" className="btn btn-accent">Get Started Free</Link>
              <Link to="/login" className="btn btn-secondary">Login to Dashboard</Link>
            </div>
          </div>

          <div className="hero-panel" aria-hidden="true">
            <div className="hero-panel-row">
              <div className="hp-stat">
                <span>Occupied Units</span>
                <strong>22/35</strong>
              </div>
              <div className="hp-stat">
                <span>Outstanding Rent</span>
                <strong>KSh 79,000</strong>
              </div>
            </div>
            <div className="hero-panel-list">
              <div className="hp-row"><span className="hp-dot success" />Achieng Otieno — Paid</div>
              <div className="hp-row"><span className="hp-dot danger" />Wafula Simiyu — Overdue</div>
              <div className="hp-row"><span className="hp-dot warning" />Kevin Mwangi — Partial</div>
            </div>
          </div>
        </div>
      </section>

      <section className="problem">
        <div className="container">
          <span className="eyebrow">The problem</span>
          <h2>Notebooks and messages don't scale past a few units.</h2>
          <p className="section-lede">
            Most property managers track rent, tenants, and repairs across notebooks, receipts,
            spreadsheets, and phone messages. It works for a while — until it becomes hard to
            answer simple questions: who owes rent this month, which units are vacant, and what
            maintenance is still open.
          </p>
        </div>
      </section>

      <section className="benefits">
        <div className="container benefits-inner">
          <div>
            <span className="eyebrow">Why Nyumba</span>
            <h2>One organized place for the work you're already doing.</h2>
          </div>
          <ul>
            {BENEFITS.map((b) => (
              <li key={b}>
                <span className="check" aria-hidden="true">✓</span>
                {b}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <span className="eyebrow">Main features</span>
          <h2>Everything a property manager checks daily.</h2>
          <div className="feature-grid">
            {FEATURES.map((f) => (
              <div className="feature-card" key={f.title}>
                <div className={`feature-icon tone-${f.tone}`} aria-hidden="true">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container cta-inner">
          <h2>Bring your properties into one dashboard today.</h2>
          <p>No card required for this demo — create an account and explore with sample data.</p>
          <Link to="/register" className="btn btn-accent">Create Free Account</Link>
        </div>
      </section>

      <Footer />

      <style>{`
        .hero { padding: 64px 0 80px 0; background: var(--gradient-hero-bg); position: relative; overflow: hidden; }
        .hero-inner { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 48px; align-items: center; position: relative; z-index: 1; }
        .hero-copy h1 {
          font-size: 44px; margin: 12px 0 18px 0; max-width: 560px;
          background: linear-gradient(120deg, var(--color-brand-dark) 40%, var(--color-brand) 100%);
          -webkit-background-clip: text; background-clip: text; color: transparent;
        }
        .hero-lede { font-size: 16.5px; max-width: 480px; }
        .hero-actions { display: flex; gap: 12px; margin-top: 24px; flex-wrap: wrap; }

        .hero-panel {
          background: var(--color-surface); border: 1px solid var(--color-border);
          border-radius: var(--radius-lg); box-shadow: var(--shadow-lg); padding: 24px;
        }
        .hero-panel-row { display: flex; gap: 16px; margin-bottom: 18px; }
        .hp-stat {
          flex: 1; background: var(--color-surface-sunken); border-radius: var(--radius-md); padding: 14px 16px;
        }
        .hp-stat span { display: block; font-size: 12px; color: var(--color-text-muted); margin-bottom: 6px; }
        .hp-stat strong { font-family: var(--font-mono); font-size: 19px; }
        .hero-panel-list { display: flex; flex-direction: column; gap: 10px; }
        .hp-row {
          display: flex; align-items: center; gap: 10px; font-size: 13.5px; padding: 10px 12px;
          border: 1px solid var(--color-border); border-radius: var(--radius-sm);
        }
        .hp-dot { width: 8px; height: 8px; border-radius: 50%; flex: none; }
        .hp-dot.success { background: var(--color-success); }
        .hp-dot.danger { background: var(--color-danger); }
        .hp-dot.warning { background: var(--color-warning); }

        .problem { padding: 72px 0 8px 0; }
        .problem h2, .benefits h2, .features h2 { font-size: 30px; max-width: 640px; }
        .section-lede { max-width: 640px; font-size: 15.5px; }

        .benefits { padding: 72px 0; }
        .benefits-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: start; }
        .benefits ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 14px; }
        .benefits li { display: flex; gap: 12px; font-size: 15px; color: var(--color-text); align-items: flex-start; }
        .check {
          display: inline-flex; align-items: center; justify-content: center; flex: none;
          width: 22px; height: 22px; border-radius: 50%; background: var(--gradient-accent); color: #2A2000;
          font-size: 12px; font-weight: 700; margin-top: 1px;
        }

        .features { padding: 40px 0 88px 0; }
        .feature-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-top: 32px; }
        .feature-card {
          background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg);
          padding: 22px 20px; transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
        }
        .feature-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); border-color: var(--color-brand); }
        .feature-icon {
          display: inline-flex; align-items: center; justify-content: center;
          width: 42px; height: 42px; border-radius: 11px; font-size: 19px; margin-bottom: 14px;
          background: var(--color-brand-tint);
        }
        .feature-icon.tone-info { background: var(--color-info-bg); }
        .feature-icon.tone-accent { background: #FBF2DE; }
        .feature-icon.tone-plum { background: var(--color-plum-bg); }
        .feature-card h3 { font-size: 16px; margin-bottom: 6px; }
        .feature-card p { font-size: 13.5px; margin: 0; }

        .cta { background: var(--gradient-brand); color: var(--color-on-brand); padding: 64px 0; }
        .cta-inner { text-align: center; }
        .cta h2 { color: var(--color-on-brand); font-size: 28px; max-width: 560px; margin: 0 auto 10px auto; }
        .cta p { color: rgba(250,250,247,0.78); max-width: 460px; margin: 0 auto 24px auto; }

        @media (max-width: 900px) {
          .hero-inner { grid-template-columns: 1fr; }
          .benefits-inner { grid-template-columns: 1fr; }
          .feature-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 560px) {
          .hero-copy h1 { font-size: 32px; }
          .feature-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
