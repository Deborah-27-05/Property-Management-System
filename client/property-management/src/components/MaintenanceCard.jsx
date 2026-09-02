import { useState } from 'react';
import StatusBadge from './StatusBadge';

const PRIORITY_COLOR = {
  High: 'var(--color-danger)',
  Medium: 'var(--color-clay)',
  Low: 'var(--color-text-faint)',
};

export default function MaintenanceCard({ request, propertyName, unitNumber, tenantName, onStatusChange, onEdit, onDelete }) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onDelete?.(request.id);
    } finally {
      setDeleting(false);
      setConfirming(false);
    }
  };

  return (
    <div className="maintenance-card" style={{ borderTop: `3px solid ${PRIORITY_COLOR[request.priority] || 'var(--color-border)'}` }}>
      <div className="mc-top">
        <div>
          <span className="mc-id">#{request.id}</span>
          <h4>{request.issueTitle}</h4>
        </div>
        <StatusBadge status={request.priority} />
      </div>

      {request.description ? <p className="mc-desc">{request.description}</p> : null}

      <div className="mc-meta">
        <span>📍 {propertyName} · Unit {unitNumber}</span>
        {tenantName ? <span>👤 {tenantName}</span> : null}
        <span>🗓 Reported {request.dateReported}</span>
      </div>

      <div className="mc-bottom">
        <StatusBadge status={request.status} />
        {onStatusChange ? (
          <select
            className="mc-status-select"
            value={request.status}
            onChange={(e) => onStatusChange(request.id, e.target.value)}
            aria-label={`Change status for request ${request.id}`}
          >
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        ) : null}
      </div>

      <div className="mc-actions">
        {confirming ? (
          <>
            <span className="mc-confirm-text">Delete this request?</span>
            <button type="button" className="mc-btn mc-btn-danger" onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Deleting…' : 'Yes, delete'}
            </button>
            <button type="button" className="mc-btn" onClick={() => setConfirming(false)}>Cancel</button>
          </>
        ) : (
          <>
            <button type="button" className="mc-btn" onClick={() => onEdit?.(request)}>Edit</button>
            <button type="button" className="mc-btn mc-btn-danger" onClick={() => setConfirming(true)}>Delete</button>
          </>
        )}
      </div>

      <style>{`
        .maintenance-card {
          background: var(--color-surface); border: 1px solid var(--color-border);
          border-radius: var(--radius-lg); padding: 18px 20px;
        }
        .mc-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; }
        .mc-id { font-family: var(--font-mono); font-size: 12px; color: var(--color-text-faint); }
        .mc-top h4 { margin: 2px 0 0 0; font-size: 16px; font-family: var(--font-body); font-weight: 700; }
        .mc-desc { font-size: 13.5px; margin: 10px 0; }
        .mc-meta { display: flex; flex-wrap: wrap; gap: 4px 16px; font-size: 12.5px; color: var(--color-text-muted); margin-bottom: 14px; }
        .mc-bottom { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding-top: 14px; border-top: 1px solid var(--color-border); }
        .mc-status-select {
          border: 1px solid var(--color-border); border-radius: var(--radius-sm); font-size: 13px;
          padding: 6px 8px; background: var(--color-surface); color: var(--color-text);
        }
        .mc-actions { display: flex; align-items: center; gap: 8px; margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--color-border); flex-wrap: wrap; }
        .mc-btn {
          border: 1px solid var(--color-border); background: var(--color-surface); color: var(--color-text-muted);
          border-radius: var(--radius-sm); padding: 5px 10px; font-size: 12px; font-weight: 600; cursor: pointer;
        }
        .mc-btn:hover { background: var(--color-surface-sunken); }
        .mc-btn-danger { border-color: var(--color-danger); color: var(--color-danger); }
        .mc-btn-danger:hover { background: var(--color-danger-bg); }
        .mc-confirm-text { font-size: 12px; color: var(--color-text-muted); margin-right: 4px; }
      `}</style>
    </div>
  );
}