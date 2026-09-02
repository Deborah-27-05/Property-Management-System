import StatusBadge from './StatusBadge';
import EmptyState from './EmptyState';

const KES = (n) => `KSh ${Number(n).toLocaleString('en-KE')}`;

export default function TenantTable({ tenants, getPropertyName, getUnitNumber, onAddClick, onEdit, onDelete }) {
  if (tenants.length === 0) {
    return (
      <EmptyState
        title="No tenants found"
        description="Try a different search or filter, or add your first tenant."
        actionLabel={onAddClick ? 'Add Tenant' : undefined}
        onAction={onAddClick}
      />
    );
  }

  const handleDelete = (tenant) => {
    if (window.confirm(`Delete tenant "${tenant.fullName}"? This also removes their payment and unit records.`)) {
      onDelete?.(tenant.id);
    }
  };

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>Tenant</th>
            <th>Phone</th>
            <th>Property</th>
            <th>Unit</th>
            <th>Monthly Rent</th>
            <th>Payment Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tenants.map((t) => (
            <tr key={t.id}>
              <td>{t.fullName}</td>
              <td>{t.phone}</td>
              <td>{getPropertyName(t.propertyId)}</td>
              <td>{getUnitNumber(t.unitId)}</td>
              <td className="num">{KES(t.monthlyRent)}</td>
              <td><StatusBadge status={t.paymentStatus} /></td>
              <td>
                <div className="row-actions">
                  <button type="button" className="row-btn" onClick={() => onEdit?.(t)}>Edit</button>
                  <button type="button" className="row-btn row-btn-danger" onClick={() => handleDelete(t)}>Delete</button>
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