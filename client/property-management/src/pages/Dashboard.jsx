import { useEffect, useMemo, useState } from 'react';
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

const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast?latitude=-1.286389&longitude=36.817223&current=temperature_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&timezone=Africa%2FNairobi';

const weatherDetails = (code) => {
  if (code === 0) return { label: 'Clear sky', icon: '☀️' };
  if ([1, 2].includes(code)) return { label: 'Partly cloudy', icon: '🌤️' };
  if (code === 3) return { label: 'Overcast', icon: '☁️' };
  if ([45, 48].includes(code)) return { label: 'Foggy', icon: '🌫️' };
  if ([51, 53, 55, 56, 57].includes(code)) return { label: 'Drizzle', icon: '🌦️' };
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return { label: 'Rainy', icon: '🌧️' };
  if ([71, 73, 75, 77, 85, 86].includes(code)) return { label: 'Snowy', icon: '❄️' };
  if ([95, 96, 99].includes(code)) return { label: 'Thunderstorms', icon: '⛈️' };
  return { label: 'Current conditions', icon: '🌡️' };
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { properties, tenants, payments, maintenanceRequests } = useAppData();
  const [activeModal, setActiveModal] = useState(null);
  const [weather, setWeather] = useState(null);
  const [weatherError, setWeatherError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadWeather() {
      try {
        const response = await fetch(WEATHER_URL, { signal: controller.signal });
        if (!response.ok) throw new Error('Weather request failed');
        const data = await response.json();
        if (!data.current) throw new Error('Weather data is unavailable');
        setWeather(data.current);
      } catch (error) {
        if (error.name !== 'AbortError') setWeatherError(true);
      }
    }

    loadWeather();
    return () => controller.abort();
  }, []);

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
  const weatherStatus = weather ? weatherDetails(weather.weather_code) : null;

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

      <section className="weather-card card card-pad" aria-live="polite">
        <div>
          <p className="weather-eyebrow">Live weather · Nairobi</p>
          <h3>Plan maintenance with current conditions</h3>
          {weatherError ? (
            <p className="weather-message">Weather data is unavailable right now. Please try again later.</p>
          ) : !weather ? (
            <p className="weather-message">Loading current weather…</p>
          ) : (
            <div className="weather-reading">
              <span className="weather-icon" aria-hidden="true">{weatherStatus.icon}</span>
              <strong>{Math.round(weather.temperature_2m)}°C</strong>
              <span>{weatherStatus.label}</span>
              <span>Feels like {Math.round(weather.apparent_temperature)}°C</span>
              <span>Wind {Math.round(weather.wind_speed_10m)} km/h</span>
              <span>Rain {weather.precipitation} mm</span>
            </div>
          )}
        </div>
        <a href="https://open-meteo.com/" target="_blank" rel="noreferrer" className="weather-source">
          Data: Open-Meteo ↗
        </a>
      </section>

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
        .weather-card { display: flex; align-items: center; justify-content: space-between; gap: 18px; margin-bottom: 20px; background: linear-gradient(120deg, #eff6ff, #f8fafc); }
        .weather-eyebrow { margin: 0 0 4px; color: var(--color-text-muted); font-size: 12px; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; }
        .weather-card h3 { margin: 0; font-size: 16px; }
        .weather-reading { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 14px; margin-top: 12px; font-size: 13px; color: var(--color-text-muted); }
        .weather-reading strong { color: var(--color-text); font-size: 24px; }
        .weather-icon { font-size: 26px; }
        .weather-message { margin: 12px 0 0; color: var(--color-text-muted); font-size: 13px; }
        .weather-source { color: var(--color-primary); font-size: 12px; font-weight: 700; white-space: nowrap; }
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
        @media (max-width: 520px) { .stat-grid { grid-template-columns: 1fr; } .weather-card { align-items: flex-start; flex-direction: column; } }
      `}</style>
    </div>
  );
}
