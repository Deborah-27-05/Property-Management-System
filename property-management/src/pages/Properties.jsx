import { useMemo, useState } from 'react';
import PropertyCard from '../components/PropertyCard';
import SearchBar from '../components/SearchBar';
import EmptyState from '../components/EmptyState';
import Button from '../components/Button';
import Modal from '../components/Modal';
import PropertyForm from './forms/PropertyForm';
import { useAppData } from '../context/AppDataContext';

export default function Properties() {
  const { properties } = useAppData();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = useMemo(() => {
    return properties.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.location.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [properties, search, statusFilter]);

  return (
    <div className="properties-page">
      <div className="page-toolbar">
        <div>
          <h1>Properties</h1>
          <p>{properties.length} propert{properties.length === 1 ? 'y' : 'ies'} under management</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>+ Add Property</Button>
      </div>

      <div className="toolbar-controls">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by name or location…" />
        <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} aria-label="Filter by status">
          <option value="All">All statuses</option>
          <option value="Active">Active</option>
          <option value="Under Renovation">Under Renovation</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No properties found"
          description={properties.length === 0 ? 'Add your first property to get started.' : 'Try a different search or filter.'}
          actionLabel="Add Property"
          onAction={() => setModalOpen(true)}
        />
      ) : (
        <div className="property-grid">
          {filtered.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      )}

      <Modal title="Add Property" isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <PropertyForm onDone={() => setModalOpen(false)} />
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
        .property-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
        @media (max-width: 1000px) { .property-grid { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 620px) { .property-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
