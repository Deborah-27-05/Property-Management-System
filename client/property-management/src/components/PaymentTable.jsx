import StatusBadge from './StatusBadge';
import EmptyState from './EmptyState';

const KES = (n) => `KSh ${Number(n).toLocaleString('en-KE')}`;

export default function PaymentTable({ payments, getTenantName, getPropertyName, getUnitNumber, onAddClick }) {
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}