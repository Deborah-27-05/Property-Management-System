import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';

const KES = (n) => `KSh ${Number(n).toLocaleString('en-KE')}`;

export default function PropertyCard({ property }) {
  const occupancyPct = property.units > 0 ? Math.round((property.occupiedUnits / property.units) * 100) : 0;

  return (
    <Link to={`/properties/${property.id}`} className="property-card">
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

      <style>{`
        .property-card {
          display: block; background: var(--color-surface); border: 1px solid var(--color-border);
          border-top: 3px solid ${property.status === 'Active' ? 'var(--color-brand)' : 'var(--color-warning)'};
          border-radius: var(--radius-lg); padding: 20px;
          transition: box-shadow 0.15s ease, border-color 0.15s ease, transform 0.15s ease;
        }
        .property-card:hover { box-shadow: var(--shadow-md); border-color: var(--color-brand); transform: translateY(-2px); }
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
      `}</style>
    </Link>
  );
}