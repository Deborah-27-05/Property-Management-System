import StatusBadge from './StatusBadge';
import EmptyState from './EmptyState';

const KES = (n) => `KSh ${Number(n).toLocaleString('en-KE')}`;

export default function TenantTable({ tenants, getPropertyName, getUnitNumber, onAddClick }) {
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}