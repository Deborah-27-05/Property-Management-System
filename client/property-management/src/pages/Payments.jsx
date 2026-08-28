import { useMemo, useState } from 'react';
import StatCard from '../components/StatCard';
import PaymentTable from '../components/PaymentTable';
import Button from '../components/Button';
import Modal from '../components/Modal';
import PaymentForm from './forms/PaymentForm';
import { useAppData } from '../context/AppDataContext';

const KES = (n) => `KSh ${Number(n).toLocaleString('en-KE')}`;

export default function Payments() {
  const { payments, tenants, properties, units } = useAppData();
  const [statusFilter, setStatusFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);

  const getTenantName = (id) => tenants.find((t) => t.id === id)?.fullName || '—';
  const getPropertyName = (id) => properties.find((p) => p.id === id)?.name || '—';
  const getUnitNumber = (id) => units.find((u) => u.id === id)?.unitNumber || '—';

  const summary = useMemo(() => {
    const expected = payments.reduce((sum, p) => sum + p.amount, 0);
    const collected = payments.filter((p) => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0);
    const outstanding = expected - collected;
    const overdue = payments.filter((p) => p.status === 'Overdue').length;
    return { expected, collected, outstanding, overdue };
  }, [payments]);

  const filtered = useMemo(() => {
    if (statusFilter === 'All') return payments;
    return payments.filter((p) => p.status === statusFilter);
  }, [payments, statusFilter]);

  return (
    <div className="payments-page">
      <div className="page-toolbar">
        <div>
          <h1>Payments</h1>
          <p>Track rent collection across every property.</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>+ Record Payment</Button>
      </div>

      <div className="stat-grid">
        <StatCard label="Expected Rent" value={KES(summary.expected)} tone="info" icon="📋" />
        <StatCard label="Total Collected" value={KES(summary.collected)} tone="success" icon="💰" />
        <StatCard label="Outstanding Amount" value={KES(summary.outstanding)} tone="danger" />
        <StatCard label="Overdue Payments" value={summary.overdue} tone="plum" />
      </div>

      <div className="toolbar-controls">
        <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} aria-label="Filter by status">
          <option value="All">All statuses</option>
          <option value="Paid">Paid</option>
          <option value="Outstanding">Outstanding</option>
          <option value="Overdue">Overdue</option>
          <option value="Partial">Partial</option>
        </select>
      </div>

      <PaymentTable
        payments={filtered}
        getTenantName={getTenantName}
        getPropertyName={getPropertyName}
        getUnitNumber={getUnitNumber}
        onAddClick={() => setModalOpen(true)}
      />

      <Modal title="Record Payment" isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <PaymentForm onDone={() => setModalOpen(false)} />
      </Modal>

      <style>{`
        .page-toolbar { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 18px; gap: 12px; flex-wrap: wrap; }
        .page-toolbar h1 { font-size: 24px; margin-bottom: 4px; }
        .page-toolbar p { margin: 0; font-size: 14px; }
        .stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 22px; }
        .toolbar-controls { display: flex; gap: 12px; margin-bottom: 18px; flex-wrap: wrap; }
        .filter-select {
          border: 1px solid var(--color-border); border-radius: var(--radius-sm); padding: 10px 12px; font-size: 14px;
          background: var(--color-surface); color: var(--color-text);
        }
        @media (max-width: 1100px) { .stat-grid { grid-template-columns: 1fr 1fr; } }
      `}</style>
    </div>
  );
}
