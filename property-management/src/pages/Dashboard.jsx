import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { useAppData } from '../context/AppDataContext';
import PropertyForm from './forms/PropertyForm';
import TenantForm from './forms/TenantForm';
import PaymentForm from './forms/PaymentForm';
import MaintenanceForm from './forms/MaintenanceForm';

const KES = (n) => `KSh ${Number(n).toLocaleString('en-KE')}`;

export default function Dashboard() {
  const navigate = useNavigate();
  const { properties, tenants, payments, maintenanceRequests } = useAppData();
  const [activeModal, setActiveModal] = useState(null);

  const stats = useMemo(() => {
    const totalUnits = properties.reduce((sum, p) => sum + p.units, 0);
    const occupiedUnits = properties.reduce((sum, p) => sum + p.occupiedUnits, 0);
    const vacantUnits = totalUnits - occupiedUnits;
    const rentCollected = payments
      .filter((p) => p.status === 'Paid')
      .reduce((sum, p) => sum + p.amount, 0);
    const outstandingRent = payments
      .filter((p) => p.status !== 'Paid')
      .reduce((sum, p) => sum + p.amount, 0);
    const openMaintenance = maintenanceRequests.filter((m) => m.status !== 'Resolved').length;

    return { totalProperties: properties.length, totalUnits, occupiedUnits, vacantUnits, rentCollected, outstandingRent, openMaintenance };
  }, [properties, payments, maintenanceRequests]);

  const getTenantName = (id) => tenants.find((t) => t.id === id)?.fullName || '—';
  const getPropertyName = (id) => properties.find((p) => p.id === id)?.name || '—';
  const recentPayments = payments.slice(0, 5);
  const recentMaintenance = maintenanceRequests.slice(0, 4);

  return (
    <div className="dashboard-page">
      <div className="dash-header">
        <div>
          <h1>Dashboard</h1>
          <p>A snapshot of every property, tenant, and repair right now.</p>
        </div>
      </div>

      <div className="stat-grid">
        <StatCard label="Total Properties" value={stats.totalProperties} icon="🏢" />
        <StatCard label="Total Units" value={stats.totalUnits} tone="info" icon="🚪" />
        <StatCard label="Occupied Units" value={stats.occupiedUnits} tone="success" />
        <StatCard label="Vacant Units" value={stats.vacantUnits} tone="accent" icon="🔑" />
        <StatCard label="Rent Collected" value={KES(stats.rentCollected)} tone="success" icon="💰" />
        <StatCard label="Outstanding Rent" value={KES(stats.outstandingRent)} tone="danger" />
        <StatCard label="Open Maintenance" value={stats.openMaintenance} tone="plum" />
      </div>

      <div className="quick-actions">
        <Button variant="secondary" size="sm" onClick={() => setActiveModal('property')}>+ Add Property</Button>
        <Button variant="secondary" size="sm" onClick={() => setActiveModal('tenant')}>+ Add Tenant</Button>
        <Button variant="secondary" size="sm" onClick={() => setActiveModal('payment')}>+ Record Payment</Button>
        <Button variant="secondary" size="sm" onClick={() => setActiveModal('maintenance')}>+ Maintenance Request</Button>
      </div>

      <div className="dash-grid">
        <section className="card card-pad">
          <div className="section-head">
            <h3>Recent Payments</h3>
            <Button variant="ghost" size="sm" onClick={() => navigate('/payments')}>View all</Button>
          </div>
          <div className="table-wrap" style={{ border: 'none' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Tenant</th>
                  <th>Property</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentPayments.map((p) => (
                  <tr key={p.id}>
                    <td>{getTenantName(p.tenantId)}</td>
                    <td>{getPropertyName(p.propertyId)}</td>
                    <td className="num">{KES(p.amount)}</td>
                    <td>{p.paymentDate || p.dueDate}</td>
                    <td><StatusBadge status={p.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="card card-pad">
          <div className="section-head">
            <h3>Maintenance Overview</h3>
            <Button variant="ghost" size="sm" onClick={() => navigate('/maintenance')}>View all</Button>
          </div>
          <div className="mini-maintenance-list">
            {recentMaintenance.map((m) => (
              <div className="mini-row" key={m.id}>
                <div>
                  <strong>{m.issueTitle}</strong>
                  <span>{getPropertyName(m.propertyId)}</span>
                </div>
                <div className="mini-row-badges">
                  <StatusBadge status={m.priority} />
                  <StatusBadge status={m.status} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Modal title="Add Property" isOpen={activeModal === 'property'} onClose={() => setActiveModal(null)}>
        <PropertyForm onDone={() => setActiveModal(null)} />
      </Modal>
      <Modal title="Add Tenant" isOpen={activeModal === 'tenant'} onClose={() => setActiveModal(null)}>
        <TenantForm onDone={() => setActiveModal(null)} />
      </Modal>
      <Modal title="Record Payment" isOpen={activeModal === 'payment'} onClose={() => setActiveModal(null)}>
        <PaymentForm onDone={() => setActiveModal(null)} />
      </Modal>
      <Modal title="Create Maintenance Request" isOpen={activeModal === 'maintenance'} onClose={() => setActiveModal(null)}>
        <MaintenanceForm onDone={() => setActiveModal(null)} />
      </Modal>

      <style>{`
        .dash-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 22px; flex-wrap: wrap; gap: 12px; }
        .dash-header h1 { font-size: 26px; margin-bottom: 4px; }
        .dash-header p { margin: 0; font-size: 14px; }
        .stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 22px; }
        .quick-actions { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 28px; }
        .dash-grid { display: grid; grid-template-columns: 1.3fr 1fr; gap: 20px; align-items: start; }
        .section-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
        .section-head h3 { margin: 0; font-size: 16px; }
        .mini-maintenance-list { display: flex; flex-direction: column; gap: 12px; }
        .mini-row {
          display: flex; align-items: center; justify-content: space-between; gap: 10px;
          padding: 12px 14px; border: 1px solid var(--color-border); border-radius: var(--radius-md);
        }
        .mini-row strong { display: block; font-size: 13.5px; }
        .mini-row span { display: block; font-size: 12px; color: var(--color-text-muted); margin-top: 2px; }
        .mini-row-badges { display: flex; flex-direction: column; gap: 4px; align-items: flex-end; }

        @media (max-width: 1100px) { .stat-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 900px) { .dash-grid { grid-template-columns: 1fr; } }
        @media (max-width: 520px) { .stat-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
