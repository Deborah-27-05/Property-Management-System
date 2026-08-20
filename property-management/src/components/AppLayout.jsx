import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

const TITLES = {
  '/dashboard': 'Dashboard',
  '/properties': 'Properties',
  '/tenants': 'Tenants',
  '/payments': 'Payments',
  '/maintenance': 'Maintenance',
  '/profile': 'Profile',
};

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const pageTitle =
    TITLES[location.pathname] ||
    (location.pathname.startsWith('/properties/') ? 'Property Details' : 'Nyumba');

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur lg:hidden">
          <button
            className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-slate-50 text-lg text-slate-700"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation menu"
          >
            ☰
          </button>
          <h2 className="m-0 text-base font-bold">{pageTitle}</h2>
        </div>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

    </div>
  );
}
