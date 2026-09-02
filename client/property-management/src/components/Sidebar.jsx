import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = [
  ['Dashboard', '/dashboard', '▦'],
  ['Properties', '/properties', '⌂'],
  ['Tenants', '/tenants', '♙'],
  ['Payments', '/payments', '◈'],
  ['Maintenance', '/maintenance', '⚒'],
  ['Profile', '/profile', '◉'],
];

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const itemClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
      isActive ? 'bg-white text-indigo-700 shadow-sm' : 'text-indigo-100 hover:bg-white/10 hover:text-white'
    }`;

  return (
    <>
      {isOpen && <button aria-label="Close navigation" onClick={onClose} className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden" />}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-gradient-to-b from-indigo-950 via-indigo-900 to-violet-900 p-5 text-white shadow-2xl transition-transform lg:static lg:translate-x-0 lg:shadow-none ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="mb-9 flex items-center justify-between px-2">
          <NavLink to="/dashboard" className="flex items-center gap-3 text-xl font-extrabold tracking-tight" onClick={onClose}>
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-400 text-base text-amber-950 shadow-lg shadow-amber-500/20">N</span>
            Nyumba
          </NavLink>
          <button onClick={onClose} className="rounded-lg p-2 text-indigo-200 hover:bg-white/10 lg:hidden" aria-label="Close navigation">×</button>
        </div>
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[.2em] text-indigo-300">Workspace</p>
        <nav className="space-y-1">
          {links.map(([label, to, icon]) => <NavLink key={to} to={to} className={itemClass} onClick={onClose}><span className="w-5 text-center text-base">{icon}</span>{label}</NavLink>)}
        </nav>
        <div className="mt-auto rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-amber-400 font-bold text-amber-950">{user?.email?.charAt(0).toUpperCase() || 'U'}</div>
            <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{user?.email || 'Property Manager'}</p></div>
          </div>
          <button onClick={logout} className="mt-3 w-full rounded-lg bg-white/10 px-3 py-2 text-xs font-bold text-indigo-100 transition hover:bg-white/20">Sign out</button>
        </div>
      </aside>
    </>
  );
}
