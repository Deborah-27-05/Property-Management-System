export default function EmptyState({ title, description, actionLabel, onAction }) {
  return (
    <div className="empty-state">
      <div className="empty-icon" aria-hidden="true">▦</div>
      <h3>{title}</h3>
      {description ? <p>{description}</p> : null}
      {actionLabel && onAction ? (
        <button className="btn btn-primary" onClick={onAction}>{actionLabel}</button>
      ) : null}

      <style>{`
        .empty-state {
          text-align: center; padding: 56px 24px;
          border: 1px dashed var(--color-border); border-radius: var(--radius-lg);
          background: var(--color-surface);
        }
        .empty-icon {
          font-size: 30px; color: var(--color-text-faint); margin-bottom: 12px;
        }
        .empty-state h3 { margin-bottom: 6px; }
        .empty-state p { max-width: 360px; margin: 0 auto 18px auto; }
      `}</style>
    </div>
  );
}