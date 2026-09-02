import { useState } from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import { useAppData } from '../context/AppDataContext';

const KES = (n) => `KSh ${Number(n).toLocaleString('en-KE')}`;

export default function PropertyCard({ property, onEdit }) {
  const { deleteProperty } = useAppData();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const occupancyPct = property.units > 0 ? Math.round((property.occupiedUnits / property.units) * 100) : 0;

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleting(true);
    try {
      await deleteProperty(property.id);
    } finally {
      setDeleting(false);
      setConfirming(false);
    }
  };

  return (
    <div className="property-card">
      <Link to={`/properties/${property.id}`} className="pc-link">
        <div className="pc-top">
          <h3>{property.name}</h3>
          <StatusBadge status={property.status} />
        </div>
        <p className="pc-location">📍 {property.location}</p>

        <div className="pc-occupancy">
          <div className="pc-occupancy-bar">
            <div className="pc-occupancy-fill" style={{ width: `${occupancyPct}%` }} />
          </div>
          <span>{property.occupiedUnits}/{property.units} units occupied</span>
        </div>

        <div className="pc-stats">
          <div>
            <span className="pc-stat-label">Vacant</span>
            <span className="pc-stat-value">{property.vacantUnits}</span>
          </div>
          <div>
            <span className="pc-stat-label">Expected rent</span>
            <span className="pc-stat-value">{KES(property.monthlyRent)}</span>
          </div>
        </div>
      </Link>

      <div className="pc-actions">
        {confirming ? (
          <>
            <span className="pc-confirm-text">Delete this property?</span>
            <button type="button" className="pc-btn pc-btn-danger" onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Deleting…' : 'Yes, delete'}
            </button>
            <button type="button" className="pc-btn" onClick={(e) => { e.preventDefault(); setConfirming(false); }}>
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className="pc-btn"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit?.(property); }}
            >
              Edit
            </button>
            <button
              type="button"
              className="pc-btn pc-btn-danger"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setConfirming(true); }}
            >
              Delete
            </button>
          </>
        )}
      </div>

      <style>{`
        .property-card {
          background: var(--color-surface); border: 1px solid var(--color-border);
          border-top: 3px solid ${property.status === 'Active' ? 'var(--color-brand)' : 'var(--color-warning)'};
          border-radius: var(--radius-lg); padding: 20px;
          transition: box-shadow 0.15s ease, border-color 0.15s ease, transform 0.15s ease;
        }
        .property-card:hover { box-shadow: var(--shadow-md); border-color: var(--color-brand); transform: translateY(-2px); }
        .pc-link { display: block; }
        .pc-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; }
        .pc-top h3 { font-size: 18px; margin-bottom: 2px; }
        .pc-location { font-size: 13.5px; margin: 6px 0 16px 0; }
        .pc-occupancy-bar {
          height: 6px; border-radius: 4px; background: var(--color-surface-sunken); overflow: hidden;
        }
        .pc-occupancy-fill { height: 100%; background: var(--gradient-brand); }
        .pc-occupancy span { display: block; font-size: 12.5px; color: var(--color-text-muted); margin-top: 6px; }
        .pc-stats {
          display: flex; justify-content: space-between; margin-top: 16px; padding-top: 16px;
          border-top: 1px solid var(--color-border);
        }
        .pc-stat-label { display: block; font-size: 11.5px; color: var(--color-text-faint); font-weight: 600; text-transform: uppercase; letter-spacing: 0.03em; }
        .pc-stat-value { display: block; font-family: var(--font-mono); font-weight: 600; margin-top: 3px; }
        .pc-actions {
          display: flex; align-items: center; gap: 8px; margin-top: 14px; padding-top: 14px;
          border-top: 1px solid var(--color-border); flex-wrap: wrap;
        }
        .pc-btn {
          border: 1px solid var(--color-border); background: var(--color-surface); color: var(--color-text-muted);
          border-radius: var(--radius-sm); padding: 6px 12px; font-size: 12.5px; font-weight: 600; cursor: pointer;
        }
        .pc-btn:hover { background: var(--color-surface-sunken); }
        .pc-btn-danger { border-color: var(--color-danger); color: var(--color-danger); }
        .pc-btn-danger:hover { background: var(--color-danger-bg); }
        .pc-confirm-text { font-size: 12.5px; color: var(--color-text-muted); margin-right: 4px; }
      `}</style>
    </div>
  );
}