import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';
import Button from '../components/Button';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import TenantForm from './forms/TenantForm';
import { useAppData } from '../context/AppDataContext';

const KES = (n) => `KSh ${Number(n).toLocaleString('en-KE')}`;

export default function PropertyDetails() {
  const { id } = useParams();
  const { properties, units, tenants } = useAppData();
  const [modalOpen, setModalOpen] = useState(false);

  const property = properties.find((p) => p.id === id);
  const propertyUnits = units.filter((u) => u.propertyId === id);

  if (!property) {
    return (
      <EmptyState
        title="Property not found"
        description="This property may have been removed, or the link is invalid."
        actionLabel="Back to Properties"
        onAction={() => {}}
      />
    );
  }

  const getTenantName = (tenantId) => tenants.find((t) => t.id === tenantId)?.fullName || '—';

  return (
    <div className="property-details-page">
      <Link to="/properties" className="back-link">← Back to Properties</Link>

      <div className="pd-header card card-pad">
        <div className="pd-header-top">
          <div>
            <h1>{property.name}</h1>
            <p className="pd-location">📍 {property.location}</p>
          </div>
          <StatusBadge status={property.status} />
        </div>

        {property.description ? <p className="pd-description">{property.description}</p> : null}

        <div className="pd-stat-row">
          <div><span>Total Units</span><strong>{property.units}</strong></div>
          <div><span>Occupied</span><strong>{property.occupiedUnits}</strong></div>
          <div><span>Vacant</span><strong>{property.vacantUnits}</strong></div>
          <div><span>Expected Rent</span><strong>{KES(property.monthlyRent)}</strong></div>
        </div>
      </div>

      <div className="pd-units-header">
        <h2>Units</h2>
        <Button size="sm" onClick={() => setModalOpen(true)}>+ Add Tenant to This Property</Button>
      </div>

      {propertyUnits.length === 0 ? (
        <EmptyState title="No units recorded yet" description="Add a tenant to create the first unit for this property." />
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Unit Number</th>
                <th>Tenant</th>
                <th>Monthly Rent</th>
                <th>Payment Status</th>
                <th>Occupancy</th>
              </tr>
            </thead>
            <tbody>
              {propertyUnits.map((u) => (
                <tr key={u.id}>
                  <td>{u.unitNumber}</td>
                  <td>{u.tenantId ? getTenantName(u.tenantId) : '—'}</td>
                  <td className="num">{KES(u.monthlyRent)}</td>
                  <td>{u.paymentStatus !== '—' ? <StatusBadge status={u.paymentStatus} /> : '—'}</td>
                  <td><StatusBadge status={u.occupancyStatus} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal title="Add Tenant" isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <TenantForm onDone={() => setModalOpen(false)} defaultPropertyId={property.id} />
      </Modal>

      <style>{`
        .back-link { display: inline-block; font-size: 13.5px; color: var(--color-text-muted); margin-bottom: 16px; font-weight: 600; }
        .back-link:hover { color: var(--color-brand); }
        .pd-header { margin-bottom: 28px; }
        .pd-header-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
        .pd-header-top h1 { font-size: 24px; margin-bottom: 4px; }
        .pd-location { margin: 0; font-size: 14px; }
        .pd-description { margin: 16px 0 0 0; font-size: 14.5px; }
        .pd-stat-row {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-top: 22px; padding-top: 20px;
          border-top: 1px solid var(--color-border);
        }
        .pd-stat-row span { display: block; font-size: 12px; color: var(--color-text-faint); font-weight: 600; text-transform: uppercase; letter-spacing: 0.03em; }
        .pd-stat-row strong { display: block; font-family: var(--font-mono); font-size: 18px; margin-top: 4px; }
        .pd-units-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; flex-wrap: wrap; gap: 10px; }
        .pd-units-header h2 { font-size: 18px; margin: 0; }
        @media (max-width: 620px) { .pd-stat-row { grid-template-columns: 1fr 1fr; } }
      `}</style>
    </div>
  );
}
