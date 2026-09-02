import StatusBadge from './StatusBadge';
import EmptyState from './EmptyState';

const KES = (n) => `KSh ${Number(n).toLocaleString('en-KE')}`;

export default function PaymentTable({ payments, getTenantName, getPropertyName, getUnitNumber, onAddClick, onEdit, onDelete }) {
  if (payments.length === 0) {
    return (
      <EmptyState
        title="No payments found"
        description="Try a different filter, or record your first payment."
        actionLabel={onAddClick ? 'Record Payment' : undefined}
        onAction={onAddClick}
      />
    );
  }

  const handleDelete = (payment) => {
    if (window.confirm(`Delete this payment of ${KES(payment.amount)}?`)) {
      onDelete?.(payment.id);
    }
  };

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>Tenant</th>
            <th>Property</th>
            <th>Unit</th>
            <th>Amount</th>
            <th>Due Date</th>
            <th>Payment Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p.id}>
              <td>{getTenantName(p.tenantId)}</td>
              <td>{getPropertyName(p.propertyId)}</td>
              <td>{getUnitNumber(p.unitId)}</td>
              <td className="num">{KES(p.amount)}</td>
              <td>{p.dueDate}</td>
              <td>{p.paymentDate || '—'}</td>
              <td><StatusBadge status={p.status} /></td>
              <td>
                <div className="row-actions">
                  <button type="button" className="row-btn" onClick={() => onEdit?.(p)}>Edit</button>
                  <button type="button" className="row-btn row-btn-danger" onClick={() => handleDelete(p)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <style>{`
        .row-actions { display: flex; gap: 6px; }
        .row-btn {
          border: 1px solid var(--color-border); background: var(--color-surface); color: var(--color-text-muted);
          border-radius: var(--radius-sm); padding: 5px 10px; font-size: 12px; font-weight: 600; cursor: pointer;
        }
        .row-btn:hover { background: var(--color-surface-sunken); }
        .row-btn-danger { border-color: var(--color-danger); color: var(--color-danger); }
        .row-btn-danger:hover { background: var(--color-danger-bg); }
      `}</style>
    </div>
  );
}