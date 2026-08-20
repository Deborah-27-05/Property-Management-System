import { useMemo, useState } from 'react';
import MaintenanceCard from '../components/MaintenanceCard';
import EmptyState from '../components/EmptyState';
import Button from '../components/Button';
import Modal from '../components/Modal';
import MaintenanceForm from './forms/MaintenanceForm';
import { useAppData } from '../context/AppDataContext';

export default function Maintenance() {
  const { maintenanceRequests, properties, units, tenants, updateMaintenanceStatus } = useAppData();
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);

  const getPropertyName = (id) => properties.find((p) => p.id === id)?.name || '—';
  const getUnitNumber = (id) => units.find((u) => u.id === id)?.unitNumber || '—';
  const getTenantName = (id) => (id ? tenants.find((t) => t.id === id)?.fullName : null);

  const filtered = useMemo(() => {
    return maintenanceRequests.filter((m) => {
      const matchesPriority = priorityFilter === 'All' || m.priority === priorityFilter;
      const matchesStatus = statusFilter === 'All' || m.status === statusFilter;
      return matchesPriority && matchesStatus;
    });
  }, [maintenanceRequests, priorityFilter, statusFilter]);

  return (
    <div className="maintenance-page">
      <div className="page-toolbar">
        <div>
          <h1>Maintenance</h1>
          <p>{maintenanceRequests.filter((m) => m.status !== 'Resolved').length} open request(s) across all properties</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>+ Add Maintenance Request</Button>
      </div>

      <div className="toolbar-controls">
        <select className="filter-select" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} aria-label="Filter by priority">
          <option value="All">All priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} aria-label="Filter by status">
          <option value="All">All statuses</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No maintenance requests found"
          description={maintenanceRequests.length === 0 ? 'Log your first maintenance request to start tracking repairs.' : 'Try a different filter.'}
          actionLabel="Add Maintenance Request"
          onAction={() => setModalOpen(true)}
        />
      ) : (
        <div className="maintenance-grid">
          {filtered.map((m) => (
            <MaintenanceCard
              key={m.id}
              request={m}
              propertyName={getPropertyName(m.propertyId)}
              unitNumber={getUnitNumber(m.unitId)}
              tenantName={getTenantName(m.tenantId)}
              onStatusChange={updateMaintenanceStatus}
            />
          ))}
        </div>
      )}

      <Modal title="Add Maintenance Request" isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <MaintenanceForm onDone={() => setModalOpen(false)} />
      </Modal>

      <style>{`
        .page-toolbar { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 18px; gap: 12px; flex-wrap: wrap; }
        .page-toolbar h1 { font-size: 24px; margin-bottom: 4px; }
        .page-toolbar p { margin: 0; font-size: 14px; }
        .toolbar-controls { display: flex; gap: 12px; margin-bottom: 22px; flex-wrap: wrap; }
        .filter-select {
          border: 1px solid var(--color-border); border-radius: var(--radius-sm); padding: 10px 12px; font-size: 14px;
          background: var(--color-surface); color: var(--color-text);
        }
        .maintenance-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
        @media (max-width: 750px) { .maintenance-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}