import { useLocation } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Sidebar from './Sidebar.jsx';

const sidebarPaths = new Set([
  '/',
  '/tasks',
  '/projects',
  '/workspace',
  '/skills',
  '/collection',
  '/achievements',
  '/shop',
]);

export default function AppLayout({ children }) {
  const location = useLocation();
  const isSidebarRoute =
    sidebarPaths.has(location.pathname) || /^\/projects\/[^/]+$/.test(location.pathname);

  return (
    <div className="min-h-screen text-slate-100">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {isSidebarRoute ? (
          <div className="flex gap-6">
            <Sidebar />
            <div className="min-w-0 flex-1">{children}</div>
          </div>
        ) : (
          children
        )}
      </main>
    </div>
  );
}
