import { useMemo, useState } from 'react';
import SearchBar from '../components/SearchBar';
import TenantTable from '../components/TenantTable';
import Button from '../components/Button';
import Modal from '../components/Modal';
import TenantForm from './forms/TenantForm';
import { useAppData } from '../context/AppDataContext';

export default function Tenants() {
  const { tenants, properties, units } = useAppData();
  const [search, setSearch] = useState('');
  const [propertyFilter, setPropertyFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);

  const getPropertyName = (id) => properties.find((p) => p.id === id)?.name || '—';
  const getUnitNumber = (unitId) => units.find((u) => u.id === unitId)?.unitNumber || '—';

  const filtered = useMemo(() => {
    return tenants.filter((t) => {
      const matchesSearch = t.fullName.toLowerCase().includes(search.toLowerCase());
      const matchesProperty = propertyFilter === 'All' || t.propertyId === propertyFilter;
      const matchesStatus = statusFilter === 'All' || t.paymentStatus === statusFilter;
      return matchesSearch && matchesProperty && matchesStatus;
    });
  }, [tenants, search, propertyFilter, statusFilter]);

  return (
    <div className="tenants-page">
      <div className="page-toolbar">
        <div>
          <h1>Tenants</h1>
          <p>{tenants.length} tenant{tenants.length === 1 ? '' : 's'} across all properties</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>+ Add Tenant</Button>
      </div>

      <div className="toolbar-controls">
        <SearchBar value={search} onChange={setSearch} placeholder="Search tenant by name…" />
        <select className="filter-select" value={propertyFilter} onChange={(e) => setPropertyFilter(e.target.value)} aria-label="Filter by property">
          <option value="All">All properties</option>
          {properties.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} aria-label="Filter by payment status">
          <option value="All">All payment statuses</option>
          <option value="Paid">Paid</option>
          <option value="Outstanding">Outstanding</option>
          <option value="Overdue">Overdue</option>
          <option value="Partial">Partial</option>
        </select>
      </div>

      <TenantTable
        tenants={filtered}
        getPropertyName={getPropertyName}
        getUnitNumber={getUnitNumber}
        onAddClick={() => setModalOpen(true)}
      />

      <Modal title="Add Tenant" isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <TenantForm onDone={() => setModalOpen(false)} />
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
      `}</style>
    </div>
  );
}
