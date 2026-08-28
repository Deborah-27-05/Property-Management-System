const STATUS_MAP = {
  Paid: 'success',
  Active: 'success',
  Resolved: 'success',
  Occupied: 'info',
  'In Progress': 'plum',
  Partial: 'clay',
  Pending: 'warning',
  'Under Renovation': 'warning',
  Open: 'warning',
  Outstanding: 'danger',
  Overdue: 'danger',
  Vacant: 'neutral',
  High: 'danger',
  Medium: 'clay',
  Low: 'neutral',
};

export default function StatusBadge({ status }) {
  const tone = STATUS_MAP[status] || 'neutral';
  return (
    <span className={`status-badge ${tone}`}>
      <span className="dot" style={{ background: 'currentColor' }} />
      {status}
    </span>
  );
}