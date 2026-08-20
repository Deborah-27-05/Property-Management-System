const ICONS = {
  default: '🏢',
  accent: '🔑',
  danger: '⚠',
  success: '✓',
  info: '📊',
  plum: '🛠',
};

export default function StatCard({ label, value, tone = 'default', suffix, icon }) {
  return (
    <div className={`stat-card tone-${tone}`}>
      <div className="stat-icon" aria-hidden="true">{icon || ICONS[tone] || ICONS.default}</div>
      <div className="stat-label">{label}</div>
      <div className="stat-value">
        {value}
        {suffix ? <span className="stat-suffix">{suffix}</span> : null}
      </div>

      <style>{`
        .stat-card {
          position: relative;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: 18px 20px;
          overflow: hidden;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .stat-card::before {
          content: ''; position: absolute; inset: 0 0 auto 0; height: 3px;
          background: var(--gradient-brand);
        }
        .stat-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
        .stat-card.tone-accent::before { background: var(--gradient-accent); }
        .stat-card.tone-danger::before { background: linear-gradient(120deg, var(--color-danger), #D9694F); }
        .stat-card.tone-success::before { background: linear-gradient(120deg, var(--color-success), #4CA870); }
        .stat-card.tone-info::before { background: linear-gradient(120deg, var(--color-info), #4C88B8); }
        .stat-card.tone-plum::before { background: linear-gradient(120deg, var(--color-plum), #8D6A9C); }
        .stat-icon {
          display: inline-flex; align-items: center; justify-content: center;
          width: 34px; height: 34px; border-radius: 9px; font-size: 15px; margin-bottom: 12px;
          background: var(--color-brand-tint);
        }
        .stat-card.tone-accent .stat-icon { background: #FBF2DE; }
        .stat-card.tone-danger .stat-icon { background: var(--color-danger-bg); }
        .stat-card.tone-success .stat-icon { background: var(--color-success-bg); }
        .stat-card.tone-info .stat-icon { background: var(--color-info-bg); }
        .stat-card.tone-plum .stat-icon { background: var(--color-plum-bg); }
        .stat-label {
          font-size: 12.5px; color: var(--color-text-muted); font-weight: 600;
          margin-bottom: 6px;
        }
        .stat-value {
          font-family: var(--font-mono); font-size: 26px; font-weight: 600;
          color: var(--color-text); font-variant-numeric: tabular-nums;
        }
        .stat-suffix { font-size: 14px; color: var(--color-text-faint); margin-left: 4px; }
      `}</style>
    </div>
  );
}